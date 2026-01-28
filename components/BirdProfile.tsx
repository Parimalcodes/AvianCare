
import React from 'react';
import { Bird } from '../types';
import { Trash2, User } from 'lucide-react';

interface BirdProfileProps {
  bird: Bird;
  onDelete: () => void;
}

const BirdProfile: React.FC<BirdProfileProps> = ({ bird, onDelete }) => {
  const getAgeString = () => {
    if (!bird.birthDate) return 'Age unknown';
    
    const birth = new Date(bird.birthDate);
    const now = new Date();
    
    // Total difference in milliseconds
    const diffMs = now.getTime() - birth.getTime();
    
    // Total days (simplest way to show increasing daily age)
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // For calendar-based age (Years, Months, Days)
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
    
    // Always show days if it's a young bird, or if requested to track daily
    if (days >= 0 || (years === 0 && months === 0)) {
       parts.push(`${days}d`);
    }
    
    // Optional: Add total days in parentheses if the user wants to see the count strictly increasing
    return parts.join(' ');
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-md group">
      <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-slate-50 group-hover:border-blue-100 transition-all">
        {bird.image ? (
          <img src={bird.image} alt={bird.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-8 h-8 text-slate-300" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-black text-slate-800 text-lg leading-tight">{bird.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">{bird.species}</span>
          <span className="text-[10px] font-bold text-slate-400">• {getAgeString()}</span>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete ${bird.name}?`)) onDelete();
        }}
        className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BirdProfile;
