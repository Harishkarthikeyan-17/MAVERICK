import React, { useState, useEffect, useMemo } from 'react';
import {
    Wallet, TrendingUp, TrendingDown, Target, AlertTriangle, PiggyBank,
    CreditCard, ArrowUpRight, ArrowDownRight, MessageSquare, Plus, Trash2,
    Filter, Calendar, DollarSign, Brain, CheckCircle2, X
} from 'lucide-react';
import {
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Types ---

type TransactionType = 'income' | 'expense';

interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string; // "Food", "Travel", "Rent", etc.
    date: string;
    note: string;
}

interface Budget {
    category: string;
    limit: number;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

// --- Mock Data ---

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'income', amount: 5000, category: 'Salary', date: '2023-10-01', note: 'Monthly Salary' },
    { id: '2', type: 'expense', amount: 1200, category: 'Rent', date: '2023-10-02', note: 'House Rent' },
    { id: '3', type: 'expense', amount: 350, category: 'Food', date: '2023-10-03', note: 'Groceries' },
    { id: '4', type: 'expense', amount: 150, category: 'Travel', date: '2023-10-05', note: 'Fuel' },
    { id: '5', type: 'expense', amount: 200, category: 'Shopping', date: '2023-10-07', note: 'Clothes' },
    { id: '6', type: 'expense', amount: 80, category: 'Utilities', date: '2023-10-10', note: 'Internet Bill' },
    { id: '7', type: 'expense', amount: 500, category: 'Food', date: '2023-10-12', note: 'Dinner out' },
    { id: '8', type: 'income', amount: 200, category: 'Freelance', date: '2023-10-15', note: 'Small project' },
];

const INITIAL_BUDGETS: Budget[] = [
    { category: 'Food', limit: 800 },
    { category: 'Travel', limit: 300 },
    { category: 'Rent', limit: 1200 },
    { category: 'Utilities', limit: 150 },
    { category: 'Shopping', limit: 250 },
    { category: 'Health', limit: 100 },
    { category: 'Others', limit: 200 },
];

const CATEGORIES = ['Food', 'Travel', 'Rent', 'Utilities', 'Shopping', 'Health', 'Others'];

const COLORS = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#ec4899', '#64748b'];

// --- Helper Components ---

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-slate-900 border border-slate-800 p-6 rounded-2xl ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
    <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={20} className="text-cyan-400" />}
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
    </div>
);

// --- Main Component ---

const Finance: React.FC = () => {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
    const [viewFilter, setViewFilter] = useState<'weekly' | 'monthly'>('monthly');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: '0', sender: 'ai', text: "Hello! I'm your financial assistant. Ask me about budget tips, savings, or spending habits." }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [showReminders, setShowReminders] = useState(true);

    // Form State
    const [newTx, setNewTx] = useState<Partial<Transaction>>({ type: 'expense', category: 'Food', date: new Date().toISOString().split('T')[0] });

    // --- Calculations ---

    const financials = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
        const savings = income - expense;
        const savingsRatio = income > 0 ? (savings / income) * 100 : 0;

        // Health Score Logic (0-100)
        // 1. Savings Ratio (max 40 pts) -> target 20%
        const scoreSavings = Math.min(40, (savingsRatio / 20) * 40);

        // 2. Budget Adherence (max 40 pts)
        const expenseByCategory: Record<string, number> = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        });
        let overBudgetCount = 0;
        budgets.forEach(b => {
            if ((expenseByCategory[b.category] || 0) > b.limit) overBudgetCount++;
        });
        const scoreBudget = Math.max(0, 40 - (overBudgetCount * 10));

        // 3. Data Entry / Discipline (max 20 pts) -> Simply having transactions
        const scoreDiscipline = transactions.length > 0 ? 20 : 0;

        const totalScore = Math.min(100, Math.round(scoreSavings + scoreBudget + scoreDiscipline));

        return { income, expense, savings, savingsRatio, totalScore, scoreLabel: getScoreLabel(totalScore), expenseByCategory };
    }, [transactions, budgets]);

    function getScoreLabel(score: number) {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Average';
        return 'Poor';
    }

    // Smart Insights Logic
    const insights = useMemo(() => {
        const list = [];

        // Expense Behavior
        const foodSpend = financials.expenseByCategory['Food'] || 0;
        const foodBudget = budgets.find(b => b.category === 'Food')?.limit || 0;
        if (foodSpend > foodBudget * 0.8) {
            list.push({ type: 'warning', text: `Food spending is at ${Math.round((foodSpend / foodBudget) * 100)}% of budget.` });
        }

        // Trend
        if (financials.expense > financials.income) {
            list.push({ type: 'danger', text: "Expenses exceed income for this period." });
        } else if (financials.savingsRatio < 10 && financials.income > 0) {
            list.push({ type: 'warning', text: "Savings ratio is below recommended 20%." });
        } else if (financials.savingsRatio > 30) {
            list.push({ type: 'good', text: "Great job! You're saving more than 30% of income." });
        }

        return list;
    }, [financials, budgets]);

    // Forecasting Logic
    const forecast = useMemo(() => {
        // Current day of month (simple projection)
        const today = new Date().getDate();
        const daysInMonth = 30; // approx
        const dailyBurn = financials.expense / Math.max(1, today);
        const projectedExpense = dailyBurn * daysInMonth;
        const projectedBalance = financials.income - projectedExpense;
        return { projectedExpense, projectedBalance };
    }, [financials]);


    // --- Handlers ---

    const handleAddTransaction = () => {
        if (!newTx.amount || !newTx.category) return;
        const tx: Transaction = {
            id: Date.now().toString(),
            type: newTx.type as TransactionType,
            amount: Number(newTx.amount),
            category: newTx.category!,
            date: newTx.date || new Date().toISOString().split('T')[0],
            note: newTx.note || ''
        };
        setTransactions([tx, ...transactions]);
        setNewTx({ type: 'expense', category: 'Food', amount: 0, note: '' });
    };

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMsg]);

        // Simple Rule-Based AI Response
        setTimeout(() => {
            let responseText = "I can help with that. Could you clarify?";
            const lower = chatInput.toLowerCase();

            if (lower.includes('save') || lower.includes('saving')) {
                responseText = "To save more, try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Currently, your savings ratio is " + financials.savingsRatio.toFixed(1) + "%.";
            } else if (lower.includes('food')) {
                responseText = `You've spent ₹${financials.expenseByCategory['Food'] || 0} on Food. Consider cooking at home this weekend!`;
            } else if (lower.includes('budget')) {
                responseText = "Make sure to review your budgets monthly. I can help suggest limits if you update your income.";
            } else if (lower.includes('invest') || lower.includes('stock')) {
                responseText = "I recommend consulting a certified financial advisor for investment advice. However, index funds are a popular low-cost option for beginners.";
            }

            setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText }]);
        }, 1000);

        setChatInput('');
    };

    // Automated Budget Suggestions
    const suggestBudgets = () => {
        // Simple algorithm: 50% needs, 30% wants logic applied to current income
        if (financials.income === 0) return;

        const suggested = budgets.map(b => {
            let factor = 0.1; // default 10%
            if (['Rent', 'Utilities', 'Food'].includes(b.category)) factor = 0.15; // Essential
            return { ...b, limit: Math.round(financials.income * factor) };
        });
        setBudgets(suggested);
        alert("Budgets updated based on 50/30/20 rule!");
    };

    const pieData = Object.entries(financials.expenseByCategory).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* 1. Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-100">Finance</h2>
                    <p className="text-slate-400 mt-1">Monitor, plan, and improve your financial health</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    <div className={`w-3 h-3 rounded-full ${financials.totalScore >= 60 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-slate-300">SYSTEM ACTIVE</span>
                </div>
            </header>

            {/* 2. Top Financial Health Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Income', value: `₹${financials.income}`, icon: Wallet, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { label: 'Total Expenses', value: `₹${financials.expense}`, icon: CreditCard, color: 'text-red-400', bg: 'bg-red-400/10' },
                    { label: 'Total Savings', value: `₹${financials.savings}`, icon: PiggyBank, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'Health Score', value: `${financials.totalScore} / 100`, sub: financials.scoreLabel, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                            <stat.icon size={22} />
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</h3>
                            </div>
                            {stat.sub && <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.sub === 'Excellent' || stat.sub === 'Good' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{stat.sub}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Charts Section */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <SectionTitle title="Cash Flow & Trends" icon={TrendingUp} />
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewFilter('weekly')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewFilter === 'weekly' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Weekly
                                </button>
                                <button
                                    onClick={() => setViewFilter('monthly')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewFilter === 'monthly' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={transactions.slice(0, 10).reverse()}> {/* Simple Mock for visual */}
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="amount" stroke="#22c55e" fillOpacity={1} fill="url(#colorInc)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Income & Expense Management */}
                    <Card>
                        <SectionTitle title="Transactions" icon={CreditCard} />

                        {/* Add Transaction Form */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <select
                                value={newTx.type}
                                onChange={e => setNewTx({ ...newTx, type: e.target.value as TransactionType })}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Amount"
                                value={newTx.amount || ''}
                                onChange={e => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <select
                                value={newTx.category}
                                onChange={e => setNewTx({ ...newTx, category: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <input
                                type="tex"
                                placeholder="Note"
                                value={newTx.note}
                                onChange={e => setNewTx({ ...newTx, note: e.target.value })}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <button
                                onClick={handleAddTransaction}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center transition-colors"
                            >
                                <Plus size={16} className="mr-2" /> Add
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {transactions.length === 0 && <p className="text-slate-500 text-center py-4">No transactions yet.</p>}
                            {transactions.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.type === 'income' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-200 font-medium">{tx.category}</h4>
                                            <p className="text-xs text-slate-500">{tx.date} • {tx.note}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-slate-200'}`}>
                                            {tx.type === 'income' ? '+' : '-'} ₹{tx.amount}
                                        </span>
                                        <button onClick={() => deleteTransaction(tx.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Budget Planning */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <SectionTitle title="Budget Planning" icon={Target} />
                            <button onClick={suggestBudgets} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors">
                                <Brain size={14} /> Auto-Suggest
                            </button>
                        </div>
                        <div className="space-y-4">
                            {budgets.map((b, i) => {
                                const spent = financials.expenseByCategory[b.category] || 0;
                                const percent = Math.min(100, (spent / b.limit) * 100);
                                const isOver = spent > b.limit;

                                return (
                                    <div key={b.category} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-300 font-medium">{b.category}</span>
                                            <span className={`${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                                                ₹{spent} / <span className="text-slate-500">₹{b.limit}</span>
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-cyan-500'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">

                    {/* Smart Financial Insights */}
                    <Card className="border-cyan-500/20 bg-cyan-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                        <SectionTitle title="Smart Insights" icon={Brain} />

                        <div className="space-y-4">
                            {/* Expense Behavior */}
                            {insights.map((insight, i) => (
                                <div key={i} className={`p-3 rounded-lg border text-sm flex gap-3 ${insight.type === 'good' ? 'bg-green-500/10 border-green-500/20 text-green-200' :
                                    insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                        'bg-red-500/10 border-red-500/20 text-red-200'
                                    }`}>
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <p>{insight.text}</p>
                                </div>
                            ))}

                            {/* Drift Detection */}
                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">Budget Drift</h4>
                                <p className="text-slate-200 text-sm">
                                    At current pace, you will end the month with <span className="text-cyan-400 font-bold">₹{Math.round(forecast.projectedBalance)}</span> saved.
                                </p>
                            </div>

                            {/* Forecast */}
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <span className="text-xs text-slate-400">Proj. Expense</span>
                                <span className="text-sm font-bold text-slate-200">₹{Math.round(forecast.projectedExpense)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Expense Distribution */}
                    <Card>
                        <SectionTitle title="Expense Breakdown" icon={PieChart} />
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-xs text-slate-500 block">Total</span>
                                    <span className="text-lg font-bold text-slate-200">₹{financials.expense}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {pieData.slice(0, 4).map((d, i) => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-xs text-slate-400">{d.name} <span className="text-slate-500">({financials.expense > 0 ? Math.round((Number(d.value) / financials.expense) * 100) : 0}%)</span></span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* AI Guidance Panel */}
                    <Card className="h-[400px] flex flex-col">
                        <SectionTitle title="Financial Guidance" icon={MessageSquare} />
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar mb-4">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-cyan-500 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-300 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto relative">
                            <input
                                type="text"
                                placeholder="Ask for advice..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl py-3 pl-4 pr-10 focus:ring-cyan-500 focus:border-cyan-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="absolute right-2 top-2 p-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </Card>

                    {/* Reminders Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={20} className="text-amber-400" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-200">Payment Reminders</h4>
                                <p className="text-xs text-slate-500">Upcoming bill alerts</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowReminders(!showReminders)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${showReminders ? 'bg-cyan-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showReminders ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                </div>
            </div>

            {/* Finance Page – Extended Financial Insights */}
            {/* ========================================== */}

            {/* 1. Loan & EMI Overview Section */}
            <Card>
                <SectionTitle title="Loan & EMI Overview" icon={CreditCard} />
                <p className="text-xs text-slate-400 mb-6">Active loans and monthly EMI commitments</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Monthly EMI Total Card */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-5 rounded-xl">
                        <p className="text-xs text-purple-300 font-medium mb-1">Total Monthly EMI</p>
                        <h3 className="text-3xl font-bold text-slate-100">₹12,500</h3>
                        <p className="text-xs text-slate-500 mt-2">Across 3 active loans</p>
                    </div>

                    {/* Outstanding Balance Card */}
                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-5 rounded-xl">
                        <p className="text-xs text-cyan-300 font-medium mb-1">Total Outstanding</p>
                        <h3 className="text-3xl font-bold text-slate-100">₹4,85,000</h3>
                        <p className="text-xs text-slate-500 mt-2">Principal remaining</p>
                    </div>
                </div>

                {/* Loan Details Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">Loan Type</th>
                                <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">EMI Amount</th>
                                <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">Interest Rate</th>
                                <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">Outstanding</th>
                                <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider pb-3">End Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {[
                                { type: 'Home Loan', emi: 8500, rate: 8.5, outstanding: 350000, endDate: 'Dec 2035' },
                                { type: 'Car Loan', emi: 3200, rate: 9.2, outstanding: 120000, endDate: 'Jun 2027' },
                                { type: 'Personal Loan', emi: 800, rate: 11.5, outstanding: 15000, endDate: 'Mar 2025' },
                            ].map((loan, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 text-sm text-slate-200 font-medium">{loan.type}</td>
                                    <td className="py-4 text-sm text-slate-300 text-right">₹{loan.emi.toLocaleString()}</td>
                                    <td className="py-4 text-sm text-slate-300 text-right">{loan.rate}%</td>
                                    <td className="py-4 text-sm text-slate-300 text-right">₹{loan.outstanding.toLocaleString()}</td>
                                    <td className="py-4 text-sm text-slate-400 text-right">{loan.endDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 2. EMI & Financial Commitments Schedule */}
            <Card>
                <SectionTitle title="EMI & Financial Commitments Schedule" icon={Calendar} />
                <p className="text-xs text-slate-400 mb-6">Upcoming payments and fixed commitments</p>

                <div className="space-y-3">
                    {[
                        { date: '05 Feb 2026', amount: 8500, type: 'Loan EMI', category: 'Home Loan', status: 'upcoming' },
                        { date: '08 Feb 2026', amount: 3200, type: 'Loan EMI', category: 'Car Loan', status: 'upcoming' },
                        { date: '10 Feb 2026', amount: 1200, type: 'Subscription', category: 'Netflix Premium', status: 'upcoming' },
                        { date: '12 Feb 2026', amount: 800, type: 'Loan EMI', category: 'Personal Loan', status: 'upcoming' },
                        { date: '15 Feb 2026', amount: 2500, type: 'Insurance', category: 'Health Insurance', status: 'upcoming' },
                        { date: '20 Feb 2026', amount: 500, type: 'Subscription', category: 'Gym Membership', status: 'upcoming' },
                        { date: '25 Feb 2026', amount: 150, type: 'Other', category: 'Cloud Storage', status: 'upcoming' },
                    ].map((commitment, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-900 rounded-lg border border-slate-700">
                                    <span className="text-xs text-slate-500 font-medium">{commitment.date.split(' ')[0]}</span>
                                    <span className="text-lg font-bold text-slate-200">{commitment.date.split(' ')[1]}</span>
                                </div>
                                <div>
                                    <h4 className="text-slate-200 font-medium">{commitment.category}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${commitment.type === 'Loan EMI' ? 'bg-purple-500/20 text-purple-300' :
                                                commitment.type === 'Subscription' ? 'bg-blue-500/20 text-blue-300' :
                                                    commitment.type === 'Insurance' ? 'bg-green-500/20 text-green-300' :
                                                        'bg-slate-500/20 text-slate-300'
                                            }`}>
                                            {commitment.type}
                                        </span>
                                        <span className="text-xs text-slate-500">{commitment.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-slate-200">₹{commitment.amount.toLocaleString()}</span>
                                <p className="text-xs text-slate-500 mt-1">Due soon</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Monthly Total */}
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300">Total Monthly Commitments</span>
                        <span className="text-2xl font-bold text-slate-100">₹16,850</span>
                    </div>
                </div>
            </Card>

            {/* 3. Expense Breakdown – Fixed vs Variable */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <SectionTitle title="Fixed Expenses" icon={DollarSign} />
                    <p className="text-xs text-slate-400 mb-6">Recurring monthly commitments</p>

                    <div className="space-y-4">
                        {[
                            { category: 'Rent', amount: 12000, icon: '🏠' },
                            { category: 'EMI Payments', amount: 12500, icon: '💳' },
                            { category: 'Insurance', amount: 2500, icon: '🛡️' },
                            { category: 'Utilities', amount: 1500, icon: '⚡' },
                            { category: 'Subscriptions', amount: 1850, icon: '📱' },
                        ].map((expense, i) => {
                            const total = 30350;
                            const percent = (expense.amount / total) * 100;
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{expense.icon}</span>
                                            <span className="text-sm text-slate-300 font-medium">{expense.category}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-200">₹{expense.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">{percent.toFixed(1)}% of fixed expenses</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-300">Total Fixed</span>
                            <span className="text-xl font-bold text-cyan-400">₹30,350</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <SectionTitle title="Variable Expenses" icon={TrendingDown} />
                    <p className="text-xs text-slate-400 mb-6">Flexible monthly spending</p>

                    <div className="space-y-4">
                        {[
                            { category: 'Food & Dining', amount: 8500, icon: '🍽️' },
                            { category: 'Travel & Transport', amount: 3200, icon: '🚗' },
                            { category: 'Shopping', amount: 4500, icon: '🛍️' },
                            { category: 'Entertainment', amount: 2100, icon: '🎬' },
                            { category: 'Health & Fitness', amount: 1800, icon: '💪' },
                        ].map((expense, i) => {
                            const total = 20100;
                            const percent = (expense.amount / total) * 100;
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{expense.icon}</span>
                                            <span className="text-sm text-slate-300 font-medium">{expense.category}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-200">₹{expense.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">{percent.toFixed(1)}% of variable expenses</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-300">Total Variable</span>
                            <span className="text-xl font-bold text-purple-400">₹20,100</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Financial Analytics Summary */}
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900/20 border-cyan-500/20">
                <div className="flex items-center justify-between mb-6">
                    <SectionTitle title="Financial Analytics" icon={Brain} />
                    <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                        <span className="text-xs font-bold text-cyan-300">INSIGHTS</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-400 mb-2">Fixed vs Variable Ratio</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-cyan-400">60</span>
                            <span className="text-lg font-bold text-slate-500">/</span>
                            <span className="text-2xl font-bold text-purple-400">40</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Healthy balance maintained</p>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-400 mb-2">Avg. Daily Variable Spend</p>
                        <span className="text-2xl font-bold text-slate-100">₹670</span>
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                            <TrendingDown size={12} /> 12% below target
                        </p>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-400 mb-2">Largest Variable Category</p>
                        <span className="text-2xl font-bold text-slate-100">Food</span>
                        <p className="text-xs text-slate-500 mt-2">₹8,500 this month</p>
                    </div>
                </div>
            </Card>

            {/* 4. Tax Data Overview */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <SectionTitle title="Tax Data Overview" icon={DollarSign} />
                    <select className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500">
                        <option>FY 2025-26</option>
                        <option>FY 2024-25</option>
                        <option>FY 2023-24</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Gross Income', value: '₹12,00,000', color: 'text-green-400', bg: 'bg-green-400/10' },
                        { label: 'Tax Deducted', value: '₹1,80,000', color: 'text-red-400', bg: 'bg-red-400/10' },
                        { label: 'Tax Savings', value: '₹50,000', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        { label: 'Est. Tax Liability', value: '₹1,30,000', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} border border-slate-800 p-4 rounded-xl`}>
                            <p className="text-xs text-slate-400 font-medium mb-2">{stat.label}</p>
                            <h3 className={`text-xl font-bold ${stat.color}`}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Income Categories */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-3">Income Categories</h4>
                    {[
                        { category: 'Salary Income', amount: 1000000, tax: 150000 },
                        { category: 'Freelance Income', amount: 150000, tax: 22500 },
                        { category: 'Investment Returns', amount: 50000, tax: 7500 },
                    ].map((income, i) => (
                        <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h5 className="text-sm font-medium text-slate-200">{income.category}</h5>
                                    <p className="text-xs text-slate-500 mt-1">Gross: ₹{income.amount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Tax Deducted</p>
                                    <p className="text-sm font-bold text-red-400">₹{income.tax.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                    style={{ width: `${((income.amount - income.tax) / income.amount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tax Saving Investments */}
                <div className="mt-6 p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="text-sm font-bold text-purple-300 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        Tax-Saving Investments (80C)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'PPF', amount: 20000 },
                            { name: 'ELSS', amount: 15000 },
                            { name: 'Life Insurance', amount: 10000 },
                            { name: 'NPS', amount: 5000 },
                        ].map((investment, i) => (
                            <div key={i} className="text-center">
                                <p className="text-xs text-slate-400">{investment.name}</p>
                                <p className="text-lg font-bold text-slate-100 mt-1">₹{investment.amount.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-300">Total Invested</span>
                            <span className="text-xl font-bold text-purple-400">₹50,000</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Limit: ₹1,50,000 | Remaining: ₹1,00,000</p>
                    </div>
                </div>
            </Card>

            {/* 5. Financial Goals Section */}
            <Card>
                <SectionTitle title="Financial Goals" icon={Target} />
                <p className="text-xs text-slate-400 mb-6">Track your short-term, mid-term, and long-term financial objectives</p>

                {/* Short-term Goals (0-1 year) */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <h4 className="text-sm font-bold text-slate-300">Short-term Goals (0-1 year)</h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Emergency Fund', target: 100000, current: 75000, deadline: 'Jun 2026' },
                            { name: 'Vacation to Bali', target: 80000, current: 45000, deadline: 'Aug 2026' },
                            { name: 'New Laptop', target: 120000, current: 95000, deadline: 'Apr 2026' },
                        ].map((goal, i) => {
                            const progress = (goal.current / goal.target) * 100;
                            return (
                                <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="text-sm font-medium text-slate-200">{goal.name}</h5>
                                            <p className="text-xs text-slate-500 mt-1">Target: {goal.deadline}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Progress</p>
                                            <p className="text-sm font-bold text-green-400">{progress.toFixed(0)}%</p>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">₹{goal.current.toLocaleString()} saved</span>
                                        <span className="text-xs text-slate-500">₹{goal.target.toLocaleString()} target</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mid-term Goals (1-5 years) */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                        <h4 className="text-sm font-bold text-slate-300">Mid-term Goals (1-5 years)</h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Car Down Payment', target: 300000, current: 120000, deadline: 'Dec 2027' },
                            { name: 'Wedding Fund', target: 500000, current: 180000, deadline: 'Mar 2028' },
                            { name: 'Home Renovation', target: 400000, current: 85000, deadline: 'Sep 2029' },
                        ].map((goal, i) => {
                            const progress = (goal.current / goal.target) * 100;
                            return (
                                <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="text-sm font-medium text-slate-200">{goal.name}</h5>
                                            <p className="text-xs text-slate-500 mt-1">Target: {goal.deadline}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Progress</p>
                                            <p className="text-sm font-bold text-cyan-400">{progress.toFixed(0)}%</p>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">₹{goal.current.toLocaleString()} saved</span>
                                        <span className="text-xs text-slate-500">₹{goal.target.toLocaleString()} target</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Long-term Goals (5+ years) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <h4 className="text-sm font-bold text-slate-300">Long-term Goals (5+ years)</h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Retirement Fund', target: 10000000, current: 850000, deadline: '2050' },
                            { name: 'Child Education Fund', target: 2500000, current: 320000, deadline: '2038' },
                            { name: 'Dream Home', target: 5000000, current: 450000, deadline: '2035' },
                        ].map((goal, i) => {
                            const progress = (goal.current / goal.target) * 100;
                            return (
                                <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="text-sm font-medium text-slate-200">{goal.name}</h5>
                                            <p className="text-xs text-slate-500 mt-1">Target: {goal.deadline}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">Progress</p>
                                            <p className="text-sm font-bold text-purple-400">{progress.toFixed(0)}%</p>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">₹{(goal.current / 100000).toFixed(1)}L saved</span>
                                        <span className="text-xs text-slate-500">₹{(goal.target / 100000).toFixed(1)}L target</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Goals Summary */}
                <div className="mt-6 p-5 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="text-sm font-bold text-purple-300 mb-4">Goals Summary</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Total Goals</p>
                            <p className="text-2xl font-bold text-slate-100 mt-1">9</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Total Target</p>
                            <p className="text-2xl font-bold text-cyan-400 mt-1">₹1.9Cr</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-400">Total Saved</p>
                            <p className="text-2xl font-bold text-green-400 mt-1">₹22.2L</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* End of Finance Page – Extended Financial Insights */}

        </div>
    );
};

export default Finance;
