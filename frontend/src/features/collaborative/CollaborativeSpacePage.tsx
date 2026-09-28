import React, { useState } from 'react';
import {
    Users,
    Plus,
    LogIn,
    CheckSquare,
    MessageSquare,
    Sparkles,
    ClipboardList,
    User,
    Crown,
    Layout,
    BookOpen,
    ArrowRight
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
}

interface Member {
    id: string;
    name: string;
    role: 'Leader' | 'Member';
}

interface Room {
    id: string;
    name: string;
    code: string;
}

const CollaborativeSpacePage: React.FC = () => {
    const [activeRoomId, setActiveRoomId] = useState('1');
    const [roomCode, setRoomCode] = useState('');

    const rooms: Room[] = [
        { id: '1', name: 'Project Maverick Core', code: 'MAV-72X' },
        { id: '2', name: 'Design Sprint Hub', code: 'SPR-45Y' },
        { id: '3', name: 'Frontend Refactor', code: 'REF-09Z' },
    ];

    const tasks: Task[] = [
        { id: 't1', title: 'Initialize System Architecture', status: 'Completed' },
        { id: 't2', title: 'Security Protocol Audit', status: 'In Progress' },
        { id: 't3', title: 'User Interface Refinement', status: 'Not Started' },
        { id: 't4', title: 'Backend API Integration', status: 'In Progress' },
    ];

    const members: Member[] = [
        { id: 'm1', name: 'User_01', role: 'Leader' },
        { id: 'm2', name: 'Alara_AI', role: 'Member' },
        { id: 'm3', name: 'Dev_Alpha', role: 'Member' },
    ];

    const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'In Progress': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-700">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Layout className="text-white" size={24} />
                    </div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
                        MAVERIC
                    </h1>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 transition-all">
                        <Plus size={18} />
                        Create Room
                    </button>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex-1 md:flex-none">
                        <input
                            type="text"
                            placeholder="Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-24 placeholder:text-slate-700 font-mono tracking-widest"
                        />
                    </div>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-900/20">
                        <LogIn size={18} />
                        Join
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">

                {/* LEFT SIDEBAR PANEL */}
                <aside className="w-72 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Your Rooms */}
                    <section className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-1">Your Rooms</h3>
                        <div className="space-y-2">
                            {rooms.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => setActiveRoomId(room.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border ${activeRoomId === room.id
                                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                            : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Users size={18} />
                                        <span className="text-sm font-bold truncate max-w-[120px]">{room.name}</span>
                                    </div>
                                    {activeRoomId === room.id && <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Tasks Section */}
                    <section className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mission Ledger</h3>
                            <ClipboardList size={14} className="text-slate-600" />
                        </div>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                                    <p className="text-xs font-bold text-slate-200 mb-2 truncate">{task.title}</p>
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Members Section */}
                    <section className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-1">Personnel</h3>
                        <div className="space-y-3">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-700">
                                            {member.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{member.name}</span>
                                    </div>
                                    {member.role === 'Leader' && <Crown size={12} className="text-amber-500" />}
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 bg-slate-900/30 border border-slate-800 rounded-[2.5rem] flex flex-col min-h-0 shadow-2xl overflow-hidden relative">

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                        {/* Room Header */}
                        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">{activeRoom.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.3em]">Channel Code:</span>
                                    <span className="text-xs font-mono text-slate-400 font-bold bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">{activeRoom.code}</span>
                                </div>
                            </div>
                            <div className="flex -space-x-3">
                                {members.map(m => (
                                    <div key={m.id} className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                                        {m.name[0]}
                                    </div>
                                ))}
                            </div>
                        </header>

                        {/* Progress Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overall Workspace Progress</p>
                                    <p className="text-4xl font-black text-slate-100 tracking-tighter">72<span className="text-lg text-cyan-500 font-bold">%</span></p>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-cyan-500 w-[72%] shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />
                            </div>

                            <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Individual Contribution</p>
                                    <p className="text-4xl font-black text-slate-100 tracking-tighter">48<span className="text-lg text-blue-500 font-bold">%</span></p>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[48%] shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
                            </div>
                        </div>

                        {/* Common Workspace Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <MessageSquare size={16} className="text-cyan-400" />
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Common Workspace</h3>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] p-6 shadow-inner relative group">
                                <textarea
                                    className="w-full h-48 bg-transparent border-none focus:ring-0 text-slate-300 font-medium text-sm leading-relaxed resize-none placeholder:text-slate-800"
                                    placeholder="The collaborative terminal is active. Shared notes, synchronized drafts, and real-time idea synthesis occur here..."
                                />
                                <div className="absolute bottom-4 right-6 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Sync Alpha</span>
                                </div>
                            </div>
                        </section>

                        {/* Subtopic Description Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <BookOpen size={16} className="text-blue-400" />
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Logic & Breakdown</h3>
                            </div>
                            <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6">
                                <textarea
                                    className="w-full h-32 bg-transparent border-none focus:ring-0 text-slate-400 text-sm leading-relaxed resize-none placeholder:text-slate-800"
                                    placeholder="Detail the technical logic, implementation breakdown, or specific subtopic parameters for this room..."
                                />
                            </div>
                        </section>

                        {/* AI Suggestions Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-400" />
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">AI Integration Hub</h3>
                                </div>
                                <span className="text-[9px] text-slate-600 font-medium italic">AI suggestions appear only with user consent</span>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl">
                                <div className="space-y-4">
                                    {[
                                        "Consider optimizing the database index for high-frequency room lookups.",
                                        "System performance could be improved by batching live-sync updates.",
                                        "Recommendation: Implement multi-factor authentication for room access codes."
                                    ].map((sug, i) => (
                                        <div key={i} className="flex items-start gap-4 p-3 bg-slate-900/50 rounded-2xl border border-slate-800/50 group hover:border-amber-500/20 transition-all">
                                            <div className="mt-1 w-1.5 h-1.5 bg-amber-500/40 rounded-full group-hover:bg-amber-500 transition-colors" />
                                            <p className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{sug}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
        </div>
    );
};

export default CollaborativeSpacePage;
