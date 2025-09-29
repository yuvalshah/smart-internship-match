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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { X } from 'lucide-react';

const postingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(1, 'Location is required'),
  internshipType: z.enum(['onsite', 'remote', 'hybrid']),
  durationWeeks: z.number().min(1, 'Duration must be at least 1 week'),
  stipendAmount: z.number().min(0, 'Stipend must be non-negative').optional(),
  stipendCurrency: z.string().default('USD'),
  cgpaRequirement: z.number().min(0).max(10).optional(),
  availablePositions: z.number().min(1, 'At least 1 position required'),
  applicationDeadline: z.string().min(1, 'Application deadline is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
  benefits: z.array(z.string()).optional(),
  applicationProcess: z.string().optional(),
});

type PostingFormData = z.infer<typeof postingSchema>;

interface NewPostingFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const NewPostingForm: React.FC<NewPostingFormProps> = ({
  children,
  onSuccess
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PostingFormData>({
    resolver: zodResolver(postingSchema),
    defaultValues: {
      stipendCurrency: 'USD',
      skillsRequired: [],
      benefits: [],
    },
  });

  const skillsRequired = watch('skillsRequired') || [];
  const benefits = watch('benefits') || [];

  const addSkill = () => {
    if (skillsInput.trim() && !skillsRequired.includes(skillsInput.trim())) {
      const newSkills = [...skillsRequired, skillsInput.trim()];
      setValue('skillsRequired', newSkills);
      setSkillsInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillsRequired.filter(skill => skill !== skillToRemove);
    setValue('skillsRequired', newSkills);
  };

  const addBenefit = () => {
    if (benefitsInput.trim() && !benefits.includes(benefitsInput.trim())) {
      const newBenefits = [...benefits, benefitsInput.trim()];
      setValue('benefits', newBenefits);
      setBenefitsInput('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    const newBenefits = benefits.filter(benefit => benefit !== benefitToRemove);
    setValue('benefits', newBenefits);
  };

  const onSubmit = async (data: PostingFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a posting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, ensure the company record exists
      let companyId = user.id;
      
      // Check if company exists, if not create one
      const { data: existingCompany, error: companyCheckError } = await supabase
        .from('companies')
        .select('id')
        .eq('id', user.id)
        .single();

      if (companyCheckError && companyCheckError.code === 'PGRST116') {
        // Company doesn't exist, create one
        const { data: newCompany, error: createCompanyError } = await supabase
          .from('companies')
          .insert({
            id: user.id,
            name: user.user_metadata?.company_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Company',
            email: user.email || '',
            description: 'Company created automatically',
          })
          .select('id')
          .single();

        if (createCompanyError) {
          throw createCompanyError;
        }
        companyId = newCompany.id;
      } else if (companyCheckError) {
        throw companyCheckError;
      }

      const { data: postingData, error } = await supabase
        .from('internships')
        .insert({
          company_id: companyId,
          title: data.title,
          description: data.description,
          location: data.location,
          internship_type: data.internshipType,
          duration_weeks: data.durationWeeks,
          stipend_amount: data.stipendAmount,
          stipend_currency: data.stipendCurrency,
          cgpa_requirement: data.cgpaRequirement,
          available_positions: data.availablePositions,
          application_deadline: data.applicationDeadline,
          start_date: data.startDate,
          end_date: data.endDate,
          skills_required: data.skillsRequired,
          benefits: data.benefits,
          application_process: data.applicationProcess,
          is_active: true,
          is_approved: false, // Requires admin approval
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Posting Created",
        description: "Your internship posting has been created and is pending approval.",
      });

      // Send notifications to company, students, and admins
      try {
        // Notify the company
        await sendNotification(
          user.id,
          'company',
          'Posting Created',
          `Your internship posting "${data.title}" has been created and is pending admin approval.`,
          'system',
          'internship',
          postingData.id
        );

        // Notify all students about new internship opportunity
        const { data: students } = await supabase
          .from('students')
          .select('id');

        if (students) {
          for (const student of students) {
            await sendNotification(
              student.id,
              'student',
              'New Internship Opportunity',
              `A new internship "${data.title}" at ${newCompany?.name || 'a company'} is now available!`,
              'system',
              'internship',
              postingData.id
            );
          }
        }

        // Notify all admins about new posting for approval
        const { data: admins } = await supabase
          .from('admins')
          .select('id');

        if (admins) {
          for (const admin of admins) {
            await sendNotification(
              admin.id,
              'admin',
              'New Posting for Review',
              `Company "${newCompany?.name || 'Unknown'}" has posted a new internship "${data.title}" that needs approval.`,
              'system',
              'internship',
              postingData.id
            );
          }
        }
      } catch (error) {
        console.error('Failed to send notifications:', error);
      }

      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create posting",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Internship Posting</DialogTitle>
          <DialogDescription>
            Create a new internship opportunity for students to apply to
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential details about the internship</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    {...register('title')}
                    placeholder="e.g., Product Management Intern"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    {...register('location')}
                    placeholder="e.g., New York, NY or Remote"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="internshipType">Internship Type *</Label>
                  <Select onValueChange={(value) => setValue('internshipType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.internshipType && (
                    <p className="text-sm text-destructive mt-1">{errors.internshipType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="durationWeeks">Duration (weeks) *</Label>
                    <Input
                      {...register('durationWeeks', { valueAsNumber: true })}
                      type="number"
                      min="1"
                    />
                    {errors.durationWeeks && (
                      <p className="text-sm text-destructive mt-1">{errors.durationWeeks.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="availablePositions">Available Positions *</Label>
                    <Input
                      {...register('availablePositions', { valueAsNumber: true })}
                      type="number"
                      min="1"
                    />
                    {errors.availablePositions && (
                      <p className="text-sm text-destructive mt-1">{errors.availablePositions.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compensation & Requirements</CardTitle>
                <CardDescription>Stipend and academic requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stipendAmount">Stipend Amount</Label>
                    <Input
                      {...register('stipendAmount', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      placeholder="0"
                    />
                    {errors.stipendAmount && (
                      <p className="text-sm text-destructive mt-1">{errors.stipendAmount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stipendCurrency">Currency</Label>
                    <Select onValueChange={(value) => setValue('stipendCurrency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cgpaRequirement">Minimum CGPA</Label>
                  <Input
                    {...register('cgpaRequirement', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="e.g., 3.0"
                  />
                  {errors.cgpaRequirement && (
                    <p className="text-sm text-destructive mt-1">{errors.cgpaRequirement.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description & Requirements</CardTitle>
              <CardDescription>Detailed description and required skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
                  className="min-h-[150px]"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label>Required Skills *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g., Python, React, Product Management"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsRequired.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                {errors.skillsRequired && (
                  <p className="text-sm text-destructive mt-1">{errors.skillsRequired.message}</p>
                )}
              </div>

              <div>
                <Label>Benefits (Optional)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={benefitsInput}
                    onChange={(e) => setBenefitsInput(e.target.value)}
                    placeholder="e.g., Free lunch, Flexible hours, Mentorship"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button type="button" onClick={addBenefit} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit) => (
                    <Badge key={benefit} variant="outline" className="flex items-center gap-1">
                      {benefit}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeBenefit(benefit)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Important dates for the internship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                  <Input
                    {...register('applicationDeadline')}
                    type="date"
                  />
                  {errors.applicationDeadline && (
                    <p className="text-sm text-destructive mt-1">{errors.applicationDeadline.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    {...register('startDate')}
                    type="date"
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    {...register('endDate')}
                    type="date"
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="applicationProcess">Application Process (Optional)</Label>
                <Textarea
                  {...register('applicationProcess')}
                  placeholder="Describe the application process, interview stages, etc."
                  className="min-h-[100px]"
                />
                {errors.applicationProcess && (
                  <p className="text-sm text-destructive mt-1">{errors.applicationProcess.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              className="btn-outline-secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-primary-glow">
              {loading ? 'Creating...' : 'Create Posting'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
