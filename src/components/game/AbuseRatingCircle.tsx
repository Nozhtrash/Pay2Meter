import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AbuseRatingCircleProps {
  rating: number; // 0-100
}

export function AbuseRatingCircle({ rating }: AbuseRatingCircleProps) {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rating / 100) * circumference;

  let colorClass = 'text-emerald-500'; // 0-33
  if (rating > 66) {
    colorClass = 'text-red-600'; // 67-100
  } else if (rating > 33) {
    colorClass = 'text-amber-400'; // 34-66
  }

  return (
     <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                    className="text-secondary"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    />
                    <circle
                    className={colorClass}
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${colorClass}`}>
                    {Math.round(rating)}%
                    </span>
                </div>
            </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Abusividad: {rating}% — cuánto exprime este juego la billetera del jugador.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
