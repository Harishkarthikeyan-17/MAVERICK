import React, { useState } from 'react';
import { AlertOctagon, X, CheckCircle2, Phone, ChevronRight, Shield } from 'lucide-react';

type EmergencyType = 'job-loss' | 'medical' | 'accident' | 'debt-crisis';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  monthlyExpense: number;
  emergencyFund?: number;
}

const EMERGENCY_TYPES: { id: EmergencyType; emoji: string; label: string; color: string }[] = [
  { id: 'job-loss',    emoji: '💼', label: 'Job Loss',          color: '#f59e0b' },
  { id: 'medical',     emoji: '🏥', label: 'Medical Emergency', color: '#ef4444' },
  { id: 'accident',   emoji: '🚑', label: 'Accident',          color: '#f97316' },
  { id: 'debt-crisis', emoji: '💳', label: 'Debt Crisis',       color: '#a855f7' },
];

const CHECKLISTS: Record<EmergencyType, string[]> = {
  'job-loss': [
    'File for unemployment benefits (if applicable)',
    'Pause all non-essential subscriptions immediately',
    'Contact lenders for EMI moratorium',
    'Review emergency fund — target 6 months of expenses',
    'Update resume and LinkedIn profile today',
    'Reduce variable expenses by 40%',
    'Reach out to professional network',
  ],
  'medical': [
    'Contact health insurance provider immediately',
    'File insurance claim within 24 hours of admission',
    'Check cashless hospital network for your insurer',
    'Pause non-essential SIPs temporarily',
    'Contact employer for medical leave',
    'Look into government health schemes (PMJAY)',
    'Set up a medical expense tracking document',
  ],
  'accident': [
    'File FIR if required (for third-party accidents)',
    'Contact vehicle insurance within 24 hours',
    'Seek medical attention — document all expenses',
    'Inform employer about situation',
    'Contact motor insurance surveyor',
    'Pause non-critical financial commitments',
    'Gather all evidence and documents',
  ],
  'debt-crisis': [
    'Stop using all credit cards immediately',
    'List all debts with interest rates and minimums',
    'Contact creditors to negotiate payment plans',
    'Explore debt consolidation options',
    'Consider credit counselling services',
    'Cut all non-essential expenses',
    'Explore part-time income sources',
  ],
};

const EMERGENCY_CONTACTS = [
  { name: 'National Emergency',    number: '112' },
  { name: 'Medical Ambulance',     number: '108' },
  { name: 'SEBI Investor Helpline',number: '1800-266-7575' },
  { name: 'Bank Customer Care',    number: '1800-XXXXXX' },
];

const EmergencyMode: React.FC<Props> = ({ isOpen, onClose, monthlyExpense, emergencyFund = 180000 }) => {
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('job-loss');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const survivalMonths = monthlyExpense > 0 ? (emergencyFund / monthlyExpense).toFixed(1) : 'N/A';
  const checklist = CHECKLISTS[emergencyType];
  const cfg = EMERGENCY_TYPES.find(e => e.id === emergencyType)!;

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-2xl md:max-h-[90vh] bg-slate-950 border border-red-900/50 rounded-t-3xl md:rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 bg-red-950/50 border-b border-red-900/30">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <AlertOctagon size={20} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-red-100">Financial Emergency Mode</h2>
            <p className="text-xs text-red-400/80">Focused, distraction-free crisis support</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-red-400/60 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
          {/* Survival Runway */}
          <div className="p-6 border-b border-red-900/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-xs text-red-300/70 mb-1">Emergency Fund</p>
                <p className="text-2xl font-bold text-red-200">₹{(emergencyFund / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs text-amber-300/70 mb-1">Survival Runway</p>
                <p className="text-2xl font-bold text-amber-200">{survivalMonths} mo</p>
              </div>
            </div>
            {Number(survivalMonths) < 3 && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-300">
                  ⚠️ Your runway is critically low. Focus on cutting expenses to extend it immediately.
                </p>
              </div>
            )}
          </div>

          {/* Emergency Type */}
          <div className="p-6 border-b border-red-900/20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">What's your emergency?</h3>
            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_TYPES.map(e => (
                <button
                  key={e.id}
                  onClick={() => { setEmergencyType(e.id); setCheckedItems(new Set()); }}
                  className="flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all"
                  style={{
                    borderColor: emergencyType === e.id ? e.color + '60' : '#1e293b',
                    backgroundColor: emergencyType === e.id ? e.color + '15' : '#0f172a',
                    color: emergencyType === e.id ? e.color : '#94a3b8',
                  }}
                >
                  <span className="text-lg">{e.emoji}</span>
                  <span className="font-medium">{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="p-6 border-b border-red-900/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {cfg.emoji} {cfg.label} Checklist
              </h3>
              <span className="text-xs text-slate-500">{checkedItems.size}/{checklist.length} done</span>
            </div>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    checkedItems.has(i)
                      ? 'bg-green-500/10 border-green-500/20 opacity-70'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <CheckCircle2
                    size={16}
                    className={`mt-0.5 shrink-0 ${checkedItems.has(i) ? 'text-green-400' : 'text-slate-600'}`}
                  />
                  <span className={`text-sm ${checkedItems.has(i) ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-red-900/20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Freeze Subscriptions', icon: '🔒' },
                { label: 'EMI Moratorium', icon: '⏸️' },
                { label: 'Cut Non-Essentials', icon: '✂️' },
                { label: 'Contact Bank', icon: '🏦' },
              ].map(a => (
                <button
                  key={a.label}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-red-500/30 text-sm text-slate-300 hover:text-red-200 transition-all"
                >
                  <span>{a.icon}</span>
                  <span className="font-medium">{a.label}</span>
                  <ChevronRight size={12} className="ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Emergency Contacts</h3>
            <div className="space-y-2">
              {EMERGENCY_CONTACTS.map(c => (
                <a
                  key={c.name}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400 group-hover:text-green-400 transition-colors" />
                    <span className="text-sm text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">{c.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-red-900/20 bg-red-950/20 flex items-center gap-3">
          <Shield size={14} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-400/70 flex-1">
            Emergency mode provides general guidance. Consult a certified financial advisor for personalised advice.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all"
          >
            Exit Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMode;
