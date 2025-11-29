
import { UserProfile, DailyLog, AthleteStatus } from '../types';

export interface LevelInfo {
  status: AthleteStatus;
  score: number;
  progressToNext: number;
  breakdown: {
    consistency: { score: number; detail: string; };
    performance: { score: number; detail: string; };
    advanced: { score: number; detail: string; };
  };
}

// New 6-Stage Thresholds
const LEVEL_THRESHOLDS = {
  AMATEUR: 0,
  SKILLED: 200,
  SEMI_PRO: 450,
  ADVANCED: 700,
  PRO: 900,
  ELITE: 1100,
};

const MAX_SCORES = {
  CONSISTENCY: 500,
  PERFORMANCE: 500,
  ADVANCED: 300,
};

export const calculateAthleteLevel = (profile: UserProfile, logs: DailyLog[]): LevelInfo => {
  const recentLogs = logs.slice(-30);

  // 1. Consistency Score (0-500 points)
  const workoutDays = recentLogs.filter(log => log.workoutScore > 5).length;
  // Max points for 25 workout days in a month
  const consistencyScore = Math.min((workoutDays / 25) * MAX_SCORES.CONSISTENCY, MAX_SCORES.CONSISTENCY);
  const consistencyDetail = `${workoutDays}/25 ideal workouts in last 30 days.`;

  // 2. Performance Score (0-500 points)
  let performanceScore = 0;
  let performanceDetail = "No recent logs.";
  if (recentLogs.length > 0) {
    const avgWorkoutScore = recentLogs.reduce((sum, log) => sum + log.workoutScore, 0) / recentLogs.length;
    const avgNutritionScore = recentLogs.reduce((sum, log) => sum + log.nutritionScore, 0) / recentLogs.length;
    
    performanceScore = (avgWorkoutScore / 100) * (MAX_SCORES.PERFORMANCE / 2) + (avgNutritionScore / 100) * (MAX_SCORES.PERFORMANCE / 2);
    performanceDetail = `Avg Workout: ${avgWorkoutScore.toFixed(0)}%, Avg Nutrition: ${avgNutritionScore.toFixed(0)}%`;
  }

  // 3. Advanced Metrics Score (0-300 points)
  let advancedScore = 0;
  let advancedDetail = "No advanced data submitted.";
  let advancedDetails = [];
  
  if (profile.advancedHealth) {
    const vo2Score = Math.min((profile.advancedHealth.vo2Max / 65) * 150, 150); // Higher standard for elite
    if(vo2Score > 0) {
      advancedScore += vo2Score;
      advancedDetails.push(`VO2 Max: ${profile.advancedHealth.vo2Max}`);
    }
  }
  
  if (profile.metricsHistory.length > 0) {
      const lastMetric = profile.metricsHistory[profile.metricsHistory.length-1];
      if(lastMetric.bodyFat && lastMetric.muscleMass) {
          const fatScore = Math.max(0, (25 - lastMetric.bodyFat) / 15) * 75; // Stricter fat %
          const muscleScore = Math.min(1, lastMetric.muscleMass / 50) * 75; // Higher muscle req
          advancedScore += fatScore + muscleScore;
          advancedDetails.push(`Body Comp: ${lastMetric.bodyFat}% Fat`);
      }
  }
  
  // Subscription Bonus (Elite tiers get a small score boost to represent "Pro Tools access")
  if (profile.subscriptionTier === 'elite') advancedScore += 50;
  if (profile.subscriptionTier === 'elite_plus') advancedScore += 100;

  advancedScore = Math.min(advancedScore, MAX_SCORES.ADVANCED);
  if(advancedDetails.length > 0) advancedDetail = advancedDetails.join(', ');
  
  const totalScore = Math.round(consistencyScore + performanceScore + advancedScore);

  let status: AthleteStatus = 'Amateur';
  let nextThreshold = LEVEL_THRESHOLDS.SKILLED;
  let currentThreshold = LEVEL_THRESHOLDS.AMATEUR;

  if (totalScore >= LEVEL_THRESHOLDS.ELITE) {
    status = 'Elite';
    currentThreshold = LEVEL_THRESHOLDS.ELITE;
    nextThreshold = LEVEL_THRESHOLDS.ELITE * 1.5; // Virtual cap
  } else if (totalScore >= LEVEL_THRESHOLDS.PRO) {
    status = 'Pro';
    currentThreshold = LEVEL_THRESHOLDS.PRO;
    nextThreshold = LEVEL_THRESHOLDS.ELITE;
  } else if (totalScore >= LEVEL_THRESHOLDS.ADVANCED) {
    status = 'Advanced';
    currentThreshold = LEVEL_THRESHOLDS.ADVANCED;
    nextThreshold = LEVEL_THRESHOLDS.PRO;
  } else if (totalScore >= LEVEL_THRESHOLDS.SEMI_PRO) {
    status = 'Semi-Pro';
    currentThreshold = LEVEL_THRESHOLDS.SEMI_PRO;
    nextThreshold = LEVEL_THRESHOLDS.ADVANCED;
  } else if (totalScore >= LEVEL_THRESHOLDS.SKILLED) {
    status = 'Skilled';
    currentThreshold = LEVEL_THRESHOLDS.SKILLED;
    nextThreshold = LEVEL_THRESHOLDS.SEMI_PRO;
  } else {
    status = 'Amateur';
    currentThreshold = LEVEL_THRESHOLDS.AMATEUR;
    nextThreshold = LEVEL_THRESHOLDS.SKILLED;
  }

  const range = nextThreshold - currentThreshold;
  const progressInLevel = totalScore - currentThreshold;
  const progressToNext = Math.min(100, Math.round((progressInLevel / range) * 100));

  return {
    status,
    score: totalScore,
    progressToNext,
    breakdown: {
      consistency: { score: Math.round(consistencyScore), detail: consistencyDetail },
      performance: { score: Math.round(performanceScore), detail: performanceDetail },
      advanced: { score: Math.round(advancedScore), detail: advancedDetail },
    },
  };
};
