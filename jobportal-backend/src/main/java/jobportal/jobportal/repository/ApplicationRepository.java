package jobportal.jobportal.repository;


// src/main/java/com/jobportal/repository/ApplicationRepository.java

import jobportal.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByApplicantEmail(String email);
    List<Application> findByCompanyId(Long companyId);
}