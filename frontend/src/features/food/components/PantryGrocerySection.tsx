import React, { useState, useMemo } from 'react';
import {
  PackageOpen, ShoppingCart, Plus, X, Search, AlertTriangle,
  CheckSquare, Square, RefreshCw, ChefHat, Leaf, Beef, Milk,
  Wheat, Container, MoreHorizontal, Filter, Sparkles,
  CheckCircle2, Clock, Tag, DollarSign, ArrowRight
} from 'lucide-react';
import type { useFoodPlanner, PantryItem, GroceryItem } from '../hooks/useFoodPlanner';

type FoodPlannerStore = ReturnType<typeof useFoodPlanner>;

interface PantryGrocerySectionProps {
  store: FoodPlannerStore;
  initialTab?: 'pantry' | 'groceries';
  onNavigate: (section: string, subTab?: string) => void;
}

// ─── Category Icon Map ─────────────────────────────────────────
const categoryIcon = (cat: string) => {
  const map: Record<string, React.ReactNode> = {
    Vegetables: <Leaf size={14} className="text-emerald-400" />,
    Proteins: <Beef size={14} className="text-red-400" />,
    Dairy: <Milk size={14} className="text-blue-400" />,
    Grains: <Wheat size={14} className="text-amber-400" />,
    Condiments: <Container size={14} className="text-purple-400" />,
    Snacks: <Tag size={14} className="text-pink-400" />,
    Other: <MoreHorizontal size={14} className="text-slate-500" />,
  };
  return map[cat] || map.Other;
};

const statusBadge = (status: PantryItem['status']) => {
  const map = {
    'Stocked': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Low Stock': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Expiring Soon': 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return map[status];
};

// ─── Add Item Form ─────────────────────────────────────────────
const AddItemForm: React.FC<{
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({
    name: '', qty: '', category: 'Other' as PantryItem['category'],
    expiryDays: 7, status: 'Stocked' as PantryItem['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.qty.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
        <Plus size={14} className="text-emerald-400" /> Add Pantry Item
      </h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text" placeholder="Item name *" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
        />
        <input
          type="text" placeholder="Quantity (e.g. 500g, 2 cans)" value={form.qty}
          onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
          required
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
        />
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value as PantryItem['category'] }))}
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
        >
          {(['Vegetables', 'Proteins', 'Dairy', 'Grains', 'Condiments', 'Snacks', 'Other'] as const).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-500 flex-shrink-0">Expires in</label>
          <input
            type="number" min="1" max="730" value={form.expiryDays}
            onChange={e => setForm(f => ({ ...f, expiryDays: Number(e.target.value) }))}
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
          />
          <span className="text-xs text-slate-500 flex-shrink-0">days</span>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors">
          Add Item
        </button>
      </div>
    </form>
  );
};

// ─── Add Grocery Form ──────────────────────────────────────────
const AddGroceryForm: React.FC<{
  onAdd: (item: Omit<GroceryItem, 'id' | 'addedAt' | 'checked'>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({ name: '', qty: '', category: 'Other', reason: 'Manual' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
        <Plus size={14} className="text-cyan-400" /> Add Grocery Item
      </h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text" placeholder="Item name *" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none"
        />
        <input
          type="text" placeholder="Quantity (e.g. 1kg, 2 boxes)" value={form.qty}
          onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200">Cancel</button>
        <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors">Add</button>
      </div>
    </form>
  );
};

// ─── Main Component ───────────────────────────────────────────
const PantryGrocerySection: React.FC<PantryGrocerySectionProps> = ({
  store, initialTab = 'pantry', onNavigate
}) => {
  const {
    pantryItems, addPantryItem, removePantryItem,
    groceryList, addToGrocery, toggleGroceryItem, removeGroceryItem, purchaseCheckedItems,
    pantryAlerts,
  } = store;

  const [activeTab, setActiveTab] = useState<'pantry' | 'groceries'>(initialTab);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPantry, setShowAddPantry] = useState(false);
  const [showAddGrocery, setShowAddGrocery] = useState(false);

  // Sync initial tab
  React.useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  // Filtered pantry
  const filteredPantry = useMemo(() => {
    return pantryItems.filter(item => {
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [pantryItems, categoryFilter, searchTerm]);

  // Grouped grocery
  const groupedGrocery = useMemo((): Record<string, GroceryItem[]> => {
    const groups: Record<string, GroceryItem[]> = {};
    groceryList.forEach((item: GroceryItem) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [groceryList]);

  const checkedCount = groceryList.filter(i => i.checked).length;
  const totalCount = groceryList.length;
  const expiringCount = pantryAlerts.expiring.length + pantryAlerts.lowStock.length;

  const categories = ['All', 'Vegetables', 'Proteins', 'Dairy', 'Grains', 'Condiments', 'Snacks', 'Other'];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Sub-Tab Navigator */}
      <div className="flex gap-2">
        {[
          {
            id: 'pantry' as const,
            label: 'Pantry',
            icon: <PackageOpen size={16} />,
            badge: expiringCount > 0 ? expiringCount : null,
          },
          {
            id: 'groceries' as const,
            label: 'Grocery List',
            icon: <ShoppingCart size={16} />,
            badge: totalCount > 0 ? `${checkedCount}/${totalCount}` : null,
          },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              activeTab === tab.id
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== null && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── PANTRY TAB ──────────────────────────────────────────── */}
      {activeTab === 'pantry' && (
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search pantry items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddPantry(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {/* Add Item Form */}
          {showAddPantry && (
            <AddItemForm
              onAdd={item => { addPantryItem(item); setShowAddPantry(false); }}
              onClose={() => setShowAddPantry(false)}
            />
          )}

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Filter size={14} className="text-slate-500 self-center" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  categoryFilter === cat
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Alerts Banner */}
          {expiringCount > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex flex-wrap items-center gap-3">
              <AlertTriangle size={16} className="text-amber-400" />
              <p className="text-sm text-amber-300 flex-1">
                <strong>{pantryAlerts.expiring.length}</strong> items expiring soon,&nbsp;
                <strong>{pantryAlerts.lowStock.length}</strong> items low on stock
              </p>
              <button
                onClick={() => onNavigate('cook', 'ingredients')}
                className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:text-emerald-300"
              >
                Generate recipes using expiring items <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Pantry Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-950 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Expiry</div>
              <div className="col-span-2">Status</div>
            </div>

            <div className="divide-y divide-slate-800/50">
              {filteredPantry.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <PackageOpen size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No items found. Add items to your pantry.</p>
                </div>
              ) : filteredPantry.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors group items-center"
                >
                  {/* Name */}
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      item.status === 'Expiring Soon' ? 'bg-red-500 animate-pulse' :
                      item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <p className="text-slate-200 font-semibold text-sm">{item.name}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden md:flex col-span-2 items-center gap-1.5 text-xs text-slate-400">
                    {categoryIcon(item.category)}
                    {item.category}
                  </div>

                  {/* Qty */}
                  <div className="hidden md:block col-span-2 text-sm text-slate-400">{item.qty}</div>

                  {/* Expiry */}
                  <div className="hidden md:flex col-span-2 items-center gap-1.5 text-xs">
                    <Clock size={12} className="text-slate-600" />
                    <span className={item.expiryDays <= 2 ? 'text-red-400' : item.expiryDays <= 5 ? 'text-amber-400' : 'text-slate-400'}>
                      {item.expiryDays === 1 ? 'Tomorrow' : item.expiryDays <= 7 ? `${item.expiryDays}d` : item.expiryDays > 90 ? `${Math.floor(item.expiryDays / 30)}mo` : `${item.expiryDays}d`}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border hidden md:inline-block ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => removePantryItem(item.id)}
                      className="ml-auto text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      title="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Can-Cook Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-emerald-400" />
              Cook Right Now
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Chicken Rice Bowl', match: '100%', note: 'All ingredients available' },
                { name: 'Spinach Omelette', match: '100%', note: 'Uses expiring spinach & eggs' },
                { name: 'Chickpea Skillet', match: '87%', note: '1 ingredient needed' },
                { name: 'Salmon with Rice', match: '100%', note: 'Uses expiring salmon' },
              ].map((r, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate('cook', 'dish')}
                  className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-300 group-hover:text-emerald-400 transition-colors">{r.name}</p>
                    <span className={`text-[10px] font-bold ${r.match === '100%' ? 'text-emerald-400' : 'text-amber-400'}`}>{r.match}</span>
                  </div>
                  <p className="text-xs text-slate-500">{r.note}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GROCERY TAB ─────────────────────────────────────────── */}
      {activeTab === 'groceries' && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <ShoppingCart size={18} className="text-cyan-400" />
                Smart Grocery List
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {totalCount} items · {checkedCount} checked · auto-generated from meal plans & low stock
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Cost</p>
                <p className="text-lg font-black text-emerald-400 flex items-center">
                  <DollarSign size={16} />
                  {(groceryList.filter(i => !i.checked).length * 4.5).toFixed(0)}
                </p>
              </div>
              <button
                onClick={() => setShowAddGrocery(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>

          {/* Add Grocery Form */}
          {showAddGrocery && (
            <AddGroceryForm
              onAdd={item => { addToGrocery([item]); setShowAddGrocery(false); }}
              onClose={() => setShowAddGrocery(false)}
            />
          )}

          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{checkedCount} of {totalCount} items collected</span>
                <span>{Math.round((checkedCount / totalCount) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Purchase All Button */}
          {checkedCount > 0 && (
            <button
              onClick={purchaseCheckedItems}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle2 size={18} />
              Mark {checkedCount} Item{checkedCount > 1 ? 's' : ''} as Purchased → Add to Pantry
            </button>
          )}

          {/* Group Lists */}
          <div className="space-y-4">
            {Object.keys(groupedGrocery).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <ShoppingCart size={40} className="mx-auto mb-4 text-slate-700" />
                <h3 className="font-bold text-slate-400 mb-2">Your grocery list is empty</h3>
                <p className="text-sm text-slate-600 mb-4">Generate a recipe in Cook section to auto-populate missing items.</p>
                <button
                  onClick={() => onNavigate('cook')}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Go to Cook →
                </button>
              </div>
            ) : (Object.entries(groupedGrocery) as [string, GroceryItem[]][]).map(([category, items]) => (
              <div key={category} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
                    {categoryIcon(category)}
                    {category}
                  </h4>
                  <span className="text-xs text-slate-500">{items.filter(i => !i.checked).length} remaining</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                      onClick={() => toggleGroceryItem(item.id)}
                    >
                      <div className="text-slate-400">
                        {item.checked
                          ? <CheckSquare size={18} className="text-emerald-500" />
                          : <Square size={18} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${item.checked ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-600">{item.reason}</p>
                      </div>
                      <span className="text-sm text-slate-400 flex-shrink-0">{item.qty}</span>
                      <button
                        onClick={e => { e.stopPropagation(); removeGroceryItem(item.id); }}
                        className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Smart Savings */}
          <div className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-emerald-400 mb-4">Smart Savings</h3>
            <div className="space-y-3">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <p className="text-sm text-slate-200 mb-1">
                  Swap <strong className="text-red-400">Fresh Berries</strong> for <strong className="text-emerald-400">Frozen Berries</strong>
                </p>
                <p className="text-xs text-slate-500 mb-3">Same nutrition, lasts 6× longer, saves ~$4.00</p>
                <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Apply Swap →</button>
              </div>
              <div className="flex justify-between text-sm text-slate-400 py-2 border-t border-slate-800">
                <span>Items already in pantry (auto-removed)</span>
                <span className="text-emerald-400 font-bold">Saved $12</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryGrocerySection;
