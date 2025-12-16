import axios from "axios";

// Base URL for all API requests
// Use environment variable or fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("companyUser");
    if (token) {
      // If token is a JSON string (companyUser), parse it to get token
      let authToken = token;
      try {
        const userData = JSON.parse(token);
        authToken = userData.token || userData.id;
      } catch (e) {
        // If it's not JSON, use it as is
      }
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("authToken");
          localStorage.removeItem("companyUser");
          window.location.href = "/companies";
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error - No response received");
      throw new Error("Network error. Please check your connection.");
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Job API methods
export const jobAPI = {
  getAllJobs: () => api.get("/jobs"),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post("/jobs", jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  searchJobs: (keyword) => api.get("/jobs/search", { params: { keyword } }),
  getJobsByCategory: (category) => api.get(`/jobs/category/${category}`),
  getJobsByCompany: (companyId) => api.get(`/jobs/company/${companyId}`),
};

// Application API methods
export const applicationAPI = {
  applyForJob: (applicationData) => api.post("/apply", applicationData),
  getApplicationsByJob: (jobId) => api.get(`/apply/job/${jobId}`),
  getApplicationsByCompany: (companyId) =>
    api.get(`/apply/company/${companyId}`),
  getApplicationsByApplicant: (email) => api.get(`/apply/applicant/${email}`),
  updateApplicationStatus: (id, status) =>
    api.put(`/apply/${id}/status`, null, { params: { status } }),
};

// Company API methods
export const companyAPI = {
  registerCompany: (companyData) =>
    api.post("/companies/register", companyData),
  loginCompany: (email, password) =>
    api.post("/companies/login", null, { params: { email, password } }),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  getAllCompanies: () => api.get("/companies"),
  updateCompany: (id, companyData) => api.put(`/companies/${id}`, companyData),
};

export default api;
