import { motion } from "framer-motion";
import { Shield, Zap, Lock } from "lucide-react";

interface HeroProps {
  onLogin: () => void;
}

const Hero = ({ onLogin }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated Orbs */}
      <div className="orb w-[600px] h-[600px] bg-primary/40 -top-40 -left-40" />
      <div className="orb w-[500px] h-[500px] bg-secondary/30 -bottom-20 -right-20" style={{ animationDelay: '-5s' }} />
      <div className="orb w-[300px] h-[300px] bg-accent/20 top-1/3 right-1/4" style={{ animationDelay: '-10s' }} />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(210, 100%, 67%) 1px, transparent 1px), linear-gradient(90deg, hsl(210, 100%, 67%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="label-terminal text-success">System Active</span>
            <span className="label-terminal">•</span>
            <span className="label-terminal">v2.4.1</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
          >
            <span className="text-foreground">Guardian</span>
            <span className="text-gradient"> AI</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4"
          >
            AI-Powered Plagiarism Detection & Data Integrity Guardian
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-12"
          >
            Blockchain-anchored verification, semantic analysis, and zero-knowledge protocols
            for academic submissions
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center mb-16"
          >
            <button onClick={onLogin} className="btn-primary flex items-center gap-3">
              <Shield className="w-5 h-5" />
              Start Verification
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "99.7%", label: "Accuracy Rate" },
              { value: "5K+", label: "Concurrent Users" },
              { value: "<2s", label: "Analysis Time" },
              { value: "256-bit", label: "Encryption" },
            ].map((stat, i) => (
              <div key={i} className="glass-hover p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="label-terminal">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
