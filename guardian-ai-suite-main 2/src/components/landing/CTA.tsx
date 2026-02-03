import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-primary/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="glass p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="label-terminal text-primary">Early Access Available</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Ready to Protect <span className="text-gradient">Academic Integrity</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Join leading institutions using Guardian AI to maintain trust, 
            support learning, and create verifiable proof of originality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn-primary flex items-center gap-3 group">
              <Shield className="w-5 h-5" />
              Request Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Contact Sales
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <div className="label-terminal text-muted-foreground mb-4">Trusted By</div>
            <div className="flex items-center justify-center gap-8 opacity-50">
              {["University Partners", "Research Institutions", "Academic Publishers"].map((name, i) => (
                <span key={i} className="text-sm text-muted-foreground">{name}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
