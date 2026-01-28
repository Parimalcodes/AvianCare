
import React, { useState } from 'react';
import { Bird, DietLog } from '../types';
import { getBirdAdvice, analyzeDietBalance, getSpeciesFactsheet } from '../services/geminiService';
import { BrainCircuit, Sparkles, MessageCircle, BarChart3, Loader2, BookOpen, Globe, ChevronDown } from 'lucide-react';

interface AIAdvisorProps {
  birds: Bird[];
  dietLogs: DietLog[];
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Hindi', 'Gujarati', 'Arabic', 'Chinese', 'Portuguese', 'Bengali', 'Russian'
];

const AIAdvisor: React.FC<AIAdvisorProps> = ({ birds, dietLogs }) => {
  const [query, setQuery] = useState('');
  const [selectedBirdId, setSelectedBirdId] = useState(birds[0]?.id || '');
  const [selectedLang, setSelectedLang] = useState('English');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'analysis' | 'handbook'>('chat');

  const selectedBird = birds.find(b => b.id === selectedBirdId);

  const calculateCurrentAgeStr = (bird: Bird) => {
    if (!bird.birthDate) return 'unknown';
    const birth = new Date(bird.birthDate);
    const now = new Date();
    const diff = now.getTime() - birth.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const handleAsk = async () => {
    if (!query || !selectedBird) return;
    setIsLoading(true);
    const contextWithAge = {
      ...selectedBird,
      currentAge: calculateCurrentAgeStr(selectedBird)
    };
    const advice = await getBirdAdvice(selectedBird.species, query, contextWithAge, selectedLang);
    setResponse(advice || 'No response from AI.');
    setIsLoading(false);
  };

  const handleAnalyze = async () => {
    if (!selectedBird) return;
    setIsLoading(true);
    const birdLogs = dietLogs.filter(l => l.birdId === selectedBirdId);
    const analysis = await analyzeDietBalance(birdLogs, selectedBird.species, selectedLang);
    setResponse(analysis || 'Unable to analyze.');
    setIsLoading(false);
  };

  const handleHandbook = async () => {
    if (!selectedBird) return;
    setIsLoading(true);
    const factSheet = await getSpeciesFactsheet(selectedBird.species, selectedLang);
    setResponse(factSheet || 'Handbook unavailable.');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Avian Coach</h2>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Expert Systems Active</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-200/50 p-1.5 rounded-3xl gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'chat', icon: MessageCircle, label: 'Chat' },
          { id: 'analysis', icon: BarChart3, label: 'Health' },
          { id: 'handbook', icon: BookOpen, label: 'Handbook' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveMode(tab.id as any); setResponse(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeMode === tab.id ? 'bg-white shadow-xl text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Preferred Coaching Language:</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-11 pr-10 py-4 text-sm font-bold text-slate-800 focus:border-blue-500 outline-none transition-all appearance-none uppercase"
              >
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Selecting Expert Focus For:</label>
            <div className="relative">
              <select 
                value={selectedBirdId}
                onChange={e => setSelectedBirdId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:border-blue-500 outline-none transition-all appearance-none"
                required
              >
                {birds.map(b => <option key={b.id} value={b.id}>{b.name} ({b.species})</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {activeMode === 'chat' && (
          <div className="space-y-4">
            <textarea 
              rows={4}
              placeholder={`Ask anything about ${selectedBird?.name}'s behavior, health, or habits...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-5 py-5 text-sm font-medium focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
            <button 
              onClick={handleAsk}
              disabled={isLoading || !query}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              Consult Expert ({selectedLang})
            </button>
          </div>
        )}

        {activeMode === 'analysis' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-xs text-blue-700 font-medium text-center leading-relaxed">AI will analyze the last week of diet logs and medication status to provide a metabolic health assessment in {selectedLang}.</p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
              Full Health Audit
            </button>
          </div>
        )}

        {activeMode === 'handbook' && (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium text-center leading-relaxed">Unlock the complete species profile for <b>{selectedBird?.species}</b> in {selectedLang}.</p>
            </div>
            <button 
              onClick={handleHandbook}
              disabled={isLoading}
              className="w-full bg-amber-500 text-white font-black py-5 rounded-[24px] shadow-xl shadow-amber-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              Open Encyclopedia
            </button>
          </div>
        )}
      </div>

      {response && (
        <div className="bg-white border border-slate-100 rounded-[32px] p-7 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Expert Intelligence Report ({selectedLang})</h4>
            </div>
            <button onClick={() => setResponse('')} className="text-slate-300 hover:text-slate-500 text-xs font-bold uppercase tracking-widest">Close</button>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4">
            {response.split('\n').map((line, i) => {
              if (line.startsWith('#') || line.startsWith('**')) {
                return <h3 key={i} className="text-slate-900 font-black pt-2 text-base">{line.replace(/[#*]/g, '')}</h3>
              }
              return <p key={i} className="whitespace-pre-wrap">{line}</p>
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">AV</div>
             <p className="text-[9px] text-slate-400 italic">This AI recommendation is based on general avian science. Consult a certified Avian Vet (ABVP) for critical medical emergencies.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
