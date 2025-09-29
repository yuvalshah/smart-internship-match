import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, User, GraduationCap, FileText, DollarSign, Award } from 'lucide-react';

interface StudentProfile {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Location Information
  state: string;
  district: string;
  city: string;
  pincode: string;
  
  // Educational Information
  currentEducation: string;
  university: string;
  course: string;
  graduationYear: string;
  cgpa: string;
  
  // Special Categories
  socialCategory: string;
  casteCertificate: File | null;
  
  // Income Information
  familyIncome: string;
  incomeCertificate: File | null;
  
  // Participation History
  participationType: 'first-time' | 'returning';
  
  // Skills
  skills: string[];
  resume: File | null;
  
  // Additional Information
  preferredLocations: string[];
  stipendExpectation: string;
  availableDuration: string;
  additionalInfo: string;
}

interface StudentProfileBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: Partial<StudentProfile>;
}

const StudentProfileBuilder: React.FC<StudentProfileBuilderProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    currentEducation: '',
    university: '',
    course: '',
    graduationYear: '',
    cgpa: '',
    socialCategory: '',
    casteCertificate: null,
    familyIncome: '',
    incomeCertificate: null,
    participationType: 'first-time',
    skills: [],
    resume: null,
    preferredLocations: [],
    stipendExpectation: '',
    availableDuration: '',
    additionalInfo: '',
    ...initialProfile
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Education', icon: GraduationCap },
    { id: 4, title: 'Categories', icon: Award },
    { id: 5, title: 'Income & History', icon: DollarSign },
    { id: 6, title: 'Skills & Resume', icon: FileText },
    { id: 7, title: 'Preferences', icon: Upload }
  ];

  const socialCategories = [
    'General',
    'Scheduled Caste (SC)',
    'Scheduled Tribe (ST)',
    'Other Backward Classes (OBC)',
    'Economically Weaker Section (EWS)',
    'Person with Disability (PwD)',
    'Minority'
  ];

  const incomeRanges = [
    '0 - ₹2,00,000',
    '₹2,00,000 - ₹5,00,000',
    '₹5,00,000 - ₹10,00,000',
    '₹10,00,000 - ₹15,00,000',
    '₹15,00,000 - ₹25,00,000',
    '₹25,00,000+'
  ];

  const educationLevels = [
    'High School',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
  ];

  const handleInputChange = (field: keyof StudentProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'casteCertificate' | 'incomeCertificate' | 'resume', file: File) => {
    setProfile(prev => ({ ...prev, [field]: file }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addPreferredLocation = () => {
    if (newLocation.trim() && !profile.preferredLocations.includes(newLocation.trim())) {
      setProfile(prev => ({ ...prev, preferredLocations: [...prev.preferredLocations, newLocation.trim()] }));
      setNewLocation('');
    }
  };

  const removePreferredLocation = (location: string) => {
    setProfile(prev => ({ ...prev, preferredLocations: prev.preferredLocations.filter(l => l !== location) }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(profile);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={profile.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={profile.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Enter your district"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={profile.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter your pincode"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currentEducation">Current Education Level *</Label>
                <Select value={profile.currentEducation} onValueChange={(value) => handleInputChange('currentEducation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="university">University/Institution *</Label>
                <Input
                  id="university"
                  value={profile.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  placeholder="Enter your university/institution"
                />
              </div>
              <div>
                <Label htmlFor="course">Course/Stream *</Label>
                <Input
                  id="course"
                  value={profile.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  placeholder="Enter your course/stream"
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Expected Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={profile.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                  placeholder="e.g., 2025"
                />
              </div>
              <div>
                <Label htmlFor="cgpa">CGPA/Percentage *</Label>
                <Input
                  id="cgpa"
                  value={profile.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  placeholder="e.g., 8.5 or 85%"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="socialCategory">Social Category *</Label>
              <Select value={profile.socialCategory} onValueChange={(value) => handleInputChange('socialCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your social category" />
                </SelectTrigger>
                <SelectContent>
                  {socialCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(profile.socialCategory === 'Scheduled Caste (SC)' || 
              profile.socialCategory === 'Scheduled Tribe (ST)' || 
              profile.socialCategory === 'Other Backward Classes (OBC)' || 
              profile.socialCategory === 'Economically Weaker Section (EWS)') && (
              <div>
                <Label htmlFor="casteCertificate">Caste Certificate *</Label>
                <div className="mt-2">
                  <Input
                    id="casteCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('casteCertificate', e.target.files[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Please upload a clear copy of your caste certificate
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="familyIncome">Family Annual Income *</Label>
              <Select value={profile.familyIncome} onValueChange={(value) => handleInputChange('familyIncome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  {incomeRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="incomeCertificate">Income Certificate *</Label>
              <div className="mt-2">
                <Input
                  id="incomeCertificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('incomeCertificate', e.target.files[0])}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Please upload a clear copy of your family income certificate
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="participationType">Participation Type *</Label>
              <Select value={profile.participationType} onValueChange={(value) => handleInputChange('participationType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select participation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-time">First-time Participant</SelectItem>
                  <SelectItem value="returning">Returning Participant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="resume">Resume/CV *</Label>
              <div className="mt-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('resume', e.target.files[0])}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your resume in PDF or Word format
                </p>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="preferredLocations">Preferred Work Locations</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add preferred location"
                  onKeyPress={(e) => e.key === 'Enter' && addPreferredLocation()}
                />
                <Button type="button" onClick={addPreferredLocation} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.preferredLocations.map((location, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {location}
                    <button
                      type="button"
                      onClick={() => removePreferredLocation(location)}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="stipendExpectation">Expected Stipend</Label>
                <Input
                  id="stipendExpectation"
                  value={profile.stipendExpectation}
                  onChange={(e) => handleInputChange('stipendExpectation', e.target.value)}
                  placeholder="e.g., ₹10,000/month"
                />
              </div>
              <div>
                <Label htmlFor="availableDuration">Available Duration</Label>
                <Input
                  id="availableDuration"
                  value={profile.availableDuration}
                  onChange={(e) => handleInputChange('availableDuration', e.target.value)}
                  placeholder="e.g., 6 months"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={profile.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any additional information you'd like to share..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Build Your Student Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete your profile to get personalized internship recommendations
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep === steps.length ? (
            <Button onClick={handleComplete} className="btn-premium">
              Complete Profile
            </Button>
          ) : (
            <Button onClick={nextStep} className="btn-premium">
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileBuilder;
