'use client';

import { useState, useEffect } from 'react';

type ScoreGaugeProps = {
  score: number; // 0 to 1
  color: string;
};

export function ScoreGauge({ score, color }: ScoreGaugeProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the gauge on mount/update
    const timer = requestAnimationFrame(() => setProgress(score));
    return () => cancelAnimationFrame(timer);
  }, [score]);
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
      <svg className="h-full w-full" viewBox="0 0 200 200">
        <circle
          className="text-secondary"
          strokeWidth="15"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
        />
        <circle
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl sm:text-3xl md:text-4xl font-bold text-foreground">
          {Math.round(score * 100)}
          <span className="text-xl sm:text-xl md:text-2xl text-muted-foreground">%</span>
        </span>
      </div>
    </div>
  );
}
