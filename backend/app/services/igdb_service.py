import copy
import logging
import threading
import time
from collections import OrderedDict
from typing import Any, Dict, List, Optional, Tuple

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
IGDB_GAMES_URL = "https://api.igdb.com/v4/games"

# httpx applies this to connect, read, write and pool-acquire separately.
HTTP_TIMEOUT = httpx.Timeout(10.0)

TOKEN_EXPIRY_MARGIN_SECONDS = 60

SEARCH_CACHE_TTL_SECONDS = 300
SEARCH_CACHE_MAX_ENTRIES = 256

# --------------------------------------------------------------------------
# Shared HTTP client (connection pooling / keep-alive)
# --------------------------------------------------------------------------

_client_lock = threading.Lock()
_client = None  # type: Optional[httpx.Client]


def _get_client() -> httpx.Client:
    """Lazily create one client and reuse it. httpx.Client is thread-safe."""
    global _client
    client = _client
    if client is not None:
        return client

    with _client_lock:
        if _client is None:
            _client = httpx.Client(
                timeout=HTTP_TIMEOUT,
                limits=httpx.Limits(
                    max_connections=20,
                    max_keepalive_connections=10,
                ),
            )
        return _client


def close_http_client() -> None:
    """Optional: call from an app shutdown hook to close pooled connections."""
    global _client
    with _client_lock:
        client, _client = _client, None
    if client is not None:
        client.close()


# --------------------------------------------------------------------------
# Twitch token
# --------------------------------------------------------------------------

_token_lock = threading.Lock()
_cached_token = None  # type: Optional[str]
_token_expires_at = 0.0  # time.monotonic() based

_search_cache_lock = threading.Lock()
# type: OrderedDict[Tuple[str, int], Tuple[float, List[Dict[str, Any]]]]
_search_cache = OrderedDict()


def _token_is_valid() -> bool:
    return bool(_cached_token) and time.monotonic() < _token_expires_at


def get_access_token() -> str:
    global _cached_token, _token_expires_at

    if _token_is_valid():
        return _cached_token  # type: ignore[return-value]

    with _token_lock:
        # Another thread may have refreshed while we waited for the lock.
        if _token_is_valid():
            return _cached_token  # type: ignore[return-value]

        started = time.perf_counter()
        try:
            response = _get_client().post(
                TWITCH_TOKEN_URL,
                data={
                    "client_id": settings.igdb_client_id,
                    "client_secret": settings.igdb_client_secret,
                    "grant_type": "client_credentials",
                },
            )
            response.raise_for_status()
            result = response.json()
        finally:
            logger.info(
                "twitch_token_request took %.3fs",
                time.perf_counter() - started,
            )

        _cached_token = result["access_token"]
        _token_expires_at = (
            time.monotonic()
            + float(result["expires_in"])
            - TOKEN_EXPIRY_MARGIN_SECONDS
        )
        return _cached_token


def _invalidate_token(bad_token: str) -> None:
    """Drop the cached token, but only if it is still the one that failed."""
    global _cached_token, _token_expires_at
    with _token_lock:
        if _cached_token == bad_token:
            _cached_token = None
            _token_expires_at = 0.0


# --------------------------------------------------------------------------
# IGDB request helper
# --------------------------------------------------------------------------

def _igdb_request(body: bytes, operation: str) -> List[Dict[str, Any]]:
    """POST to IGDB. Retries once with a fresh token if IGDB returns 401."""
    for attempt in (1, 2):
        token = get_access_token()

        started = time.perf_counter()
        try:
            response = _get_client().post(
                IGDB_GAMES_URL,
                content=body,
                headers={
                    "Client-ID": settings.igdb_client_id,
                    "Authorization": "Bearer {}".format(token),
                    "Accept": "application/json",
                    "Content-Type": "text/plain",
                },
            )
            if response.status_code == 401 and attempt == 1:
                _invalidate_token(token)
                continue
            response.raise_for_status()
            return response.json()
        finally:
            logger.info(
                "igdb_request op=%s attempt=%d took %.3fs",
                operation,
                attempt,
                time.perf_counter() - started,
            )

    raise RuntimeError("unreachable")  # pragma: no cover


# --------------------------------------------------------------------------
# Formatting
# --------------------------------------------------------------------------

def _format_game(game: Dict[str, Any]) -> Dict[str, Any]:
    cover = game.get("cover")
    cover_url = None

    if cover and cover.get("url"):
        cover_url = cover["url"].replace(
            "t_thumb",
            "t_cover_big_2x",
        ).replace(
            "//",
            "https://",
            1,
        )

    return {
        "external_id": str(game["id"]),
        "title": game.get("name"),
        "summary": game.get("summary"),
        "cover_url": cover_url,
        "release_date": game.get("first_release_date"),
        "rating": game.get("rating"),
        "genres": [
            genre["name"]
            for genre in game.get("genres", [])
        ],
    }


def _escape_apicalypse_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


# --------------------------------------------------------------------------
# Search result cache (in-process, prototype-grade)
# --------------------------------------------------------------------------

def _cache_get(key: Tuple[str, int]) -> Optional[List[Dict[str, Any]]]:
    now = time.monotonic()
    with _search_cache_lock:
        entry = _search_cache.get(key)
        if entry is None:
            return None
        expires_at, value = entry
        if now >= expires_at:
            del _search_cache[key]
            return None
        _search_cache.move_to_end(key)
        return copy.deepcopy(value)


def _cache_set(key: Tuple[str, int], value: List[Dict[str, Any]]) -> None:
    with _search_cache_lock:
        _search_cache[key] = (
            time.monotonic() + SEARCH_CACHE_TTL_SECONDS,
            copy.deepcopy(value),
        )
        _search_cache.move_to_end(key)
        while len(_search_cache) > SEARCH_CACHE_MAX_ENTRIES:
            _search_cache.popitem(last=False)  # evict least recently used


# --------------------------------------------------------------------------
# Public API
# --------------------------------------------------------------------------

def search_games(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    normalized = query.strip()
    if not normalized:
        return []  # nothing to search for; skip both external calls

    cache_key = (normalized.lower(), limit)
    cached = _cache_get(cache_key)
    if cached is not None:
        logger.info("search_games cache hit q=%r", normalized)
        return cached

    body = (
        f'search "{_escape_apicalypse_string(normalized)}"; '
        "fields id,name,summary,cover.url,first_release_date,rating,genres.name; "
        f"limit {int(limit)};"
    ).encode()

    games = _igdb_request(body, "search")
    results = [_format_game(game) for game in games]

    _cache_set(cache_key, results)
    return results


def get_game(external_id: str) -> Dict[str, Any]:
    external_id = external_id.strip()
    if not external_id.isdigit():
        raise ValueError("Game not found")

    body = (
        "fields id,name,summary,cover.url,first_release_date,"
        "rating,genres.name; "
        f"where id = {external_id};"
    ).encode()

    games = _igdb_request(body, "get_game")

    if not games:
        raise ValueError("Game not found")

    return _format_game(games[0])
