package jobportal.jobportal.controller;


// src/main/java/com/jobportal/controller/CompanyController.java
//package com.jobportal.controller;

//import com.jobportal.entity.Company;
//import com.jobportal.service.CompanyService;
import jobportal.jobportal.entity.Company;
import jobportal.jobportal.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:3000"})
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping("/register")
    public ResponseEntity<Company> registerCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.registerCompany(company));
    }

    @PostMapping("/login")
    public ResponseEntity<Company> loginCompany(
            @RequestParam String email,
            @RequestParam String password) {
        Company company = companyService.login(email, password);
        return company != null ?
                ResponseEntity.ok(company) :
                ResponseEntity.status(401).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return company != null ? ResponseEntity.ok(company) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company company) {
        Company updated = companyService.updateCompany(id, company);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}