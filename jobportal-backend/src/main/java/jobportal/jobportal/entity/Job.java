package jobportal.jobportal.entity;

// src/main/java/com/jobportal/entity/Job.java
//package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String category; // e.g., IT, Healthcare, Finance, Education
    private String location;
    private String salaryRange;
    private String jobType; // Full-time, Part-time, Contract, Internship
    private LocalDateTime postedDate;
    private LocalDateTime deadline;
    private String requirements;
    private String qualifications;
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();
}
