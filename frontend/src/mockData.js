export const featuredGames = [
  { id: '1', title: 'Cyberpunk 2077', genre: 'RPG • Open World', score: '8.9', accent: 'violet', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lb0.jpg' },
  { id: '2', title: 'Elden Ring', genre: 'Action RPG', score: '9.6', accent: 'gold', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg' },
  { id: '3', title: 'Red Dead Redemption 2', genre: 'Adventure • Open World', score: '9.8', accent: 'red', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg' },
  { id: '4', title: 'Hollow Knight', genre: 'Metroidvania', score: '9.1', accent: 'blue', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7l.jpg' },
]

export const librarySeed = [
  { ...featuredGames[0], status: 'Playing', progress: 62 },
  { ...featuredGames[1], status: 'Completed', progress: 100 },
  { ...featuredGames[3], status: 'Backlog', progress: 0 },
]