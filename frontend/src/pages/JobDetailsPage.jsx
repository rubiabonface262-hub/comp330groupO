import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ErrorAlert from "../Components/ErrorAlert";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedJob, setEditedJob] = useState({});
  const [applyModal, setApplyModal] = useState(false);
  const [application, setApplication] = useState({
    applicantName: "",
    applicantEmail: "",
    coverLetter: "",
    jobId: id,
    jobTitle: "",
  });

  useEffect(() => {
    fetchJobDetails();

    // Check if we should show apply modal from state
    if (location.state?.showApplyModal) {
      setApplyModal(true);
    }
  }, [id, location]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      setJob(response.data);
      setEditedJob(response.data);
      setApplication((prev) => ({
        ...prev,
        jobTitle: response.data.title,
      }));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch job details");
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/jobs/${id}`, editedJob);
      setJob(response.data);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update job. Please try again.");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/apply`, {
        ...application,
        status: "PENDING",
      });

      setApplyModal(false);
      setError(null);
      setApplication({
        applicantName: "",
        applicantEmail: "",
        coverLetter: "",
        jobId: id,
        jobTitle: job?.title || "",
      });

      // Show success message
      alert("Application submitted successfully!");
    } catch (err) {
      setError("Failed to submit application. Please check your details.");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/jobs/${id}`);
        setError(null);
        navigate("/jobs");
      } catch (err) {
        setError("Failed to delete job. Please try again.");
      }
    }
  };

  const isJobOwner = user && job && user.id === job.companyId;

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner message="Loading job details..." />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="mt-5">
        <ErrorAlert error="Job not found" onClose={() => navigate("/jobs")} />
        <Button
          variant="secondary"
          onClick={() => navigate("/jobs")}
          className="mt-3"
        >
          ← Back to Jobs
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button
        variant="outline-secondary"
        onClick={() => navigate("/jobs")}
        className="mb-3"
      >
        <i className="bi bi-arrow-left me-1"></i>
        Back to Jobs
      </Button>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      <Card>
        <Card.Body>
          {editing ? (
            <Form onSubmit={handleUpdate}>
              <h4 className="mb-4">Edit Job</h4>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Job Title *</Form.Label>
                    <Form.Control
                      value={editedJob.title || ""}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, title: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Control
                      value={editedJob.category || ""}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, category: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={editedJob.description || ""}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, description: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      value={editedJob.location || ""}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, location: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salary *</Form.Label>
                    <Form.Control
                      type="number"
                      value={editedJob.salary || ""}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, salary: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2 mt-4">
                <Button variant="primary" type="submit">
                  <i className="bi bi-check-circle me-1"></i>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
                <div className="mb-3 mb-md-0">
                  <h2 className="mb-2">{job.title}</h2>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg="info" className="fs-6">
                      {job.category}
                    </Badge>
                    <Badge bg="success" className="fs-6">
                      ${job.salary}
                    </Badge>
                  </div>
                  <p className="text-muted mb-0">
                    <i className="bi bi-building me-1"></i>
                    {job.companyName || `Company ID: ${job.companyId}`}
                  </p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {!isJobOwner && (
                    <Button
                      variant="primary"
                      onClick={() => setApplyModal(true)}
                      size="lg"
                    >
                      <i className="bi bi-send me-1"></i>
                      Apply Now
                    </Button>
                  )}

                  {isJobOwner && (
                    <>
                      <Button
                        variant="outline-warning"
                        onClick={() => setEditing(true)}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </Button>
                      <Button variant="outline-danger" onClick={handleDelete}>
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">
                    <i className="bi bi-card-text me-2"></i>
                    Job Description
                  </h5>
                  <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
                </Card.Body>
              </Card>

              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Job Details
                      </h6>
                      <div className="mb-2">
                        <strong>Location:</strong>
                        <div className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {job.location}
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Salary:</strong>
                        <div className="text-muted">${job.salary} per year</div>
                      </div>
                      <div className="mb-2">
                        <strong>Posted Date:</strong>
                        <div className="text-muted">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6 className="mb-3">
                        <i className="bi bi-building me-2"></i>
                        Company Information
                      </h6>
                      <p className="text-muted">
                        {job.companyDescription ||
                          "Company details not available."}
                      </p>
                      {user && isJobOwner && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/applications?jobId=${job.id}`)
                          }
                        >
                          <i className="bi bi-people me-1"></i>
                          View Applications ({job.applicationCount || 0})
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Application Modal */}
      {applyModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-send me-2"></i>
                  Apply for {job.title}
                </h5>
                <Button
                  variant="close"
                  onClick={() => setApplyModal(false)}
                  aria-label="Close"
                ></Button>
              </div>
              <div className="modal-body">
                <Form onSubmit={handleApply}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={application.applicantName}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          applicantName: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={application.applicantEmail}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          applicantEmail: e.target.value,
                        })
                      }
                      required
                    />
                    <Form.Text className="text-muted">
                      We'll send application updates to this email.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Cover Letter *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Tell us why you're the right candidate for this position..."
                      value={application.coverLetter}
                      onChange={(e) =>
                        setApplication({
                          ...application,
                          coverLetter: e.target.value,
                        })
                      }
                      required
                    />
                    <Form.Text className="text-muted">
                      Include your relevant experience, skills, and why you're
                      interested in this role.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      type="submit"
                      className="flex-grow-1"
                    >
                      <i className="bi bi-send me-1"></i>
                      Submit Application
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setApplyModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default JobDetailsPage;
