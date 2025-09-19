import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const applications = [
    {
      company: "Google",
      position: "Product Manager Intern",
      status: "under-review",
      appliedDate: "12 Aug 2023",
      description: "You applied for this position 3 days ago. The team is currently reviewing applications.",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=64&h=64&fit=crop&crop=center"
    },
    {
      company: "Amazon",
      position: "Technical PM Intern", 
      status: "action-required",
      appliedDate: "10 Aug 2023",
      description: "Your application is incomplete. Please submit the required documents to proceed.",
      logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=64&h=64&fit=crop&crop=center"
    }
  ];

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              auto_awesome
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-sidebar-foreground">SmartPM</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Button className="nav-link bg-primary text-primary-foreground w-full justify-start">
            <span className="material-symbols-outlined">work</span>
            <span className="text-sm font-medium">Apply for Internship</span>
          </Button>
          <div className="nav-link">
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-sm font-medium">Check Application Status</span>
          </div>
          <Link to="/internships" className="nav-link">
            <span className="material-symbols-outlined">search</span>
            <span className="text-sm font-medium">Browse Internships</span>
          </Link>
          <div className="nav-link">
            <span className="material-symbols-outlined">chat</span>
            <span className="text-sm font-medium">AI Mentor Chatbot</span>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className="nav-link">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 radial-glow">
        <div className="space-y-8">
          {/* Header with User Info */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">Welcome back, Alex!</h1>
              <p className="mt-1 text-muted-foreground">
                Your journey to the perfect product management internship starts here. Let's make it happen.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="p-2">
                <span className="material-symbols-outlined">notifications</span>
              </Button>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Next Step */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Next Step</h2>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    description
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Smart Resume Builder</h3>
                    <Badge className="bg-warning/20 text-warning border-warning/30">Coming Soon</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Craft a compelling, AI-optimized resume that catches the eye of top recruiters. Our 
                    builder analyzes your profile and suggests powerful keywords and formats to make 
                    your application shine.
                  </p>
                  <Button className="btn-primary">
                    Get Notified
                    <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Your Applications */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Applications</h2>
            <div className="space-y-4">
              {applications.map((app, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={app.logo} 
                        alt={`${app.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{app.position}</h3>
                        <Badge 
                          className={
                            app.status === "under-review" ? "status-approved" : 
                            app.status === "action-required" ? "status-pending" : "status-rejected"
                          }
                        >
                          {app.status === "under-review" ? "Under Review" : 
                           app.status === "action-required" ? "Action Required" : "Rejected"}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{app.company}</p>
                      <p className="text-muted-foreground mb-4">{app.description}</p>
                      <div className="flex items-center justify-between">
                        <Button 
                          className={
                            app.status === "action-required" ? "btn-primary" : "btn-secondary"
                          }
                        >
                          {app.status === "action-required" ? "Complete Application" : "View Application"}
                        </Button>
                        <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;