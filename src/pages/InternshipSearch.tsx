import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const InternshipSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const internships = [
    {
      title: "Product Management Intern",
      company: "Innovatech Solutions",
      location: "Remote",
      type: "Full-time",
      postedDate: "2 days ago",
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=64&h=64&fit=crop&crop=center"
    },
    {
      title: "Product Analyst Intern", 
      company: "DataDriven Co.",
      location: "New York, NY",
      type: "Full-time",
      postedDate: "5 days ago",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=64&h=64&fit=crop&crop=center"
    },
    {
      title: "APM Intern",
      company: "GlobalTech Inc.",
      location: "San Francisco, CA", 
      type: "Part-time",
      postedDate: "1 week ago",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop&crop=center"
    },
    {
      title: "Product Marketing Intern",
      company: "MarketMinds Ltd.",
      location: "Remote",
      type: "Full-time",
      postedDate: "2 weeks ago",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop&crop=center"
    }
  ];

  return (
    <div className="relative flex flex-col min-h-screen w-full radial-glow">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-4 bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3 text-foreground">
          <div className="w-9 h-9 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Smart PM</h2>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors duration-300">Home</Link>
            <Link to="/internships" className="text-primary font-semibold relative">
              Internships
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </Link>
            <a href="#" className="hover:text-primary transition-colors duration-300">Resources</a>
            <a href="#" className="hover:text-primary transition-colors duration-300">Community</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2">
              <span className="material-symbols-outlined">notifications</span>
            </Button>
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Find Your Next Internship.
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exclusive product management internships at leading tech companies and innovative startups.
            </p>
          </div>

          {/* Search Section */}
          <Card className="p-6 space-y-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border-border focus:border-primary focus:ring-primary"
                placeholder="Search by role, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <span>Company</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Skills</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Location</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </Button>
              <Button className="btn-primary ml-auto">Search</Button>
            </div>
          </Card>

          {/* Job Listings */}
          <div className="space-y-6">
            {internships.map((internship, index) => (
              <Card key={index} className="p-6 hover:shadow-warm hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                    <img 
                      src={internship.logo}
                      alt={`${internship.company} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-foreground">{internship.title}</h3>
                    <p className="text-md text-muted-foreground">{internship.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">
                          {internship.location === "Remote" ? "public" : "location_on"}
                        </span>
                        {internship.location}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        {internship.type}
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                    <Button className="btn-primary w-full sm:w-auto">Apply Now</Button>
                    <p className="text-xs text-muted-foreground text-center sm:text-right">
                      Posted {internship.postedDate}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center p-4">
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button size="sm" className="bg-primary text-white">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <Button variant="ghost" size="sm">4</Button>
              <Button variant="ghost" size="sm">5</Button>
              <Button variant="ghost" size="sm" className="p-2">
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InternshipSearch;