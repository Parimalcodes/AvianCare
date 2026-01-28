
import React, { useState } from 'react';
import { Bird, BirdSpecies } from '../types';
import { X, Camera } from 'lucide-react';

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

    // Calculate birthDate by subtracting entered age from current date
    const now = new Date();
    const birthDate = new Date(now);
    birthDate.setFullYear(now.getFullYear() - (parseInt(ageYears) || 0));
    birthDate.setMonth(now.getMonth() - (parseInt(ageMonths) || 0));
    birthDate.setDate(now.getDate() - (parseInt(ageDays) || 0));

    onAdd({
      name,
      species,
      birthDate: birthDate.toISOString(),
      image: `https://picsum.photos/seed/${name}/200`
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Bird</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-28 h-28 rounded-full bg-blue-50 flex flex-col items-center justify-center text-blue-400 border-2 border-dashed border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                <Camera className="w-10 h-10" />
                <span className="text-[10px] font-black uppercase mt-2">Upload Photo</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Bird Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Paco"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Species</label>
                <select 
                  value={species}
                  onChange={e => setSpecies(e.target.value as BirdSpecies)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="Cockatiel">Cockatiel</option>
                  <option value="Budgie">Budgie</option>
                  <option value="Other">Other Bird</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">How old is the bird today?</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      value={ageYears}
                      onChange={e => setAgeYears(e.target.value)}
                      placeholder="YY"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <span className="block text-[9px] text-center font-bold text-slate-400 uppercase">Years</span>
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      max="11"
                      value={ageMonths}
                      onChange={e => setAgeMonths(e.target.value)}
                      placeholder="MM"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <span className="block text-[9px] text-center font-bold text-slate-400 uppercase">Months</span>
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="number" 
                      min="0"
                      max="30"
                      value={ageDays}
                      onChange={e => setAgeDays(e.target.value)}
                      placeholder="DD"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-4 text-center text-slate-800 font-bold focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <span className="block text-[9px] text-center font-bold text-slate-400 uppercase">Days</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-200 active:scale-95 transition-all mt-6 uppercase tracking-widest text-xs"
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
