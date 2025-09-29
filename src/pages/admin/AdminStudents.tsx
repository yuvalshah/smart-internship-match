import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminStudents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          applications (
            id,
            status,
            created_at,
            internships (
              title,
              companies (name)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const handleSuspendStudent = async (studentId, studentName) => {
    toast({
      title: "Feature Coming Soon",
      description: "Student suspension functionality will be implemented soon.",
    });
  };

  const handleActivateStudent = async (studentId, studentName) => {
    toast({
      title: "Feature Coming Soon",
      description: "Student activation functionality will be implemented soon.",
    });
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!confirm(`Are you sure you want to delete ${studentName}? This will also delete all their applications.`)) {
      return;
    }

    try {
      // Delete related applications first
      await supabase
        .from('applications')
        .delete()
        .eq('student_id', studentId);

      // Delete the student
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Student Deleted",
        description: `${studentName} and all their applications have been deleted.`,
      });

      fetchStudents(); // Refresh the data
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/8 to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl opacity-30 pointer-events-none" />
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col relative z-10 shadow-2xl">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              pie_chart
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-sidebar-foreground">CareerCraft</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Button 
            onClick={() => window.history.back()}
            className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:shadow-md transition-all duration-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative z-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                Students Management
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage and monitor all student accounts and activities.
              </p>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">school</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold text-foreground">{students.filter(s => s.is_active !== false).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => {
                      const created = new Date(s.created_at);
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-xl">trending_up</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Students List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <Card className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">school</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No students match your search criteria.' : 'No students have registered yet.'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {student.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {student.name || 'Unknown Student'}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {student.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default">
                              Active
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Joined {new Date(student.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
                              {student.applications?.length || 0} application{student.applications?.length !== 1 ? 's' : ''} submitted
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleViewProfile(student)}
                            >
                              View Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Student Profile</DialogTitle>
                              <DialogDescription>
                                Detailed information about {student.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={student.avatar_url} />
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                    {student.name?.charAt(0) || 'S'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold">{student.name}</h3>
                                  <p className="text-muted-foreground">{student.email}</p>
                                  <Badge variant="default">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Student Details</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Joined:</strong> {new Date(student.created_at).toLocaleDateString()}
                                  </p>
                                  {student.phone_number && (
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Phone:</strong> {student.phone_number}
                                    </p>
                                  )}
                                  {student.university && (
                                    <p className="text-sm text-muted-foreground">
                                      <strong>University:</strong> {student.university}
                                    </p>
                                  )}
                                  {student.major && (
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Major:</strong> {student.major}
                                    </p>
                                  )}
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Activity</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Applications Submitted:</strong> {student.applications?.length || 0}
                                  </p>
                                  {student.applications && student.applications.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Recent Applications:</p>
                                      <ul className="text-sm text-muted-foreground">
                                        {student.applications.slice(0, 3).map((application) => (
                                          <li key={application.id}>
                                            • {application.internships?.title} at {application.internships?.companies?.name}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <span className="material-symbols-outlined text-sm">more_vert</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                              <span className="material-symbols-outlined text-sm mr-2">visibility</span>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendStudent(student.id, student.name)}>
                              <span className="material-symbols-outlined text-sm mr-2">pause</span>
                              Suspend (Coming Soon)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              className="text-destructive focus:text-destructive"
                            >
                              <span className="material-symbols-outlined text-sm mr-2">delete</span>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminStudents;
