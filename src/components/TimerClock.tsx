"use client";

import React, { useEffect, useState } from "react";

// Counts down to a real sale end date. Renders nothing once the sale is over,
// so shoppers never see a fake or looping deadline.
const TimerClock = ({ endsAt }: { endsAt: string }) => {
  const end = new Date(endsAt).getTime();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(Math.max(0, end - Date.now()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [end]);

  if (timeLeft === null || !Number.isFinite(timeLeft) || timeLeft <= 0) return null;

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <p className="font-extrabold tabular-nums text-white" aria-label="Time left in sale">
      {days > 0 ? `${days}d ` : ""}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </p>
  );
};

export default TimerClock;
