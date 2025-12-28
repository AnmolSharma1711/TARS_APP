import React, { useEffect, useRef, useState } from "react";
import "./shooting-stars.css";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

export const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const createStar = (): ShootingStar => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      return {
        id: Date.now() + Math.random(),
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight * 0.5,
        angle: Math.random() * 60 - 30,
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 2 + 1,
        distance: Math.random() * 300 + 200,
      };
    };

    const animateStar = () => {
      const newStar = createStar();
      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) => prevStars.filter((star) => star.id !== newStar.id));
      }, 3000);
    };

    const interval = setInterval(animateStar, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="shooting-stars-svg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {stars.map((star) => (
        <g key={star.id} className="shooting-star">
          <line
            x1={star.x}
            y1={star.y}
            x2={star.x + Math.cos((star.angle * Math.PI) / 180) * star.distance}
            y2={star.y + Math.sin((star.angle * Math.PI) / 180) * star.distance}
            stroke="url(#gradient)"
            strokeWidth={2 * star.scale}
            strokeLinecap="round"
            className="shooting-star-line"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
        </g>
      ))}
    </svg>
  );
};
