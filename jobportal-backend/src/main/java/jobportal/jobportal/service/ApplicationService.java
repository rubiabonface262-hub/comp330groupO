package jobportal.jobportal.service;

// src/main/java/com/jobportal/service/ApplicationService.java
import jobportal.jobportal.entity.Application;
import jobportal.jobportal.entity.Job;
import jobportal.jobportal.repository.ApplicationRepository;
import jobportal.jobportal.repository.CompanyRepository;
import jobportal.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public Application applyForJob(Application application) {
        Job job = jobRepository.findById(application.getJob().getId()).orElse(null);
        if (job != null) {
            application.setJob(job);
            application.setCompany(job.getCompany());
            application.setAppliedDate(LocalDateTime.now());
            application.setStatus("PENDING");
            return applicationRepository.save(application);
        }
        return null;
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getApplicationsByCompany(Long companyId) {
        return applicationRepository.findByCompanyId(companyId);
    }

    public List<Application> getApplicationsByApplicant(String email) {
        return applicationRepository.findByApplicantEmail(email);
    }

    public Application updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id).orElse(null);
        if (application != null) {
            application.setStatus(status);
            return applicationRepository.save(application);
        }
        return null;
    }
}
