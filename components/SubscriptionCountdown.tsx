
import React from 'react';
import { UserProfile } from '../types';
import { Clock, AlertTriangle } from 'lucide-react';

const SubscriptionCountdown: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  if (!profile.subscriptionExpiry || profile.subscriptionStatus !== 'active') return null;

  const expiry = new Date(profile.subscriptionExpiry);
  const now = new Date();
  const diffTime = Math.abs(expiry.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const isExpired = expiry < now;

  if (isExpired) return (
    <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center animate-pulse">
        <AlertTriangle size={12} className="mr-1" /> Plan Expired
    </div>
  );

  if (diffDays > 5) return null;

  return (
    <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${diffDays <= 2 ? 'bg-red-500 text-white animate-pulse' : 'bg-yellow-500 text-black'}`}>
        <Clock size={12} className="mr-1" /> {diffDays} days left
    </div>
  );
};

export default SubscriptionCountdown;
