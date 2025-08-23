'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  isLoading: boolean;
  className?: string;
}

export default function ProgressBar({ isLoading, className = '' }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(90), 600);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 ${className}`}>
      <div 
        className="h-full bg-gray-900 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
