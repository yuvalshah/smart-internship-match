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

const CompanyDashboard = () => {
  const internshipPostings = [
    {
      title: "Software Engineering Intern",
      department: "Engineering",
      location: "Remote",
      applications: 25,
      status: "active",
    },
    {
      title: "Product Management Intern",
      department: "Product",
      location: "New York, NY",
      applications: 15,
      status: "active",
    },
    {
      title: "UX/UI Design Intern",
      department: "Design",
      location: "San Francisco, CA",
      applications: 5,
      status: "inactive",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 glass-card border-r border-sidebar-border flex flex-col"
      >
        <motion.div 
          className="p-6 flex items-center gap-4 border-b border-sidebar-border"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-warm glow-on-hover">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-md font-semibold text-sidebar-foreground">Smart PM</h1>
            <p className="text-xs text-muted-foreground">Internship Platform</p>
          </div>
        </motion.div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </motion.div>
          <motion.div 
            className="nav-link nav-link-active group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">work</span>
            <span className="text-sm font-semibold">Postings</span>
          </motion.div>
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Applications</span>
          </motion.div>
          <motion.div 
            className="nav-link group"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </motion.div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
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
              <h2 className="text-3xl font-bold text-foreground">Internship Postings</h2>
              <p className="text-muted-foreground mt-1">Manage your company's internship opportunities</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="btn-primary-glow flex items-center gap-2 px-6 py-3 rounded-xl shadow-elegant hover:shadow-floating">
                <span className="material-symbols-outlined text-base">add</span>
                <span>New Posting</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Postings Table */}
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
                  {internshipPostings.map((posting, index) => (
                    <motion.tr
                      key={index}
                      className="table-row-enhanced group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      whileHover={{ backgroundColor: "hsl(var(--accent) / 0.3)" }}
                    >
                      <TableCell className="font-medium text-foreground">{posting.title}</TableCell>
                      <TableCell className="text-muted-foreground">{posting.department}</TableCell>
                      <TableCell className="text-muted-foreground">{posting.location}</TableCell>
                      <TableCell className="text-center">
                        <motion.span 
                          className="font-medium text-foreground bg-primary/10 px-3 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {posting.applications}
                        </motion.span>
                      </TableCell>
                      <TableCell className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Badge 
                            className={posting.status === "active" ? "status-approved" : "bg-muted text-muted-foreground"}
                          >
                            {posting.status === "active" ? "Active" : "Inactive"}
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
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;