import { useState } from "react";

const posts = [
  {
    id: 1,
    user: "Player_01",
    game: "Elden Ring",
    review: "One of the best RPG experiences I've ever played.",
    rating: "9.5/10",
    likes: 124,
  },
  {
    id: 2,
    user: "Player_02",
    game: "Cyberpunk 2077",
    review: "The Phantom Liberty expansion completely changed the game.",
    rating: "9/10",
    likes: 89,
  },
  {
    id: 3,
    user: "Player_03",
    game: "Hades",
    review: "Perfect gameplay loop and amazing soundtrack!",
    rating: "10/10",
    likes: 156,
  },
];

const gamers = [
  "RPGMaster",
  "PixelQueen",
  "NoScopePro",
  "IndieHunter",
];

export default function Community() {
  const [feed, setFeed] = useState(posts);

  const likePost = (id) => {
    setFeed(
      feed.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  return (
    <div style={{ background: "#111827", minHeight: "100vh", color: "white", padding: 30 }}>
      <h1 style={{ fontSize: 32 }}>Community</h1>
      <p style={{ color: "#9CA3AF", marginBottom: 30 }}>
        Discover reviews and connect with gamers.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div>
          {feed.map((post) => (
            <div
              key={post.id}
              style={{
                background: "#1F2937",
                borderRadius: 14,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <h3>{post.user}</h3>
              <p style={{ color: "#A78BFA" }}>{post.game}</p>
              <p>{post.review}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <strong>{post.rating}</strong>

                <button
                  onClick={() => likePost(post.id)}
                  style={{
                    background: "#8B5CF6",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  ❤️ {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#1F2937",
            borderRadius: 14,
            padding: 20,
            height: "fit-content",
          }}
        >
          <h3>Suggested Gamers</h3>

          {gamers.map((gamer) => (
            <div
              key={gamer}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 18,
                alignItems: "center",
              }}
            >
              <span>{gamer}</span>

              <button
                style={{
                  background: "#374151",
                  color: "white",
                  border: "1px solid #6B7280",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}