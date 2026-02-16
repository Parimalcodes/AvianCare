
import React, { useState } from 'react';
import { Bird, BirdSpecies } from '../types';
import { X, Camera, ChevronDown } from 'lucide-react';

interface AddBirdModalProps {
  onClose: () => void;
  onAdd: (bird: Omit<Bird, 'id'>) => void;
}

const AddBirdModal: React.FC<AddBirdModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<BirdSpecies>('Cockatiel');
  const [ageYears, setAgeYears] = useState('0');
  const [ageMonths, setAgeMonths] = useState('0');
  const [ageDays, setAgeDays] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const now = new Date();
    const birthDate = new Date(now);
    birthDate.setFullYear(now.getFullYear() - (parseInt(ageYears) || 0));
    birthDate.setMonth(now.getMonth() - (parseInt(ageMonths) || 0));
    birthDate.setDate(now.getDate() - (parseInt(ageDays) || 0));

    onAdd({
      name,
      species,
      birthDate: birthDate.toISOString(),
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}`
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Bird</h2>
            <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-blue-50/50 flex flex-col items-center justify-center text-blue-500 border-4 border-white shadow-[0_15px_30px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-blue-100/50 transition-all duration-500 overflow-hidden">
                  <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Select Photo</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bird Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Luna"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Species</label>
                <div className="relative">
                  <select 
                    value={species}
                    onChange={e => setSpecies(e.target.value as BirdSpecies)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none shadow-inner"
                  >
                    <option value="Cockatiel">Cockatiel</option>
                    <option value="Budgie">Budgie</option>
                    <option value="Other">Other Species</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Current Age</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      value={ageYears}
                      onChange={e => setAgeYears(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-2 py-4 text-center text-slate-800 font-black text-lg focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                    />
                    <span className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest">Years</span>
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      max="11"
                      value={ageMonths}
                      onChange={e => setAgeMonths(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-2 py-4 text-center text-slate-800 font-black text-lg focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                    />
                    <span className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest">Months</span>
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      max="30"
                      value={ageDays}
                      onChange={e => setAgeDays(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[20px] px-2 py-4 text-center text-slate-800 font-black text-lg focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                    />
                    <span className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest">Days</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl shadow-2xl shadow-slate-200 active:scale-95 transition-all mt-6 uppercase tracking-[0.2em] text-[10px]"
            >
              Add Feather Friend
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBirdModal;