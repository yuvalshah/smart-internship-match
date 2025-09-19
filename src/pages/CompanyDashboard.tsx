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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar/80 backdrop-blur-sm border-r border-sidebar-border flex flex-col">
        <div className="p-6 flex items-center gap-4 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-md font-semibold text-sidebar-foreground">Smart PM</h1>
            <p className="text-xs text-muted-foreground">Internship Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="nav-link">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="nav-link nav-link-active">
            <span className="material-symbols-outlined">work</span>
            <span className="text-sm font-semibold">Postings</span>
          </div>
          <div className="nav-link">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Applications</span>
          </div>
          <div className="nav-link">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className="nav-link">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Internship Postings</h2>
            <Button className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-subtle hover:-translate-y-0.5 active:translate-y-0">
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Posting</span>
            </Button>
          </div>

          {/* Postings Table */}
          <Card className="animate-fade-in-up">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Title</TableHead>
                  <TableHead className="font-medium">Department</TableHead>
                  <TableHead className="font-medium">Location</TableHead>
                  <TableHead className="font-medium text-center">Applications</TableHead>
                  <TableHead className="font-medium text-center">Status</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internshipPostings.map((posting, index) => (
                  <TableRow key={index} className="hover:bg-accent/40 transition-colors duration-300">
                    <TableCell className="font-medium text-foreground">{posting.title}</TableCell>
                    <TableCell className="text-muted-foreground">{posting.department}</TableCell>
                    <TableCell className="text-muted-foreground">{posting.location}</TableCell>
                    <TableCell className="text-center font-medium text-foreground">
                      {posting.applications}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={posting.status === "active" ? "status-approved" : "bg-muted text-muted-foreground"}
                      >
                        {posting.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-2 hover:bg-accent hover:text-primary transition-all duration-200"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;