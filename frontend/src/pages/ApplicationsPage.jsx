import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Badge,
  Button,
  Form,
  Alert,
  Spinner as BootstrapSpinner, // Renamed this import
  Card,
  Row,
  Col,
} from "react-bootstrap";
import ApplicationCard from "../Components/ApplicationCard";
import ErrorAlert from "../Components/ErrorAlert";
import Spinner from "../Components/Spinner"; // Keep your custom Spinner

const API_BASE_URL = "http://localhost:8080/api";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("all");
  const [searchParam, setSearchParam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // In a real app, you might want to fetch all applications from a dedicated endpoint
    // For now, we'll initialize with empty array and provide sample data
    const sampleApplications = [
      {
        id: 1,
        applicantName: "John Doe",
        applicantEmail: "john@example.com",
        jobTitle: "Senior Software Engineer",
        status: "PENDING",
        appliedDate: "2024-01-15",
        coverLetter: "I am excited to apply for this position...",
      },
      {
        id: 2,
        applicantName: "Jane Smith",
        applicantEmail: "jane@example.com",
        jobTitle: "Marketing Manager",
        status: "REVIEWED",
        appliedDate: "2024-01-14",
        coverLetter: "With my 5 years of experience in marketing...",
      },
    ];

    setApplications(sampleApplications);
    setFilteredApps(sampleApplications);
    setLoading(false);
  }, []);

  const fetchByJob = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/apply/job/${searchParam}`
      );
      setApplications(response.data);
      setFilteredApps(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch applications by job");
    }
  };

  const fetchByCompany = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/apply/company/${searchParam}`
      );
      setApplications(response.data);
      setFilteredApps(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch applications by company");
    }
  };

  const fetchByApplicant = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/apply/applicant/${searchParam}`
      );
      setApplications(response.data);
      setFilteredApps(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch applications by applicant");
    }
  };

  const handleSearch = () => {
    if (!searchParam.trim()) {
      setError("Please enter a search parameter");
      return;
    }

    switch (view) {
      case "byJob":
        fetchByJob();
        break;
      case "byCompany":
        fetchByCompany();
        break;
      case "byApplicant":
        fetchByApplicant();
        break;
      default:
        setFilteredApps(applications);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/apply/${id}/status?status=${status}`
      );
      const updatedApps = applications.map((app) =>
        app.id === id ? response.data : app
      );
      setApplications(updatedApps);
      setFilteredApps(
        updatedApps.filter(
          (app) => !filterStatus || app.status === filterStatus
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to update application status");
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    if (status === "") {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter((app) => app.status === status));
    }
  };

  const resetFilters = () => {
    setView("all");
    setSearchParam("");
    setFilterStatus("");
    setFilteredApps(applications);
    setError(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "warning",
      REVIEWED: "info",
      ACCEPTED: "success",
      REJECTED: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) return <Spinner message="Loading applications..." />;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Applications</h2>
        <Button variant="outline-secondary" onClick={resetFilters}>
          {/* Replace Bootstrap icon with emoji or text */}
          🔄 Reset Filters
        </Button>
      </div>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      {/* Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filter Applications</h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>View By:</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={view === "all" ? "primary" : "outline-primary"}
                    onClick={() => setView("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={view === "byJob" ? "primary" : "outline-primary"}
                    onClick={() => setView("byJob")}
                    size="sm"
                  >
                    By Job ID
                  </Button>
                  <Button
                    variant={
                      view === "byCompany" ? "primary" : "outline-primary"
                    }
                    onClick={() => setView("byCompany")}
                    size="sm"
                  >
                    By Company ID
                  </Button>
                  <Button
                    variant={
                      view === "byApplicant" ? "primary" : "outline-primary"
                    }
                    onClick={() => setView("byApplicant")}
                    size="sm"
                  >
                    By Applicant Email
                  </Button>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status:</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  <Badge
                    pill
                    bg={filterStatus === "" ? "primary" : "light"}
                    text={filterStatus === "" ? "white" : "dark"}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleStatusFilter("")}
                    className="px-3 py-2"
                  >
                    All
                  </Badge>
                  {["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"].map(
                    (status) => (
                      <Badge
                        key={status}
                        pill
                        bg={filterStatus === status ? "primary" : "light"}
                        text={filterStatus === status ? "white" : "dark"}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStatusFilter(status)}
                        className="px-3 py-2"
                      >
                        {status}
                      </Badge>
                    )
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          {view !== "all" && (
            <Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>
                    {view === "byJob"
                      ? "Enter Job ID"
                      : view === "byCompany"
                      ? "Enter Company ID"
                      : "Enter Applicant Email"}
                  </Form.Label>
                  <Form.Control
                    type={view === "byApplicant" ? "email" : "number"}
                    placeholder={
                      view === "byJob"
                        ? "e.g., 123"
                        : view === "byCompany"
                        ? "e.g., 456"
                        : "e.g., applicant@example.com"
                    }
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-100"
                >
                  🔍 Search
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div
              style={{
                fontSize: "3rem",
                color: "#6c757d",
                marginBottom: "1rem",
              }}
            >
              📋
            </div>
            <h4 className="mt-3">No Applications Found</h4>
            <p className="text-muted">
              {filterStatus
                ? `No applications with status: ${filterStatus}`
                : "Try adjusting your filters or check back later."}
            </p>
            <Button variant="primary" onClick={resetFilters}>
              View All Applications
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Table View (for overview) */}
          <Card className="mb-4 d-none d-lg-block">
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Applicant</th>
                      <th>Job Title</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>
                          <div>
                            <strong>{app.applicantName}</strong>
                            {app.coverLetter && (
                              <div className="small text-muted">
                                {app.coverLetter.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{app.jobTitle}</td>
                        <td>{app.applicantEmail}</td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                handleStatusUpdate(app.id, "ACCEPTED")
                              }
                              disabled={app.status === "ACCEPTED"}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() =>
                                handleStatusUpdate(app.id, "REJECTED")
                              }
                              disabled={app.status === "REJECTED"}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Card View (for mobile) */}
          <div className="d-lg-none">
            {filteredApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onStatusUpdate={handleStatusUpdate}
                showActions={true}
              />
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default ApplicationsPage;
