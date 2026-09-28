import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Plus, 
  MessageSquare, 
  Send, 
  Copy, 
  RefreshCw, 
  BookmarkPlus, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { aiService } from '../../../services/aiService';

const MOCK_HISTORY = [
  { id: '1', title: 'Weekly AI Review - Oct 14', topic: 'Review', pinned: true },
  { id: '2', title: 'React Native Study Plan', topic: 'Study Plan', pinned: false },
  { id: '3', title: 'Burnout Recovery', topic: 'Burnout', pinned: false },
  { id: '4', title: 'Skill Gap: System Design', topic: 'Skill Gap', pinned: false },
];

const MOCK_CHAT = [
  { role: 'assistant', content: "Welcome back! I noticed you're 3 hours behind on your React Native goal this week, but your focus quality has been excellent (8.4/10). What would you like to tackle today?" },
  { role: 'user', content: 'I keep getting distracted when I try to read the navigation docs.' },
  { role: 'assistant', content: "I see that pattern in your Focus Center data. You often get distracted during \"reading\" sessions compared to \"coding\" sessions.\n\nLet's try a different approach:\n1. Break the reading into 15-minute micro-sessions.\n2. Immediately implement what you read in a sandbox app.\n\nShould I generate a 60-minute alternating reading/coding schedule for you now?" }
];

const SUGGESTIONS = [
  "Build me a study roadmap",
  "Analyze my skill gaps",
  "Optimize my schedule",
  "My goal is behind — help",
  "I keep getting distracted",
  "What should I focus on today",
  "Generate my weekly review"
];

const AICoachPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState(MOCK_CHAT);

  const handleSend = async (text: string) => {
    if(!text.trim()) return;
    
    // Optimistic UI update
    const userMsg = { role: 'user', content: text };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.generateResponse(text, 'You are MAVERICK, an expert AI learning coach. The user is a developer focusing on React Native and System Design. Be concise, actionable, and encouraging.');
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Connection to AI cluster failed. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getTopicColor = (topic: string) => {
    switch(topic) {
      case 'Review': return 'text-purple-400 bg-purple-400/10';
      case 'Study Plan': return 'text-cyan-400 bg-cyan-400/10';
      case 'Burnout': return 'text-orange-400 bg-orange-400/10';
      case 'Skill Gap': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden border-t border-slate-800">
      
      {/* LEFT PANEL: HISTORY */}
      <div className="w-full lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50 flex flex-col h-full">
        <div className="p-4 border-b border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={18} /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 mt-2">Pinned</div>
          {MOCK_HISTORY.filter(h => h.pinned).map(chat => (
            <button key={chat.id} className="w-full flex flex-col items-start p-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all text-left group">
               <div className="flex items-center justify-between w-full mb-1">
                 <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 truncate pr-2">{chat.title}</span>
                 <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap ${getTopicColor(chat.topic)}`}>{chat.topic}</span>
               </div>
               <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> Auto-generated</span>
            </button>
          ))}

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 mt-4">Recent</div>
          {MOCK_HISTORY.filter(h => !h.pinned).map(chat => (
            <button key={chat.id} className="w-full flex flex-col items-start p-3 rounded-xl border border-transparent hover:bg-slate-900 transition-all text-left group">
               <div className="flex items-center justify-between w-full mb-1">
                 <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 truncate pr-2">{chat.title}</span>
               </div>
               <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase whitespace-nowrap ${getTopicColor(chat.topic)}`}>{chat.topic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT INTERFACE */}
      <div className="flex-1 flex flex-col bg-slate-950 relative h-[calc(100vh-180px)] lg:h-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/50">
               <BrainCircuit size={20} />
             </div>
             <div>
               <h2 className="text-lg font-black text-slate-100">MAVERICK AI Coach</h2>
               <p className="text-xs text-indigo-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"/> Online & Context-Aware</p>
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 pb-32 scrollbar-hide space-y-6">
           {chatHistory.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                 <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                 
                 {msg.role === 'assistant' && (
                   <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/50">
                     <button className="text-slate-500 hover:text-slate-300 transition-colors" title="Copy"><Copy size={14}/></button>
                     <button className="text-slate-500 hover:text-indigo-400 transition-colors" title="Regenerate"><RefreshCw size={14}/></button>
                     <button className="text-slate-500 hover:text-emerald-400 transition-colors ml-auto flex items-center gap-1 text-xs font-bold">
                       <BookmarkPlus size={14}/> Save to Journal
                     </button>
                   </div>
                 )}
               </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0.1s'}} />
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0.2s'}} />
               </div>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-4xl mx-auto">
            
            {/* Quick Suggestions Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {SUGGESTIONS.map(s => (
                <button key={s} className="shrink-0 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors">
                  {s}
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your coach anything..." 
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-4 pr-12 py-4 rounded-2xl outline-none focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all"
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && input.trim()) {
                    handleSend(input);
                  }
                }}
              />
              <button 
                onClick={() => handleSend(input)}
                className={`absolute right-3 p-2 rounded-xl transition-colors ${input.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-500'}`}
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2">AI Coach has full context of your skills, goals, and focus sessions.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AICoachPage;
