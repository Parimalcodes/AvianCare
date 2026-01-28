
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
  Bell
} from 'lucide-react';

const App: React.FC = () => {
  const STORAGE_KEY = 'avian_care_v1';

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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden">
      {overdueCount > 0 && (
        <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between text-xs font-bold animate-pulse sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-ring" />
            <span>URGENT: {overdueCount} CARE TASKS PENDING</span>
          </div>
          <button onClick={() => setActiveTab('dashboard')} className="bg-white text-red-600 px-3 py-1 rounded-full text-[10px] uppercase">FIX NOW</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-28 p-5">
        {activeTab === 'dashboard' && <Dashboard birds={birds} tasks={todayTasks} onToggleTask={toggleTaskCompletion} />}
        {activeTab === 'birds' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-black text-slate-900">Aviary</h1>
              <button onClick={() => setIsAddBirdOpen(true)} className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-200"><Plus className="w-6 h-6" /></button>
            </div>
            {birds.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <BirdIcon className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 font-medium">Your flock is empty.</p>
                <button onClick={() => setIsAddBirdOpen(true)} className="mt-4 text-blue-600 font-bold text-sm">Add your first bird</button>
              </div>
            ) : birds.map(bird => <BirdProfile key={bird.id} bird={bird} onDelete={() => deleteBird(bird.id)} />)}
          </div>
        )}
        {activeTab === 'meds' && <MedicationManager birds={birds} medications={medications} setMedications={setMedications} />}
        {activeTab === 'diet' && <DietTracker birds={birds} dietLogs={dietLogs} setDietLogs={setDietLogs} />}
        {activeTab === 'ai' && <AIAdvisor birds={birds} dietLogs={dietLogs} />}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center h-24 safe-area-bottom shadow-2xl z-40 px-4">
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
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 px-3 py-2 rounded-2xl ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      {!notificationsEnabled && (
        <button onClick={requestNotifications} className="fixed bottom-28 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Bell className="w-4 h-4" /> Enable Alerts
        </button>
      )}

      {isAddBirdOpen && <AddBirdModal onClose={() => setIsAddBirdOpen(false)} onAdd={handleAddBird} />}
    </div>
  );
};

export default App;
