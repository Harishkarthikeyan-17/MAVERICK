import React, { useState } from 'react';
import { 
  Folder, 
  Link as LinkIcon, 
  FileText, 
  Video, 
  Book, 
  Code, 
  Image as ImageIcon, 
  Star, 
  MoreVertical, 
  Plus, 
  Search, 
  List, 
  Grid,
  Bot,
  BrainCircuit,
  X,
  Library
} from 'lucide-react';

const MOCK_RESOURCES = [
  {
    id: 'r1', type: 'Link', title: 'React Native Navigation Documentation', 
    url: 'https://reactnavigation.org', skills: ['React Native'], status: 'In Progress', 
    date: '2 days ago', starred: true, 
    aiSummary: 'Official docs detailing Stack, Tab, and Drawer navigators. Crucial for understanding the state persistence mechanism.',
    note: 'Read the section on deep linking thoroughly.'
  },
  {
    id: 'r2', type: 'Video', title: 'System Design Interview: Twitter', 
    url: 'https://youtube.com/...', skills: ['System Design'], status: 'Unread', 
    date: '5 days ago', starred: false, 
    aiSummary: 'A 45-minute breakdown of Twitter architecture focusing on fanout and caching strategies.',
    note: ''
  },
  {
    id: 'r3', type: 'PDF', title: 'Designing Data-Intensive Applications Ch. 3', 
    url: '', skills: ['System Design', 'Databases'], status: 'Completed', 
    date: '2 weeks ago', starred: true, 
    aiSummary: 'Covers storage and retrieval engines: B-Trees vs SSTables/LSM-Trees.',
    note: 'LSM trees are optimized for high write throughput.'
  }
];

const FOLDERS = [
  { id: 'all', name: 'All Resources', count: 42, icon: <Folder size={16} /> },
  { id: 'starred', name: 'Starred', count: 5, icon: <Star size={16} className="text-yellow-500" /> },
  { id: 'unread', name: 'Unread', count: 18, icon: <FileText size={16} className="text-cyan-400" /> },
  { id: 'videos', name: 'Videos', count: 12, icon: <Video size={16} className="text-red-400" /> },
  { id: 'books', name: 'Books', count: 3, icon: <Book size={16} className="text-orange-400" /> },
];

const ResourceVault: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'Link': return <LinkIcon size={20} className="text-blue-400" />;
      case 'Video': return <Video size={20} className="text-red-400" />;
      case 'PDF': return <FileText size={20} className="text-orange-400" />;
      case 'Book': return <Book size={20} className="text-emerald-400" />;
      case 'Code Snippet': return <Code size={20} className="text-purple-400" />;
      default: return <FileText size={20} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Unread': return 'bg-slate-800 text-slate-300';
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* LEFT PANEL: FOLDERS */}
      <div className="w-full lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/50 flex flex-col">
        <div className="p-6 pb-2 border-b border-slate-800/50">
           <h2 className="text-xl font-black text-slate-100 tracking-tight mb-4 flex items-center gap-2">
             <Library size={20} className="text-cyan-400" /> Vault
           </h2>
           <button 
             onClick={() => setShowAddModal(true)}
             className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 mb-4"
           >
             <Plus size={18} /> New Resource
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {FOLDERS.map(f => (
            <button 
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeFolder === f.id ? 'bg-cyan-500/10 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 font-medium'}`}
            >
              <div className="flex items-center gap-3">
                {f.icon}
                <span>{f.name}</span>
              </div>
              <span className={`text-xs ${activeFolder === f.id ? 'text-cyan-400' : 'text-slate-500'}`}>{f.count}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">By Skill</p>
             <button className="w-full flex items-center justify-between p-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all font-medium">
               <div className="flex items-center gap-3"><Folder size={16} /> React Native</div>
             </button>
             <button className="w-full flex items-center justify-between p-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all font-medium">
               <div className="flex items-center gap-3"><Folder size={16} /> System Design</div>
             </button>
          </div>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search titles, notes, or AI summaries..." 
              className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-11 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Intelligence Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-4 mb-6 flex items-start gap-4">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0"><BrainCircuit size={20} /></div>
            <div>
              <p className="text-sm text-slate-300"><strong>Gap Alert:</strong> You have active goals for <em>AWS Deployment</em> but 0 resources saved in your vault. Want me to find some top-rated guides?</p>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-2">Yes, find resources →</button>
            </div>
          </div>

          {viewMode === 'list' ? (
             <div className="space-y-3">
               {MOCK_RESOURCES.map(res => (
                 <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 hover:shadow-xl transition-all group">
                   <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                     {getResourceIcon(res.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between gap-4">
                       <h3 className="text-base font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors cursor-pointer">{res.title}</h3>
                       <div className="flex items-center gap-2 shrink-0">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>{res.status}</span>
                         <button className="text-slate-500 hover:text-yellow-500 transition-colors">
                           <Star size={16} fill={res.starred ? "currentColor" : "none"} className={res.starred ? "text-yellow-500" : ""} />
                         </button>
                         <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                       </div>
                     </div>
                     <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                       {res.skills.map(s => (
                         <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">{s}</span>
                       ))}
                       <span className="text-[10px] text-slate-500 ml-auto">{res.date}</span>
                     </div>
                     <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 flex gap-3">
                       <Bot size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                       <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">{res.aiSummary}</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Grid view implementation similar to list but stacked */}
                {MOCK_RESOURCES.map(res => (
                  <div key={res.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col hover:border-slate-700 hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                         {getResourceIcon(res.type)}
                       </div>
                       <div className="flex items-center gap-2 shrink-0">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>{res.status}</span>
                         <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors cursor-pointer">{res.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                       {res.skills.map(s => (
                         <span key={s} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">{s}</span>
                       ))}
                    </div>
                    <div className="mt-auto bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 flex gap-2">
                       <Bot size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                       <p className="text-[10px] text-slate-400 leading-relaxed italic line-clamp-3">{res.aiSummary}</p>
                     </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-100">Add Resource</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-all"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Type Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto scrollbar-hide">
                {['URL/Link', 'Note', 'PDF File', 'Book'].map((t, i) => (
                  <button key={t} className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-bold transition-all ${i === 0 ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Paste URL</label>
                <div className="flex gap-2">
                  <input type="url" placeholder="https://..." className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 rounded-xl font-bold transition-all border border-slate-700 flex items-center gap-2">
                    <Bot size={16} className="text-cyan-400" /> Auto-Fetch
                  </button>
                </div>
              </div>

              <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                 <BrainCircuit size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-indigo-400 mb-1">AI Processing Enabled</h4>
                   <p className="text-xs text-indigo-200/60 leading-relaxed">When you save, our AI will automatically fetch the content, summarize it in 1-2 sentences, and tag it with your relevant skills.</p>
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Personal Note (Optional)</label>
                <textarea className="w-full h-24 bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl outline-none focus:border-cyan-500 transition-colors resize-none" placeholder="Why are you saving this?" />
              </div>

              <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceVault;
