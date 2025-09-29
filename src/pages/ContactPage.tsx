import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
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
            <Link to="/features" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
              Features
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
          className="text-center space-y-8 mb-16"
        >
          <h1 className="text-5xl font-bold font-display text-foreground">
            Get in <span className="text-primary">Touch</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our platform? We're here to help you succeed in your internship journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <Input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full"
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full"
                />
              </div>
              <div>
                <Input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full"
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Your Message" 
                  className="w-full min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">email</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">internship@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">phone</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+917021231411</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">location_on</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Office</p>
                    <p className="text-muted-foreground">Mumbai, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/auth" className="block text-primary hover:text-primary/80 transition-colors">
                  Sign Up for Free
                </Link>
                <Link to="/features" className="block text-primary hover:text-primary/80 transition-colors">
                  View Features
                </Link>
                <Link to="/about" className="block text-primary hover:text-primary/80 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
