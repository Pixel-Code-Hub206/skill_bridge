package com.skillbridge.backend.student;

import com.skillbridge.backend.studentskill.StudentSkill;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String username;

    private String password;

    private String name;

    private String email;

    @Enumerated(EnumType.STRING)
    private Department department;

    @Enumerated(EnumType.STRING)
    private AcademicYear academicYear;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentSkill> skills = new ArrayList<>();

    public Student() {}

    public Student(
            String name,
            String email,
            String username,
            String password,
            Department department,
            AcademicYear academicYear,
            AvailabilityStatus availabilityStatus
    ) {
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.department = department;
        this.academicYear = academicYear;
        this.availabilityStatus = availabilityStatus;
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

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
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

    public List<StudentSkill> getSkills() {
        return skills;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}
