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
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ErrorAlert from "../Components/ErrorAlert";

const API_BASE_URL = "http://localhost:8080/api";

const CompaniesPage = () => {
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    location: "",
    website: "",
    industry: "",
    size: "",
  });
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchCompanies();

    // Check for saved user
    const savedUser = localStorage.getItem("companyUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("companyUser");
      }
    }

    // Check if we should show register modal from navigation
    if (location.state?.showRegister) {
      setShowRegister(true);
    }
  }, [location]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch companies");
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/companies/register`,
        newCompany
      );
      const registeredCompany = response.data;

      setCompanies([...companies, registeredCompany]);
      setCurrentUser(registeredCompany);
      localStorage.setItem("companyUser", JSON.stringify(registeredCompany));

      setShowRegister(false);
      setNewCompany({
        name: "",
        email: "",
        password: "",
        description: "",
        location: "",
        website: "",
        industry: "",
        size: "",
      });

      setError(null);
      alert("Registration successful! You are now logged in.");
    } catch (err) {
      setError(
        "Registration failed. Please check your information and try again."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/companies/login`,
        null,
        {
          params: {
            email: loginCredentials.email,
            password: loginCredentials.password,
          },
        }
      );

      const loggedInCompany = response.data;
      setCurrentUser(loggedInCompany);
      localStorage.setItem("companyUser", JSON.stringify(loggedInCompany));

      setShowLogin(false);
      setLoginCredentials({ email: "", password: "" });
      setError(null);
      alert("Login successful!");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("companyUser");
    setError(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/companies/${currentUser.id}`,
        currentUser
      );

      const updatedCompany = response.data;
      setCurrentUser(updatedCompany);
      localStorage.setItem("companyUser", JSON.stringify(updatedCompany));

      // Update in companies list
      setCompanies(
        companies.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        )
      );

      setShowProfile(false);
      setError(null);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading companies...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Companies</h2>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

      {/* User Info/Login Section */}
      <Card className="mb-4">
        <Card.Body>
          {currentUser ? (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                <h5 className="mb-1">
                  <i className="bi bi-building me-2"></i>
                  Welcome back, {currentUser.name}!
                </h5>
                <p className="text-muted mb-0">
                  <i className="bi bi-envelope me-1"></i>
                  {currentUser.email}
                </p>
                <Badge bg="info" className="mt-2">
                  <i className="bi bi-briefcase me-1"></i>
                  {currentUser.industry || "Company"}
                </Badge>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowProfile(true)}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Edit Profile
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => (window.location.href = "/jobs")}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Post a Job
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h5 className="mb-3">
                <i className="bi bi-building me-2"></i>
                Company Portal
              </h5>
              <p className="text-muted mb-4">
                Register your company to post jobs and manage applications.
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => setShowLogin(true)}
                  size="lg"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Company Login
                </Button>
                <Button
                  variant="success"
                  onClick={() => setShowRegister(true)}
                  size="lg"
                >
                  <i className="bi bi-building-add me-2"></i>
                  Register Company
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Companies List */}
      {companies.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i
              className="bi bi-building"
              style={{ fontSize: "3rem", color: "#6c757d" }}
            ></i>
            <h4 className="mt-3">No Companies Registered</h4>
            <p className="text-muted mb-4">
              Be the first to register your company!
            </p>
            <Button variant="primary" onClick={() => setShowRegister(true)}>
              Register Your Company
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Registered Companies ({companies.length})</h5>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={fetchCompanies}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </Button>
          </div>

          <Row>
            {companies.map((company) => (
              <Col md={6} lg={4} key={company.id} className="mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0">{company.name}</Card.Title>
                        {currentUser?.id === company.id && (
                          <Badge bg="success">You</Badge>
                        )}
                      </div>
                      <Card.Subtitle className="text-muted mb-2">
                        <i className="bi bi-geo-alt me-1"></i>
                        {company.location || "Location not specified"}
                      </Card.Subtitle>
                      {company.industry && (
                        <Badge bg="info" className="mb-2">
                          {company.industry}
                        </Badge>
                      )}
                    </div>

                    <Card.Text className="flex-grow-1">
                      {company.description?.length > 120
                        ? `${company.description.substring(0, 120)}...`
                        : company.description || "No description provided."}
                    </Card.Text>

                    <div className="mt-3">
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="bi bi-envelope me-1"></i>
                          {company.email}
                        </small>
                      </div>
                      {company.website && (
                        <div className="mb-3">
                          <small>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <i className="bi bi-globe me-1"></i>
                              {company.website.replace(/^https?:\/\//, "")}
                            </a>
                          </small>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-auto"
                      onClick={() => {
                        // Navigate to company's jobs
                        window.location.href = `/jobs?company=${company.id}`;
                      }}
                    >
                      <i className="bi bi-search me-1"></i>
                      View Jobs
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Register Modal */}
      <Modal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-building-add me-2"></i>
            Register Your Company
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={newCompany.name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter company email"
                    value={newCompany.email}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password"
                    value={newCompany.password}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <Form.Text className="text-muted">
                    Must be at least 6 characters long
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., New York, NY"
                    value={newCompany.location}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, location: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your company, mission, and values..."
                value={newCompany.description}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, description: e.target.value })
                }
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={newCompany.industry}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, industry: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Size</Form.Label>
                  <Form.Select
                    value={newCompany.size}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, size: e.target.value })
                    }
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com"
                value={newCompany.website}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, website: e.target.value })
                }
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowRegister(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Register Company
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Company Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your company email"
                value={loginCredentials.email}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    email: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={loginCredentials.password}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    password: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check type="checkbox" label="Remember me" />
              <a href="#" className="text-decoration-none">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Register here
                </a>
              </small>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-circle me-2"></i>
            Edit Company Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form onSubmit={handleUpdateProfile}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.name || ""}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={currentUser.email || ""}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Company Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={currentUser.description || ""}
                  onChange={(e) =>
                    setCurrentUser({
                      ...currentUser,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your company..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.location || ""}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          location: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentUser.industry || ""}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          industry: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      value={currentUser.website || ""}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          website: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Size</Form.Label>
                    <Form.Select
                      value={currentUser.size || ""}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, size: e.target.value })
                      }
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowProfile(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CompaniesPage;
