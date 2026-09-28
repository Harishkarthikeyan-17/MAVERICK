import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface Props {
  score?: number; // 300–900
}

const FACTORS = [
  { label: 'Payment History',    score: 92, weight: 35, trend: 'up',    tip: 'All payments on time. Excellent!' },
  { label: 'Credit Utilisation', score: 68, weight: 30, trend: 'down',  tip: 'At 32% utilisation — aim below 30%.' },
  { label: 'Credit Age',         score: 75, weight: 15, trend: 'stable',tip: 'Average account age: 4.2 years' },
  { label: 'Credit Mix',         score: 60, weight: 10, trend: 'stable',tip: 'Add a credit card to improve mix.' },
  { label: 'New Inquiries',      score: 85, weight: 10, trend: 'up',    tip: 'Only 1 hard inquiry in last 6mo.' },
];

const IMPROVEMENTS = [
  'Pay your credit card bill before the due date every month',
  'Keep credit utilisation below 30% of your total limit',
  'Avoid applying for multiple loans within 6 months',
  'Maintain older accounts — credit age boosts your score',
];

const CreditScore: React.FC<Props> = ({ score = 742 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const currentRef = useRef(300);

  const min = 300, max = 900;
  const normalized = (score - min) / (max - min);
  const scoreColor = score >= 750 ? '#22c55e' : score >= 650 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 750 ? 'Excellent' : score >= 700 ? 'Good' : score >= 650 ? 'Fair' : 'Poor';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = (size * 0.65) * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size * 0.65}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size * 0.58;
    const radius = 80;
    const startAngle = Math.PI;
    const fullAngle = Math.PI;

    const draw = (val: number) => {
      ctx.clearRect(0, 0, size, size);
      const norm = (val - min) / (max - min);

      // BG arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + fullAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#1e293b';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Gradient arc zones
      const zones = [
        { from: 0, to: 0.33, color: '#ef444440' },
        { from: 0.33, to: 0.66, color: '#f59e0b40' },
        { from: 0.66, to: 1.00, color: '#22c55e40' },
      ];
      zones.forEach(z => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle + z.from * fullAngle, startAngle + z.to * fullAngle);
        ctx.lineWidth = 16;
        ctx.strokeStyle = z.color;
        ctx.lineCap = 'butt';
        ctx.stroke();
      });

      // Value arc
      const vColor = val >= 750 ? '#22c55e' : val >= 650 ? '#f59e0b' : '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + norm * fullAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = vColor;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Tip dot
      const tipAngle = startAngle + norm * fullAngle;
      const tipX = cx + Math.cos(tipAngle) * radius;
      const tipY = cy + Math.sin(tipAngle) * radius;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 9, 0, 2 * Math.PI);
      ctx.fillStyle = vColor;
      ctx.shadowColor = vColor + '80';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center value
      ctx.fillStyle = vColor;
      ctx.font = `bold 32px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(val).toString(), cx, cy - 8);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText('/ 900', cx, cy + 10);
    };

    const step = () => {
      const diff = score - currentRef.current;
      if (Math.abs(diff) < 0.5) { currentRef.current = score; draw(score); return; }
      currentRef.current += diff * 0.08;
      draw(currentRef.current);
      animRef.current = requestAnimationFrame(step);
    };
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} className="text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-100">Credit Score Insights</h3>
      </div>

      {/* Main gauge + label */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} />
          <span
            className="mt-2 text-sm font-bold px-4 py-1 rounded-full border"
            style={{ color: scoreColor, backgroundColor: scoreColor + '20', borderColor: scoreColor + '50' }}
          >
            {scoreLabel}
          </span>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-slate-300">
            Your CIBIL score of <strong style={{ color: scoreColor }}>{score}</strong> puts you in the{' '}
            <strong style={{ color: scoreColor }}>{scoreLabel}</strong> range.{' '}
            {score >= 750 ? 'You qualify for the best interest rates!' : 'Improving your score by 50 points can save you ₹50,000+ on loans.'}
          </p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-red-500/20 text-red-300">300 Poor</span>
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300">650 Fair</span>
            <span className="px-2 py-1 rounded bg-green-500/20 text-green-300">750 Good</span>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">800+ Excellent</span>
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div>
        <h4 className="text-sm font-bold text-slate-300 mb-3">Score Factors</h4>
        <div className="space-y-3">
          {FACTORS.map(f => (
            <div key={f.label} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {f.trend === 'up'   && <TrendingUp size={13} className="text-green-400" />}
                  {f.trend === 'down' && <TrendingDown size={13} className="text-red-400" />}
                  {f.trend === 'stable' && <Minus size={13} className="text-slate-400" />}
                  <span className="text-sm font-medium text-slate-200">{f.label}</span>
                  <span className="text-xs text-slate-500">({f.weight}% weight)</span>
                </div>
                <span className={`text-sm font-bold ${f.score >= 80 ? 'text-green-400' : f.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {f.score}/100
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${f.score}%`,
                    backgroundColor: f.score >= 80 ? '#22c55e' : f.score >= 60 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <p className="text-xs text-slate-500">{f.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI improvement suggestions */}
      <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
        <h4 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
          <Sparkles size={14} /> AI Improvement Tips
        </h4>
        <ul className="space-y-2">
          {IMPROVEMENTS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreditScore;
