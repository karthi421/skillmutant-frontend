"use client";
import { useState } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MiniCalendar({ activeDates = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));

  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-5 w-[320px]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="text-slate-400 hover:text-white"
        >
          ‹
        </button>

        <p className="text-sm font-medium">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <button
          onClick={nextMonth}
          className="text-slate-400 hover:text-white"
        >
          ›
        </button>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const active = activeDates.includes(dateKey);

          return (
            <div
              key={i}
              className={`h-8 flex items-center justify-center rounded-lg text-sm
                ${
                  active
                    ? "bg-cyan-400 text-black font-semibold"
                    : "bg-white/5 text-slate-300"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
