import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, Zap, Target, BookOpen } from 'lucide-react';

interface WritingCoachModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: string;
}

export const WritingCoachModal: React.FC<WritingCoachModalProps> = ({ isOpen, onClose, suggestions }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    style={{ zIndex: 99999 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl h-[85vh] glass rounded-[3rem] border flex flex-col overflow-hidden shadow-2xl"
                        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                    >
                        {/* Header - Truly Fixed */}
                        <div className="shrink-0 p-8 border-b flex justify-between items-center bg-accent-gradient z-20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-white/20">
                                    <Sparkles size={28} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Neural Writing Coach</h2>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mt-1">
                                        AI-Powered Stylistic & Academic Enhancement
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90 duration-300 border border-white/10 outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrolling Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth custom-scrollbar">
                            {/* Feature Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/10 flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-accent-primary/20 text-accent-primary">
                                        <Target size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-wider mb-1">Precision Analysis</h4>
                                        <p className="text-[10px] text-text-tertiary">Real-time tone and structure optimization detected by neural networks.</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-accent-secondary/5 border border-accent-secondary/10 flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-accent-secondary/20 text-accent-secondary">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-wider mb-1">Academic Rigor</h4>
                                        <p className="text-[10px] text-text-tertiary">Suggestions tailored for high-impact scholarly communication.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions Area */}
                            <div className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent-gradient rounded-full opacity-50" />
                                <div className="pl-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                        <MessageSquare size={18} className="text-accent-primary" />
                                        Neural Feedback
                                    </h3>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-base leading-relaxed text-text-secondary whitespace-pre-wrap font-medium p-6 rounded-[2rem] border italic" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                                            {suggestions || "No specific suggestions generated for this draft yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Tip */}
                            <div className="p-6 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                                <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center shrink-0">
                                    <Zap size={20} className="text-white" />
                                </div>
                                <p className="text-xs text-text-tertiary italic">
                                    <strong>Pro Tip:</strong> Hover over the highlighted segments in the editor to see specific contextual improvements for identified risk areas.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
