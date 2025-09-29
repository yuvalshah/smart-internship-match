import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { SkillsMatcherService, JobRecommendation } from "@/services/resumeAnalyzer";
import axios from 'axios';

// Backend API configuration
const API_BASE_URL = 'http://localhost:8002';

interface ResumeData {
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    linkedin: string;
    github: string;
  };
  education: {
    institution: string;
    degree: string;
    field_of_study: string;
    graduation_date: string;
    gpa: string;
    location: string;
  }[];
  work_experience: {
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }[];
  skills: {
    category: string;
    skills: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    start_date: string;
    end_date: string;
  }[];
  achievements: {
    title: string;
    description: string;
    date: string;
  }[];
  template_choice: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

interface SmartResumeBuilderProps {
  onResumeGenerated: (resumeUrl: string) => void;
  onJobRecommendations?: (recommendations: JobRecommendation[]) => void;
}

const SmartResumeBuilder = ({ onResumeGenerated, onJobRecommendations }: SmartResumeBuilderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  const [resumeData, setResumeData] = useState<ResumeData>({
    personal_info: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      github: ''
    },
    education: [{
      institution: '',
      degree: '',
      field_of_study: '',
      graduation_date: '',
      gpa: '',
      location: ''
    }],
    work_experience: [{
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      description: ''
    }],
    skills: [{
      category: 'Programming Languages',
      skills: []
    }],
    projects: [{
      name: '',
      description: '',
      technologies: [],
      start_date: '',
      end_date: ''
    }],
    achievements: [{
      title: '',
      description: '',
      date: ''
    }],
    template_choice: 'professional'
  });

  // Load available templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resume-templates`);
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Fallback templates
      setTemplates([
        {
          id: 'professional',
          name: 'Professional Resume',
          description: 'Clean, professional layout suitable for most industries'
        }
      ]);
    }
  };

  // Helper functions for managing form data
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value }
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field_of_study: '',
        graduation_date: '',
        gpa: '',
        location: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    if (resumeData.education.length > 1) {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const updateWorkExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      work_experience: [...prev.work_experience, {
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
      }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if (resumeData.work_experience.length > 1) {
      setResumeData(prev => ({
        ...prev,
        work_experience: prev.work_experience.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSkillCategory = (index: number, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkillCategory = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', skills: [] }]
    }));
  };

  const removeSkillCategory = (index: number) => {
    if (resumeData.skills.length > 1) {
      setResumeData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    }
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        start_date: '',
        end_date: ''
      }]
    }));
  };

  const removeProject = (index: number) => {
    if (resumeData.projects.length > 1) {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
    }
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) =>
        i === index ? { ...ach, [field]: value } : ach
      )
    }));
  };

  const addAchievement = () => {
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, {
        title: '',
        description: '',
        date: ''
      }]
    }));
  };

  const removeAchievement = (index: number) => {
    if (resumeData.achievements.length > 1) {
      setResumeData(prev => ({
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index)
      }));
    }
  };

  const generateResume = async () => {
    setIsGenerating(true);

    try {
      // Validate required fields
      if (!resumeData.personal_info.first_name || !resumeData.personal_info.last_name || !resumeData.personal_info.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in at least your name and email address.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Get job matches based on skills first
      if (onJobRecommendations && resumeData.skills.some(s => s.skills.length > 0)) {
        try {
          const allSkills = resumeData.skills.flatMap(s => s.skills);
          const matches = await SkillsMatcherService.getJobMatches(allSkills);
          onJobRecommendations(matches.matches);

          toast({
            title: "Skills Matched Successfully!",
            description: `Found ${matches.matches.length} job matches based on your skills.`,
          });
        } catch (error) {
          console.error('Error getting job matches:', error);
          // Continue with resume generation even if job matching fails
        }
      }

      // Generate resume via backend API
      const response = await axios.post(`${API_BASE_URL}/generate-resume`, resumeData, {
        responseType: 'blob',
        timeout: 60000, // 60 second timeout
      });

      // Determine file type from response headers
      const contentType = response.headers['content-type'] || '';
      const isHtml = contentType.includes('text/html');
      const fileExtension = isHtml ? 'html' : 'pdf';

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${resumeData.personal_info.first_name}_${resumeData.personal_info.last_name}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show appropriate message based on file type
      if (isHtml) {
        toast({
          title: "Resume Generated (HTML Format)",
          description: "LaTeX not available on server. HTML resume downloaded - you can print it as PDF from your browser.",
        });
      } else {
        // Check if it's WeasyPrint or LaTeX generated
        const isWeasyPrint = response.headers['x-generator']?.includes('weasyprint') || 
                           (response.config?.url?.includes('weasyprint'));
        
        toast({
          title: "Resume Generated Successfully!",
          description: isWeasyPrint 
            ? "Your professional PDF resume has been generated using WeasyPrint and downloaded."
            : "Your professional PDF resume has been generated using LaTeX and downloaded.",
        });
      }

      // Call the callback with a success message
      onResumeGenerated(`Resume generated and downloaded successfully as ${fileExtension.toUpperCase()}!`);

      setIsOpen(false);
      setCurrentStep(1);

    } catch (error: any) {
      console.error('Error generating resume:', error);

      let errorMessage = "Failed to generate resume. Please try again.";

      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to resume generation service. Please ensure the backend server is running on port 8000.";
      } else if (error.response?.status === 500) {
        errorMessage = "Resume generation failed. This might be due to missing LaTeX installation on the server.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", description: "Basic contact information" },
    { number: 2, title: "Education", description: "Academic background" },
    { number: 3, title: "Experience", description: "Work experience" },
    { number: 4, title: "Skills & Projects", description: "Technical skills and projects" },
    { number: 5, title: "Review & Generate", description: "Final review and generation" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary-glow">
          <span className="material-symbols-outlined mr-2">description</span>
          Don't have a resume? Build one!
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Smart Resume Builder</DialogTitle>
          <DialogDescription className="text-center">
            Create a professional, AI-optimized resume in minutes
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.number
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                  }`}>
                  {step.number}
                </div>
                {step.number < steps.length && (
                  <div className={`w-8 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={resumeData.personal_info.first_name}
                    onChange={(e) => updatePersonalInfo('first_name', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={resumeData.personal_info.last_name}
                    onChange={(e) => updatePersonalInfo('last_name', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personal_info.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personal_info.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={resumeData.personal_info.address}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                    placeholder="123 Main St, San Francisco, CA 94102"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    value={resumeData.personal_info.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://johndoe.dev"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personal_info.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    value={resumeData.personal_info.github}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="https://github.com/johndoe"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Education</h3>
                <Button onClick={addEducation} variant="outline" size="sm">
                  <span className="material-symbols-outlined mr-1">add</span>
                  Add Education
                </Button>
              </div>
              {resumeData.education.map((edu, index) => (
                <Card key={index} className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Institution *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="Stanford University"
                      />
                    </div>
                    <div>
                      <Label>Degree *</Label>
                      <Select
                        value={edu.degree}
                        onValueChange={(value) => updateEducation(index, 'degree', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelor of Science">Bachelor of Science</SelectItem>
                          <SelectItem value="Bachelor of Arts">Bachelor of Arts</SelectItem>
                          <SelectItem value="Master of Science">Master of Science</SelectItem>
                          <SelectItem value="Master of Arts">Master of Arts</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                          <SelectItem value="High School Diploma">High School Diploma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Field of Study *</Label>
                      <Input
                        value={edu.field_of_study}
                        onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        value={edu.graduation_date}
                        onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                        placeholder="May 2024"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                        placeholder="Stanford, CA"
                      />
                    </div>
                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                  {resumeData.education.length > 1 && (
                    <Button
                      onClick={() => removeEducation(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove Education
                    </Button>
                  )}
                </Card>
              ))}
            </motion.div>
          )}

          {/* Step 3: Work Experience */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Work Experience</h3>
                <Button onClick={addWorkExperience} variant="outline" size="sm">
                  <span className="material-symbols-outlined mr-1">add</span>
                  Add Experience
                </Button>
              </div>
              {resumeData.work_experience.map((exp, index) => (
                <Card key={index} className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                        placeholder="Google"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                        placeholder="Software Engineer Intern"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                        placeholder="Mountain View, CA"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.start_date}
                        onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                        placeholder="June 2023"
                      />
                    </div>
                    <div>
                      <Label>End Date (leave empty if current)</Label>
                      <Input
                        value={exp.end_date}
                        onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                        placeholder="August 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description (will be enhanced by AI)</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                  {resumeData.work_experience.length > 1 && (
                    <Button
                      onClick={() => removeWorkExperience(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove Experience
                    </Button>
                  )}
                </Card>
              ))}
            </motion.div>
          )}

          {/* Step 4: Skills & Projects */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Skills */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Skills</h3>
                  <Button onClick={addSkillCategory} variant="outline" size="sm">
                    <span className="material-symbols-outlined mr-1">add</span>
                    Add Skill Category
                  </Button>
                </div>
                {resumeData.skills.map((skillGroup, index) => (
                  <Card key={index} className="p-4 space-y-3 mb-4">
                    <div>
                      <Label>Skill Category</Label>
                      <Input
                        value={skillGroup.category}
                        onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                        placeholder="Programming Languages"
                      />
                    </div>
                    <div>
                      <Label>Skills (comma-separated)</Label>
                      <Input
                        value={skillGroup.skills.join(', ')}
                        onChange={(e) => updateSkillCategory(index, 'skills', e.target.value.split(', ').filter(s => s.trim()))}
                        placeholder="JavaScript, Python, React, Node.js"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {resumeData.skills.length > 1 && (
                      <Button
                        onClick={() => removeSkillCategory(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove Skill Category
                      </Button>
                    )}
                  </Card>
                ))}
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Projects</h3>
                  <Button onClick={addProject} variant="outline" size="sm">
                    <span className="material-symbols-outlined mr-1">add</span>
                    Add Project
                  </Button>
                </div>
                {resumeData.projects.map((project, index) => (
                  <Card key={index} className="p-4 space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(index, 'name', e.target.value)}
                          placeholder="E-commerce Website"
                        />
                      </div>
                      <div>
                        <Label>Technologies (comma-separated)</Label>
                        <Input
                          value={project.technologies.join(', ')}
                          onChange={(e) => updateProject(index, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={project.start_date}
                          onChange={(e) => updateProject(index, 'start_date', e.target.value)}
                          placeholder="January 2024"
                        />
                      </div>
                      <div>
                        <Label>End Date (optional)</Label>
                        <Input
                          value={project.end_date}
                          onChange={(e) => updateProject(index, 'end_date', e.target.value)}
                          placeholder="March 2024"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description (will be enhanced by AI)</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe your project..."
                        rows={2}
                      />
                    </div>
                    {resumeData.projects.length > 1 && (
                      <Button
                        onClick={() => removeProject(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove Project
                      </Button>
                    )}
                  </Card>
                ))}
              </div>

              {/* Achievements */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Achievements (Optional)</h3>
                  <Button onClick={addAchievement} variant="outline" size="sm">
                    <span className="material-symbols-outlined mr-1">add</span>
                    Add Achievement
                  </Button>
                </div>
                {resumeData.achievements.map((achievement, index) => (
                  <Card key={index} className="p-4 space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Achievement Title</Label>
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                          placeholder="Dean's List"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          value={achievement.date}
                          onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                        placeholder="Achieved Dean's List for academic excellence"
                        rows={2}
                      />
                    </div>
                    {resumeData.achievements.length > 1 && (
                      <Button
                        onClick={() => removeAchievement(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove Achievement
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Generate */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold">Review Your Information</h3>

              {/* Template Selection */}
              <div>
                <h4 className="font-semibold mb-3">Choose Resume Template</h4>
                <div className="grid grid-cols-1 gap-3">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`p-4 cursor-pointer transition-colors ${resumeData.template_choice === template.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                        }`}
                      onClick={() => setResumeData(prev => ({ ...prev, template_choice: template.id }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${resumeData.template_choice === template.id
                          ? 'bg-primary border-primary'
                          : 'border-gray-300'
                          }`} />
                        <div>
                          <h5 className="font-medium">{template.name}</h5>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Resume Preview */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{resumeData.personal_info.first_name} {resumeData.personal_info.last_name}</h4>
                    <p className="text-muted-foreground">{resumeData.personal_info.email} • {resumeData.personal_info.phone}</p>
                    <p className="text-muted-foreground">{resumeData.personal_info.address}</p>
                  </div>

                  {resumeData.education.some(edu => edu.institution) && (
                    <div>
                      <h4 className="font-semibold">Education</h4>
                      {resumeData.education.filter(edu => edu.institution).map((edu, index) => (
                        <div key={index}>
                          <p>{edu.degree} in {edu.field_of_study}</p>
                          <p>{edu.institution} • {edu.graduation_date}</p>
                          {edu.gpa && <p>GPA: {edu.gpa}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.work_experience.some(exp => exp.company) && (
                    <div>
                      <h4 className="font-semibold">Experience</h4>
                      {resumeData.work_experience.filter(exp => exp.company).map((exp, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-medium">{exp.position} at {exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.start_date} - {exp.end_date || 'Present'}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.skills.some(s => s.skills.length > 0) && (
                    <div>
                      <h4 className="font-semibold">Skills</h4>
                      {resumeData.skills.filter(s => s.skills.length > 0).map((skillGroup, index) => (
                        <p key={index}><strong>{skillGroup.category}:</strong> {skillGroup.skills.join(', ')}</p>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                className="btn-primary-glow"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={generateResume}
                disabled={isGenerating}
                className="btn-primary-glow"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">description</span>
                    Generate Resume
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartResumeBuilder;