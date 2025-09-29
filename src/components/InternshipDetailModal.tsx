import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, Calendar, DollarSign, Users, Building } from "lucide-react";

interface InternshipDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internship: any;
  onApply?: (internshipId: string) => void;
  onSave?: (internshipId: string) => void;
  isSaved?: boolean;
  isApplied?: boolean;
}

const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({
  open,
  onOpenChange,
  internship,
  onApply,
  onSave,
  isSaved = false,
  isApplied = false
}) => {
  if (!internship) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">
                {internship.companies?.name?.charAt(0) || 'C'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{internship.title}</h2>
              <p className="text-lg text-primary font-semibold">{internship.companies?.name || 'Company'}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Internship Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold">{internship.location || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{internship.duration || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-sm font-semibold">{internship.department || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stipend</p>
                  <p className="text-sm font-semibold">{internship.stipend || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {internship.description || 'No description available.'}
              </p>
            </div>
          </Card>

          {/* Requirements Section */}
          {internship.requirements && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {internship.requirements}
                </p>
              </div>
            </Card>
          )}

          {/* Application Deadline */}
          {internship.application_deadline && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Application Deadline
              </h3>
              <p className="text-lg font-semibold text-foreground">
                {new Date(internship.application_deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </Card>
          )}

          {/* Company Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              About {internship.companies?.name || 'Company'}
            </h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {internship.companies?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">{internship.companies?.name || 'Company'}</h4>
                <p className="text-muted-foreground">
                  {internship.companies?.description || 'A leading company in the industry.'}
                </p>
                {internship.companies?.website && (
                  <a 
                    href={internship.companies.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-2 inline-block"
                  >
                    Visit Company Website
                  </a>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t">
            {!isApplied ? (
              <Button
                onClick={() => onApply?.(internship.id)}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold"
              >
                Apply Now
              </Button>
            ) : (
              <Button
                disabled
                className="bg-green-600 text-white px-8 py-3 text-lg font-semibold"
              >
                Applied ✓
              </Button>
            )}
            
            <Button
              onClick={() => onSave?.(internship.id)}
              variant={isSaved ? "default" : "outline"}
              className={`px-6 py-3 text-lg font-medium ${
                isSaved 
                  ? 'bg-primary text-white' 
                  : 'border-primary text-primary hover:bg-primary/10'
              }`}
            >
              {isSaved ? 'Saved ✓' : 'Save for Later'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipDetailModal;
