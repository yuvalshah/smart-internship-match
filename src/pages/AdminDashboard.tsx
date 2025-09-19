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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    animateCounter(250, setStudentCount);
    animateCounter(50, setCompanyCount);
    animateCounter(120, setInternshipCount);
  }, []);

  const pendingSignups = [
    {
      name: "Ethan Harper",
      email: "ethan.harper@email.com",
      role: "Student",
      status: "pending",
    },
    {
      name: "Olivia Bennett",
      email: "olivia.bennett@email.com",
      role: "Company",
      status: "pending",
    },
    {
      name: "Noah Carter",
      email: "noah.carter@email.com",
      role: "Student",
      status: "approved",
    },
  ];

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
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 glass-card border-r border-sidebar-border flex flex-col"
      >
        <motion.div 
          className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover">
            <span className="material-symbols-outlined text-white text-xl">
              pie_chart
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-sidebar-foreground">SmartPM</h1>
        </motion.div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <motion.div 
            className="nav-link nav-link-active group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </motion.div>
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">school</span>
            <span className="text-sm font-medium">Students</span>
          </motion.div>
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">business_center</span>
            <span className="text-sm font-medium">Companies</span>
          </motion.div>
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm font-medium">Analytics</span>
          </motion.div>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </motion.div>
          <Link to="/">
            <motion.div 
              className="nav-link group"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </motion.div>
          </Link>
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
                      key={index}
                      className="table-row-enhanced group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      whileHover={{ backgroundColor: "hsl(var(--accent) / 0.3)" }}
                    >
                      <TableCell className="font-medium">{signup.name}</TableCell>
                      <TableCell className="text-muted-foreground">{signup.email}</TableCell>
                      <TableCell className="text-muted-foreground">{signup.role}</TableCell>
                      <TableCell>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Badge className={signup.status === "pending" ? "status-pending" : "status-approved"}>
                            {signup.status === "pending" ? "Pending" : "Approved"}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        {signup.status === "pending" ? (
                          <div className="flex gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button size="sm" className="btn-primary">
                                Approve
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button size="sm" variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                                Reject
                              </Button>
                            </motion.div>
                          </div>
                        ) : (
                          <Button variant="link" size="sm" className="text-primary hover:underline p-0">
                            View Profile
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>

          {/* Internship Postings */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Internship Postings</h2>
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
                  {internshipPostings.map((posting, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{posting.company}</TableCell>
                      <TableCell className="text-muted-foreground">{posting.title}</TableCell>
                      <TableCell className="text-muted-foreground">{posting.location}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            posting.status === "pending" ? "status-pending" :
                            posting.status === "approved" ? "status-approved" : "status-rejected"
                          }
                        >
                          {posting.status.charAt(0).toUpperCase() + posting.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {posting.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button variant="link" size="sm" className="text-primary hover:underline p-0">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;