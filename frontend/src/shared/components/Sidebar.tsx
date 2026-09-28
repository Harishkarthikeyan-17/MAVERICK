
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartPulse,
  Wallet,
  CalendarCheck,
  Utensils,
  BookOpen,
  Users,
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react';
import { UserRole } from '../../core/types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Health', path: '/health', icon: HeartPulse },
    { label: 'Finance', path: '/finance', icon: Wallet },
    { label: 'Planner', path: '/planner', icon: CalendarCheck },
    { label: 'Food Planning', path: '/food', icon: Utensils },
    { label: 'Learning', path: '/learning', icon: BookOpen },
    { label: 'Collaborative Space', path: '/collaborative-space', icon: Users },
    { label: 'Travel', path: '/travel', icon: Globe },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-widest">
            MAVERIC
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1">{role} Panel</p>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/learning'
              ? location.pathname.startsWith('/learning')
              : location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between p-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
