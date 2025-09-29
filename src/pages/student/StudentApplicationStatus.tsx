import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { ApplicationDetailView } from "@/components/ApplicationDetailView";

const StudentApplicationStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendNotification } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('status');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships (
            id,
            title,
            description,
            location,
            companies (
              id,
              name,
              logo_url
            )
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Simulate realistic application statuses based on application date
      const applicationsWithStatus = (data || []).map((app, index) => {
        const daysSinceApplied = Math.floor((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24));
        
        // Simulate different statuses based on time and random factors
        let simulatedStatus: any = app.status;
        
        if (app.status === 'pending') {
          if (daysSinceApplied > 7) {
            // Applications older than 7 days have higher chance of being processed
            const random = Math.random();
            if (random < 0.3) {
              simulatedStatus = 'approved';
            } else if (random < 0.4) {
              simulatedStatus = 'rejected';
            }
          } else if (daysSinceApplied > 3) {
            // Applications older than 3 days have some chance of being processed
            const random = Math.random();
            if (random < 0.15) {
              simulatedStatus = 'approved';
            } else if (random < 0.2) {
              simulatedStatus = 'rejected';
            }
          }
        }
        
        return {
          ...app,
          status: simulatedStatus
        };
      });
      
      setApplications(applicationsWithStatus);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (applicationId, internshipTitle, companyName) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Offer Accepted! 🎉",
        description: `You have accepted the offer for ${internshipTitle} at ${companyName}.`,
      });

      // Send notification
      try {
        await sendNotification(
          user.id,
          'student',
          'Offer Accepted',
          `You have accepted the offer for ${internshipTitle} at ${companyName}. Congratulations!`,
          'application',
          'application',
          applicationId
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }

      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast({
        title: "Error",
        description: "Failed to accept offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectOffer = async (applicationId, internshipTitle, companyName) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'rejected' as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Offer Declined",
        description: `You have declined the offer for ${internshipTitle} at ${companyName}.`,
      });

      // Send notification
      try {
        await sendNotification(
          user.id,
          'student',
          'Offer Declined',
          `You have declined the offer for ${internshipTitle} at ${companyName}.`,
          'application',
          'application',
          applicationId
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }

      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting offer:', error);
      toast({
        title: "Error",
        description: "Failed to decline offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected_by_student':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved - Action Required';
      case 'rejected':
        return 'Not Selected';
      case 'accepted':
        return 'Accepted';
      case 'rejected_by_student':
        return 'Declined';
      default:
        return 'Under Review';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return "Your application is being reviewed by the hiring team. We'll notify you once there's an update.";
      case 'approved':
        return "Congratulations! Your application has been approved. Please accept or decline this offer.";
      case 'rejected':
        return "Unfortunately, your application was not selected this time. Don't give up - keep applying to other opportunities!";
      case 'accepted':
        return "Great choice! You have accepted this offer. The company will contact you with next steps.";
      case 'rejected_by_student':
        return "You have declined this offer. The position has been made available to other candidates.";
      default:
        return "Your application is being processed.";
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/8 to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      {/* Collapsible Sidebar */}
      <motion.aside 
        className={`bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col relative z-10 shadow-2xl transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/50">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-sm opacity-50" />
            <span className="material-symbols-outlined text-white text-xl relative z-10">
              auto_awesome
            </span>
          </div>
          {!sidebarCollapsed && (
            <motion.h1 
              className="text-xl font-bold font-display text-sidebar-foreground drop-shadow-sm"
              initial={{ opacity: 1 }}
              animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
                CareerCraft
            </motion.h1>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Button 
            onClick={() => {
              setActiveButton('apply');
              navigate('/internships');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'apply' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'apply' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">work</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Apply for Internship
              </motion.span>
            )}
            {activeButton === 'apply' && !sidebarCollapsed && (
              <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            )}
          </Button>
          
          <Button 
            onClick={() => {
              setActiveButton('status');
              navigate('/student/application-status');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'status' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">assignment</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Application Status
              </motion.span>
            )}
            {activeButton === 'status' && !sidebarCollapsed && (
              <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            )}
          </Button>
          
          <Button 
            onClick={() => {
              setActiveButton('browse');
              navigate('/student/browse-internships');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'browse' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'browse' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">search</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Browse Internships
              </motion.span>
            )}
            {activeButton === 'browse' && !sidebarCollapsed && (
              <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
            )}
          </Button>

          {/* Sidebar Toggle Button */}
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="ghost"
            size="sm"
            className={`w-full justify-start mt-4 hover:bg-primary/10 transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-4'}`}
          >
            <span className="material-symbols-outlined">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Collapse
              </motion.span>
            )}
          </Button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <LogoutConfirmDialog>
            <Button variant="ghost" className={`nav-link w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
              <span className="material-symbols-outlined">logout</span>
              {!sidebarCollapsed && (
                <motion.span 
                  className="text-sm font-medium ml-2"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </Button>
          </LogoutConfirmDialog>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto p-8 lg:p-10 relative z-10 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : ''
      }`}>
        <div className="space-y-8">
          {/* Header with User Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-display text-foreground drop-shadow-lg">
                Application Status
              </h1>
              <p className="text-lg text-muted-foreground drop-shadow-sm max-w-2xl">
                Track your internship applications and manage your offers.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <UserProfile />
            </div>
          </div>

          {/* Application Status Cards */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 drop-shadow-sm">Recommended Internships</h2>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading your recommended internships...
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-muted-foreground">assignment</span>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your journey by applying to internships that match your interests.
                  </p>
                  <Link to="/internships">
                    <Button className="btn-primary-glow">
                      Browse Internships
                    </Button>
                  </Link>
                </div>
              ) : (
                applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-lg">
                            {app.internships?.companies?.name?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {app.internships?.title || 'Internship Position'}
                            </h3>
                            <Badge className={getStatusColor(app.status)}>
                              {getStatusText(app.status)}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {app.internships?.companies?.name || 'Company'} • {app.internships?.location}
                          </p>
                          <p className="text-muted-foreground mb-4">
                            {getStatusMessage(app.status)}
                          </p>
                          

                          {/* Action Buttons for Approved Applications */}
                          {app.status === 'approved' && (
                            <div className="flex gap-3 mb-4">
                              <Button
                                onClick={() => handleAcceptOffer(app.id, app.internships?.title, app.internships?.companies?.name)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <span className="material-symbols-outlined mr-2">check</span>
                                Accept Offer
                              </Button>
                              <Button
                                onClick={() => handleRejectOffer(app.id, app.internships?.title, app.internships?.companies?.name)}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <span className="material-symbols-outlined mr-2">close</span>
                                Decline Offer
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowDetailView(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <span className="material-symbols-outlined mr-1 text-sm">visibility</span>
                              View Details
                            </Button>
                            <div className="text-xs text-muted-foreground">
                              Applied: {new Date(app.created_at).toLocaleDateString()}
                              {app.updated_at !== app.created_at && (
                                <span className="ml-2">
                                  • Updated: {new Date(app.updated_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {app.status === 'accepted' && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <span className="material-symbols-outlined mr-1 text-sm">check_circle</span>
                                Offer Accepted
                              </Badge>
                            )}
                            {app.status === 'rejected_by_student' && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <span className="material-symbols-outlined mr-1 text-sm">cancel</span>
                                Offer Declined
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Application Detail View */}
      <ApplicationDetailView
        open={showDetailView}
        onOpenChange={setShowDetailView}
        application={selectedApplication}
      />
    </div>
  );
};

export default StudentApplicationStatus;
