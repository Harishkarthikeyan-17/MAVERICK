import React from 'react';
import { Pill, Sun, CheckCircle2, Circle } from 'lucide-react';

const DailyHealthSummary: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vitamins & Supplements */}
            <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                        <Pill size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">Vitamins & Meds</h3>
                </div>
                <div className="space-y-3">
                    {[
                        { name: "Multivitamin", time: "Morning", taken: true },
                        { name: "Omega-3", time: "Morning", taken: true },
                        { name: "Vitamin D3", time: "Afternoon", taken: false },
                        { name: "Magnesium", time: "Evening", taken: false },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                            <div className="flex items-center gap-3">
                                {item.taken ?
                                    <CheckCircle2 size={18} className="text-emerald-500" /> :
                                    <Circle size={18} className="text-slate-600" />
                                }
                                <div>
                                    <p className={`text-sm font-medium ${item.taken ? 'text-slate-300 line-through opacity-70' : 'text-slate-200'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Day at a Glance / Summary */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sun size={120} className="text-amber-400" />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400">
                        <Sun size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">Day Summary</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            You've maintained <span className="text-emerald-400 font-bold">high energy levels</span> throughout the day.
                            Your heart rate recovery after activity was excellent. Hydration is on track, but consider
                            increasing water intake in the evening to meet your daily goal.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">Consistent</span>
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">Balanced</span>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Macronutrients Estimate</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Protein</span>
                                    <span className="text-slate-500">120g / 150g</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Carbs</span>
                                    <span className="text-slate-500">180g / 220g</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300">Fats</span>
                                    <span className="text-slate-500">45g / 60g</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyHealthSummary;
