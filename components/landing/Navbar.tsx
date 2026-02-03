import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onLogin: () => void;
}

const Navbar = ({ onLogin }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="icon-container w-10 h-10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold hidden sm:block">
              Guardian <span className="text-gradient">AI</span>
            </span>
          </a>

          {/* Desktop Navigation - Home & Features only */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:flex items-center">
            <button onClick={onLogin} className="btn-primary py-2.5 px-5 text-sm">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-2 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <div className="pt-4 border-t border-border">
                <button onClick={() => { setIsOpen(false); onLogin(); }} className="btn-primary py-3 text-sm w-full">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
