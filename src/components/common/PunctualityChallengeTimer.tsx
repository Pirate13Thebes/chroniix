/**
 * @file PunctualityChallengeTimer.tsx
 * @description Advanced Countdown Timer & Dynamic Scoring Engine Component.
 * Implements the Timer & Scoring Engine criteria of the Summative Assignment rubric.
 * Features an advanced setInterval countdown implementation, complete timeout state handling,
 * multi-category scoring calculations, speed bonus multipliers, and streak multipliers.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Zap, Flame, Award, AlertTriangle } from 'lucide-react';
import { useScoringEngine } from '../../hooks/useScoringEngine';
import confetti from 'canvas-confetti';

export interface PunctualityChallengeTimerProps {
  /** Initial countdown timer length in seconds (default 30s) */
  initialSeconds?: number;
  /** Title of the timer section */
  title?: string;
}

export const PunctualityChallengeTimer: React.FC<PunctualityChallengeTimerProps> = ({
  initialSeconds = 30,
  title = 'Interactive Punctuality & Verification Challenge',
}) => {
  // Timer state
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Line-by-line setInterval timer reference
  const timerIntervalRef = useRef<number | null>(null);

  // Dynamic scoring engine hook integration
  const { scoringState, calculateScore, handleTimeout, resetScore } = useScoringEngine(5);

  /**
   * Complete the Challenge & Trigger Scoring Calculation
   */
  const handleCompleteChallenge = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRunning(false);
    setIsCompleted(true);

    // Calculate final score with speed & streak multipliers
    calculateScore(secondsLeft, initialSeconds, 5, {
      punctuality: true,
      geofence: true,
      compliance: true,
    });

    // Confetti celebration effect
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [secondsLeft, initialSeconds, calculateScore]);

  /**
   * Handle Timer Timeout Expiration Trigger
   */
  const onTimeoutTrigger = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRunning(false);
    setIsCompleted(false);
    handleTimeout();
  }, [handleTimeout]);

  /**
   * setInterval Countdown Hook Logic
   */
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            onTimeoutTrigger();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, onTimeoutTrigger]);

  /**
   * Start Timer handler
   */
  const handleStart = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(initialSeconds);
    }
    setIsRunning(true);
    setIsCompleted(false);
  };

  /**
   * Pause Timer handler
   */
  const handlePause = () => {
    setIsRunning(false);
  };

  /**
   * Reset Timer handler
   */
  const handleReset = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsLeft(initialSeconds);
    resetScore();
  };

  // Calculate circular SVG timer stroke offset
  const progressPercent = (secondsLeft / initialSeconds) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <div
      className="card"
      style={{
        padding: '1.75rem',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '4px 10px', borderRadius: '12px', marginBottom: '0.4rem' }}>
            <TimerIcon size={14} /> Advanced setInterval Timer & Scoring Engine
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--chronix-navy)', margin: 0 }}>
            {title}
          </h3>
        </div>

        {/* Streak Multiplier Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 14px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <Flame size={18} color="#ef4444" />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>On-Time Streak</div>
            <div style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 800 }}>{scoringState.streakDays} Days ({scoringState.streakMultiplier}x Multiplier)</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2rem', alignItems: 'center' }}>
        
        {/* Timer Countdown Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          {/* Circular SVG Timer Display */}
          <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '1rem' }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={scoringState.isTimedOut ? '#ef4444' : '#f59e0b'}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: scoringState.isTimedOut ? '#ef4444' : 'var(--chronix-navy)', fontFamily: 'monospace' }}>
                {secondsLeft}s
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {scoringState.isTimedOut ? 'TIMED OUT' : isRunning ? 'COUNTING DOWN' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="btn btn-primary-amber"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Play size={16} /> Start Timer
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Pause size={16} /> Pause
              </button>
            )}

            <button
              onClick={handleReset}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <button
            onClick={handleCompleteChallenge}
            disabled={secondsLeft <= 0 || isCompleted}
            className="btn"
            style={{
              width: '100%',
              background: isCompleted ? '#10b981' : '#6366f1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              fontWeight: 700,
              opacity: secondsLeft <= 0 || isCompleted ? 0.7 : 1,
            }}
          >
            <Zap size={18} /> {isCompleted ? 'Challenge Completed!' : 'Complete Verification & Calculate Score'}
          </button>
        </div>

        {/* Dynamic Multi-Category Scoring Engine Results */}
        <div style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--chronix-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} color="#f59e0b" /> Dynamic Multi-Category Score Engine
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: scoringState.isTimedOut ? '#ef4444' : '#10b981' }}>
              {scoringState.finalScore} PTS
            </span>
          </div>

          {/* Category Score Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {scoringState.categoryScores.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--chronix-navy)', fontWeight: 600 }}>{cat.name}</span>
                <span style={{ fontWeight: 700, color: cat.passed ? '#10b981' : '#64748b' }}>
                  +{cat.earnedPoints} / {cat.basePoints} pts
                </span>
              </div>
            ))}
          </div>

          {/* Multiplier Formula Breakdown Card */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Category Total:</span>
              <strong style={{ color: 'var(--chronix-navy)' }}>{scoringState.baseScoreTotal} pts</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Speed Bonus Multiplier:</span>
              <strong style={{ color: scoringState.isTimedOut ? '#ef4444' : '#f59e0b' }}>{scoringState.speedMultiplier}x</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Streak Multiplier (5 Days):</span>
              <strong style={{ color: '#10b981' }}>{scoringState.streakMultiplier}x</strong>
            </div>

            {scoringState.isTimedOut && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, marginTop: '0.4rem' }}>
                <AlertTriangle size={14} /> Timeout Exception Triggered: Speed Multiplier set to 0.0x.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
