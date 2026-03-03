import React, { useState } from 'react';
import {
    Bot,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    BookOpen,
    Brain,
    Target,
    Bell,
    Send,
    Wand2,
    BarChart2
} from 'lucide-react';

const AIAssistantPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'planner' | 'explainer' | 'quiz' | 'analysis'>('planner');

    // Helper workaround for icon mismatch if needed, but using standard ones:
    const Calendar = Target; // Using Target as Planner icon if Calendar not imported correctly

    const tabs = [
        { id: 'planner', label: 'Study Planner', icon: Calendar },
        { id: 'explainer', label: 'Explainer', icon: BookOpen },
        { id: 'quiz', label: 'Quiz Prep', icon: Brain },
        { id: 'analysis', label: 'Analyzer', icon: BarChart2 },
    ];

    return (
        <div className={`fixed bottom-8 right-8 z-40 transition-all duration-500 ease-in-out ${isOpen ? 'w-[380px]' : 'w-16'}`}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 hover:scale-110 transition-all group"
                >
                    <Bot size={28} className="group-hover:animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse" />
                </button>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-100 italic tracking-tighter">MAVERIC AI</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Learning Companion Active</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-800">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-cyan-400 bg-cyan-400/5' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <tab.icon size={16} />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
                                {activeTab === tab.id && <div className="absolute bottom-0 w-8 h-0.5 bg-cyan-400 rounded-t-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {activeTab === 'planner' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-slate-950/50 border border-cyan-500/20 p-3 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-all">
                                        <Sparkles size={40} className="text-cyan-400" />
                                    </div>
                                    <h4 className="text-xs font-bold text-cyan-400 mb-1">Generated Roadmap</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                        "Based on your goal to master <b>Next.js</b>, I've broken down the 'Server Components' module into 4 micro-tasks for this week."
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { title: 'Intro to Hydration', dur: '45m', type: 'Theory' },
                                        { title: 'Server Components Lab', dur: '1.5h', type: 'Hands-on' },
                                        { title: 'Streaming Patterns', dur: '30m', type: 'Concepts' }
                                    ].map((task, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                <span className="text-xs text-slate-200 font-medium">{task.title}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                                <span>{task.dur}</span>
                                                <span className="px-1.5 py-0.5 bg-slate-700/50 rounded uppercase font-bold">{task.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl hover:bg-cyan-500/20 transition-all">
                                    Refactor My Schedule
                                </button>
                            </div>
                        )}

                        {activeTab === 'explainer' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['Beginner', 'Technical', 'Interview'].map(mode => (
                                        <button key={mode} className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === 'Technical' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}>
                                            {mode} Mode
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        AI: "How can I help you understand this concept?"
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ask AI anything..."
                                        className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none"
                                    />
                                    <button className="p-2 bg-cyan-500 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                        <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-1">Struggling Area</h5>
                                        <p className="text-xs text-amber-400 font-bold">State Management</p>
                                    </div>
                                    <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                                        <h5 className="text-[10px] text-slate-500 font-bold uppercase mb-1">Consistency</h5>
                                        <p className="text-xs text-green-400 font-bold">+15% vs Last Week</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wand2 size={14} className="text-cyan-400" />
                                        <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">AI Suggestion</h5>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                                        "You tend to drop in performance on Tuesdays. I suggest scheduling smaller, high-engagement tasks for this day."
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'quiz' && (
                            <div className="space-y-4 animate-in fade-in duration-300 text-center py-8">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                    <Brain size={32} className="text-slate-500" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-200">Test Your Knowledge</h4>
                                <p className="text-xs text-slate-500 mb-6">Let me generate a quick quiz based on your recently completed tasks.</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <button className="py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 font-bold hover:bg-slate-700 transition-all">MCQs (10 Questions)</button>
                                    <button className="py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 font-bold hover:bg-slate-700 transition-all">Coding Challenge</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Smart Reminders Footer */}
                    <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Bell size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Smart Reminders</span>
                        </div>
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold">Goal Missed ⚠️</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistantPanel;
