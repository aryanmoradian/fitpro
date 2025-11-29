
import React, { useState, useEffect } from 'react';
import { Video } from '../types';
import { getVideos, createVideo, deleteVideo } from '../services/adminService';
import { Plus, Trash2, Video as VideoIcon, Save, X } from 'lucide-react';

const AdminVideoPanel: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newVideo, setNewVideo] = useState<Partial<Video>>({ visibility: 'free' });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await getVideos(true);
    setVideos(data);
  };

  const handleSave = async () => {
    if (!newVideo.title || !newVideo.videoUrl) return alert("Title and URL required");
    await createVideo(newVideo);
    setIsEditing(false);
    setNewVideo({ visibility: 'free' });
    loadVideos();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteVideo(id);
      loadVideos();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><VideoIcon /> Video Management</h2>
        <button onClick={() => setIsEditing(true)} className="btn-primary py-2 px-4 flex items-center"><Plus size={16} className="mr-2"/> Upload Video</button>
      </div>

      {isEditing && (
        <div className="bg-gray-800 p-6 rounded-xl mb-6 border border-gray-700 animate-in fade-in">
          <h3 className="font-bold text-white mb-4">Add New Video</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input placeholder="Title" className="input-styled p-2" value={newVideo.title || ''} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
            <input placeholder="Category" className="input-styled p-2" value={newVideo.category || ''} onChange={e => setNewVideo({...newVideo, category: e.target.value})} />
            <input placeholder="Video URL" className="input-styled p-2" value={newVideo.videoUrl || ''} onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} />
            <input placeholder="Thumbnail URL" className="input-styled p-2" value={newVideo.thumbnailUrl || ''} onChange={e => setNewVideo({...newVideo, thumbnailUrl: e.target.value})} />
            <select className="input-styled p-2" value={newVideo.visibility} onChange={e => setNewVideo({...newVideo, visibility: e.target.value as any})}>
              <option value="free">Free</option>
              <option value="members">Members Only</option>
              <option value="vip">VIP Only</option>
            </select>
          </div>
          <textarea placeholder="Description" className="input-styled w-full p-2 mb-4" rows={3} value={newVideo.description || ''} onChange={e => setNewVideo({...newVideo, description: e.target.value})} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded text-white flex items-center"><Save size={16} className="mr-2"/> Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <div key={v.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative group">
            <div className="h-40 bg-black/50 flex items-center justify-center">
              {v.thumbnailUrl ? <img src={v.thumbnailUrl} className="w-full h-full object-cover"/> : <VideoIcon size={40} className="text-gray-500"/>}
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <h4 className="font-bold text-white">{v.title}</h4>
                <span className={`text-xs px-2 py-1 rounded capitalize ${v.visibility === 'vip' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{v.visibility}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{v.description}</p>
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>{v.views} Views</span>
                <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVideoPanel;
