// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Bot, X, Send, Sparkles, Mic, MicOff,
//   Heart, Activity, Zap, Moon, Footprints, Brain, ChevronRight, Waves,
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Message {
//   id: string;
//   sender: 'user' | 'ai';
//   text: string;
//   timestamp: Date;
// }

// interface HealthData {
//   heartRate: number;
//   bloodPressure: number;
//   hrv: number;
//   steps: number;
//   sleep: number;
//   calories: number;
//   stressScore: number;
//   stressLevel: string;
//   energyScore: number;
//   energyLevel: string;
// }

// interface Props {
//   healthData: HealthData;
//   isOpen: boolean;
//   onClose: () => void;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const SUGGESTIONS = [
//   'How is my heart rate today?',
//   'Am I stressed right now?',
//   'How can I improve my sleep?',
//   'What does my HRV mean?',
//   'Give me an energy boost tip',
//   'How do my vitals compare to normal?',
//   'Recommend a workout for today',
//   'What should I eat to hit my macros?',
// ];

// const QUICK_ACTIONS = [
//   {
//     label: 'Full Vitals Summary',
//     prompt:
//       'Give me a complete, detailed summary of all my current vitals and what they indicate about my overall health status.',
//   },
//   {
//     label: 'Sleep & Recovery',
//     prompt:
//       'Based on my sleep hours and HRV, analyze my sleep quality and give me specific, actionable recovery recommendations.',
//   },
//   {
//     label: 'Stress Analysis',
//     prompt:
//       'Analyze my stress level based on my heart rate, blood pressure, and HRV. What are the root causes and what should I do?',
//   },
//   {
//     label: 'Energy Optimization',
//     prompt:
//       'Based on my current energy score and steps, create a personalized energy optimization plan for the rest of today.',
//   },
//   {
//     label: 'Workout Advice',
//     prompt:
//       'Based on my current vitals and recovery status, what type of workout intensity is appropriate for me today?',
//   },
//   {
//     label: 'Nutrition Guidance',
//     prompt:
//       'Based on my calorie intake and activity levels, give me specific nutrition advice and macronutrient targets for today.',
//   },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const TypingDots = () => (
//   <div className="flex gap-1 items-center h-5 px-1">
//     {[0, 1, 2].map((i) => (
//       <span
//         key={i}
//         className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
//         style={{ animationDelay: `${i * 150}ms` }}
//       />
//     ))}
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────

// const HealthBot: React.FC<Props> = ({ healthData, isOpen, onClose }) => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '0',
//       sender: 'ai',
//       text: `Hi! I'm your MAVERICK Health AI. I can see your current vitals — heart rate ${healthData.heartRate} bpm, stress score ${healthData.stressScore}/100, and energy at ${healthData.energyScore}/100. What would you like to know about your health today?`,
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(true);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const recognitionRef = useRef<any>(null);

//   // Focus input when opened
//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => inputRef.current?.focus(), 250);
//     }
//   }, [isOpen]);

//   // Escape key to close
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) onClose();
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [isOpen, onClose]);

//   // Lock body scroll when the overlay is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isOpen]);

//   // Auto-scroll messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   // ─── Send message ─────────────────────────────────────────────────────────

//   const sendMessage = useCallback(
//     async (text: string) => {
//       if (!text.trim()) return;

//       const userMsg: Message = {
//         id: Date.now().toString(),
//         sender: 'user',
//         text: text.trim(),
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, userMsg]);
//       setInput('');
//       setIsTyping(true);
//       setShowSuggestions(false);

//       try {
//         const response = await fetch('http://localhost:5000/api/ai/health-chat', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${sessionStorage.getItem('maverick_token')}`,
//           },
//           body: JSON.stringify({
//             message: text,
//             healthData,
//             conversationHistory: messages.slice(-6), // last 6 messages for memory
//           }),
//         });

//         const data = await response.json();
//         const reply = data.reply || 'Sorry, I could not process that. Please try again.';

//         setMessages((prev) => [
//           ...prev,
//           {
//             id: (Date.now() + 1).toString(),
//             sender: 'ai',
//             text: reply,
//             timestamp: new Date(),
//           },
//         ]);
//       } catch {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: (Date.now() + 1).toString(),
//             sender: 'ai',
//             text: 'Connection issue. Please check your backend and try again.',
//             timestamp: new Date(),
//           },
//         ]);
//       } finally {
//         setIsTyping(false);
//       }
//     },
//     [healthData, messages],
//   );

//   // ─── Voice input ──────────────────────────────────────────────────────────

//   const handleVoice = () => {
//     const SR =
//       (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SR) {
//       alert('Voice input not supported. Please use Chrome or Edge.');
//       return;
//     }
//     if (isListening) {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//       return;
//     }

//     const rec = new SR();
//     rec.lang = 'en-IN';
//     rec.continuous = false;
//     rec.interimResults = false;
//     recognitionRef.current = rec;
//     rec.onstart = () => setIsListening(true);
//     rec.onend = () => setIsListening(false);
//     rec.onresult = (e: any) => {
//       const transcript = e.results[0][0].transcript;
//       setInput(transcript);
//       sendMessage(transcript);
//     };
//     rec.start();
//   };

//   // ─── Vitals context sidebar data ─────────────────────────────────────────

//   const vitalsContext = [
//     {
//       icon: Heart,
//       label: 'Heart Rate',
//       value: `${healthData.heartRate} bpm`,
//       color: 'text-rose-400',
//       bg: 'bg-rose-500/10',
//     },
//     {
//       icon: Activity,
//       label: 'Blood Pressure',
//       value: `${healthData.bloodPressure} mmHg`,
//       color: 'text-cyan-400',
//       bg: 'bg-cyan-500/10',
//     },
//     {
//       icon: Waves,
//       label: 'HRV',
//       value: `${healthData.hrv} ms`,
//       color: 'text-purple-400',
//       bg: 'bg-purple-500/10',
//     },
//     {
//       icon: Brain,
//       label: 'Stress',
//       value: `${healthData.stressScore}/100 · ${healthData.stressLevel}`,
//       color: 'text-purple-400',
//       bg: 'bg-purple-500/10',
//     },
//     {
//       icon: Zap,
//       label: 'Energy',
//       value: `${healthData.energyScore}/100 · ${healthData.energyLevel}`,
//       color: 'text-amber-400',
//       bg: 'bg-amber-500/10',
//     },
//     {
//       icon: Moon,
//       label: 'Sleep',
//       value: `${healthData.sleep} hrs`,
//       color: 'text-indigo-400',
//       bg: 'bg-indigo-500/10',
//     },
//     {
//       icon: Footprints,
//       label: 'Steps',
//       value: healthData.steps.toLocaleString(),
//       color: 'text-emerald-400',
//       bg: 'bg-emerald-500/10',
//     },
//   ];

//   // ─── Render ───────────────────────────────────────────────────────────────
//   // We render always (no early return) so CSS transitions can animate in + out.
//   // pointer-events-none + opacity-0 when closed prevents any interaction.

//   return (
//     <>
//       {/* Inject keyframe animations once */}
//       <style>{`
//         @keyframes hb-fade-in {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes hb-fade-out {
//           from { opacity: 1; }
//           to   { opacity: 0; }
//         }
//         @keyframes hb-workspace-in {
//           from { opacity: 0; transform: scale(0.97) translateY(10px); }
//           to   { opacity: 1; transform: scale(1)    translateY(0); }
//         }
//         @keyframes hb-workspace-out {
//           from { opacity: 1; transform: scale(1)    translateY(0); }
//           to   { opacity: 0; transform: scale(0.97) translateY(10px); }
//         }
//       `}</style>

//       {/* Root overlay — covers the entire viewport */}
//       <div
//         className={`fixed inset-0 z-[100] flex ${
//           isOpen ? 'pointer-events-auto' : 'pointer-events-none'
//         }`}
//         style={{
//           animation: isOpen
//             ? 'hb-fade-in 0.2s ease-out forwards'
//             : 'hb-fade-out 0.15s ease-in forwards',
//         }}
//       >
//         {/* Backdrop */}
//         <div
//           className="absolute inset-0 bg-black/75 backdrop-blur-md"
//           onClick={onClose}
//         />

//         {/* Full-screen workspace panel */}
//         <div
//           className="relative w-full h-full flex flex-col bg-[#020617]"
//           style={{
//             animation: isOpen
//               ? 'hb-workspace-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
//               : 'hb-workspace-out 0.15s ease-in forwards',
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >

//           {/* ── Top bar ─────────────────────────────────────────────────────── */}
//           <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
//             <div className="flex items-center gap-3 sm:gap-4">
//               {/* Bot icon */}
//               <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shadow-lg shadow-rose-500/10">
//                 <Bot size={20} className="text-rose-400" />
//               </div>

//               {/* Title */}
//               <div>
//                 <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
//                   MAVERICK Health AI
//                 </h2>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
//                   <span className="text-[10px] sm:text-xs text-slate-400">
//                     Monitoring your vitals · Gemini-powered
//                   </span>
//                 </div>
//               </div>

//               {/* Status badge */}
//               <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full ml-2">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   Online
//                 </span>
//               </div>
//             </div>

//             {/* Close button */}
//             <div className="flex items-center gap-2">
//               <span className="hidden sm:inline text-[10px] text-slate-600 font-mono">
//                 Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">Esc</kbd> to close
//               </span>
//               <button
//                 onClick={onClose}
//                 className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
//                 aria-label="Close Health AI (Escape)"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           {/* ── Body ────────────────────────────────────────────────────────── */}
//           <div className="flex-1 flex min-h-0">

//             {/* Left sidebar — health context (desktop only) */}
//             <aside className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 flex-col border-r border-slate-800/60 bg-slate-950/50 overflow-y-auto">
//               {/* Live vitals */}
//               <div className="p-5 border-b border-slate-800/60">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
//                   Live Health Context
//                 </p>
//                 <div className="space-y-2">
//                   {vitalsContext.map(({ icon: Icon, label, value, color, bg }) => (
//                     <div
//                       key={label}
//                       className="flex items-center gap-3 p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/50"
//                     >
//                       <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
//                         <Icon size={13} className={color} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-[10px] text-slate-500 leading-none">{label}</p>
//                         <p className={`text-xs font-black ${color} mt-0.5 truncate`}>{value}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Quick actions */}
//               <div className="p-5 border-b border-slate-800/60">
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
//                   Quick Actions
//                 </p>
//                 <div className="space-y-1.5">
//                   {QUICK_ACTIONS.map((action) => (
//                     <button
//                       key={action.label}
//                       onClick={() => sendMessage(action.prompt)}
//                       className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800/50 hover:border-rose-500/20 rounded-xl text-left transition-all group"
//                     >
//                       <span className="text-xs font-bold text-slate-300 group-hover:text-rose-300">
//                         {action.label}
//                       </span>
//                       <ChevronRight
//                         size={12}
//                         className="text-slate-600 group-hover:text-rose-400 transition-colors flex-shrink-0"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Footer disclaimer */}
//               <div className="p-5 mt-auto">
//                 <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
//                   <p className="text-[10px] text-rose-300/60 leading-relaxed">
//                     This AI has real-time access to your health context. It provides
//                     informational guidance only — not medical advice. Consult a doctor
//                     for clinical decisions.
//                   </p>
//                 </div>
//               </div>
//             </aside>

//             {/* Main chat area */}
//             <div className="flex-1 flex flex-col min-w-0">

//               {/* Messages */}
//               <div
//                 className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
//                 style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}
//               >
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}
//                   >
//                     {/* AI avatar */}
//                     {msg.sender === 'ai' && (
//                       <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-1">
//                         <Sparkles size={13} className="text-rose-400" />
//                       </div>
//                     )}

//                     {/* Bubble */}
//                     <div
//                       className={`max-w-[80%] sm:max-w-[68%] xl:max-w-[58%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
//                         msg.sender === 'user'
//                           ? 'bg-rose-500 text-white rounded-br-sm shadow-lg shadow-rose-500/20'
//                           : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-sm'
//                       }`}
//                     >
//                       {msg.text}
//                       <p className="text-[10px] mt-1.5 opacity-40 select-none">
//                         {msg.timestamp.toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                         })}
//                       </p>
//                     </div>

//                     {/* User avatar */}
//                     {msg.sender === 'user' && (
//                       <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
//                         <img
//                           src="https://picsum.photos/seed/user/200"
//                           alt="You"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Typing indicator */}
//                 {isTyping && (
//                   <div className="flex justify-start gap-3">
//                     <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
//                       <Sparkles size={13} className="text-rose-400" />
//                     </div>
//                     <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3">
//                       <TypingDots />
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Suggested prompts — shown only on first load */}
//               {showSuggestions && messages.length <= 1 && (
//                 <div className="flex-shrink-0 px-4 sm:px-6 pb-4">
//                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
//                     Try asking:
//                   </p>
//                   <div className="flex flex-wrap gap-1.5">
//                     {SUGGESTIONS.map((s) => (
//                       <button
//                         key={s}
//                         onClick={() => sendMessage(s)}
//                         className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition-all"
//                       >
//                         {s}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Input row */}
//               <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/60 backdrop-blur-sm">
//                 <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
//                   {/* Voice */}
//                   <button
//                     onClick={handleVoice}
//                     className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl border transition-all ${
//                       isListening
//                         ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
//                         : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
//                     }`}
//                     title={isListening ? 'Stop listening' : 'Start voice input'}
//                   >
//                     {isListening ? <MicOff size={17} /> : <Mic size={17} />}
//                   </button>

//                   {/* Text input */}
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         sendMessage(input);
//                       }
//                     }}
//                     placeholder="Ask anything about your health..."
//                     className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 placeholder-slate-500 transition-all"
//                   />

//                   {/* Send */}
//                   <button
//                     onClick={() => sendMessage(input)}
//                     disabled={!input.trim()}
//                     className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:scale-105 active:scale-95"
//                     title="Send message (Enter)"
//                   >
//                     <Send size={17} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HealthBot;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot, X, Send, Sparkles, Mic, MicOff,
  Heart, Activity, Zap, Moon, Footprints, Brain, ChevronRight, Waves, ArrowDown, User,
} from 'lucide-react';

// --- Types ---------------------------------------------------------------

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface HealthData {
  heartRate: number;
  bloodPressure: number;
  hrv: number;
  steps: number;
  sleep: number;
  calories: number;
  stressScore: number;
  stressLevel: string;
  energyScore: number;
  energyLevel: string;
}

interface Props {
  healthData: HealthData;
  isOpen: boolean;
  onClose: () => void;
}

// --- Constants -------------------------------------------------------------

const API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  '';

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const SUGGESTIONS = [
  'How is my heart rate today?',
  'Am I stressed right now?',
  'How can I improve my sleep?',
  'What does my HRV mean?',
  'Give me an energy boost tip',
  'How do my vitals compare to normal?',
  'Recommend a workout for today',
  'What should I eat to hit my macros?',
];

const QUICK_ACTIONS = [
  {
    label: 'Full Vitals Summary',
    prompt:
      'Give me a complete, detailed summary of all my current vitals and what they indicate about my overall health status.',
  },
  {
    label: 'Sleep & Recovery',
    prompt:
      'Based on my sleep hours and HRV, analyze my sleep quality and give me specific, actionable recovery recommendations.',
  },
  {
    label: 'Stress Analysis',
    prompt:
      'Analyze my stress level based on my heart rate, blood pressure, and HRV. What are the root causes and what should I do?',
  },
  {
    label: 'Energy Optimization',
    prompt:
      'Based on my current energy score and steps, create a personalized energy optimization plan for the rest of today.',
  },
  {
    label: 'Workout Advice',
    prompt:
      'Based on my current vitals and recovery status, what type of workout intensity is appropriate for me today?',
  },
  {
    label: 'Nutrition Guidance',
    prompt:
      'Based on my calorie intake and activity levels, give me specific nutrition advice and macronutrient targets for today.',
  },
];

// --- Sub-components ----------------------------------------------------------

const TypingDots = () => (
  <div className="flex gap-1 items-center h-5 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
    <User size={14} className="text-slate-400" />
  </div>
);

// --- Main Component ----------------------------------------------------------

const HealthBot: React.FC<Props> = ({ healthData, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'ai',
      text: `Hi! I'm your MAVERICK Health AI. I can see your current vitals - heart rate ${healthData.heartRate} bpm, stress score ${healthData.stressScore}/100, and energy at ${healthData.energyScore}/100. What would you like to know about your health today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when the overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-scroll messages (only if user is already near the bottom)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowScrollToLatest(true);
    }
  }, [messages, isTyping]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollToLatest(distanceFromBottom > 200);
  };

  const scrollToLatest = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollToLatest(false);
  };

  // --- Send message ---------------------------------------------------------

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: makeId(),
        sender: 'user',
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);
      setShowSuggestions(false);

      try {
        const response = await fetch(`${API_BASE}/api/ai/health-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('maverick_token')}`,
          },
          body: JSON.stringify({
            message: text,
            healthData,
            conversationHistory: messages.slice(-6), // last 6 messages for memory
          }),
        });

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const data = await response.json();
        const reply = data.reply || 'Sorry, I could not process that. Please try again.';

        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            sender: 'ai',
            text: reply,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            sender: 'ai',
            text: 'Connection issue. Please check your backend and try again.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [healthData, messages, isTyping],
  );

  // --- Voice input -----------------------------------------------------------

  const handleVoice = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input not supported. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    recognitionRef.current = rec;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    rec.start();
  };

  // Stop any in-flight recognition if the panel closes mid-listen
  useEffect(() => {
    if (!isOpen && isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [isOpen, isListening]);

  // --- Vitals context data -----------------------------------------------

  const vitalsContext = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: `${healthData.heartRate} bpm`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: `${healthData.bloodPressure} mmHg`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: Waves,
      label: 'HRV',
      value: `${healthData.hrv} ms`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Brain,
      label: 'Stress',
      value: `${healthData.stressScore}/100 - ${healthData.stressLevel}`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Zap,
      label: 'Energy',
      value: `${healthData.energyScore}/100 - ${healthData.energyLevel}`,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Moon,
      label: 'Sleep',
      value: `${healthData.sleep} hrs`,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: Footprints,
      label: 'Steps',
      value: healthData.steps.toLocaleString(),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  // --- Render ---------------------------------------------------------------
  // We render always (no early return) so CSS transitions can animate in + out.
  // pointer-events-none + opacity-0 when closed prevents any interaction.

  return (
    <>
      {/* Inject keyframe animations once */}
      <style>{`
        @keyframes hb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hb-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes hb-workspace-in {
          from { opacity: 0; transform: scale(0.97) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes hb-workspace-out {
          from { opacity: 1; transform: scale(1)    translateY(0); }
          to   { opacity: 0; transform: scale(0.97) translateY(10px); }
        }
      `}</style>

      {/* Root overlay - covers the entire viewport */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="MAVERICK Health AI assistant"
        className={`fixed inset-0 z-[100] flex ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          animation: isOpen
            ? 'hb-fade-in 0.2s ease-out forwards'
            : 'hb-fade-out 0.15s ease-in forwards',
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Full-screen workspace panel */}
        <div
          className="relative w-full h-full flex flex-col bg-[#020617]"
          style={{
            animation: isOpen
              ? 'hb-workspace-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              : 'hb-workspace-out 0.15s ease-in forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Top bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shadow-lg shadow-rose-500/10 flex-shrink-0">
                <Bot size={20} className="text-rose-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                  MAVERICK Health AI
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                    Monitoring your vitals - AI powered
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full ml-2 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="hidden sm:inline text-[10px] text-slate-600 font-mono">
                Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">Esc</kbd> to close
              </span>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
                aria-label="Close Health AI (Escape)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mobile / tablet vitals strip - replaces the hidden sidebar below lg breakpoint */}
          <div className="lg:hidden flex-shrink-0 border-b border-slate-800/60 bg-slate-950/50 px-4 py-3 overflow-x-auto">
            <div className="flex gap-2 w-max">
              {vitalsContext.map(({ icon: Icon, label, value, color, bg }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-xl border border-slate-800/50 flex-shrink-0"
                >
                  <div className={`w-6 h-6 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon size={12} className={color} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 leading-none whitespace-nowrap">{label}</p>
                    <p className={`text-[11px] font-black ${color} mt-0.5 whitespace-nowrap`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex min-h-0">

            {/* Left sidebar - health context (desktop only) */}
            <aside className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 flex-col border-r border-slate-800/60 bg-slate-950/50 overflow-y-auto">
              <div className="p-5 border-b border-slate-800/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  Live Health Context
                </p>
                <div className="space-y-2">
                  {vitalsContext.map(({ icon: Icon, label, value, color, bg }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/50"
                    >
                      <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={13} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 leading-none">{label}</p>
                        <p className={`text-xs font-black ${color} mt-0.5 truncate`}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 border-b border-slate-800/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  Quick Actions
                </p>
                <div className="space-y-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.prompt)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800/50 hover:border-rose-500/20 rounded-xl text-left transition-all group"
                    >
                      <span className="text-xs font-bold text-slate-300 group-hover:text-rose-300">
                        {action.label}
                      </span>
                      <ChevronRight
                        size={12}
                        className="text-slate-600 group-hover:text-rose-400 transition-colors flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 mt-auto">
                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                  <p className="text-[10px] text-rose-300/60 leading-relaxed">
                    This AI has real-time access to your health context. It provides
                    informational guidance only, not medical advice. Consult a doctor
                    for clinical decisions.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0 relative">

              {/* Messages */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles size={13} className="text-rose-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] sm:max-w-[68%] xl:max-w-[58%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-rose-500 text-white rounded-br-sm shadow-lg shadow-rose-500/20'
                          : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                      <p className="text-[10px] mt-1.5 opacity-40 select-none">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {msg.sender === 'user' && <UserAvatar />}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={13} className="text-rose-400" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Scroll-to-latest affordance */}
              {showScrollToLatest && (
                <button
                  onClick={scrollToLatest}
                  className="absolute bottom-24 sm:bottom-28 right-4 sm:right-6 flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-bold text-slate-300 shadow-lg transition-all"
                >
                  <ArrowDown size={13} />
                  New messages
                </button>
              )}

              {/* Suggested prompts - shown only on first load */}
              {showSuggestions && messages.length <= 1 && (
                <div className="flex-shrink-0 px-4 sm:px-6 pb-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input row */}
              <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-slate-800 bg-slate-950/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                  <button
                    onClick={handleVoice}
                    className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl border transition-all ${
                      isListening
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  >
                    {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder="Ask anything about your health..."
                    aria-label="Message to Health AI"
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/10 placeholder-slate-500 transition-all"
                  />

                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:scale-105 active:scale-95"
                    title="Send message (Enter)"
                    aria-label="Send message"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthBot;