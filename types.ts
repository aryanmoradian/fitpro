
export interface NutritionItem {
  id: string;
  title: string;
  details: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  completed: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  muscleGroup?: string;
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  sets: SetLog[];
}

export type Mood = 'happy' | 'neutral' | 'sad' | 'energetic' | 'tired';

export interface DailyLog {
  date: string;
  bodyWeight?: number; 
  workoutScore: number;
  nutritionScore: number;
  sleepHours?: number;
  sleepQuality?: number;
  restingHeartRate?: number;
  notes: string;
  mood?: Mood;
  detailedWorkout?: ExerciseLog[]; 
  detailedNutrition?: NutritionItem[]; 
  stressIndex?: number;
  hrv?: number;
  rpeLoad?: number;
  energyLevel?: number;
  waterIntake?: number;
  steps?: number;
  consumedMacros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface BodyMetricLog {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  waterPercentage?: number;
  bmi: number;
  measurements: {
    arm: number;
    thigh: number;
    waist: number;
    chest: number;
    shoulders?: number;
  };
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
}

export interface GeneticTrait {
  id: string;
  trait: string;
  result: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface HormonePanel {
  id: string;
  date: string;
  testosterone?: number;
  cortisol?: number;
  thyroidTSH?: number;
  notes?: string;
  testosteroneLevel?: number; // Added for new components if needed
}

export interface PostureScan {
  id:string;
  date: string;
  imageUrl?: string;
  score: number;
  issues: string[];
}

export interface AdvancedHealthData {
  geneticProfile: GeneticTrait[];
  hormonalHistory: HormonePanel[];
  vo2Max: number;
  metabolicAge: number;
  postureScans: PostureScan[];
  recoveryIndex: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  notes?: string;
}

export interface Goal {
  id: string;
  text: string;
  type: 'short' | 'medium' | 'long';
  progress: number;
  targetDate?: string;
}

export type SubscriptionTier = 'free' | 'elite' | 'elite_plus';
export type AppTheme = 'Standard' | 'Gold' | 'Neon';
export type PaymentMethod = 'usdt_trc20' | 'manual';
export type PlanDuration = 1 | 3 | 6 | 12;
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'pending';
export type UserRole = 'athlete' | 'admin';

export interface ExerciseLibItem {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  description: string;
  category?: string;
  instructions?: string;
  commonMistakes?: string;
  caloriesBurned?: number;
  isCustom?: boolean;
}

export interface TrainingSession {
  id: string;
  name: string;
  dayOfWeek: number;
  exercises: Exercise[];
}

export interface WeeklyWorkoutPlan {
  id: string;
  name: string;
  sessions: TrainingSession[];
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  unit: string;
  defaultPortion: number;
  category?: string;
  vitamins?: string;
  isCustom?: boolean;
}

export interface MealEntry {
  id: string;
  foodId: string;
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface DailyMealPlan {
  dayOfWeek: number;
  breakfast: MealEntry[];
  lunch: MealEntry[];
  dinner: MealEntry[];
  snacks: MealEntry[];
}

export interface WeeklyNutritionPlan {
  id: string;
  name: string;
  days: DailyMealPlan[];
}

export interface GuidanceState {
  photoUploaded: boolean;
  workoutCreated: boolean;
  nutritionCreated: boolean;
  firstLogCompleted: boolean;
}

export type AthleteStatus = 'Amateur' | 'Skilled' | 'Semi-Pro' | 'Advanced' | 'Pro' | 'Elite';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  name: string;
  avatar?: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  height: number;
  currentWeight: number;
  sportsHistory?: string;
  metricsHistory: BodyMetricLog[];
  injuries: string;
  goals: Goal[]; 
  photoGallery: ProgressPhoto[]; 
  level: number;
  xp: number;
  coins: number;
  habits: Habit[];
  customExercises: ExerciseLibItem[];
  customFoods: FoodItem[];
  advancedHealth?: AdvancedHealthData;
  weightGoal?: {
    target: number;
    deadline: string;
    startWeight: number;
  };
  hydrationGoal?: number;
  badges?: string[];
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: string;
  subscriptionStatus?: SubscriptionStatus;
  theme: AppTheme;
  isBanned?: boolean;
  adminNotes?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  BODY_ANALYSIS = 'BODY_ANALYSIS',
  PLANNER = 'PLANNER',
  TRACKER = 'TRACKER',
  COACH = 'COACH',
  MEAL_SCAN = 'MEAL_SCAN',
  ADVANCED_ANALYTICS = 'ADVANCED_ANALYTICS',
  HEALTH_HUB = 'HEALTH_HUB',
  BRAND_GUIDE = 'BRAND_GUIDE',
  SUBSCRIPTION_LANDING = 'SUBSCRIPTION_LANDING',
  PAYMENT = 'PAYMENT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  VIDEO_LIBRARY = 'VIDEO_LIBRARY',
  USER_INBOX = 'USER_INBOX',
  PROGRESS_EXPORT = 'PROGRESS_EXPORT' // NEW VIEW
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'needs_review' | 'waiting';

export interface PendingPayment {
  id: string;
  userId: string;
  userName: string;
  plan: SubscriptionTier;
  amount: number;
  method: PaymentMethod;
  tx_id?: string;
  receipt_url?: string;
  status: PaymentStatus;
  date: string;
  durationMonths: number;
}

export interface AdminUserView {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  subscription: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: string;
  lastLogin: string;
  status: 'active' | 'banned' | 'restricted';
  joinDate?: string;
  adminNotes?: string;
}

export interface AdminAuditLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  eliteUsers: number;
  monthlyRevenue: number;
  pendingReviews: number;
  activityData: { date: string; users: number }[];
  moduleUsage: { name: string; count: number }[];
}

export interface SystemModule {
  id: string;
  name: string;
  isEnabled: boolean;
  description: string;
  icon?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  visibility: 'free' | 'members' | 'vip';
  views: number;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  eventType: 'login' | 'page_view' | 'video_watch' | 'workout_open' | 'download';
  eventData?: any;
  ipAddress?: string;
  deviceInfo?: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // null if broadcast
  subject: string;
  message: string;
  isRead: boolean;
  isBroadcast: boolean;
  createdAt: string;
}

export interface TransactionLog {
  id: string;
  txid: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'rejected';
  confirmedByAdmin?: string;
  notes?: string;
  createdAt: string;
}

// --- NEW TYPES FOR EXPORT MODULE ---

export interface AthleteActivity {
  id: string;
  userId: string;
  date: string;
  steps: number;
  calories: number;
  workoutMinutes: number;
  distanceKm: number;
  waterMl: number;
  sleepHours: number;
  weight: number;
  bodyFat?: number;
}

export interface ReportLink {
  id: string;
  url: string;
  type: 'public' | 'private';
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  views: number;
  passcode?: string;
}
