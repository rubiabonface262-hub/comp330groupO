import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../Components/SearchFilter";
import JobCard from "../Components/JobCard";
import ErrorAlert from "../Components/ErrorAlert";
import Spinner from "../Components/Spinner";

const API_BASE_URL = "http://localhost:8080/api";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
    companyId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch jobs");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const response = await axios.get(`${API_BASE_URL}/jobs/search`, {
          params: { keyword: searchKeyword },
        });
        setJobs(response.data);
      } else {
        fetchJobs();
      }
    } catch (err) {
      setError("Search failed. Please try again.");
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      if (category) {
        const response = await axios.get(
          `${API_BASE_URL}/jobs/category/${category}`
        );
        setJobs(response.data);
        setSelectedCategory(category);
      } else {
        fetchJobs();
        setSelectedCategory("");
      }
    } catch (err) {
      setError("Filter failed. Please try again.");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/jobs`, currentJob);
      setJobs([...jobs, response.data]);
      setShowModal(false);
      setCurrentJob({
        title: "",
        description: "",
        category: "",
        location: "",
        salary: "",
        companyId: "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to create job. Please check your input.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_BASE_URL}/jobs/${id}`);
        setJobs(jobs.filter((job) => job.id !== id));
        setError(null);
      } catch (err) {
        setError("Failed to delete job. Please try again.");
      }
    }
  };

  const resetFilters = () => {
    fetchJobs();
    setSearchKeyword("");
    setSelectedCategory("");
    setError(null);
  };

  if (loading) return <Spinner message="Loading jobs..." />;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Listings</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-1"></i>
          Post New Job
        </Button>
      </div>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      {/* Search and Filter Section */}
      <SearchFilter
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryFilter}
        onSearch={handleSearch}
        onReset={resetFilters}
      />

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i
              className="bi bi-briefcase"
              style={{ fontSize: "3rem", color: "#6c757d" }}
            ></i>
            <h4 className="mt-3">No Jobs Found</h4>
            <p className="text-muted">
              Try adjusting your search or check back later.
            </p>
            <Button variant="primary" onClick={resetFilters}>
              View All Jobs
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col md={6} lg={4} key={job.id} className="mb-4">
              <JobCard job={job} onDelete={handleDelete} showActions={true} />
            </Col>
          ))}
        </Row>
      )}

      {/* Create Job Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-briefcase me-2"></i>
            Post New Job
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateJob}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    value={currentJob.title}
                    onChange={(e) =>
                      setCurrentJob({ ...currentJob, title: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., IT, Finance, Marketing"
                    value={currentJob.category}
                    onChange={(e) =>
                      setCurrentJob({ ...currentJob, category: e.target.value })
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
                rows={4}
                placeholder="Describe the job responsibilities, requirements, and benefits..."
                value={currentJob.description}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., New York, Remote"
                    value={currentJob.location}
                    onChange={(e) =>
                      setCurrentJob({ ...currentJob, location: e.target.value })
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
                    placeholder="e.g., 75000"
                    value={currentJob.salary}
                    onChange={(e) =>
                      setCurrentJob({ ...currentJob, salary: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Company ID *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your company ID"
                value={currentJob.companyId}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, companyId: e.target.value })
                }
                required
              />
              <Form.Text className="text-muted">
                You need to be registered as a company to post jobs.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Post Job
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default JobsPage;
