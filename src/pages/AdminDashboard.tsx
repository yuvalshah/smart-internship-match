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

const AdminDashboard = () => {
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
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              pie_chart
            </span>
          </div>
          <h1 className="text-xl font-bold font-display text-sidebar-foreground">SmartPM</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="nav-link nav-link-active">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </div>
          <div className="nav-link">
            <span className="material-symbols-outlined">school</span>
            <span className="text-sm font-medium">Students</span>
          </div>
          <div className="nav-link">
            <span className="material-symbols-outlined">business_center</span>
            <span className="text-sm font-medium">Companies</span>
          </div>
          <div className="nav-link">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm font-medium">Analytics</span>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="nav-link">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </div>
          <Link to="/" className="nav-link">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-10 radial-glow">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back, Admin! Manage your platform with ease.
            </p>
          </div>

          {/* Analytics Cards */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="mt-2 text-3xl font-bold font-display text-primary">250</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                <p className="mt-2 text-3xl font-bold font-display text-primary">50</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Active Internships</p>
                <p className="mt-2 text-3xl font-bold font-display text-primary">120</p>
              </Card>
            </div>
          </div>

          {/* Pending Sign-ups */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Pending Sign-ups</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSignups.map((signup, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{signup.name}</TableCell>
                      <TableCell className="text-muted-foreground">{signup.email}</TableCell>
                      <TableCell className="text-muted-foreground">{signup.role}</TableCell>
                      <TableCell>
                        <Badge className={signup.status === "pending" ? "status-pending" : "status-approved"}>
                          {signup.status === "pending" ? "Pending" : "Approved"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {signup.status === "pending" ? (
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
                            View Profile
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

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