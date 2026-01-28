
import React, { useState } from 'react';
import { Bird, DietLog } from '../types';
import { Utensils, History, PlusCircle } from 'lucide-react';

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

  const filteredLogs = dietLogs.filter(l => l.birdId === selectedBirdId).slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Diet Tracker</h2>

      {/* Log Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Log Today's Food</h3>
        <form onSubmit={handleLogDiet} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={selectedBirdId}
              onChange={e => setSelectedBirdId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              {birds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select 
              value={foodType}
              onChange={e => setFoodType(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pellets">Pellets</option>
              <option value="seeds">Seeds</option>
              <option value="vegetables">Veggies</option>
              <option value="fruits">Fruits</option>
              <option value="treats">Treats</option>
            </select>
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Amount (e.g. 2 tbsp)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button type="submit" className="bg-emerald-500 text-white p-3 rounded-xl">
              <PlusCircle />
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Logs</h3>
        </div>
        {filteredLogs.length === 0 ? (
          <p className="text-center py-8 text-slate-400 text-sm">No diet logs yet.</p>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  log.foodType === 'vegetables' ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  <Utensils className={`w-4 h-4 ${
                    log.foodType === 'vegetables' ? 'text-green-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 capitalize">{log.foodType}</h4>
                  <p className="text-[10px] text-slate-400">{new Date(log.date).toLocaleString()}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{log.amount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DietTracker;
