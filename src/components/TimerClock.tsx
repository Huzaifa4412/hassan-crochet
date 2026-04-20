import React, { useEffect, useState } from "react";

const STORAGE_KEY = "cooldown_end_time";

const getRandomDuration = () => {
  const min = 2 * 60 * 60 * 1000; // 2 hours
  const max = 7 * 60 * 60 * 1000; // 7 hours
  return Math.floor(Math.random() * (max - min)) + min;
};

const TimerClock = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    let endTime: number;
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = parseInt(saved, 10);

      // 🔥 Check if expired
      if (Date.now() > parsed) {
        endTime = Date.now() + getRandomDuration();
        localStorage.setItem(STORAGE_KEY, endTime.toString());
      } else {
        endTime = parsed;
      }
    } else {
      endTime = Date.now() + getRandomDuration();
      localStorage.setItem(STORAGE_KEY, endTime.toString());
    }

    const updateTimer = () => {
      const diff = endTime - Date.now();

      if (diff <= 0) {
        // 🔥 Auto reset when finished
        endTime = Date.now() + getRandomDuration();
        localStorage.setItem(STORAGE_KEY, endTime.toString());
        setTimeLeft(endTime - Date.now());
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <p className="text-red-500 font-extrabold text-lg">
        {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default TimerClock;