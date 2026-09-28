const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense', 'investment'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    category: { type: String, required: true },
    allocated: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    month: { type: String, required: true } // format YYYY-MM
});

const loanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    outstanding: { type: Number, required: true },
    emiAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    nextDueDate: { type: Date }
});

const financeGoalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    term: { type: String, enum: ['Short Term', 'Mid Term', 'Long Term'], required: true },
    targetDate: { type: Date },
    status: { type: String, enum: ['Active', 'Completed', 'Paused'], default: 'Active' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Loan = mongoose.model('Loan', loanSchema);
const FinanceGoal = mongoose.model('FinanceGoal', financeGoalSchema);

module.exports = { Transaction, Budget, Loan, FinanceGoal };
