import React, { useState } from 'react';
import {
  LayoutDashboard, Heart, Activity, Pill, Dumbbell, Bell, Bot, Footprints, Flame, Zap, Target
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import HealthTab          from './components/HealthTab';
import FitnessTab         from './components/FitnessTab';
import VitaminsMeds       from './components/VitaminsMeds';
import WorkoutPlanner     from './components/WorkoutPlanner';
import BMICalculator      from './components/BMICalculator';
import NotificationCentre from './components/NotificationCentre';
import HealthBot          from './components/HealthBot';
import SummaryCard        from './components/SummaryCard';

type TabId = 'overview' | 'health' | 'fitness' | 'vitamins' | 'workout' | 'notifications';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  color: string;
}

const TABS: Tab[] = [
  { id: 'overview',       label: 'Overview',        icon: LayoutDashboard, color: 'text-cyan-400'    },
  { id: 'health',         label: 'Health',          icon: Heart,           color: 'text-rose-400'    },
  { id: 'fitness',        label: 'Fitness',         icon: Activity,        color: 'text-emerald-400' },
  { id: 'vitamins',       label: 'Vitamins & Meds', icon: Pill,            color: 'text-sky-400'     },
  { id: 'workout',        label: 'Workout & BMI',   icon: Dumbbell,        color: 'text-orange-400'  },
  { id: 'notifications',  label: 'Notifications',   icon: Bell,            color: 'text-pink-400'    },
];

const DEFAULT_HEALTH_DATA = {
  heartRate: 72,
  bloodPressure: 120,
  hrv: 65,
  steps: 8432,
  sleep: 7.2,
  calories: 1850,
  stressScore: 35,
  stressLevel: 'LOW',
  energyScore: 72,
  energyLevel: 'MODERATE',
};

const HealthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [botOpen, setBotOpen] = useState(false);
  const [healthData, setHealthData] = useState(DEFAULT_HEALTH_DATA);
  const [syncing, setSyncing] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Health Dashboard</h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time vitals, activity tracking, and wellness insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
            {syncing ? (
              <>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                <span className="text-xs text-emerald-400 font-black uppercase tracking-widest">Syncing...</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 bg-slate-500 rounded-full" />
                <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Connected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative sticky top-4 z-40">
        <div className="flex gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-x-auto snap-x sm:snap-none pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300 snap-start
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
        {/* Scroll affordance for mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none rounded-r-2xl sm:hidden" />
      </div>

      {/* Content */}
      <div className="min-h-[600px] animate-in fade-in duration-700">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <SectionHeader title="Overview" subtitle="At a glance summary of your health & fitness" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <SummaryCard 
                  label="Heart Rate" 
                  value={healthData.heartRate} 
                  unit="bpm" 
                  icon={Heart} 
                  color="text-rose-400" 
                  bg="bg-rose-500/10" 
                />
                <SummaryCard 
                  label="Stress Score" 
                  value={healthData.stressScore} 
                  unit="/100" 
                  icon={Activity} 
                  color="text-purple-400" 
                  bg="bg-purple-500/10" 
                  subValue={healthData.stressLevel}
                />
                <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Energy Pulse</p>
                      <h3 className="text-2xl font-black text-white">{healthData.energyScore} <span className="text-sm font-medium text-slate-500">/100</span></h3>
                      <p className="text-xs text-slate-400 mt-1">{healthData.energyLevel} level today</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                      <Zap size={24} />
                    </div>
                  </div>
                  <div className="h-24 -mx-6 -mb-6 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{v:40},{v:50},{v:45},{v:60},{v:75},{v:65},{v:healthData.energyScore}]}>
                        <defs>
                          <linearGradient id="colorEnergySpark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergySpark)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 w-full flex items-center gap-2">
                  <Target size={16} /> Daily Activity
                </p>
                
                {/* Step Ring visual */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    {/* Progress circle */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min((healthData.steps / 10000), 1))}`}
                      className="text-emerald-500 transition-all duration-1000 ease-out" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Footprints size={24} className="text-emerald-400 mb-1 opacity-80" />
                    <span className="text-2xl font-black text-white">{healthData.steps}</span>
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Goal</span>
                    <span className="text-white font-bold">10,000 <span className="text-slate-500 font-normal">steps</span></span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((healthData.steps / 10000) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'health' && (
          <div className="space-y-8">
            <SectionHeader title="Vitals & Energy" subtitle="Detailed breakdown of your physiological markers" />
            <HealthTab healthData={healthData} setHealthData={setHealthData} syncing={syncing} setSyncing={setSyncing} />
          </div>
        )}
        {activeTab === 'fitness' && (
          <div className="space-y-8">
            <SectionHeader title="Fitness Tracking" subtitle="Log your activities and monitor trends" />
            <FitnessTab healthData={healthData} setHealthData={setHealthData} />
          </div>
        )}
        {activeTab === 'vitamins' && (
          <div className="space-y-8">
            <SectionHeader title="Vitamins & Medications" subtitle="Daily schedule and compliance tracking" />
            <VitaminsMeds />
          </div>
        )}
        {activeTab === 'workout' && (
          <div className="space-y-12">
            <div className="space-y-6">
              <SectionHeader title="Workout Planning" subtitle="Schedule your weekly training sessions" />
              <WorkoutPlanner />
            </div>
            <div className="pt-8 border-t border-slate-800/50">
              <SectionHeader title="Body Composition" subtitle="Calculate and track your BMI status" />
              <BMICalculator />
            </div>
          </div>
        )}
        {activeTab === 'notifications' && <NotificationCentre />}
      </div>

      {/* Floating Health AI button (bottom right) */}
      {!botOpen && (
        <button
          onClick={() => setBotOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-2xl shadow-2xl shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Bot size={20} />
          Ask Health AI
        </button>
      )}

      {/* Health Bot */}
      <HealthBot
        healthData={healthData}
        isOpen={botOpen}
        onClose={() => setBotOpen(false)}
      />
    </div>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="space-y-1">
    <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
  </div>
);

export default HealthPage;
