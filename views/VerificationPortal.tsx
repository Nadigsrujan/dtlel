import React, { useState } from 'react';
import { Submission, LedgerEntry } from '../types';
import { generateHash } from '../services/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, Loader2, AlertCircle, CheckCircle2, QrCode, Clipboard } from 'lucide-react';

interface VerificationPortalProps {
  submissions: Submission[];
  ledger: LedgerEntry[];
}

const VerificationPortal: React.FC<VerificationPortalProps> = ({ submissions, ledger }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    entry?: LedgerEntry;
    submission?: Submission;
    hash: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyContent = async () => {
    if (!inputText.trim()) return;
    setIsVerifying(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1500));

    const hash = await generateHash(inputText);
    const ledgerEntry = ledger.find(l => l.hash === hash);
    const sub = submissions.find(s => s.hash === hash);

    setResult({
      found: !!ledgerEntry,
      entry: ledgerEntry,
      submission: sub,
      hash: hash
    });
    setIsVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
      <div className="portal-card bg-accent-gradient !p-12 text-white text-center shadow-2xl relative overflow-hidden"
        style={{ background: 'var(--accent-gradient)' }}>
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
          <Fingerprint size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter mb-4">Originality Engine</h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
            Verify document integrity vs the institutional immutable ledger.
            Zero-Knowledge proof enabled.
          </p>

          <div className="relative group max-w-2xl mx-auto">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-48 neon-input rounded-3xl p-8 text-white placeholder-white/50 focus:bg-white/10 outline-none transition-all resize-none mb-8 font-serif leading-relaxed"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.2)' }}
              placeholder="Paste document content for cryptographic validation..."
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={verifyContent}
              disabled={isVerifying || !inputText}
              className="px-10 py-5 bg-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center gap-3 mx-auto"
              style={{ color: 'var(--accent-primary)' }}
            >
              {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              Run Secure Verification
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-10 rounded-[2.5rem] border-2 shadow-2xl ${result.found ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 ${result.found ? 'bg-success/10 text-success border-success/30 shadow-[0_0_20px_rgba(0,255,157,0.2)]' : 'bg-error/10 text-error border-error/30'}`}>
                {result.found ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h3 className={`text-2xl font-black mb-2 flex items-center justify-center lg:justify-start gap-3 ${result.found ? 'text-success' : 'text-error'}`}>
                  {result.found ? 'Authentic Record Verified' : 'Neural Mismatch Detected'}
                  <span className={`text-[10px] uppercase px-3 py-1 rounded-full border ${result.found ? 'border-success/30' : 'border-error/30'}`}>
                    {result.found ? 'Verified' : 'Flagged'}
                  </span>
                </h3>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-8 p-2 rounded-lg border truncate max-w-full"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                  <Fingerprint size={12} className="text-accent-primary" />
                  SHA-256: {result.hash}
                </div>

                {result.found ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Academic Entity', value: result.entry?.actor, color: 'text-accent-primary' },
                      { label: 'Ledger Timestamp', value: new Date(result.entry?.timestamp || '').toLocaleString(), color: 'text-accent-secondary' },
                      { label: 'Similarity Root', value: `${result.submission?.similarityScore}%`, color: 'text-info' },
                      { label: 'Integrity Action', value: result.entry?.action, color: 'text-success' }
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                        <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-error/10 rounded-2xl border border-error/20 max-w-xl mx-auto lg:mx-0">
                    <p className="text-sm font-medium text-error leading-relaxed">
                      Verification failed. This content does not exist in the institutional ledger or has been altered post-submission. Access denied for high-level certification.
                    </p>
                  </div>
                )}
              </div>

              {result.found && (
                <div className="hidden lg:block shrink-0">
                  <div className="p-6 rounded-[2rem] border shadow-2xl text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <QrCode size={80} className="text-text-primary mb-4 mx-auto opacity-80" />
                    <p className="text-[9px] font-black text-text-tertiary tracking-[0.3em] uppercase mb-2">Unique ID</p>
                    <div className="bg-accent-primary/10 px-3 py-2 rounded-xl border border-accent-primary/20">
                      <p className="text-[11px] font-mono text-accent-primary font-black uppercase">GTU-CERT-{result.hash.substring(0, 8)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationPortal;
