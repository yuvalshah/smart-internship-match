import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templates, setTemplates] = useState([]);
  
  const [formData, setFormData] = useState({
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
      location: '',
      relevant_coursework: []
    }],
    work_experience: [{
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      achievements: []
    }],
    projects: [{
      name: '',
      description: '',
      technologies: [],
      start_date: '',
      end_date: '',
      github_url: '',
      live_url: ''
    }],
    skills: [{
      category: '',
      skills: []
    }],
    achievements: [{
      title: '',
      description: '',
      date: '',
      organization: ''
    }],
    template_choice: 'professional'
  });

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templates`);
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const updateFormData = (section, index, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (index !== undefined) {
        newData[section][index][field] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template }]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-resume`, formData, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${formData.personal_info.first_name}_${formData.personal_info.last_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Resume generated successfully!');
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Error generating resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.personal_info.first_name}
          onChange={(e) => updateFormData('personal_info', undefined, 'first_name', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.personal_info.last_name}
          onChange={(e) => updateFormData('personal_info', undefined, 'last_name', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.personal_info.email}
          onChange={(e) => updateFormData('personal_info', undefined, 'email', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.personal_info.phone}
          onChange={(e) => updateFormData('personal_info', undefined, 'phone', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.personal_info.address}
          onChange={(e) => updateFormData('personal_info', undefined, 'address', e.target.value)}
          className="border rounded px-3 py-2 col-span-2"
        />
        <input
          type="url"
          placeholder="Website (optional)"
          value={formData.personal_info.website}
          onChange={(e) => updateFormData('personal_info', undefined, 'website', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="url"
          placeholder="LinkedIn (optional)"
          value={formData.personal_info.linkedin}
          onChange={(e) => updateFormData('personal_info', undefined, 'linkedin', e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="url"
          placeholder="GitHub (optional)"
          value={formData.personal_info.github}
          onChange={(e) => updateFormData('personal_info', undefined, 'github', e.target.value)}
          className="border rounded px-3 py-2 col-span-2"
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Education</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateFormData('education', index, 'institution', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateFormData('education', index, 'degree', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field_of_study}
              onChange={(e) => updateFormData('education', index, 'field_of_study', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Graduation Date"
              value={edu.graduation_date}
              onChange={(e) => updateFormData('education', index, 'graduation_date', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={edu.location}
              onChange={(e) => updateFormData('education', index, 'location', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="GPA (optional)"
              value={edu.gpa}
              onChange={(e) => updateFormData('education', index, 'gpa', e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          {formData.education.length > 1 && (
            <button
              onClick={() => removeArrayItem('education', index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove Education
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addArrayItem('education', {
          institution: '', degree: '', field_of_study: '', graduation_date: '', 
          gpa: '', location: '', relevant_coursework: []
        })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Education
      </button>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
      {formData.work_experience.map((exp, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateFormData('work_experience', index, 'company', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => updateFormData('work_experience', index, 'position', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => updateFormData('work_experience', index, 'location', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Start Date"
              value={exp.start_date}
              onChange={(e) => updateFormData('work_experience', index, 'start_date', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="End Date (leave empty if current)"
              value={exp.end_date}
              onChange={(e) => updateFormData('work_experience', index, 'end_date', e.target.value)}
              className="border rounded px-3 py-2 col-span-2"
            />
          </div>
          <textarea
            placeholder="Describe your role and responsibilities (will be enhanced by AI)"
            value={exp.description}
            onChange={(e) => updateFormData('work_experience', index, 'description', e.target.value)}
            className="border rounded px-3 py-2 w-full h-24"
          />
          {formData.work_experience.length > 1 && (
            <button
              onClick={() => removeArrayItem('work_experience', index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove Experience
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addArrayItem('work_experience', {
          company: '', position: '', location: '', start_date: '', 
          end_date: '', description: '', achievements: []
        })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Work Experience
      </button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      {formData.projects.map((proj, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={proj.name}
              onChange={(e) => updateFormData('projects', index, 'name', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={proj.technologies.join(', ')}
              onChange={(e) => updateFormData('projects', index, 'technologies', e.target.value.split(', '))}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Start Date"
              value={proj.start_date}
              onChange={(e) => updateFormData('projects', index, 'start_date', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="End Date (optional)"
              value={proj.end_date}
              onChange={(e) => updateFormData('projects', index, 'end_date', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="url"
              placeholder="GitHub URL (optional)"
              value={proj.github_url}
              onChange={(e) => updateFormData('projects', index, 'github_url', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="url"
              placeholder="Live URL (optional)"
              value={proj.live_url}
              onChange={(e) => updateFormData('projects', index, 'live_url', e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <textarea
            placeholder="Project description (will be enhanced by AI)"
            value={proj.description}
            onChange={(e) => updateFormData('projects', index, 'description', e.target.value)}
            className="border rounded px-3 py-2 w-full h-20"
          />
          {formData.projects.length > 1 && (
            <button
              onClick={() => removeArrayItem('projects', index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove Project
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addArrayItem('projects', {
          name: '', description: '', technologies: [], start_date: '', 
          end_date: '', github_url: '', live_url: ''
        })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Project
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      {formData.skills.map((skillGroup, index) => (
        <div key={index} className="border p-4 rounded space-y-3">
          <input
            type="text"
            placeholder="Skill Category (e.g., Programming Languages)"
            value={skillGroup.category}
            onChange={(e) => updateFormData('skills', index, 'category', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Skills (comma-separated)"
            value={skillGroup.skills.join(', ')}
            onChange={(e) => updateFormData('skills', index, 'skills', e.target.value.split(', '))}
            className="border rounded px-3 py-2 w-full"
          />
          {formData.skills.length > 1 && (
            <button
              onClick={() => removeArrayItem('skills', index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove Skill Group
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => addArrayItem('skills', { category: '', skills: [] })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Skill Group
      </button>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Choose Resume Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border-2 p-4 rounded cursor-pointer transition-colors ${
              formData.template_choice === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, template_choice: template.id }))}
          >
            <h3 className="font-bold text-lg">{template.name}</h3>
            <p className="text-gray-600 text-sm">{template.description}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-4 mt-8">
        <h3 className="text-xl font-bold">Achievements (Optional)</h3>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="border p-4 rounded space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Achievement Title"
                value={achievement.title}
                onChange={(e) => updateFormData('achievements', index, 'title', e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Date"
                value={achievement.date}
                onChange={(e) => updateFormData('achievements', index, 'date', e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Organization (optional)"
                value={achievement.organization}
                onChange={(e) => updateFormData('achievements', index, 'organization', e.target.value)}
                className="border rounded px-3 py-2 col-span-2"
              />
            </div>
            <textarea
              placeholder="Achievement description"
              value={achievement.description}
              onChange={(e) => updateFormData('achievements', index, 'description', e.target.value)}
              className="border rounded px-3 py-2 w-full h-16"
            />
            {formData.achievements.length > 1 && (
              <button
                onClick={() => removeArrayItem('achievements', index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Achievement
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('achievements', {
            title: '', description: '', date: '', organization: ''
          })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Achievement
        </button>
      </div>
    </div>
  );

  const steps = [
    { title: 'Personal Info', component: renderPersonalInfo },
    { title: 'Education', component: renderEducation },
    { title: 'Work Experience', component: renderWorkExperience },
    { title: 'Projects & Skills', component: () => (
      <div className="space-y-8">
        {renderProjects()}
        {renderSkills()}
      </div>
    )},
    { title: 'Template & Generate', component: renderTemplateSelection }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Smart Resume Builder</h1>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium">{step.title}</span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {steps[currentStep - 1].component()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="bg-gray-500 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={generateResume}
            disabled={isGenerating}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Resume...' : 'Generate Resume'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;