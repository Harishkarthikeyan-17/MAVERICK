import React, { useState } from 'react';
import {
    Plus,
    Filter,
    Download,
    FileDown,
    Search,
    BookOpen,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import SkillTree from '../components/learning/SkillTree';
import LearningAnalytics from '../components/learning/LearningAnalytics';
import ConceptDetailPanel from '../components/learning/ConceptDetailPanel';
import AIAssistantPanel from '../components/learning/AIAssistantPanel';
import {
    LearningSkill,
    LearningCategory,
    LearningSubtopic,
    LearningTask,
    LearningAnalytics as AnalyticsType
} from '../types';

const LearningTracker: React.FC = () => {
    // Mock Data
    const [skills, setSkills] = useState<LearningSkill[]>([
        { id: '1', name: 'AI & Machine Learning', category: 'Technology', priority: 'High', dailyTime: 120, weeklyGoal: 10, monthlyGoal: 40, createdAt: new Date().toISOString() },
        { id: '2', name: 'Advanced Mathematics', category: 'Academic', priority: 'Medium', dailyTime: 60, weeklyGoal: 5, monthlyGoal: 20, createdAt: new Date().toISOString() },
    ]);

    const [categories, setCategories] = useState<LearningCategory[]>([
        { id: 'c1', skillId: '1', name: 'Upskill' },
        { id: 'c2', skillId: '2', name: 'Academic' },
    ]);

    const [subtopics, setSubtopics] = useState<LearningSubtopic[]>([
        { id: 's1', skillId: '1', categoryId: 'c1', title: 'Deep Learning', difficulty: 'Expert', status: 'In Progress', estimatedTime: 1200, actualTime: 850 },
        { id: 's2', skillId: '1', categoryId: 'c1', title: 'Natural Language Processing', difficulty: 'Intermediate', status: 'Not Started', estimatedTime: 800, actualTime: 0 },
        { id: 's3', skillId: '2', categoryId: 'c2', title: 'Calculus III', difficulty: 'Expert', status: 'Completed', estimatedTime: 1500, actualTime: 1650 },
    ]);

    const [tasks, setTasks] = useState<LearningTask[]>([
        { id: 't1', subtopicId: 's1', title: 'Neural Networks Basics', completed: true },
        { id: 't2', subtopicId: 's1', title: 'Backpropagation Algorithm', completed: false },
        { id: 't3', subtopicId: 's1', title: 'Optimization Techniques', completed: false },
    ]);

    const [analytics, setAnalytics] = useState<AnalyticsType>({
        completionTrend: [
            { date: 'Mon', percentage: 65 },
            { date: 'Tue', percentage: 68 },
            { date: 'Wed', percentage: 72 },
            { date: 'Thu', percentage: 70 },
            { date: 'Fri', percentage: 75 },
            { date: 'Sat', percentage: 80 },
            { date: 'Sun', percentage: 78 },
        ],
        efficiency: { score: 82, level: 'High' },
        skillDistribution: [
            { name: 'AI & ML', value: 24 },
            { name: 'Mathematics', value: 12 },
            { name: 'Design', value: 8 },
            { name: 'Soft Skills', value: 4 },
        ],
        consistency: [], // Handled by mock in component
        streak: 12
    });

    const [selectedSubtopic, setSelectedSubtopic] = useState<LearningSubtopic | null>(null);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

    // Handlers
    const handleAddSkill = () => {
        const newSkill: LearningSkill = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Skill',
            category: 'General',
            priority: 'Medium',
            dailyTime: 60,
            weeklyGoal: 5,
            monthlyGoal: 20,
            createdAt: new Date().toISOString()
        };
        setSkills([...skills, newSkill]);
    };

    const handleDeleteSkill = (id: string) => {
        setSkills(skills.filter(s => s.id !== id));
    };

    const handleToggleTask = (taskId: string) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };

    const handleSelectSubtopic = (subtopic: LearningSubtopic) => {
        setSelectedSubtopic(subtopic);
        setIsDetailPanelOpen(true);
    };

    const handleAddTask = (subtopicId: string, title?: string) => {
        const newTask: LearningTask = {
            id: Math.random().toString(36).substr(2, 9),
            subtopicId,
            title: title || 'New Task',
            completed: false
        };
        setTasks([...tasks, newTask]);
    };

    const handleAddCategory = (skillId: string) => {
        const newCat: LearningCategory = {
            id: Math.random().toString(36).substr(2, 9),
            skillId,
            name: 'New Category'
        };
        setCategories([...categories, newCat]);
    };

    const handleAddSubtopic = (categoryId: string) => {
        const skillId = categories.find(c => c.id === categoryId)?.skillId || '';
        const newSub: LearningSubtopic = {
            id: Math.random().toString(36).substr(2, 9),
            skillId,
            categoryId,
            title: 'New Subtopic',
            difficulty: 'Beginner',
            status: 'Not Started',
            estimatedTime: 60,
            actualTime: 0
        };
        setSubtopics([...subtopics, newSub]);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                            <BookOpen size={18} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-100 tracking-tight">Learning <span className="text-cyan-400">Tracker</span></h2>
                    </div>
                    <p className="text-slate-500 font-medium">Track, Analyse & Optimize Your Learning Journey</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search skills..."
                            className="bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none w-48 md:w-64 transition-all"
                        />
                    </div>

                    <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block" />

                    <button className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 rounded-xl transition-all shadow-lg shadow-black/20">
                        <Filter size={18} />
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 rounded-xl transition-all shadow-lg shadow-black/20 font-bold text-sm">
                        <Download size={18} className="text-slate-500" />
                        <span>Export</span>
                    </button>

                    <button
                        onClick={handleAddSkill}
                        className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-lg shadow-cyan-500/20 font-bold text-sm"
                    >
                        <Plus size={18} />
                        <span>Add Skill</span>
                    </button>
                </div>
            </header>

            {/* Analytics Section */}
            <section className="animate-in fade-in zoom-in-95 duration-700 delay-100">
                <LearningAnalytics analytics={analytics} />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Skill Hierarchy Tree */}
                <div className="lg:col-span-2 space-y-6">
                    <SkillTree
                        skills={skills}
                        categories={categories}
                        subtopics={subtopics}
                        tasks={tasks}
                        onAddSkill={handleAddSkill}
                        onEditSkill={() => { }}
                        onDeleteSkill={handleDeleteSkill}
                        onAddCategory={handleAddCategory}
                        onAddSubtopic={handleAddSubtopic}
                        onAddTask={handleAddTask}
                        onToggleTask={handleToggleTask}
                        onSelectSubtopic={handleSelectSubtopic}
                    />
                </div>

                {/* Right: Quick Insights & Tips */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Sparkles size={120} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 italic">Pro Insights</h3>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">
                            You've completed 4 hours of Deep Learning this week. You're 15% ahead of your schedule!
                        </p>
                        <button className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group/btn">
                            <span>View Full Report</span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            Revision schedule
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Calculus III: Integration', date: 'Tomorrow', status: 'Upcoming' },
                                { title: 'Neural Networks', date: '2 days left', status: 'Scheduled' },
                                { title: 'Probability Basics', date: 'In 4 days', status: 'Queued' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-xs font-bold text-slate-200">{item.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Data */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6">Performance Highlights</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Most Productive Day', value: 'Wednesday', sub: 'Peak focus: 10AM - 1PM', color: 'text-green-400' },
                                { label: 'Skill Health Score', value: '88/100', sub: 'Mastery Level: Improving', color: 'text-cyan-400' },
                                { label: 'Revision Accuracy', value: '94%', sub: 'Last session: Excellent', color: 'text-purple-400' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{item.label}</span>
                                    <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                                    <span className="text-[10px] text-slate-600 font-medium">{item.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Panels & Modals */}
            {isDetailPanelOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
                        onClick={() => setIsDetailPanelOpen(false)}
                    />
                    <ConceptDetailPanel
                        subtopic={selectedSubtopic}
                        tasks={tasks}
                        onClose={() => setIsDetailPanelOpen(false)}
                        onUpdateSubtopic={(updated) => {
                            setSubtopics(subtopics.map(s => s.id === updated.id ? updated : s));
                        }}
                        onToggleTask={handleToggleTask}
                        onAddTask={handleAddTask}
                    />
                </>
            )}

            {/* AI Assistant */}
            <AIAssistantPanel />
        </div>
    );
};

export default LearningTracker;
