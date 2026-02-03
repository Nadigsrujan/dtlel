import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

interface Segment {
    text: string;
    similarity: number;
    source?: string;
    explanation?: string;
}

interface HeatmapOverlayProps {
    content: string;
    segments: Segment[];
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ content, segments }) => {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const renderedContent = React.useMemo(() => {
        if (!segments.length) return content;

        const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();
        const normalizedContent = normalize(content);

        let lastIndex = 0;
        const elements: React.ReactNode[] = [];
        const sortedSegments = [...segments].sort((a, b) => {
            const posA = content.indexOf(a.text);
            const posB = content.indexOf(b.text);
            return posA - posB;
        });

        let elementCounter = 0;

        sortedSegments.forEach((seg, idx) => {
            // First try exact match
            let startIdx = content.indexOf(seg.text, lastIndex);

            // If exact match fails, try normalized match
            if (startIdx === -1) {
                const normSeg = normalize(seg.text);
                const normContent = normalize(content.substring(lastIndex));
                const matchPos = normContent.indexOf(normSeg);

                if (matchPos !== -1) {
                    // This is a rough way to map back normalized position to original position
                    // In a production app, we'd use a more sophisticated diffing algorithm
                    // For now, we'll try to find any part of the segment text
                    const firstWord = seg.text.split(' ')[0];
                    startIdx = content.indexOf(firstWord, lastIndex);
                }
            }

            if (startIdx !== -1) {
                // Non-highlighted text
                const beforeText = content.substring(lastIndex, startIdx);
                if (beforeText) {
                    elements.push(<span key={`text-before-${elementCounter++}`}>{beforeText}</span>);
                }

                // Color Logic
                let highlightClass = "";
                let statusColor = "var(--accent-primary)";

                if (seg.similarity > 0.7) {
                    highlightClass = "bg-red-500/20 border-red-500/50 text-error font-medium";
                    statusColor = "var(--error)";
                } else if (seg.similarity > 0.3) {
                    highlightClass = "bg-amber-500/20 border-amber-500/50 text-warning font-medium";
                    statusColor = "var(--warning)";
                } else {
                    highlightClass = "bg-green-500/20 border-green-500/50 text-success font-medium";
                    statusColor = "var(--success)";
                }

                elements.push(
                    <Popover.Root key={`popover-segment-${elementCounter++}`}>
                        <Popover.Trigger asChild>
                            <motion.span
                                whileHover={{ scale: 1.01, backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)' }}
                                className={`relative cursor-pointer px-0.5 rounded-md transition-all border-b-2 inline ${highlightClass}`}
                                onClick={() => setActiveIdx(idx)}
                            >
                                {seg.text}
                            </motion.span>
                        </Popover.Trigger>

                        <Popover.Portal>
                            <Popover.Content
                                className="z-[100] w-72 rounded-xl glass p-5 shadow-2xl animate-fade-in-up border"
                                style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                                sideOffset={5}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                                            Integrity Insight
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}></div>
                                            <span className="text-[10px] font-bold" style={{ color: statusColor }}>
                                                {Math.round(seg.similarity * 100)}% Match
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                                            {seg.explanation || "System detected significant semantic intersection with external academic repositories."}
                                        </h4>
                                        {seg.source && (
                                            <div className="flex items-center gap-2 p-2 rounded-lg border font-mono text-[9px] group cursor-pointer hover:border-accent-primary/50 transition-colors"
                                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                                                <ExternalLink size={10} className="text-accent-primary" />
                                                <span className="truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{seg.source}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                                        <button className="text-[10px] font-bold text-accent-primary hover:underline flex items-center gap-1">
                                            Rephrase with AI <Zap size={10} />
                                        </button>
                                    </div>
                                </div>
                                <Popover.Arrow className="fill-current" style={{ color: 'var(--bg-elevated)' }} />
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                );
                lastIndex = startIdx + seg.text.length;
            }
        });

        const remainingText = content.substring(lastIndex);
        if (remainingText) {
            elements.push(<span key={`text-remaining-${elementCounter++}`}>{remainingText}</span>);
        }
        return elements;
    }, [content, segments]);

    return (
        <div className="relative leading-relaxed whitespace-pre-wrap">
            {renderedContent}
        </div>
    );
};

const Zap = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
