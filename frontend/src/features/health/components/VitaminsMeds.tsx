import React, { useState } from 'react';
import { Pill, CheckCircle2, Circle, RotateCcw, Loader2, CheckCheck, Clock, Sun, Sunrise, Sunset } from 'lucide-react';
import { logActivity } from '../services/healthApi';

interface Item {
  id: string;
  name: string;
  dose: string;
  time: 'Morning' | 'Afternoon' | 'Night' | 'With meal';
  checked: boolean;
  type: 'vitamin' | 'medicine';
}

const DEFAULT_ITEMS: Item[] = [
  { id: 'v1', name: 'Vitamin D3', dose: '1000 IU', time: 'Morning', checked: false, type: 'vitamin' },
  { id: 'v2', name: 'Vitamin C', dose: '500 mg', time: 'Morning', checked: false, type: 'vitamin' },
  { id: 'v3', name: 'Omega-3', dose: '1000 mg', time: 'With meal', checked: false, type: 'vitamin' },
  { id: 'v4', name: 'Magnesium', dose: '400 mg', time: 'Night', checked: false, type: 'vitamin' },
  { id: 'm1', name: 'Metformin', dose: '500 mg', time: 'Morning', checked: false, type: 'medicine' },
  { id: 'm2', name: 'Lisinopril', dose: '10 mg', time: 'Morning', checked: false, type: 'medicine' },
  { id: 'm3', name: 'Aspirin', dose: '81 mg', time: 'With meal', checked: false, type: 'medicine' },
  { id: 'm4', name: 'Atorvastatin', dose: '20 mg', time: 'Night', checked: false, type: 'medicine' },
];

const VitaminsMeds: React.FC = () => {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [syncing, setSyncing] = useState(false);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    ));
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const checkedVitamins = items.filter((i) => i.type === 'vitamin' && i.checked).map((i) => i.name);
      const checkedMeds = items.filter((i) => i.type === 'medicine' && i.checked).map((i) => i.name);
      await logActivity({ vitamins: checkedVitamins, medications: checkedMeds });
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  const timeGroups = {
    Morning: items.filter(i => i.time === 'Morning' || i.time === 'With meal'),
    Afternoon: items.filter(i => i.time === 'Afternoon'),
    Night: items.filter(i => i.time === 'Night'),
  };

  const GroupHeader = ({ title, icon: Icon, color }: { title: string, icon: any, color: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className={`w-8 h-8 rounded-lg ${color.replace('text-', 'bg-')}/10 flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
      <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">{title}</h4>
      <div className="h-px flex-1 bg-slate-800/50 ml-2" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Morning Section */}
      <div className="space-y-3">
        <GroupHeader title="Morning" icon={Sunrise} color="text-amber-400" />
        <div className="space-y-2">
          {timeGroups.Morning.map(item => (
            <MedicationRow key={item.id} item={item} onToggle={() => toggle(item.id)} />
          ))}
        </div>
      </div>

      {/* Afternoon Section */}
      <div className="space-y-3">
        <GroupHeader title="Afternoon" icon={Sun} color="text-cyan-400" />
        <div className="space-y-2">
          {timeGroups.Afternoon.length > 0 ? timeGroups.Afternoon.map(item => (
            <MedicationRow key={item.id} item={item} onToggle={() => toggle(item.id)} />
          )) : <p className="text-[10px] text-slate-600 italic px-4 py-3 border border-dashed border-slate-800 rounded-2xl">No medications scheduled</p>}
        </div>
      </div>

      {/* Night Section */}
      <div className="space-y-3">
        <GroupHeader title="Night" icon={Sunset} color="text-indigo-400" />
        <div className="space-y-2">
          {timeGroups.Night.map(item => (
            <MedicationRow key={item.id} item={item} onToggle={() => toggle(item.id)} />
          ))}
          
          <div className="pt-6">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all group"
            >
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />}
              {syncing ? 'Syncing...' : 'Sync Progress'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedicationRow: React.FC<{ item: Item, onToggle: () => void }> = ({ item, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 group ${
      item.checked 
        ? 'bg-emerald-500/5 border-emerald-500/20' 
        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
    }`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
      item.checked ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'
    }`}>
      {item.checked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
    </div>
    <div className="flex-1 text-left">
      <p className={`text-sm font-bold transition-all ${
        item.checked ? 'text-slate-500 line-through' : 'text-slate-200'
      }`}>
        {item.name}
      </p>
      <p className="text-[10px] text-slate-500 font-medium">{item.dose} {item.time !== 'With meal' ? '' : '· With meal'}</p>
    </div>
    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
      item.type === 'vitamin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
    }`}>
      {item.type}
    </div>
  </button>
);

export default VitaminsMeds;
