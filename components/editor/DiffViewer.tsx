import React, { useState } from 'react';
import * as diff from 'diff';
import { motion } from 'framer-motion';
import { History, X, Check } from 'lucide-react';

interface DiffViewerProps {
    currentContent: string;
    onClose: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ currentContent, onClose }) => {
    const [oldContent, setOldContent] = useState('');
    const [showDiff, setShowDiff] = useState(false);

    const diffResult = React.useMemo(() => {
        if (!showDiff) return [];
        return diff.diffWords(oldContent, currentContent);
    }, [oldContent, currentContent, showDiff]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
        >
            <div className="glass w-full max-w-4xl h-[80vh] flex flex-col rounded-3xl overflow-hidden border" style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}>
                <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center text-accent-primary">
                            <History size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Draft Comparison</h2>
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Compare your changes across versions</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {!showDiff ? (
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Paste Old Draft Version</label>
                            <textarea
                                className="w-full h-64 p-6 rounded-2xl border outline-none font-serif text-sm leading-relaxed"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                                placeholder="Paste the version you want to compare against..."
                                value={oldContent}
                                onChange={(e) => setOldContent(e.target.value)}
                            />
                            <button
                                onClick={() => setShowDiff(true)}
                                disabled={!oldContent.trim()}
                                className="btn-premium btn-primary w-fit self-end flex items-center gap-2"
                            >
                                Compare Versions <Check size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                                <span className="flex items-center gap-1.5 text-error"><span className="w-2 h-2 rounded-full bg-error" /> Removed</span>
                                <span className="flex items-center gap-1.5 text-success"><span className="w-2 h-2 rounded-full bg-success" /> Added</span>
                            </div>
                            <div className="font-serif text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {diffResult.map((part, idx) => (
                                    <span key={idx} className={
                                        part.added ? "bg-success/20 text-success font-bold decoration-success/30 px-0.5" :
                                            part.removed ? "bg-error/20 text-error line-through decoration-error/30 px-0.5" :
                                                ""
                                    }>
                                        {part.value}
                                    </span>
                                ))}
                            </div>
                            <div className="pt-8 flex justify-end">
                                <button onClick={() => setShowDiff(false)} className="text-xs font-bold text-accent-primary hover:underline">
                                    Back to Selection
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
