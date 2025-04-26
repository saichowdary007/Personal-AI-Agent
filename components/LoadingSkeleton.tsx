import React from 'react';

const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 ${className}`}></div>
);

export default LoadingSkeleton;

/*
Key Points:
- Simple skeleton for loading states.
- Accepts className for sizing.
- Uses Tailwind for animation and color.
*/
