import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">
              business_center
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-foreground">InternshipMatch</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#" className="hover:text-primary transition-colors">Resources</a>
          <Link to="/role-selection">
            <Button className="btn-primary">Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center radial-glow">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground leading-tight">
            Find Your <span className="text-primary">Perfect Internship</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform connects ambitious students with innovative companies for career-defining internship experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/internships">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Find Internships
              </Button>
            </Link>
            <Link to="/company-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                For Companies
              </Button>
            </Link>
          </div>
        </div>
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
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground">
              Launching Careers, <span className="text-primary">Building Futures</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're dedicated to empowering the next generation of professionals. Here's our impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <Card className="p-12 text-center hover:shadow-warm transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-5xl font-bold font-display text-primary">10k+</h3>
                <p className="text-xl font-semibold text-foreground">Students Connected</p>
                <p className="text-muted-foreground">
                  Thousands of students have found their dream internships through our platform.
                </p>
              </div>
            </Card>

            <Card className="p-12 text-center hover:shadow-warm transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-5xl font-bold font-display text-primary">5k+</h3>
                <p className="text-xl font-semibold text-foreground">Internships Secured</p>
                <p className="text-muted-foreground">
                  Meaningful internship opportunities that launched successful careers.
                </p>
              </div>
            </Card>
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
          <Link to="/role-selection">
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