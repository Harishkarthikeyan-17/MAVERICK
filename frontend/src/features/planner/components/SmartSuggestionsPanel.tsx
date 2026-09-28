import React, { useState } from 'react';
import {
    Brain, Sparkles, Send, Lightbulb, Clock, Moon, Sun,
    Coffee, Zap, Target, Shield, Activity, TrendingUp,
    Volume2, ArrowRight, RefreshCw, ChevronRight, Bot,
    Dumbbell, BookOpen, Focus, Timer
} from 'lucide-react';

interface SmartSuggestionsPanelProps {
    onApplySuggestion?: (suggestion: string) => void;
}

interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: 'focus' | 'health' | 'schedule' | 'habit' | 'break' | 'sleep';
    priority: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
    actionLabel: string;
    timing?: string;
    impact?: string;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    suggestions?: string[];
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({ onApplySuggestion }) => {
    const [chatInput, setChatInput] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'ai',
            text: "👋 I'm your AI scheduling assistant. Tell me what you want to accomplish today and I'll create an optimized plan. Try: 'Plan my day for studying and exercise' or 'Help me focus on deep work today'."
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [appliedSuggestions, setAppliedSuggestions] = useState<Record<string, boolean>>({});

    const suggestions: Suggestion[] = [
        {
            id: 's1',
            title: 'Optimal Study Window',
            description: 'Based on your patterns, schedule intensive study sessions between 9 AM – 11:30 AM for maximum retention.',
            category: 'focus',
            priority: 'high',
            icon: <BookOpen size={18} />,
            actionLabel: 'Schedule Study Block',
            timing: '9:00 AM – 11:30 AM',
            impact: '+40% retention rate'
        },
        {
            id: 's2',
            title: 'Focus Duration Sweet Spot',
            description: 'Your data shows peak performance with 45-minute focus blocks followed by 8-minute breaks.',
            category: 'focus',
            priority: 'high',
            icon: <Target size={18} />,
            actionLabel: 'Configure Pomodoro',
            timing: '45 min focus / 8 min break',
            impact: '+25% task completion'
        },
        {
            id: 's3',
            title: 'Pre-Work Exercise Boost',
            description: 'Morning exercise before 8 AM correlates with 28% higher productivity for the rest of your day.',
            category: 'health',
            priority: 'medium',
            icon: <Dumbbell size={18} />,
            actionLabel: 'Add Morning Workout',
            timing: '6:30 AM – 7:30 AM',
            impact: '+28% daily productivity'
        },
        {
            id: 's4',
            title: 'Afternoon Energy Dip Recovery',
            description: 'Schedule a 15-minute walk and light stretching at 2 PM to counteract your post-lunch cognitive dip.',
            category: 'break',
            priority: 'medium',
            icon: <Coffee size={18} />,
            actionLabel: 'Add Recovery Break',
            timing: '2:00 PM – 2:15 PM',
            impact: '+20% afternoon focus'
        },
        {
            id: 's5',
            title: 'Reduce Late-Night Distractions',
            description: 'Your distraction rate spikes 65% after 9:30 PM. Set a digital wind-down timer to protect sleep quality.',
            category: 'sleep',
            priority: 'high',
            icon: <Moon size={18} />,
            actionLabel: 'Enable Wind-Down',
            timing: 'After 9:30 PM',
            impact: '+15% next-day focus'
        },
        {
            id: 's6',
            title: 'Habit Stacking Opportunity',
            description: 'Link your meditation habit with morning coffee for better consistency. Stacked habits have 73% higher retention.',
            category: 'habit',
            priority: 'medium',
            icon: <Sparkles size={18} />,
            actionLabel: 'Stack Habits',
            timing: '7:00 AM – 7:20 AM',
            impact: '+73% habit retention'
        },
        {
            id: 's7',
            title: 'Smart Rescheduling Alert',
            description: 'You have 3 overlapping tasks between 2-4 PM tomorrow. Let AI redistribute them across available slots.',
            category: 'schedule',
            priority: 'high',
            icon: <RefreshCw size={18} />,
            actionLabel: 'Auto-Reschedule',
            timing: 'Tomorrow 2-4 PM',
            impact: 'Resolve 3 conflicts'
        },
        {
            id: 's8',
            title: 'Deep Work Protection Zone',
            description: 'Block 10 AM – 12 PM as a no-meeting deep work zone. Your most complex tasks should go here.',
            category: 'focus',
            priority: 'high',
            icon: <Shield size={18} />,
            actionLabel: 'Create Focus Zone',
            timing: '10:00 AM – 12:00 PM',
            impact: '+50% task quality'
        }
    ];

    const categoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        all: { label: 'All', color: 'text-slate-400', icon: <Sparkles size={14} /> },
        focus: { label: 'Focus', color: 'text-cyan-400', icon: <Target size={14} /> },
        health: { label: 'Health', color: 'text-emerald-400', icon: <Activity size={14} /> },
        schedule: { label: 'Schedule', color: 'text-purple-400', icon: <Clock size={14} /> },
        habit: { label: 'Habits', color: 'text-amber-400', icon: <TrendingUp size={14} /> },
        break: { label: 'Breaks', color: 'text-pink-400', icon: <Coffee size={14} /> },
        sleep: { label: 'Sleep', color: 'text-indigo-400', icon: <Moon size={14} /> }
    };

    const priorityColors = {
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };

    const filteredSuggestions = activeCategory === 'all'
        ? suggestions
        : suggestions.filter(s => s.category === activeCategory);

    const handleApply = (suggestion: Suggestion) => {
        setAppliedSuggestions(prev => ({ ...prev, [suggestion.id]: true }));
        onApplySuggestion?.(suggestion.title);
    };

    // NLP Chat handler
    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const userText = chatInput;
        setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
        setChatInput('');
        setIsThinking(true);

        setTimeout(() => {
            const inputLower = userText.toLowerCase();
            let aiText = '';
            let aiSuggestions: string[] = [];

            if (inputLower.includes('study') || inputLower.includes('exam') || inputLower.includes('learn')) {
                aiText = "📚 Great! Here's my optimized study plan based on your cognitive patterns:";
                aiSuggestions = [
                    '🧠 9:00-11:30 AM — Deep study session (your peak focus window)',
                    '🍎 11:30-12:00 PM — Healthy snack + walk break',
                    '📝 12:30-2:00 PM — Practice problems & active recall',
                    '☕ 2:00-2:15 PM — Micro-break & caffeine reset',
                    '📖 2:30-4:00 PM — Revision & note review',
                    '💪 4:30-5:30 PM — Exercise for cognitive recovery'
                ];
            } else if (inputLower.includes('focus') || inputLower.includes('deep work') || inputLower.includes('concentrate')) {
                aiText = "🎯 Configuring your deep work protocol:";
                aiSuggestions = [
                    '🛡️ Enable Distraction Shield for all sessions',
                    '⏱️ Use 45-min focus / 8-min break cycles',
                    '📵 Silence all non-critical notifications',
                    '🎧 Use ambient focus music (brown noise recommended)',
                    '📋 Pre-define your task list before starting',
                    '🧘 Start with 2-min breathing exercise'
                ];
            } else if (inputLower.includes('exercise') || inputLower.includes('workout') || inputLower.includes('fitness')) {
                aiText = "💪 Here's your optimized exercise schedule integrated with productivity:";
                aiSuggestions = [
                    '🏃 6:30-7:30 AM — Morning HIIT (pre-work energy boost)',
                    '🧘 12:00-12:20 PM — Midday stretching & mobility',
                    '🚶 2:00-2:15 PM — Walking break (post-lunch recovery)',
                    '💪 5:30-6:30 PM — Strength training (evening release)',
                    '🧘‍♂️ 9:00-9:15 PM — Evening yoga & wind-down'
                ];
            } else if (inputLower.includes('sleep') || inputLower.includes('rest') || inputLower.includes('tired')) {
                aiText = "🌙 Sleep optimization recommendations based on your patterns:";
                aiSuggestions = [
                    '📵 9:30 PM — Digital wind-down (stop all screens)',
                    '📖 9:45 PM — Light reading or journaling',
                    '🧘 10:00 PM — Breathing exercises or meditation',
                    '🛌 10:30 PM — Target bedtime (7.5h before wake)',
                    '☀️ 6:00 AM — Consistent wake time (sunlight exposure)',
                    '☕ No caffeine after 2:00 PM'
                ];
            } else {
                aiText = "🤖 Here's a balanced day plan optimized for your goals:";
                aiSuggestions = [
                    '🌅 7:00-7:30 AM — Morning routine & planning',
                    '🧠 8:00-10:30 AM — Deep work block (highest priority)',
                    '☕ 10:30-10:45 AM — Energy break',
                    '💼 11:00-12:30 PM — Meetings & collaboration',
                    '🍽️ 12:30-1:30 PM — Lunch & mental reset',
                    '📋 2:00-4:00 PM — Focused task execution',
                    '💪 4:30-5:30 PM — Physical activity',
                    '🌙 8:00-9:30 PM — Personal growth & wind-down'
                ];
            }

            setChatMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiText,
                suggestions: aiSuggestions
            }]);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Smart Scheduling Assistant Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Chat Panel - Takes 3 columns */}
                <div className="lg:col-span-3 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col h-[550px] shadow-lg overflow-hidden relative">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-850 flex items-center justify-between bg-slate-950/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-100">AI Planning Assistant</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Natural Language Scheduler</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-[9px] bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 font-extrabold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Online
                        </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className="max-w-[90%] space-y-3">
                                    <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed border ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-cyan-600 to-indigo-700 text-white rounded-br-none border-cyan-500/20 font-semibold shadow-md'
                                            : 'bg-slate-950/80 text-slate-300 rounded-bl-none border-slate-850'
                                    }`}>
                                        {msg.text}
                                    </div>

                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-2 animate-in fade-in duration-500">
                                            {msg.suggestions.map((sug, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200">
                                                    <div className="w-1 h-5 rounded bg-cyan-500 shrink-0" />
                                                    {sug}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-2 font-bold animate-pulse">
                                    <Brain size={16} className="animate-spin text-cyan-400" /> Analyzing patterns & generating schedule...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex gap-2">
                        <input
                            type="text"
                            placeholder="Tell me your goals for today..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl py-3 px-4 focus:ring-cyan-500 focus:border-cyan-500 font-semibold"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Quick Prompts Panel - 2 columns */}
                <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-lg h-[550px] flex flex-col">
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-400" /> Quick Planning Prompts
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                        {[
                            { emoji: '📚', text: 'Plan a productive study day' },
                            { emoji: '💼', text: 'Optimize my work schedule' },
                            { emoji: '💪', text: 'Balance workout and work today' },
                            { emoji: '🧘', text: 'Create a mindful and balanced day' },
                            { emoji: '🎯', text: 'Help me focus on deep work' },
                            { emoji: '📝', text: 'Plan exam prep with breaks' },
                            { emoji: '🌙', text: 'Optimize my sleep schedule' },
                            { emoji: '⚡', text: 'Maximize productivity today' },
                            { emoji: '🏃', text: 'Fit exercise into a busy day' },
                            { emoji: '🧠', text: 'Schedule creative thinking time' },
                            { emoji: '📊', text: 'Plan a meeting-heavy day' },
                            { emoji: '🌅', text: 'Design the perfect morning routine' },
                        ].map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setChatInput(prompt.text);
                                }}
                                className="w-full flex items-center gap-3 p-3 bg-slate-950/40 hover:bg-slate-800/60 border border-slate-850 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer group"
                            >
                                <span className="text-lg">{prompt.emoji}</span>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors flex-1">{prompt.text}</span>
                                <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Smart Suggestions Grid */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                        <Lightbulb className="text-amber-400" size={22} /> Smart Recommendations
                    </h2>

                    {/* Category Filters */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                                    activeCategory === key
                                        ? `bg-slate-800 border-slate-700 ${config.color} shadow-md`
                                        : 'border-transparent text-slate-500 hover:text-slate-350 hover:bg-slate-800/30'
                                }`}
                            >
                                {config.icon}
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSuggestions.map(suggestion => {
                        const isApplied = appliedSuggestions[suggestion.id];
                        const catConfig = categoryConfig[suggestion.category];

                        return (
                            <div
                                key={suggestion.id}
                                className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:border-slate-700 hover:shadow-xl relative overflow-hidden group ${isApplied ? 'opacity-60' : ''}`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-2xl pointer-events-none" />

                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 ${catConfig.color} shrink-0`}>
                                            {suggestion.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-100">{suggestion.title}</h4>
                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${priorityColors[suggestion.priority]} mt-1 inline-block`}>
                                                {suggestion.priority} impact
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">{suggestion.description}</p>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                                        {suggestion.timing && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} className="text-cyan-400" /> {suggestion.timing}
                                            </span>
                                        )}
                                        {suggestion.impact && (
                                            <span className="flex items-center gap-1 text-emerald-400">
                                                <TrendingUp size={10} /> {suggestion.impact}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleApply(suggestion)}
                                        disabled={isApplied}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                            isApplied
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-850 hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                                        }`}
                                    >
                                        {isApplied ? '✓ Applied' : suggestion.actionLabel}
                                        {!isApplied && <ArrowRight size={10} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SmartSuggestionsPanel;
