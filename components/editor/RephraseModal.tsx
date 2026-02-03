import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, RefreshCw, Copy, Replace } from 'lucide-react';
import { paraphraseSentence } from '../../services/aiService';

interface RephraseModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedText: string;
    onApply: (rephrasedText: string) => void;
}

export const RephraseModal: React.FC<RephraseModalProps> = ({ isOpen, onClose, selectedText, onApply }) => {
    const [variations, setVariations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && selectedText) {
            handleRephrase();
        }
    }, [isOpen, selectedText]);

    const handleRephrase = async () => {
        setIsLoading(true);
        setSelectedIndex(null);
        try {
            const results = await paraphraseSentence(selectedText);
            setVariations(results);
        } catch (error) {
            console.error("Rephrase failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    style={{ zIndex: 100000 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-3xl h-[80vh] glass rounded-[3rem] border flex flex-col overflow-hidden shadow-2xl"
                        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                    >
                        {/* Header */}
                        <div className="shrink-0 p-8 border-b flex justify-between items-center bg-accent-gradient z-20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-white/20">
                                    <RefreshCw size={24} className={`text-white ${isLoading ? 'animate-spin' : ''}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Academic Rephraser</h2>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mt-1">
                                        Optimization for Scholarly Standards
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Original Text */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Original Selection</h3>
                                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 italic text-sm text-text-secondary leading-relaxed">
                                    "{selectedText}"
                                </div>
                            </div>

                            {/* Rephrased Options */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Scholarly Variations</h3>
                                    <button
                                        onClick={handleRephrase}
                                        disabled={isLoading}
                                        className="text-[10px] font-black text-accent-primary uppercase tracking-widest hover:underline disabled:opacity-50"
                                    >
                                        Regenerate
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {variations.map((text, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ scale: 1.01 }}
                                                onClick={() => setSelectedIndex(idx)}
                                                className={`p-5 rounded-3xl border cursor-pointer transition-all group relative ${selectedIndex === idx
                                                        ? 'bg-accent-primary/10 border-accent-primary shadow-lg shadow-accent-primary/10'
                                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed text-text-primary pr-8">{text}</p>
                                                <div className={`absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedIndex === idx ? 'bg-accent-primary text-white scale-110' : 'bg-white/5 text-transparent'
                                                    }`}>
                                                    <Check size={14} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="shrink-0 p-6 border-t bg-black/20 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 btn-premium glass text-text-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={selectedIndex === null}
                                onClick={() => selectedIndex !== null && onApply(variations[selectedIndex])}
                                className="flex-[2] btn-premium bg-accent-gradient text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                            >
                                <Replace size={18} /> Apply Rephrasing
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
