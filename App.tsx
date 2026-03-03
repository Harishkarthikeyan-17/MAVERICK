import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from './types';
import Sidebar from './components/Sidebar';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Health from './views/Health';
import Finance from './views/Finance';
import Planner from './views/Planner';
import Food from './views/Food';
import Travel from './views/Travel';
import LearningTracker from './views/LearningTracker';
import Collaborative from './views/Collaborative';
import CollaborativeSpacePage from './views/CollaborativeSpacePage';
import { Menu, X, Bell, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SOLO);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="flex bg-[#020617] text-slate-200 min-h-screen selection:bg-cyan-500/30">
        <Sidebar
          role={userRole}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 lg:ml-64 relative">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-500 tracking-wider">SYSTEMS NOMINAL</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
              </button>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-200">User_01</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{userRole}</p>
                </div>
                <div className="w-9 h-9 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-cyan-400 overflow-hidden">
                  <img src="https://picsum.photos/seed/user/200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard role={userRole} />} />
              <Route path="/health" element={<Health />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/food" element={<Food />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/learning" element={<LearningTracker />} />
              <Route path="/collaborative" element={<Collaborative />} />
              <Route path="/collaborative-space" element={<CollaborativeSpacePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

const Shield = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Placeholder = ({ title }: { title: string }) => (
  <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-700">
    <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/5">
      <Shield size={40} />
    </div>
    <h2 className="text-3xl font-bold text-slate-200">{title}</h2>
    <p className="text-slate-500 max-w-md">This module is part of the MAVERIC unified platform and is currently being synchronized with your profile.</p>
    <button className="mt-4 px-6 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
      Go back to Dashboard
    </button>
  </div>
);

export default App;
