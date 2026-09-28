import React, { useRef, useEffect } from 'react';
import {
  LayoutDashboard, Receipt, TrendingUp, Target, CreditCard,
  FileText, Landmark, Users, Building2
} from 'lucide-react';

export type FinanceTab =
  | 'overview' | 'expenses' | 'investments'
  | 'goals' | 'emi-loans' | 'tax-planner'
  | 'retirement' | 'family-mode' | 'real-estate';

interface Tab {
  id: FinanceTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  danger?: boolean;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'emi-loans', label: 'EMI & Loans', icon: CreditCard },
  { id: 'tax-planner', label: 'Tax Planner', icon: FileText },
  { id: 'retirement', label: 'Retirement', icon: Landmark },
  { id: 'family-mode', label: 'Family Mode', icon: Users },
  { id: 'real-estate', label: 'Real Estate', icon: Building2 },
];

interface Props {
  activeTab: FinanceTab;
  onChange: (tab: FinanceTab) => void;
}

const FinanceNavTabs: React.FC<Props> = ({ activeTab, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = TABS[(idx + 1) % TABS.length];
      onChange(next.id);
    } else if (e.key === 'ArrowLeft') {
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length];
      onChange(prev.id);
    }
  };

  return (
    <div className="sticky top-[65px] z-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 -mx-6 md:-mx-8 px-2 shadow-lg shadow-slate-950/50">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-none gap-0 relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="tablist"
        aria-label="Finance sections"
      >
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeRef : undefined}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                transition-all duration-200 select-none shrink-0 group outline-none
                ${tab.danger
                  ? isActive
                    ? 'text-red-400'
                    : 'text-slate-500 hover:text-red-400'
                  : isActive
                    ? 'text-cyan-400'
                    : 'text-slate-500 hover:text-slate-200'
                }
              `}
            >
              <Icon size={15} className="shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-cyan-500/20 text-cyan-300 leading-none">
                  {tab.badge}
                </span>
              )}
              {/* Active indicator */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? tab.danger ? 'bg-red-400 opacity-100' : 'bg-cyan-400 opacity-100'
                    : 'opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FinanceNavTabs;
