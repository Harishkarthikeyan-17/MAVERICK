import React, { useState } from 'react';
import {
    Plane, Map, Calendar, Compass, Wallet,
    CheckCircle2, Clock, MapPin, Navigation,
    CloudSun, Briefcase, Plus, Search, Sparkles,
    ShieldCheck, Info, AlertTriangle, Languages
} from 'lucide-react';

const Travel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'docs'>('itinerary');
    const [locationInput, setLocationInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiRules, setAiRules] = useState<{ category: string; icon: any; rules: string[] }[] | null>(null);

    const generateRules = () => {
        if (!locationInput.trim()) return;
        setIsGenerating(true);
        // Mock AI generation delay
        setTimeout(() => {
            const mockRules = [
                {
                    category: 'Entry & Visa',
                    icon: ShieldCheck,
                    rules: [
                        `Valid passport required for at least 6 months beyond stay in ${locationInput}.`,
                        'E-visa recommended for tourism; apply 2 weeks in advance.',
                        'Proof of return flight and accommodation may be requested at customs.'
                    ]
                },
                {
                    category: 'Local Etiquette',
                    icon: Languages,
                    rules: [
                        'Show respect at religious sites; modest dress is required.',
                        'Tipping is not customary but appreciated in tourist areas.',
                        'Learning basic greetings in the local language is highly valued.'
                    ]
                },
                {
                    category: 'Safety & Health',
                    icon: AlertTriangle,
                    rules: [
                        'Standard vaccinations recommended; consult your doctor.',
                        'Avoid drinking tap water; opt for bottled or filtered water.',
                        'Keep copies of important documents in a separate location.'
                    ]
                },
                {
                    category: 'General Tips',
                    icon: Info,
                    rules: [
                        'Connectivity: Local SIM cards are easily available at the airport.',
                        'Currency: Cash is still king in smaller establishments.',
                        'Transport: Public transport is efficient; get a reloadable travel card.'
                    ]
                }
            ];
            setAiRules(mockRules);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
                        Voyage Planner
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-widest font-black">
                            AI Optimized
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-1">Seamlessly coordinate your global adventures.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all">
                        <Search size={16} />
                        Explore
                    </button>
                    <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-900/20">
                        <Plus size={16} />
                        New Trip
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Trip Overview & Weather */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl overflow-hidden relative group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Current Trip</h3>
                                    <h4 className="text-2xl font-bold text-slate-100">Tokyo Odyssey</h4>
                                </div>
                                <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20">
                                    <Plane className="text-cyan-400" size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Dates</p>
                                        <p className="text-sm font-medium text-slate-200">Oct 12 - Oct 24, 2026</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Base</p>
                                        <p className="text-sm font-medium text-slate-200">Shibuya, Tokyo</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800/50">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-2xl font-black text-slate-100">76%</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Plan Readiness</p>
                                    </div>
                                    <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 w-[76%] shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-cyan-500/10 transition-colors" />
                    </div>

                    {/* Destination Weather/Context */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CloudSun size={16} />
                            Tokyo Context
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Temp</p>
                                <p className="text-xl font-bold text-slate-100">22°C</p>
                                <p className="text-[10px] text-green-400 mt-1">Perfect for walks</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Timezone</p>
                                <p className="text-xl font-bold text-slate-100">JST</p>
                                <p className="text-[10px] text-slate-500 mt-1">GMT +9:00</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Rules & Guidelines Section */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={16} />
                                AI Travel Guidelines
                            </h3>

                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter Country or State..."
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all pr-12"
                                    />
                                    <button
                                        onClick={generateRules}
                                        disabled={isGenerating || !locationInput.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600/10 text-cyan-400 rounded-lg hover:bg-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isGenerating ? <div className="w-4 h-4 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" /> : <Plus size={18} />}
                                    </button>
                                </div>

                                {aiRules && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                        {aiRules.map((section, idx) => (
                                            <div key={idx} className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-2xl hover:border-slate-700/50 transition-all">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-slate-900 rounded-lg text-cyan-400">
                                                        <section.icon size={16} />
                                                    </div>
                                                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">{section.category}</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {section.rules.map((rule, i) => (
                                                        <li key={i} className="flex gap-2 text-xs text-slate-400">
                                                            <div className="w-1 h-1 bg-cyan-500/50 rounded-full mt-1.5 shrink-0" />
                                                            {rule}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!aiRules && !isGenerating && (
                                    <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl">
                                        <Compass className="mx-auto text-slate-700 mb-2" size={32} />
                                        <p className="text-xs text-slate-500">Enter a destination to get AI-powered local rules and travel instructions.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-cyan-500/10 transition-colors" />
                    </div>
                </div>

                {/* Center: Tabs & Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex p-1 bg-slate-950 border border-slate-800/50 rounded-2xl w-fit">
                        {[
                            { id: 'itinerary', label: 'Itinerary', icon: Map },
                            { id: 'budget', label: 'Finance', icon: Wallet },
                            { id: 'docs', label: 'Documents', icon: Briefcase },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab.id
                                        ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-xl'
                                        : 'text-slate-500 hover:text-slate-300'}
                `}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl min-h-[400px] overflow-hidden">
                        {activeTab === 'itinerary' && (
                            <div className="p-6 space-y-6 animate-in slide-in-from-left-4 duration-500">
                                {[
                                    {
                                        day: 'Day 1', date: 'Oct 12', activities: [
                                            { time: '09:00', title: 'Arrival at Narita', desc: 'Transfer to Shibuya', status: 'done' },
                                            { time: '14:00', title: 'Hotel Check-in', desc: 'Hotel Indigo Tokyo', status: 'active' },
                                            { time: '19:00', title: 'Welcome Dinner', desc: 'Shinjuku Omoide Yokocho', status: 'pending' },
                                        ]
                                    },
                                    {
                                        day: 'Day 2', date: 'Oct 13', activities: [
                                            { time: '10:00', title: 'Meiji Jingu Shrine', desc: 'Morning spiritual walk', status: 'pending' },
                                            { time: '13:00', title: 'Harajuku Exploration', desc: 'Takeshita Street & Omotesando', status: 'pending' },
                                        ]
                                    },
                                ].map((day, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-slate-100">{day.day}</span>
                                            <span className="text-xs font-bold text-slate-500 px-2 py-0.5 border border-slate-800 rounded-lg bg-slate-950">{day.date}</span>
                                        </div>
                                        <div className="relative pl-6 space-y-4 border-l border-slate-800 ml-3">
                                            {day.activities.map((act, i) => (
                                                <div key={i} className="relative group">
                                                    {/* Dot */}
                                                    <div className={`
                            absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 z-10
                            ${act.status === 'done' ? 'bg-green-500' : act.status === 'active' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}
                          `} />

                                                    <div className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-2xl group-hover:border-slate-700 transition-colors">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="text-[10px] font-black text-slate-500 mb-1 block">{act.time}</span>
                                                                <h5 className="text-sm font-bold text-slate-200">{act.title}</h5>
                                                                <p className="text-xs text-slate-500 mt-1">{act.desc}</p>
                                                            </div>
                                                            {act.status === 'done' && <CheckCircle2 className="text-green-500" size={16} />}
                                                            {act.status === 'active' && <Navigation className="text-cyan-400" size={16} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'budget' && (
                            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] animate-in slide-in-from-right-4 duration-500">
                                <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 mb-4 shadow-xl">
                                    <Wallet size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-200">Financial Overview</h3>
                                <p className="text-slate-500 mt-2 max-w-sm">Linking your cards to Tokyo Odyssey trip. Syncing real-time JPY exchange rates.</p>
                                <div className="mt-8 grid grid-cols-2 gap-6 w-full max-w-md">
                                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-left">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Spent</p>
                                        <p className="text-2xl font-black text-slate-100">$2,450</p>
                                    </div>
                                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-left">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Remaining</p>
                                        <p className="text-2xl font-black text-cyan-400">$1,550</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
                                {[
                                    { name: 'Flight Tickets', size: '2.4 MB', type: 'PDF' },
                                    { name: 'Hotel Confirmation', size: '1.1 MB', type: 'PDF' },
                                    { name: 'Visa Approval', size: '4.8 MB', type: 'IMAGE' },
                                    { name: 'Travel Insurance', size: '0.8 MB', type: 'PDF' },
                                ].map((doc, i) => (
                                    <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-200">{doc.name}</h5>
                                            <p className="text-[10px] text-slate-500 font-bold">{doc.type} • {doc.size}</p>
                                        </div>
                                    </div>
                                ))}
                                <button className="md:col-span-2 mt-4 p-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-sm font-medium">
                                    + Upload Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Travel;
