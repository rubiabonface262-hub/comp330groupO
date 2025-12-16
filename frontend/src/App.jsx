import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Container, Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CompaniesPage from "./pages/CompaniesPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/companies" />;
  }

  return children;
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-briefcase me-2"></i>
          Job Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/jobs">
              <i className="bi bi-search me-1"></i>
              Find Jobs
            </Nav.Link>
            <Nav.Link as={Link} to="/companies">
              <i className="bi bi-building me-1"></i>
              Companies
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/applications">
                <i className="bi bi-list-check me-1"></i>
                Applications
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/company/${user.id}`}>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/post-job">
                    <i className="bi bi-plus-circle me-2"></i>
                    Post a Job
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/companies"
                  className="me-2"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Button>
                <Button
                  variant="light"
                  as={Link}
                  to="/companies"
                  state={{ showRegister: true }}
                >
                  <i className="bi bi-building-add me-1"></i>
                  Register Company
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navigation />

          <Container className="flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<Navigate to="/jobs" />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/companies" element={<CompaniesPage />} />
            </Routes>
          </Container>

          {/* Footer */}
          <footer className="bg-dark text-white py-4 mt-auto">
            <Container>
              <div className="row">
                <div className="col-md-6">
                  <h5>Job Portal</h5>
                  <p className="mb-0">
                    Connecting talented professionals with amazing companies.
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Job Portal. All rights
                    reserved.
                  </p>
                  <div className="mt-2">
                    <a href="#" className="text-white me-3">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="text-white me-3">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="text-white">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
