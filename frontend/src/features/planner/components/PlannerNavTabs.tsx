import React from 'react';
import { LayoutDashboard, Clock, CheckSquare, Target, BarChart2 } from 'lucide-react';

export type PlannerTab = 'overview' | 'timeline' | 'tasks' | 'focus' | 'analytics';

interface Tab {
    id: PlannerTab;
    label: string;
    icon: React.ElementType;
    color: string;
}

const TABS: Tab[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-400' },
    { id: 'timeline', label: 'Today Timeline', icon: Clock, color: 'text-emerald-400' },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, color: 'text-purple-400' },
    { id: 'focus', label: 'Focus & Distractions', icon: Target, color: 'text-rose-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, color: 'text-amber-400' },
];

interface PlannerNavTabsProps {
    activeTab: PlannerTab;
    onChange: (tab: PlannerTab) => void;
}

const PlannerNavTabs: React.FC<PlannerNavTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div className="flex gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto scrollbar-hide sticky top-4 z-40">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
                            flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300
                            ${isActive
                                ? `bg-slate-800 border border-slate-700 ${tab.color} shadow-xl scale-105`
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border border-transparent'}
                        `}
                    >
                        <Icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default PlannerNavTabs;
