import json
import urllib.parse
import urllib.request
from typing import Any, Dict, List

from app.core.config import settings


TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token"
IGDB_GAMES_URL = "https://api.igdb.com/v4/games"


def get_access_token() -> str:
    data = urllib.parse.urlencode(
        {
            "client_id": settings.igdb_client_id,
            "client_secret": settings.igdb_client_secret,
            "grant_type": "client_credentials",
        }
    ).encode()

    request = urllib.request.Request(
        TWITCH_TOKEN_URL,
        data=data,
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read())

    return result["access_token"]


def _format_game(game: Dict[str, Any]) -> Dict[str, Any]:
    cover = game.get("cover")

    cover_url = None

    if cover and cover.get("url"):
        cover_url = cover["url"].replace(
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


def search_games(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    token = get_access_token()

    body = (
        f'search "{query}"; '
        "fields id,name,summary,cover.url,first_release_date,rating,genres.name; "
        f"limit {limit};"
    ).encode()

    request = urllib.request.Request(
        IGDB_GAMES_URL,
        data=body,
        headers={
            "Client-ID": settings.igdb_client_id,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        games = json.loads(response.read())

    return [_format_game(game) for game in games]


def get_game(external_id: str) -> Dict[str, Any]:
    token = get_access_token()

    body = (
        "fields id,name,summary,cover.url,first_release_date,"
        "rating,genres.name; "
        f"where id = {external_id};"
    ).encode()

    request = urllib.request.Request(
        IGDB_GAMES_URL,
        data=body,
        headers={
            "Client-ID": settings.igdb_client_id,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        games = json.loads(response.read())

    if not games:
        raise ValueError("Game not found")

    return _format_game(games[0])
