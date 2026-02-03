import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="icon-container w-10 h-10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">
              Guardian <span className="text-gradient">AI</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            {["Documentation", "API", "Privacy", "Terms"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Hash ID */}
          <div className="font-mono text-xs text-muted-foreground/50">
            BUILD: 0x7F3A...2D4E
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground/60">
            © 2024 Guardian AI. Protecting academic integrity through cryptographic verification.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
