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
import { ProfileDetailModal } from "@/components/ProfileDetailModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sendNotification } = useNotifications();
  const { toast } = useToast();
  const [studentCount, setStudentCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);
  const [activeButton, setActiveButton] = useState('dashboard');
  const [pendingInternships, setPendingInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{type: 'student' | 'company', id: string} | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingSignups, setPendingSignups] = useState([
    {
      id: 1,
      name: 'Radhe Shyam',
      email: 'tudj@gmail.com',
      role: 'student',
      status: 'pending'
    },
    {
      id: 2,
      name: 'TechCorp Solutions',
      email: 'hr@techcorp.com',
      role: 'company',
      status: 'pending'
    }
  ]);

  // Fetch real data from Supabase
  const fetchData = async () => {
    try {
      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      setStudentCount(studentsCount || 0);

      // Fetch companies count
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
      setCompanyCount(companiesCount || 0);

      // Fetch internships count
      const { count: internshipsCount } = await supabase
        .from('internships')
        .select('*', { count: 'exact', head: true });
      setInternshipCount(internshipsCount || 0);

      // Fetch all internships (both approved and pending)
      const { data: internships, error } = await supabase
        .from('internships')
        .select(`
          *,
          companies (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching internships:', error);
      } else {
        setPendingInternships(internships || []);
      }

      // Fetch recent activity (applications and new postings)
      const { data: recentApplications } = await supabase
        .from('applications')
        .select(`
          id,
          created_at,
          status,
          students (name),
          internships (title, companies (name))
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentPostings } = await supabase
        .from('internships')
        .select(`
          id,
          created_at,
          title,
          is_approved,
          companies (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort recent activity
      const activity = [
        ...(recentApplications || []).map(app => ({
          id: app.id,
          type: 'application',
          title: `${app.students?.name || 'Student'} applied for ${app.internships?.title || 'internship'}`,
          subtitle: `at ${app.internships?.companies?.name || 'company'}`,
          status: app.status,
          timestamp: app.created_at,
          icon: 'assignment'
        })),
        ...(recentPostings || []).map(posting => ({
          id: posting.id,
          type: 'posting',
          title: `${posting.companies?.name || 'Company'} posted "${posting.title}"`,
          subtitle: posting.is_approved ? 'Approved' : 'Pending approval',
          status: posting.is_approved ? 'approved' : 'pending',
          timestamp: posting.created_at,
          icon: 'work'
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions for admin actions
  const handleApproveSignup = (signupId: number) => {
    setPendingSignups(prev => prev.map(signup => 
      signup.id === signupId ? { ...signup, status: 'approved' } : signup
    ));
    toast({
      title: "Signup Approved",
      description: "The user signup has been approved successfully.",
    });
  };

  const handleRejectSignup = (signupId: number) => {
    setPendingSignups(prev => prev.map(signup => 
      signup.id === signupId ? { ...signup, status: 'rejected' } : signup
    ));
    toast({
      title: "Signup Rejected",
      description: "The user signup has been rejected.",
      variant: "destructive",
    });
  };

  const handleRefreshData = () => {
    fetchData();
    setLastRefresh(new Date());
    toast({
      title: "Data Refreshed",
      description: "All dashboard data has been refreshed.",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Generating and downloading platform report...",
    });
    // Here you would implement actual export functionality
  };

  const handleSystemSettings = () => {
    toast({
      title: "System Settings",
      description: "Opening system configuration panel...",
    });
    // Here you would open a settings modal or navigate to settings page
  };

  useEffect(() => {
    fetchData();
    
    // Set up automatic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
    setLastRefresh(new Date());
  };

  // Functions to approve/reject internships
  const handleApproveInternship = async (internshipId: string, companyId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({ is_approved: true, is_active: true })
        .eq('id', internshipId);

      if (error) throw error;

      // Notify the company about approval
      await sendNotification(
        companyId,
        'company',
        'Posting Approved',
        `Your internship posting "${title}" has been approved and is now live!`,
        'system',
        'internship',
        internshipId
      );

      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error approving internship:', error);
    }
  };

  const handleRejectInternship = async (internshipId: string, companyId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({ is_approved: false, is_active: false })
        .eq('id', internshipId);

      if (error) throw error;

      // Notify the company about rejection
      await sendNotification(
        companyId,
        'company',
        'Posting Rejected',
        `Your internship posting "${title}" has been rejected. Please review and resubmit.`,
        'system',
        'internship',
        internshipId
      );

      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting internship:', error);
    }
  };

  const internshipPostings = [
    {
      company: "Tech Innovators Inc.",
      title: "Software Engineering Intern",
      location: "Remote",
      status: "pending",
    },
    {
      company: "Global Solutions Ltd.",
      title: "Product Management Intern",
      location: "New York, NY",
      status: "approved",
    },
    {
      company: "Creative Minds Co.",
      title: "UX/UI Design Intern",
      location: "San Francisco, CA",
      status: "rejected",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
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
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover">
            <span className="material-symbols-outlined text-white text-xl">
              pie_chart
            </span>
          </div>
            {!sidebarCollapsed && (
              <motion.h1 
                className="text-xl font-bold font-display text-sidebar-foreground"
                initial={{ opacity: 1 }}
                animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                CareerCraft
              </motion.h1>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          <Button 
            onClick={() => {
              setActiveButton('dashboard');
              navigate('/admin-dashboard');
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
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right" className="ml-2">
                  <p>Dashboard</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          <Tooltip>
            <TooltipTrigger asChild>
          <Button 
            onClick={() => {
              setActiveButton('students');
              navigate('/admin/students');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'students' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
                } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'students' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">school</span>
                {!sidebarCollapsed && (
                  <motion.span 
                    className="text-sm font-medium relative z-10 ml-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    Students
                  </motion.span>
            )}
          </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <p>Students</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
          <Button 
            onClick={() => {
              setActiveButton('companies');
              navigate('/admin/companies');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'companies' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
                } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'companies' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">business_center</span>
                {!sidebarCollapsed && (
                  <motion.span 
                    className="text-sm font-medium relative z-10 ml-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    Companies
                  </motion.span>
            )}
          </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <p>Companies</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
          <Button 
            onClick={() => {
              setActiveButton('analytics');
              navigate('/admin/analytics');
            }}
            className={`w-full justify-start transition-all duration-300 group relative overflow-hidden ${
              activeButton === 'analytics' 
                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                : 'hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-102'
                } ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent transition-opacity duration-300 ${
              activeButton === 'analytics' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
            <span className="material-symbols-outlined relative z-10">analytics</span>
                {!sidebarCollapsed && (
                  <motion.span 
                    className="text-sm font-medium relative z-10 ml-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: sidebarCollapsed ? 0 : 1, x: sidebarCollapsed ? -10 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    Analytics
                  </motion.span>
            )}
          </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="ml-2">
                <p>Analytics</p>
              </TooltipContent>
            )}
          </Tooltip>
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
                <Button variant="ghost" className={`nav-link w-full justify-start ${sidebarCollapsed ? 'px-3 py-3 justify-center rounded-xl min-h-[48px]' : 'px-4 py-3 rounded-lg'}`}>
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
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 animated-gradient">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold font-display text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back, Admin! Manage your platform with ease.
            </p>
          </motion.div>

          {/* Analytics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="glass-card-premium p-6 card-interactive">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <motion.p 
                        className="mt-2 text-3xl font-bold font-display text-primary"
                        key={studentCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {studentCount}
                      </motion.p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <span className="material-symbols-outlined text-primary text-xl">school</span>
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
                      <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                      <motion.p 
                        className="mt-2 text-3xl font-bold font-display text-primary"
                        key={companyCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {companyCount}
                      </motion.p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-full">
                      <span className="material-symbols-outlined text-secondary text-xl">business_center</span>
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
                      <p className="text-sm font-medium text-muted-foreground">Active Internships</p>
                      <motion.p 
                        className="mt-2 text-3xl font-bold font-display text-primary"
                        key={internshipCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {internshipCount}
                      </motion.p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-full">
                      <span className="material-symbols-outlined text-success text-xl">work</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Pending Sign-ups */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Pending Sign-ups</h2>
            <Card className="glass-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/20">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSignups.map((signup, index) => (
                  <motion.tr
                      key={signup.id}
                    className="table-row-enhanced group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      <TableCell className="font-medium">{signup.name}</TableCell>
                      <TableCell>{signup.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={signup.role === 'student' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                          {signup.role.charAt(0).toUpperCase() + signup.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            signup.status === 'approved' ? "bg-green-100 text-green-800" :
                            signup.status === 'rejected' ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {signup.status.charAt(0).toUpperCase() + signup.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {signup.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3"
                                onClick={() => handleApproveSignup(signup.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3 text-red-600 hover:text-red-700"
                                onClick={() => handleRejectSignup(signup.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {signup.status === 'approved' && (
                            <Button size="sm" variant="outline" className="h-8 px-3 text-green-600">
                              Approved
                            </Button>
                          )}
                          {signup.status === 'rejected' && (
                            <Button size="sm" variant="outline" className="h-8 px-3 text-red-600">
                              Rejected
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

          {/* Analytics & Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Analytics & Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Timeline with Charts */}
              <Card className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Platform Activity</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleRefreshData}>
                      <span className="material-symbols-outlined text-sm mr-1">refresh</span>
                      Refresh
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleExportReport}>
                      <span className="material-symbols-outlined text-sm mr-1">download</span>
                      Export
                    </Button>
                </div>
                  </div>
                
                {/* Activity Chart Visualization */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Activity Over Time</h4>
                  <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 flex items-end justify-between">
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Mon</span>
                </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-green-500 rounded-t" style={{height: '80%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Tue</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-orange-500 rounded-t" style={{height: '45%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Wed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-purple-500 rounded-t" style={{height: '90%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Thu</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-red-500 rounded-t" style={{height: '70%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Fri</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-indigo-500 rounded-t" style={{height: '85%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Sat</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 bg-pink-500 rounded-t" style={{height: '95%'}}></div>
                      <span className="text-xs text-muted-foreground mt-2">Sun</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">New Student Registration</p>
                        <p className="text-xs text-muted-foreground">Radhe Shyam joined the platform</p>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </div>
                      </div>
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">work</span>
                </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">New Internship Posted</p>
                        <p className="text-xs text-muted-foreground">Content Creation Intern in Surat</p>
                        <span className="text-xs text-muted-foreground">4 hours ago</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">assignment</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">Student applied for Visual Design Intern</p>
                        <span className="text-xs text-muted-foreground">6 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Activity Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Activity Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Applications</span>
                    </div>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">New Postings</span>
                    </div>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Approved</span>
                    </div>
                    <span className="font-medium">1</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border/20">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleRefreshData}
                    >
                      <span className="material-symbols-outlined text-sm mr-2">refresh</span>
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleExportReport}
                    >
                      <span className="material-symbols-outlined text-sm mr-2">download</span>
                      Export Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleSystemSettings}
                    >
                      <span className="material-symbols-outlined text-sm mr-2">settings</span>
                      System Settings
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* User Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Current User Profile</h2>
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Admin User</h3>
                  <p className="text-muted-foreground">Platform Administrator</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      Admin
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Admin Stats */}
              <div className="mt-6 pt-6 border-t border-border/20">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Admin Actions Today</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-xs text-muted-foreground">Approvals</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-xs text-muted-foreground">Rejections</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-50">
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-purple-50">
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-xs text-muted-foreground">Exports</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Internship Postings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">All Internship Postings</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefreshData}
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-sm mr-1">refresh</span>
                  Refresh
                </Button>
              </div>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading internship postings...
                      </TableCell>
                    </TableRow>
                  ) : pendingInternships.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No internship postings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingInternships.map((posting) => (
                      <TableRow key={posting.id}>
                        <TableCell className="font-medium">
                          {posting.companies?.name || 'Unknown Company'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{posting.title}</TableCell>
                        <TableCell className="text-muted-foreground">{posting.location}</TableCell>
                        <TableCell>
                          <Badge className={posting.is_approved ? "status-approved" : "status-pending"}>
                            {posting.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!posting.is_approved ? (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="btn-primary-glow"
                                onClick={() => handleApproveInternship(posting.id, posting.company_id, posting.title)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectInternship(posting.id, posting.company_id, posting.title)}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-primary hover:underline">
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectInternship(posting.id, posting.company_id, posting.title)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </main>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        profileType={selectedProfile?.type || 'student'}
        profileId={selectedProfile?.id || ''}
      />
    </div>
  );
};

export default AdminDashboard;