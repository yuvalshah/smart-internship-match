import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeaturesPage = () => {
  const features = [
    {
      icon: "smart_toy",
      title: "AI Matching",
      description: "Intelligent algorithms match students with relevant internships based on skills, interests, and career goals."
    },
    {
      icon: "notifications",
      title: "Real-time Alerts",
      description: "Get instant notifications about new opportunities, application updates, and important deadlines."
    },
    {
      icon: "analytics",
      title: "Progress Tracking",
      description: "Monitor your application status, track your progress, and get insights on your job search."
    },
    {
      icon: "groups",
      title: "Mentor Network",
      description: "Connect with industry professionals and experienced mentors for career guidance."
    },
    {
      icon: "work",
      title: "Company Profiles",
      description: "Explore detailed company profiles, culture insights, and internship requirements."
    },
    {
      icon: "schedule",
      title: "Interview Prep",
      description: "Access interview tips, practice questions, and preparation resources tailored to your field."
    }
  ];

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
            <Link to="/about" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 mb-16"
        >
          <h1 className="text-5xl font-bold font-display text-foreground">
            Powerful <span className="text-primary">Features</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to find and secure your dream internship, all in one platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-2xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center pt-16"
        >
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full">
              Start Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;
