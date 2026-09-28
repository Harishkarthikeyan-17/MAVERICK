import React, { useState, useMemo } from 'react';
import { Brain, Zap, Target, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Sparkles, MessageSquare, Send, Award, Play } from 'lucide-react';
import { PlannerTask, TaskPriority, TaskCategory, TaskLocation } from '../../../core/types';

interface PlannerDashboardProps {
    productivityScore: number;
    completionPercentage: number;
    streak: number;
    focusSession: string;
    upcomingTask?: PlannerTask;
    insights: string[];
    xp: number;
    level: number;
    mood: 'Great' | 'Good' | 'Neutral' | 'Bad' | 'Awful';
    setMood: (mood: 'Great' | 'Good' | 'Neutral' | 'Bad' | 'Awful') => void;
    onQuickPlan: (suggestedTasks: Omit<PlannerTask, 'id' | 'duration' | 'completed' | 'date'>[]) => void;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    proposedPlan?: Omit<PlannerTask, 'id' | 'duration' | 'completed' | 'date'>[];
}

const PlannerDashboard: React.FC<PlannerDashboardProps> = ({
    productivityScore,
    completionPercentage,
    streak,
    focusSession,
    upcomingTask,
    insights,
    xp,
    level,
    mood,
    setMood,
    onQuickPlan,
}) => {
    // Chatbot state
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            text: "Welcome, Operator. I am your cognitive scheduler assistant. Tell me what you want to achieve today (e.g. 'Plan my day for exam prep and workout' or 'Schedule a busy day of client meetings and meditation'), and I will compile an optimized daily blueprint for you!"
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);

    // Mood config
    const moods = [
        { name: 'Great', emoji: '😎', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
        { name: 'Good', emoji: '🙂', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
        { name: 'Neutral', emoji: '😐', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
        { name: 'Bad', emoji: '😴', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
        { name: 'Awful', emoji: '🥵', color: 'text-red-400 bg-red-500/10 border-red-500/30' }
    ];

    // Gamification levels titles
    const levelTitle = useMemo(() => {
        if (level >= 10) return 'Cognitive Mastermind';
        if (level >= 7) return 'Focus Commander';
        if (level >= 5) return 'Discipline Warden';
        if (level >= 3) return 'Flow Ninja';
        return 'Productivity Acolyte';
    }, [level]);

    const reqXp = level * 600;
    const xpPercent = Math.min(100, Math.round((xp / reqXp) * 100));

    // Chatbot NLP Simulation
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const userMsgText = chatInput;
        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: userMsgText };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsThinking(true);

        setTimeout(() => {
            let aiText = "Blueprint generated! I have optimized a daily layout that maximizes your cognitive focus periods and builds momentum. Click 'Apply Proposed Blueprint' below to load this directly into your active timeline.";
            let proposed: Omit<PlannerTask, 'id' | 'duration' | 'completed' | 'date'>[] = [];

            const inputLower = userMsgText.toLowerCase();
            if (inputLower.includes('exam') || inputLower.includes('study') || inputLower.includes('prep')) {
                proposed = [
                    {
                        title: '🚀 Active Recall: Intensive exam study core',
                        startTime: '09:00',
                        endTime: '11:30',
                        priority: 'High',
                        category: 'Study',
                        location: 'Home',
                        notes: 'High attention peak. Keep distractions shielded.'
                    },
                    {
                        title: '🥗 Fuel & Rest: Balanced healthy lunch break',
                        startTime: '12:00',
                        endTime: '13:00',
                        priority: 'Low',
                        category: 'Health',
                        location: 'Home',
                        notes: 'Step away from screen. Hydrate.'
                    },
                    {
                        title: '📚 Practice problems & mock questions review',
                        startTime: '14:00',
                        endTime: '16:00',
                        priority: 'Medium',
                        category: 'Study',
                        location: 'Office',
                        notes: 'Solve at least 2 complete past papers.'
                    },
                    {
                        title: '🏋️ Workout Routine: Core interval conditioning',
                        startTime: '17:00',
                        endTime: '18:15',
                        priority: 'High',
                        category: 'Health',
                        location: 'Field',
                        notes: 'Recharge cognitive energy levels.'
                    }
                ];
            } else if (inputLower.includes('meeting') || inputLower.includes('client') || inputLower.includes('work')) {
                proposed = [
                    {
                        title: '📞 Daily Standup & Strategy Briefing',
                        startTime: '09:30',
                        endTime: '10:15',
                        priority: 'Medium',
                        category: 'Work',
                        location: 'Office',
                        notes: 'Align goals across development layers.'
                    },
                    {
                        title: '💼 Crucial Project Code Review & Architecture Refactor',
                        startTime: '11:00',
                        endTime: '13:00',
                        priority: 'High',
                        category: 'Work',
                        location: 'Office',
                        notes: 'Analyze time-complexity bottlenecks.'
                    },
                    {
                        title: '🤝 High-Impact Client Review Session',
                        startTime: '14:30',
                        endTime: '15:30',
                        priority: 'High',
                        category: 'Work',
                        location: 'Office',
                        notes: 'Demonstrate active progress dashboard.'
                    },
                    {
                        title: '🧘 Quiet Zone: Breathing exercises & meditation',
                        startTime: '16:30',
                        endTime: '17:00',
                        priority: 'Low',
                        category: 'Health',
                        location: 'Home',
                        notes: 'Mental cool-down.'
                    }
                ];
            } else {
                proposed = [
                    {
                        title: '🧠 Cognitive Setup: Daily planning session',
                        startTime: '08:30',
                        endTime: '09:00',
                        priority: 'Medium',
                        category: 'Other',
                        location: 'Home',
                        notes: 'Set focus intents.'
                    },
                    {
                        title: '💻 Intensive Deep Work Block',
                        startTime: '09:30',
                        endTime: '12:00',
                        priority: 'High',
                        category: 'Work',
                        location: 'Office',
                        notes: 'Tackle the biggest rock.'
                    },
                    {
                        title: '🌿 Active Recovery: Outdoor walk & sunshine',
                        startTime: '13:30',
                        endTime: '14:15',
                        priority: 'Low',
                        category: 'Health',
                        location: 'Field',
                        notes: '15-minute nature boost.'
                    },
                    {
                        title: '📖 Mind Expansion: Technical literature reading',
                        startTime: '16:00',
                        endTime: '17:00',
                        priority: 'Medium',
                        category: 'Study',
                        location: 'Home',
                        notes: 'Take notes on best design systems.'
                    }
                ];
            }

            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiText,
                proposedPlan: proposed
            };
            setChatMessages(prev => [...prev, aiResponse]);
            setIsThinking(false);
        }, 1200);
    };

    // Circular Progress Ring Math
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - productivityScore / 100);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Gamification Level and XP Tracker Top Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white border border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                            <Award size={30} className="animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-white">Level {level}</h3>
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.2)]">{levelTitle}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-400 mt-1">Acquire cognitive achievements to level up your flow state.</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 max-w-md w-full">
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                            <span>OPERATOR XP PROGRESS</span>
                            <span className="text-cyan-400 font-extrabold">{xp} / {reqXp} XP ({xpPercent}%)</span>
                        </div>
                        <div className="h-3 bg-slate-950 border border-slate-850 rounded-full p-0.5 overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-700 ease-out" 
                                style={{ width: `${xpPercent}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Row: Circular Ring and Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Glowing Circular Ring for Productivity Score */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 w-full h-full bg-cyan-500/[0.02] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                        <Zap size={14} className="text-cyan-400 animate-pulse" /> Focus Efficiency Score
                    </h3>

                    <div className="relative w-[150px] h-[150px] flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="75"
                                cy="75"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-855"
                            />
                            <circle
                                cx="75"
                                cy="75"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="text-cyan-400 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            />
                        </svg>
                        <div className="text-center z-10">
                            <div className="text-4xl font-black text-white tracking-tight">{productivityScore}</div>
                            <div className="text-[10px] font-black text-cyan-400 tracking-wider uppercase mt-0.5">Rating</div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 font-bold text-center mt-6">Completed tasks & active focus boost efficiency.</p>
                </div>

                {/* 2. Interactive Mood Logger & Energy Tracker */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-lg flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] blur-3xl rounded-full pointer-events-none" />
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                            <Brain size={14} className="text-amber-400" /> Log Mood Context
                        </h3>
                        <p className="text-xs text-slate-500 font-bold mb-4">Mood affects core fatigue calculations and habit scores.</p>
                        
                        <div className="grid grid-cols-5 gap-2">
                            {moods.map((m) => {
                                const isSelected = mood === m.name;
                                return (
                                    <button
                                        key={m.name}
                                        onClick={() => setMood(m.name as any)}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-305 cursor-pointer hover:scale-105 active:scale-95 ${
                                            isSelected 
                                                ? `${m.color} ring-2 ring-cyan-500/20 scale-105 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]`
                                                : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-350 hover:bg-slate-900'
                                        }`}
                                    >
                                        <span className="text-xl mb-1">{m.emoji}</span>
                                        <span className="text-[9px] font-black tracking-wider uppercase">{m.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold">Reflected Mood Status:</span>
                        <span className="font-extrabold text-cyan-400 flex items-center gap-1">
                            {mood === 'Great' && '🚀 Supercharged'}
                            {mood === 'Good' && '⚡ Flowing Positive'}
                            {mood === 'Neutral' && '🌱 Stable Flow'}
                            {mood === 'Bad' && '🔋 Battery Exhausted'}
                            {mood === 'Awful' && '🚨 Burnout Warning'}
                        </span>
                    </div>
                </div>

                {/* 3. Core Stats Metrics Cards */}
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Completion */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl relative overflow-hidden group shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</span>
                            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <CheckCircle2 size={14} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-black text-slate-100">{completionPercentage}%</span>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${completionPercentage}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl relative overflow-hidden group shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
                            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                                <TrendingUp size={14} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-black text-slate-100">{streak} Days</span>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-2">Active Streak</div>
                        </div>
                    </div>

                    {/* Focus Sessions */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl relative overflow-hidden group shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</span>
                            <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                                <Target size={14} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-black text-slate-100">{focusSession.includes('Active') ? focusSession.match(/\d+/) : '0'} / 5</span>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-2">Daily Goal</div>
                        </div>
                    </div>

                    {/* Important Upcoming */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl relative overflow-hidden group shadow-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Important Task</span>
                            <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                                <AlertTriangle size={14} />
                            </div>
                        </div>
                        <div className="mt-4 truncate">
                            <span className="text-xs font-bold text-slate-200 block truncate">{upcomingTask ? upcomingTask.title : 'None Scheduled'}</span>
                            <span className="text-[9px] font-black text-red-400 uppercase tracking-wider mt-2 block">{upcomingTask ? upcomingTask.startTime : 'Awaits Blueprint'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: AI Insights Panel & Interactive Chatbot Scheduler */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Natural Language AI Scheduler Assistant */}
                <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-lg overflow-hidden relative">
                    
                    {/* Header */}
                    <div className="p-5 border-b border-slate-850 flex items-center justify-between bg-slate-950/40">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-cyan-400" size={20} />
                            <h3 className="text-base font-black text-slate-100">Cognitive Scheduler chatbot</h3>
                        </div>
                        <span className="text-[9px] bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-400 font-extrabold uppercase tracking-wider">REAL-TIME NLP</span>
                    </div>

                    {/* Chat Bubble Container */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[90%] space-y-3">
                                    <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed border ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-cyan-600 to-indigo-700 text-white rounded-br-none border-cyan-500/20 font-semibold shadow-md'
                                            : 'bg-slate-950/80 text-slate-300 rounded-bl-none border-slate-850'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    
                                    {/* If the message contains a proposed plan blueprint */}
                                    {msg.proposedPlan && msg.proposedPlan.length > 0 && (
                                        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-3 animate-in fade-in duration-500">
                                            <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
                                                <span>Proposed Blueprint Grid</span>
                                                <span className="text-cyan-400">{msg.proposedPlan.length} Tasks</span>
                                            </div>
                                            
                                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                                {msg.proposedPlan.map((tp, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px]">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <div className="w-1.5 h-6 rounded bg-cyan-500 shrink-0" />
                                                            <div>
                                                                <span className="font-extrabold text-slate-200 block truncate max-w-[200px]">{tp.title}</span>
                                                                <span className="text-slate-500 font-bold">{tp.category}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-cyan-400 font-extrabold block">{tp.startTime} - {tp.endTime}</span>
                                                            <span className={`text-[8px] uppercase font-black px-1.5 rounded ${
                                                                tp.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                                                            }`}>{tp.priority}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (msg.proposedPlan) {
                                                        onQuickPlan(msg.proposedPlan);
                                                        alert("✨ Proposed AI Daily blueprint applied to your agenda!");
                                                        // Disable button
                                                        setChatMessages(prev => 
                                                            prev.map(m => m.id === msg.id ? { ...m, proposedPlan: [] } : m)
                                                        );
                                                    }
                                                }}
                                                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase rounded-xl hover:scale-[1.02] active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Sparkles size={14} /> Apply Proposed Blueprint
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-2 font-bold animate-pulse">
                                    <Brain size={16} className="animate-spin text-cyan-400" /> Cogitant AI compilation...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Footer Input */}
                    <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a daily objective prompt (e.g. 'Plan study and workout')..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl py-3 px-4 focus:ring-cyan-500 focus:border-cyan-500 font-semibold"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Column 3: AI Cognitive Insights & Warnings */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-lg flex flex-col justify-between h-[520px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="text-indigo-400" size={18} />
                                <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Cognitive Insights</h3>
                            </div>
                            <span className="text-[8px] bg-slate-950 px-2 py-0.5 rounded font-black text-slate-500 tracking-wider">AUTO</span>
                        </div>

                        {/* List */}
                        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start p-3 bg-slate-950/60 border border-slate-850 rounded-xl">
                                    <div className="mt-0.5 text-indigo-400 shrink-0">
                                        <Zap size={14} className="animate-bounce" />
                                    </div>
                                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">{insight}</p>
                                </div>
                            ))}
                            {insights.length === 0 && (
                                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                    Awaiting cognitive data blocks. Complete tasks to compile intelligence.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fatigue Warning Banner */}
                    <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-red-400">Fatigue Hazard Warning</h4>
                            <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-semibold">
                                Brain load projected to peak between 3PM–5PM. Buffer recommended focus sessions with 10-minute micro breaks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlannerDashboard;
