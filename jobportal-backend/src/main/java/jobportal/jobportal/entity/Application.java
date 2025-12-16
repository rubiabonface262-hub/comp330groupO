package jobportal.jobportal.entity;


// src/main/java/com/jobportal/entity/Application.java
//package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String coverLetter;
    private String resumeUrl; // URL to uploaded resume
    private LocalDateTime appliedDate;
    private String status = "PENDING"; // PENDING, REVIEWED, ACCEPTED, REJECTED

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}