import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ApplicationForm } from "@/components/ApplicationForm";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";

const InternshipSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCompany, selectedSkills, selectedLocation]);

  const allInternships = [
    // Page 1 - Big Tech Companies
    {
      id: "1",
      title: "Product Management Intern",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      postedDate: "1 day ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      skills: ["Product Strategy", "Data Analysis", "User Research", "SQL"],
      description: "Work on core Google products, analyze user data, and contribute to product roadmap decisions.",
      requirements: "CS/Engineering background, 3.5+ GPA, strong analytical skills"
    },
    {
      id: "2",
      title: "Associate Product Manager Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      type: "Full-time",
      postedDate: "2 days ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      skills: ["Product Strategy", "Azure", "Power BI", "Agile"],
      description: "Support Microsoft Azure product team in feature planning and user research.",
      requirements: "Technical background, 3.3+ GPA, experience with cloud platforms"
    },
    {
      id: "3",
      title: "Product Intern",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Full-time",
      postedDate: "3 days ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      skills: ["iOS Development", "User Experience", "Design Thinking", "Swift"],
      description: "Work on iOS and macOS products, focusing on user experience and feature development.",
      requirements: "Design or Engineering background, 3.4+ GPA, passion for Apple ecosystem"
    },
    {
      id: "4",
      title: "Product Management Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Full-time",
      postedDate: "4 days ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      skills: ["Social Media", "VR/AR", "Data Analysis", "Python"],
      description: "Support Facebook, Instagram, or Reality Labs product teams in feature development.",
      requirements: "CS/Design background, 3.2+ GPA, interest in social media or VR"
    },
    {
      id: "5",
      title: "Product Strategy Intern",
      company: "Amazon",
      location: "Seattle, WA",
      type: "Full-time",
      postedDate: "5 days ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      skills: ["E-commerce", "AWS", "Analytics", "Machine Learning"],
      description: "Work on Amazon marketplace features, Prime services, or AWS product strategy.",
      requirements: "Business/Engineering background, 3.3+ GPA, analytical mindset"
    },

    // Page 2 - Fintech Companies
    {
      id: "6",
      title: "Product Management Intern",
      company: "Stripe",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "1 week ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      skills: ["Fintech", "API Design", "Payments", "React"],
      description: "Support payment infrastructure products and developer tools at Stripe.",
      requirements: "CS background, 3.5+ GPA, interest in fintech and APIs"
    },
    {
      id: "7",
      title: "Product Intern",
      company: "Square",
      location: "San Francisco, CA", 
      type: "Full-time",
      postedDate: "1 week ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Square%2C_Inc._logo.svg",
      skills: ["Mobile Payments", "Point of Sale", "Analytics", "iOS/Android"],
      description: "Work on Square's seller tools and payment processing products.",
      requirements: "CS/Design background, 3.3+ GPA, mobile development experience"
    },
    {
      id: "8",
      title: "Product Management Intern",
      company: "PayPal",
      location: "San Jose, CA",
      type: "Full-time",
      postedDate: "1 week ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      skills: ["Digital Payments", "Security", "User Research", "Python"],
      description: "Support PayPal's core payment products and security features.",
      requirements: "CS/Business background, 3.2+ GPA, security knowledge preferred"
    },
    {
      id: "9",
      title: "Product Strategy Intern",
      company: "Robinhood",
      location: "Menlo Park, CA",
      type: "Full-time",
      postedDate: "2 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Robinhood_Logo.svg",
      skills: ["Trading", "Mobile Apps", "Data Analysis", "React Native"],
      description: "Work on Robinhood's trading platform and financial products.",
      requirements: "CS/Finance background, 3.4+ GPA, interest in financial markets"
    },
    {
      id: "10",
      title: "Product Intern",
      company: "Coinbase",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Coinbase_Logo.svg",
      skills: ["Cryptocurrency", "Blockchain", "Security", "React"],
      description: "Support cryptocurrency trading platform and wallet products.",
      requirements: "CS background, 3.5+ GPA, blockchain/crypto knowledge"
    },

    // Page 3 - SaaS Companies
    {
      id: "11",
      title: "Product Management Intern",
      company: "Salesforce",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      skills: ["CRM", "Sales Automation", "Analytics", "Apex"],
      description: "Work on Salesforce CRM features and automation tools.",
      requirements: "CS/Business background, 3.3+ GPA, CRM experience preferred"
    },
    {
      id: "12",
      title: "Product Intern",
      company: "Slack",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
      skills: ["Communication", "Integrations", "API Design", "React"],
      description: "Support Slack's communication platform and integration features.",
      requirements: "CS background, 3.4+ GPA, experience with APIs and integrations"
    },
    {
      id: "13",
      title: "Product Management Intern",
      company: "Zoom",
      location: "San Jose, CA",
      type: "Full-time",
      postedDate: "3 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
      skills: ["Video Conferencing", "WebRTC", "Mobile Apps", "Analytics"],
      description: "Work on Zoom's video conferencing features and mobile applications.",
      requirements: "CS background, 3.3+ GPA, video/audio technology interest"
    },
    {
      id: "14",
      title: "Product Strategy Intern",
      company: "Notion",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "3 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      skills: ["Productivity", "Collaboration", "Database Design", "React"],
      description: "Support Notion's productivity platform and collaboration features.",
      requirements: "CS/Design background, 3.4+ GPA, productivity tool experience"
    },
    {
      id: "15",
      title: "Product Intern",
      company: "Figma",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "3 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
      skills: ["Design Tools", "Collaboration", "WebGL", "TypeScript"],
      description: "Work on Figma's design platform and collaboration features.",
      requirements: "CS/Design background, 3.5+ GPA, design tool experience"
    },

    // Page 4 - E-commerce & Consumer
    {
      id: "16",
      title: "Product Management Intern",
      company: "Shopify",
      location: "Ottawa, Canada",
      type: "Full-time",
      postedDate: "3 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Shopify_logo_2019.svg",
      skills: ["E-commerce", "Merchant Tools", "Analytics", "Ruby on Rails"],
      description: "Support Shopify's merchant platform and e-commerce tools.",
      requirements: "CS/Business background, 3.3+ GPA, e-commerce experience"
    },
    {
      id: "17",
      title: "Product Intern",
      company: "Airbnb",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "4 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
      skills: ["Marketplace", "Travel", "Mobile Apps", "React Native"],
      description: "Work on Airbnb's marketplace platform and host/guest features.",
      requirements: "CS background, 3.4+ GPA, marketplace/travel interest"
    },
    {
      id: "18",
      title: "Product Strategy Intern",
      company: "Uber",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "4 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
      skills: ["Mobility", "Logistics", "Data Analysis", "Python"],
      description: "Support Uber's ride-sharing and delivery platform features.",
      requirements: "CS/Business background, 3.3+ GPA, logistics/mobility interest"
    },
    {
      id: "19",
      title: "Product Management Intern",
      company: "Spotify",
      location: "New York, NY",
      type: "Full-time",
      postedDate: "4 weeks ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      skills: ["Music Streaming", "Recommendation Systems", "Mobile Apps", "Python"],
      description: "Work on Spotify's music streaming platform and recommendation features.",
      requirements: "CS background, 3.4+ GPA, music/ML interest"
    },
    {
      id: "20",
      title: "Product Intern",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      skills: ["Video Streaming", "Recommendation Systems", "Analytics", "Java"],
      description: "Support Netflix's streaming platform and content recommendation systems.",
      requirements: "CS background, 3.5+ GPA, video/ML experience"
    },

    // Page 5 - AI & Emerging Tech
    {
      id: "21",
      title: "Product Management Intern",
      company: "OpenAI",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI.svg",
      skills: ["AI/ML", "Natural Language Processing", "API Design", "Python"],
      description: "Work on OpenAI's AI products and API platform features.",
      requirements: "CS background, 3.6+ GPA, AI/ML experience required"
    },
    {
      id: "22",
      title: "Product Intern",
      company: "Anthropic",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Anthropic_logo.svg",
      skills: ["AI Safety", "Large Language Models", "Research", "Python"],
      description: "Support Anthropic's AI safety research and product development.",
      requirements: "CS background, 3.5+ GPA, AI safety research interest"
    },
    {
      id: "23",
      title: "Product Strategy Intern",
      company: "Tesla",
      location: "Palo Alto, CA",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
      skills: ["Autonomous Vehicles", "Energy", "Mobile Apps", "Python"],
      description: "Work on Tesla's vehicle software and energy products.",
      requirements: "CS/Engineering background, 3.4+ GPA, automotive interest"
    },
    {
      id: "24",
      title: "Product Management Intern",
      company: "SpaceX",
      location: "Hawthorne, CA",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg",
      skills: ["Aerospace", "Data Analysis", "Mission Control", "Python"],
      description: "Support SpaceX's mission control software and launch systems.",
      requirements: "CS/Aerospace background, 3.5+ GPA, aerospace interest"
    },
    {
      id: "25",
      title: "Product Intern",
      company: "Palantir",
      location: "Denver, CO",
      type: "Full-time",
      postedDate: "1 month ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Palantir_Technologies_logo.svg",
      skills: ["Data Analytics", "Government", "Security", "Java"],
      description: "Work on Palantir's data analytics platform and security features.",
      requirements: "CS background, 3.5+ GPA, security clearance preferred"
    }
  ];

  // Filter internships based on search criteria
  const filteredInternships = allInternships.filter(internship => {
    const matchesSearch = searchQuery === "" || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompany = selectedCompany === "" || internship.company === selectedCompany;
    const matchesSkills = selectedSkills === "" || internship.skills.includes(selectedSkills);
    const matchesLocation = selectedLocation === "" || internship.location === selectedLocation;
    
    return matchesSearch && matchesCompany && matchesSkills && matchesLocation;
  });

  const internshipsPerPage = 5;
  const totalPages = Math.ceil(filteredInternships.length / internshipsPerPage);
  const startIndex = (currentPage - 1) * internshipsPerPage;
  const endIndex = startIndex + internshipsPerPage;
  const internships = filteredInternships.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background animated-gradient relative">
      {/* Enhanced Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-muted/10 to-secondary/8 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 pointer-events-none animate-gentle-drift" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl opacity-40 pointer-events-none animate-gentle-drift" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/6 rounded-full blur-2xl opacity-20 pointer-events-none animate-breathing" />
      
      {/* Enhanced Header */}
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
          {/* Back Button */}
          {user && (
            <Link to="/student-dashboard">
              <motion.div 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300" 
                whileHover={{ y: -1 }}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Dashboard
              </motion.div>
            </Link>
          )}


          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user && <NotificationBell />}
            {user ? <UserProfile /> : (
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className={`transition-all duration-300 ${
                      isScrolled 
                        ? 'btn-primary-glow' 
                        : 'btn-primary-glow'
                    }`}
                  >
                    Get Started
            </Button>
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      </motion.header>

      {/* Enhanced Main Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-7xl mx-auto space-y-12">
          {/* Enhanced Hero Section */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-lg">
              Find Your Next
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
                Internship
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Discover exclusive product management internships at leading tech companies and innovative startups.
              Your perfect career opportunity awaits.
            </p>
          </motion.div>

          {/* Enhanced Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="space-y-6">
            <div className="relative">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                search
              </span>
              <Input
                    className="w-full h-16 pl-16 pr-6 text-lg rounded-2xl border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 bg-white/50"
                placeholder="Search by role, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
                  <select 
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="px-6 py-3 rounded-xl border border-border/50 bg-white/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">All Companies</option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Apple">Apple</option>
                    <option value="Meta">Meta</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Square">Square</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Robinhood">Robinhood</option>
                    <option value="Coinbase">Coinbase</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Slack">Slack</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Notion">Notion</option>
                    <option value="Figma">Figma</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Uber">Uber</option>
                    <option value="Spotify">Spotify</option>
                    <option value="Netflix">Netflix</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Tesla">Tesla</option>
                    <option value="SpaceX">SpaceX</option>
                    <option value="Palantir">Palantir</option>
                  </select>
                  
                  <select 
                    value={selectedSkills}
                    onChange={(e) => setSelectedSkills(e.target.value)}
                    className="px-6 py-3 rounded-xl border border-border/50 bg-white/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">All Skills</option>
                    <option value="Product Strategy">Product Strategy</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="User Research">User Research</option>
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="API Design">API Design</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Design">Design</option>
                    <option value="Agile">Agile</option>
                  </select>
                  
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-6 py-3 rounded-xl border border-border/50 bg-white/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    <option value="San Francisco, CA">San Francisco, CA</option>
                    <option value="Mountain View, CA">Mountain View, CA</option>
                    <option value="Seattle, WA">Seattle, WA</option>
                    <option value="Cupertino, CA">Cupertino, CA</option>
                    <option value="Menlo Park, CA">Menlo Park, CA</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="Los Gatos, CA">Los Gatos, CA</option>
                    <option value="Palo Alto, CA">Palo Alto, CA</option>
                    <option value="Denver, CO">Denver, CO</option>
                    <option value="Ottawa, Canada">Ottawa, Canada</option>
                    <option value="Remote">Remote</option>
                  </select>
                  
                  <Button 
                    onClick={() => {
                      // Reset to first page when searching
                      setCurrentPage(1);
                    }}
                    className="relative px-8 py-3 rounded-xl ml-auto bg-gradient-to-r from-primary via-primary/90 to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
                  >
                    {/* Premium glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-white/10 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Button content */}
                    <span className="relative z-10 flex items-center">
                      <span className="material-symbols-outlined mr-2 text-lg">search</span>
                      Search
                    </span>
                  </Button>
                </div>
            </div>
          </Card>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-muted-foreground">
              {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
              {filteredInternships.length !== allInternships.length && (
                <span className="text-primary ml-1">
                  (filtered from {allInternships.length} total)
                </span>
              )}
            </p>
          </motion.div>

          {/* Enhanced Job Listings */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredInternships.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-muted-foreground">search_off</span>
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">No internships found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCompany("");
                    setSelectedSkills("");
                    setSelectedLocation("");
                  }}
                  variant="outline"
                  className="btn-outline-secondary"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              internships.map((internship, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-border/50 shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white p-2">
                    <img 
                      src={internship.logo}
                      alt={`${internship.company} logo`}
                        className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {internship.title}
                      </h3>
                      <p className="text-lg text-muted-foreground font-medium">{internship.company}</p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {internship.description}
                      </p>
                      <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">
                          {internship.location === "Remote" ? "public" : "location_on"}
                        </span>
                        {internship.location}
                      </span>
                        <span className="hidden sm:inline text-muted-foreground/50">•</span>
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                        {internship.type}
                      </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {internship.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs px-2 py-1">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{internship.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        Requirements: {internship.requirements}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3">
                      {user ? (
                        <ApplicationForm
                          internshipId={internship.id}
                          internshipTitle={internship.title}
                          companyName={internship.company}
                        >
                          <Button className="btn-primary-glow w-full sm:w-auto px-8 py-3 rounded-xl">
                            <span className="material-symbols-outlined mr-2">send</span>
                            Apply Now
                          </Button>
                        </ApplicationForm>
                      ) : (
                        <Link to="/auth?role=student">
                          <Button className="btn-primary-glow w-full sm:w-auto px-8 py-3 rounded-xl">
                            <span className="material-symbols-outlined mr-2">login</span>
                            Sign In to Apply
                          </Button>
                        </Link>
                      )}
                      <p className="text-sm text-muted-foreground text-center sm:text-right">
                      Posted {internship.postedDate}
                    </p>
                  </div>
                </div>
              </Card>
              </motion.div>
              ))
            )}
          </motion.div>

          {/* Enhanced Pagination */}
          <motion.div 
            className="flex items-center justify-center p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'hover:bg-primary/10'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </nav>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InternshipSearch;