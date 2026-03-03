import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { Activity, Target, Clock, ShieldCheck, AlertCircle, CheckCircle2, Globe, Users as UsersIcon } from 'lucide-react';
import { UserRole } from '../types';
import DailyPlanner from '../components/DailyPlanner';
import GoalWidget from '../components/GoalWidget';
import NotificationCenter from '../components/NotificationCenter';
// import HealthVitals from '../components/HealthVitals'; // Removed
import HydrationTracker from '../components/HydrationTracker';
import SleepTracker from '../components/SleepTracker';

const data = [
  { name: 'Mon', score: 65 },
  // ... existing data
];

interface DashboardProps {
  // ...
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [selectedWard, setSelectedWard] = useState<string>('Arjun');

  const wards = [
    { name: 'Arjun', status: 'online', focus: '3h 40m', tasks: '6/8', health: 'Good' },
    { name: 'Kiran', status: 'offline', focus: '2h 15m', tasks: '4/8', health: 'Moderate' },
    { name: 'Meena', status: 'online', focus: '5h 10m', tasks: '7/8', health: 'Good' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... header ... */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Welcome back, User</h2>
          <p className="text-slate-400 mt-1">Your {role} dashboard overview for today.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <ShieldCheck className="text-cyan-400" size={20} />
          <span className="text-sm font-medium text-slate-300 uppercase tracking-widest">{role} MODE</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: '78%', icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'Tasks Completed', value: '12/15', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Avg Focus Time', value: '4h 12m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Health Score', value: 'Good', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={22} />
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Health Vitals Strip - Removed */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100">Performance Trend</h3>
              <select className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 6, fill: '#0ea5e9' }}
                    isAnimationActive={true}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalWidget />
            <SleepTracker />
          </div>

          {/* Daily Planner */}
          <DailyPlanner />
        </div>

        {/* Sidebar/Widgets Column */}
        <div className="space-y-6">
          {/* Context Card - Moved to top of sidebar */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            {role === UserRole.GUARDIAN ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-100">Managed Wards</h3>
                <div className="space-y-4">
                  {wards.map((ward) => (
                    <button
                      key={ward.name}
                      onClick={() => setSelectedWard(ward.name)}
                      className={`
                        w-full flex items-center justify-between p-4 rounded-xl transition-all border
                        ${selectedWard === ward.name
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-slate-800/50 border-transparent hover:border-slate-700'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${ward.status === 'online' ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                        <span className="font-medium text-slate-200">{ward.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{ward.tasks} Completed</span>
                    </button>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-red-400 mb-4">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Alerts</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                    <p className="text-xs text-red-300">Arjun exceeded screen time limit by 15 mins.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-100">Priority Tasks</h3>
                <div className="space-y-4">
                  {[
                    { task: 'Finish Assignment', prio: 'High', color: 'bg-red-500' },
                    { task: 'Workout', prio: 'Medium', color: 'bg-amber-500' },
                    { task: 'Read for 30m', prio: 'Low', color: 'bg-green-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                      <span className="text-sm text-slate-200">{item.task}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.color} text-white font-bold uppercase tracking-tighter`}>{item.prio}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
                  <p className="text-xs text-cyan-200 leading-relaxed font-medium">
                    💡 Tip: You're most productive between 10 AM and 1 PM. Plan deep work sessions then!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notification Center */}
          <NotificationCenter />

          {/* Hydration Tracker */}
          <HydrationTracker />




        </div>
      </div>
    </div>
  );
};

export default Dashboard;
