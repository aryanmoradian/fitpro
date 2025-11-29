
import { supabase } from '../lib/supabaseClient';
import { Message } from '../types';

export const sendMessage = async (senderId: string, receiverId: string | null, subject: string, message: string, isBroadcast: boolean = false) => {
  return await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    subject,
    message,
    is_broadcast: isBroadcast
  });
};

export const getUserMessages = async (userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`receiver_id.eq.${userId},is_broadcast.eq.true`)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map((m: any) => ({
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    subject: m.subject,
    message: m.message,
    isRead: m.is_read,
    isBroadcast: m.is_broadcast,
    createdAt: new Date(m.created_at).toLocaleString('fa-IR')
  }));
};

export const markAsRead = async (msgId: string) => {
  await supabase.from('messages').update({ is_read: true }).eq('id', msgId);
};
