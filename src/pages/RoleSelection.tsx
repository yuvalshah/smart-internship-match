import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-background radial-glow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center space-y-12">
        {/* Logo and Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                pie_chart
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground">Smart PM</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Join our platform by selecting your role to begin.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Student Card */}
          <Link to="/student-dashboard">
            <Card className="p-8 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    school
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-display text-foreground">Student</h3>
                  <p className="text-muted-foreground">
                    Find internships and kickstart your career.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Company Card */}
          <Link to="/company-dashboard">
            <Card className="p-8 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    business_center
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-display text-foreground">Company</h3>
                  <p className="text-muted-foreground">
                    Discover and recruit exceptional talent.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Admin Card */}
          <Link to="/admin-dashboard">
            <Card className="p-8 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    admin_panel_settings
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-display text-foreground">Admin</h3>
                  <p className="text-muted-foreground">
                    Manage and oversee platform operations.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Login Link */}
        <div className="pt-8">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;