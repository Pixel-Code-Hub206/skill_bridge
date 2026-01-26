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

    public StudentProfileDTO(
            Long id,
            String name,
            String email,
            Department department,
            AcademicYear academicYear,
            AvailabilityStatus availabilityStatus,
            List<StudentSkillDTO> skills
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.academicYear = academicYear;
        this.availabilityStatus = availabilityStatus;
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

    public List<StudentSkillDTO> getSkills() {
        return skills;
    }
}
