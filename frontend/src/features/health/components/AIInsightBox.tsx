
import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIInsightBoxProps {
  title: string;
  insight: string | null;
  loading: boolean;
  onRefresh?: () => void;
  hint?: string;
}

const AIInsightBox: React.FC<AIInsightBoxProps> = ({ title, insight, loading, onRefresh, hint }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={48} className="text-cyan-400" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-cyan-400" />
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      </div>

      <div className="min-h-[80px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <Loader2 className="animate-spin text-cyan-400" size={24} />
            <p className="text-xs text-slate-500">MAVERIC is thinking...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm">
            {insight ? (
              <p className="text-slate-300 leading-relaxed italic">
                "{insight}"
              </p>
            ) : (
              <p className="text-slate-500 text-sm italic">
                {hint || "Generate insights to see AI recommendations here."}
              </p>
            )}
          </div>
        )}
      </div>

      {onRefresh && (
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
        >
          {insight ? "Refresh Insights" : "Generate Analysis"}
        </button>
      )}
    </div>
  );
};

export default AIInsightBox;
