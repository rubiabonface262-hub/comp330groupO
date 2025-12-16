import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onDelete, showActions = true }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleApply = () => {
    // Navigate to job details or open apply modal
    navigate(`/jobs/${job.id}`, { state: { showApplyModal: true } });
  };

  return (
    <Card className="mb-3 job-card custom-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Card.Title className="mb-1">{job.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {job.companyName || `Company ID: ${job.companyId}`}
            </Card.Subtitle>

            <div className="mb-2">
              <Badge bg="info" className="me-2">
                {job.category}
              </Badge>
              {job.salary && <Badge bg="success">${job.salary}</Badge>}
            </div>

            <Card.Text className="text-muted small mb-2">
              <i className="bi bi-geo-alt"></i> {job.location || "Remote"}
            </Card.Text>

            <Card.Text className="mb-3">
              {job.description?.length > 150
                ? `${job.description.substring(0, 150)}...`
                : job.description}
            </Card.Text>
          </div>

          {job.createdAt && (
            <div className="text-end ms-3">
              <small className="text-muted">
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </small>
            </div>
          )}
        </div>

        {showActions && (
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleViewDetails}
                className="me-2"
              >
                <i className="bi bi-eye"></i> View Details
              </Button>
              <Button variant="outline-success" size="sm" onClick={handleApply}>
                <i className="bi bi-send"></i> Apply Now
              </Button>
            </div>

            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(job.id)}
              >
                <i className="bi bi-trash"></i> Delete
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default JobCard;
