import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

const ApplicationCard = ({
  application,
  onStatusUpdate,
  showActions = true,
}) => {
  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "warning";
      case "REVIEWED":
        return "info";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusClick = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(application.id, newStatus);
    }
  };

  return (
    <Card className="mb-3 custom-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="mb-1">
              {application.applicantName || "Anonymous Applicant"}
            </Card.Title>
            <Card.Subtitle className="text-muted mb-2">
              {application.applicantEmail}
            </Card.Subtitle>
          </div>
          <Badge
            bg={getStatusVariant(application.status)}
            className="status-badge"
          >
            {application.status || "PENDING"}
          </Badge>
        </div>

        <div className="mb-3">
          <h6 className="mb-1">Application Details:</h6>
          <Card.Text>
            <strong>Job:</strong> {application.jobTitle}
            <br />
            <strong>Applied:</strong> {formatDate(application.appliedDate)}
          </Card.Text>

          {application.coverLetter && (
            <>
              <h6 className="mb-1">Cover Letter:</h6>
              <Card.Text className="text-muted">
                {application.coverLetter.length > 200
                  ? `${application.coverLetter.substring(0, 200)}...`
                  : application.coverLetter}
              </Card.Text>
            </>
          )}
        </div>

        {showActions && onStatusUpdate && (
          <div className="d-flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline-success"
              onClick={() => handleStatusClick("ACCEPTED")}
              disabled={application.status === "ACCEPTED"}
            >
              <i className="bi bi-check-circle"></i> Accept
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleStatusClick("REJECTED")}
              disabled={application.status === "REJECTED"}
            >
              <i className="bi bi-x-circle"></i> Reject
            </Button>
            <Button
              size="sm"
              variant="outline-info"
              onClick={() => handleStatusClick("REVIEWED")}
              disabled={application.status === "REVIEWED"}
            >
              <i className="bi bi-eye"></i> Mark as Reviewed
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => handleStatusClick("PENDING")}
              disabled={application.status === "PENDING"}
            >
              <i className="bi bi-clock"></i> Reset to Pending
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ApplicationCard;
