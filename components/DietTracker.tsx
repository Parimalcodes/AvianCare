
import React, { useState } from 'react';
import { Bird, DietLog } from '../types';
import { Utensils, History, PlusCircle, Carrot, Cookie, Leaf, Cherry, ChevronDown } from 'lucide-react';

interface DietTrackerProps {
  birds: Bird[];
  dietLogs: DietLog[];
  setDietLogs: React.Dispatch<React.SetStateAction<DietLog[]>>;
}

const DietTracker: React.FC<DietTrackerProps> = ({ birds, dietLogs, setDietLogs }) => {
  const [selectedBirdId, setSelectedBirdId] = useState(birds[0]?.id || '');
  const [foodType, setFoodType] = useState<DietLog['foodType']>('pellets');
  const [amount, setAmount] = useState('');

  const handleLogDiet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBirdId || !amount) return;

    const newLog: DietLog = {
      id: Date.now().toString(),
      birdId: selectedBirdId,
      date: new Date().toISOString(),
      foodType,
      amount
    };

    setDietLogs(prev => [newLog, ...prev]);
    setAmount('');
  };

  const filteredLogs = dietLogs.filter(l => l.birdId === selectedBirdId).slice(0, 15);

  const getFoodIcon = (type: DietLog['foodType']) => {
    switch(type) {
      case 'vegetables': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'fruits': return <Cherry className="w-5 h-5 text-rose-600" />;
      case 'treats': return <Cookie className="w-5 h-5 text-amber-600" />;
      case 'seeds': return <Carrot className="w-5 h-5 text-orange-600" />;
      default: return <Utensils className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diet Tracker</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Nutritional Logging</p>
      </div>

      {/* Log Section - Premium Styling */}
      <div className="bg-white rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">New Intake Log</h3>
        <form onSubmit={handleLogDiet} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="relative">
              <select 
                value={selectedBirdId}
                onChange={e => setSelectedBirdId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 appearance-none transition-all shadow-sm"
                required
              >
                {birds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            </div>

            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[28px] overflow-x-auto no-scrollbar shadow-inner">
              {(['pellets', 'seeds', 'vegetables', 'fruits', 'treats'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFoodType(type)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${foodType === type ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="opacity-70">{getFoodIcon(type)}</span>
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Amount (e.g. 2 scoops)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 py-5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all shadow-sm"
              required
            />
            <button type="submit" className="bg-emerald-600 text-white p-5 rounded-[24px] shadow-xl shadow-emerald-200 active:scale-95 transition-all">
              <PlusCircle className="w-7 h-7" />
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-400">
            <History className="w-4 h-4" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent History</h3>
          </div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{selectedBirdId && birds.find(b => b.id === selectedBirdId)?.name}</span>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold text-sm">No diet logs found for this bird.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredLogs.map(log => (
              <div key={log.id} className="bg-white p-5 rounded-[28px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex justify-between items-center transition-all hover:translate-x-1 group">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-[20px] shadow-inner ${
                    log.foodType === 'vegetables' ? 'bg-emerald-50' : log.foodType === 'fruits' ? 'bg-rose-50' : 'bg-amber-50'
                  }`}>
                    {getFoodIcon(log.foodType)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-slate-800 capitalize tracking-tight">{log.foodType}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-[11px] font-black text-slate-700 tracking-tight">{log.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DietTracker;