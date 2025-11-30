'use client';

import React from 'react';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];

export default function Confetti({ pieces = 24 }: { pieces?: number }) {
    const nodes = Array.from({ length: pieces }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            background: COLORS[i % COLORS.length],
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 0.8}s`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            opacity: 0.95,
        };
        return <span key={i} className="confetti-piece" style={style} />;
    });

    return (
        <>
            <div className="confetti-container" aria-hidden>
                {nodes}
            </div>

            <style jsx>{`
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          top: -10%;
          border-radius: 2px;
          animation: confetti-fall 2.2s linear forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1 }
          60% { opacity: 1 }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0 }
        }
      `}</style>
        </>
    );
}
