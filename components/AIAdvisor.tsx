
import React, { useState } from 'react';
import { Bird, DietLog } from '../types';
import { getBirdAdvice, analyzeDietBalance, getSpeciesFactsheet } from '../services/geminiService';
import { BrainCircuit, Sparkles, MessageCircle, BarChart3, Loader2, BookOpen, Globe, ChevronDown, Wand2 } from 'lucide-react';

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
    setResponse('');
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
    setResponse('');
    const birdLogs = dietLogs.filter(l => l.birdId === selectedBirdId);
    const analysis = await analyzeDietBalance(birdLogs, selectedBird.species, selectedLang);
    setResponse(analysis || 'Unable to analyze.');
    setIsLoading(false);
  };

  const handleHandbook = async () => {
    if (!selectedBird) return;
    setIsLoading(true);
    setResponse('');
    const factSheet = await getSpeciesFactsheet(selectedBird.species, selectedLang);
    setResponse(factSheet || 'Handbook unavailable.');
    setIsLoading(false);
  };

  const modeColors = {
    chat: 'from-blue-600 to-indigo-600',
    analysis: 'from-emerald-600 to-teal-600',
    handbook: 'from-amber-500 to-orange-600'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-3xl shadow-2xl bg-gradient-to-br ${modeColors[activeMode]} transition-all duration-500`}>
            <BrainCircuit className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Avian Coach</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse bg-emerald-500`}></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Neural Expert Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Mode Switcher */}
      <div className="relative p-1.5 bg-slate-200/40 backdrop-blur-md rounded-[32px] flex gap-1 border border-white/50 shadow-inner">
        {[
          { id: 'chat', icon: MessageCircle, label: 'Chat' },
          { id: 'analysis', icon: BarChart3, label: 'Health' },
          { id: 'handbook', icon: BookOpen, label: 'Handbook' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveMode(tab.id as any); setResponse(''); }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 px-2 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeMode === tab.id ? `bg-white shadow-xl text-slate-900` : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'}`}
          >
            <tab.icon className={`w-5 h-5 mb-0.5 ${activeMode === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100/50 space-y-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative space-y-6">
          {/* 1. Language First */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Coaching Language</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-blue-50 rounded-xl">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <select 
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent hover:border-blue-100 focus:border-blue-500 focus:bg-white rounded-[24px] pl-16 pr-12 py-5 text-sm font-bold text-slate-800 transition-all appearance-none outline-none shadow-sm"
              >
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
            </div>
          </div>

          {/* 2. Focus Bird Second */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Expert Focus For</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 rounded-xl">
                <Wand2 className="w-4 h-4 text-indigo-600" />
              </div>
              <select 
                value={selectedBirdId}
                onChange={e => setSelectedBirdId(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent hover:border-indigo-100 focus:border-indigo-500 focus:bg-white rounded-[24px] pl-16 pr-12 py-5 text-sm font-bold text-slate-800 transition-all appearance-none outline-none shadow-sm"
                required
              >
                {birds.map(b => <option key={b.id} value={b.id}>{b.name} ({b.species})</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full" />

        {/* Action Sections */}
        {activeMode === 'chat' && (
          <div className="space-y-6 animate-in slide-in-from-top-2">
            <div className="relative">
              <textarea 
                rows={4}
                placeholder={`Type in any language about ${selectedBird?.name}...`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[32px] px-7 py-7 text-sm font-medium outline-none transition-all placeholder:text-slate-300 shadow-inner resize-none"
              />
              <div className="absolute bottom-5 right-5">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-100 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[9px] font-black text-slate-400 uppercase">Pro Mode Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAsk}
              disabled={isLoading || !query}
              className={`w-full bg-gradient-to-r ${modeColors.chat} text-white font-black py-6 rounded-[32px] shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 hover:scale-[1.02] transition-all uppercase tracking-[0.15em] text-xs`}
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              Generate Insight ({selectedLang})
            </button>
          </div>
        )}

        {activeMode === 'analysis' && (
          <div className="space-y-6 animate-in slide-in-from-top-2">
            <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                Our AI will perform a deep metabolic audit using your recent diet logs and medication data to check for deficiencies or imbalances.
              </p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${modeColors.analysis} text-white font-black py-6 rounded-[32px] shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 hover:scale-[1.02] transition-all uppercase tracking-[0.15em] text-xs`}
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
              Run Health Audit
            </button>
          </div>
        )}

        {activeMode === 'handbook' && (
          <div className="space-y-6 animate-in slide-in-from-top-2">
            <div className="bg-amber-50/50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs text-amber-800 font-bold leading-relaxed">
                Access a deep species-specific knowledge base for <b>{selectedBird?.species}</b>, optimized for your environment.
              </p>
            </div>
            <button 
              onClick={handleHandbook}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r ${modeColors.handbook} text-white font-black py-6 rounded-[32px] shadow-2xl shadow-amber-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 hover:scale-[1.02] transition-all uppercase tracking-[0.15em] text-xs`}
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
              Fetch Encyclopedia
            </button>
          </div>
        )}
      </div>

      {/* Premium Result Section */}
      {response && (
        <div className="bg-white border-2 border-slate-50 rounded-[48px] p-10 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.12)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${modeColors[activeMode]}`} />
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${modeColors[activeMode]} text-white shadow-lg`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Expert Report</h4>
                <p className="text-sm font-black text-slate-900">Delivered in {selectedLang}</p>
              </div>
            </div>
            <button 
              onClick={() => setResponse('')} 
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest transition-all"
            >
              Clear
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-6">
            {response.split('\n').map((line, i) => {
              if (line.trim().length === 0) return null;
              if (line.startsWith('#') || line.startsWith('**') || (line.includes(':') && line.length < 50)) {
                return (
                  <div key={i} className="flex items-center gap-3 pt-4 first:pt-0">
                    <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${modeColors[activeMode]}`} />
                    <h3 className="text-slate-900 font-black text-lg tracking-tight">
                      {line.replace(/[#*]/g, '').replace(':', '')}
                    </h3>
                  </div>
                );
              }
              return (
                <p key={i} className="pl-4 text-base font-medium text-slate-600 leading-[1.8] tracking-tight">
                  {line}
                </p>
              );
            })}
          </div>

          <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center gap-6">
             <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shadow-inner">AI</div>
             <div className="flex-1 text-center sm:text-left">
               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Medical Disclaimer</p>
               <p className="text-[10px] text-slate-400 italic leading-relaxed">This neural recommendation is synthesized from large avian datasets. Always verify critical symptoms with a board-certified Avian Specialist.</p>
             </div>
          </div>
        </div>
      )}

      {/* Loading Shimmer Placeholder */}
      {isLoading && (
        <div className="bg-white/50 backdrop-blur-md rounded-[48px] p-12 border border-white/50 space-y-8 animate-pulse">
           <div className="flex gap-4">
             <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
             <div className="space-y-2 flex-1">
               <div className="h-4 bg-slate-200 rounded-full w-1/3" />
               <div className="h-3 bg-slate-100 rounded-full w-1/4" />
             </div>
           </div>
           <div className="space-y-4 pt-4">
             <div className="h-4 bg-slate-100 rounded-full w-full" />
             <div className="h-4 bg-slate-100 rounded-full w-[90%]" />
             <div className="h-4 bg-slate-100 rounded-full w-[95%]" />
             <div className="h-4 bg-slate-100 rounded-full w-[80%]" />
           </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
