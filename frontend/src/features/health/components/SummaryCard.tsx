import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  progress?: number; // 0 to 100
  onClick?: () => void;
  subValue?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  color,
  bg,
  trend,
  progress,
  onClick,
  subValue,
}) => {
  const isClickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
        isClickable ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900/80' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
          <Icon size={20} />
        </div>
        <div className="flex flex-col items-end gap-1">
          {isClickable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 size={14} className="text-slate-500" />
            </div>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}%
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-1">
          <p className={`text-2xl font-black ${color}`}>{value}</p>
          {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
        </div>
        {subValue && <p className="text-[10px] text-slate-500">{subValue}</p>}
      </div>

      {progress !== undefined && (
        <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Subtle hover glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${bg} blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
    </button>
  );
};

export default SummaryCard;
