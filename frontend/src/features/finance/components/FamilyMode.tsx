import React, { useState } from 'react';
import { Users, Plus, Trash2, Heart, Target } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contribution: number;
  color: string;
}

interface SharedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  paidBy: string;
}

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'You',   avatar: '👨', role: 'Primary', contribution: 45000, color: '#0ea5e9' },
  { id: '2', name: 'Priya', avatar: '👩', role: 'Partner',  contribution: 35000, color: '#ec4899' },
  { id: '3', name: 'Amma',  avatar: '👵', role: 'Parent',   contribution: 10000, color: '#f59e0b' },
];

const DEFAULT_EXPENSES: SharedExpense[] = [
  { id: '1', name: 'Grocery',   amount: 12000, category: '🛒 Food',         paidBy: 'Priya' },
  { id: '2', name: 'Electricity',amount: 2500,  category: '⚡ Utilities',    paidBy: 'You'   },
  { id: '3', name: 'Broadband', amount: 999,   category: '📶 Subscriptions', paidBy: 'You'   },
  { id: '4', name: 'Medicine',  amount: 1500,  category: '💊 Health',        paidBy: 'Amma'  },
  { id: '5', name: 'Rent',      amount: 18000, category: '🏠 Housing',       paidBy: 'You'   },
];

const FamilyMode: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [expenses] = useState<SharedExpense[]>(DEFAULT_EXPENSES);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', avatar: '👤', role: 'Member', contribution: '' });

  const totalIncome = members.reduce((s, m) => s + m.contribution, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const familySavings = totalIncome - totalExpenses;
  const healthScore = Math.round((familySavings / Math.max(1, totalIncome)) * 100 * 2);

  const addMember = () => {
    if (!newMember.name) return;
    setMembers(prev => [...prev, {
      id: Date.now().toString(),
      name: newMember.name,
      avatar: newMember.avatar,
      role: newMember.role,
      contribution: Number(newMember.contribution) || 0,
      color: ['#22c55e','#a855f7','#f97316','#06b6d4'][members.length % 4],
    }]);
    setShowAddMember(false);
    setNewMember({ name: '', avatar: '👤', role: 'Member', contribution: '' });
  };

  const removeMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100">Family Budget Mode</h3>
        </div>
        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={14} /> Add Member
        </button>
      </div>

      {/* Family Health Score */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Heart size={18} className="text-pink-400" />
          <h4 className="text-sm font-bold text-slate-300">Family Financial Health Score</h4>
          <span className={`ml-auto text-2xl font-bold ${healthScore >= 70 ? 'text-green-400' : healthScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
            {Math.max(0, Math.min(100, healthScore))}%
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyan-500 to-green-500"
            style={{ width: `${Math.max(0, Math.min(100, healthScore))}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">Total Income</p>
            <p className="text-lg font-bold text-green-400">₹{(totalIncome / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Expenses</p>
            <p className="text-lg font-bold text-red-400">₹{(totalExpenses / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Savings</p>
            <p className={`text-lg font-bold ${familySavings >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              ₹{(familySavings / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Add Family Member</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Name</label>
              <input
                value={newMember.name}
                onChange={e => setNewMember(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Appa"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Avatar Emoji</label>
              <input
                value={newMember.avatar}
                onChange={e => setNewMember(f => ({ ...f, avatar: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Role</label>
              <select
                value={newMember.role}
                onChange={e => setNewMember(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none"
              >
                {['Partner','Parent','Child','Sibling','Member'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Monthly Contribution (₹)</label>
              <input
                type="number"
                value={newMember.contribution}
                onChange={e => setNewMember(f => ({ ...f, contribution: e.target.value }))}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addMember} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl py-2.5 text-sm font-medium transition-all">
              Add
            </button>
            <button onClick={() => setShowAddMember(false)} className="px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl py-2.5 text-sm transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">Family Members</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {members.map(m => {
            const sharePercent = totalIncome > 0 ? Math.round((m.contribution / totalIncome) * 100) : 0;
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl border group relative"
                style={{ borderColor: m.color + '40', backgroundColor: m.color + '08' }}
              >
                <button
                  onClick={() => removeMember(m.id)}
                  className="absolute top-3 right-3 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={13} />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{m.avatar}</span>
                  <div>
                    <p className="font-bold text-slate-100">{m.name}</p>
                    <p className="text-xs" style={{ color: m.color }}>{m.role}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Contribution</span>
                    <span style={{ color: m.color }}>{sharePercent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sharePercent}%`, backgroundColor: m.color }}
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-200 mt-1.5">₹{m.contribution.toLocaleString('en-IN')}/mo</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Expenses */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">Shared Expenses</h4>
        <div className="space-y-2">
          {expenses.map(e => {
            const payer = members.find(m => m.name === e.paidBy);
            return (
              <div key={e.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{e.category.split(' ')[0]}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{e.name}</p>
                    <p className="text-xs text-slate-500">{e.category.split(' ').slice(1).join(' ')} · Paid by {e.paidBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {payer && (
                    <span
                      className="text-sm px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ color: payer.color, backgroundColor: payer.color + '20', border: `1px solid ${payer.color}40` }}
                    >
                      {payer.avatar}
                    </span>
                  )}
                  <span className="text-sm font-bold text-slate-200">₹{e.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Target size={15} className="text-cyan-400" /> Total Shared Expenses
          </span>
          <span className="text-xl font-bold text-slate-100">₹{totalExpenses.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default FamilyMode;
