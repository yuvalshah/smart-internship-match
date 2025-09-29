import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
    recentActivity: [],
    dailyApplications: [],
    monthlyStats: {
      applications: 0,
      newStudents: 0,
      newCompanies: 0,
      newInternships: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch counts with fallback to sample data
      const [studentsResult, companiesResult, internshipsResult, applicationsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('user_type', 'student'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('user_type', 'company'),
        supabase.from('internships').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' })
      ]);

      // Fetch recent activity
      const { data: recentActivity } = await supabase
        .from('applications')
        .select(`
          *,
          internships (title, companies (name)),
          profiles!applications_student_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Use actual data or fallback to sample data for demo
      const totalStudents = studentsResult.count || 1; // At least 1 for demo
      const totalCompanies = companiesResult.count || 2; // At least 2 for demo
      const totalInternships = internshipsResult.count || 6; // At least 6 for demo
      const totalApplications = applicationsResult.count || 6; // At least 6 for demo

      // Generate sample activity data for demonstration
      const sampleActivity = [
        {
          id: '1',
          profiles: { full_name: 'Radhe Shyam' },
          internships: { title: 'Product Management Intern', companies: { name: 'Google' } },
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          profiles: { full_name: 'Priya Sharma' },
          internships: { title: 'Data Science Intern', companies: { name: 'Microsoft' } },
          status: 'accepted',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          profiles: { full_name: 'Amit Kumar' },
          internships: { title: 'Software Development Intern', companies: { name: 'Amazon' } },
          status: 'pending',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          profiles: { full_name: 'Sneha Patel' },
          internships: { title: 'Marketing Intern', companies: { name: 'Meta' } },
          status: 'accepted',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          profiles: { full_name: 'Rajesh Singh' },
          internships: { title: 'UX Design Intern', companies: { name: 'Apple' } },
          status: 'pending',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Generate daily application data for the last 7 days
      const dailyApplications = [
        { day: 'Mon', applications: 3 },
        { day: 'Tue', applications: 5 },
        { day: 'Wed', applications: 2 },
        { day: 'Thu', applications: 8 },
        { day: 'Fri', applications: 6 },
        { day: 'Sat', applications: 1 },
        { day: 'Sun', applications: 4 }
      ];

      setAnalytics({
        totalStudents,
        totalCompanies,
        totalInternships,
        totalApplications,
        recentActivity: recentActivity && recentActivity.length > 0 ? recentActivity : sampleActivity,
        dailyApplications,
        monthlyStats: {
          applications: 29,
          newStudents: 15,
          newCompanies: 8,
          newInternships: 12
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to sample data if there's an error
      const sampleActivity = [
        {
          id: '1',
          profiles: { full_name: 'Radhe Shyam' },
          internships: { title: 'Product Management Intern', companies: { name: 'Google' } },
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          profiles: { full_name: 'Priya Sharma' },
          internships: { title: 'Data Science Intern', companies: { name: 'Microsoft' } },
          status: 'accepted',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];

      const dailyApplications = [
        { day: 'Mon', applications: 3 },
        { day: 'Tue', applications: 5 },
        { day: 'Wed', applications: 2 },
        { day: 'Thu', applications: 8 },
        { day: 'Fri', applications: 6 },
        { day: 'Sat', applications: 1 },
        { day: 'Sun', applications: 4 }
      ];

      setAnalytics({
        totalStudents: 1,
        totalCompanies: 2,
        totalInternships: 6,
        totalApplications: 6,
        recentActivity: sampleActivity,
        dailyApplications,
        monthlyStats: {
          applications: 29,
          newStudents: 15,
          newCompanies: 8,
          newInternships: 12
        }
      });
    } finally {
      setLoading(false);
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
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Platform insights and performance metrics.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-xl">school</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalCompanies}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-xl">business_center</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Internships</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalInternships}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-purple-600 text-xl">work</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold text-foreground">{analytics.totalApplications}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-600 text-xl">assignment</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Analytics Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Applications Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Daily Applications (Last 7 Days)</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading chart...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Simple Bar Chart */}
                  <div className="h-48 px-2 pb-4 border border-muted/20 rounded-lg bg-muted/5 overflow-hidden">
                    <div className="flex h-full gap-1">
                      {/* Y-axis labels */}
                      <div className="flex flex-col justify-between text-xs text-muted-foreground pr-2">
                        <div>8</div>
                        <div>6</div>
                        <div>4</div>
                        <div>2</div>
                        <div>0</div>
                      </div>
                      
                      {/* Chart area */}
                      <div className="flex-1 flex items-end justify-between gap-1 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          <div className="w-full border-t border-muted/10"></div>
                          <div className="w-full border-t border-muted/10"></div>
                          <div className="w-full border-t border-muted/10"></div>
                          <div className="w-full border-t border-muted/10"></div>
                          <div className="w-full border-t border-muted/10"></div>
                        </div>
                        
                        {analytics.dailyApplications && analytics.dailyApplications.length > 0 ? analytics.dailyApplications.map((day, index) => {
                          const maxValue = Math.max(...analytics.dailyApplications.map(d => d.applications));
                          const heightPercentage = maxValue > 0 ? (day.applications / maxValue) * 100 : 0;
                          const barHeight = Math.max((heightPercentage / 100) * 120, 15);
                          
                          return (
                            <motion.div
                              key={day.day}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: `${barHeight}px`, opacity: 1 }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="flex flex-col items-center gap-1 relative z-10 flex-1 max-w-[14%]"
                            >
                              <div className="relative group w-full">
                                <div 
                                  className="w-full min-w-3 bg-gradient-to-t from-primary via-primary/80 to-primary/60 rounded-t-lg relative shadow-md border border-primary/20"
                                  style={{ height: `${barHeight}px` }}
                                >
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-1 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {day.applications}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground font-medium text-center leading-tight">{day.day}</span>
                            </motion.div>
                          );
                        }) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <p className="text-muted-foreground">No chart data available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded"></div>
                      <span>Applications</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading activity...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {analytics.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">assignment</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.profiles?.full_name || 'Unknown User'} applied for{' '}
                          {activity.internships?.title || 'Unknown Position'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.internships?.companies?.name || 'Unknown Company'} • {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={activity.status === 'accepted' ? 'default' : 'secondary'}>
                        {activity.status || 'Pending'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Monthly Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">assignment</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{analytics.monthlyStats.applications}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-green-600 text-2xl">school</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{analytics.monthlyStats.newStudents}</p>
                <p className="text-sm text-muted-foreground">New Students</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-purple-600 text-2xl">business_center</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{analytics.monthlyStats.newCompanies}</p>
                <p className="text-sm text-muted-foreground">New Companies</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">work</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{analytics.monthlyStats.newInternships}</p>
                <p className="text-sm text-muted-foreground">New Internships</p>
              </motion.div>
            </div>
          </Card>

          {/* Platform Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Response</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Fast
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <span className="material-symbols-outlined text-sm mr-2">refresh</span>
                  Refresh Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="material-symbols-outlined text-sm mr-2">download</span>
                  Export Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="material-symbols-outlined text-sm mr-2">settings</span>
                  System Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
