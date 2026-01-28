
import React from 'react';
import { Bird, Task } from '../types';
import { CheckCircle2, Circle, Clock, Pill, Utensils } from 'lucide-react';

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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Good Morning!</h1>
        <p className="text-slate-500 text-sm">Here's your schedule for today.</p>
      </header>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Daily Progress</p>
            <h2 className="text-3xl font-bold text-slate-800">{completed}/{tasks.length}</h2>
          </div>
          <p className="text-emerald-500 font-semibold">{Math.round(progress)}%</p>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 px-1">Today's Care</h3>
        {tasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-300">
            <p className="text-slate-400">No tasks scheduled. Add some birds or medications!</p>
          </div>
        ) : (
          tasks.map(task => {
            const bird = birds.find(b => b.id === task.birdId);
            const overdue = isOverdue(task.dueTime) && !task.isCompleted;

            return (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                  task.isCompleted 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : overdue 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  task.isCompleted ? 'bg-slate-200' : task.type === 'medication' ? 'bg-orange-100' : 'bg-emerald-100'
                }`}>
                  {task.type === 'medication' 
                    ? <Pill className={`w-5 h-5 ${task.isCompleted ? 'text-slate-400' : 'text-orange-600'}`} />
                    : <Utensils className={`w-5 h-5 ${task.isCompleted ? 'text-slate-400' : 'text-emerald-600'}`} />
                  }
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span className={overdue ? 'text-red-500 font-bold' : ''}>
                      {task.dueTime} {overdue && '(Overdue)'}
                    </span>
                    {bird && <span>• {bird.name}</span>}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className={`w-6 h-6 ${overdue ? 'text-red-400' : 'text-slate-300'}`} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
