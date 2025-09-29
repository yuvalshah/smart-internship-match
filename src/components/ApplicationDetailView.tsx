import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface ApplicationDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  open,
  onOpenChange,
  application
}) => {
  if (!application) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected_by_student':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved - Action Required';
      case 'rejected':
        return 'Not Selected';
      case 'accepted':
        return 'Accepted';
      case 'rejected_by_student':
        return 'Declined';
      default:
        return 'Under Review';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {application.internships?.companies?.name?.charAt(0) || 'C'}
              </span>
            </div>
            Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {application.internships?.title || 'Internship Position'}
              </h3>
              <Badge className={getStatusColor(application.status)}>
                {getStatusText(application.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              {application.internships?.companies?.name || 'Company'} • {application.internships?.location}
            </p>
            <p className="text-sm text-muted-foreground">
              Applied: {new Date(application.created_at).toLocaleDateString()}
              {application.updated_at !== application.created_at && (
                <span className="ml-2">
                  • Updated: {new Date(application.updated_at).toLocaleDateString()}
                </span>
              )}
            </p>
          </Card>

          {/* Cover Letter */}
          {application.cover_letter && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
            </Card>
          )}

          {/* Application Notes */}
          {application.application_notes && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{application.application_notes}</p>
              </div>
            </Card>
          )}

          {/* Interview Information */}
          {application.interview_date && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Interview Information</h3>
              <div className="space-y-2">
                <p><strong>Interview Date:</strong> {new Date(application.interview_date).toLocaleDateString()}</p>
                {application.interview_notes && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm"><strong>Interview Notes:</strong></p>
                    <p className="text-sm whitespace-pre-wrap mt-1">{application.interview_notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Offer Letter */}
          {application.offer_letter_url && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Offer Letter</h3>
              <Button asChild variant="outline">
                <a href={application.offer_letter_url} target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined mr-2">download</span>
                  Download Offer Letter
                </a>
              </Button>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.rejection_reason && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Feedback</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{application.rejection_reason}</p>
              </div>
            </Card>
          )}

          {/* Internship Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Internship Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{application.internships?.companies?.name || 'Company'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm">{application.internships?.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm capitalize">{application.internships?.internship_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">{application.internships?.duration_weeks ? `${application.internships.duration_weeks} weeks` : 'Not specified'}</p>
                </div>
              </div>
              {application.internships?.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{application.internships.description}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
