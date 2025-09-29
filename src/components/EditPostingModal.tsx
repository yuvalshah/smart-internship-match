import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface EditPostingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posting: any;
  onPostingUpdated: () => void;
}

export const EditPostingModal: React.FC<EditPostingModalProps> = ({
  open,
  onOpenChange,
  posting,
  onPostingUpdated
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: posting?.title || '',
    description: posting?.description || '',
    location: posting?.location || '',
    department: posting?.department || '',
    duration_weeks: posting?.duration_weeks || '',
    internship_type: posting?.internship_type || 'remote',
    requirements: posting?.requirements || '',
    responsibilities: posting?.responsibilities || '',
    stipend: posting?.stipend || '',
    application_deadline: posting?.application_deadline ? posting.application_deadline.split('T')[0] : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posting) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('internships')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          department: formData.department,
          duration_weeks: parseInt(formData.duration_weeks) || null,
          internship_type: formData.internship_type,
          requirements: formData.requirements,
          responsibilities: formData.responsibilities,
          stipend: formData.stipend,
          application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', posting.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Internship posting updated successfully!",
      });

      onPostingUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating posting:', error);
      toast({
        title: "Error",
        description: "Failed to update posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!posting) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Internship Posting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Software Development Intern"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Engineering"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => handleInputChange('duration_weeks', e.target.value)}
                placeholder="e.g., 12"
                min="1"
                max="52"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Internship Type</Label>
              <Select value={formData.internship_type} onValueChange={(value) => handleInputChange('internship_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stipend */}
            <div className="space-y-2">
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                value={formData.stipend}
                onChange={(e) => handleInputChange('stipend', e.target.value)}
                placeholder="e.g., $500/month"
              />
            </div>

            {/* Application Deadline */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the internship role, what the intern will learn, and what they'll be working on..."
              rows={4}
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="List the skills, qualifications, and requirements for this internship..."
              rows={3}
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              value={formData.responsibilities}
              onChange={(e) => handleInputChange('responsibilities', e.target.value)}
              placeholder="Describe the key responsibilities and tasks the intern will handle..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Posting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
