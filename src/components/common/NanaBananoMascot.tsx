import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../hooks/useTheme';

const BANANA_JOKES = [
  "Orange you glad I didn't say banana? 🍌",
  "Time flies like an arrow, fruit flies like a banana! ⏰🍌",
  "Remember to clock out or I'll go bananas! 🍌🤪",
  "Split shift? More like Banana Split! 🍨🍌",
  "You are doing an a-peeling job today! 🌟🍌",
  "Mauritius is beautiful, but bananas make it mind-blowing! 🇲🇺🍌",
  "Nana Banano is keeping watch on your timesheet! 👀🍌",
  "Going bananas at work? Take a break! ☕🍌",
  "Don't slip on your tasks today! 🍌💪",
  "Nana Banano says: Stay positive and stay ripe! ☀️🍌"
];

export function NanaBananoMascot() {
  const { theme } = useTheme();
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  // Auto-hide bubble after 5 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  if (theme !== 'banano') return null;

  const handleClick = () => {
    // Fire banana-colored confetti!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#FFE135', '#FFF3A7', '#D4AF37', '#8B5A2B', '#FFFFFF'],
    });

    // Select random joke
    const randomIndex = Math.floor(Math.random() * BANANA_JOKES.length);
    setBubbleText(BANANA_JOKES[randomIndex]);
    setShowBubble(true);
  };

  return (
    <div
      className="nanabanano-interactive"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        cursor: 'pointer',
        animation: 'nanabanano-float 3s ease-in-out infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Speech Bubble */}
      {showBubble && (
        <div
          style={{
            position: 'absolute',
            bottom: '125px',
            right: '10px',
            background: '#ffffff',
            border: '2px solid #5C4008',
            borderRadius: '12px',
            padding: '10px 14px',
            width: '180px',
            boxShadow: '0 4px 10px rgba(92, 64, 8, 0.15)',
            fontSize: '0.82rem',
            color: '#3d2b05',
            fontWeight: 500,
            lineHeight: 1.4,
            animation: 'nanabanano-pulse 0.3s ease-in-out',
            textAlign: 'center',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '35px',
              width: '12px',
              height: '12px',
              background: '#ffffff',
              borderRight: '2px solid #5C4008',
              borderBottom: '2px solid #5C4008',
              transform: 'rotate(45deg)',
            }}
          />
          {bubbleText}
        </div>
      )}

      {/* Mascot SVG */}
      <div onClick={handleClick} title="Click me! 🍌">
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Banana Body */}
          <path
            d="M20,100 C30,110 50,110 70,90 C90,70 95,40 90,20 C85,15 80,15 75,20 C70,25 70,35 75,45 C80,55 75,70 60,80 C45,90 30,90 20,80"
            fill="#FFD200"
            stroke="#5C4008"
            strokeWidth="2.5"
          />

          {/* Peel left */}
          <path
            d="M35,65 C25,60 15,40 20,25 C23,20 28,25 28,30 C28,35 32,45 38,55"
            fill="#FFEAA7"
            stroke="#5C4008"
            strokeWidth="2"
          />

          {/* Peel right */}
          <path
            d="M65,75 C75,70 85,50 80,35 C77,30 72,35 72,40 C72,45 68,55 62,65"
            fill="#FFEAA7"
            stroke="#5C4008"
            strokeWidth="2"
          />

          {/* Banana Tip (brown) */}
          <path d="M88,18 C90,16 93,17 94,19 C95,21 94,24 92,26 Z" fill="#5C4008" />

          {/* Eyes */}
          <circle cx="58" cy="50" r="3" fill="#3d2b05" />
          <circle cx="70" cy="46" r="3" fill="#3d2b05" />

          {/* Blushes */}
          <circle cx="54" cy="53" r="2.5" fill="#FF8A8A" opacity="0.75" />
          <circle cx="74" cy="48" r="2.5" fill="#FF8A8A" opacity="0.75" />

          {/* Smile */}
          <path d="M61,54 Q64,58 67,52" stroke="#3d2b05" strokeWidth="2" strokeLinecap="round" />

          {/* Tiny Hands */}
          {/* Left waving arm */}
          <path
            d="M48,58 C40,55 35,45 38,40"
            stroke="#3d2b05"
            strokeWidth="2"
            strokeLinecap="round"
            className="nanabanano-arm"
            style={{ transformOrigin: '48px 58px' }}
          />
          {/* Right arm */}
          <path d="M78,54 C85,56 90,62 88,68" stroke="#3d2b05" strokeWidth="2" strokeLinecap="round" />

          {/* Little Legs */}
          <path d="M42,88 C40,94 36,98 32,96" stroke="#3d2b05" strokeWidth="2" strokeLinecap="round" />
          <path d="M58,84 C60,90 64,94 68,92" stroke="#3d2b05" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
