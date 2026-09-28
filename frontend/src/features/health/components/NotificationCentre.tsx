/**
 * components/NotificationCentre.tsx
 * Section: Notifications Centre
 * GET /api/notifications — card-based alerts
 * Types: GOAL / STRESS / MEDICATION / ENERGY
 */

import React, { useState, useEffect } from 'react';
import {
  Bell, Target, Brain, Pill, Zap, Loader2, RefreshCw, AlertTriangle, CheckCircle2, X,
} from 'lucide-react';
import { getNotifications, type Notification } from '../services/healthApi';

const TYPE_CONFIG = {
  GOAL:       { icon: Target, color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    label: 'Goal Alert'   },
  STRESS:     { icon: Brain,  color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  label: 'Stress'       },
  MEDICATION: { icon: Pill,   color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   label: 'Medication'   },
  ENERGY:     { icon: Zap,    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Energy'       },
};

const SEVERITY_CONFIG = {
  high:   { badge: 'bg-red-500/20 text-red-300 border-red-500/30',     dot: 'bg-red-500',     label: 'Urgent' },
  medium: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400',  label: 'Important' },
  low:    { badge: 'bg-slate-700 text-slate-400 border-slate-600',       dot: 'bg-slate-500',  label: 'Info' },
};

const NotificationCentre: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | Notification['type']>('ALL');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setLastRefresh(new Date());
    } catch {
      setError('Cannot reach Health API on port 5000. Start the backend-health server to see dynamic alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = (id: string) =>
    setDismissed((prev) => new Set([...prev, id]));

  const visible = notifications
    .filter((n) => !dismissed.has(n.id))
    .filter((n) => filter === 'ALL' || n.type === filter);

  const urgentCount = notifications.filter((n) => n.severity === 'high' && !dismissed.has(n.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="text-cyan-400" size={22} />
            {urgentCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {urgentCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Notifications Centre</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {visible.length} alert{visible.length !== 1 ? 's' : ''} · refreshed {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={fetchNotifications}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',    count: notifications.length,                         color: 'text-slate-300' },
          { label: 'Urgent',   count: notifications.filter((n) => n.severity === 'high').length,   color: 'text-red-400' },
          { label: 'Goals',    count: notifications.filter((n) => n.type === 'GOAL').length,       color: 'text-cyan-400' },
          { label: 'Meds',     count: notifications.filter((n) => n.type === 'MEDICATION').length, color: 'text-amber-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'GOAL', 'STRESS', 'MEDICATION', 'ENERGY'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f === 'ALL' ? '🔔 All' : f === 'GOAL' ? '🎯 Goals' : f === 'STRESS' ? '🧠 Stress' : f === 'MEDICATION' ? '💊 Meds' : '⚡ Energy'}
          </button>
        ))}
        {dismissed.size > 0 && (
          <button
            onClick={() => setDismissed(new Set())}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 hover:text-slate-300 transition-all"
          >
            ↩ Restore {dismissed.size}
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-amber-300 font-medium">Health API Offline</p>
            <p className="text-xs text-amber-300/70 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
          <Loader2 size={22} className="animate-spin" /> Fetching notifications…
        </div>
      )}

      {/* Notification Cards */}
      {!loading && (
        <div className="space-y-3">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-300 font-semibold">All clear!</p>
                <p className="text-slate-500 text-sm mt-1">No pending notifications right now.</p>
              </div>
            </div>
          ) : (
            visible.map((n) => {
              const typeCfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.ENERGY;
              const sevCfg  = SEVERITY_CONFIG[n.severity];
              const Icon    = typeCfg.icon;

              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 bg-slate-900 border rounded-2xl transition-all ${typeCfg.border} hover:brightness-110`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 ${typeCfg.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={typeCfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-bold text-slate-200 truncate">{n.title}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${sevCfg.badge}`}>
                        {sevCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${sevCfg.dot}`} />
                      <span className="text-[10px] text-slate-600">{typeCfg.label}</span>
                      <span className="text-[10px] text-slate-700">·</span>
                      <span className="text-[10px] text-slate-600">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => handleDismiss(n.id)}
                    className="shrink-0 p-1.5 text-slate-600 hover:text-slate-400 hover:bg-slate-800 rounded-lg transition-all"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCentre;
