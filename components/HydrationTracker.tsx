import React, { useState } from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

const HydrationTracker: React.FC = () => {
    const [intake, setIntake] = useState(1250);
    const goal = 2500;
    const glassSize = 250;
    const progress = Math.min((intake / goal) * 100, 100);

    const addWater = () => setIntake(prev => prev + glassSize);
    const removeWater = () => setIntake(prev => Math.max(0, prev - glassSize));

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            {/* Background Animation Effect */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Droplet className="text-blue-500 fill-blue-500" size={20} />
                    Hydration
                </h3>
                <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-full">{progress.toFixed(0)}% Goal</span>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-3xl font-bold text-slate-100">
                        {intake}
                        <span className="text-sm text-slate-500 font-medium ml-1">/ {goal} ml</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Daily Water Intake</p>
                </div>

                {/* Visual Cup */}
                <div className="relative w-12 h-16 border-2 border-slate-700 rounded-b-xl border-t-0 bg-slate-800/50 overflow-hidden">
                    <div
                        className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500 ease-out opacity-80"
                        style={{ height: `${progress}%` }}
                    >
                        <div className="w-full h-2 bg-blue-400 opacity-50 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button
                    onClick={removeWater}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                >
                    <Minus size={18} />
                </button>
                <button
                    onClick={addWater}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add 250ml</span>
                </button>
            </div>
        </div>
    );
};

export default HydrationTracker;
