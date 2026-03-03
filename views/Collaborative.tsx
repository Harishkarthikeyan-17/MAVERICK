import React, { useState } from 'react';
import {
    Users as UsersIcon, Plus, LogIn, Layout, CheckSquare,
    FileText, Code, MessageSquare, Shield,
    Settings, Upload, Share2, Lock, Unlock,
    MoreVertical, UserPlus, Clock, Info,
    Folder, ChevronRight, Send, User as UserIcon,
    AlertCircle, Users
} from 'lucide-react';

type Role = 'Admin' | 'Editor' | 'Viewer';
type AccessType = 'View Only' | 'View + Post' | 'Full Collaboration';

interface Member {
    id: string;
    name: string;
    role: Role;
    status: 'online' | 'offline';
}

interface Task {
    id: string;
    title: string;
    assignedTo: string;
    assignedBy: string;
    status: 'Pending' | 'In Progress' | 'Completed';
}

interface RoomFile {
    id: string;
    name: string;
    uploadedBy: string;
    lastModified: string;
    size: string;
}

interface Comment {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

interface Room {
    id: string;
    name: string;
    description: string;
    code: string;
    accessType: AccessType;
    currentUserRole: Role;
    members: Member[];
    tasks: Task[];
    files: RoomFile[];
    comments: Comment[];
    workspaceContent: string;
    isLocked: boolean;
}

const Collaborative: React.FC = () => {
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [sidebarTab, setSidebarTab] = useState<'Overview' | 'Tasks' | 'Files' | 'Workspace' | 'Comments' | 'Members'>('Overview');
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);

    // Form States
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');
    const [newRoomAccess, setNewRoomAccess] = useState<AccessType>('Full Collaboration');
    const [joinCode, setJoinCode] = useState('');

    const createRoom = () => {
        if (!newRoomName) return;
        const newRoom: Room = {
            id: Math.random().toString(36).substr(2, 9),
            name: newRoomName,
            description: newRoomDesc,
            code: Math.random().toString(36).substr(2, 6).toUpperCase(),
            accessType: newRoomAccess,
            currentUserRole: 'Admin',
            members: [
                { id: '1', name: 'User_01', role: 'Admin', status: 'online' },
                { id: '2', name: 'Alara_AI', role: 'Editor', status: 'online' }
            ],
            tasks: [
                { id: 't1', title: 'Initialize System Architecture', assignedTo: 'User_01', assignedBy: 'Alara_AI', status: 'Completed' },
                { id: 't2', title: 'Security Protocol Audit', assignedTo: 'User_01', assignedBy: 'Admin', status: 'In Progress' }
            ],
            files: [
                { id: 'f1', name: 'Maverick_Spec.pdf', uploadedBy: 'Admin', lastModified: '10 Oct', size: '2.4 MB' },
                { id: 'f2', name: 'Source_V1.zip', uploadedBy: 'Editor', lastModified: '11 Oct', size: '14.8 MB' }
            ],
            comments: [
                { id: 'c1', user: 'Admin', text: 'Welcome to the new Maverick Hub!', timestamp: '2m ago' },
                { id: 'c2', user: 'User_01', text: 'Thanks! Workspace is looking great.', timestamp: '1m ago' }
            ],
            workspaceContent: '// Global Maverick Collaboration Workspace\n// Shared state and real-time edits enabled below\n\nconst maverick = {\n  status: "Active",\n  version: "2.0.4",\n  activeModules: ["Travel", "Finance", "Collaboration"]\n};',
            isLocked: false
        };
        setJoinedRooms([...joinedRooms, newRoom]);
        setActiveRoom(newRoom);
        setIsCreatingRoom(false);
        // Clear form
        setNewRoomName('');
        setNewRoomDesc('');
    };

    const joinRoom = () => {
        if (!joinCode) return;
        // Mock join logic - pretend we found a room
        alert(`Joining room: ${joinCode}`);
        setJoinCode('');
    };

    if (!activeRoom) {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-100 flex items-center gap-3">
                            Collaborative Space
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-[0.2em] font-black">
                                Multi-User
                            </span>
                        </h2>
                        <p className="text-slate-400 mt-2 text-lg">Real-time collaboration, shared tasks, and secure workspaces.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCreatingRoom(true)}
                            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-cyan-900/20"
                        >
                            <Plus size={20} />
                            New Room
                        </button>
                    </div>
                </header>

                {isCreatingRoom && (
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] animate-in slide-in-from-top-4 duration-500 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-slate-100 mb-6">Initialize Workspace</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Room Identity</label>
                                    <input
                                        type="text"
                                        value={newRoomName}
                                        onChange={(e) => setNewRoomName(e.target.value)}
                                        placeholder="e.g. Project Maverick Core"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Objective</label>
                                    <textarea
                                        value={newRoomDesc}
                                        onChange={(e) => setNewRoomDesc(e.target.value)}
                                        placeholder="Describe the collaboration goals..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all min-h-[100px]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Permission Tier</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {(['View Only', 'View + Post', 'Full Collaboration'] as AccessType[]).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setNewRoomAccess(type)}
                                                className={`p-4 rounded-2xl border text-sm font-bold transition-all ${newRoomAccess === type ? 'bg-cyan-600/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={createRoom}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-cyan-900/40"
                                    >
                                        Initialize Room
                                    </button>
                                    <button
                                        onClick={() => setIsCreatingRoom(false)}
                                        className="px-8 border border-slate-800 text-slate-500 hover:bg-slate-800 rounded-2xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32" />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-slate-100 mb-2">Active Workspaces</h3>
                                <p className="text-slate-500 mb-8 max-w-lg">Manage your ongoing projects or join a room using an access code provided by an admin.</p>

                                {joinedRooms.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {joinedRooms.map((room) => (
                                            <div
                                                key={room.id}
                                                onClick={() => setActiveRoom(room)}
                                                className="bg-slate-950 border border-slate-800 p-6 rounded-3xl hover:border-cyan-500/40 transition-all cursor-pointer group hover:bg-slate-900/50 shadow-lg hover:shadow-cyan-900/5"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                                                        <Users size={24} />
                                                    </div>
                                                    <span className="text-[10px] bg-slate-900 text-slate-500 px-3 py-1 rounded-full border border-slate-800 font-black tracking-widest uppercase">
                                                        {room.currentUserRole}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{room.name}</h4>
                                                <p className="text-xs text-slate-500 mt-2 line-clamp-1">{room.description}</p>
                                                <div className="mt-8 flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        {room.members.map((m, idx) => (
                                                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                                                {m.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <ChevronRight className="text-slate-700 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" size={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-950/20">
                                        <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mx-auto mb-6">
                                            <Layout size={32} />
                                        </div>
                                        <p className="text-slate-500 font-medium italic">No active rooms found. Initialize your first space.</p>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/5 blur-[120px] -mr-40 -mt-40 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-xl">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Shield size={16} className="text-cyan-500" />
                                Secure Portal
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-5 text-slate-200 placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all text-center tracking-[0.5em] font-black uppercase text-xl"
                                />
                                <button
                                    onClick={joinRoom}
                                    className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-200 py-4 rounded-2xl font-bold transition-all border border-slate-700 shadow-lg"
                                >
                                    <LogIn size={20} />
                                    Access Room
                                </button>
                            </div>
                            <div className="mt-8 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Unique access codes provide encrypted entry to private collaboration clusters.</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5 group cursor-pointer hover:border-cyan-500/30 transition-all">
                            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-cyan-400 transition-colors">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Community Hub</h4>
                                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Global Discussions</p>
                            </div>
                            <ChevronRight className="ml-auto text-slate-800" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isAdmin = activeRoom.currentUserRole === 'Admin';
    const canEdit = activeRoom.currentUserRole === 'Admin' || activeRoom.currentUserRole === 'Editor';

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
            {/* Inner Header */}
            <header className="flex items-center justify-between mb-8 bg-slate-900/50 border border-slate-800 p-6 rounded-[2.5rem] backdrop-blur-xl">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => setActiveRoom(null)}
                        className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-slate-500 hover:text-cyan-400 transition-all hover:scale-105"
                    >
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                            {activeRoom.name}
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-cyan-400 font-black tracking-[0.2em] uppercase">TOKEN: {activeRoom.code}</span>
                            <div className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase">{activeRoom.accessType}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 mr-4">
                        {activeRoom.members.map(m => (
                            <div
                                key={m.id}
                                title={`${m.name} (${m.role})`}
                                className={`w-10 h-10 rounded-2xl border-2 border-slate-900 bg-slate-800 flex items-center justify-center font-black text-xs transition-all cursor-help ${m.status === 'online' ? 'text-green-400 ring-4 ring-green-500/10' : 'text-slate-600'}`}
                            >
                                {m.name.substring(0, 2).toUpperCase()}
                            </div>
                        ))}
                    </div>
                    {isAdmin && (
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-2xl transition-all shadow-lg flex items-center gap-2 font-bold text-sm px-5">
                            <UserPlus size={18} />
                            Invite
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Left Panel - Navigation */}
                <div className="w-64 flex flex-col gap-2">
                    {[
                        { id: 'Overview', icon: Layout },
                        { id: 'Tasks', icon: CheckSquare },
                        { id: 'Files', icon: Folder },
                        { id: 'Workspace', icon: Code },
                        { id: 'Comments', icon: MessageSquare },
                        { id: 'Members', icon: UsersIcon },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSidebarTab(tab.id as any)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group ${sidebarTab === tab.id ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/10' : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'}`}
                        >
                            <tab.icon size={20} className={sidebarTab === tab.id ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400 transition-colors'} />
                            {tab.id}
                            {sidebarTab === tab.id && <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full" />}
                        </button>
                    ))}

                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                        <div className="bg-slate-950/40 border border-slate-800/50 p-5 rounded-[2rem] group relative overflow-hidden">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Identity Signature</p>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center text-white font-black text-xs shadow-lg">U1</div>
                                <div>
                                    <p className="text-xs font-bold text-slate-100">User_01</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isAdmin ? 'text-red-400' : 'text-cyan-500/80'}`}>{activeRoom.currentUserRole}</p>
                                </div>
                                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-cyan-600/10 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Center Content Area */}
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[3.5rem] flex flex-col min-h-0 overflow-hidden relative shadow-2xl">
                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        {sidebarTab === 'Overview' && (
                            <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <Info size={16} /> CORE OBJECTIVE
                                    </h3>
                                    <p className="text-3xl font-medium text-slate-100 leading-tight max-w-2xl">{activeRoom.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-8">
                                    <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800/50 hover:border-slate-700/50 transition-all">
                                        <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-6">Security Protocols</h4>
                                        <div className="space-y-5">
                                            {['Isolated Data Clusters', 'Encrypted Comm-Channels', 'Role-Based Authentication'].map(r => (
                                                <div key={r} className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                    <div className="w-2 h-2 bg-cyan-500/40 rounded-full" />
                                                    {r}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-800/50 hover:border-slate-700/50 transition-all">
                                        <h4 className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-6">Resource Allocation</h4>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-2xl font-black text-slate-100 tracking-tighter">4.2 GB</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Total Storage Used</p>
                                                </div>
                                                <p className="text-[10px] text-cyan-400 font-black tracking-widest">42% LOAD</p>
                                            </div>
                                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-500 w-[42%] shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'Tasks' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-slate-100 flex items-center gap-4">
                                        Mission Ledger
                                        <div className="bg-slate-950 text-cyan-500 px-3 py-1 rounded-xl text-xs border border-slate-800 font-black">{activeRoom.tasks.length}</div>
                                    </h3>
                                    {canEdit && (
                                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/20">
                                            <Plus size={16} /> New Assignment
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {activeRoom.tasks.map(t => (
                                        <div key={t.id} className="bg-slate-950/40 border border-slate-800/40 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-slate-950/80 hover:border-slate-700/50 transition-all cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-3 rounded-2xl transition-colors ${t.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-slate-900 text-slate-600 group-hover:text-slate-400'}`}>
                                                    <CheckSquare size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">{t.title}</h4>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-black text-slate-500">U</div>
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.assignedTo}</span>
                                                        </div>
                                                        <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{t.assignedBy} initialized</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${t.status === 'Completed' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-slate-800 text-slate-600 bg-slate-900/50'}`}>
                                                    {t.status}
                                                </div>
                                                <button className="text-slate-800 hover:text-slate-400 transition-colors"><MoreVertical size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'Files' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-slate-100">Encrypted Repository</h3>
                                    {canEdit && (
                                        <button className="bg-slate-950 hover:bg-slate-900 text-slate-300 px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-800">
                                            <Upload size={16} /> Secure Upload
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {activeRoom.files.map((file) => (
                                        <div key={file.id} className="bg-slate-950/50 border border-slate-800/50 p-6 rounded-[2rem] flex items-center gap-5 group hover:border-cyan-500/30 hover:bg-slate-950 transition-all cursor-pointer relative overflow-hidden">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                                                <FileText size={28} />
                                            </div>
                                            <div className="flex-1 relative z-10">
                                                <h5 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{file.name}</h5>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{file.lastModified}</span>
                                                    <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                                    <span className="text-[9px] text-cyan-600/60 font-black uppercase tracking-widest">{file.size}</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <ChevronRight className="text-slate-800 group-hover:text-slate-400 transition-colors" size={20} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'Workspace' && (
                            <div className="h-full flex flex-col space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-slate-100">Maverick Protocol Workspace</h3>
                                        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            <span className="text-[10px] text-green-400 font-black tracking-[0.2em]">LIVE STREAMING</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-800">
                                        <Clock size={14} className="text-slate-600" />
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Modified 2m ago</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-[2.5rem] p-10 relative overflow-hidden shadow-inner group">
                                    <textarea
                                        className={`w-full h-full bg-transparent border-none focus:ring-0 text-slate-300 font-mono text-sm leading-relaxed resize-none custom-scrollbar p-0 ${(!canEdit || activeRoom.isLocked) ? 'cursor-not-allowed opacity-50' : ''}`}
                                        disabled={!canEdit || activeRoom.isLocked}
                                        value={activeRoom.workspaceContent}
                                        onChange={(e) => setActiveRoom({ ...activeRoom, workspaceContent: e.target.value })}
                                        placeholder="Start typing to synchronize data with active collaborators..."
                                    />
                                    {(!canEdit || activeRoom.isLocked) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm rounded-[2.5rem] pointer-events-none z-20">
                                            <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-3xl flex items-center gap-4 shadow-2xl">
                                                <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                                                    <Lock size={20} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black text-slate-100 uppercase tracking-widest block">Input Inhibited</span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">{activeRoom.isLocked ? 'Locked by Admin Override' : 'Requires Elevated Permissions'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-6 right-8 text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] group-hover:text-slate-700 transition-colors">Maverick Environment V2</div>
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'Comments' && (
                            <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500">
                                <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
                                    {activeRoom.comments.map((c, i) => (
                                        <div key={i} className="flex gap-5 group">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex flex-shrink-0 items-center justify-center font-black text-sm text-slate-600 transition-all group-hover:border-cyan-500/40 group-hover:text-cyan-400">
                                                {c.user[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="text-sm font-bold text-slate-100">{c.user}</span>
                                                    <span className="text-[10px] text-slate-700 font-black tracking-widest uppercase flex items-center gap-2">
                                                        <Clock size={10} /> {c.timestamp}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-950 border border-slate-800/60 p-5 rounded-[2rem] rounded-tl-none inline-block max-w-xl shadow-lg">
                                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{c.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 relative">
                                    <input
                                        type="text"
                                        placeholder="Transmit data to room cluster..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-sm text-slate-300 placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all pr-20 shadow-xl"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-cyan-600 text-white rounded-2xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/40 active:scale-95">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {sidebarTab === 'Members' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-slate-100">Participant Nexus</h3>
                                    {isAdmin && (
                                        <button className="bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 hover:bg-cyan-600/20 active:scale-95 shadow-lg">
                                            <UserPlus size={18} /> Provision Access
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {activeRoom.members.map(m => (
                                        <div key={m.id} className="bg-slate-950/40 border border-slate-800/40 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-slate-950 hover:border-slate-700/50 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-slate-600 transition-all group-hover:border-cyan-500/20 ${m.status === 'online' ? 'ring-2 ring-green-500/5' : ''}`}>
                                                    {m.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h5 className="text-base font-bold text-slate-100">{m.name}</h5>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${m.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-800'}`} />
                                                        <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">{m.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${m.role === 'Admin' ? 'border-red-500/30 text-red-400 bg-red-500/5' : m.role === 'Editor' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' : 'border-slate-800 text-slate-700'}`}>{m.role}</span>
                                                {isAdmin && m.id !== '1' && (
                                                    <button className="text-slate-800 hover:text-slate-300 p-2 transition-colors"><MoreVertical size={20} /></button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Oversight & Control */}
                <div className="w-80 space-y-6 flex flex-col min-h-0">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex-shrink-0 shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <Share2 size={16} className="text-cyan-500" />
                                Distribution
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/80">
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Room Access Code</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-slate-100 tracking-[0.2em]">{activeRoom.code}</span>
                                        <button className="text-cyan-400 hover:scale-125 transition-all active:rotate-12"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-600/5 blur-3xl rounded-full" />
                    </div>

                    {isAdmin && (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex-1 min-h-0 overflow-y-auto no-scrollbar shadow-2xl">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Shield size={16} className="text-red-500" />
                                Governance
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Interface Lock</p>
                                        <p className="text-[10px] text-slate-600 mt-1 font-medium">Inhibit real-time edits</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveRoom({ ...activeRoom, isLocked: !activeRoom.isLocked })}
                                        className={`w-12 h-7 rounded-full transition-all relative shadow-lg ${activeRoom.isLocked ? 'bg-red-500' : 'bg-slate-950 border border-slate-800'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 rounded-full transition-all shadow-md ${activeRoom.isLocked ? 'right-1 bg-white' : 'left-1 bg-slate-700'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between group pointer-events-none opacity-40">
                                    <div>
                                        <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">Protocol Enforcement</p>
                                        <p className="text-[10px] text-slate-600 mt-1 font-medium">Admin-only artifact upload</p>
                                    </div>
                                    <div className="w-12 h-7 rounded-full bg-slate-950 border border-slate-800 relative">
                                        <div className="absolute top-1 left-1 w-5 h-5 bg-slate-800 rounded-full" />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-800/80">
                                    <button className="w-full bg-slate-950/50 hover:bg-red-500/10 text-slate-600 hover:text-red-400 border border-slate-800 hover:border-red-500/30 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                        Terminal Decommission
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-[2rem]">
                                        <div className="flex items-center gap-3 text-cyan-400 mb-3">
                                            <Info size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oversight Tip</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Assign 'Editor' role to trusted collaborators for full contribution rights while maintaining master lock control.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isAdmin && (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] flex-1 shadow-2xl">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Role Privileges</h3>
                            <div className="space-y-5">
                                {[
                                    { label: 'Content Modification', ok: canEdit },
                                    { label: 'Artifact Upload', ok: canEdit },
                                    { label: 'Mission Assignment', ok: isAdmin },
                                    { label: 'Participant Governance', ok: isAdmin },
                                ].map(p => (
                                    <div key={p.label} className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{p.label}</span>
                                        {p.ok ? <Unlock size={14} className="text-green-500" /> : <Lock size={14} className="text-slate-800" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
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
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Collaborative;
