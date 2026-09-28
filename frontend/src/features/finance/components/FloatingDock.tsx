import React from 'react';
import { Bot, Plus, Mic, AlertOctagon } from 'lucide-react';

interface Props {
  onOpenAI: () => void;
  onOpenEmergency: () => void;
  onAddExpense: () => void;
}

const FloatingDock: React.FC<Props> = ({ onOpenAI, onOpenEmergency, onAddExpense }) => {
  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported. Please use Chrome or Edge.'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript.toLowerCase();
      if (t.includes('open ai') || t.includes('assistant')) onOpenAI();
      else if (t.includes('emergency')) onOpenEmergency();
      else if (t.includes('expense') || t.includes('add')) onAddExpense();
    };
    rec.start();
  };

  const actions = [
    { id: 'ai',        icon: Bot,          label: 'AI Assistant', handler: onOpenAI,       cls: 'bg-cyan-500 hover:bg-cyan-400',  glow: 'shadow-cyan-500/25' },
    { id: 'add',       icon: Plus,         label: 'Add Expense',  handler: onAddExpense,   cls: 'bg-slate-700 hover:bg-slate-600', glow: '' },
    { id: 'voice',     icon: Mic,          label: 'Voice',        handler: handleVoice,    cls: 'bg-slate-700 hover:bg-slate-600', glow: '' },
    { id: 'emergency', icon: AlertOctagon, label: 'Emergency',    handler: onOpenEmergency,cls: 'bg-red-600 hover:bg-red-500',     glow: 'shadow-red-500/25' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {actions.map(({ id, icon: Icon, label, handler, cls, glow }) => (
        <div key={id} className="flex items-center gap-2 group">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            {label}
          </span>
          <button
            onClick={handler}
            aria-label={label}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${cls} ${glow ? `shadow-lg ${glow}` : ''} transition-all duration-200 hover:scale-110 active:scale-95 border border-white/10`}
          >
            <Icon size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FloatingDock;
