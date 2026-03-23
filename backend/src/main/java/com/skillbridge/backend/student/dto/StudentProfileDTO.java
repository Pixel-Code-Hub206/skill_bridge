package com.skillbridge.backend.student.dto;

import com.skillbridge.backend.student.AcademicYear;
import com.skillbridge.backend.student.AvailabilityStatus;
import com.skillbridge.backend.student.Department;

import java.util.List;

public class StudentProfileDTO {

    private Long id;
    private String name;
    private String email;
    private Department department;
    private AcademicYear academicYear;
    private AvailabilityStatus availabilityStatus;
    private List<StudentSkillDTO> skills;

    // Optional fields with links
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String behanceUrl;
    private String avatarUrl;

    public StudentProfileDTO(
            Long id,
            String name,
            String email,
            Department department,
            AcademicYear academicYear,
            AvailabilityStatus availabilityStatus,
            String githubUrl,
            String linkedinUrl,
            String portfolioUrl,
            String behanceUrl,
            String avatarUrl,
            List<StudentSkillDTO> skills) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.academicYear = academicYear;
        this.availabilityStatus = availabilityStatus;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.behanceUrl = behanceUrl;
        this.avatarUrl = avatarUrl;
        this.skills = skills;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Department getDepartment() {
        return department;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public String getBehanceUrl() {
        return behanceUrl;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public List<StudentSkillDTO> getSkills() {
        return skills;
    }
}
