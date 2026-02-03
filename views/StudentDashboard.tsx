import React from 'react';
import { Submission } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, TrendingUp, Zap, ArrowUpRight, Clock, Shield } from 'lucide-react';

interface StudentDashboardProps {
  submissions: Submission[];
  onViewDrafts: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ submissions, onViewDrafts }) => {
  const chartData = submissions.slice(0, 5).reverse().map(s => ({
    name: s.title.substring(0, 8),
    score: s.similarityScore
  }));

  const avgScore = submissions.length
    ? (submissions.reduce((a, b) => a + b.similarityScore, 0) / submissions.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="portal-card border-accent-primary/20"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              <FileText size={20} />
            </div>
            <span className="text-[10px] font-black uppercase text-success tracking-widest flex items-center gap-1">
              <TrendingUp size={12} /> +24%
            </span>
          </div>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Total Submissions</p>
          <h3 className="text-4xl font-black text-text-primary mt-1">{submissions.length}</h3>
          <p className="text-[9px] text-text-tertiary mt-2">Active academic datasets</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="portal-card border-accent-secondary/20"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
              <Shield size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Avg. Integrity Score</p>
          <h3 className="text-4xl font-black text-text-primary mt-1">{avgScore}%</h3>
          <p className="text-[9px] text-text-tertiary mt-2">Cross-institutional parity</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card-premium bg-accent-gradient relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-500">
            <Zap size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Neural Draft Access</p>
            <h3 className="text-4xl font-black text-white mt-1">UNLIMITED</h3>
            <button
              onClick={onViewDrafts}
              className="mt-6 w-full glass py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              Start New Analysis <ArrowUpRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart View */}
        <div className="portal-card">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Integrity Progress</h3>
              <p className="text-[10px] text-text-tertiary mt-1">Cross-version semantic analysis</p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-primary" />
              <div className="w-2 h-2 rounded-full bg-accent-primary/20" />
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--accent-primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="portal-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Neural Ledger</h3>
            <button className="text-[10px] font-black uppercase text-accent-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((sub) => (
              <motion.div
                key={sub.id}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 rounded-2xl border transition-all group cursor-pointer"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${sub.similarityScore < 20
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-error/10 text-error border-error/20'
                    }`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary group-hover:text-accent-primary transition-colors">{sub.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
                        <Clock size={10} /> {new Date(sub.timestamp).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10" />
                      <span className="text-[9px] font-bold text-accent-secondary uppercase tracking-widest">V{sub.version}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${sub.similarityScore > 30 ? 'text-error' : 'text-success'}`}>
                    {sub.similarityScore}%
                  </div>
                  <p className="text-[8px] font-black text-text-tertiary uppercase tracking-tighter">Similarity</p>
                </div>
              </motion.div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary grayscale opacity-30"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <FileText size={32} />
                </div>
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Secure Node Empty</p>
                <p className="text-xs text-text-tertiary mt-1 opacity-50 italic">No academic data detected on device.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
