import React, { useState } from 'react';
import { ChefHat, ShoppingCart, Plus, X, Utensils, Clock, Flame, Info, Leaf, ShieldAlert, Heart, Calendar } from 'lucide-react';
import { useFoodPlanner } from '../hooks/useFoodPlanner';
import { Dish, FoodPreference } from '../types';

const Food: React.FC = () => {
    const {
        pantry,
        addIngredient,
        removeIngredient,
        preferences,
        setPreferences,
        generatedDishes,
        shoppingList,
        consistencyScore,
        getSubstitutions
    } = useFoodPlanner();

    const [inputIngredient, setInputIngredient] = useState('');
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

    const handleAdd = () => {
        if (inputIngredient) {
            addIngredient(inputIngredient);
            setInputIngredient('');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
                        Smart Kitchen
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest font-black">
                            AI Powered
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-1">Plan meals, reduce waste, and eat healthier.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Check 1: Input & Context */}
                <div className="space-y-6">
                    {/* Pantry Input */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <ChefHat className="text-emerald-500" size={20} />
                            Your Kitchen
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Add ingredients (e.g. Tomato)..."
                                value={inputIngredient}
                                onChange={(e) => setInputIngredient(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
                            {pantry.length === 0 && (
                                <span className="text-xs text-slate-500 italic p-2">No ingredients added yet. The AI needs input to cook!</span>
                            )}
                            {pantry.map(item => (
                                <span key={item.id} className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-xs border border-slate-700">
                                    {item.name}
                                    <button onClick={() => removeIngredient(item.id)} className="hover:text-red-400">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Cooking Context</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">People</label>
                                <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, peopleCount: Math.max(1, p.peopleCount - 1) }))}
                                        className="text-slate-400 hover:text-white"
                                    >-</button>
                                    <span className="text-sm font-bold text-slate-200 w-4 text-center">{preferences.peopleCount}</span>
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, peopleCount: p.peopleCount + 1 }))}
                                        className="text-slate-400 hover:text-white"
                                    >+</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Diet Goal</label>
                                <select
                                    value={preferences.diet}
                                    onChange={(e) => setPreferences(p => ({ ...p, diet: e.target.value as any }))}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg p-2"
                                >
                                    <option value="None">No Restriction</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Keto">Keto / Low Carb</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Consistency */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 mb-0 flex items-center gap-2">
                                <Flame className="text-orange-500" size={16} />
                                Cooking Consistency
                            </h3>
                            <span className="text-lg font-bold text-slate-200">{consistencyScore}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000" style={{ width: `${consistencyScore}%` }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">Great job! You cooked 5 out of last 7 days.</p>
                    </div>
                </div>

                {/* Col 2: AI Chef Table */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Utensils className="text-emerald-400" size={20} />
                        Chef's Suggestions
                    </h3>

                    {generatedDishes.lenght === 0 && pantry.length > 0 && (
                        <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                            No dishes match these exact ingredients. Try adding more staples (Oil, Salt, Eggs)!
                        </div>
                    )}

                    {generatedDishes.map(dish => (
                        <button
                            key={dish.id}
                            onClick={() => setSelectedDish(dish)}
                            className={`w-full text-left bg-slate-900 border transition-all p-4 rounded-xl group relative overflow-hidden ${selectedDish?.id === dish.id
                                    ? 'border-emerald-500 ring-1 ring-emerald-500/50'
                                    : 'border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            {/* Match Score Badge */}
                            <div className="absolute top-0 right-0 p-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dish.matchScore === 100 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    {Math.round(dish.matchScore)}% Match
                                </span>
                            </div>

                            <h4 className="font-bold text-slate-200 text-lg">{dish.name}</h4>

                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock size={12} /> {dish.time}m</span>
                                <span className={`px-1.5 py-0.5 rounded ${dish.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>{dish.difficulty}</span>
                                <span className="text-slate-500">{dish.calories} kcal</span>
                            </div>

                            {/* Missing Ingredient Alert */}
                            {dish.missingIngredients.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-wrap gap-1">
                                    <span className="text-[10px] text-red-400 mr-1">Missing:</span>
                                    {dish.missingIngredients.map(ing => (
                                        <span key={ing} className="text-[10px] text-slate-500 bg-slate-950 px-1.5 rounded">{ing}</span>
                                    ))}
                                </div>
                            )}

                            {/* Confidence Meter (Visual only) */}
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Confidence</span>
                                <div className="flex gap-0.5">
                                    <div className={`w-3 h-1 rounded-full ${dish.confidenceLevel !== 'Low' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <div className={`w-3 h-1 rounded-full ${dish.confidenceLevel === 'High' ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                    <div className={`w-3 h-1 rounded-full ${dish.confidenceLevel === 'High' ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Col 3: Details & Planner */}
                <div className="space-y-6">
                    {selectedDish ? (
                        <div className="bg-slate-900 border border-emerald-500/20 p-6 rounded-2xl animate-in slide-in-from-right-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-100">{selectedDish.name}</h3>
                                <button onClick={() => setSelectedDish(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                            </div>

                            {/* Health Tags */}
                            <div className="flex gap-2 mb-6">
                                <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-1 rounded-lg border border-slate-700">{selectedDish.healthTag}</span>
                                {selectedDish.allergens?.map(aler => (
                                    <span key={aler} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg border border-red-500/20 flex items-center gap-1">
                                        <ShieldAlert size={10} /> {aler}
                                    </span>
                                ))}
                            </div>

                            {/* Ingredients List with Subs */}
                            <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-bold text-slate-300">Detailed Ingredients</h4>
                                <ul className="space-y-2">
                                    {(selectedDish as any).requiredIngredients?.map((ing: string) => {
                                        const missing = selectedDish.missingIngredients.includes(ing);
                                        const subs = getSubstitutions(ing);
                                        return (
                                            <li key={ing} className="text-sm text-slate-400 flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${missing ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                    <span className={missing ? 'text-slate-500' : 'text-slate-300'}>{ing}</span>
                                                    {missing && <span className="text-[10px] text-red-400 border border-red-500/20 px-1 rounded">Missing</span>}
                                                </div>
                                                {missing && subs.length > 0 && (
                                                    <div className="ml-4 mt-1 text-xs text-emerald-400 italic">
                                                        Try: {subs.join(' or ')}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Steps */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-300">Method</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-400">
                                    {selectedDish.steps?.map(step => (
                                        <li key={step}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20">
                                Cook This Meal
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center py-12">
                            <ChefHat size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-500">Select a dish to view full cooking guide, substitutions, and nutrition.</p>
                        </div>
                    )}

                    {/* Smart Shopping List */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <ShoppingCart className="text-cyan-400" size={20} />
                            Smart Shopping List
                        </h3>
                        {shoppingList.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">Your pantry looks well stocked for the top recipes!</p>
                        ) : (
                            <ul className="space-y-2">
                                {shoppingList.map(item => (
                                    <li key={item} className="flex items-center justify-between text-sm text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                                        <span>{item}</span>
                                        <button className="text-emerald-500 hover:text-emerald-400 text-xs font-bold">+ Cart</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Food;
