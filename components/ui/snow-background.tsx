'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export function SnowBackground() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflake = (): Snowflake => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 4 + 3, // Increased size
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.6, // Higher opacity
    });

    // More snowflakes
    const initialSnowflakes = Array.from({ length: 100 }, createSnowflake);
    setSnowflakes(initialSnowflakes);

    const animationFrame = setInterval(() => {
      setSnowflakes(prevSnowflakes => 
        prevSnowflakes.map(flake => {
          if (flake.y > window.innerHeight) {
            return createSnowflake();
          }
          return {
            ...flake,
            y: flake.y + flake.speed,
            x: flake.x + Math.sin(flake.y * 0.01) * 0.5,
          };
        })
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white shadow-lg"
          style={{
            left: `${flake.x}px`,
            top: `${flake.y}px`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            filter: 'blur(0.5px)',
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
}