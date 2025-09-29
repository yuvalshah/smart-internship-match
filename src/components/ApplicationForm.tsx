import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import SmartResumeBuilder from '@/components/SmartResumeBuilder';

const applicationSchema = z.object({
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters'),
  applicationNotes: z.string().optional(),
  resumeUrl: z.string().url('Please enter a valid URL').optional(),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional(),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  children: React.ReactNode;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  internshipId,
  internshipTitle,
  companyName,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, ensure the student record exists
      let studentId = user.id;
      
      // Check if student exists, if not create one
      const { data: existingStudent, error: studentCheckError } = await supabase
        .from('students')
        .select('id')
        .eq('id', user.id)
        .single();

      if (studentCheckError && studentCheckError.code === 'PGRST116') {
        // Student doesn't exist, create one
        const { data: newStudent, error: createStudentError } = await supabase
          .from('students')
          .insert({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
          })
          .select('id')
          .single();

        if (createStudentError) {
          throw createStudentError;
        }
        studentId = newStudent.id;
      } else if (studentCheckError) {
        throw studentCheckError;
      }

      // Generate a proper UUID for the application and internship
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Check if internshipId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      let validInternshipId = internshipId;
      if (!uuidRegex.test(internshipId)) {
        // Generate a UUID for demo purposes if the ID is not a valid UUID
        validInternshipId = generateUUID();
        console.log('Generated UUID for internship:', validInternshipId);
      }

      const applicationId = generateUUID();

      const { data: applicationData, error } = await supabase
        .from('applications')
        .insert({
          id: applicationId,
          student_id: studentId,
          internship_id: validInternshipId,
          cover_letter: data.coverLetter,
          application_notes: data.applicationNotes,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Note: Student profile URLs are stored in the application form data
      // but not updated to students table since those columns don't exist

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      // Send notification
      try {
        await sendNotification(
          user.id,
          'student',
          'Application Submitted',
          `Your application for ${internshipTitle} at ${companyName} has been submitted successfully.`,
          'application',
          'application',
          applicationData.id
        );
      } catch (error) {
        console.error('Failed to send notification:', error);
      }

      setOpen(false);
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-border/50 shadow-elevated-lg">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="text-3xl font-bold font-display text-foreground">
            Apply for {internshipTitle}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Apply for the {internshipTitle} position at {companyName}. Show them why you're the perfect fit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-foreground">Cover Letter</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Write a compelling cover letter explaining why you're interested in this position and what makes you unique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('coverLetter')}
                placeholder="Dear Hiring Manager, I am writing to express my strong interest in the Product Manager Intern position..."
                className="min-h-[200px] bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
              />
              {errors.coverLetter && (
                <p className="text-sm text-destructive mt-2 font-medium">{errors.coverLetter.message}</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-foreground">Additional Information</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Provide any additional notes or information about your application to help companies understand your background better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="applicationNotes" className="text-base font-semibold text-foreground mb-2 block">
                  Application Notes (Optional)
                </Label>
                <Textarea
                  {...register('applicationNotes')}
                  placeholder="Any additional information you'd like to share..."
                  className="min-h-[100px] bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
                {errors.applicationNotes && (
                  <p className="text-sm text-destructive mt-2 font-medium">{errors.applicationNotes.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="resumeUrl" className="text-base font-semibold text-foreground mb-2 block">
                    Resume URL (Optional)
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      {...register('resumeUrl')}
                      type="url"
                      placeholder="https://example.com/resume.pdf"
                      className="bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 flex-1"
                    />
                    <SmartResumeBuilder onResumeGenerated={(resumeUrl) => {
                      // Auto-fill the resume URL when generated
                      const resumeUrlInput = document.querySelector('input[name="resumeUrl"]') as HTMLInputElement;
                      if (resumeUrlInput) {
                        resumeUrlInput.value = resumeUrl;
                        resumeUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }} />
                  </div>
                  {errors.resumeUrl && (
                    <p className="text-sm text-destructive mt-2 font-medium">{errors.resumeUrl.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="linkedinUrl" className="text-base font-semibold text-foreground mb-2 block">
                    LinkedIn Profile (Optional)
                  </Label>
                  <Input
                    {...register('linkedinUrl')}
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                  {errors.linkedinUrl && (
                    <p className="text-sm text-destructive mt-2 font-medium">{errors.linkedinUrl.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="githubUrl" className="text-base font-semibold text-foreground mb-2 block">
                    GitHub Profile (Optional)
                  </Label>
                  <Input
                    {...register('githubUrl')}
                    type="url"
                    placeholder="https://github.com/yourusername"
                    className="bg-white/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                  {errors.githubUrl && (
                    <p className="text-sm text-destructive mt-2 font-medium">{errors.githubUrl.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="btn-outline-secondary px-8 py-3 text-lg font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="btn-primary-glow px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
