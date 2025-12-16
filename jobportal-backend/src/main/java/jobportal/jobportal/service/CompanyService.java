package jobportal.jobportal.service;

import jobportal.jobportal.entity.Company;
import jobportal.jobportal.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public Company registerCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company login(String email, String password) {
        Optional<Company> company = companyRepository.findByEmailAndPassword(email, password);
        return company.orElse(null);
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id).orElse(null);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company updateCompany(Long id, Company companyDetails) {
        // First check if the company exists
        Optional<Company> optionalCompany = companyRepository.findById(id);

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();

            // Update fields if they are not null in companyDetails
            if (companyDetails.getName() != null) {
                company.setName(companyDetails.getName());
            }
            if (companyDetails.getEmail() != null) {
                company.setEmail(companyDetails.getEmail());
            }
            if (companyDetails.getPhone() != null) {
                company.setPhone(companyDetails.getPhone());
            }
            if (companyDetails.getWebsite() != null) {
                company.setWebsite(companyDetails.getWebsite());
            }
            if (companyDetails.getLocation() != null) {
                company.setLocation(companyDetails.getLocation());
            }
            if (companyDetails.getDescription() != null) {
                company.setDescription(companyDetails.getDescription());
            }

            return companyRepository.save(company);
        }
        return null;
    }

    // Optional: Add a delete method if needed
    public boolean deleteCompany(Long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}