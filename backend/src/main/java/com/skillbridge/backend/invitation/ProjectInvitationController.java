package com.skillbridge.backend.invitation;

import com.skillbridge.backend.invitation.dto.InvitationCreateRequest;
import com.skillbridge.backend.project.Project;
import com.skillbridge.backend.project.ProjectRepository;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "*")
public class ProjectInvitationController {

    private final ProjectInvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final StudentRepository studentRepository;

    public ProjectInvitationController(
            ProjectInvitationRepository invitationRepository,
            ProjectRepository projectRepository,
            StudentRepository studentRepository
    ) {
        this.invitationRepository = invitationRepository;
        this.projectRepository = projectRepository;
        this.studentRepository = studentRepository;
    }

    //Teacher sends invitation
    @PostMapping
    public ProjectInvitation sendInvitation(
            @RequestBody InvitationCreateRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProject(project);
        invitation.setStudent(student);

        return invitationRepository.save(invitation);
    }

    //Student views invitations
    @GetMapping("/student/{studentId}")
    public List<ProjectInvitation> getStudentInvitations(
            @PathVariable Long studentId) {

        return invitationRepository.findByStudentId(studentId);
    }

    //Teacher view sent invitations
    @GetMapping("/teacher/{teacherId}")
    public List<ProjectInvitation> getTeacherInvitations(
            @PathVariable Long teacherId) {

        return invitationRepository.findByProjectTeacherId(teacherId);
    }

    //Student responds
    @PostMapping("/{invitationId}/accept")
    public ProjectInvitation acceptInvitation(
            @PathVariable Long invitationId) {

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(InvitationStatus.ACCEPTED);
        return invitationRepository.save(invitation);
    }

    @PostMapping("/{invitationId}/reject")
    public ProjectInvitation rejectInvitation(
            @PathVariable Long invitationId) {

        ProjectInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        invitation.setStatus(InvitationStatus.REJECTED);
        return invitationRepository.save(invitation);
    }
}
