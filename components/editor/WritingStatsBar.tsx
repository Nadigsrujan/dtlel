import React, { useState, useEffect, useMemo } from 'react';
import { Clock, AlertTriangle, MessageSquare, Zap } from 'lucide-react';

interface WritingStatsBarProps {
    content: string;
}

export const WritingStatsBar: React.FC<WritingStatsBarProps> = ({ content }) => {
    const [stats, setStats] = useState({
        readingTime: 0,
        passiveVoiceCount: 0,
        longSentenceCount: 0,
        wordCount: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const words = content.trim() ? content.trim().split(/\s+/).length : 0;
            const readingTime = Math.ceil(words / 200);

            // Passive Voice Detection
            const passiveVoiceMatches = content.match(/\b(am|are|is|was|were|been|being)\b\s+\w+ed\b/ig) || [];

            // Sentence Length Check (> 25 words)
            const sentences = content.split(/[.?!]/).filter(s => s.trim().length > 0);
            const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 25);

            setStats({
                wordCount: words,
                readingTime,
                passiveVoiceCount: passiveVoiceMatches.length,
                longSentenceCount: longSentences.length
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [content]);

    return (
        <div className="sticky bottom-0 z-50 border-t animate-fade-in-up w-full px-8 py-3 mt-8 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(12px)' }}>
            <div className="w-full h-full flex items-center justify-between text-[11px] font-medium tracking-tight overflow-x-auto gap-8">
                <div className="flex items-center gap-6 whitespace-nowrap">
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <Clock size={14} className="text-accent-primary" />
                        <span>{stats.readingTime} MIN READ</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <MessageSquare size={14} className="text-accent-primary" />
                        <span>{stats.wordCount} WORDS</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 whitespace-nowrap">
                    <div className={`flex items-center gap-2 transition-colors ${stats.passiveVoiceCount > 5 ? 'text-error' : 'text-text-secondary'}`}
                        title="Excessive passive voice can weaken academic writing">
                        <Zap size={14} className={stats.passiveVoiceCount > 5 ? 'text-error animate-pulse' : 'text-warning'} />
                        <span className="uppercase">Passive Voice: {stats.passiveVoiceCount}</span>
                    </div>

                    <div className={`flex items-center gap-2 transition-colors ${stats.longSentenceCount > 2 ? 'text-error' : 'text-text-secondary'}`}
                        title="Sentences over 25 words may be harder to follow">
                        <AlertTriangle size={14} className={stats.longSentenceCount > 2 ? 'text-error animate-pulse' : 'text-warning'} />
                        <span className="uppercase">Complex Sentences: {stats.longSentenceCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
