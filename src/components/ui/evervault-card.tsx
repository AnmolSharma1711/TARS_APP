import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import "./evervault-card.css";

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <div
      className={`evervault-card-wrapper ${className || ""}`}
      onMouseMove={onMouseMove}
    >
      <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
      <div className="evervault-card-content">
        {text && <span className="evervault-card-text">{text}</span>}
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="card-pattern-wrapper">
      <div className="card-pattern-background">
        <p className="card-pattern-text">{randomString}</p>
      </div>
      <motion.div
        className="card-pattern-overlay"
        style={style}
      >
        <p className="card-pattern-text-gradient">{randomString}</p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
