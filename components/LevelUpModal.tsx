import React from 'react';
import { Award, X } from 'lucide-react';
import { AthleteStatus } from '../types';

interface LevelUpModalProps {
  newStatus: AthleteStatus;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newStatus, onClose }) => {
  const levelStyles: Record<string, { badge: string, text: string, gradient: string }> = {
    'Semi-Pro': { badge: 'bg-blue-500', text: 'text-blue-300', gradient: 'from-blue-500 to-cyan-400' },
    Professional: { badge: 'bg-yellow-500', text: 'text-yellow-300', gradient: 'from-yellow-500 to-orange-400' },
    Amateur: { badge: 'bg-gray-500', text: 'text-gray-300', gradient: 'from-gray-500 to-gray-400' }
  };
  const currentStyle = levelStyles[newStatus];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
      <div className={`relative bg-gray-900 rounded-2xl border border-gray-700 max-w-md w-full p-8 text-center overflow-hidden animate-in fade-in zoom-in-95`} onClick={e => e.stopPropagation()}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-gradient-radial ${currentStyle.gradient} opacity-20 blur-3xl`}></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">
          <X />
        </button>

        <Award className={`w-20 h-20 mx-auto drop-shadow-lg ${currentStyle.text}`} />
        
        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mt-4">LEVEL UP!</h2>
        <p className="text-4xl font-black text-white my-2">You are now a</p>
        <p className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${currentStyle.gradient} mb-6`}>
          {newStatus}
        </p>

        <p className="text-gray-300 mb-8">
          Your dedication is paying off! New AI recommendations and features are now available to match your new status.
        </p>
        
        <button onClick={onClose} className="btn-primary w-full py-3">
          Keep Pushing!
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
