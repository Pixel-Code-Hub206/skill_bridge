package com.skillbridge.backend.project.dto;

import java.util.List;

public class MatchedStudentsDTO {

    private Long studentId;
    private String name;
    private String department;
    private String academicYear;
    private String availabilityStatus;
    private List<String> matchedSkills;

    public MatchedStudentsDTO(
            Long studentId,
            String name,
            String department,
            String academicYear,
            String availabilityStatus,
            List<String> matchedSkills
    ) {
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.academicYear = academicYear;
        this.availabilityStatus = availabilityStatus;
        this.matchedSkills = matchedSkills;
    }

    public Long getStudentId() { return studentId; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getAcademicYear() { return academicYear; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public List<String> getMatchedSkills() { return matchedSkills; }
}
