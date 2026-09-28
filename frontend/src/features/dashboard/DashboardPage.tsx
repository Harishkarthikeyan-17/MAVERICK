import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { Activity, Target, Clock, ShieldCheck, AlertCircle, CheckCircle2, Globe, Users as UsersIcon, Wallet, BrainCircuit, Utensils, Calendar } from 'lucide-react';
import { UserRole } from '../../core/types';
import DailyPlanner from '../../shared/components/DailyPlanner';
import NotificationCenter from '../../shared/components/NotificationCenter';

// Data will be fetched from backend

interface DashboardProps {
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [selectedWard, setSelectedWard] = useState<string>('Arjun');
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [perf, fin] = await Promise.all([
          apiClient<any[]>('/dashboard/performance'),
          apiClient<any[]>('/dashboard/finance-summary')
        ]);
        setPerformanceData(perf);
        setFinanceData(fin);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchDashboardStats();
  }, []);

  const wards = [
    { name: 'Arjun', status: 'online', focus: '3h 40m', tasks: '6/8', health: 'Good' },
    { name: 'Kiran', status: 'offline', focus: '2h 15m', tasks: '4/8', health: 'Moderate' },
    { name: 'Meena', status: 'online', focus: '5h 10m', tasks: '7/8', health: 'Good' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - 2 columns wide */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Area Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-100">Performance Trend</h3>
                <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">Weekly</span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Finance Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-100">Financial Overview</h3>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Monthly</span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} cursor={{fill: '#1e293b'}} />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Module Summaries Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Food Summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg"><Utensils size={18}/></div>
                <h4 className="font-bold text-slate-200">Nutrition</h4>
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">1,850 <span className="text-sm font-normal text-slate-500">kcal</span></p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-right">75% of daily goal</p>
            </div>
            
            {/* Learning Summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><BrainCircuit size={18}/></div>
                <h4 className="font-bold text-slate-200">Learning</h4>
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">5 Day <span className="text-sm font-normal text-slate-500">streak</span></p>
              <p className="text-xs text-slate-400 mt-2">Active: System Design</p>
            </div>
            
            {/* Travel Summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg"><Globe size={18}/></div>
                <h4 className="font-bold text-slate-200">Next Trip</h4>
              </div>
              <p className="text-2xl font-bold text-slate-100 mb-1">Tokyo</p>
              <p className="text-xs text-slate-400 mt-2">Departs in 14 days</p>
            </div>
          </div>

          {/* Daily Planner */}
          <DailyPlanner />
        </div>

        {/* Sidebar/Widgets Column - 1 column wide */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* Prominent Notification Center */}
          <div className="flex-1 min-h-[400px]">
            <NotificationCenter />
          </div>

          {/* Context Card */}
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
                <h3 className="text-lg font-bold text-slate-100">Today's Focus</h3>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
