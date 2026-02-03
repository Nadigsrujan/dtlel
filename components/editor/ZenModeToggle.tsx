import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ZenModeToggleProps {
    isZen: boolean;
    onToggle: () => void;
}

export const ZenModeToggle: React.FC<ZenModeToggleProps> = ({ isZen, onToggle }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${isZen
                ? 'text-white border-transparent'
                : 'text-text-primary hover:text-accent-primary'
                }`}
            style={{
                backgroundColor: isZen ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)'
            }}
        >
            {isZen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="uppercase tracking-widest">{isZen ? 'Exit Zen' : 'Zen Mode'}</span>

            {isZen && (
                <motion.div
                    layoutId="zen-glow"
                    className="absolute inset-0 rounded-xl animate-glow z-[-1]"
                />
            )}
        </motion.button>
    );
};
