import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPieceProps {
  color: string;
  delay: number;
}

const ConfettiPiece = ({ color, delay }: ConfettiPieceProps) => (
  <motion.div
    className="absolute"
    initial={{ 
      top: "50%",
      left: "50%",
      scale: 0,
      opacity: 1
    }}
    animate={{ 
      top: ["50%", `${Math.random() * 20}%`],
      left: ["50%", `${Math.random() * 100}%`],
      scale: [0, 1],
      opacity: [1, 0]
    }}
    transition={{
      duration: 2,
      delay: delay,
      ease: "easeOut"
    }}
    style={{
      width: "8px",
      height: "8px",
      backgroundColor: color,
      borderRadius: "2px",
      transform: `rotate(${Math.random() * 360}deg)`
    }}
  />
);

export const Confetti = () => {
  const colors = ['#34D399', '#60A5FA', '#F472B6', '#FBBF24'];
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    color: colors[i % colors.length],
    delay: i * 0.1
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece, i) => (
        <ConfettiPiece key={i} {...piece} />
      ))}
    </div>
  );
};