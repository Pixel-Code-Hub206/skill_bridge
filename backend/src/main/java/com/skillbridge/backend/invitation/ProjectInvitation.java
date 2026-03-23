package com.skillbridge.backend.invitation;

import com.skillbridge.backend.project.Project;
import com.skillbridge.backend.student.Student;
import jakarta.persistence.*;

@Entity
@Table(name = "project_invitations")
public class ProjectInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    private InvitationStatus status = InvitationStatus.PENDING;

    public ProjectInvitation() {
    }

    public Long getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public Student getStudent() {
        return student;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }
}
