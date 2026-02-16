
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bird, 
  Medication, 
  DietLog, 
  Task, 
  AppState 
} from './types';
import Dashboard from './components/Dashboard';
import BirdProfile from './components/BirdProfile';
import AddBirdModal from './components/AddBirdModal';
import MedicationManager from './components/MedicationManager';
import DietTracker from './components/DietTracker';
import AIAdvisor from './components/AIAdvisor';
import SplashScreen from './components/SplashScreen';
import { 
  Plus, 
  LayoutDashboard, 
  Bird as BirdIcon, 
  Pill, 
  Utensils, 
  BrainCircuit,
  Bell,
  Settings
} from 'lucide-react';

const App: React.FC = () => {
  const STORAGE_KEY = 'avian_care_v2';

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'birds' | 'meds' | 'diet' | 'ai'>('dashboard');
  const [birds, setBirds] = useState<Bird[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isAddBirdOpen, setIsAddBirdOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: AppState = JSON.parse(saved);
        setBirds(data.birds || []);
        setMedications(data.medications || []);
        setDietLogs(data.dietLogs || []);
        setCompletedTaskIds(data.completedTasks || []);
      } catch (e) {
        console.error("Error loading state", e);
      }
    }
  }, []);

  useEffect(() => {
    const state: AppState = {
      birds,
      medications,
      dietLogs,
      completedTasks: completedTaskIds
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [birds, medications, dietLogs, completedTaskIds]);

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const todayTasks = useMemo(() => {
    const tasks: Task[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    medications.forEach(med => {
      if (!med.isActive) return;
      med.times.forEach((time, index) => {
        const taskId = `${med.id}-${todayStr}-${index}`;
        tasks.push({
          id: taskId,
          birdId: med.birdId,
          title: `Medicine: ${med.name}`,
          type: 'medication',
          dueTime: time,
          isCompleted: completedTaskIds.includes(taskId),
          medicationId: med.id
        });
      });
    });

    birds.forEach(bird => {
      const dietTaskId = `${bird.id}-${todayStr}-diet`;
      tasks.push({
        id: dietTaskId,
        birdId: bird.id,
        title: `Feed ${bird.name}`,
        type: 'diet',
        dueTime: "08:00",
        isCompleted: completedTaskIds.includes(dietTaskId)
      });
    });

    return tasks.sort((a, b) => a.dueTime.localeCompare(b.dueTime));
  }, [medications, birds, completedTaskIds]);

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      
      let count = 0;
      todayTasks.forEach(task => {
        if (task.isCompleted) return;
        const [h, m] = task.dueTime.split(':').map(Number);
        if (currentH > h || (currentH === h && currentM >= m)) {
          count++;
          if (notificationsEnabled && count === 1 && Math.random() > 0.8) { 
            new Notification("Feather Alert!", {
              body: `Don't forget: ${task.title} for your bird!`,
              icon: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png"
            });
          }
        }
      });
      setOverdueCount(count);
    };

    const interval = setInterval(checkTasks, 15000);
    checkTasks();
    return () => clearInterval(interval);
  }, [todayTasks, notificationsEnabled]);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleAddBird = (bird: Omit<Bird, 'id'>) => {
    const newBird: Bird = { ...bird, id: Date.now().toString() };
    setBirds(prev => [...prev, newBird]);
    setIsAddBirdOpen(false);
  };

  const deleteBird = (id: string) => {
    setBirds(prev => prev.filter(b => b.id !== id));
    setMedications(prev => prev.filter(m => m.birdId !== id));
    setDietLogs(prev => prev.filter(d => d.birdId !== id));
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-slate-50 relative overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute -bottom-24 right-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float [animation-delay:4s]" />

      {overdueCount > 0 && (
        <div className="bg-rose-500 text-white px-5 py-4 flex items-center justify-between text-[11px] font-black animate-in slide-in-from-top duration-500 sticky top-0 z-[60] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bell className="w-4 h-4 animate-ring" />
            </div>
            <span className="uppercase tracking-[0.1em]">Action Required: {overdueCount} care tasks</span>
          </div>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="bg-white text-rose-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest active:scale-95 transition-transform"
          >
            Fix Now
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-32 p-6 relative z-10 no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard birds={birds} tasks={todayTasks} onToggleTask={toggleTaskCompletion} />}
        {activeTab === 'birds' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your flock</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your feather friends</p>
              </div>
              <button onClick={() => setIsAddBirdOpen(true)} className="bg-blue-600 text-white p-4 rounded-[22px] shadow-[0_15px_30px_rgba(37,99,235,0.3)] active:scale-90 transition-transform">
                <Plus className="w-6 h-6" />
              </button>
            </div>
            {birds.length === 0 ? (
              <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-[40px] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BirdIcon className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold text-sm">No birds in your aviary yet.</p>
                <button onClick={() => setIsAddBirdOpen(true)} className="mt-6 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Add First Bird</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {birds.map(bird => <BirdProfile key={bird.id} bird={bird} onDelete={() => deleteBird(bird.id)} />)}
              </div>
            )}
          </div>
        )}
        {activeTab === 'meds' && <MedicationManager birds={birds} medications={medications} setMedications={setMedications} />}
        {activeTab === 'diet' && <DietTracker birds={birds} dietLogs={dietLogs} setDietLogs={setDietLogs} />}
        {activeTab === 'ai' && <AIAdvisor birds={birds} dietLogs={dietLogs} />}
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[70] transition-all">
        <nav className="glass rounded-[32px] flex justify-around items-center h-20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] px-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'birds', icon: BirdIcon, label: 'Aviary' },
            { id: 'meds', icon: Pill, label: 'Health' },
            { id: 'diet', icon: Utensils, label: 'Diet' },
            { id: 'ai', icon: BrainCircuit, label: 'Coach' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 w-14 h-14 rounded-2xl justify-center ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl scale-110 -translate-y-2' : 'text-slate-400 hover:text-slate-600 active:scale-90'}`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === item.id ? 'block' : 'hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {!notificationsEnabled && (
        <button onClick={requestNotifications} className="fixed bottom-28 right-6 bg-white/80 backdrop-blur-md border border-slate-100 text-slate-800 p-4 rounded-full shadow-xl z-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in duration-1000">
          <Bell className="w-4 h-4 text-blue-500" /> Enable Alerts
        </button>
      )}

      {isAddBirdOpen && <AddBirdModal onClose={() => setIsAddBirdOpen(false)} onAdd={handleAddBird} />}
    </div>
  );
};

export default App;
