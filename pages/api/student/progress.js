export default function handler(req, res) {
  res.status(200).json({
    xp: 840,
    level: 4,
    accuracy: 76,
    quizzesCompleted: 12,
    currentStreak: 5,
    weeklyActivity: [1, 0, 2, 1, 3, 0, 1],
    skills: {
      DSA: 70,
      DBMS: 45,
      OS: 30
    },
    achievements: [
      { id: "first_quiz", unlocked: true },
      { id: "7_day_streak", unlocked: false }
    ]
  });
}
