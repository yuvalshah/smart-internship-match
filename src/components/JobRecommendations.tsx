import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApplicationForm } from "@/components/ApplicationForm";
import { JobRecommendation } from "@/services/resumeAnalyzer";
import { motion } from "framer-motion";

interface JobRecommendationsProps {
  recommendations: JobRecommendation[];
  isLoading: boolean;
  error?: string;
  totalJobsAnalyzed?: number;
  processingTime?: number;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  recommendations,
  isLoading,
  error,
  totalJobsAnalyzed,
  processingTime
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Matching your skills with available opportunities...</span>
          </div>
        </div>
        {/* Loading skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
              <div className="w-20 h-8 bg-muted rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/50 bg-destructive/5">
        <div className="flex items-center space-x-2 text-destructive">
          <span className="material-symbols-outlined">error</span>
          <div>
            <h3 className="font-semibold">Error Getting Recommendations</h3>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1 text-muted-foreground">
              Make sure the backend server is running on http://localhost:8000
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-muted-foreground">search</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Recommendations Yet</h3>
        <p className="text-muted-foreground">
          Build your profile and add skills to get personalized job recommendations.
        </p>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    if (score >= 0.4) return 'Fair Match';
    return 'Potential Match';
  };

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      {(totalJobsAnalyzed || processingTime) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
          <span>
            🎯 Found {recommendations.length} skill matches from {totalJobsAnalyzed} opportunities
          </span>
          {processingTime && (
            <span>⚡ Matched in {processingTime}ms</span>
          )}
        </div>
      )}

      {/* Job Recommendations */}
      <div className="space-y-4">
        {recommendations.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {job.job_title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-muted-foreground text-sm">
                          {job.company}
                        </p>
                        {job.location && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-muted-foreground text-sm">{job.location}</p>
                          </>
                        )}
                      </div>
                      {job.salary && (
                        <p className="text-sm font-medium text-green-600 mb-2">
                          💰 {job.salary}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getScoreColor(job.similarity_score)}>
                        {getScoreLabel(job.similarity_score)} ({Math.round(job.similarity_score * 100)}%)
                      </Badge>
                      <ApplicationForm
                        internshipId={`rec-${index}`}
                        internshipTitle={job.job_title}
                        companyName={job.company}
                      >
                        <Button className="btn-primary-glow px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                          Apply Now
                        </Button>
                      </ApplicationForm>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {job.job_description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.split(',').slice(0, 4).map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs px-2 py-0.5">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {job.skills.split(',').length > 4 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{job.skills.split(',').length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {job.experience && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-muted-foreground">Experience:</span>
                      <Badge variant="secondary" className="text-xs">
                        {job.experience}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;