import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/95 border-b border-primary/20 shadow-xl backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-sm opacity-50" />
              <span className="material-symbols-outlined text-white text-lg relative z-10">
                business_center
              </span>
            </div>
            <h1 className="text-xl font-bold font-display text-foreground">CareerCraft</h1>
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl font-bold font-display text-foreground">
            About <span className="text-primary">CareerCraft</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We connect ambitious students with innovative companies through AI-powered matching, 
            creating meaningful internship opportunities that launch careers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">AI-Powered</h3>
              <p className="text-muted-foreground">Advanced algorithms match students with perfect opportunities.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-white text-2xl">trending_up</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Real-time</h3>
              <p className="text-muted-foreground">Instant notifications and application tracking.</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-white text-2xl">groups</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">Community</h3>
              <p className="text-muted-foreground">Connect with mentors and fellow students.</p>
            </div>
          </div>

          <div className="pt-12">
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full">
                Get Started Today
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
