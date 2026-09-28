import React, { useState, useCallback } from 'react';
import { Home, ChefHat, ShoppingCart, BarChart3 } from 'lucide-react';

import { useFoodPlanner } from './hooks/useFoodPlanner';
import KitchenSection from './components/KitchenSection';
import CookSection from './components/CookSection';
import PantryGrocerySection from './components/PantryGrocerySection';
import InsightsSection from './components/InsightsSection';

// ─── Section Configuration ─────────────────────────────────────
type SectionId = 'kitchen' | 'cook' | 'pantry' | 'insights';
type SubTab = string | undefined;

interface NavState {
  section: SectionId;
  subTab?: SubTab;
  cookMode?: 'dish' | 'ingredients';
}

const sections = [
  {
    id: 'kitchen' as const,
    label: 'Kitchen',
    icon: Home,
    description: 'Daily command center',
  },
  {
    id: 'cook' as const,
    label: 'Cook',
    icon: ChefHat,
    description: 'AI Recipe Engine',
    badge: 'AI',
  },
  {
    id: 'pantry' as const,
    label: 'Pantry & Groceries',
    icon: ShoppingCart,
    description: 'Inventory & shopping',
  },
  {
    id: 'insights' as const,
    label: 'Insights',
    icon: BarChart3,
    description: 'Analytics & planning',
  },
];

// ─── Main FoodPage ─────────────────────────────────────────────
const FoodPage: React.FC = () => {
  const store = useFoodPlanner();

  const [navState, setNavState] = useState<NavState>({
    section: 'kitchen',
    subTab: undefined,
    cookMode: undefined,
  });

  // Navigation function passed to all sections — any section can jump anywhere
  const handleNavigate = useCallback((section: string, subTab?: string) => {
    setNavState({
      section: section as SectionId,
      subTab,
      cookMode: subTab === 'ingredients' ? 'ingredients' : subTab === 'dish' ? 'dish' : undefined,
    });
  }, []);

  const activeSection = navState.section;

  return (
    <div className="space-y-0 max-w-7xl mx-auto pb-16">

      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            Food Planner
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Intelligent nutrition, recipes, pantry management, and health analytics — all in one place.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Claude-ready AI layer active
        </div>
      </header>

      {/* Primary Navigation — 4 Sections */}
      <nav className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 -mx-6 md:-mx-8 px-6 md:px-8 mb-8 pb-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                id={`food-nav-${section.id}`}
                onClick={() => handleNavigate(section.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2
                  ${isActive
                    ? 'text-emerald-400 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-slate-700'
                  }
                `}
              >
                <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-slate-600'} />
                {section.label}
                {section.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {section.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Section Content */}
      <main>
        {activeSection === 'kitchen' && (
          <KitchenSection
            store={store}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === 'cook' && (
          <CookSection
            store={store}
            initialMode={navState.cookMode}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === 'pantry' && (
          <PantryGrocerySection
            store={store}
            initialTab={navState.subTab === 'groceries' ? 'groceries' : 'pantry'}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === 'insights' && (
          <InsightsSection
            store={store}
            initialTab={
              navState.subTab === 'nutrition' ? 'nutrition' :
              navState.subTab === 'planning' ? 'planning' :
              navState.subTab === 'health' ? 'health' :
              'nutrition'
            }
          />
        )}
      </main>
    </div>
  );
};

export default FoodPage;
