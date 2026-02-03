import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings2,
    X,
    Palette,
    Link2,
    Save,
    Maximize2,
    GitCompare,
    BarChart3,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

export interface EditorFeatureOptions {
    heatmapEnabled: boolean;
    citationAutoFix: boolean;
    autoSaveEnabled: boolean;
    zenModeEnabled: boolean;
    diffViewerEnabled: boolean;
    writingStatsEnabled: boolean;
}

interface EditorOptionsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    options: EditorFeatureOptions;
    onToggle: (key: keyof EditorFeatureOptions) => void;
}

const featureConfig = [
    {
        key: 'heatmapEnabled' as const,
        icon: Palette,
        label: 'Interactive Heatmap',
        description: 'Visualize semantic analysis with color-coded highlights',
        color: 'text-error'
    },
    {
        key: 'citationAutoFix' as const,
        icon: Link2,
        label: 'Citation Auto-Fixer',
        description: 'Detect URLs and offer APA 7 formatting',
        color: 'text-accent-primary'
    },
    {
        key: 'autoSaveEnabled' as const,
        icon: Save,
        label: 'Auto-Save to Device',
        description: 'Persist drafts to localStorage every 5 seconds',
        color: 'text-success'
    },
    {
        key: 'zenModeEnabled' as const,
        icon: Maximize2,
        label: 'Zen Mode',
        description: 'Enable distraction-free writing toggle',
        color: 'text-accent-secondary'
    },
    {
        key: 'diffViewerEnabled' as const,
        icon: GitCompare,
        label: 'Self-Compare (Diff)',
        description: 'Compare current draft with previous versions',
        color: 'text-warning'
    },
    {
        key: 'writingStatsEnabled' as const,
        icon: BarChart3,
        label: 'Writing Health Stats',
        description: 'Real-time metrics: reading time, passive voice, complexity',
        color: 'text-info'
    }
];

export const EditorOptionsPanel: React.FC<EditorOptionsPanelProps> = ({
    isOpen,
    onClose,
    options,
    onToggle
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg glass rounded-[2.5rem] overflow-hidden border"
                        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                    >
                        {/* Header */}
                        <div className="p-8 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                                    <Settings2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-text-primary">Editor Features</h2>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Toggle neural enhancements</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-white/5 text-text-tertiary hover:text-text-primary transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                            {featureConfig.map((feature, idx) => {
                                const isEnabled = options[feature.key];
                                return (
                                    <motion.div
                                        key={feature.key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onToggle(feature.key)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all group ${isEnabled
                                            ? 'shadow-lg shadow-accent-primary/5'
                                            : 'border-transparent hover:border-accent-primary/30'
                                            }`}
                                        style={{
                                            backgroundColor: isEnabled ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                            borderColor: isEnabled ? 'var(--accent-primary)' : 'var(--border-subtle)'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl transition-all ${isEnabled
                                                    ? `bg-${feature.color.replace('text-', '')}/20 ${feature.color}`
                                                    : 'bg-black/5 dark:bg-white/5 text-text-tertiary'
                                                    }`}>
                                                    <feature.icon size={18} />
                                                </div>
                                                <div>
                                                    <h3 className={`text-sm font-bold transition-colors ${isEnabled ? 'text-text-primary' : 'text-text-secondary'
                                                        }`}>
                                                        {feature.label}
                                                    </h3>
                                                    <p className="text-[10px] text-text-tertiary mt-0.5 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <motion.div
                                                animate={{ scale: isEnabled ? 1.1 : 1 }}
                                                transition={{ type: 'spring', stiffness: 500 }}
                                            >
                                                {isEnabled ? (
                                                    <ToggleRight size={28} className="text-accent-primary" />
                                                ) : (
                                                    <ToggleLeft size={28} className="text-text-tertiary group-hover:text-text-secondary transition-colors" />
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                                    {Object.values(options).filter(Boolean).length} / {featureConfig.length} Features Active
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-xl bg-accent-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
