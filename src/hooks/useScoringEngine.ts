/**
 * @file useScoringEngine.ts
 * @description Dynamic Multi-Category Scoring Engine with Speed & Streak Multipliers.
 * Implements the scoring logic required by the Summative Assignment rubric.
 * Computes scores across Punctuality, Geofence Accuracy, and Safety Compliance
 * with speed multipliers (time remaining bonus) and streak multipliers (consecutive days).
 */

import { useState, useCallback } from 'react';

/** Performance category score item */
export interface CategoryScore {
  id: string;
  name: string;
  basePoints: number;
  earnedPoints: number;
  passed: boolean;
}

export interface ScoringEngineState {
  categoryScores: CategoryScore[];
  baseScoreTotal: number;
  speedMultiplier: number;
  streakDays: number;
  streakMultiplier: number;
  finalScore: number;
  isTimedOut: boolean;
}

export interface UseScoringEngineReturn {
  scoringState: ScoringEngineState;
  calculateScore: (
    timeRemainingSeconds: number,
    totalDurationSeconds: number,
    streakDays: number,
    passedCategories: Record<string, boolean>
  ) => void;
  handleTimeout: () => void;
  resetScore: () => void;
}

// Initial category benchmarks
const DEFAULT_CATEGORIES: CategoryScore[] = [
  { id: 'punctuality', name: 'Punctuality Check-in', basePoints: 50, earnedPoints: 0, passed: false },
  { id: 'geofence', name: 'GPS Radius Accuracy', basePoints: 30, earnedPoints: 0, passed: false },
  { id: 'compliance', name: 'Safety & Shift Audit', basePoints: 20, earnedPoints: 0, passed: false },
];

/**
 * Custom Hook: useScoringEngine
 */
export function useScoringEngine(initialStreakDays: number = 5): UseScoringEngineReturn {
  const [scoringState, setScoringState] = useState<ScoringEngineState>({
    categoryScores: DEFAULT_CATEGORIES,
    baseScoreTotal: 0,
    speedMultiplier: 1.0,
    streakDays: initialStreakDays,
    streakMultiplier: 1.5,
    finalScore: 0,
    isTimedOut: false,
  });

  /**
   * Calculate Streak Multiplier Factor based on consecutive days
   */
  const getStreakMultiplier = (days: number): number => {
    if (days >= 7) return 2.0;
    if (days >= 5) return 1.5;
    if (days >= 3) return 1.25;
    return 1.0;
  };

  /**
   * Calculate Multi-Category Score with Speed & Streak Multipliers
   */
  const calculateScore = useCallback(
    (
      timeRemainingSeconds: number,
      totalDurationSeconds: number,
      streakDays: number,
      passedCategories: Record<string, boolean>
    ) => {
      // 1. Calculate category base points
      let baseTotal = 0;
      const updatedCategories = DEFAULT_CATEGORIES.map((cat) => {
        const passed = passedCategories[cat.id] ?? true;
        const earned = passed ? cat.basePoints : 0;
        baseTotal += earned;
        return { ...cat, earnedPoints: earned, passed };
      });

      // 2. Calculate Speed Multiplier: 1.0 + (remaining % * 0.5)
      const ratio = Math.max(0, timeRemainingSeconds / Math.max(1, totalDurationSeconds));
      const speedMult = Math.round((1.0 + ratio * 0.5) * 100) / 100;

      // 3. Calculate Streak Multiplier
      const streakMult = getStreakMultiplier(streakDays);

      // 4. Calculate Final Composite Score
      const total = Math.round(baseTotal * speedMult * streakMult);

      setScoringState({
        categoryScores: updatedCategories,
        baseScoreTotal: baseTotal,
        speedMultiplier: speedMult,
        streakDays,
        streakMultiplier: streakMult,
        finalScore: total,
        isTimedOut: false,
      });
    },
    []
  );

  /**
   * Handle Timeout Expiration Penalty
   */
  const handleTimeout = useCallback(() => {
    setScoringState((prev) => ({
      ...prev,
      speedMultiplier: 0.0,
      finalScore: 0,
      isTimedOut: true,
    }));
  }, []);

  /**
   * Reset Scoring Engine state
   */
  const resetScore = useCallback(() => {
    setScoringState({
      categoryScores: DEFAULT_CATEGORIES,
      baseScoreTotal: 0,
      speedMultiplier: 1.0,
      streakDays: initialStreakDays,
      streakMultiplier: getStreakMultiplier(initialStreakDays),
      finalScore: 0,
      isTimedOut: false,
    });
  }, [initialStreakDays]);

  return {
    scoringState,
    calculateScore,
    handleTimeout,
    resetScore,
  };
}
