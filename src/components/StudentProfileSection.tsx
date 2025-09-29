import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Award, DollarSign, Calendar, FileText, Edit3, Eye } from 'lucide-react';
import StudentProfileBuilder from './StudentProfileBuilder';

interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  currentEducation: string;
  university: string;
  course: string;
  graduationYear: string;
  cgpa: string;
  socialCategory: string;
  familyIncome: string;
  participationType: 'first-time' | 'returning';
  skills: string[];
  preferredLocations: string[];
  stipendExpectation: string;
  availableDuration: string;
  additionalInfo: string;
}

interface StudentProfileSectionProps {
  profile: StudentProfile | null;
  onProfileUpdate: (profile: StudentProfile) => void;
}

const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  profile,
  onProfileUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scheduled Caste (SC)':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled Tribe (ST)':
        return 'bg-green-100 text-green-800';
      case 'Other Backward Classes (OBC)':
        return 'bg-yellow-100 text-yellow-800';
      case 'Economically Weaker Section (EWS)':
        return 'bg-purple-100 text-purple-800';
      case 'Person with Disability (PwD)':
        return 'bg-pink-100 text-pink-800';
      case 'Minority':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getParticipationBadge = (type: string) => {
    return type === 'first-time' ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        First-time Participant
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Returning Participant
      </Badge>
    );
  };

  if (!profile) {
    return (
      <>
        <Card className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-white text-2xl">
                person_add
              </span>
            </div>
            <h3 className="text-xl font-semibold">Complete Your Profile</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Build your profile to get personalized internship recommendations and better matching opportunities.
            </p>
          <Button 
            onClick={() => setIsEditing(true)}
            className="btn-premium mt-4"
          >
              Start Building Profile
            </Button>
          </motion.div>
        </Card>

        
        <StudentProfileBuilder
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onComplete={onProfileUpdate}
          initialProfile={profile}
        />
      </>
    );
  }

  return (
    <>
      <Card 
        className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 shadow-lg"
        onClick={() => setIsViewing(true)}
      >
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-primary/10 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">{profile.fullName}</h2>
                <p className="text-muted-foreground text-lg">{profile.email}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {getParticipationBadge(profile.participationType)}
                <Badge className={`${getCategoryColor(profile.socialCategory)} px-3 py-1 text-sm font-medium`}>
                  {profile.socialCategory}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsViewing(true);
              }}
              className="flex items-center gap-2 hover:bg-primary/10 border-primary/20"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md text-white border-none"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Click hint */}
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Click anywhere on this card to view your complete profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">City:</span> {profile.city}</p>
              <p><span className="font-medium">District:</span> {profile.district}</p>
              <p><span className="font-medium">State:</span> {profile.state}</p>
              <p><span className="font-medium">Pincode:</span> {profile.pincode}</p>
            </div>
          </motion.div>

          {/* Education Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Education</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Level:</span> {profile.currentEducation}</p>
              <p><span className="font-medium">University:</span> {profile.university}</p>
              <p><span className="font-medium">Course:</span> {profile.course}</p>
              <p><span className="font-medium">Graduation:</span> {profile.graduationYear}</p>
              <p><span className="font-medium">CGPA:</span> {profile.cgpa}</p>
            </div>
          </motion.div>

          {/* Income & Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Income & Preferences</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Family Income:</span> {profile.familyIncome}</p>
              <p><span className="font-medium">Expected Stipend:</span> {profile.stipendExpectation || 'Not specified'}</p>
              <p><span className="font-medium">Available Duration:</span> {profile.availableDuration || 'Not specified'}</p>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        {profile.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preferred Locations */}
        {profile.preferredLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Preferred Work Locations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.preferredLocations.map((location, index) => (
                <Badge key={index} variant="outline">
                  {location}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Information */}
        {profile.additionalInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Additional Information</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {profile.additionalInfo}
            </p>
          </motion.div>
        )}
      </Card>

      
      <StudentProfileBuilder
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onComplete={onProfileUpdate}
        initialProfile={profile}
      />

      {/* Profile Viewing Modal */}
      <Dialog open={isViewing} onOpenChange={setIsViewing}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted/20">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Complete Profile
            </DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground mt-2">
              View and manage all your profile information in detail
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl p-6 border border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-white/20 shadow-2xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                      {getInitials(profile.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-4xl font-bold text-foreground mb-2">{profile.fullName}</h2>
                    <p className="text-muted-foreground text-xl">{profile.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {getParticipationBadge(profile.participationType)}
                    <Badge className={`${getCategoryColor(profile.socialCategory)} px-4 py-2 text-sm font-medium shadow-md`}>
                      {profile.socialCategory}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Phone Number</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.phone || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.dateOfBirth || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {/* Location Information */}
            <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">State</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.state || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">District</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.district || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">City</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.city || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pincode</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.pincode || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {/* Education Information */}
            <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                Education Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Education Level</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.currentEducation || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">University/Institution</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.university || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Course/Stream</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.course || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Graduation Year</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.graduationYear || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">CGPA/Percentage</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.cgpa || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {/* Income & Preferences */}
            <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                Income & Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Family Annual Income</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.familyIncome || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Expected Stipend</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.stipendExpectation || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Available Duration</p>
                  <p className="text-lg font-semibold text-foreground bg-muted/50 p-3 rounded-lg">{profile.availableDuration || 'Not specified'}</p>
                </div>
              </div>
            </Card>

            {/* Skills */}
            {profile.skills.length > 0 && (
              <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Preferred Locations */}
            {profile.preferredLocations.length > 0 && (
              <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  Preferred Work Locations
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.preferredLocations.map((location, index) => (
                    <Badge key={index} variant="outline" className="text-sm px-4 py-2 border-primary/30 text-foreground hover:bg-primary/10 transition-colors">
                      {location}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Additional Information */}
            {profile.additionalInfo && (
              <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  Additional Information
                </h3>
                <div className="bg-muted/30 p-6 rounded-xl border border-primary/10">
                  <p className="text-foreground text-lg leading-relaxed">
                    {profile.additionalInfo}
                  </p>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-primary/10">
              <Button 
                variant="outline" 
                onClick={() => setIsViewing(false)}
                className="px-8 py-3 text-lg font-medium hover:bg-muted/50 border-primary/20"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setIsViewing(false);
                  setIsEditing(true);
                }}
                className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentProfileSection;
