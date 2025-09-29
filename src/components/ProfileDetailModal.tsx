import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileType: 'student' | 'company';
  profileId: string;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  open,
  onOpenChange,
  profileType,
  profileId
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);

  useEffect(() => {
    if (open && profileId) {
      fetchProfileData();
    }
  }, [open, profileId, profileType]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      if (profileType === 'student') {
        // Fetch student profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);
        
        // Fetch applications for this student
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            internships (
              title,
              companies (
                name
              )
            )
          `)
          .eq('student_id', profileId);

        if (!applicationsError) {
          setApplications(applicationsData || []);
        }
      } else if (profileType === 'company') {
        // Fetch company profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);
        
        // Fetch internships for this company
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select(`
            *,
            applications (
              id
            )
          `)
          .eq('company_id', profileId);

        if (!internshipsError) {
          setInternships(internshipsData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !profileId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              profileType === 'student' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <span className={`material-symbols-outlined text-xl ${
                profileType === 'student' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {profileType === 'student' ? 'school' : 'business_center'}
              </span>
            </div>
            {profileType === 'student' ? 'Student Profile' : 'Company Profile'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading profile...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Basic Profile Information */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {profileType === 'student' ? 'Student Information' : 'Company Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileType === 'student' ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm">{profile?.full_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{profile?.email || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{profile?.phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">University</p>
                      <p className="text-sm">{profile?.university || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Course</p>
                      <p className="text-sm">{profile?.course || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Graduation Year</p>
                      <p className="text-sm">{profile?.graduation_year || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                      <p className="text-sm">{profile?.cgpa || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm">{profile?.city}, {profile?.district}, {profile?.state}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Social Category</p>
                      <p className="text-sm">{profile?.social_category || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Skills</p>
                      <p className="text-sm">{Array.isArray(profile?.skills) ? profile.skills.join(', ') : 'Not specified'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                      <p className="text-sm">{profile?.full_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{profile?.email || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{profile?.phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm">{profile?.city}, {profile?.district}, {profile?.state}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User Type</p>
                      <p className="text-sm">{profile?.user_type || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Applications (for students) or Internships (for companies) */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {profileType === 'student' ? 'Applications' : 'Internship Postings'}
              </h3>
              {profileType === 'student' ? (
                applications.length === 0 ? (
                  <p className="text-muted-foreground">No applications found.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{app.internships?.title}</p>
                          <p className="text-sm text-muted-foreground">{app.internships?.companies?.name}</p>
                        </div>
                        <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                internships.length === 0 ? (
                  <p className="text-muted-foreground">No internship postings found.</p>
                ) : (
                  <div className="space-y-3">
                    {internships.map((internship) => (
                      <div key={internship.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{internship.title}</p>
                          <p className="text-sm text-muted-foreground">{internship.location} • {internship.department}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={internship.is_active ? 'default' : 'secondary'}>
                            {internship.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {internship.applications?.length || 0} applications
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
