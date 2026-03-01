import React, { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number; // milliseconds per character
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, speed = 60 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!text) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const displayed = text.slice(0, index);

  return <span>{displayed}</span>;
};
