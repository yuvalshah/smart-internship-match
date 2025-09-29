import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import ScrollingCompanies from "@/components/ScrollingCompanies";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.95)"]
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.1)"]
  );

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background animated-gradient relative">
      {/* Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-muted/10 to-secondary/8 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl opacity-40 pointer-events-none" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 border-b border-primary/20 shadow-xl backdrop-blur-xl' 
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? undefined : headerBackground,
          borderColor: isScrolled ? undefined : headerBorder,
        }}
      >
        <motion.div 
          className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500"
          animate={{ 
            paddingTop: isScrolled ? '0.75rem' : '1.5rem',
            paddingBottom: isScrolled ? '0.75rem' : '1.5rem'
          }}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            animate={{ scale: isScrolled ? 0.95 : 1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-sm opacity-50" />
              <span className="material-symbols-outlined text-white text-lg relative z-10">
                business_center
              </span>
            </div>
            <h1 className={`font-bold font-display transition-all duration-500 ${
              isScrolled 
                ? 'text-lg text-foreground' 
                : 'text-xl text-foreground'
            }`}>CareerCraft</h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about">
              <motion.div 
                className={`font-semibold transition-all duration-300 ${
                  isScrolled 
                    ? 'text-sm text-foreground/80 hover:text-primary' 
                    : 'text-sm text-muted-foreground hover:text-foreground'
                }`} 
                whileHover={{ y: -1 }}
              >
                About
              </motion.div>
            </Link>
            <Link to="/features">
              <motion.div 
                className={`font-semibold transition-all duration-300 ${
                  isScrolled 
                    ? 'text-sm text-foreground/80 hover:text-primary' 
                    : 'text-sm text-muted-foreground hover:text-foreground'
                }`} 
                whileHover={{ y: -1 }}
              >
                Features
              </motion.div>
            </Link>
            <Link to="/contact">
              <motion.div 
                className={`font-semibold transition-all duration-300 flex items-center gap-1 ${
                  isScrolled 
                    ? 'text-sm text-foreground/80 hover:text-primary' 
                    : 'text-sm text-muted-foreground hover:text-foreground'
                }`} 
                whileHover={{ y: -1 }}
              >
                Contact
                <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
              </motion.div>
            </Link>
          </nav>

          {/* CTA Button */}
          <Link to="/auth">
            <motion.div 
              whileHover={{ scale: 1.02, y: -1 }} 
              whileTap={{ scale: 0.98 }}
              animate={{ scale: isScrolled ? 0.95 : 1 }}
            >
              <Button className={`font-bold transition-all duration-500 ${
                isScrolled 
                  ? 'btn-premium px-5 py-2 text-sm' 
                  : 'btn-premium px-6 py-3 text-sm'
              }`}>
                <span className="relative z-10">
                  Get Started
                </span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-br from-muted/15 via-background to-muted/20 overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20 pointer-events-none"
        />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto space-y-8 relative z-10"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold font-display text-foreground leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Find Your <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse-glow drop-shadow-3xl">Perfect Internship</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground/90 max-w-2xl mx-auto drop-shadow-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Our platform connects ambitious students with innovative companies for career-defining internship experiences.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/auth?role=student">
              <motion.div 
                whileHover={{ scale: 1.02, y: -3 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="btn-premium text-lg px-10 py-5 rounded-xl">
                  <span className="relative z-10 flex items-center gap-3">
                    Find Internships
                    <motion.span 
                      className="material-symbols-outlined"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      arrow_forward
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link to="/auth?role=company">
              <motion.div 
                whileHover={{ scale: 1.02, y: -3 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="btn-premium-secondary text-lg px-10 py-5 rounded-xl">
                  <span className="relative z-10">
                    For Companies
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating Elements with enhanced depth */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-xl shadow-3xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 blur-xl shadow-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 0.9, 1] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        
        {/* Additional floating elements for more depth */}
        <motion.div 
          className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-lg shadow-2xl"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-lg shadow-2xl"
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
      </section>

      {/* Trusted Companies Section */}
      <ScrollingCompanies />

      {/* Features Section - Card Carousel Style */}
      <section className="py-24 px-4 relative bg-gradient-to-br from-muted/10 via-background to-muted/15">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/8 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-16 relative z-10">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground drop-shadow-lg">
              Why Choose <span className="text-primary drop-shadow-xl">CareerCraft</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow-sm">
              We're dedicated to empowering the next generation of professionals with cutting-edge features.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <Card className="glass-card-premium p-8 text-center card-interactive group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 drop-shadow-sm">AI-Powered Matching</h3>
                  <p className="text-muted-foreground drop-shadow-sm flex-grow">
                    Our advanced algorithm matches students with the perfect internship opportunities based on skills, interests, and career goals.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <Card className="glass-card-premium p-8 text-center card-interactive group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 drop-shadow-sm">Real-time Analytics</h3>
                  <p className="text-muted-foreground drop-shadow-sm flex-grow">
                    Track your application progress, get insights on market trends, and optimize your profile for better opportunities.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <Card className="glass-card-premium p-8 text-center card-interactive group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">groups</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 drop-shadow-sm">Community Network</h3>
                  <p className="text-muted-foreground drop-shadow-sm flex-grow">
                    Connect with fellow students, mentors, and industry professionals to expand your network and career opportunities.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-4 relative bg-gradient-to-br from-background via-muted/8 to-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/8 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-16 relative z-10">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground drop-shadow-lg">
              Launching Careers, <span className="text-primary drop-shadow-xl">Building Futures</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow-sm">
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
              <Card className="glass-card-premium p-12 text-center card-interactive group shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4 relative z-10">
                  <motion.h3 
                    className="text-5xl font-bold font-display text-primary drop-shadow-lg"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    10k+
                  </motion.h3>
                  <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors drop-shadow-sm">Students Connected</p>
                  <p className="text-muted-foreground drop-shadow-sm">
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
              <Card className="glass-card-premium p-12 text-center card-interactive group shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4 relative z-10">
                  <motion.h3 
                    className="text-5xl font-bold font-display text-primary drop-shadow-lg"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    5k+
                  </motion.h3>
                  <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors drop-shadow-sm">Internships Secured</p>
                  <p className="text-muted-foreground drop-shadow-sm">
                    Meaningful internship opportunities that launched successful careers.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-16 relative z-10">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground drop-shadow-lg">
              What Our <span className="text-primary drop-shadow-xl">Users Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow-sm">
              From intuitive design to powerful features, our platform has become an essential tool for students and companies worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              {
                name: "Aisha Sharma",
                role: "Product Management Intern",
                content: "CareerCraft made finding my product management internship a breeze. The tailored matches and clear application tracking were invaluable!",
                avatar: "AS"
              },
              {
                name: "Javier Lopez",
                role: "Business Analyst Intern",
                content: "As a student, navigating the internship market was overwhelming. CareerCraft's intuitive platform and resume builder gave me the edge I needed.",
                avatar: "JL"
              },
              {
                name: "Chloe Kim",
                role: "Technical PM Intern",
                content: "The platform's focus on project management roles is fantastic. I secured an internship that perfectly aligns with my career goals in tech.",
                avatar: "CK"
              },
              {
                name: "Ben Carter",
                role: "Operations Intern",
                content: "I appreciate the detailed company profiles and the ability to connect directly with recruiters. CareerCraft truly streamlines the process.",
                avatar: "BC"
              },
              {
                name: "Maria Garcia",
                role: "Strategy Intern",
                content: "The interview prep resources and personalized feedback helped me ace my interviews. I highly recommend CareerCraft to all aspiring PMs.",
                avatar: "MG"
              },
              {
                name: "Tom Wilson",
                role: "Growth PM Intern",
                content: "CareerCraft helped me discover niche PM roles I wouldn't have found otherwise. The platform is a game-changer for career development.",
                avatar: "TW"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-muted-foreground mb-4 italic text-sm leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-muted/5 via-background to-muted/5 relative overflow-hidden">
        {/* Background depth elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-30 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-display text-foreground drop-shadow-2xl leading-tight">
              Ready to Start Your <span className="text-primary">Journey?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
              Join thousands of students and companies already using CareerCraft to build the future.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <Link to="/auth">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="btn-premium text-xl px-12 py-6 rounded-2xl">
                  <span className="relative z-10 flex items-center gap-3">
                    Get Started Today
                    <motion.span 
                      className="material-symbols-outlined"
                      animate={{ x: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      rocket_launch
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Additional visual elements */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-8 pt-8"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Setup in minutes</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Scroll Words Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        {/* Infinite Scroll Words */}
        <div className="relative">
          <div className="flex items-center gap-20 overflow-hidden">
            <div className="flex items-center gap-20 whitespace-nowrap animate-scroll" style={{
              animationDuration: '25s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}>
              {[
                "INNOVATE", "DREAM", "ACHIEVE", "EXCEL", "SUCCEED", "GROW", "LEARN", "CONNECT", "INSPIRE", "CREATE",
                "INNOVATE", "DREAM", "ACHIEVE", "EXCEL", "SUCCEED", "GROW", "LEARN", "CONNECT", "INSPIRE", "CREATE"
              ].map((word, index) => (
                <motion.div
                  key={`${word}-${index}`}
                  className="flex-shrink-0 group"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-6xl md:text-8xl font-black text-foreground/20 group-hover:text-primary/40 transition-all duration-500 drop-shadow-2xl group-hover:drop-shadow-3xl group-hover:brightness-125 group-hover:contrast-125 tracking-tight">
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Enhanced gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-br from-muted/10 via-muted/20 to-muted/10 relative overflow-hidden border-t border-border/50">
        {/* Background depth elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/15 rounded-full blur-2xl opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary/15 rounded-full blur-2xl opacity-40 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-sm opacity-50" />
                <span className="material-symbols-outlined text-white text-lg relative z-10">
                  business_center
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-foreground drop-shadow-lg">CareerCraft</h3>
            </div>

            {/* Simple Links */}
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors drop-shadow-sm font-medium">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors drop-shadow-sm font-medium">Features</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors drop-shadow-sm font-medium">Contact</a>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-border/40 mb-6"></div>

          {/* Bottom Section */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground drop-shadow-sm">
              © 2025 The UNIFIERS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0, 
          scale: isScrolled ? 1 : 0 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
      >
        <span className="material-symbols-outlined text-xl">keyboard_arrow_up</span>
      </motion.button>
    </div>
  );
};

export default LandingPage;