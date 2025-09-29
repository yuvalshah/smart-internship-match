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

const AdminCompanies = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          internships (
            id,
            title,
            is_approved,
            is_active,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (company) => {
    setSelectedCompany(company);
  };

  const handleSuspendCompany = async (companyId, companyName) => {
    toast({
      title: "Feature Coming Soon",
      description: "Company suspension functionality will be implemented soon.",
    });
  };

  const handleActivateCompany = async (companyId, companyName) => {
    toast({
      title: "Feature Coming Soon",
      description: "Company activation functionality will be implemented soon.",
    });
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!confirm(`Are you sure you want to delete ${companyName}? This will also delete all their internship postings.`)) {
      return;
    }

    try {
      // Delete related internships first
      await supabase
        .from('internships')
        .delete()
        .eq('company_id', companyId);

      // Delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Company Deleted",
        description: `${companyName} and all their postings have been deleted.`,
      });

      fetchCompanies(); // Refresh the data
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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
      <main className="flex-1 overflow-y-auto p-8 lg:p-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                Companies Management
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage and monitor all company accounts and their postings.
              </p>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold text-foreground">{companies.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">business_center</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold text-foreground">{companies.filter(c => c.is_active !== false).length}</p>
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
                    {companies.filter(c => {
                      const created = new Date(c.created_at);
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
                  placeholder="Search companies by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Companies List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading companies...</p>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <Card className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">business_center</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No companies match your search criteria.' : 'No companies have registered yet.'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={company.logo_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {company.name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {company.name || 'Unknown Company'}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {company.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="default">
                              Active
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Joined {new Date(company.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">
                              {company.internships?.length || 0} internship{company.internships?.length !== 1 ? 's' : ''} posted
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
                              onClick={() => handleViewProfile(company)}
                            >
                              View Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Company Profile</DialogTitle>
                              <DialogDescription>
                                Detailed information about {company.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={company.logo_url} />
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                    {company.name?.charAt(0) || 'C'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold">{company.name}</h3>
                                  <p className="text-muted-foreground">{company.email}</p>
                                  <Badge variant="default">
                                    Active
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Company Details</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Joined:</strong> {new Date(company.created_at).toLocaleDateString()}
                                  </p>
                                  {company.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      <strong>Description:</strong> {company.description}
                                    </p>
                                  )}
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Activity</h4>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Internships Posted:</strong> {company.internships?.length || 0}
                                  </p>
                                  {company.internships && company.internships.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Recent Postings:</p>
                                      <ul className="text-sm text-muted-foreground">
                                        {company.internships.slice(0, 3).map((internship) => (
                                          <li key={internship.id}>• {internship.title}</li>
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
                            <DropdownMenuItem onClick={() => handleViewProfile(company)}>
                              <span className="material-symbols-outlined text-sm mr-2">visibility</span>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendCompany(company.id, company.name)}>
                              <span className="material-symbols-outlined text-sm mr-2">pause</span>
                              Suspend (Coming Soon)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCompany(company.id, company.name)}
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

export default AdminCompanies;
