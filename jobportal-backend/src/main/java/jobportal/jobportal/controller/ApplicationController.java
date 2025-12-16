package jobportal.jobportal.controller;


// src/main/java/com/jobportal/controller/ApplicationController.java

import jobportal.jobportal.entity.Application;
import jobportal.jobportal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/apply")
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:3000"})
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> applyForJob(@RequestBody Application application) {
        Application savedApplication = applicationService.applyForJob(application);
        return savedApplication != null ?
                ResponseEntity.ok(savedApplication) :
                ResponseEntity.badRequest().build();
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Application>> getApplicationsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCompany(companyId));
    }

    @GetMapping("/applicant/{email}")
    public ResponseEntity<List<Application>> getApplicationsByApplicant(@PathVariable String email) {
        return ResponseEntity.ok(applicationService.getApplicationsByApplicant(email));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Application updated = applicationService.updateApplicationStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}
