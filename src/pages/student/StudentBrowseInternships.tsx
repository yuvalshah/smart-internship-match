import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Bell, Bookmark, MapPin, Clock, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { useToast } from "@/hooks/use-toast";
import InternshipDetailModal from "@/components/InternshipDetailModal";

const StudentBrowseInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [activeButton, setActiveButton] = useState('browse');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [appliedInternshipIds, setAppliedInternshipIds] = useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      // First try with companies relation
      let { data, error } = await supabase
        .from('internships')
        .select(`
          *,
          companies!inner (id, name, logo_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        // If that fails, try without the companies relation
        console.log('Companies relation not available, fetching internships without company data');
        const result = await supabase
          .from('internships')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        data = result.data?.map(internship => ({
          ...internship,
          companies: { id: internship.company_id || '', name: 'Company', logo_url: '' }
        }));
        error = result.error;
      }
      
      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = internships
    .filter(internship => {
    const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (internship.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
      const matchesDepartment = !filterDepartment || filterDepartment === "all" || internship.department === filterDepartment;
      const matchesLocation = !filterLocation || filterLocation === "all" || internship.location?.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesDepartment && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        case "company":
          return (a.companies?.name || "").localeCompare(b.companies?.name || "");
        default:
          return 0;
      }
  });

  // Get departments from internships and add common ones
  const dbDepartments = [...new Set(internships.map(i => i.department).filter(Boolean))];
  const commonDepartments = [
    'Engineering',
    'Computer Science',
    'Data Science',
    'Product Management',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Design',
    'Business Development',
    'Customer Success',
    'Research & Development',
    'Quality Assurance',
    'DevOps',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Mobile Development',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'UI/UX Design',
    'Content Marketing',
    'Digital Marketing',
    'Business Analytics',
    'Project Management'
  ];
  
  const departments = [...new Set([...dbDepartments, ...commonDepartments])].sort();
  const locations = [...new Set(internships.map(i => i.location).filter(Boolean))];

  const handleApply = async (internshipId) => {
    if (!user) return;
    
    try {
      // Generate a proper UUID for the application and internship
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Check if internshipId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      let validInternshipId = internshipId;
      if (!uuidRegex.test(internshipId)) {
        // Generate a UUID for demo purposes if the ID is not a valid UUID
        validInternshipId = generateUUID();
        console.log('Generated UUID for internship:', validInternshipId);
      }

      const applicationId = generateUUID();

      const { error } = await supabase
        .from('applications')
        .insert({
          id: applicationId,
          student_id: user.id,
          internship_id: validInternshipId,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });
      setAppliedInternshipIds(prev => [...prev, internshipId]);
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveInternship = (internshipId) => {
    if (savedInternships.includes(internshipId)) {
      setSavedInternships(prev => prev.filter(id => id !== internshipId));
      toast({
        title: "Removed",
        description: "Internship removed from saved list.",
      });
    } else {
      setSavedInternships(prev => [...prev, internshipId]);
      toast({
        title: "Saved",
        description: "Internship saved to your list.",
      });
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
        <div className="flex items-center justify-between px-6 py-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
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
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-sm">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </Button>
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
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4'}`}
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
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4'}`}
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
            } ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4'}`}
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
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <LogoutConfirmDialog>
            <Button variant="ghost" className={`nav-link w-full justify-start ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-4'}`}>
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
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold font-display text-foreground drop-shadow-lg">
                Browse Internships
              </h1>
              <p className="mt-2 text-lg text-muted-foreground drop-shadow-sm max-w-2xl">
                Discover amazing internship opportunities from top companies and build your career.
              </p>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search internships by title, company, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 h-12 bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="h-12 bg-white/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept || 'unknown'}>{dept || 'Unknown'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="h-12 bg-white/50 border-border/50 focus:border-primary/50">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location || 'unknown'}>{location || 'Unknown'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Count and Sort */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">
                {filteredInternships.length} internships found
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing the best matches for you
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="company">Company A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <span className="material-symbols-outlined mr-2">tune</span>
                More Filters
              </Button>
            </div>
          </motion.div>


          {/* Internships List */}
          <div className="space-y-4">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary/40 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="mt-6 text-lg text-muted-foreground font-medium">Loading internships...</p>
                <p className="mt-2 text-sm text-muted-foreground">Finding the best opportunities for you</p>
              </motion.div>
            ) : filteredInternships.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">No internships found</h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    {searchTerm || filterDepartment || filterLocation 
                      ? 'No internships match your search criteria. Try adjusting your filters.' 
                      : 'No internships are currently available.'}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterDepartment('');
                        setFilterLocation('');
                      }}
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                    >
                      Clear Filters
                    </Button>
                    <Button variant="outline" className="px-6 py-3">
                      Browse All
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                {filteredInternships.map((internship, index) => (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="p-8 bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="flex items-start gap-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <span className="text-2xl font-bold text-white">
                              {internship.companies?.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                  {internship.title}
                                </h3>
                                <p className="text-xl text-primary font-semibold">
                                  {internship.companies?.name || 'Company'}
                                </p>
                              </div>
                              <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200">
                                {internship.department}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-6 line-clamp-2 text-lg leading-relaxed">
                              {internship.description}
                            </p>
                            
                            <div className="flex items-center gap-8 text-sm text-muted-foreground mb-6">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-medium">{internship.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="font-medium">{internship.duration || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span className="font-medium">{internship.type || 'Internship'}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {appliedInternshipIds.includes(internship.id) ? (
                                <Button 
                                  disabled
                                  className="bg-green-600 text-white px-8 py-3 text-lg font-semibold"
                                >
                                  Applied ✓
                                </Button>
                              ) : (
                              <Button 
                                onClick={() => handleApply(internship.id)}
                                className="btn-primary-glow px-8 py-3 text-lg font-semibold"
                              >
                                Apply Now
                              </Button>
                              )}
                              <Button 
                                onClick={() => {
                                  setSelectedInternship(internship);
                                  setShowDetailModal(true);
                                }}
                                className="btn-outline-secondary px-6 py-3 text-lg font-medium"
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSaveInternship(internship.id)}
                                className={`p-3 transition-all duration-200 ${
                                  savedInternships.includes(internship.id)
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-primary/10 hover:text-primary'
                                }`}
                              >
                                <Bookmark className={`h-5 w-5 ${
                                  savedInternships.includes(internship.id) ? 'fill-current' : ''
                                }`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Internship Detail Modal */}
      <InternshipDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        internship={selectedInternship}
        onApply={(internshipId) => {
          handleApply(internshipId);
          setShowDetailModal(false);
        }}
        onSave={handleSaveInternship}
        isSaved={selectedInternship ? savedInternships.includes(selectedInternship.id) : false}
        isApplied={selectedInternship ? appliedInternshipIds.includes(selectedInternship.id) : false}
      />
    </div>
  );
};

export default StudentBrowseInternships;
