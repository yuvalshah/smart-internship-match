import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const trustedCompanies = [
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=120&h=40&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=40&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=40&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=40&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&h=40&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=120&h=40&fit=crop&crop=center"
  ];

  return (
    <div className="min-h-screen bg-background animated-gradient">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card sticky top-0 z-50 flex items-center justify-between px-10 py-6 border-b border-border/20 backdrop-blur-xl"
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover">
            <span className="material-symbols-outlined text-white text-lg">
              business_center
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-foreground">InternshipMatch</h1>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
          <motion.a href="#" className="hover:text-primary transition-colors" whileHover={{ y: -2 }}>About</motion.a>
          <motion.a href="#" className="hover:text-primary transition-colors" whileHover={{ y: -2 }}>How It Works</motion.a>
          <motion.a href="#" className="hover:text-primary transition-colors" whileHover={{ y: -2 }}>Resources</motion.a>
          <Link to="/auth">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="btn-primary-glow">Get Started</Button>
            </motion.div>
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center mesh-gradient">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold font-display text-foreground leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Find Your <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse-glow">Perfect Internship</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Our platform connects ambitious students with innovative companies for career-defining internship experiences.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="btn-primary-glow text-lg px-8 py-4 shadow-elegant hover:shadow-floating">
                  Find Internships
                  <motion.span 
                    className="material-symbols-outlined ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    arrow_forward
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="btn-ghost-enhanced text-lg px-8 py-4">
                  For Companies
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 blur-xl"
          animate={{ y: [0, 20, 0], scale: [1, 0.9, 1] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </section>

      {/* Trusted Companies Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">
            Trusted by Top Companies Worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {trustedCompanies.map((logo, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
                <img 
                  src={logo} 
                  alt={`Company ${index + 1}`}
                  className="h-8 w-auto mx-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              Launching Careers, <span className="text-primary">Building Futures</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're dedicated to empowering the next generation of professionals. Here's our impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card-premium p-12 text-center card-interactive group">
                <div className="space-y-4">
                  <motion.h3 
                    className="text-5xl font-bold font-display text-primary"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    10k+
                  </motion.h3>
                  <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Students Connected</p>
                  <p className="text-muted-foreground">
                    Thousands of students have found their dream internships through our platform.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card-premium p-12 text-center card-interactive group">
                <div className="space-y-4">
                  <motion.h3 
                    className="text-5xl font-bold font-display text-primary"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    5k+
                  </motion.h3>
                  <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Internships Secured</p>
                  <p className="text-muted-foreground">
                    Meaningful internship opportunities that launched successful careers.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold font-display text-foreground">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of students and companies already using Smart PM to build the future.
          </p>
          <Link to="/auth">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Smart PM. All rights reserved. Building the future of internships.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;