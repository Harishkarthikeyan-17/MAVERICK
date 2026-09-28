import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Target, ShieldAlert, Zap, BarChart3, HelpCircle, Plus, Sparkles, CheckCircle2, Shield, AlertTriangle, Activity, Headphones, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface FocusTrackerProps {
    focusSessions: number;
    setFocusSessions: React.Dispatch<React.SetStateAction<number>>;
    distractionCount: number;
    setDistractionCount: React.Dispatch<React.SetStateAction<number>>;
    onAwardXp: (xpReward: number) => void;
}

interface LoggedActivity {
    id: string;
    type: 'productive' | 'distraction';
    name: string;
    duration: number; // in mins
    timestamp: string;
}

const FocusTracker: React.FC<FocusTrackerProps> = ({
    focusSessions,
    setFocusSessions,
    distractionCount,
    setDistractionCount,
    onAwardXp
}) => {
    // Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
    const [totalMinsFocused, setTotalMinsFocused] = useState(75); // Mock initial focus mins
    const [totalMinsDistracted, setTotalMinsDistracted] = useState(15); // Mock initial distraction mins

    // Shield Mode Toggles
    const [shieldActive, setShieldActive] = useState(false);

    // Dynamic Activity Logging State
    const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>([
        { id: '1', type: 'productive', name: 'Coding System Core', duration: 45, timestamp: '10:15 AM' },
        { id: '2', type: 'productive', name: 'Researching Design Specs', duration: 30, timestamp: '11:45 AM' },
        { id: '3', type: 'distraction', name: 'Checked Social Media', duration: 10, timestamp: '01:30 PM' },
        { id: '4', type: 'distraction', name: 'Random Feeds Browsing', duration: 5, timestamp: '03:15 PM' }
    ]);

    const [newActivityName, setNewActivityName] = useState('');
    const [newActivityType, setNewActivityType] = useState<'productive' | 'distraction'>('productive');
    const [newActivityDuration, setNewActivityDuration] = useState(15);

    // Pomodoro Timer Logic
    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        else if (mode === 'shortBreak') setTimeLeft(5 * 60);
        else setTimeLeft(15 * 60);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'focus') {
                setFocusSessions(prev => prev + 1);
                setTotalMinsFocused(prev => prev + 25);
                onAwardXp(150); // Award significant XP for completing a Pomodoro!
                alert("🎉 Focus session completed! You earned +150 XP!");
                setMode('shortBreak');
                setTimeLeft(5 * 60);
            } else {
                alert("🌿 Break ended. Ready to focus?");
                setMode('focus');
                setTimeLeft(25 * 60);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, setFocusSessions, onAwardXp]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Add logged activity handler
    const handleLogActivity = () => {
        if (!newActivityName.trim()) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newAct: LoggedActivity = {
            id: Date.now().toString(),
            type: newActivityType,
            name: newActivityName.trim(),
            duration: Number(newActivityDuration),
            timestamp: timeStr
        };

        setLoggedActivities(prev => [newAct, ...prev]);
        setNewActivityName('');

        if (newActivityType === 'productive') {
            setTotalMinsFocused(prev => prev + Number(newActivityDuration));
            onAwardXp(Math.round(Number(newActivityDuration) * 2)); // 2 XP per focus minute!
        } else {
            setTotalMinsDistracted(prev => prev + Number(newActivityDuration));
            setDistractionCount(prev => prev + 1);
        }
    };

    // Calculate Focus Quality Ratio (0-100)
    const focusQualityScore = useMemo(() => {
        const totalTime = totalMinsFocused + totalMinsDistracted;
        if (totalTime === 0) return 100;
        
        // Deduct based on distraction count and duration ratio
        const baseScore = Math.round((totalMinsFocused / totalTime) * 100);
        const penalties = distractionCount * 5;
        return Math.max(10, baseScore - penalties);
    }, [totalMinsFocused, totalMinsDistracted, distractionCount]);

    // Donut chart data mapping
    const chartData = useMemo(() => {
        return [
            { name: 'Productive Flow', value: totalMinsFocused, color: '#06b6d4' }, // cyan-500
            { name: 'Distraction Overload', value: totalMinsDistracted, color: '#ef4444' } // red-500
        ];
    }, [totalMinsFocused, totalMinsDistracted]);

    // Circular progress metrics
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    const maxTime = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    const progress = 1 - (timeLeft / maxTime);
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            
            {/* Deep Focus Mode Shield Screen Overlay */}
            {shieldActive && (
                <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-550">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="max-w-md w-full text-center space-y-8">
                        <div className="relative flex items-center justify-center mx-auto w-24 h-24">
                            <Shield size={70} className="text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                            <span className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping duration-[3000ms]" />
                        </div>

                        <div>
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest font-black">Shield Protocol: Enabled</span>
                            <h2 className="text-3xl font-black text-white mt-4 tracking-tight">Deep Focus Chamber</h2>
                            <p className="text-sm text-slate-500 font-semibold mt-2">All notifications and ambient telemetry are locked out. Immerse yourself in the void.</p>
                        </div>

                        {/* Large pulsing timer */}
                        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-inner font-mono">
                            <div className="text-7xl font-black text-white tracking-widest">{formatTime(timeLeft)}</div>
                            <div className="text-xs font-black uppercase text-cyan-400 tracking-widest mt-3 flex items-center justify-center gap-1.5">
                                <Activity size={14} className="animate-bounce" /> STAY FOCUSING
                            </div>
                        </div>

                        {/* Quick controls */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={toggleTimer}
                                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md cursor-pointer transition-all hover:scale-105 ${
                                    isActive ? 'bg-amber-500' : 'bg-cyan-500'
                                }`}
                            >
                                {isActive ? 'Pause Flow' : 'Initiate Flow'}
                            </button>
                            <button
                                onClick={() => setShieldActive(false)}
                                className="px-6 py-3 bg-slate-950 text-slate-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider border border-slate-800 transition-all cursor-pointer"
                            >
                                Deactivate Shield
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Deep Work Circular Timer */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex justify-between w-full items-center mb-6 relative z-10">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Target className="text-cyan-400 animate-pulse" /> Focus telemetry
                        </h3>
                        
                        <button
                            onClick={() => setShieldActive(true)}
                            className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-black uppercase tracking-widest border border-cyan-500/20 px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                        >
                            🛡️ Distraction Shield
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-950/60 p-1 rounded-xl mb-8 relative z-10 border border-slate-850">
                        <button 
                            onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                mode === 'focus' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-350'
                            }`}
                        >
                            Focus interval
                        </button>
                        <button 
                            onClick={() => { setMode('shortBreak'); setTimeLeft(5 * 60); setIsActive(false); }}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                mode === 'shortBreak' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-350'
                            }`}
                        >
                            Short Break
                        </button>
                        <button 
                            onClick={() => { setMode('longBreak'); setTimeLeft(15 * 60); setIsActive(false); }}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                mode === 'longBreak' ? 'bg-slate-800 text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-350'
                            }`}
                        >
                            Long Break
                        </button>
                    </div>

                    {/* Timer SVG Circle */}
                    <div className="relative w-[280px] h-[280px] flex items-center justify-center mb-8 select-none">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="140"
                                cy="140"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-slate-950"
                            />
                            <circle
                                cx="140"
                                cy="140"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-linear ${
                                    mode === 'focus' 
                                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                                        : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                }`}
                            />
                        </svg>
                        <div className="text-center z-10">
                            <div className="text-6xl font-black text-white font-mono tracking-widest">{formatTime(timeLeft)}</div>
                            <div className="text-[10px] font-black text-slate-500 mt-3.5 uppercase tracking-widest">
                                {mode === 'focus' ? 'Staying Focused' : 'Cognitive recharge'}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 relative z-10">
                        <button 
                            onClick={toggleTimer}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer
                                ${isActive ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/20' : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-cyan-500/20'}`}
                        >
                            {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>
                        <button 
                            onClick={resetTimer}
                            className="w-16 h-16 rounded-full bg-slate-950 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                            title="Reset Timer"
                        >
                            <RotateCcw size={22} />
                        </button>
                    </div>
                </div>

                {/* 2. Distractions Logger & Quality Index */}
                <div className="space-y-6">
                    
                    {/* Top quick stats cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Flow sessions</div>
                            <div className="text-xl font-black text-slate-100 mt-2">{focusSessions}</div>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md relative overflow-hidden group">
                            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Distraction hits</div>
                            <div className="text-xl font-black text-red-400 mt-2">{distractionCount}</div>
                            <button
                                onClick={() => {
                                    setDistractionCount(prev => prev + 1);
                                    setTotalMinsDistracted(prev => prev + 5);
                                    const now = new Date();
                                    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    setLoggedActivities(prev => [
                                        { id: Date.now().toString(), type: 'distraction', name: 'Triggered Distraction', duration: 5, timestamp: timeStr },
                                        ...prev
                                    ]);
                                }}
                                className="absolute right-2 top-2 p-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/25 border border-red-500/20 text-[9px] font-black uppercase tracking-wider cursor-pointer"
                            >
                                Log +
                            </button>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-xl shadow-md">
                            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Quality Index</div>
                            <div className="text-xl font-black text-cyan-400 mt-2">{focusQualityScore} / 100</div>
                        </div>
                    </div>

                    {/* Donut Chart and Interactive Logger Box */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg space-y-6">
                        
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
                            <BarChart3 className="text-cyan-400 animate-pulse" size={16} /> Focus quality donut analysis
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            
                            {/* Recharts donut chart */}
                            <div className="h-[160px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={65}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-black text-slate-550 uppercase tracking-widest">Total minutes</span>
                                    <span className="text-lg font-black text-slate-200">{totalMinsFocused + totalMinsDistracted}m</span>
                                </div>
                            </div>

                            {/* Legend details */}
                            <div className="space-y-3.5">
                                {chartData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs font-bold text-slate-350">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-100 font-mono">{item.value} mins</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interactive Logger form and items list */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Activity size={14} className="text-indigo-400" /> Activity logging interface
                        </h3>
                        
                        {/* Inline logger form */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-850">
                            <div className="sm:col-span-2 space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter objective activity name..."
                                    value={newActivityName}
                                    onChange={(e) => setNewActivityName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500 font-bold"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newActivityType}
                                        onChange={(e) => setNewActivityType(e.target.value as any)}
                                        className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] uppercase font-black tracking-wider rounded-lg p-2 flex-1 focus:ring-cyan-500 cursor-pointer"
                                    >
                                        <option value="productive">🔥 Productive flow</option>
                                        <option value="distraction">🚨 Distraction hit</option>
                                    </select>
                                    <input 
                                        type="number" 
                                        min="1"
                                        max="120"
                                        value={newActivityDuration}
                                        onChange={(e) => setNewActivityDuration(Number(e.target.value))}
                                        className="w-16 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono font-bold"
                                        title="Duration in minutes"
                                    />
                                </div>
                            </div>
                            
                            <button
                                onClick={handleLogActivity}
                                disabled={!newActivityName.trim()}
                                className="w-full h-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-400 disabled:opacity-50 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                                <Plus size={14} /> Commit log
                            </button>
                        </div>

                        {/* Recent log list */}
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                            {loggedActivities.map((act) => (
                                <div key={act.id} className="flex justify-between items-center p-2.5 bg-slate-950/20 border border-slate-850 rounded-xl text-xs">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${act.type === 'productive' ? 'bg-cyan-500' : 'bg-red-500'}`} />
                                        <span className="font-bold text-slate-200 truncate max-w-[200px]">{act.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-500 font-black uppercase">
                                        <span className="font-mono">{act.duration}m</span>
                                        <span>•</span>
                                        <span>{act.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusTracker;
