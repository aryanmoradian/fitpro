
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
import ProgressAnalyticsExport from './components/ProgressAnalyticsExport'; 
import { AppView, NutritionItem, DailyLog, UserProfile, Exercise, WeeklyWorkoutPlan, WeeklyNutritionPlan, GuidanceState, AthleteStatus, SubscriptionTier, UserRole } from './types';
import { calculateAthleteLevel } from './services/levelCalculator';
import { supabase, isMock } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';

// --- PASBAM CONFIGURATION ---
const PASBAM_SECRET_KEY = "fp-master-x99-secure-access-2025"; 

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
  const [isLoading, setIsLoading] = useState(true); // Prevents white screen / undefined errors
  const [isAppEntered, setIsAppEntered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');

  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [targetTier, setTargetTier] = useState<SubscriptionTier>('elite');
  
  // Initialize arrays as empty to prevent .length errors
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

  // --- INIT SESSION & AUTH CHECK ---
  useEffect(() => {
    const initSession = async () => {
        setIsLoading(true);

        // 1. PASBAM: Private Admin Secure Bypass Authentication Mode
        const params = new URLSearchParams(window.location.search);
        const pasbamToken = params.get('pasbam');

        if (pasbamToken === PASBAM_SECRET_KEY) {
            console.warn("🔐 PASBAM: Secure Admin Bypass Activated");
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);

            const masterAdminProfile: UserProfile = {
                ...INITIAL_PROFILE,
                id: 'master-admin-001',
                firstName: 'Master',
                lastName: 'Admin',
                name: 'مدیر کل سیستم',
                email: 'admin@fitpro.ir',
                role: 'admin',
                subscriptionTier: 'elite_plus',
                subscriptionStatus: 'active',
                theme: 'Neon'
            };

            setUserProfile(masterAdminProfile);
            setIsAuthenticated(true);
            setIsAppEntered(true);
            setCurrentView(AppView.ADMIN_DASHBOARD);
            setIsLoading(false);
            return;
        }

        // 2. MOCK MODE CHECK (Aryan Logic)
        if (isMock) {
            // Check if we already have a session state from a previous "login"
            const mockSession = localStorage.getItem('fitpro_mock_session');
            
            if (mockSession === 'true') {
                // Determine user role based on stored data or default to admin for Aryan
                const storedRole = localStorage.getItem('fitpro_mock_role') as UserRole || 'admin';
                const storedEmail = localStorage.getItem('fitpro_mock_email') || 'aryan@gmail.com';
                
                setUserProfile({
                    ...INITIAL_PROFILE,
                    id: 'mock-user-aryan',
                    firstName: 'Aryan',
                    lastName: 'Admin',
                    name: 'Aryan Admin',
                    email: storedEmail,
                    role: storedRole,
                    subscriptionStatus: 'active',
                    subscriptionTier: 'elite_plus'
                });
                
                setIsAuthenticated(true);
                setIsAppEntered(true);
                // Default view based on role
                if (storedRole === 'admin' && !localStorage.getItem('fitpro_force_athlete_view')) {
                    setCurrentView(AppView.ADMIN_DASHBOARD);
                } else {
                    setCurrentView(AppView.DASHBOARD);
                }
            }
            setIsLoading(false);
            return;
        }

        // 3. REAL SUPABASE CHECK
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            // In a real app, fetch the profile from DB here.
            // For now, we init with basic data from auth
            setUserProfile({
                ...INITIAL_PROFILE,
                id: session.user.id,
                email: session.user.email || '',
                role: session.user.user_metadata.role || 'athlete',
                name: `${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`
            });
            setIsAuthenticated(true);
            setIsAppEntered(true);
        }
        
        setIsLoading(false);
    };

    initSession();
  }, []);

  // --- AUTH HANDLERS ---
  
  // Updated to accept an optional specific view target (for the dual-password logic)
  const handleAuthSuccess = (user: { firstName: string; lastName: string; email: string; role: UserRole }, targetView?: AppView) => {
    
    // Save Session for Persistence
    if (isMock) {
        localStorage.setItem('fitpro_mock_session', 'true');
        localStorage.setItem('fitpro_mock_email', user.email);
        localStorage.setItem('fitpro_mock_role', user.role);
        
        // Handle "Admin as Athlete" flag
        if (user.role === 'admin' && targetView === AppView.DASHBOARD) {
            localStorage.setItem('fitpro_force_athlete_view', 'true');
        } else {
            localStorage.removeItem('fitpro_force_athlete_view');
        }
    }

    setUserProfile(prev => ({ 
        ...prev, 
        // Ensure arrays are initialized to prevent undefined.length errors
        metricsHistory: prev.metricsHistory || [],
        goals: prev.goals || [],
        habits: prev.habits || [],
        firstName: user.firstName, 
        lastName: user.lastName, 
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
    }));
    
    // Determine Redirect
    if (targetView) {
        setCurrentView(targetView);
    } else {
        if (user.role === 'admin') {
            setCurrentView(AppView.ADMIN_DASHBOARD);
        } else {
            setCurrentView(AppView.DASHBOARD);
        }
    }
    
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
      if (isMock) {
          localStorage.clear(); // Clear all mock flags
      } else {
          await supabase.auth.signOut();
      }
      setIsAuthenticated(false);
      setIsAppEntered(false);
      setUserProfile(INITIAL_PROFILE);
      setCurrentView(AppView.DASHBOARD);
      setLogs([]); // Clear sensitive data
  };

  const handlePaymentSuccess = () => {
    const newTier = targetTier;
    
    if (isMock) {
        localStorage.setItem('fitpro_sub_status', 'active');
        localStorage.setItem('fitpro_sub_tier', newTier);
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

  const updateTodaysLog = (partial: Partial<DailyLog>) => { 
      // Safe update
      setLogs(prev => {
          const today = new Date().toLocaleDateString('fa-IR');
          const existing = prev.find(l => l.date === today);
          if (existing) {
              return prev.map(l => l.date === today ? { ...l, ...partial } : l);
          }
          // If no log exists for today, we might need to create one, but usually DailyTracker handles this
          return prev;
      });
  };

  // --- RENDER ---
  
  // 1. Loading Guard (Prevents white screen / undefined errors)
  if (isLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-[#0D1117] text-white">
              <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                  <p>در حال بارگذاری فیت پرو...</p>
              </div>
          </div>
      );
  }

  // 2. Landing Page
  if (!isAppEntered) {
    return <HomePage onLogin={() => { setInitialAuthMode('login'); setIsAppEntered(true); }} onRegister={() => { setInitialAuthMode('register'); setIsAppEntered(true); }} />;
  }
  
  // 3. Auth Page
  if (!isAuthenticated) {
    return <AuthPage initialMode={initialAuthMode} onAuthSuccess={handleAuthSuccess} />;
  }

  // 4. Main App Routing
  const renderView = () => {
    // Determine effective role view. 
    // Even if role is 'admin', if currentView is NOT ADMIN_DASHBOARD, render user components.
    if (userProfile.role === 'admin' && currentView === AppView.ADMIN_DASHBOARD) {
        return <AdminDashboard />;
    }

    // Safe Data Passing: Ensure arrays are never undefined
    const safeLogs = logs || [];
    const safeProfile = {
        ...userProfile,
        metricsHistory: userProfile.metricsHistory || [],
        goals: userProfile.goals || [],
        habits: userProfile.habits || [],
        customExercises: userProfile.customExercises || [],
        customFoods: userProfile.customFoods || []
    };

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard logs={safeLogs} bodyMetrics={safeProfile.metricsHistory} workoutPlan={workoutPlan || []} nutritionPlan={nutritionPlan || []} profile={safeProfile} updateProfile={setUserProfile} guidanceState={guidanceState} setCurrentView={setCurrentView} weeklyWorkoutPlan={weeklyWorkoutPlan} updateTodaysLog={updateTodaysLog} athleteLevelInfo={calculateAthleteLevel(safeProfile, safeLogs)} highlightCharts={highlightCharts} />;
      case AppView.BODY_ANALYSIS: return <Profile profile={safeProfile} updateProfile={setUserProfile} logs={safeLogs} setCurrentView={setCurrentView} athleteLevelInfo={calculateAthleteLevel(safeProfile, safeLogs)} />;
      case AppView.HEALTH_HUB: return <HealthHub profile={safeProfile} updateProfile={setUserProfile} logs={safeLogs} setCurrentView={setCurrentView} />;
      case AppView.ADVANCED_ANALYTICS: return <AdvancedAnalytics profile={safeProfile} updateProfile={setUserProfile} logs={safeLogs} nutritionPlan={nutritionPlan || []} setCurrentView={setCurrentView} />;
      case AppView.PLANNER: return <PlanManager nutritionPlan={nutritionPlan || []} setNutritionPlan={setNutritionPlan} workoutPlan={workoutPlan || []} setWorkoutPlan={setWorkoutPlan} weeklyWorkoutPlan={weeklyWorkoutPlan} setWeeklyWorkoutPlan={setWeeklyWorkoutPlan} weeklyNutritionPlan={weeklyNutritionPlan} setWeeklyNutritionPlan={setWeeklyNutritionPlan} profile={safeProfile} updateProfile={setUserProfile} athleteLevelInfo={calculateAthleteLevel(safeProfile, safeLogs)} />;
      case AppView.TRACKER: return <DailyTracker nutritionPlan={nutritionPlan || []} setNutritionPlan={setNutritionPlan} workoutPlan={workoutPlan || []} addLog={(l) => setLogs([...safeLogs, l])} profile={safeProfile} updateProfile={setUserProfile} logs={safeLogs} />;
      case AppView.COACH: return <AICoach />;
      case AppView.MEAL_SCAN: return <MealScanner profile={safeProfile} setCurrentView={setCurrentView} />;
      case AppView.BRAND_GUIDE: return <BrandGuide />;
      case AppView.SUBSCRIPTION_LANDING: return <SubscriptionPage setCurrentView={setCurrentView} setTargetTier={setTargetTier} />;
      case AppView.PAYMENT: return <PaymentCheckout targetTier={targetTier} setTargetTier={setTargetTier} profile={safeProfile} updateProfile={setUserProfile} onBack={() => setCurrentView(AppView.SUBSCRIPTION_LANDING)} onSuccess={handlePaymentSuccess} />;
      case AppView.VIDEO_LIBRARY: return <VideoLibrary profile={safeProfile} />;
      case AppView.USER_INBOX: return <UserInbox profile={safeProfile} />;
      case AppView.PROGRESS_EXPORT: return <ProgressAnalyticsExport profile={safeProfile} />; 
      
      // Fallback for admins navigating away from dashboard
      case AppView.ADMIN_DASHBOARD: return <AdminDashboard />;
      default: return <Dashboard logs={safeLogs} bodyMetrics={safeProfile.metricsHistory} workoutPlan={workoutPlan || []} nutritionPlan={nutritionPlan || []} profile={safeProfile} updateProfile={setUserProfile} guidanceState={guidanceState} setCurrentView={setCurrentView} weeklyWorkoutPlan={weeklyWorkoutPlan} updateTodaysLog={updateTodaysLog} athleteLevelInfo={calculateAthleteLevel(safeProfile, safeLogs)} highlightCharts={highlightCharts} />;
    }
  };

  // Safe Level Calculation
  const safeLevelInfo = calculateAthleteLevel(userProfile, logs || []);

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} guidanceState={guidanceState} logs={logs || []} profile={userProfile} athleteLevelInfo={safeLevelInfo} onLogout={handleLogout}>
      {renderView()}
      {showGuide && <InteractiveGuide onClose={() => setShowGuide(false)} setCurrentView={setCurrentView} />}
      {levelUpInfo.show && <LevelUpModal newStatus={levelUpInfo.newStatus!} onClose={() => setLevelUpInfo({show:false, newStatus:null})} />}
      {showSuccessModal && <OnboardingSuccessModal tier={userProfile.subscriptionTier} onClose={() => { setShowSuccessModal(false); setCurrentView(AppView.DASHBOARD); }} />}
    </Layout>
  );
};

export default App;
