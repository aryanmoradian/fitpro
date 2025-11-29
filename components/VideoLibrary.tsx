
import React, { useState, useEffect } from 'react';
import { getVideos, logUserActivity } from '../services/adminService';
import { Video, UserProfile } from '../types';
import { Play, Lock, Crown } from 'lucide-react';

const VideoLibrary: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    getVideos().then(setVideos);
    logUserActivity(profile.id, 'page_view', { page: 'Video Library' });
  }, []);

  const canWatch = (video: Video) => {
    if (video.visibility === 'free') return true;
    if (video.visibility === 'members' && profile.subscriptionStatus === 'active') return true;
    if (video.visibility === 'vip' && profile.subscriptionTier === 'elite_plus') return true;
    return false;
  };

  const handleWatch = (video: Video) => {
    if (canWatch(video)) {
        logUserActivity(profile.id, 'video_watch', { videoId: video.id, title: video.title });
        window.open(video.videoUrl, '_blank');
    } else {
        alert("Upgrade your plan to watch this video!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Training Video Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => {
            const unlocked = canWatch(v);
            return (
                <div key={v.id} onClick={() => handleWatch(v)} className={`bg-[#1E293B] rounded-xl overflow-hidden border border-gray-700 relative group cursor-pointer transition transform hover:scale-105 ${!unlocked ? 'opacity-75' : ''}`}>
                    <div className="h-48 bg-black relative">
                        <img src={v.thumbnailUrl || 'https://via.placeholder.com/400x300?text=Video'} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {unlocked ? (
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"><Play className="text-white fill-current ml-1" /></div>
                            ) : (
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg"><Lock className="text-red-500" /></div>
                            )}
                        </div>
                        {v.visibility === 'vip' && <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center"><Crown size={12} className="mr-1"/> VIP</div>}
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-white mb-1">{v.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{v.description}</p>
                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                            <span>{v.category}</span>
                            <span>{v.views} views</span>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default VideoLibrary;
