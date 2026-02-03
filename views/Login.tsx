import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ShieldCheck, ArrowRight, ArrowLeft, Loader2, Sparkles, Building2, Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [university, setUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role,
              institution: university,
            }
          }
        });
        if (signUpError) throw signUpError;
        alert('Check your email for the confirmation link!');
      } else {
        // Sign In Flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button - Top Left */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBack}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300"
          style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}

      {/* Background radial gradient provided by body CSS, unnecessary absolute divs removed for cleaner DOM */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-[480px] w-full relative z-10"
      >
        {/* Branding - Floating Animation */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-accent-secondary to-accent-primary shadow-2xl mb-6 shadow-accent-secondary/20 logo-glow"
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            GUARDIAN <span className="text-accent-secondary">AI</span>
          </h1>
          <p className="text-text-secondary mt-2 text-xs uppercase tracking-[0.25em] font-semibold">
            Institutional Access
          </p>
        </div>

        {/* Login Card - Neon Agent Style */}
        <div className="portal-card">
          <div className="flex p-1 rounded-2xl mb-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${!isSignUp ? 'bg-accent-secondary text-white shadow-lg' : 'text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isSignUp ? 'bg-accent-secondary text-white shadow-lg' : 'text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              Sign Up
            </button>
          </div>

          {!isSignUp && (
            <h2 className="text-xl font-semibold text-text-primary mb-8 text-center tracking-wide">
              Secure Terminal Login
            </h2>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Full Identity</label>
                  <input
                    type="text"
                    required
                    className="neon-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Institution / University</label>
                  <input
                    type="text"
                    required
                    className="neon-input"
                    placeholder="Global Tech University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${role === 'STUDENT'
                      ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary shadow-[0_0_20px_rgba(5,150,105,0.2)]'
                      : 'text-text-secondary border-transparent hover:border-accent-secondary/50'
                      }`}
                    style={{ backgroundColor: role === 'STUDENT' ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-secondary)', borderColor: role === 'STUDENT' ? 'var(--accent-secondary)' : 'var(--border-subtle)' }}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('FACULTY')}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${role === 'FACULTY'
                      ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary shadow-[0_0_20px_rgba(5,150,105,0.2)]'
                      : 'text-text-secondary border-transparent hover:border-accent-secondary/50'
                      }`}
                    style={{ backgroundColor: role === 'FACULTY' ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-secondary)', borderColor: role === 'FACULTY' ? 'var(--accent-secondary)' : 'var(--border-subtle)' }}
                  >
                    Faculty
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Access ID (Email)</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="neon-input pl-10"
                  placeholder="j.doe@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="neon-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-[10px] font-bold uppercase tracking-wider text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="neon-button w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    {isSignUp ? 'Syncing Node...' : 'Initializing Node...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Authenticate'}
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest hover:text-accent-secondary transition-colors"
                >
                  New here? <span className="text-accent-secondary">Create Account</span>
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-accent-secondary/20 flex items-center justify-center gap-2">
            <Building2 size={14} className="text-text-secondary" />
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">
              {university || 'Enter Your Institution'}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-80">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent-secondary" />
            <span>AES-256 Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent-primary" />
            <span>ZKP Verified</span>
          </div>
        </div>
      </motion.div >
    </div >
  );
};

export default Login;
