const stats = [
  { title: "Total Users", value: "1,284" },
  { title: "Games", value: "8,942" },
  { title: "Reviews", value: "3,512" },
  { title: "Reports", value: "23" },
];

const activity = [
  { user: "Player_01", action: "Added Elden Ring", time: "2 min ago" },
  { user: "Player_02", action: "Completed Cyberpunk 2077", time: "10 min ago" },
  { user: "Player_03", action: "Posted a review", time: "18 min ago" },
  { user: "Player_04", action: "Created a collection", time: "1 hr ago" },
];

const genreData = [
  { genre: "RPG", users: 480 },
  { genre: "Action", users: 410 },
  { genre: "Adventure", users: 355 },
  { genre: "Shooter", users: 290 },
  { genre: "Indie", users: 240 },
];

export default function Admin() {
  return (
    <div style={{ background: "#111827", minHeight: "100vh", color: "white", padding: 30 }}>
      <h1 style={{ fontSize: 32 }}>Arcadia Admin Dashboard</h1>
      <p style={{ color: "#9CA3AF", marginBottom: 30 }}>
        Monitor platform activity and statistics.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 20,
        }}
      >
        {stats.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#1F2937",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <p style={{ color: "#9CA3AF", margin: 0 }}>{item.title}</p>
            <h2 style={{ marginTop: 10, fontSize: 28 }}>{item.value}</h2>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Recent Activity</h2>

      <table
        style={{
          width: "100%",
          marginTop: 15,
          borderCollapse: "collapse",
          background: "#1F2937",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#374151" }}>
            <th style={{ padding: 12, textAlign: "left" }}>User</th>
            <th style={{ padding: 12, textAlign: "left" }}>Activity</th>
            <th style={{ padding: 12, textAlign: "left" }}>Time</th>
          </tr>
        </thead>

        <tbody>
          {activity.map((row) => (
            <tr key={row.user + row.time}>
              <td style={{ padding: 12 }}>{row.user}</td>
              <td style={{ padding: 12 }}>{row.action}</td>
              <td style={{ padding: 12, color: "#9CA3AF" }}>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: 40 }}>Top Genres</h2>

<div
  style={{
    background: "#1F2937",
    padding: 20,
    borderRadius: 12,
    marginTop: 15,
  }}
>
  {genreData.map((item) => (
    <div key={item.genre} style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span>{item.genre}</span>
        <span>{item.users}</span>
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#374151",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: `${(item.users / 500) * 100}%`,
            height: "100%",
            background: "#8B5CF6",
            borderRadius: 10,
          }}
        />
      </div>
    </div>
  ))}
</div>
<h2 style={{ marginTop: 40 }}>QA Status</h2>

<div
  style={{
    background: "#1F2937",
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
  }}
>
  {[
    "Login flow tested",
    "Game search verified",
    "Library update working",
    "Profile page responsive",
    "Dark theme consistency",
  ].map((item) => (
    <div
      key={item}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <span style={{ color: "#22C55E", fontSize: 18, marginRight: 10 }}>✔</span>
      <span>{item}</span>
    </div>
  ))}
</div>
    </div>
  );
}