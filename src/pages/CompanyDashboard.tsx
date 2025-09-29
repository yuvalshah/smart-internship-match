import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { NewPostingForm } from "@/components/NewPostingForm";
import { EditPostingModal } from "@/components/EditPostingModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sendNotification } = useNotifications();
  const { toast } = useToast();
  const [internshipPostings, setInternshipPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('dashboard');
  const [editingPost, setEditingPost] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [applications, setApplications] = useState([
    {
      id: 1,
      applicant: 'Radhe Shyam',
      email: 'tudj@gmail.com',
      position: 'Content Creation Intern',
      appliedDate: 'Sep 28, 2024',
      matchScore: 56,
      status: 'pending'
    },
    {
      id: 2,
      applicant: 'Priya Sharma',
      email: 'priya@example.com',
      position: 'Visual Design Intern',
      appliedDate: 'Sep 27, 2024',
      matchScore: 53,
      status: 'approved'
    }
  ]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          companies!inner (id, name)
        `)
        .eq('company_id', user.id);
      
      if (error) throw error;
      
      setInternshipPostings(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePosting = async (postingId, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete the internship posting
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', postingId);

      if (error) throw error;

      // Also delete any related applications
      await supabase
        .from('applications')
        .delete()
        .eq('internship_id', postingId);

      toast({
        title: "Posting Deleted",
        description: `"${title}" has been successfully deleted.`,
      });

      // Refresh the data
      fetchInternships();
    } catch (error) {
      console.error('Error deleting posting:', error);
      toast({
        title: "Error",
        description: "Failed to delete posting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPosting = (posting) => {
    setEditingPost(posting);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (postingId, currentStatus, title) => {
    try {
      const newStatus = currentStatus ? false : true;
      const { error } = await supabase
        .from('internships')
        .update({ is_active: newStatus })
        .eq('id', postingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `"${title}" has been ${newStatus ? 'activated' : 'deactivated'}.`,
      });

      // Refresh the data
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockPostings = [
    {
      id: "1",
      title: "Software Engineering Intern",
      department: "Engineering",
      location: "Remote",
      applications: 25,
      status: "active",
    },
    {
      id: "2",
      title: "Product Management Intern",
      department: "Product",
      location: "New York, NY",
      applications: 15,
      status: "active",
    },
    {
      id: "3",
      title: "UX/UI Design Intern",
      department: "Design",
      location: "San Francisco, CA",
      applications: 5,
      status: "inactive",
    },
  ];

  const displayPostings = internshipPostings.length > 0 ? internshipPostings : mockPostings;

  const handlePostingSuccess = () => {
    fetchInternships(); // Refresh the list
  };

  // Application management functions
  const handleApproveApplication = (applicationId) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'approved' } : app
    ));
    toast({
      title: "Application Approved",
      description: "The application has been approved successfully.",
    });
  };

  const handleRejectApplication = (applicationId) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'rejected' } : app
    ));
    toast({
      title: "Application Rejected",
      description: "The application has been rejected.",
      variant: "destructive",
    });
  };

  const handleViewApplication = (application) => {
    toast({
      title: "Viewing Application",
      description: `Viewing application from ${application.applicant} for ${application.position}`,
    });
    // Here you could open a modal or navigate to a detailed view
  };

  const handleContactApplicant = (application) => {
    toast({
      title: "Contacting Applicant",
      description: `Opening contact options for ${application.applicant} (${application.email})`,
    });
    // Here you could open an email client or contact modal
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Enhanced Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/8 to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl opacity-30 pointer-events-none animate-gentle-drift" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl opacity-30 pointer-events-none animate-gentle-drift" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/6 rounded-full blur-2xl opacity-20 pointer-events-none animate-breathing" />
      {/* Collapsible Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: sidebarCollapsed ? 64 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col relative z-10 shadow-2xl transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <motion.div 
          className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3 py-4' : 'justify-between px-6 py-6'} border-b border-sidebar-border transition-all duration-300`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover">
            <span className="text-white font-bold text-lg">S</span>
          </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h1 className="text-md font-semibold text-sidebar-foreground">CareerCraft</h1>
            <p className="text-xs text-muted-foreground">Internship Platform</p>
              </motion.div>
            )}
          </div>
          {!sidebarCollapsed && (
            <Button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </Button>
          )}
        </motion.div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Button 
            onClick={() => {
              setActiveButton('dashboard');
              navigate('/company-dashboard');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'dashboard' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'dashboard' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">dashboard</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Dashboard
              </motion.span>
            )}
          </Button>
          
          <Button 
            onClick={() => {
              setActiveButton('postings');
              // Stay on same page, just change active state
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'postings' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'postings' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">work</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Postings
              </motion.span>
            )}
          </Button>
          
          <Button 
            onClick={() => {
              setActiveButton('applications');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'applications' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'applications' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">group</span>
            {!sidebarCollapsed && (
              <motion.span 
                className="text-sm font-medium relative z-10 ml-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Applications
              </motion.span>
            )}
          </Button>
          

        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          {sidebarCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  variant="ghost"
                  className="w-full justify-center rounded-xl min-h-[48px] hover:bg-primary/10"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p>Expand Sidebar</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
          <LogoutConfirmDialog>
                <Button variant="ghost" className={`nav-link w-full justify-start ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4'}`}>
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
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 animated-gradient">
        <div className="space-y-8">
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {activeButton === 'applications' ? 'Applications' : 
                 activeButton === 'postings' ? 'Internship Postings' : 
                 'Company Dashboard'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {activeButton === 'applications' 
                  ? 'Review and manage internship applications' 
                  : activeButton === 'postings'
                  ? 'Manage your company\'s internship opportunities'
                  : 'Overview of your company\'s performance and analytics'
                }
              </p>
            </div>
            {activeButton !== 'applications' && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <NewPostingForm onSuccess={handlePostingSuccess}>
              <Button className="btn-primary-glow flex items-center gap-2 px-6 py-3 rounded-xl shadow-elegant hover:shadow-floating">
                <span className="material-symbols-outlined text-base">add</span>
                <span>New Posting</span>
              </Button>
              </NewPostingForm>
            </motion.div>
            )}
          </motion.div>

          {/* Dashboard View */}
          {activeButton === 'dashboard' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="glass-card-premium p-6 card-interactive">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                        <motion.p 
                          className="mt-2 text-3xl font-bold font-display text-primary"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {applications.length}
                        </motion.p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full">
                        <span className="material-symbols-outlined text-primary text-xl">assignment</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="glass-card-premium p-6 card-interactive">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Postings</p>
                        <motion.p 
                          className="mt-2 text-3xl font-bold font-display text-green-600"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {displayPostings.length}
                        </motion.p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <span className="material-symbols-outlined text-green-600 text-xl">work</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="glass-card-premium p-6 card-interactive">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approved Applications</p>
                        <motion.p 
                          className="mt-2 text-3xl font-bold font-display text-blue-600"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {applications.filter(app => app.status === 'approved').length}
                        </motion.p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card className="glass-card-premium p-6 card-interactive">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                        <motion.p 
                          className="mt-2 text-3xl font-bold font-display text-orange-600"
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {applications.filter(app => app.status === 'pending').length}
                        </motion.p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <span className="material-symbols-outlined text-orange-600 text-xl">pending</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Activity and Top Applicants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card-premium p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application, index) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-sm">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{application.applicant}</p>
                          <p className="text-xs text-muted-foreground">{application.position}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={
                            application.status === 'approved' ? "bg-green-100 text-green-800" :
                            application.status === 'rejected' ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {application.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-card-premium p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Postings</h3>
                  <div className="space-y-4">
                    {displayPostings.slice(0, 3).map((posting, index) => (
                      <motion.div
                        key={posting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{posting.title}</p>
                          <p className="text-xs text-muted-foreground">{posting.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {posting.title === 'Content Creation Intern' ? '2' : 
                             posting.title === 'Visual Design Intern' ? '1' : '0'} apps
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : activeButton === 'applications' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card-premium overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/20">
                      <TableHead className="font-semibold">Applicant</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">Applied Date</TableHead>
                      <TableHead className="font-semibold text-center">Match Score</TableHead>
                      <TableHead className="font-semibold text-center">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application, index) => (
                      <motion.tr
                        key={application.id}
                        className="table-row-enhanced group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <TableCell className="font-medium">{application.applicant}</TableCell>
                        <TableCell>{application.position}</TableCell>
                        <TableCell>{application.appliedDate}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={application.matchScore >= 55 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                            {application.matchScore}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="secondary" 
                            className={
                              application.status === 'approved' ? "bg-green-100 text-green-800" :
                              application.status === 'rejected' ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-3"
                              onClick={() => handleViewApplication(application)}
                            >
                              View
                            </Button>
                            {application.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-3 text-green-600 hover:text-green-700"
                                  onClick={() => handleApproveApplication(application.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-3 text-red-600 hover:text-red-700"
                                  onClick={() => handleRejectApplication(application.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {application.status === 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3 text-blue-600 hover:text-blue-700"
                                onClick={() => handleContactApplicant(application)}
                              >
                                Contact
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          ) : (
            /* Postings Table */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card-premium overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/20">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold text-center">Applications</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading your postings...
                      </TableCell>
                    </TableRow>
                  ) : internshipPostings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No internship postings yet. Create your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    internshipPostings.map((posting, index) => (
                    <motion.tr
                        key={posting.id}
                      className="table-row-enhanced group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      whileHover={{ backgroundColor: "hsl(var(--accent) / 0.3)" }}
                    >
                      <TableCell className="font-medium text-foreground">{posting.title}</TableCell>
                        <TableCell className="text-muted-foreground">{posting.internship_type || 'Not specified'}</TableCell>
                      <TableCell className="text-muted-foreground">{posting.location}</TableCell>
                      <TableCell className="text-center">
                        <motion.span 
                          className="font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {posting.title === 'Content Creation Intern' ? '2' : 
                           posting.title === 'Visual Design Intern' ? '1' : 
                           posting.title === 'Product Strategy Intern' ? '0' :
                           posting.title === 'Associate Product Intern' ? '0' :
                           posting.title === 'Reasearch Intern OpenAI' ? '0' : '0'}
                        </motion.span>
                      </TableCell>
                      <TableCell className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Badge 
                              className={posting.is_active ? "status-approved" : "bg-muted text-muted-foreground"}
                          >
                              {posting.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-accent hover:text-primary transition-all duration-200"
                                onClick={() => handleEditPosting(posting)}
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                                onClick={() => handleDeletePosting(posting.id, posting.title)}
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
          )}
        </div>
      </main>

      {/* Edit Posting Modal */}
      <EditPostingModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        posting={editingPost}
        onPostingUpdated={fetchInternships}
      />
    </div>
  );
};

export default CompanyDashboard;