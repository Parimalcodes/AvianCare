
import React, { useState } from 'react';
import { Bird, Medication } from '../types';
import { Plus, X, Pill, Trash2, Clock, Calendar, Thermometer } from 'lucide-react';

interface MedicationManagerProps {
  birds: Bird[];
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

const MedicationManager: React.FC<MedicationManagerProps> = ({ birds, medications, setMedications }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    birdId: birds[0]?.id || '',
    name: '',
    dosage: '',
    frequency: 'daily' as 'daily' | 'twice-daily' | 'weekly',
    time1: '08:00',
    time2: '20:00'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const times = formData.frequency === 'twice-daily' 
      ? [formData.time1, formData.time2]
      : [formData.time1];

    const newMed: Medication = {
      id: Date.now().toString(),
      birdId: formData.birdId,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      times: times,
      startDate: new Date().toISOString(),
      isActive: true
    };

    setMedications(prev => [...prev, newMed]);
    setIsAdding(false);
  };

  const removeMed = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Medical Schedules</p>
        </div>
        <button 
          disabled={birds.length === 0}
          onClick={() => setIsAdding(true)}
          className={`bg-rose-600 text-white p-4 rounded-[22px] shadow-[0_15px_30px_rgba(225,29,72,0.3)] active:scale-90 transition-all ${birds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Treatment</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400"><X /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Bird</label>
                <select 
                  value={formData.birdId}
                  onChange={e => setFormData({...formData, birdId: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                  required
                >
                  {birds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Name</label>
                <input 
                  placeholder="e.g. Enrofloxacin"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                  <input 
                    placeholder="0.1ml"
                    value={formData.dosage}
                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                  <select 
                    value={formData.frequency}
                    onChange={e => setFormData({...formData, frequency: e.target.value as any})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                  >
                    <option value="daily">Once Daily</option>
                    <option value="twice-daily">Twice Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administration Times</label>
                <div className="flex gap-3">
                  <input 
                    type="time" 
                    value={formData.time1}
                    onChange={e => setFormData({...formData, time1: e.target.value})}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                  />
                  {formData.frequency === 'twice-daily' && (
                    <input 
                      type="time" 
                      value={formData.time2}
                      onChange={e => setFormData({...formData, time2: e.target.value})}
                      className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-rose-500 transition-all"
                    />
                  )}
                </div>
              </div>
              
              <button className="w-full bg-rose-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-rose-200 active:scale-95 transition-all mt-4 uppercase tracking-widest text-[10px]">Initialize Schedule</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {medications.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No medical records found.</p>
          </div>
        ) : (
          medications.map(med => {
            const bird = birds.find(b => b.id === med.birdId);
            return (
              <div key={med.id} className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex items-center justify-between transition-all duration-300 group">
                <div className="flex items-center gap-5">
                  <div className="bg-rose-50 p-4 rounded-[22px] shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Pill className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-[15px] tracking-tight">{med.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded-md">{med.dosage}</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {bird?.name || 'Aviary Member'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {med.times.map((t, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 text-[9px] font-black bg-slate-100 px-2.5 py-1 rounded-full text-slate-500 uppercase tracking-widest">
                          <Clock className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeMed(med.id)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MedicationManager;