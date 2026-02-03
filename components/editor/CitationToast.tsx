import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Sparkles, X } from 'lucide-react';

interface CitationToastProps {
    lastPastedUrl: string | null;
    onFormat: (url: string) => void;
    onDismiss: () => void;
}

export const CitationToast: React.FC<CitationToastProps> = ({ lastPastedUrl, onFormat, onDismiss }) => {
    return (
        <AnimatePresence>
            {lastPastedUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                    className="fixed bottom-16 right-8 z-[100] w-80 glass p-4 rounded-2xl shadow-2xl border flex flex-col gap-3"
                    style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center text-accent-primary">
                                <Link size={16} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>URL Detected</h4>
                                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Format as academic citation?</p>
                            </div>
                        </div>
                        <button onClick={onDismiss} className="text-text-tertiary hover:text-text-primary transition-colors">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="p-2 rounded-lg border font-mono text-[10px] truncate" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        {lastPastedUrl}
                    </div>

                    <button
                        onClick={() => onFormat(lastPastedUrl)}
                        className="w-full bg-accent-gradient py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        <Sparkles size={14} /> Format as APA 7
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
