
import React from 'react';
import { Bird, Task } from '../types';
import { CheckCircle2, Circle, Clock, Pill, Utensils, ChevronRight } from 'lucide-react';

interface DashboardProps {
  birds: Bird[];
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ birds, tasks, onToggleTask }) => {
  const completed = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  const isOverdue = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return currentH > h || (currentH === h && currentM > m);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-1 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Daily Overview</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Hello, Caretaker</h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-200 shadow-inner overflow-hidden border-2 border-white">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header>

      {/* Progress Card - Premium Style */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.3)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Today's Goals</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {completed}<span className="text-slate-500 text-3xl mx-1">/</span>{tasks.length}
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <CheckCircle2 className="text-emerald-400 w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60 px-1">
              <span>Completion Progress</span>
              <span className="text-emerald-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List Section */}
      <div className="space-y-5">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Care Schedule</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort: Time</span>
        </div>
        
        {tasks.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-sm">All clear! No tasks for today.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map(task => {
              const bird = birds.find(b => b.id === task.birdId);
              const overdue = isOverdue(task.dueTime) && !task.isCompleted;

              return (
                <div 
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`group relative overflow-hidden flex items-center gap-5 p-5 rounded-[32px] border-2 transition-all duration-300 cursor-pointer active:scale-95 ${
                    task.isCompleted 
                      ? 'bg-slate-50/80 border-transparent opacity-60' 
                      : overdue 
                        ? 'bg-rose-50 border-rose-100 shadow-sm' 
                        : 'bg-white border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  <div className={`p-4 rounded-2xl transition-all duration-300 ${
                    task.isCompleted ? 'bg-slate-200' : task.type === 'medication' ? 'bg-orange-100 shadow-inner' : 'bg-emerald-100 shadow-inner'
                  }`}>
                    {task.type === 'medication' 
                      ? <Pill className={`w-6 h-6 ${task.isCompleted ? 'text-slate-400' : 'text-orange-600'}`} />
                      : <Utensils className={`w-6 h-6 ${task.isCompleted ? 'text-slate-400' : 'text-emerald-600'}`} />
                    }
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-black text-[15px] tracking-tight ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${overdue ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3" />
                        {task.dueTime}
                      </div>
                      {bird && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-blue-500 opacity-50" />
                          {bird.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {task.isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-all scale-110">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full border-4 transition-all ${overdue ? 'border-rose-200 bg-rose-50' : 'border-slate-50 bg-slate-50 group-hover:border-blue-100'}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;