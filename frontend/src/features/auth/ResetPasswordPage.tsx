import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';
import MatrixBackground from '../../shared/components/MatrixBackground';
import { apiClient } from '../../services/apiClient';

type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | '';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const checkStrength = (pass: string): PasswordStrength => {
        if (!pass) return '';
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        if (score < 3) return 'Weak';
        if (score < 5) return 'Medium';
        return 'Strong';
    };

    const strengthColor = {
        Weak: 'text-red-400',
        Medium: 'text-yellow-400',
        Strong: 'text-green-400',
        '': 'text-slate-500'
    }[passwordStrength];

    const strengthBg = {
        Weak: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Strong: 'bg-green-500',
        '': 'bg-slate-800'
    }[passwordStrength];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid reset link. Please request a new one.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (passwordStrength === 'Weak') {
            setError('Please choose a stronger password.');
            return;
        }

        setLoading(true);

        try {
            await apiClient('/auth/reset-password', { method: 'POST', data: { token, newPassword } });

            setSuccess(true);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
                <MatrixBackground />
                <div className="text-center z-10">
                    <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-bold text-slate-200">Invalid Reset Link</h2>
                    <p className="text-slate-400 mt-2 text-sm">This link is missing a token.</p>
                    <button onClick={() => navigate('/forgot-password')} className="mt-6 text-cyan-400 text-sm hover:underline">
                        Request a new reset link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
            <MatrixBackground />

            <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-4">
                        <KeyRound className="text-cyan-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-[0.1em] bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Set New Password
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">Choose a strong password for your account.</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl">

                    {success ? (
                        <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                                <CheckCircle className="text-green-400" size={40} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-200">Password Updated</h2>
                                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                    Your password has been reset. All previous sessions have been logged out for security.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                Login Now <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertTriangle size={16} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setPasswordStrength(checkStrength(e.target.value)); setError(''); }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                                        required
                                    />
                                </div>

                                {newPassword && (
                                    <div className="mt-2 px-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Strength</span>
                                            <span className={`font-bold ${strengthColor}`}>{passwordStrength}</span>
                                        </div>
                                        <div className="flex gap-1 h-1.5">
                                            <div className={`flex-1 rounded-full ${passwordStrength ? strengthBg : 'bg-slate-800'}`} />
                                            <div className={`flex-1 rounded-full ${['Medium', 'Strong'].includes(passwordStrength) ? strengthBg : 'bg-slate-800'}`} />
                                            <div className={`flex-1 rounded-full ${passwordStrength === 'Strong' ? strengthBg : 'bg-slate-800'}`} />
                                        </div>
                                        <ul className="text-[10px] text-slate-500 mt-2 space-y-1 list-disc pl-4">
                                            <li className={newPassword.length >= 8 ? 'text-green-400' : ''}>Minimum 8 characters</li>
                                            <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-green-400' : ''}>Uppercase and lowercase</li>
                                            <li className={/[0-9]/.test(newPassword) ? 'text-green-400' : ''}>At least one number</li>
                                            <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-400' : ''}>Special character</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:border-cyan-500 transition-colors outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-2 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'UPDATING...' : 'SET NEW PASSWORD'}
                                <ArrowRight size={18} />
                            </button>

                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;