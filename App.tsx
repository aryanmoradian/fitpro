
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PlanManager from './components/PlanManager';
import DailyTracker from './components/DailyTracker';
import AICoach from './components/AICoach';
import MealScanner from './components/MealScanner';
import Profile from './components/Profile';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import InteractiveGuide from './components/InteractiveGuide';
import HomePage from './components/HomePage'; 
import BrandGuide from './components/BrandGuide';
import AuthPage from './components/AuthPage'; 
import HealthHub from './components/HealthHub'; 
import LevelUpModal from './components/LevelUpModal'; 
import SubscriptionPage from './components/SubscriptionPage';
import PaymentCheckout from './components/PaymentCheckout';
import AdminDashboard from './components/AdminDashboard';
import OnboardingSuccessModal from './components/OnboardingSuccessModal';
import VideoLibrary from './components/VideoLibrary';
import UserInbox from './components/UserInbox';
import ProgressAnalyticsExport from './components/ProgressAnalyticsExport'; // ADDED
import { AppView, NutritionItem, DailyLog, UserProfile, Exercise, WeeklyWorkoutPlan, WeeklyNutritionPlan, GuidanceState, AthleteStatus, SubscriptionTier, UserRole } from './types';
import { calculateAthleteLevel } from './services/levelCalculator';
import { supabase, isMock } from './lib/supabaseClient';

const INITIAL_PROFILE: UserProfile = {
  id: 'guest',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  name: 'ورزشکار',
  role: 'athlete',
  age: 0,
  gender: undefined,
  height: 0,
  currentWeight: 0,
  metricsHistory: [],
  injuries: '',
  photoGallery: [],
  goals: [],
  level: 1,
  xp: 0,
  coins: 0,
  habits: [],
  customExercises: [],
  customFoods: [],
  subscriptionTier: 'free',
  subscriptionStatus: 'inactive',
  theme: 'Standard'
};

const App: React.FC = () => {
  const [isAppEntered, setIsAppEntered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');

  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [targetTier, setTargetTier] = useState<SubscriptionTier>('elite');
  
  const [nutritionPlan, setNutritionPlan] = useState<NutritionItem[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<Exercise[]>([]); 
  const [weeklyWorkoutPlan, setWeeklyWorkoutPlan] = useState<WeeklyWorkoutPlan>({ id: '1', name: 'برنامه اصلی', sessions: [] });
  const [weeklyNutritionPlan, setWeeklyNutritionPlan] = useState<WeeklyNutritionPlan>({ id: '1', name: 'رژیم اصلی', days: [] });
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [showGuide, setShowGuide] = useState(false);
  const [highlightCharts, setHighlightCharts] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [guidanceState, setGuidanceState] = useState<GuidanceState>({ photoUploaded: false, workoutCreated: false, nutritionCreated: false, firstLogCompleted: false });
  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; newStatus: AthleteStatus | null }>({ show: false, newStatus: null });

  // --- INIT SESSION ---
  useEffect(() => {
    const initSession = async () => {
        // 1. MOCK MODE CHECK
        if (isMock) {
            const mockSession = localStorage.getItem('fitpro_mock_session');
            if (mockSession === 'true') {
                // Restore Mock User
                const storedSubStatus = localStorage.getItem('fitpro_sub_status') as 'active' | 'inactive' || 'inactive';
                const storedSubTier = localStorage.getItem('fitpro_sub_tier') as SubscriptionTier || 'free';
                
                setUserProfile({
                    ...INITIAL_PROFILE,
                    id: 'mock-user-123',
                    firstName: 'کاربر',
                    lastName: 'تستی',
                    name: 'کاربر تستی',
                    email: 'user@example.com',
                    role: 'athlete',
                    subscriptionStatus: storedSubStatus,
                    subscriptionTier: storedSubTier
                });
                setIsAuthenticated(true);
                setIsAppEntered(true);
            }
            return;
        }

        // 2. REAL SUPABASE CHECK
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            // Fetch DB profile...
            setIsAuthenticated(true);
            setIsAppEntered(true);
        }
    };

    initSession();
  }, []);

  // --- AUTH HANDLERS ---
  const handleAuthSuccess = (user: { firstName: string; lastName: string; email: string; role: UserRole }) => {
    // If Mock, set storage
    if (isMock) {
        localStorage.setItem('fitpro_mock_session', 'true');
    }

    setUserProfile(prev => ({ 
        ...prev, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
    }));
    
    if (user.role === 'admin') {
        setCurrentView(AppView.ADMIN_DASHBOARD);
    } else {
        setCurrentView(AppView.DASHBOARD);
    }
    
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
      if (isMock) {
          localStorage.removeItem('fitpro_mock_session');
      } else {
          await supabase.auth.signOut();
      }
      setIsAuthenticated(false);
      setIsAppEntered(false);
      setUserProfile(INITIAL_PROFILE);
      setCurrentView(AppView.DASHBOARD);
  };

  const handlePaymentSuccess = () => {
    const newTier = targetTier;
    
    // Save to LocalStorage for Mock Mode Persistence
    if (isMock) {
        localStorage.setItem('fitpro_sub_status', 'active');
        localStorage.setItem('fitpro_sub_tier', newTier);
        localStorage.setItem('fitpro_sub_expire', '2030-01-01');
    }

    setUserProfile(prev => ({
        ...prev,
        subscriptionTier: newTier,
        subscriptionStatus: 'active',
        subscriptionExpiry: '2030-01-01T00:00:00Z',
        theme: newTier === 'elite_plus' ? 'Neon' : 'Gold'
    }));

    setShowSuccessModal(true);
  };

  const updateTodaysLog = (partial: Partial<DailyLog>) => { /* Implementation kept simple for brevity */ };

  // --- RENDER ---
  if (!isAppEntered) {
    return <HomePage onLogin={() => { setInitialAuthMode('login'); setIsAppEntered(true); }} onRegister={() => { setInitialAuthMode('register'); setIsAppEntered(true); }} />;
  }
  
  if (!isAuthenticated) {
    return <AuthPage initialMode={initialAuthMode} onAuthSuccess={handleAuthSuccess} />;
  }

  const renderView = () => {
    if (userProfile.role === 'admin') return <AdminDashboard />;

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard logs={logs} bodyMetrics={userProfile.metricsHistory} workoutPlan={workoutPlan} nutritionPlan={nutritionPlan} profile={userProfile} updateProfile={setUserProfile} guidanceState={guidanceState} setCurrentView={setCurrentView} weeklyWorkoutPlan={weeklyWorkoutPlan} updateTodaysLog={updateTodaysLog} athleteLevelInfo={calculateAthleteLevel(userProfile, logs)} highlightCharts={highlightCharts} />;
      case AppView.BODY_ANALYSIS: return <Profile profile={userProfile} updateProfile={setUserProfile} logs={logs} setCurrentView={setCurrentView} athleteLevelInfo={calculateAthleteLevel(userProfile, logs)} />;
      case AppView.HEALTH_HUB: return <HealthHub profile={userProfile} updateProfile={setUserProfile} logs={logs} setCurrentView={setCurrentView} />;
      case AppView.ADVANCED_ANALYTICS: return <AdvancedAnalytics profile={userProfile} updateProfile={setUserProfile} logs={logs} nutritionPlan={nutritionPlan} setCurrentView={setCurrentView} />;
      case AppView.PLANNER: return <PlanManager nutritionPlan={nutritionPlan} setNutritionPlan={setNutritionPlan} workoutPlan={workoutPlan} setWorkoutPlan={setWorkoutPlan} weeklyWorkoutPlan={weeklyWorkoutPlan} setWeeklyWorkoutPlan={setWeeklyWorkoutPlan} weeklyNutritionPlan={weeklyNutritionPlan} setWeeklyNutritionPlan={setWeeklyNutritionPlan} profile={userProfile} updateProfile={setUserProfile} athleteLevelInfo={calculateAthleteLevel(userProfile, logs)} />;
      case AppView.TRACKER: return <DailyTracker nutritionPlan={nutritionPlan} setNutritionPlan={setNutritionPlan} workoutPlan={workoutPlan} addLog={(l) => setLogs([...logs, l])} profile={userProfile} updateProfile={setUserProfile} logs={logs} />;
      case AppView.COACH: return <AICoach />;
      case AppView.MEAL_SCAN: return <MealScanner profile={userProfile} setCurrentView={setCurrentView} />;
      case AppView.BRAND_GUIDE: return <BrandGuide />;
      case AppView.SUBSCRIPTION_LANDING: return <SubscriptionPage setCurrentView={setCurrentView} setTargetTier={setTargetTier} />;
      case AppView.PAYMENT: return <PaymentCheckout targetTier={targetTier} setTargetTier={setTargetTier} profile={userProfile} updateProfile={setUserProfile} onBack={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)} onSuccess={handlePaymentSuccess} />;
      case AppView.VIDEO_LIBRARY: return <VideoLibrary profile={userProfile} />;
      case AppView.USER_INBOX: return <UserInbox profile={userProfile} />;
      case AppView.PROGRESS_EXPORT: return <ProgressAnalyticsExport profile={userProfile} />; // ADDED CASE
      default: return null;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} guidanceState={guidanceState} logs={logs} profile={userProfile} athleteLevelInfo={calculateAthleteLevel(userProfile, logs)} onLogout={handleLogout}>
      {renderView()}
      {showGuide && <InteractiveGuide onClose={() => setShowGuide(false)} setCurrentView={setCurrentView} />}
      {levelUpInfo.show && <LevelUpModal newStatus={levelUpInfo.newStatus!} onClose={() => setLevelUpInfo({show:false, newStatus:null})} />}
      {showSuccessModal && <OnboardingSuccessModal tier={userProfile.subscriptionTier} onClose={() => { setShowSuccessModal(false); setCurrentView(AppView.DASHBOARD); }} />}
    </Layout>
  );
};

export default App;
