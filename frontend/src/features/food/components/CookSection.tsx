// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import {
//   ChefHat, Wand2, Package, Search, Sparkles, RefreshCw, Bookmark,
//   ShoppingCart, CalendarDays, Share2, AlertCircle, CheckCircle2,
//   Flame, Dumbbell, Wheat, Droplets, Star, Clock, Users, X,
//   Plus, ArrowRight, Heart, Loader2, RotateCcw, Zap, Utensils,
//   TrendingDown, TrendingUp, Leaf, HeartPulse
// } from 'lucide-react';
// import {
//   generateRecipeFromDish,
//   generateRecipeFromIngredients,
//   withRetry,
//   type GeneratedRecipe,
//   type RecipeFromDishParams,
//   type RecipeFromIngredientsParams,
// } from '../services/aiService';
// import type { useFoodPlanner } from '../hooks/useFoodPlanner';

// type FoodPlannerStore = ReturnType<typeof useFoodPlanner>;

// interface CookSectionProps {
//   store: FoodPlannerStore;
//   initialMode?: 'dish' | 'ingredients';
//   onNavigate: (section: string, subTab?: string) => void;
// }

// // ─────────────────────────────────────────────────────────────
// // Skeleton Loader
// // ─────────────────────────────────────────────────────────────
// const RecipeSkeleton: React.FC = () => (
//   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
//     <div className="flex gap-2">
//       <div className="h-5 bg-slate-800 rounded-full w-20" />
//       <div className="h-5 bg-slate-800 rounded-full w-24" />
//     </div>
//     <div className="h-8 bg-slate-800 rounded-lg w-2/3" />
//     <div className="space-y-2">
//       <div className="h-3 bg-slate-800 rounded w-full" />
//       <div className="h-3 bg-slate-800 rounded w-5/6" />
//       <div className="h-3 bg-slate-800 rounded w-4/6" />
//     </div>
//     <div className="grid grid-cols-4 gap-3 pt-2">
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="h-16 bg-slate-800 rounded-xl" />
//       ))}
//     </div>
//     <div className="grid md:grid-cols-2 gap-6 pt-2">
//       <div className="space-y-2">
//         <div className="h-4 bg-slate-800 rounded w-24" />
//         {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded-lg" />)}
//       </div>
//       <div className="space-y-2">
//         <div className="h-4 bg-slate-800 rounded w-24" />
//         {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-800 rounded-lg" />)}
//       </div>
//     </div>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────
// // Health Score Gauge
// // ─────────────────────────────────────────────────────────────
// const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
//   const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
//   const label = score >= 85 ? 'Excellent' : score >= 65 ? 'Good' : 'Fair';
//   return (
//     <div className="flex flex-col items-center gap-1">
//       <div className="relative w-20 h-20">
//         <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
//           <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
//           <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="4"
//             strokeLinecap="round"
//             strokeDasharray={`${score * 0.88} 88`}
//             style={{ transition: 'stroke-dasharray 1s ease' }}
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-lg font-black text-slate-100">{score}</span>
//         </div>
//       </div>
//       <span className="text-xs font-bold" style={{ color }}>{label}</span>
//       <span className="text-[10px] text-slate-500">Health Score</span>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Macro Stat Box
// // ─────────────────────────────────────────────────────────────
// const MacroBox: React.FC<{
//   label: string; value: string | number; unit: string;
//   icon: React.ReactNode; color: string; bgColor: string;
// }> = ({ label, value, unit, icon, color, bgColor }) => (
//   <div className={`${bgColor} border border-slate-800 rounded-xl p-3 text-center`}>
//     <div className={`${color} flex justify-center mb-1`}>{icon}</div>
//     <p className="text-lg font-black text-slate-100">{value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span></p>
//     <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
//   </div>
// );

// // ─────────────────────────────────────────────────────────────
// // Toast Notification
// // ─────────────────────────────────────────────────────────────
// interface Toast {
//   id: string;
//   message: string;
//   type: 'success' | 'error' | 'info';
//   action?: { label: string; onClick: () => void };
// }

// const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
//   <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
//     {toasts.map(toast => (
//       <div
//         key={toast.id}
//         className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300 ${
//           toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200' :
//           toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-200' :
//           'bg-slate-900/90 border-slate-700 text-slate-200'
//         }`}
//       >
//         {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" /> :
//          toast.type === 'error' ? <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" /> :
//          <Sparkles size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />}
//         <div className="flex-1">
//           <p className="text-sm font-medium">{toast.message}</p>
//           {toast.action && (
//             <button
//               onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
//               className="text-xs font-bold mt-1 opacity-80 hover:opacity-100 flex items-center gap-1"
//             >
//               {toast.action.label} <ArrowRight size={10} />
//             </button>
//           )}
//         </div>
//         <button onClick={() => onDismiss(toast.id)} className="text-current opacity-40 hover:opacity-80">
//           <X size={16} />
//         </button>
//       </div>
//     ))}
//   </div>
// );

// // ─────────────────────────────────────────────────────────────
// // Generated Recipe Card
// // ─────────────────────────────────────────────────────────────
// interface RecipeCardProps {
//   recipe: GeneratedRecipe;
//   streamedDesc: string;
//   isStreaming: boolean;
//   onSave: () => void;
//   onAddToGrocery: () => void;
//   onAddToMealPlan: () => void;
//   onRegenerate: () => void;
//   onModify: (modifier: string) => void;
//   isSaved: boolean;
// }

// const RecipeCard: React.FC<RecipeCardProps> = ({
//   recipe, streamedDesc, isStreaming, onSave, onAddToGrocery,
//   onAddToMealPlan, onRegenerate, onModify, isSaved
// }) => {
//   const missingIngredients = recipe.ingredients.filter(i => !i.inPantry);
//   const availableIngredients = recipe.ingredients.filter(i => i.inPantry);

//   const modifiers = [
//     { label: '↑ Protein', icon: <Dumbbell size={12} />, key: 'increase protein' },
//     { label: '↓ Calories', icon: <TrendingDown size={12} />, key: 'reduce calories' },
//     { label: 'Vegetarian', icon: <Leaf size={12} />, key: 'vegetarian' },
//     { label: 'Vegan', icon: <Leaf size={12} />, key: 'vegan' },
//     { label: 'Diabetic-Friendly', icon: <HeartPulse size={12} />, key: 'diabetic-friendly' },
//     { label: 'Heart-Friendly', icon: <Heart size={12} />, key: 'heart-friendly' },
//   ];

//   return (
//     <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden animate-in fade-in duration-500">
//       {/* Header Bar */}
//       <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap gap-2 items-center justify-between">
//         <div className="flex flex-wrap gap-2">
//           {recipe.tags.map(tag => (
//             <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
//               {tag}
//             </span>
//           ))}
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={onRegenerate}
//             title="Regenerate"
//             className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
//           >
//             <RefreshCw size={16} />
//           </button>
//           <button
//             onClick={onSave}
//             title={isSaved ? 'Saved!' : 'Save Recipe'}
//             className={`p-2 rounded-lg transition-all ${isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'}`}
//           >
//             {isSaved ? <BookmarkIcon /> : <Bookmark size={16} />}
//           </button>
//           <button onClick={onAddToMealPlan} title="Add to Meal Plan"
//             className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
//             <CalendarDays size={16} />
//           </button>
//           <button title="Share"
//             className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
//             <Share2 size={16} />
//           </button>
//         </div>
//       </div>

//       <div className="p-6 md:p-8">
//         {/* Title + Health Score */}
//         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <span className="text-xs text-slate-500 font-medium">{recipe.cuisine}</span>
//               <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
//                 recipe.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                 recipe.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
//                 'bg-red-500/10 text-red-400 border-red-500/20'
//               }`}>{recipe.difficulty}</span>
//               <span className="flex items-center gap-1 text-xs text-slate-500">
//                 <Clock size={12} /> {recipe.cookTime}m
//               </span>
//               <span className="flex items-center gap-1 text-xs text-slate-500">
//                 <Users size={12} /> {recipe.servings} servings
//               </span>
//             </div>
//             <h3 className="text-2xl font-black text-slate-100 mb-2">{recipe.title}</h3>
//             <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
//               {isStreaming ? (
//                 <>
//                   {streamedDesc}
//                   <span className="inline-block w-0.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
//                 </>
//               ) : streamedDesc || recipe.description}
//             </p>
//           </div>
//           <HealthScoreGauge score={recipe.healthScore} />
//         </div>

//         {/* Nutrition Bar */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 py-4 border-y border-slate-800">
//           <MacroBox label="Calories" value={recipe.calories} unit="kcal" icon={<Flame size={16} />} color="text-orange-400" bgColor="bg-orange-500/5" />
//           <MacroBox label="Protein" value={`${recipe.protein}g`} unit="" icon={<Dumbbell size={16} />} color="text-blue-400" bgColor="bg-blue-500/5" />
//           <MacroBox label="Carbs" value={`${recipe.carbs}g`} unit="" icon={<Wheat size={16} />} color="text-emerald-400" bgColor="bg-emerald-500/5" />
//           <MacroBox label="Fat" value={`${recipe.fat}g`} unit="" icon={<Droplets size={16} />} color="text-amber-400" bgColor="bg-amber-500/5" />
//         </div>

//         {/* Ingredients + Instructions */}
//         <div className="grid md:grid-cols-2 gap-8 mb-8">
//           {/* Ingredients */}
//           <div>
//             <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
//               <Package size={16} className="text-emerald-400" />
//               Ingredients
//               <span className="ml-auto text-xs text-slate-500 font-normal">
//                 {availableIngredients.length}/{recipe.ingredients.length} in pantry
//               </span>
//             </h4>
//             <ul className="space-y-2">
//               {recipe.ingredients.map((ing, i) => (
//                 <li key={i} className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
//                   ing.inPantry
//                     ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20'
//                     : 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20'
//                 }`}>
//                   <span className="flex items-center gap-2.5 text-slate-300">
//                     {ing.inPantry
//                       ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
//                       : <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
//                     }
//                     {ing.name}
//                   </span>
//                   <span className={`text-xs font-medium ${ing.inPantry ? 'text-slate-500' : 'text-amber-500'}`}>
//                     {ing.amount}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//             {missingIngredients.length > 0 && (
//               <button
//                 onClick={onAddToGrocery}
//                 className="mt-4 w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
//               >
//                 <ShoppingCart size={16} />
//                 Add {missingIngredients.length} Missing Items to Grocery
//               </button>
//             )}
//           </div>

//           {/* Instructions */}
//           <div>
//             <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
//               <Utensils size={16} className="text-violet-400" />
//               Instructions
//             </h4>
//             <ol className="space-y-3">
//               {recipe.instructions.map((step, i) => (
//                 <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
//                   <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xs">
//                     {i + 1}
//                   </span>
//                   <span>{step}</span>
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>

//         {/* AI Insight */}
//         <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 mb-6">
//           <div className="flex items-start gap-3">
//             <Sparkles size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-slate-300 leading-relaxed">{recipe.aiInsight}</p>
//           </div>
//         </div>

//         {/* Modifiers */}
//         <div>
//           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Customise Recipe</p>
//           <div className="flex flex-wrap gap-2">
//             {modifiers.map(mod => (
//               <button
//                 key={mod.key}
//                 onClick={() => onModify(mod.key)}
//                 className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-800 border border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400 text-slate-400 rounded-lg transition-all"
//               >
//                 {mod.icon}
//                 {mod.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Bookmark icon helper
// const BookmarkIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//   </svg>
// );

// // ─────────────────────────────────────────────────────────────
// // Tag Input for ingredients
// // ─────────────────────────────────────────────────────────────
// const IngredientTagInput: React.FC<{
//   tags: string[];
//   onAdd: (tag: string) => void;
//   onRemove: (tag: string) => void;
//   suggestions?: string[];
// }> = ({ tags, onAdd, onRemove, suggestions = [] }) => {
//   const [inputVal, setInputVal] = useState('');

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
//       e.preventDefault();
//       onAdd(inputVal.trim().replace(/,$/, ''));
//       setInputVal('');
//     } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
//       onRemove(tags[tags.length - 1]);
//     }
//   };

//   const filteredSuggestions = suggestions
//     .filter(s => !tags.includes(s) && s.toLowerCase().includes(inputVal.toLowerCase()))
//     .slice(0, 5);

//   return (
//     <div className="relative">
//       <div className="min-h-[52px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all">
//         {tags.map(tag => (
//           <span key={tag} className="flex items-center gap-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm px-2.5 py-0.5 rounded-lg">
//             {tag}
//             <button onClick={() => onRemove(tag)} className="text-violet-400 hover:text-violet-200 ml-1">
//               <X size={12} />
//             </button>
//           </span>
//         ))}
//         <input
//           type="text"
//           value={inputVal}
//           onChange={e => setInputVal(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder={tags.length === 0 ? 'Type ingredient and press Enter...' : ''}
//           className="flex-1 min-w-[120px] bg-transparent text-slate-200 text-sm outline-none placeholder-slate-600"
//         />
//       </div>
//       {filteredSuggestions.length > 0 && inputVal && (
//         <div className="absolute top-full mt-1 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
//           {filteredSuggestions.map(s => (
//             <button
//               key={s}
//               onClick={() => { onAdd(s); setInputVal(''); }}
//               className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // Main CookSection Component
// // ─────────────────────────────────────────────────────────────
// const CookSection: React.FC<CookSectionProps> = ({ store, initialMode = 'dish', onNavigate }) => {
//   const { pantryItems, pantryIngredientNames, savedRecipes, saveRecipe, addToGrocery, addMealToDay } = store;

//   const [mode, setMode] = useState<'dish' | 'ingredients' | 'describe'>(initialMode);
//   const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
//   const [streamedDesc, setStreamedDesc] = useState('');
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const abortRef = useRef<AbortController | null>(null);

//   // Mode A state
//   const [dishForm, setDishForm] = useState<RecipeFromDishParams>({
//     dishName: '', cuisine: 'Any', dietPreference: 'None', cookingTime: 'Under 30 mins',
//   });

//   // Mode B state
//   const [ingredientTags, setIngredientTags] = useState<string[]>([]);
//   // Mode C state
//   const [description, setDescription] = useState('');

//   // Sync initialMode prop
//   useEffect(() => { setMode(initialMode); }, [initialMode]);

//   const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
//     const id = Date.now().toString();
//     setToasts(prev => [...prev, { ...toast, id }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
//   }, []);

//   const dismissToast = useCallback((id: string) => {
//     setToasts(prev => prev.filter(t => t.id !== id));
//   }, []);

//   const generate = useCallback(async (modifier?: string) => {
//     if (abortRef.current) abortRef.current.abort();
//     abortRef.current = new AbortController();
//     const signal = abortRef.current.signal;

//     setIsGenerating(true);
//     setIsStreaming(false);
//     setStreamedDesc('');
//     setError(null);
//     setGeneratedRecipe(null);

//     try {
//       let recipe: GeneratedRecipe;

//       if (mode === 'dish') {
//         recipe = await withRetry(() => generateRecipeFromDish(
//           { ...dishForm, modifiers: modifier ? [modifier] : [] },
//           chunk => {
//             setIsStreaming(true);
//             setStreamedDesc(prev => prev + chunk);
//           },
//           signal
//         ));
//       } else {
//         recipe = await withRetry(() => generateRecipeFromIngredients(
//           { ingredients: ingredientTags },
//           chunk => {
//             setIsStreaming(true);
//             setStreamedDesc(prev => prev + chunk);
//           },
//           signal
//         ));
//       }

//       if (!signal.aborted) {
//         setGeneratedRecipe(recipe);
//         setIsStreaming(false);
//       }
//     } catch (err) {
//       if (!signal.aborted) {
//         setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
//         setIsStreaming(false);
//       }
//     } finally {
//       if (!signal.aborted) setIsGenerating(false);
//     }
//   }, [mode, dishForm, ingredientTags]);

//   const handleSaveRecipe = useCallback(() => {
//     if (!generatedRecipe) return;
//     saveRecipe(generatedRecipe);
//     showToast({ type: 'success', message: 'Recipe saved to your collection!' });
//   }, [generatedRecipe, saveRecipe, showToast]);

//   const handleAddToGrocery = useCallback(() => {
//     if (!generatedRecipe) return;
//     const missing = generatedRecipe.ingredients.filter(i => !i.inPantry);
//     if (missing.length === 0) {
//       showToast({ type: 'info', message: 'You already have all the ingredients!' });
//       return;
//     }
//     const count = addToGrocery(missing.map(i => ({
//       name: i.name, qty: i.amount, category: 'Other', reason: 'From Recipe',
//     })));
//     showToast({
//       type: 'success',
//       message: `${count} items added to your Grocery List`,
//       action: { label: 'View Grocery List', onClick: () => onNavigate('pantry', 'groceries') },
//     });
//   }, [generatedRecipe, addToGrocery, showToast, onNavigate]);

//   const handleAddToMealPlan = useCallback(() => {
//     if (!generatedRecipe) return;
//     addMealToDay({
//       mealType: 'Dinner', name: generatedRecipe.title,
//       calories: generatedRecipe.calories, protein: generatedRecipe.protein,
//       carbs: generatedRecipe.carbs, fat: generatedRecipe.fat, logged: false,
//     });
//     showToast({
//       type: 'success',
//       message: `"${generatedRecipe.title}" added to today's meal plan`,
//       action: { label: 'View Kitchen', onClick: () => onNavigate('kitchen') },
//     });
//   }, [generatedRecipe, addMealToDay, showToast, onNavigate]);

//   const isSaved = generatedRecipe
//     ? savedRecipes.some(r => r.id === generatedRecipe.id)
//     : false;

//   const pantryNames = pantryItems.map(i => i.name);

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <ToastContainer toasts={toasts} onDismiss={dismissToast} />

//       {/* Mode Switcher */}
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-2">
//         {[
//           { id: 'dish' as const, label: 'I Want To Make...', icon: <Wand2 size={16} />, desc: 'Describe a dish or cuisine' },
//           { id: 'ingredients' as const, label: 'I Have These Ingredients...', icon: <Package size={16} />, desc: 'Use what\'s in your pantry' },
//         ].map(m => (
//           <button
//             key={m.id}
//             onClick={() => setMode(m.id)}
//             className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
//               mode === m.id
//                 ? 'bg-violet-500/10 border border-violet-500/30 text-violet-300'
//                 : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
//             }`}
//           >
//             <div className={mode === m.id ? 'text-violet-400' : 'text-slate-500'}>{m.icon}</div>
//             <div>
//               <p className="text-sm font-bold">{m.label}</p>
//               <p className="text-xs opacity-60">{m.desc}</p>
//             </div>
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left: Input Form */}
//         <div className="lg:col-span-1 space-y-4">
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//             {/* Mode A: Dish Form */}
//             {mode === 'dish' && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Dish Name *</label>
//                   <input
//                     type="text"
//                     value={dishForm.dishName}
//                     onChange={e => setDishForm(f => ({ ...f, dishName: e.target.value }))}
//                     placeholder="e.g. Butter Chicken, Pasta Carbonara..."
//                     className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all placeholder-slate-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cuisine</label>
//                   <select
//                     value={dishForm.cuisine}
//                     onChange={e => setDishForm(f => ({ ...f, cuisine: e.target.value }))}
//                     className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
//                   >
//                     {['Any', 'Indian', 'Italian', 'Mediterranean', 'Asian', 'Mexican', 'American', 'Japanese', 'Thai', 'Greek'].map(c => (
//                       <option key={c}>{c}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Diet Preference</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free'].map(d => (
//                       <button
//                         key={d}
//                         onClick={() => setDishForm(f => ({ ...f, dietPreference: d }))}
//                         className={`py-2 px-3 text-xs rounded-xl border transition-all ${
//                           dishForm.dietPreference === d
//                             ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
//                             : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
//                         }`}
//                       >
//                         {d}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cooking Time</label>
//                   <select
//                     value={dishForm.cookingTime}
//                     onChange={e => setDishForm(f => ({ ...f, cookingTime: e.target.value }))}
//                     className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none"
//                   >
//                     {['Under 15 mins', 'Under 30 mins', '30-60 mins', 'Over 60 mins', 'Any'].map(t => (
//                       <option key={t}>{t}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             )}

//             {/* Mode B: Ingredient Input */}
//             {mode === 'ingredients' && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
//                     Your Ingredients
//                   </label>
//                   <IngredientTagInput
//                     tags={ingredientTags}
//                     onAdd={tag => setIngredientTags(prev => [...prev, tag])}
//                     onRemove={tag => setIngredientTags(prev => prev.filter(t => t !== tag))}
//                     suggestions={pantryNames}
//                   />
//                   <p className="text-xs text-slate-600 mt-2">Press Enter or comma to add each ingredient</p>
//                 </div>

//                 {/* Quick add from pantry */}
//                 <div>
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From Your Pantry</p>
//                   <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
//                     {pantryItems.map(item => (
//                       <button
//                         key={item.id}
//                         onClick={() => {
//                           if (!ingredientTags.includes(item.name)) {
//                             setIngredientTags(prev => [...prev, item.name]);
//                           }
//                         }}
//                         disabled={ingredientTags.includes(item.name)}
//                         className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
//                           ingredientTags.includes(item.name)
//                             ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 opacity-60'
//                             : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-violet-500/50 hover:text-violet-400'
//                         }`}
//                       >
//                         {ingredientTags.includes(item.name) ? '✓ ' : '+ '}{item.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Generate Button */}
//             <button
//               onClick={() => generate()}
//               disabled={isGenerating || (mode === 'dish' && !dishForm.dishName.trim()) || (mode === 'ingredients' && ingredientTags.length === 0)}
//               className="mt-5 w-full py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-black rounded-xl transition-all shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 text-sm"
//             >
//               {isGenerating ? (
//                 <><Loader2 size={18} className="animate-spin" /> Generating...</>
//               ) : (
//                 <><Zap size={18} /> Generate Recipe</>
//               )}
//             </button>

//             {error && (
//               <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
//                 <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-xs text-red-400">{error}</p>
//                   <button onClick={() => generate()} className="text-xs text-red-300 hover:text-red-200 mt-1 flex items-center gap-1">
//                     <RotateCcw size={10} /> Retry
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right: Output */}
//         <div className="lg:col-span-2 space-y-5">
//           {isGenerating && !generatedRecipe && <RecipeSkeleton />}

//           {!isGenerating && !generatedRecipe && !error && (
//             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 rounded-3xl mb-5">
//                 <ChefHat size={40} className="text-slate-600" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-400 mb-2">Your AI Recipe Awaits</h3>
//               <p className="text-sm text-slate-600 max-w-xs mx-auto">
//                 {mode === 'dish'
//                   ? 'Fill in the dish details on the left and hit Generate to create a complete recipe.'
//                   : 'Add your available ingredients to discover what you can cook right now.'}
//               </p>
//             </div>
//           )}

//           {generatedRecipe && (
//             <RecipeCard
//               recipe={generatedRecipe}
//               streamedDesc={streamedDesc}
//               isStreaming={isStreaming}
//               onSave={handleSaveRecipe}
//               onAddToGrocery={handleAddToGrocery}
//               onAddToMealPlan={handleAddToMealPlan}
//               onRegenerate={() => generate()}
//               onModify={(modifier) => generate(modifier)}
//               isSaved={isSaved}
//             />
//           )}

//           {/* Saved Recipes Sidebar (shown below on large screens) */}
//           {savedRecipes.length > 0 && (
//             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
//               <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
//                 <Bookmark size={16} className="text-emerald-400" />
//                 Saved Recipes
//                 <span className="ml-auto text-xs text-slate-500">{savedRecipes.length} saved</span>
//               </h3>
//               <div className="grid sm:grid-cols-2 gap-3">
//                 {savedRecipes.slice(0, 4).map(recipe => (
//                   <button
//                     key={recipe.id}
//                     onClick={() => {
//                       setGeneratedRecipe(recipe);
//                       setStreamedDesc(recipe.description);
//                     }}
//                     className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-left transition-all group"
//                   >
//                     <div className="flex items-start justify-between gap-2">
//                       <p className="text-sm font-semibold text-slate-300 group-hover:text-white line-clamp-2">{recipe.title}</p>
//                       <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
//                         recipe.healthScore >= 85 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
//                       }`}>{recipe.healthScore}</span>
//                     </div>
//                     <div className="flex items-center gap-3 mt-2">
//                       <span className="text-[10px] text-slate-500 flex items-center gap-1">
//                         <Flame size={10} className="text-orange-400" />{recipe.calories} kcal
//                       </span>
//                       <span className="text-[10px] text-slate-500 flex items-center gap-1">
//                         <Clock size={10} />{recipe.cookTime}m
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CookSection;
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChefHat, Wand2, Package, Search, Sparkles, RefreshCw, Bookmark,
  ShoppingCart, CalendarDays, Share2, AlertCircle, CheckCircle2,
  Flame, Dumbbell, Wheat, Droplets, Clock, Users, X,
  ArrowRight, Heart, Loader2, RotateCcw, Zap, Utensils,
  TrendingDown, Leaf, HeartPulse
} from 'lucide-react';
import {
  generateRecipeFromDish,
  generateRecipeFromIngredients,
  withRetry,
  type GeneratedRecipe,
  type RecipeFromDishParams,
  type RecipeFromIngredientsParams,
} from '../services/aiService';
import type { useFoodPlanner } from '../hooks/useFoodPlanner';

type FoodPlannerStore = ReturnType<typeof useFoodPlanner>;

interface CookSectionProps {
  store: FoodPlannerStore;
  initialMode?: 'dish' | 'ingredients' | 'describe';
  onNavigate: (section: string, subTab?: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────────────────────────
const RecipeSkeleton: React.FC = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex gap-2">
      <div className="h-5 bg-slate-800 rounded-full w-20" />
      <div className="h-5 bg-slate-800 rounded-full w-24" />
    </div>
    <div className="h-8 bg-slate-800 rounded-lg w-2/3" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-800 rounded w-5/6" />
      <div className="h-3 bg-slate-800 rounded w-4/6" />
    </div>
    <div className="grid grid-cols-4 gap-3 pt-2">
      {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-xl" />)}
    </div>
    <div className="grid md:grid-cols-2 gap-6 pt-2">
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-24" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded-lg" />)}
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-24" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-slate-800 rounded-lg" />)}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Health Score Gauge
// ─────────────────────────────────────────────────────────────
const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 85 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';
  const label = score >= 85 ? 'Excellent' : score >= 65 ? 'Good' : 'Fair';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${score * 0.88} 88`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-slate-100">{score}</span>
        </div>
      </div>
      <span className="text-xs font-bold" style={{ color }}>{label}</span>
      <span className="text-[10px] text-slate-500">Health Score</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Macro Stat Box
// ─────────────────────────────────────────────────────────────
const MacroBox: React.FC<{
  label: string; value: string | number; unit: string;
  icon: React.ReactNode; color: string; bgColor: string;
}> = ({ label, value, unit, icon, color, bgColor }) => (
  <div className={`${bgColor} border border-slate-800 rounded-xl p-3 text-center`}>
    <div className={`${color} flex justify-center mb-1`}>{icon}</div>
    <p className="text-lg font-black text-slate-100">{value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span></p>
    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Toast Notification
// ─────────────────────────────────────────────────────────────
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: { label: string; onClick: () => void };
}

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200' :
          toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-200' :
          'bg-slate-900/90 border-slate-700 text-slate-200'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" /> :
         toast.type === 'error' ? <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" /> :
         <Sparkles size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
          {toast.action && (
            <button
              onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
              className="text-xs font-bold mt-1 opacity-80 hover:opacity-100 flex items-center gap-1"
            >
              {toast.action.label} <ArrowRight size={10} />
            </button>
          )}
        </div>
        <button onClick={() => onDismiss(toast.id)} className="text-current opacity-40 hover:opacity-80">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Bookmark icon helper
// ─────────────────────────────────────────────────────────────
const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Generated Recipe Card
// ─────────────────────────────────────────────────────────────
interface RecipeCardProps {
  recipe: GeneratedRecipe;
  streamedDesc: string;
  isStreaming: boolean;
  onSave: () => void;
  onAddToGrocery: () => void;
  onAddToMealPlan: () => void;
  onRegenerate: () => void;
  onModify: (modifier: string) => void;
  isSaved: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe, streamedDesc, isStreaming, onSave, onAddToGrocery,
  onAddToMealPlan, onRegenerate, onModify, isSaved
}) => {
  const missingIngredients = recipe.ingredients.filter(i => !i.inPantry);
  const availableIngredients = recipe.ingredients.filter(i => i.inPantry);

  const modifiers = [
    { label: '↑ Protein', icon: <Dumbbell size={12} />, key: 'increase protein' },
    { label: '↓ Calories', icon: <TrendingDown size={12} />, key: 'reduce calories' },
    { label: 'Vegetarian', icon: <Leaf size={12} />, key: 'vegetarian' },
    { label: 'Vegan', icon: <Leaf size={12} />, key: 'vegan' },
    { label: 'Diabetic-Friendly', icon: <HeartPulse size={12} />, key: 'diabetic-friendly' },
    { label: 'Heart-Friendly', icon: <Heart size={12} />, key: 'heart-friendly' },
  ];

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onRegenerate} title="Regenerate"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
            <RefreshCw size={16} />
          </button>
          <button onClick={onSave} title={isSaved ? 'Saved!' : 'Save Recipe'}
            className={`p-2 rounded-lg transition-all ${isSaved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'}`}>
            {isSaved ? <BookmarkIcon /> : <Bookmark size={16} />}
          </button>
          <button onClick={onAddToMealPlan} title="Add to Meal Plan"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
            <CalendarDays size={16} />
          </button>
          <button title="Share"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-slate-500 font-medium">{recipe.cuisine}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                recipe.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                recipe.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>{recipe.difficulty}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {recipe.cookTime}m</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Users size={12} /> {recipe.servings} servings</span>
            </div>
            <h3 className="text-2xl font-black text-slate-100 mb-2">{recipe.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {isStreaming ? (
                <>{streamedDesc}<span className="inline-block w-0.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" /></>
              ) : streamedDesc || recipe.description}
            </p>
          </div>
          <HealthScoreGauge score={recipe.healthScore} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 py-4 border-y border-slate-800">
          <MacroBox label="Calories" value={recipe.calories} unit="kcal" icon={<Flame size={16} />} color="text-orange-400" bgColor="bg-orange-500/5" />
          <MacroBox label="Protein" value={`${recipe.protein}g`} unit="" icon={<Dumbbell size={16} />} color="text-blue-400" bgColor="bg-blue-500/5" />
          <MacroBox label="Carbs" value={`${recipe.carbs}g`} unit="" icon={<Wheat size={16} />} color="text-emerald-400" bgColor="bg-emerald-500/5" />
          <MacroBox label="Fat" value={`${recipe.fat}g`} unit="" icon={<Droplets size={16} />} color="text-amber-400" bgColor="bg-amber-500/5" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Package size={16} className="text-emerald-400" />
              Ingredients
              <span className="ml-auto text-xs text-slate-500 font-normal">
                {availableIngredients.length}/{recipe.ingredients.length} in pantry
              </span>
            </h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                  ing.inPantry
                    ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20'
                    : 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20'
                }`}>
                  <span className="flex items-center gap-2.5 text-slate-300">
                    {ing.inPantry
                      ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      : <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />}
                    {ing.name}
                  </span>
                  <span className={`text-xs font-medium ${ing.inPantry ? 'text-slate-500' : 'text-amber-500'}`}>
                    {ing.amount}
                  </span>
                </li>
              ))}
            </ul>
            {missingIngredients.length > 0 && (
              <button onClick={onAddToGrocery}
                className="mt-4 w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={16} />
                Add {missingIngredients.length} Missing Items to Grocery
              </button>
            )}
          </div>

          <div>
            <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Utensils size={16} className="text-violet-400" />
              Instructions
            </h4>
            <ol className="space-y-3">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xs">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">{recipe.aiInsight}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Customise Recipe</p>
          <div className="flex flex-wrap gap-2">
            {modifiers.map(mod => (
              <button key={mod.key} onClick={() => onModify(mod.key)}
                className="flex items-center gap-1.5 text-xs px-3 py-2 bg-slate-800 border border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400 text-slate-400 rounded-lg transition-all">
                {mod.icon}
                {mod.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Tag Input for ingredients
// ─────────────────────────────────────────────────────────────
const IngredientTagInput: React.FC<{
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  suggestions?: string[];
}> = ({ tags, onAdd, onRemove, suggestions = [] }) => {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      onAdd(inputVal.trim().replace(/,$/, ''));
      setInputVal('');
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions
    .filter(s => !tags.includes(s) && s.toLowerCase().includes(inputVal.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="relative">
      <div className="min-h-[52px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500/50 transition-all">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm px-2.5 py-0.5 rounded-lg">
            {tag}
            <button onClick={() => onRemove(tag)} className="text-violet-400 hover:text-violet-200 ml-1">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Type ingredient and press Enter...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-slate-200 text-sm outline-none placeholder-slate-600"
        />
      </div>
      {filteredSuggestions.length > 0 && inputVal && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden">
          {filteredSuggestions.map(s => (
            <button key={s} onClick={() => { onAdd(s); setInputVal(''); }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main CookSection Component
// ─────────────────────────────────────────────────────────────
const CookSection: React.FC<CookSectionProps> = ({ store, initialMode = 'dish', onNavigate }) => {
  const { pantryItems, savedRecipes, saveRecipe, addToGrocery, addMealToDay } = store;

  const [mode, setMode] = useState<'dish' | 'ingredients' | 'describe'>(initialMode);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [streamedDesc, setStreamedDesc] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Mode A state
  const [dishForm, setDishForm] = useState<RecipeFromDishParams>({
    dishName: '', cuisine: 'Any', dietPreference: 'None', cookingTime: 'Under 30 mins',
  });

  // Mode B state
  const [ingredientTags, setIngredientTags] = useState<string[]>([]);

  // Mode C state
  const [description, setDescription] = useState('');

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const generate = useCallback(async (modifier?: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setIsGenerating(true);
    setIsStreaming(false);
    setStreamedDesc('');
    setError(null);
    setGeneratedRecipe(null);

    try {
      let recipe: GeneratedRecipe;

      if (mode === 'dish') {
        recipe = await withRetry(() => generateRecipeFromDish(
          { ...dishForm, modifiers: modifier ? [modifier] : [] },
          chunk => { setIsStreaming(true); setStreamedDesc(prev => prev + chunk); },
          signal
        ));
      } else if (mode === 'ingredients') {
        recipe = await withRetry(() => generateRecipeFromIngredients(
          { ingredients: ingredientTags, variation: modifier },
          chunk => { setIsStreaming(true); setStreamedDesc(prev => prev + chunk); },
          signal
        ));
      } else {
        // describe mode — pass the description as the dish name
        recipe = await withRetry(() => generateRecipeFromDish(
          {
            dishName: description,
            cuisine: 'Any',
            dietPreference: 'None',
            cookingTime: 'Any',
            modifiers: modifier ? [modifier] : [],
          },
          chunk => { setIsStreaming(true); setStreamedDesc(prev => prev + chunk); },
          signal
        ));
      }

      if (!signal.aborted) {
        setGeneratedRecipe(recipe);
        setIsStreaming(false);
      }
    } catch (err) {
      if (!signal.aborted) {
        setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
        setIsStreaming(false);
      }
    } finally {
      if (!signal.aborted) setIsGenerating(false);
    }
  }, [mode, dishForm, ingredientTags, description]);

  const handleSaveRecipe = useCallback(() => {
    if (!generatedRecipe) return;
    saveRecipe(generatedRecipe);
    showToast({ type: 'success', message: 'Recipe saved to your collection!' });
  }, [generatedRecipe, saveRecipe, showToast]);

  const handleAddToGrocery = useCallback(() => {
    if (!generatedRecipe) return;
    const missing = generatedRecipe.ingredients.filter(i => !i.inPantry);
    if (missing.length === 0) {
      showToast({ type: 'info', message: 'You already have all the ingredients!' });
      return;
    }
    const count = addToGrocery(missing.map(i => ({ name: i.name, qty: i.amount, category: 'Other', reason: 'From Recipe' })));
    showToast({
      type: 'success',
      message: `${count} items added to your Grocery List`,
      action: { label: 'View Grocery List', onClick: () => onNavigate('pantry', 'groceries') },
    });
  }, [generatedRecipe, addToGrocery, showToast, onNavigate]);

  const handleAddToMealPlan = useCallback(() => {
    if (!generatedRecipe) return;
    addMealToDay({
      mealType: 'Dinner', name: generatedRecipe.title,
      calories: generatedRecipe.calories, protein: generatedRecipe.protein,
      carbs: generatedRecipe.carbs, fat: generatedRecipe.fat, logged: false,
    });
    showToast({
      type: 'success',
      message: `"${generatedRecipe.title}" added to today's meal plan`,
      action: { label: 'View Kitchen', onClick: () => onNavigate('kitchen') },
    });
  }, [generatedRecipe, addMealToDay, showToast, onNavigate]);

  const isSaved = generatedRecipe ? savedRecipes.some(r => r.id === generatedRecipe.id) : false;
  const pantryNames = pantryItems.map(i => i.name);

  const isGenerateDisabled =
    isGenerating ||
    (mode === 'dish' && !dishForm.dishName.trim()) ||
    (mode === 'ingredients' && ingredientTags.length === 0) ||
    (mode === 'describe' && !description.trim());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ── Three-mode nav bar ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-2">
        {[
          { id: 'dish' as const, label: 'I Want To Make', icon: <Wand2 size={16} />, desc: 'Name a dish or cuisine' },
          { id: 'ingredients' as const, label: 'I Have These', icon: <Package size={16} />, desc: 'Use pantry ingredients' },
          { id: 'describe' as const, label: 'Describe It', icon: <Search size={16} />, desc: 'Tell AI what you want' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setGeneratedRecipe(null); setError(null); }}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
              mode === m.id
                ? 'bg-violet-500/10 border border-violet-500/30 text-violet-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <div className={mode === m.id ? 'text-violet-400' : 'text-slate-500'}>{m.icon}</div>
            <div>
              <p className="text-sm font-bold">{m.label}</p>
              <p className="text-xs opacity-60">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            {/* ── Mode A: Dish Form ── */}
            {mode === 'dish' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Dish Name *</label>
                  <input
                    type="text"
                    value={dishForm.dishName}
                    onChange={e => setDishForm(f => ({ ...f, dishName: e.target.value }))}
                    placeholder="e.g. Butter Chicken, Pasta Carbonara..."
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cuisine</label>
                  <select
                    value={dishForm.cuisine}
                    onChange={e => setDishForm(f => ({ ...f, cuisine: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                  >
                    {['Any', 'Indian', 'Italian', 'Mediterranean', 'Asian', 'Mexican', 'American', 'Japanese', 'Thai', 'Greek'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Diet Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDishForm(f => ({ ...f, dietPreference: d }))}
                        className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                          dishForm.dietPreference === d
                            ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cooking Time</label>
                  <select
                    value={dishForm.cookingTime}
                    onChange={e => setDishForm(f => ({ ...f, cookingTime: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none"
                  >
                    {['Under 15 mins', 'Under 30 mins', '30-60 mins', 'Over 60 mins', 'Any'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* ── Mode B: Ingredient Input ── */}
            {mode === 'ingredients' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Your Ingredients
                  </label>
                  <IngredientTagInput
                    tags={ingredientTags}
                    onAdd={tag => setIngredientTags(prev => [...prev, tag])}
                    onRemove={tag => setIngredientTags(prev => prev.filter(t => t !== tag))}
                    suggestions={pantryNames}
                  />
                  <p className="text-xs text-slate-600 mt-2">Press Enter or comma to add each ingredient</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From Your Pantry</p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {pantryItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { if (!ingredientTags.includes(item.name)) setIngredientTags(prev => [...prev, item.name]); }}
                        disabled={ingredientTags.includes(item.name)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          ingredientTags.includes(item.name)
                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 opacity-60'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-violet-500/50 hover:text-violet-400'
                        }`}
                      >
                        {ingredientTags.includes(item.name) ? '✓ ' : '+ '}{item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Mode C: Describe It ── */}
            {mode === 'describe' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Describe What You Want
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Something spicy and comforting for a cold evening, high protein, ready in 30 mins..."
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all placeholder-slate-600 resize-none"
                  />
                  <p className="text-xs text-slate-600 mt-2">Be as specific or vague as you like — the AI figures it out</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Prompts</p>
                  {[
                    'Something quick and healthy for lunch',
                    'High protein post-workout meal',
                    'Comfort food for a rainy day',
                    'Light dinner under 400 calories',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setDescription(prompt)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        description === prompt
                          ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                          : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Generate Button ── */}
            <button
              onClick={() => generate()}
              disabled={isGenerateDisabled}
              className="mt-5 w-full py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-black rounded-xl transition-all shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 text-sm"
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> Generating...</>
              ) : (
                <><Zap size={18} /> Generate Recipe</>
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-red-400">{error}</p>
                  <button onClick={() => generate()} className="text-xs text-red-300 hover:text-red-200 mt-1 flex items-center gap-1">
                    <RotateCcw size={10} /> Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-2 space-y-5">
          {isGenerating && !generatedRecipe && <RecipeSkeleton />}

          {!isGenerating && !generatedRecipe && !error && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 rounded-3xl mb-5">
                <ChefHat size={40} className="text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">Your AI Recipe Awaits</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                {mode === 'dish'
                  ? 'Fill in the dish details on the left and hit Generate to create a complete recipe.'
                  : mode === 'ingredients'
                  ? 'Add your available ingredients to discover what you can cook right now.'
                  : 'Describe what you are craving and the AI will figure out the perfect recipe.'}
              </p>
            </div>
          )}

          {/* ── Suggest Another button (ingredients mode only) ── */}
          {generatedRecipe && mode === 'ingredients' && (
            <div className="flex justify-end">
              <button
                onClick={() => generate('suggest a completely different dish using the same ingredients')}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 text-sm font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                Suggest Another Dish
              </button>
            </div>
          )}

          {generatedRecipe && (
            <RecipeCard
              recipe={generatedRecipe}
              streamedDesc={streamedDesc}
              isStreaming={isStreaming}
              onSave={handleSaveRecipe}
              onAddToGrocery={handleAddToGrocery}
              onAddToMealPlan={handleAddToMealPlan}
              onRegenerate={() => generate()}
              onModify={(modifier) => generate(modifier)}
              isSaved={isSaved}
            />
          )}

          {savedRecipes.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
                <Bookmark size={16} className="text-emerald-400" />
                Saved Recipes
                <span className="ml-auto text-xs text-slate-500">{savedRecipes.length} saved</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {savedRecipes.slice(0, 4).map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => { setGeneratedRecipe(recipe); setStreamedDesc(recipe.description); }}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-300 group-hover:text-white line-clamp-2">{recipe.title}</p>
                      <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        recipe.healthScore >= 85 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>{recipe.healthScore}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Flame size={10} className="text-orange-400" />{recipe.calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} />{recipe.cookTime}m
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookSection;