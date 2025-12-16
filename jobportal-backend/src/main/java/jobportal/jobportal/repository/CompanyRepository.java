package jobportal.jobportal.repository;


// src/main/java/com/jobportal/repository/CompanyRepository.java

import jobportal.jobportal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByEmail(String email);
    Optional<Company> findByEmailAndPassword(String email, String password);
}