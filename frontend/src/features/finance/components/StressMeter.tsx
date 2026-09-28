import React, { useEffect, useRef } from 'react';

interface Props {
  score: number; // 0–100
}

const getZone = (score: number) => {
  if (score <= 30) return { label: 'Stable', color: '#22c55e', glow: 'rgba(34,197,94,0.4)' };
  if (score <= 55) return { label: 'Moderate', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' };
  if (score <= 75) return { label: 'High Stress', color: '#f97316', glow: 'rgba(249,115,22,0.4)' };
  return { label: 'Critical', color: '#ef4444', glow: 'rgba(239,68,68,0.4)' };
};

const StressMeter: React.FC<Props> = ({ score }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 180;
    canvas.width = size * dpr;
    canvas.height = (size * 0.65) * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size * 0.65}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size * 0.58;
    const radius = 72;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    const draw = (val: number) => {
      ctx.clearRect(0, 0, size, size);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#1e293b';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Zone arcs (colored background)
      const zones = [
        { from: 0, to: 0.30, color: '#22c55e40' },
        { from: 0.30, to: 0.55, color: '#f59e0b40' },
        { from: 0.55, to: 0.75, color: '#f9731640' },
        { from: 0.75, to: 1.00, color: '#ef444440' },
      ];
      zones.forEach(z => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle + z.from * Math.PI, startAngle + z.to * Math.PI);
        ctx.lineWidth = 14;
        ctx.strokeStyle = z.color;
        ctx.lineCap = 'butt';
        ctx.stroke();
      });

      // Active fill arc
      const zone = getZone(val);
      const fillAngle = startAngle + (val / 100) * Math.PI;
      const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      grad.addColorStop(0, '#22c55e');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#ef4444');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, fillAngle);
      ctx.lineWidth = 14;
      ctx.strokeStyle = grad;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glowing tip dot
      const tipX = cx + Math.cos(fillAngle) * radius;
      const tipY = cy + Math.sin(fillAngle) * radius;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = zone.color;
      ctx.shadowColor = zone.glow;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center text
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 26px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(val).toString(), cx, cy - 10);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText('/ 100', cx, cy + 8);
    };

    const target = score;
    const step = () => {
      const diff = target - currentRef.current;
      if (Math.abs(diff) < 0.5) {
        currentRef.current = target;
        draw(target);
        return;
      }
      currentRef.current += diff * 0.08;
      draw(currentRef.current);
      animRef.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const zone = getZone(score);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} />
      <span
        className="mt-1 text-xs font-bold px-3 py-1 rounded-full border"
        style={{
          color: zone.color,
          backgroundColor: zone.color + '20',
          borderColor: zone.color + '50',
        }}
      >
        {zone.label}
      </span>
    </div>
  );
};

export default StressMeter;
