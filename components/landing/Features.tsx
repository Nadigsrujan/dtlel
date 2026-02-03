import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import React, { useRef } from "react";
import {
  MessageSquare,
  Cpu,
  Eye,
  Layers,
  Brain,
  FileCheck,
  Shield,
  Users,
  Award,
  GitBranch,
  Accessibility,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Paraphrasing Coach",
    subtitle: "Draft Integrity Check",
    description:
      "Real-time AI analysis integrated into the editor. Students can correct issues before submission, transforming enforcement into a learning tool.",
    color: "primary",
  },
  {
    icon: Cpu,
    title: "WASM Client-Side Hashing",
    subtitle: "SHA-256 Browser Execution",
    description:
      "Cryptographic hashing executed directly in WebAssembly. Faster, more secure, with integrity verification before any data leaves your device.",
    color: "secondary",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Protocol",
    subtitle: "Privacy-First Verification",
    description:
      "Only cryptographic hashes are stored. Raw documents never touch blockchain storage, preserving student privacy while enabling verification.",
    color: "accent",
  },
  {
    icon: Layers,
    title: "Message Queue Architecture",
    subtitle: "RabbitMQ / Apache Kafka",
    description:
      "Asynchronous processing supports 5,000+ concurrent submissions with fault tolerance and stability during peak usage periods.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "Semantic Similarity Engine",
    subtitle: "Sentence-BERT Embeddings",
    description:
      "Vector-based comparison detects paraphrased and AI-rewritten content by analyzing meaning, not just string overlap.",
    color: "secondary",
  },
  {
    icon: FileCheck,
    title: "Explainability Layer (XAI)",
    subtitle: "SHAP / LIME Integration",
    description:
      "Sentence-level weight mapping generates interpretable reasoning scores, clearly explaining why content was flagged.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Sovereignty Framework",
    subtitle: "Hyperledger Fabric",
    description:
      "Private blockchain ledger with local-only LLM hosting. All AI models run on-premise with no third-party cloud exposure.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Role-Based Dashboards",
    subtitle: "Student & Faculty Views",
    description:
      "Specialized interfaces with draft tools, digital wallets, similarity reports, and multi-dimensional integrity scoring.",
    color: "secondary",
  },
  {
    icon: Award,
    title: "Digital Certificates",
    subtitle: "Blockchain-Linked Proof",
    description:
      "PDF & QR-code certificates linked to blockchain transaction IDs. Verifiable, shareable, and tamper-proof credentials.",
    color: "accent",
  },
  {
    icon: GitBranch,
    title: "Version Control System",
    subtitle: "Document Evolution Tracking",
    description:
      "Every upload gets a unique version ID. Track document evolution, prevent disputes, and enable deep similarity comparisons.",
    color: "primary",
  },
  {
    icon: Accessibility,
    title: "WCAG Compliance",
    subtitle: "Inclusive Access",
    description:
      "Full accessibility compliance across all UI components. Meets institutional standards for inclusive student and faculty access.",
    color: "secondary",
  },
];

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0]; index: number; key?: React.Key }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-hover p-8 group"
    >
      <div className="icon-container mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>

      <span className="label-terminal text-primary mb-2 block">{feature.subtitle}</span>

      <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>

      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

const Features = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="label-terminal text-secondary mb-4 block">Platform Capabilities</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Enterprise-Grade <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive integrity ecosystem built on cutting-edge cryptography,
            AI, and distributed ledger technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
