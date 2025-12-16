package jobportal.jobportal.service;

// src/main/java/com/jobportal/service/JobService.java
//package com.jobportal.service;


import jobportal.jobportal.entity.Job;
import jobportal.jobportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findByActiveTrue();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public Job createJob(Job job) {
        job.setPostedDate(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public List<Job> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    public List<Job> getJobsByCategory(String category) {
        return jobRepository.findByCategory(category);
    }

    public List<Job> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId);
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);
        if (job != null) {
            job.setTitle(jobDetails.getTitle());
            job.setDescription(jobDetails.getDescription());
            job.setCategory(jobDetails.getCategory());
            job.setLocation(jobDetails.getLocation());
            job.setSalaryRange(jobDetails.getSalaryRange());
            job.setJobType(jobDetails.getJobType());
            job.setRequirements(jobDetails.getRequirements());
            job.setQualifications(jobDetails.getQualifications());
            job.setDeadline(jobDetails.getDeadline());
            return jobRepository.save(job);
        }
        return null;
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}