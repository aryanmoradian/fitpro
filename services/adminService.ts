import { supabase } from '../lib/supabaseClient';
import { UserActivity, Video, AdminUserView, SubscriptionTier, TransactionLog } from '../types';

// --- ACTIVITY LOGGING ---
export const logUserActivity = async (userId: string, eventType: string, eventData: any = {}) => {
  try {
    // In a real app, you might fetch IP/Device info from a backend edge function
    await supabase.from('user_activity').insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      device_info: navigator.userAgent
    });
  } catch (e) {
    console.error("Activity Log Failed", e);
  }
};

export const getUserActivities = async (): Promise<UserActivity[]> => {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);
  
  if (error) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    eventType: item.event_type,
    eventData: item.event_data,
    timestamp: new Date(item.timestamp).toLocaleString('fa-IR')
  }));
};

// --- VIDEO MANAGEMENT ---
export const getVideos = async (isAdmin: boolean = false): Promise<Video[]> => {
  let query = supabase.from('videos').select('*').order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) return [];
  
  return data.map((v: any) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    category: v.category,
    thumbnailUrl: v.thumbnail_url,
    videoUrl: v.video_url,
    visibility: v.visibility,
    views: v.views,
    createdAt: v.created_at
  }));
};

export const createVideo = async (video: Partial<Video>) => {
  return await supabase.from('videos').insert({
    title: video.title,
    description: video.description,
    category: video.category,
    thumbnail_url: video.thumbnailUrl,
    video_url: video.videoUrl,
    visibility: video.visibility
  });
};

export const deleteVideo = async (id: string) => {
  return await supabase.from('videos').delete().eq('id', id);
};

// --- USER MANAGEMENT ENHANCED ---

export const getAllUsers = async (): Promise<AdminUserView[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data.map((u: any) => ({
        id: u.id,
        fullName: `${u.first_name} ${u.last_name}`,
        email: u.email,
        role: u.role,
        subscription: u.subscription_tier,
        subscriptionStatus: u.subscription_status,
        subscriptionExpiry: u.subscription_expiry,
        lastLogin: u.last_sign_in_at || '',
        status: u.is_banned ? 'banned' : 'active',
        joinDate: new Date(u.created_at).toISOString().split('T')[0],
        adminNotes: u.admin_notes
    }));
};

export const updateUserStatus = async (userId: string, updates: Partial<AdminUserView>) => {
  const { error } = await supabase.from('profiles').update({
    first_name: updates.fullName?.split(' ')[0], // simple split
    phone: updates.phone,
    is_banned: updates.status === 'banned',
    admin_notes: updates.adminNotes,
    subscription_tier: updates.subscription
  }).eq('id', userId);
  return { success: !error };
};

// --- FINANCIAL ADVANCED ---
export const getTransactionLogs = async (): Promise<TransactionLog[]> => {
  // Mocking this call for now or mapping from payments if transactions_log table not populated
  const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
  
  if (!data) return [];

  return data.map((p: any) => ({
    id: p.id,
    txid: p.tx_id || 'Manual',
    amount: p.amount_usd,
    currency: 'USDT',
    status: p.status === 'succeeded' ? 'confirmed' : p.status === 'failed' ? 'rejected' : 'pending',
    createdAt: new Date(p.created_at).toLocaleDateString('fa-IR')
  }));
};