"use client";

import * as React from "react";

export function RealTimeClock() {
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="text-xl font-bold font-mono text-indigo-100 opacity-50">--:--:--</div>;
  }

  const timeString = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col md:items-end">
      <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-wider">
        {timeString}
      </div>
      <div className="text-[10px] sm:text-xs font-semibold text-indigo-300 uppercase tracking-widest mt-1">
        Local Time
      </div>
    </div>
  );
}
