"use client";

interface StatsCardsProps {
  todayMinutes: number;
  todayPomodoros: number;
  totalHours: number;
  streak: number;
}

export function StatsCards({
  todayMinutes,
  todayPomodoros,
  totalHours,
  streak,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Today",
      value: `${Math.round(todayMinutes)}m`,
      sub: `${todayPomodoros} pomodoro${todayPomodoros !== 1 ? "s" : ""}`,
      color: "text-red-400",
    },
    {
      label: "Streak",
      value: `${streak}`,
      sub: `day${streak !== 1 ? "s" : ""}`,
      color: "text-orange-400",
    },
    {
      label: "Total",
      value: `${totalHours}h`,
      sub: "focused",
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((card) => (
        <div key={card.label} className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted">{card.label}</p>
          <p className={`text-2xl font-semibold tabular-nums ${card.color}`}>
            {card.value}
          </p>
          <p className="text-[10px] text-muted">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
