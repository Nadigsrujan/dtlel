import React, { useState } from 'react';
import { User, Submission, AccessLog, DeletionRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Database, Shield, Lock, Trash2, Cpu, ArrowUpRight, CheckCircle2, AlertTriangle, Gavel } from 'lucide-react';

interface ControlPanelProps {
  user: User;
  submissions: Submission[];
  accessLogs: AccessLog[];
  onDeleteRequest: (id: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ user, submissions, accessLogs, onDeleteRequest }) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'DATA' | 'POLICIES'>('LOGS');
  const [pendingRequests, setPendingRequests] = useState<DeletionRequest[]>([]);

  const handleDeletionSubmit = (subId: string, title: string) => {
    if (window.confirm(`Formalize Deletion Request for "${title}"? This request will be audited via the Blockchain Ledger.`)) {
      const newRequest: DeletionRequest = {
        id: `dr-${Date.now()}`,
        submissionId: subId,
        status: 'PENDING',
        requestDate: new Date().toISOString()
      };
      setPendingRequests([newRequest, ...pendingRequests]);
    }
  };

  const tabs = [
    { id: 'LOGS', icon: Eye, label: 'Access Logs' },
    { id: 'DATA', icon: Database, label: 'Manage Data' },
    { id: 'POLICIES', icon: Shield, label: 'Privacy Charter' }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div className="flex flex-wrap gap-4 mb-10 p-2 rounded-[2rem] border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[150px] py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${activeTab === tab.id
              ? 'text-white'
              : 'text-text-tertiary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 bg-accent-gradient shadow-xl shadow-accent-primary/20"
              />
            )}
            <tab.icon size={16} className="relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'LOGS' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="portal-card !p-0 overflow-hidden"
          >
            <div className="p-10 border-b flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="text-xl font-black text-text-primary tracking-tight">Transparency Ledger</h3>
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mt-2">Historical visibility into neural access vectors.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                <span className="text-[10px] font-black text-success uppercase tracking-widest">Live Audit Active</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-text-tertiary uppercase text-[9px] font-black tracking-[0.2em] border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <tr>
                    <th className="px-10 py-6">Timeline</th>
                    <th className="px-10 py-6">Neural Entity</th>
                    <th className="px-10 py-6">Authorization Purpose</th>
                    <th className="px-10 py-6">Vector Root</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                  {accessLogs.map(log => (
                    <tr key={log.id} className="hover:bg-accent-primary/[0.02] transition-colors group">
                      <td className="px-10 py-6 text-text-tertiary font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-10 py-6 font-bold text-text-primary">
                        <div className="flex items-center gap-3">
                          <Cpu size={14} className="text-accent-primary" />
                          {log.entity}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-text-secondary font-medium font-serif italic">"{log.purpose}"</td>
                      <td className="px-10 py-6">
                        <span className="text-accent-secondary font-mono bg-accent-secondary/5 px-2 py-1 rounded border border-accent-secondary/10">
                          {log.resourceId}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'DATA' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="card-premium glass p-10">
              <h3 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-4">
                <Lock size={24} className="text-accent-primary" />
                Institutional Rights Manager
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4">Active Neural Indices</h4>
                  {submissions.length > 0 ? (
                    <div className="space-y-3">
                      {submissions.map(sub => {
                        const isPending = pendingRequests.some(pr => pr.submissionId === sub.id);
                        return (
                          <div key={sub.id} className="flex items-center justify-between p-5 border rounded-2xl group hover:border-accent-primary/30 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-accent-primary/10 text-accent-primary rounded-xl border border-accent-primary/20 transition-all group-hover:bg-accent-primary group-hover:text-white">
                                <Database size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-text-primary leading-none mb-2">{sub.title}</p>
                                <p className="text-[9px] text-text-tertiary font-mono uppercase">Fingerprint: {sub.hash.substring(0, 16)}...</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeletionSubmit(sub.id, sub.title)}
                              disabled={isPending}
                              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${isPending
                                ? 'bg-warning/10 text-warning border-warning/20 opacity-50'
                                : 'text-error border-error/20 bg-error/5 hover:bg-error hover:text-white shadow-lg shadow-error/10'}`}
                            >
                              {isPending ? 'Pending Audit' : 'Purge Vector'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-dashed rounded-3xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                      <Database size={40} className="mx-auto mb-4 text-text-tertiary opacity-30" />
                      <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">No vectors detected.</p>
                    </div>
                  )}
                </div>

                <div className="p-8 rounded-[2rem] border h-fit" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Gavel size={14} className="text-accent-secondary" />
                    Governance Pipeline
                  </h4>
                  <div className="space-y-4">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="p-5 rounded-2xl border flex justify-between items-center group" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                        <div>
                          <p className="text-[10px] font-black text-accent-secondary uppercase tracking-[0.2em]">Ticket: {req.id.split('-')[1]}</p>
                          <p className="text-[9px] text-text-tertiary font-bold mt-1 uppercase">Filed: {new Date(req.requestDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-warning/5 px-3 py-1.5 rounded-full border border-warning/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
                          <span className="text-[9px] font-black text-warning uppercase tracking-widest">{req.status}</span>
                        </div>
                      </div>
                    ))}
                    {pendingRequests.length === 0 && (
                      <div className="text-center py-10 opacity-30">
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Queue Clear</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <Trash2 size={160} style={{ color: 'var(--error)' }} />
              </div>
              <div className="relative z-10 max-w-2xl">
                <h3 className="font-black text-4xl tracking-tighter mb-6" style={{ color: 'var(--error)' }}>Total Erasure Protocol</h3>
                <p className="text-sm mb-10 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Initiate a complete severance protocol. This permanently disconnects your identity from all institutional metadata hashes and purges your neural footprint from the local node.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-error text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] hover:bg-opacity-90 transition-all shadow-2xl shadow-error/20"
                >
                  Initiate Global Purge
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'POLICIES' && (
          <motion.div
            key="policies"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="card-premium glass p-12 rounded-[3rem]"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-accent-gradient rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-accent-primary/20">
                <Gavel size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-text-primary tracking-tighter">Privacy Sovereignty Charter</h3>
                <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mt-2">Engineered transparency & ethical AI custodianship.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: 'Zero-Knowledge Storage', icon: Lock, desc: 'Your content is never stored on persistent cloud. We store a unique SHA-256 fingerprint, enabling proof of ownership without possession of words.' },
                { title: 'On-Premise Resilience', icon: Cpu, desc: 'AI inference and ledger synchronization occur strictly on institutional hardware nodes. No data leakage to third-party model providers.' },
                { title: 'Explainable Integrity AI', icon: ArrowUpRight, desc: 'Rejecting black-box logic. Our systems provide textual justifications for flags, promoting growth over punitive automated scoring.' },
                { title: 'Immutable Custodianship', icon: CheckCircle2, desc: 'You own your intellectual property. We function as a custodian of verification. Consent can be withdrawn at any lifecycle stage.' }
              ].map((policy, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="flex items-center gap-3">
                    <policy.icon size={18} className="text-accent-primary group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-text-primary text-[11px] uppercase tracking-widest">{policy.title}</h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed font-medium">{policy.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ControlPanel;
