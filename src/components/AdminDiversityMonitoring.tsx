import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Users, MapPin, TrendingUp, Award, BarChart3, Download } from 'lucide-react';

interface DiversityStats {
  totalStudents: number;
  totalCompanies: number;
  totalInternships: number;
  allocationRate: number;
  categoryDistribution: {
    general: number;
    sc: number;
    st: number;
    obc: number;
    ews: number;
    pwd: number;
    minority: number;
  };
  ruralUrbanDistribution: {
    rural: number;
    urban: number;
  };
  stateDistribution: Record<string, number>;
  firstTimeVsReturning: {
    firstTime: number;
    returning: number;
  };
}

const AdminDiversityMonitoring: React.FC = () => {
  const [stats, setStats] = useState<DiversityStats | null>(null);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching diversity stats
    setTimeout(() => {
      setStats({
        totalStudents: 12500,
        totalCompanies: 450,
        totalInternships: 3200,
        allocationRate: 78.5,
        categoryDistribution: {
          general: 45,
          sc: 18,
          st: 12,
          obc: 15,
          ews: 8,
          pwd: 1.5,
          minority: 0.5
        },
        ruralUrbanDistribution: {
          rural: 35,
          urban: 65
        },
        stateDistribution: {
          'Maharashtra': 25,
          'Karnataka': 18,
          'Tamil Nadu': 15,
          'Delhi': 12,
          'Gujarat': 10,
          'Others': 20
        },
        firstTimeVsReturning: {
          firstTime: 68,
          returning: 32
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sc': return 'bg-blue-100 text-blue-800';
      case 'st': return 'bg-green-100 text-green-800';
      case 'obc': return 'bg-yellow-100 text-yellow-800';
      case 'ews': return 'bg-purple-100 text-purple-800';
      case 'pwd': return 'bg-pink-100 text-pink-800';
      case 'minority': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'sc': return 'Scheduled Caste (SC)';
      case 'st': return 'Scheduled Tribe (ST)';
      case 'obc': return 'Other Backward Classes (OBC)';
      case 'ews': return 'Economically Weaker Section (EWS)';
      case 'pwd': return 'Person with Disability (PwD)';
      case 'minority': return 'Minority';
      default: return 'General';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Diversity & Equity Monitoring</h2>
          <p className="text-muted-foreground">Track participation and allocation metrics across categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allocation Rate</p>
                <p className="text-2xl font-bold">{stats.allocationRate}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Internships</p>
                <p className="text-2xl font-bold">{stats.totalInternships.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
                <p className="text-2xl font-bold">{stats.totalCompanies}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Social Category Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.categoryDistribution).map(([category, percentage]) => (
              <div key={category} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-primary">
                    {percentage}%
                  </span>
                </div>
                <Badge className={getCategoryColor(category)}>
                  {getCategoryName(category)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Rural vs Urban */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Rural vs Urban Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rural</span>
                <span className="font-semibold">{stats.ruralUrbanDistribution.rural}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${stats.ruralUrbanDistribution.rural}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Urban</span>
                <span className="font-semibold">{stats.ruralUrbanDistribution.urban}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: `${stats.ruralUrbanDistribution.urban}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Participation Type</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">First-time Participants</span>
                <span className="font-semibold">{stats.firstTimeVsReturning.firstTime}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.firstTimeVsReturning.firstTime}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Returning Participants</span>
                <span className="font-semibold">{stats.firstTimeVsReturning.returning}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${stats.firstTimeVsReturning.returning}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* State Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">State-wise Distribution</h3>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {Object.keys(stats.stateDistribution).map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.stateDistribution).map(([state, percentage]) => (
              <div key={state} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-primary">
                    {percentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{state}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Policy Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Policy Controls & Quota Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Affirmative Action Weights</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">SC/ST Priority</span>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">OBC Priority</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">EWS Priority</span>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Regional Allocation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Rural Preference</span>
                  <Badge variant="secondary">30%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Aspirational Districts</span>
                  <Badge variant="secondary">15%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remote Work</span>
                  <Badge variant="secondary">20%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">AI Model Settings</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Location Weight</span>
                  <Badge variant="secondary">30%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Skills Weight</span>
                  <Badge variant="secondary">25%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Quota Weight</span>
                  <Badge variant="secondary">20%</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDiversityMonitoring;
