import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['hsl(var(--primary))', 'hsl(var(--accent-foreground))', 'hsl(var(--chart-3))'];
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < 30; i++) {
      newPieces.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        duration: `${2 + Math.random() * 1}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setPieces(newPieces);

    // Remove confetti after animation
    const timeout = setTimeout(() => {
      setPieces([]);
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 opacity-70 animate-fall"
          style={{
            left: piece.left,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
