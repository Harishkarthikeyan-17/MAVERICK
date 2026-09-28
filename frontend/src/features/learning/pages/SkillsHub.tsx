import React, { useState } from 'react';
import { 
  Target, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Network, 
  Grid3X3, 
  Plus, 
  X,
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const SKELETON_SECTORS = [
  { id: '1', name: 'Technical', icon: '💻', count: 12, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  { id: '2', name: 'Non-Technical', icon: '🧠', count: 4, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { id: '3', name: 'Academic', icon: '📚', count: 6, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { id: '4', name: 'Career', icon: '🚀', count: 3, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' }
];

const MOCK_SKILLS = [
  {
    id: 's1', name: 'React Native', sectorId: '1', mastery: 3, confidence: 7.5, hoursLogged: 145, velocity: 12, velocityDir: 'up',
    lastPracticed: 2, weakAreas: ['Reanimated', 'Navigation State'], nextTopics: ['Deep Linking', 'Fastlane'], resources: 18
  },
  {
    id: 's2', name: 'System Design', sectorId: '1', mastery: 2, confidence: 5.0, hoursLogged: 45, velocity: -5, velocityDir: 'down',
    lastPracticed: 18, weakAreas: ['Load Balancers', 'CAP Theorem'], nextTopics: ['Database Sharding', 'Message Queues'], resources: 12
  },
  {
    id: 's3', name: 'Public Speaking', sectorId: '2', mastery: 4, confidence: 8.5, hoursLogged: 210, velocity: 2, velocityDir: 'up',
    lastPracticed: 5, weakAreas: ['Pacing', 'Hand Gestures'], nextTopics: ['Storytelling Frameworks', 'Impromptu Speaking'], resources: 4
  }
];

const RadarMockData = [
  { subject: 'Frontend', A: 120, fullMark: 150 },
  { subject: 'Backend', A: 98, fullMark: 150 },
  { subject: 'DevOps', A: 86, fullMark: 150 },
  { subject: 'System Design', A: 99, fullMark: 150 },
  { subject: 'Cloud', A: 85, fullMark: 150 },
  { subject: 'Mobile', A: 65, fullMark: 150 },
];

const SkillsHub: React.FC = () => {
  const [activeSector, setActiveSector] = useState<string>('1');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [showRadar, setShowRadar] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const filteredSkills = MOCK_SKILLS.filter(s => s.sectorId === activeSector);
  const currentSectorObj = SKELETON_SECTORS.find(s => s.id === activeSector);

  const getMasteryLabel = (level: number) => {
    switch(level) {
      case 1: return 'Novice';
      case 2: return 'Beginner';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* SECTOR SIDEBAR */}
      <div className="w-full lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 lg:p-6 bg-slate-950/50 flex flex-col">
        <h2 className="text-xl font-black text-slate-100 tracking-tight mb-6">Sectors</h2>
        <div className="flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-hide">
          {SKELETON_SECTORS.map(sector => (
            <button 
              key={sector.id}
              onClick={() => setActiveSector(sector.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeSector === sector.id ? `${sector.bg} ${sector.border} border shadow-lg` : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400'}`}
            >
              <div className="flex items-center gap-3">
                <span>{sector.icon}</span>
                <span className={`font-bold text-sm ${activeSector === sector.id ? sector.color : 'text-slate-300'}`}>{sector.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeSector === sector.id ? sector.color : 'bg-slate-800 text-slate-500'}`}>{sector.count}</span>
            </button>
          ))}
        </div>
        <button className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-bold text-sm">
          <Plus size={16} /> Add Sector
        </button>
      </div>

      {/* SKILL GRID PANEL */}
      <div className="flex-1 p-4 lg:p-8 flex flex-col overflow-y-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{currentSectorObj?.icon}</span>
              <h1 className="text-3xl font-black text-slate-100">{currentSectorObj?.name} Skills</h1>
            </div>
            <p className="text-slate-500 font-medium">Manage and track your proficiencies</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowRadar(!showRadar)}
              className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-purple-400 rounded-xl transition-all shadow-lg"
              title="Sector Radar Chart"
            >
              <PieChart size={18} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search skills..." 
                className="bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none w-48 lg:w-64 transition-all"
              />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button 
                onClick={() => setViewMode('tree')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'tree' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Network size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Radar Chart Panel */}
        {showRadar && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 animate-in slide-in-from-top-4 duration-300 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RadarMockData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-black text-slate-100 mb-2">Sector Balance</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Your <span className="text-cyan-400 font-bold">Frontend</span> and <span className="text-cyan-400 font-bold">System Design</span> skills are highly developed in this sector. However, <span className="text-orange-400 font-bold">Mobile</span> shows a significant gap.
              </p>
              <button className="text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-lg">Generate Study Plan for Mobile</button>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSkills.map(skill => (
              <div key={skill.id} onClick={() => setSelectedSkill(skill)} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-400 transition-colors">{skill.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentSectorObj?.bg} ${currentSectorObj?.color}`}>
                      {currentSectorObj?.name}
                    </span>
                  </div>
                  <button className="text-slate-500 hover:text-slate-300 p-1" onClick={(e) => { e.stopPropagation(); }}>
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Mastery Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-widest">Mastery</span>
                    <span className="text-cyan-400">{getMasteryLabel(skill.mastery)}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className={`flex-1 rounded-full ${level <= skill.mastery ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Confidence</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-white">{skill.confidence}</span>
                      <span className="text-xs text-slate-600 mb-0.5">/ 10</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hours</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-black text-white">{skill.hoursLogged}</span>
                      <span className="text-xs text-slate-600 mb-0.5">hrs</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Learning Velocity</span>
                    <span className={`font-bold flex items-center gap-1 ${skill.velocityDir === 'up' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {skill.velocityDir === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(skill.velocity)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Practiced</span>
                    <span className={`font-bold flex items-center gap-1 ${skill.lastPracticed > 14 ? 'text-orange-400' : 'text-slate-200'}`}>
                      {skill.lastPracticed > 14 && <AlertCircle size={14} />}
                      {skill.lastPracticed} days ago
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">AI Identified Weaknesses</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.weakAreas.map((area, i) => (
                      <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-[10px] font-bold">{area}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Next Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.nextTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-[10px] font-bold">{topic}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-slate-900 border border-slate-800 border-dashed rounded-3xl">
            <div className="text-center">
              <Network size={48} className="text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400 mb-1">Tree View Coming Soon</h3>
              <p className="text-sm text-slate-500">The hierarchical graph visualization requires canvas support.</p>
            </div>
          </div>
        )}
      </div>

      {/* SKILL DETAIL MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedSkill(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedSkill(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentSectorObj?.bg} ${currentSectorObj?.color}`}>
                  {currentSectorObj?.name}
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-1"><Target size={14}/> {selectedSkill.resources} Resources Attached</span>
              </div>
              <h2 className="text-4xl font-black text-slate-100 mb-8">{selectedSkill.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Mastery Benchmark</h3>
                     <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-3xl font-black text-cyan-400">{selectedSkill.hoursLogged}h</span>
                       <span className="text-sm text-slate-500 font-medium">logged</span>
                     </div>
                     <p className="text-xs text-slate-400">Platform average to reach {getMasteryLabel(selectedSkill.mastery)}: <strong className="text-slate-200">120h</strong></p>
                     <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden flex">
                        <div className="h-full bg-cyan-500" style={{ width: '60%' }} />
                        <div className="h-full bg-slate-700 relative"><div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white z-10"/></div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Staleness Decay</h3>
                     {/* Simplified visual representation of a decay curve */}
                     <div className="h-24 w-full flex items-end gap-1 relative">
                        <div className="absolute top-0 left-0 text-[10px] text-slate-600 font-mono">Confidence Drop</div>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-orange-500/20 to-orange-500/0 rounded-t-sm" style={{ height: `${100 - (i*8)}%` }} />
                        ))}
                     </div>
                     <p className="text-xs text-slate-400 mt-3 text-center">Projected confidence drop if unpracticed for 30 days.</p>
                   </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">Log Practice Hours</button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all border border-slate-700">Open Doubt Solver</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsHub;
