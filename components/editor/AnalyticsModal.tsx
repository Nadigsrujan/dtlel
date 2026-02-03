import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, PieChart, TrendingUp, FileText, ExternalLink, AlertTriangle, Sparkles } from 'lucide-react';
import { SimilarityAnalysis } from '../../types';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysis: SimilarityAnalysis;
    contentHash: string;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, analysis, contentHash }) => {
    // Prepare data for charts
    const segmentDistribution = [
        {
            name: 'High Risk (>70%)',
            count: analysis.segments.filter(s => s.similarity > 0.7).length,
            color: '#EF4444'
        },
        {
            name: 'Medium Risk (30-70%)',
            count: analysis.segments.filter(s => s.similarity > 0.3 && s.similarity <= 0.7).length,
            color: '#F59E0B'
        },
        {
            name: 'Low Risk (<30%)',
            count: analysis.segments.filter(s => s.similarity <= 0.3).length,
            color: '#10B981'
        }
    ];

    const pieData = segmentDistribution.filter(d => d.count > 0).map(d => ({
        name: d.name,
        value: d.count,
        fill: d.color
    }));

    const segmentDetails = analysis.segments.map((seg, idx) => ({
        segment: `Segment ${idx + 1}`,
        similarity: Math.round(seg.similarity * 100)
    }));

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
                        className="w-full max-w-6xl h-[90vh] glass rounded-[3rem] border flex flex-col overflow-hidden shadow-2xl"
                        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                    >
                        {/* Header - Truly Fixed */}
                        <div className="shrink-0 p-8 border-b flex justify-between items-center bg-accent-gradient z-20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-white/20">
                                    <BarChart3 size={28} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Analysis Dashboard</h2>
                                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mt-1">
                                        Comprehensive Integrity Report • Node Verified
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90 duration-300 border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrolling Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth custom-scrollbar">
                            {/* Overall Score Card */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="card-premium text-center">
                                    <div className={`text-5xl font-black mb-2 ${analysis.score > 30 ? 'text-error' : analysis.score > 15 ? 'text-warning' : 'text-success'}`}>
                                        {analysis.score}%
                                    </div>
                                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Similarity Score</p>
                                    <div className={`mt-4 px-4 py-2 rounded-full text-[10px] font-black uppercase inline-block ${analysis.riskLevel === 'High-risk' ? 'bg-error/20 text-error' :
                                        analysis.riskLevel === 'Potential Patchwriting' ? 'bg-warning/20 text-warning' :
                                            'bg-success/20 text-success'
                                        }`}>
                                        {analysis.riskLevel}
                                    </div>
                                </div>

                                <div className="card-premium text-center">
                                    <div className={`text-5xl font-black mb-2 ${analysis.aiScore > 60 ? 'text-error' : analysis.aiScore > 20 ? 'text-warning' : 'text-success'}`}>
                                        {analysis.aiScore}%
                                    </div>
                                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">AI Origin Score</p>
                                    <p className="text-[10px] text-text-secondary mt-4 uppercase font-black">
                                        {analysis.aiScore > 60 ? 'Likely AI Generated' : analysis.aiScore > 20 ? 'Mixed/Edited' : 'Likely Human'}
                                    </p>
                                </div>

                                <div className="card-premium text-center">
                                    <div className="text-5xl font-black mb-2 text-accent-primary flex items-center justify-center min-h-[60px]">
                                        {analysis.segments.length}
                                    </div>
                                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Flagged Segments</p>
                                    <p className="text-xs text-text-secondary mt-4">
                                        Sections requiring review
                                    </p>
                                </div>

                                <div className="card-premium text-center">
                                    <div className="text-5xl font-black mb-2 text-info flex items-center justify-center min-h-[60px]">
                                        {analysis.references?.length || 0}
                                    </div>
                                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Sources Found</p>
                                    <p className="text-xs text-text-secondary mt-4">
                                        Academic references detected
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="card-premium text-center border-l-4 border-error/50">
                                    <div className="text-3xl font-black mb-1 text-error">
                                        {analysis.exact_similarity}%
                                    </div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Exact Match Coverage</p>
                                    <p className="text-[8px] text-text-secondary mt-2">Weight: 1.0</p>
                                </div>

                                <div className="card-premium text-center border-l-4 border-warning/50">
                                    <div className="text-3xl font-black mb-1 text-warning">
                                        {analysis.patchwriting_similarity}%
                                    </div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Patchwriting Coverage</p>
                                    <p className="text-[8px] text-text-secondary mt-2">Weight: 0.6</p>
                                </div>

                                <div className="card-premium text-center border-l-4 border-info/50">
                                    <div className="text-3xl font-black mb-1 text-info">
                                        {analysis.semantic_overlap}%
                                    </div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Semantic Overlap</p>
                                    <p className="text-[8px] text-text-secondary mt-2">Weight: 0.2</p>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="card-premium">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                        <PieChart size={18} className="text-accent-primary" />
                                        Risk Distribution
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                    outerRadius={65}
                                                    innerRadius={45}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    paddingAngle={5}
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'var(--bg-elevated)',
                                                        border: '1px solid var(--border-subtle)',
                                                        borderRadius: '12px'
                                                    }}
                                                />
                                            </RechartsPie>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="card-premium">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                        <BarChart3 size={18} className="text-accent-primary" />
                                        Segment-by-Segment Analysis
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={segmentDetails}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                                <XAxis
                                                    dataKey="segment"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 'bold' }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 'bold' }}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                    contentStyle={{
                                                        background: 'var(--bg-elevated)',
                                                        border: '1px solid var(--border-subtle)',
                                                        borderRadius: '12px'
                                                    }}
                                                />
                                                <Bar dataKey="similarity" radius={[4, 4, 0, 0]}>
                                                    {segmentDetails.map((entry, index) => (
                                                        <Cell
                                                            key={`bar-${index}`}
                                                            fill={entry.similarity > 70 ? '#EF4444' : entry.similarity > 30 ? '#F59E0B' : '#10B981'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary */}
                            <div className="card-premium bg-accent-gradient text-white">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={18} />
                                    Academic Originality Assessment
                                </h3>
                                <p className="text-sm leading-relaxed italic opacity-90">
                                    "{analysis.summary}"
                                </p>
                            </div>

                            {/* Constructive Suggestions */}
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <div className="card-premium border-accent-secondary/20">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                        <Sparkles size={18} className="text-accent-secondary" />
                                        Constructive Suggestions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.suggestions.map((suggestion, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                                                <div className="w-6 h-6 rounded-full bg-accent-secondary/10 flex items-center justify-center shrink-0 text-accent-secondary text-[10px] font-black">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                                    {suggestion}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* References Found */}
                            {analysis.references && analysis.references.length > 0 && (
                                <div className="card-premium">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-accent-secondary" />
                                        Academic Sources Detected
                                    </h3>
                                    <div className="space-y-3">
                                        {analysis.references.map((ref, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-xl border transition-all group"
                                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                                                            {ref.title}
                                                        </p>
                                                        <a
                                                            href={ref.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-accent-primary hover:underline flex items-center gap-1 mt-2"
                                                        >
                                                            <ExternalLink size={12} />
                                                            {ref.url}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Segments */}
                            <div className="card-premium">
                                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-warning" />
                                    Flagged Segments Details
                                </h3>
                                <div className="space-y-3">
                                    {analysis.segments.map((seg, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border ${seg.similarity > 0.7 ? 'bg-error/10 border-error/30' :
                                                seg.similarity > 0.3 ? 'bg-warning/10 border-warning/30' :
                                                    'bg-success/10 border-success/30'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <span className="text-xs font-black uppercase tracking-wider text-text-tertiary">
                                                    Segment {idx + 1}
                                                </span>
                                                <span className={`text-xs font-black ${seg.similarity > 0.7 ? 'text-error' :
                                                    seg.similarity > 0.3 ? 'text-warning' :
                                                        'text-success'
                                                    }`}>
                                                    {Math.round(seg.similarity * 100)}% Match
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-primary font-serif italic mb-3 p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                "{seg.text}"
                                            </p>
                                            <p className="text-xs text-text-secondary">
                                                <strong>Explanation:</strong> {seg.explanation}
                                            </p>
                                            {seg.source && (
                                                <p className="text-xs text-accent-primary mt-2">
                                                    <strong>Source:</strong> {seg.source}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Hash */}
                            <div className="card-premium border-accent-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <h3 className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-3">
                                    Cryptographic Verification Hash
                                </h3>
                                <p className="text-xs font-mono text-accent-primary break-all">
                                    {contentHash}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
