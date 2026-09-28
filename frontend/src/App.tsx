import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from './core/types';
import { getToken, setToken, clearToken } from './services/authService';
import Sidebar from './shared/components/Sidebar';
import Auth from './features/auth/AuthPage';
import ForgotPassword from './features/auth/ForgotPasswordPage';
import Dashboard from './features/dashboard/DashboardPage';
import Health from './features/health/HealthPage';
import Finance from './features/finance/FinancePage';
import Planner from './features/planner/PlannerPage';
import Food from './features/food/FoodPage';
import Travel from './features/travel/TravelPage';
import LearningModule from './features/learning/LearningModule';
import Collaborative from './features/collaborative/CollaborativePage';
import CollaborativeSpacePage from './features/collaborative/CollaborativeSpacePage';
import LandingPage from './features/landing/LandingPage';
import { Menu, Bell } from 'lucide-react';
import ResetPasswordPage from './features/auth/ResetPasswordPage.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()));
  const [userRole, setUserRole] = useState<UserRole>(UserRole.SOLO);
  const [userName, setUserName] = useState('User');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (role: UserRole, receivedToken: string, name?: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setToken(receivedToken);
    if (name) setUserName(name);

    if (role === UserRole.SOLO) navigate('/dashboard');
    else if (role === UserRole.WARD) navigate('/dashboard');
    else if (role === UserRole.GUARDIAN) navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(UserRole.SOLO);
    setUserName('User');
    clearToken();
    navigate('/');
  };

  const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

    return (
      <div className="flex bg-[#020617] text-slate-200 min-h-screen selection:bg-cyan-500/30">
        <Sidebar
          role={userRole}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 lg:ml-64 relative">
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
              <div className="relative">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="relative p-2 transition-all rounded-full text-slate-400 hover:text-cyan-400"
                  title="View Notifications in Dashboard"
                >
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
                </button>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-200">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{userRole}</p>
                </div>
                <div className="w-9 h-9 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-cyan-400 overflow-hidden">
                  <img src="https://picsum.photos/seed/user/200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <div className="page-surface p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Auth onLogin={handleLogin} onForgotPassword={() => navigate('/forgot-password')} />
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword onBackToLogin={() => navigate('/login')} />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard role={userRole} /></AuthenticatedLayout>} />
      <Route path="/health" element={<AuthenticatedLayout><Health /></AuthenticatedLayout>} />
      <Route path="/finance" element={<AuthenticatedLayout><Finance /></AuthenticatedLayout>} />
      <Route path="/planner" element={<AuthenticatedLayout><Planner /></AuthenticatedLayout>} />
      <Route path="/food" element={<AuthenticatedLayout><Food /></AuthenticatedLayout>} />
      <Route path="/travel" element={<AuthenticatedLayout><Travel /></AuthenticatedLayout>} />
      <Route path="/learning/*" element={<AuthenticatedLayout><LearningModule /></AuthenticatedLayout>} />
      <Route path="/collaborative" element={<AuthenticatedLayout><Collaborative /></AuthenticatedLayout>} />
      <Route path="/collaborative-space" element={<AuthenticatedLayout><CollaborativeSpacePage /></AuthenticatedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;