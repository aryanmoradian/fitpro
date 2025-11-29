
import { DailyLog, AthleteActivity, ReportLink } from '../types';
import { supabase } from '../lib/supabaseClient';

// --- MOCK DATA GENERATOR (For Client-Side Demo if API fails) ---
const generateMockActivityData = (days: number): AthleteActivity[] => {
  const data: AthleteActivity[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    data.push({
      id: `act_${i}`,
      userId: 'user_123',
      date: date.toLocaleDateString('fa-IR'),
      steps: Math.floor(Math.random() * 8000) + 2000,
      calories: Math.floor(Math.random() * 1000) + 1500,
      workoutMinutes: Math.floor(Math.random() * 90),
      distanceKm: parseFloat((Math.random() * 5).toFixed(2)),
      waterMl: Math.floor(Math.random() * 2000) + 500,
      sleepHours: parseFloat((Math.random() * 4 + 4).toFixed(1)),
      weight: 75 + Math.random() * 2 - 1,
      bodyFat: 15 + Math.random()
    });
  }
  return data.reverse();
};

// --- DATA FETCHING ---

export const getAthleteActivity = async (range: 'daily' | 'weekly' | 'monthly' | 'yearly', userId: string): Promise<AthleteActivity[]> => {
  try {
    // Attempt to fetch from real API / Supabase
    const { data, error } = await supabase
      .from('athlete_activity')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(range === 'weekly' ? 7 : range === 'monthly' ? 30 : 365);

    if (error || !data || data.length === 0) {
      // Fallback to mock data for demo purposes if table is empty
      console.log("Using mock activity data");
      return generateMockActivityData(range === 'weekly' ? 7 : range === 'monthly' ? 30 : 90);
    }

    return data.map((item: any) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('fa-IR')
    }));
  } catch (e) {
    console.error("Fetch activity failed", e);
    return generateMockActivityData(7);
  }
};

// --- EXPORT LOGIC ---

export const exportToCSV = (data: AthleteActivity[], fileName: string) => {
  const headers = ['Date', 'Steps', 'Calories', 'Workout (min)', 'Distance (km)', 'Water (ml)', 'Sleep (h)', 'Weight (kg)'];
  const rows = data.map(row => [
    row.date,
    row.steps,
    row.calories,
    row.workoutMinutes,
    row.distanceKm,
    row.waterMl,
    row.sleepHours,
    row.weight
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: AthleteActivity[], fileName: string) => {
  const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonContent);
  link.setAttribute("download", `${fileName}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Simulated PDF Export (calls backend in production)
export const requestPDFExport = async (userId: string, range: string): Promise<{ success: boolean, url?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, url: '#' }); // Mock success
    }, 2000);
  });
};

// --- SHARING ---

export const generateShareLink = async (userId: string, type: 'public' | 'private', passcode?: string): Promise<ReportLink> => {
  // In real app, call API to insert into DB and generate unique hash
  const newLink: ReportLink = {
    id: Date.now().toString(),
    url: `https://fit-pro.ir/share/${Date.now()}`,
    type,
    createdAt: new Date().toLocaleDateString('fa-IR'),
    isActive: true,
    views: 0,
    passcode
  };
  
  // Persist mock
  return newLink;
};

export const revokeShareLink = async (linkId: string): Promise<void> => {
  // Call API to update isActive = false
  console.log(`Link ${linkId} revoked.`);
};
