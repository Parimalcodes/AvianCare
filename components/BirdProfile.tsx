
import React from 'react';
import { Bird } from '../types';
import { Trash2, User, ChevronRight } from 'lucide-react';

interface BirdProfileProps {
  bird: Bird;
  onDelete: () => void;
}

const BirdProfile: React.FC<BirdProfileProps> = ({ bird, onDelete }) => {
  const getAgeString = () => {
    if (!bird.birthDate) return 'Age unknown';
    
    const birth = new Date(bird.birthDate);
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days >= 0 || (years === 0 && months === 0)) {
       parts.push(`${days}d`);
    }
    
    return parts.join(' ');
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex items-center gap-5 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="w-20 h-20 rounded-[28px] bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white shadow-inner group-hover:scale-105 transition-transform duration-500">
        {bird.image ? (
          <img src={bird.image} alt={bird.name} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-full h-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-300" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-900 text-xl leading-tight tracking-tight truncate">{bird.name}</h3>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-lg tracking-wider border border-blue-100/50">
            {bird.species}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            {getAgeString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete ${bird.name}?`)) onDelete();
          }}
          className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
          title="Delete Profile"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BirdProfile;