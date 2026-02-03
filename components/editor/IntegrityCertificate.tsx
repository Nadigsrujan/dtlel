import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { Award, Download, X, Shield, CheckCircle2, Loader2, Link2, Fingerprint } from 'lucide-react';

interface IntegrityCertificateProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    score: number;
    aiScore: number;
    hash: string;
}

export const IntegrityCertificate: React.FC<IntegrityCertificateProps> = ({
    isOpen,
    onClose,
    title,
    content,
    score,
    aiScore,
    hash
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [animatedHash, setAnimatedHash] = useState(hash);

    const timestamp = Date.now();
    const qrData = JSON.stringify({ hash, timestamp, title });
    
    // Certificate eligibility: BOTH plagiarism score AND AI score must be below 20%
    const isEligible = score < 20 && aiScore < 20;

    // Hash scramble animation effect
    useEffect(() => {
        if (!isOpen) return;
        const chars = '0123456789abcdef';
        let iterations = 0;
        const maxIterations = 20;

        const interval = setInterval(() => {
            setAnimatedHash(prev =>
                prev.split('').map((char, i) => {
                    if (iterations > i) return hash[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(interval);
                setAnimatedHash(hash);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [isOpen, hash]);

    const generatePDF = async () => {
        setIsGenerating(true);

        // Simulate processing delay for UX
        await new Promise(r => setTimeout(r, 1500));

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Background
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Watermark
        doc.setFontSize(60);
        doc.setTextColor(230, 230, 230);
        doc.text('VERIFIED', pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45
        });

        // Header Bar
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Header Text
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('GUARDIAN AI', pageWidth / 2, 18, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Certificate of Academic Integrity', pageWidth / 2, 28, { align: 'center' });

        // Reset text color
        doc.setTextColor(30, 41, 59);

        // Certificate Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Proof of Originality', pageWidth / 2, 60, { align: 'center' });

        // Document Info Section
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');

        const infoY = 80;
        doc.text('DOCUMENT TITLE', 20, infoY);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(title || 'Untitled Document', 20, infoY + 8);

        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('VERIFICATION DATE', 20, infoY + 25);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(new Date(timestamp).toLocaleString(), 20, infoY + 33);

        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('SIMILARITY SCORE', pageWidth - 100, infoY);
        doc.setFontSize(22);
        doc.setTextColor(16, 185, 129);
        doc.setFont('helvetica', 'bold');
        doc.text(`${score}%`, pageWidth - 100, infoY + 10);

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('AI ORIGIN SCORE', pageWidth - 55, infoY);
        doc.setFontSize(22);
        doc.setTextColor(score > 30 || aiScore > 30 ? 245 : 16, score > 30 || aiScore > 30 ? 158 : 185, score > 30 || aiScore > 30 ? 11 : 129);
        doc.text(`${aiScore}%`, pageWidth - 55, infoY + 10);

        // Digital Fingerprint Section
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(20, 130, pageWidth - 40, 30, 3, 3, 'F');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('SHA-256 DIGITAL FINGERPRINT', 25, 140);
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.setFont('courier', 'normal');
        doc.text(hash, 25, 150);

        // QR Code placeholder note
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Verification QR Code', pageWidth / 2, 180, { align: 'center' });

        // QR Code box
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.rect(pageWidth / 2 - 30, 185, 60, 60);

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text('Scan to verify authenticity', pageWidth / 2, 255, { align: 'center' });

        // Footer
        doc.setFillColor(30, 41, 59);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('This certificate was generated by Guardian AI - Institutional Blockchain Verification System', pageWidth / 2, pageHeight - 10, { align: 'center' });

        // Save
        doc.save(`integrity-certificate-${timestamp}.pdf`);
        setIsGenerating(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-xl glass rounded-[3rem] overflow-hidden border relative"
                        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}
                    >
                        {/* Blockchain Animation Background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={`blockchain-block-${i}`}
                                    className="absolute w-4 h-4 rounded border border-accent-primary"
                                    style={{
                                        left: `${15 + i * 15}%`,
                                        top: '50%',
                                    }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.8, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.3,
                                        repeat: Infinity,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Header */}
                        <div className="relative bg-accent-gradient p-10 text-center">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="inline-flex p-4 bg-white/20 rounded-[1.5rem] mb-4 relative"
                            >
                                <Award size={40} className="text-white" />
                                <motion.div
                                    className="absolute inset-0 rounded-[1.5rem] border-2 border-white/50"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                            <h2 className="text-3xl font-black tracking-tighter text-white">Proof of Originality</h2>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.3em] mt-2">Institutional Ledger Verification</p>
                        </div>

                        {/* Body */}
                        <div className="p-10 space-y-8">
                            {/* Score Display */}
                            <div className="flex items-center justify-between p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center gap-4">
                                    {isEligible ? (
                                        <div className="p-3 rounded-xl bg-success/20 text-success border border-success/30">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-xl bg-warning/20 text-warning border border-warning/30">
                                            <Shield size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Integrity Status</p>
                                        <p className={`text-lg font-black ${isEligible ? 'text-success' : 'text-warning'}`}>
                                            {isEligible ? 'Verified Original' : (score >= 20 && aiScore >= 20) ? 'Dual Review Required' : score >= 20 ? 'Plagiarism Review' : 'AI Content Review'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div>
                                        <p className={`text-4xl font-black ${score < 20 ? 'text-success' : 'text-warning'}`}>{score}%</p>
                                        <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-tighter">Similarity</p>
                                    </div>
                                    <div className="border-l pl-6" style={{ borderColor: 'var(--border-subtle)' }}>
                                        <p className={`text-4xl font-black ${aiScore < 20 ? 'text-success' : 'text-warning'}`}>{aiScore}%</p>
                                        <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-tighter">AI Origin</p>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Fingerprint */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                    <Fingerprint size={12} className="text-accent-primary" />
                                    SHA-256 Digital Fingerprint
                                </div>
                                <div className="p-4 rounded-xl border font-mono text-[10px] text-accent-primary break-all leading-relaxed" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)' }}>
                                    {animatedHash}
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-4 py-6">
                                <div className="p-4 bg-white rounded-2xl shadow-xl">
                                    <QRCodeSVG
                                        value={qrData}
                                        size={120}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                                    <Link2 size={12} className="text-accent-secondary" />
                                    Scan to verify on-chain
                                </div>
                            </div>

                            {/* Download Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generatePDF}
                                disabled={!isEligible || isGenerating}
                                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isEligible
                                    ? 'bg-accent-gradient text-white shadow-xl shadow-accent-primary/20 hover:shadow-2xl'
                                    : 'text-text-tertiary cursor-not-allowed border'
                                    }`}
                                style={{ backgroundColor: isEligible ? '' : 'var(--bg-secondary)', borderColor: isEligible ? '' : 'var(--border-subtle)' }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Generating Certificate...
                                    </>
                                ) : isEligible ? (
                                    <>
                                        <Download size={18} />
                                        Download PDF Certificate
                                    </>
                                ) : (
                                    <>
                                        <Shield size={18} />
                                        Both scores must be below 20% to download
                                    </>
                                )}
                            </motion.button>

                            {!isEligible && (
                                <p className="text-center text-[10px] text-text-tertiary italic">
                                    {score >= 20 && aiScore >= 20 
                                        ? 'Both similarity score and AI origin score must be below 20% to receive a certificate.'
                                        : score >= 20 
                                            ? `Similarity score (${score}%) must be below 20% to receive a certificate.`
                                            : `AI origin score (${aiScore}%) must be below 20% to receive a certificate.`
                                    }
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
};
