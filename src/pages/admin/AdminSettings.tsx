import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName: "CareerCraft",
    platformDescription: "Smart Internship Matching Platform",
    allowStudentRegistration: true,
    allowCompanyRegistration: true,
    requireAdminApproval: false,
    maxApplicationsPerStudent: 10,
    notificationEmail: "admin@smartpm.com",
    supportEmail: "support@smartpm.com"
  });

  const handleSave = () => {
    // TODO: Implement save to Supabase
    alert('Settings saved successfully!');
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
                Platform Settings
              </h1>
              <p className="mt-1 text-muted-foreground">
                Configure platform settings and preferences.
              </p>
            </div>
            <Button onClick={handleSave} className="btn-primary-glow">
              Save Changes
            </Button>
          </div>

          {/* General Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Textarea
                  id="platformDescription"
                  value={settings.platformDescription}
                  onChange={(e) => setSettings({...settings, platformDescription: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Registration Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Registration Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowStudentRegistration">Allow Student Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new students to register on the platform</p>
                </div>
                <Switch
                  id="allowStudentRegistration"
                  checked={settings.allowStudentRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowStudentRegistration: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowCompanyRegistration">Allow Company Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new companies to register on the platform</p>
                </div>
                <Switch
                  id="allowCompanyRegistration"
                  checked={settings.allowCompanyRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowCompanyRegistration: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireAdminApproval">Require Admin Approval</Label>
                  <p className="text-sm text-muted-foreground">Require admin approval for new registrations</p>
                </div>
                <Switch
                  id="requireAdminApproval"
                  checked={settings.requireAdminApproval}
                  onCheckedChange={(checked) => setSettings({...settings, requireAdminApproval: checked})}
                />
              </div>
            </div>
          </Card>

          {/* Application Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Application Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="maxApplicationsPerStudent">Max Applications Per Student</Label>
                <Input
                  id="maxApplicationsPerStudent"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.maxApplicationsPerStudent}
                  onChange={(e) => setSettings({...settings, maxApplicationsPerStudent: parseInt(e.target.value)})}
                />
                <p className="text-sm text-muted-foreground">Maximum number of applications a student can submit</p>
              </div>
            </div>
          </Card>

          {/* Contact Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Contact Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
                />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200">
            <h3 className="text-lg font-semibold text-red-600 mb-6">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Reset All Settings</h4>
                  <p className="text-sm text-muted-foreground">Reset all settings to their default values</p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset Settings
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete all platform data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
