import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, Server, Lock, Fingerprint, FileCode, CloudOff } from "lucide-react";

const techItems = [
  {
    icon: Database,
    name: "Hyperledger Fabric",
    category: "Blockchain",
  },
  {
    icon: Server,
    name: "Apache Kafka",
    category: "Message Queue",
  },
  {
    icon: Lock,
    name: "SHA-256 WASM",
    category: "Cryptography",
  },
  {
    icon: Fingerprint,
    name: "Sentence-BERT",
    category: "NLP Engine",
  },
  {
    icon: FileCode,
    name: "SHAP / LIME",
    category: "Explainability",
  },
  {
    icon: CloudOff,
    name: "On-Premise LLM",
    category: "Privacy",
  },
];

const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="section-divider mb-24" />

      <div className="container max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="label-terminal text-accent mb-4 block">Technology Foundation</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Built on <span className="text-gradient">Proven Infrastructure</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {techItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass p-6 text-center group hover:border-primary/30 transition-colors duration-300"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="font-semibold text-sm text-foreground mb-1">{item.name}</div>
                <div className="label-terminal text-[9px]">{item.category}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="section-divider mt-24" />
    </section>
  );
};

export default TechStack;
