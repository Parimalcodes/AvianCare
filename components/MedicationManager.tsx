
import React, { useState } from 'react';
import { Bird, Medication } from '../types';
import { Plus, X, Pill, Trash2, Clock } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Medications</h2>
        <button 
          disabled={birds.length === 0}
          onClick={() => setIsAdding(true)}
          className={`bg-orange-500 text-white p-2 rounded-full shadow-lg ${birds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 animate-in slide-in-from-top-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-orange-600">New Schedule</h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <select 
              value={formData.birdId}
              onChange={e => setFormData({...formData, birdId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              required
            >
              {birds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input 
              placeholder="Medication name (e.g. Enrofloxacin)"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              required
            />
            <input 
              placeholder="Dosage (e.g. 0.1ml)"
              value={formData.dosage}
              onChange={e => setFormData({...formData, dosage: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              required
            />
            <select 
              value={formData.frequency}
              onChange={e => setFormData({...formData, frequency: e.target.value as any})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
            >
              <option value="daily">Once Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="weekly">Once Weekly</option>
            </select>
            
            <div className="flex gap-2">
              <input 
                type="time" 
                value={formData.time1}
                onChange={e => setFormData({...formData, time1: e.target.value})}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              />
              {formData.frequency === 'twice-daily' && (
                <input 
                  type="time" 
                  value={formData.time2}
                  onChange={e => setFormData({...formData, time2: e.target.value})}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              )}
            </div>
            
            <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">Save Medication</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {medications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Pill className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No medications recorded.</p>
          </div>
        ) : (
          medications.map(med => {
            const bird = birds.find(b => b.id === med.birdId);
            return (
              <div key={med.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <Pill className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{med.name} ({med.dosage})</h4>
                    <p className="text-xs text-slate-400">{bird?.name || 'Unknown bird'} • {med.frequency}</p>
                    <div className="flex gap-2 mt-1">
                      {med.times.map((t, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                          <Clock className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeMed(med.id)} className="p-2 text-slate-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
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
