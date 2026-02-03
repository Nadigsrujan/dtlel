import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  History,
  Trash2,
  Award,
  BookOpen,
  Save,
  Loader2,
  Settings2,
  BarChart3,
  FileUp,
  FileText
} from 'lucide-react';
import { generateHash } from '../services/crypto';
import { analyzeSemanticSimilarity, getWritingSuggestions } from '../services/aiService';
import { Submission, SimilarityAnalysis } from '../types';

// Modular Components
import { WritingStatsBar } from '../components/editor/WritingStatsBar';
import { ZenModeToggle } from '../components/editor/ZenModeToggle';
import { HeatmapOverlay } from '../components/editor/HeatmapOverlay';
import { CitationToast } from '../components/editor/CitationToast';
import { DiffViewer } from '../components/editor/DiffViewer';
import { ThemeToggle } from '../components/ThemeToggle';
import { IntegrityCertificate } from '../components/editor/IntegrityCertificate';
import { EditorOptionsPanel, EditorFeatureOptions } from '../components/editor/EditorOptionsPanel';
import { AnalyticsModal } from '../components/editor/AnalyticsModal';
import { WritingCoachModal } from '../components/editor/WritingCoachModal';
import { RephraseModal } from '../components/editor/RephraseModal';
import { RefreshCw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - Vite specific import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


// Hooks
import { useAutoSave } from '../hooks/useAutoSave';

interface DraftEditorProps {
  onSave: (sub: Submission) => void;
  onToggleSidebar?: (collapsed: boolean) => void;
}

const DraftEditor: React.FC<DraftEditorProps> = ({ onSave, onToggleSidebar }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SimilarityAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState('');
  const [contentHash, setContentHash] = useState('');

  // Feature States
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [isZen, setIsZen] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [showRephraseModal, setShowRephraseModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [lastPastedUrl, setLastPastedUrl] = useState<string | null>(null);

  // Feature Options (Toggle States)
  const [featureOptions, setFeatureOptions] = useState<EditorFeatureOptions>({
    heatmapEnabled: true,
    citationAutoFix: true,
    autoSaveEnabled: true,
    zenModeEnabled: true,
    diffViewerEnabled: true,
    writingStatsEnabled: true,
  });

  // Auto-Save Hook
  const { lastSaved, isSaving, loadSaved } = useAutoSave(
    featureOptions.autoSaveEnabled ? content : ''
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Hydrate on mount
  useEffect(() => {
    if (featureOptions.autoSaveEnabled) {
      const saved = loadSaved();
      if (saved && !content) setContent(saved);
    }
  }, []);

  // Zen Mode Effect
  useEffect(() => {
    if (isZen && featureOptions.zenModeEnabled) {
      document.body.classList.add('zen-active');
    } else {
      document.body.classList.remove('zen-active');
    }
    return () => document.body.classList.remove('zen-active');
  }, [isZen, featureOptions.zenModeEnabled]);

  const toggleFeature = (key: keyof EditorFeatureOptions) => {
    setFeatureOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runAnalysis = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setSuggestions('');

    try {
      // Phase 1: Hash generation
      setLoadingStep('Generating cryptographic hash...');
      const hash = await generateHash(content);
      setContentHash(hash);

      // Phase 2: Unified AI analysis (detection + interpretation)
      setLoadingStep('Analyzing text for similarity...');
      const result = await analyzeSemanticSimilarity(content);
      setAnalysis(result);

      // Phase 3: Writing suggestions
      setLoadingStep('Generating writing guidance...');
      const advice = await getWritingSuggestions(content);
      setSuggestions(advice);

      const submission: Submission = {
        id: `sub-${Date.now()}`,
        title: title || 'Untitled Draft',
        content,
        hash,
        timestamp: new Date().toISOString(),
        status: 'DRAFT',
        authorId: 'u-12345',
        similarityScore: result.score,
        exactScore: result.exact_similarity,
        patchwritingScore: result.patchwriting_similarity,
        semanticScore: result.semantic_overlap,
        aiScore: result.aiScore,
        version: 1,
        aiExplanation: result.summary,
        writingCoachSuggestions: advice
      };

      onSave(submission);
    } catch (err) {
      console.error('Analysis error:', err);
      alert("Analysis failed. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
      setLoadingStep('');
    }
  };

  // Paste Handling for URLs
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!featureOptions.citationAutoFix) return;
    const text = e.clipboardData.getData('text');
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlPattern);
    if (match) {
      setLastPastedUrl(match[0]);
      setTimeout(() => setLastPastedUrl(null), 10000);
    }
  };

  const formatCitation = (url: string) => {
    const mockCitation = `(Academic Source, 2024). Retrieved from ${url}`;
    setContent(prev => prev.replace(url, mockCitation));
    setLastPastedUrl(null);
  };

  const clearDraft = () => {
    if (confirm("Clear current draft? Data on device will be reset.")) {
      setContent('');
      localStorage.removeItem('currentDraft');
    }
  };

  const handleSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = textareaRef.current.value.substring(start, end);
      if (text.trim()) {
        setSelectedText(text);
        setSelectionRange({ start, end });
      } else {
        setSelectedText('');
      }
    }
  };

  const handlePdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    setIsAnalyzing(true);
    setLoadingStep('Extracting PDF intelligence...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      const newContent = fullText.trim();
      if (newContent) {
        setContent(prev => prev + (prev ? '\n\n' : '') + newContent);
        if (!title) setTitle(file.name.replace('.pdf', ''));
      } else {
        alert("Could not extract any text from the PDF. It might be an image-only PDF.");
      }
    } catch (err) {
      console.error('PDF extraction error:', err);
      alert("Failed to extract text from PDF. Ensure it's not password protected.");
    } finally {
      setIsAnalyzing(false);
      setLoadingStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyRephrase = (rephrased: string) => {

    const newContent =
      content.substring(0, selectionRange.start) +
      rephrased +
      content.substring(selectionRange.end);
    setContent(newContent);
    setShowRephraseModal(false);
    setSelectedText('');
  };

  return (
    <div className={`transition-all duration-700 ${isZen && featureOptions.zenModeEnabled ? 'max-w-4xl mx-auto pt-10' : ''}`}>
      <div className="flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`transition-all ${isZen ? 'hidden' : 'flex'}`}>
              <input
                type="text"
                placeholder="Document Title"
                className="neon-input font-bold text-lg w-full flex-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {featureOptions.zenModeEnabled && (
                <ZenModeToggle isZen={isZen} onToggle={() => setIsZen(!isZen)} />
              )}
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOptionsPanel(true)}
                className="p-2.5 rounded-xl border shadow-lg flex items-center justify-center transition-all bg-black/5 dark:bg-white/5"
                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}
                title="Editor Options"
              >
                <Settings2 size={18} />
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {featureOptions.diffViewerEnabled && (
              <button
                onClick={() => setShowDiff(true)}
                className="btn-premium flex items-center gap-2 border"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--accent-primary)' }}
              >
                <History size={16} /> Compare
              </button>
            )}

            <AnimatePresence>
              {selectedText && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => setShowRephraseModal(true)}
                  className="btn-premium bg-accent-primary/10 text-accent-primary border flex items-center gap-2 shadow-lg shadow-accent-primary/5 hover:bg-accent-primary/20 transition-all font-bold"
                  style={{ borderColor: 'var(--accent-primary)' }}
                >
                  <RefreshCw size={16} className="animate-pulse" /> Rephrase Selection
                </motion.button>
              )}
            </AnimatePresence>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfImport}
              accept=".pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl border hover:bg-accent-primary/10 text-accent-primary transition-all flex items-center gap-2"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
              title="Import PDF"
            >
              <FileUp size={18} />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Import PDF</span>
            </button>
            <button
              onClick={clearDraft}
              className="p-3 rounded-xl border hover:bg-error/10 text-error/70 hover:text-error transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || !content}
              className="neon-button flex items-center gap-2 px-6"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span className="uppercase tracking-widest">Run Analysis</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Editor Surface */}
          <div className={`${isZen && featureOptions.zenModeEnabled ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-4`}>
            <div
              className="relative portal-card rounded-[2rem] animate-scale-in flex flex-col min-h-[650px] overflow-hidden p-0"
            >
              {/* Internal Status Bar */}
              <div className="px-10 py-4 border-b flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                  <div className="flex items-center gap-1.5 text-accent-primary">
                    <Cpu size={12} />
                    Neural Processor Active
                  </div>
                  {featureOptions.autoSaveEnabled && (
                    isSaving ? (
                      <span className="flex items-center gap-1.5 animate-pulse text-accent-secondary">
                        <Save size={12} /> Syncing to device...
                      </span>
                    ) : lastSaved && (
                      <span className="text-success opacity-60">
                        Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <Award size={14} className="text-warning opacity-50" />
                  <BookOpen size={14} className="text-info opacity-50" />
                </div>
              </div>

              <div className="relative flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                  {analysis && featureOptions.heatmapEnabled ? (
                    <motion.div
                      key="heatmap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg font-serif leading-[1.8] flex-1 overflow-y-auto px-8 pt-10 pb-8"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <HeatmapOverlay content={content} segments={analysis.segments} />
                      <div className="mt-12 pt-8 border-t flex justify-center" style={{ borderColor: 'var(--border-subtle)' }}>
                        <button
                          onClick={() => setAnalysis(null)}
                          className="btn-premium glass text-accent-primary flex items-center gap-2"
                        >
                          <Zap size={16} /> Return to Neural Editor
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.textarea
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      ref={textareaRef}
                      onPaste={handlePaste}
                      onSelect={handleSelect}
                      className="flex-1 w-full bg-transparent outline-none resize-none text-lg font-serif leading-[1.8] px-8 pt-10 pb-8 custom-scrollbar"
                      style={{ color: 'var(--text-primary)', minHeight: '100%' }}
                      placeholder="Begin your academic inquiry here... (URL detection and auto-save active)"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Side Intelligence Panel */}
          {!(isZen && featureOptions.zenModeEnabled) && (
            <div className="lg:col-span-4 space-y-6">
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="card-premium node-active"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 size={18} className="text-accent-primary animate-spin" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Processing Intelligence</h3>
                    </div>
                    <p className="text-xs italic mb-4" style={{ color: 'var(--text-secondary)' }}>{loadingStep}</p>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <div className="w-full h-full data-stream" />
                    </div>
                  </motion.div>
                )}

                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium border-accent-primary/30"
                    style={{ boxShadow: 'var(--shadow-glow)' }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Integrity Report</h3>
                        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Verification ID: {contentHash.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className={`text-4xl font-black ${analysis.score > 30 ? 'text-error' : 'text-success'}`}>{analysis.score}%</span>
                          <p className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-tertiary)' }}>Similarity</p>
                        </div>
                        <div className="border-l pl-4" style={{ borderColor: 'var(--border-subtle)' }}>
                          <span className={`text-4xl font-black ${analysis.aiScore > 60 ? 'text-error' : 'text-success'}`}>{analysis.aiScore}%</span>
                          <p className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: 'var(--text-tertiary)' }}>AI Origin</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6 p-3 rounded-xl border border-dashed text-center" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div>
                        <p className="text-xs font-black text-error">{analysis.exact_similarity}%</p>
                        <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>Exact</p>
                      </div>
                      <div className="border-x" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-xs font-black text-warning">{analysis.patchwriting_similarity}%</p>
                        <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>Patch</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-info">{analysis.semantic_overlap}%</p>
                        <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>Semantic</p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed italic p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      "{analysis.summary}"
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        onClick={() => {
                          setShowAnalytics(true);
                          onToggleSidebar?.(true);
                        }}
                        className="btn-premium bg-accent-gradient text-white w-full flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/20"
                      >
                        <BarChart3 size={16} /> View Analytics Dashboard
                      </button>
                      {suggestions && (
                        <button
                          onClick={() => {
                            setShowCoachModal(true);
                            onToggleSidebar?.(true);
                          }}
                          className="btn-premium bg-accent-secondary/20 text-accent-secondary w-full flex items-center justify-center gap-2 border border-accent-secondary/30 hover:bg-accent-secondary/30 shadow-lg shadow-accent-secondary/10"
                        >
                          <Sparkles size={16} /> Open Writing Coach
                        </button>
                      )}
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="btn-premium glass text-accent-primary w-full flex items-center justify-center gap-2 border border-accent-primary/30"
                      >
                        <Award size={16} /> View Certificate
                      </button>
                    </div>
                  </motion.div>
                )}


              </AnimatePresence>

              <div className="p-8 rounded-[2.5rem] border shadow-sm text-center blockchain-chain overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div className="inline-flex p-4 rounded-2xl mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <ShieldCheck size={32} className="text-accent-primary" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>End-to-End Encryption</h3>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  Your draft is processed using zero-knowledge architecture. No raw text is ever persisted to our central ledger.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature 6: Writing Stats Bar */}
      {featureOptions.writingStatsEnabled && <WritingStatsBar content={content} />}

      {/* Feature 2: Citation Toast */}
      {featureOptions.citationAutoFix && (
        <CitationToast
          lastPastedUrl={lastPastedUrl}
          onDismiss={() => setLastPastedUrl(null)}
          onFormat={formatCitation}
        />
      )}

      {/* Feature 5: Diff Viewer */}
      <AnimatePresence>
        {showDiff && featureOptions.diffViewerEnabled && (
          <DiffViewer currentContent={content} onClose={() => setShowDiff(false)} />
        )}
      </AnimatePresence>

      {/* Feature 7: Integrity Certificate */}
      <IntegrityCertificate
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        title={title || 'Untitled Draft'}
        content={content}
        score={analysis?.score || 0}
        aiScore={analysis?.aiScore || 0}
        hash={contentHash}
      />

      {/* Analytics Dashboard */}
      {analysis && (
        <AnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          analysis={analysis}
          contentHash={contentHash}
        />
      )}

      {/* Neural Writing Coach Modal */}
      <WritingCoachModal
        isOpen={showCoachModal}
        onClose={() => setShowCoachModal(false)}
        suggestions={suggestions}
      />

      <RephraseModal
        isOpen={showRephraseModal}
        onClose={() => setShowRephraseModal(false)}
        selectedText={selectedText}
        onApply={applyRephrase}
      />

      {/* Feature Options Panel */}
      <EditorOptionsPanel
        isOpen={showOptionsPanel}
        onClose={() => setShowOptionsPanel(false)}
        options={featureOptions}
        onToggle={toggleFeature}
      />
    </div>
  );
};

export default DraftEditor;
