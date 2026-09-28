import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Zap, 
  Library, 
  LineChart, 
  BrainCircuit, 
  HelpCircle, 
  BookOpen, 
  Map,
  Play,
  Pause,
  Square,
  Bell,
  AlertTriangle,
  X
} from 'lucide-react';
import LearningDashboard from './pages/LearningDashboard';
import SkillsHub from './pages/SkillsHub';
import GoalsPage from './pages/GoalsPage';
import FocusCenter from './pages/FocusCenter';
import ResourceVault from './pages/ResourceVault';
import LearningAnalyticsPage from './pages/LearningAnalyticsPage';
import AICoachPage from './pages/AICoachPage';
import DoubtSolverPage from './pages/DoubtSolverPage';
import JournalPage from './pages/JournalPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';

// Simple Persistent Focus Timer Widget
const FocusTimerWidget: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock Notifications
  const MOCK_NOTIFS = [
    { id: 1, type: 'alert', title: 'Focus Debt Alert', msg: 'You are 3 hours behind your weekly focus target.', time: '2h ago' },
    { id: 2, type: 'success', title: 'Streak Milestone', msg: 'You hit a 5-day learning streak!', time: '5h ago' },
    { id: 3, type: 'info', title: 'AI Recommendation', msg: 'New resource suggested for System Design.', time: '1d ago' },
  ];
  
  // Basic display formatting
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isActive) {
    return (
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-slate-900 border-t border-slate-800 p-3 flex justify-center z-40 transition-all shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <button 
           onClick={() => setIsActive(true)}
           className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
         >
           <Play size={16} /> Start Focus Session
         </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-slate-950 border-t border-cyan-500/30 p-3 px-6 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,255,255,0.05)]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <Zap size={18} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100">Deep Work: React Native</p>
          <p className="text-xs text-cyan-400 font-medium">Flow State</p>
        </div>
      </div>
      
      <div className="text-2xl font-black text-white font-mono tracking-widest">
        {formatTime(timeElapsed)}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <button 
          onClick={() => { setIsActive(false); setTimeElapsed(0); }}
          className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
        >
          <Square size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

const LearningModule: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/learning', icon: LayoutDashboard },
    { label: 'Skills Hub', path: '/learning/skills', icon: Target },
    { label: 'Goals', path: '/learning/goals', icon: Target },
    { label: 'Focus Center', path: '/learning/focus', icon: Zap },
    { label: 'Resources', path: '/learning/resources', icon: Library },
    { label: 'Analytics', path: '/learning/analytics', icon: LineChart },
    { label: 'AI Coach', path: '/learning/coach', icon: BrainCircuit },
    { label: 'Doubt Solver', path: '/learning/doubt', icon: HelpCircle },
    { label: 'Journal', path: '/learning/journal', icon: BookOpen },
    { label: 'Career', path: '/learning/career', icon: Map },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] pb-20">
      {/* Module Navigation */}
      <nav className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Match exact for dashboard, startsWith for others to handle sub-routes if any
            const isActive = item.path === '/learning' 
              ? location.pathname === '/learning' 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'}
                `}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 animate-in fade-in duration-500">
        <Routes>
          <Route path="/" element={<LearningDashboard />} />
          <Route path="skills" element={<SkillsHub />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="focus" element={<FocusCenter />} />
          <Route path="resources" element={<ResourceVault />} />
          <Route path="analytics" element={<LearningAnalyticsPage />} />
          <Route path="coach" element={<AICoachPage />} />
          <Route path="doubt" element={<DoubtSolverPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="career" element={<CareerRoadmapPage />} />
          <Route path="*" element={<Navigate to="/learning" replace />} />
        </Routes>
      </div>

      {/* Persistent Timer Widget */}
      <FocusTimerWidget />
    </div>
  );
};

export default LearningModule;
