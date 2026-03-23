package com.skillbridge.backend.invitation;

import com.skillbridge.backend.invitation.dto.InvitationCreateRequest;
import com.skillbridge.backend.project.Project;
import com.skillbridge.backend.project.ProjectRepository;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.activity.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "*")
public class ProjectInvitationController {

        private final ProjectInvitationRepository invitationRepository;
        private final ProjectRepository projectRepository;
        private final StudentRepository studentRepository;
        private final ActivityService activityService;

        public ProjectInvitationController(
                        ProjectInvitationRepository invitationRepository,
                        ProjectRepository projectRepository,
                        StudentRepository studentRepository,
                        ActivityService activityService) {
                this.invitationRepository = invitationRepository;
                this.projectRepository = projectRepository;
                this.studentRepository = studentRepository;
                this.activityService = activityService;
        }

        // Teacher sends invitation
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

                ProjectInvitation saved = invitationRepository.save(invitation);

                activityService.logActivity(project.getTeacher().getId(), "TEACHER", "Invitation sent",
                                "You invited " + student.getName() + " to \"" + project.getTitle() + "\"", "INFO");
                activityService.logActivity(
                                student.getId(), "STUDENT", "New Project Invitation", "You were invited to \""
                                                + project.getTitle() + "\" by " + project.getTeacher().getName(),
                                "INFO");

                return saved;
        }

        // Student views invitations
        @GetMapping("/student/{studentId}")
        public List<ProjectInvitation> getStudentInvitations(
                        @PathVariable Long studentId) {

                return invitationRepository.findByStudentId(studentId);
        }

        // Teacher view sent invitations
        @GetMapping("/teacher/{teacherId}")
        public List<ProjectInvitation> getTeacherInvitations(
                        @PathVariable Long teacherId) {

                return invitationRepository.findByProjectTeacherId(teacherId);
        }

        // Student updates invitation status
        @PutMapping("/{invitationId}/status")
        public ProjectInvitation updateInvitationStatus(
                        @PathVariable Long invitationId,
                        @RequestBody Map<String, String> payload) {

                ProjectInvitation invitation = invitationRepository.findById(invitationId)
                                .orElseThrow(() -> new RuntimeException("Invitation not found"));

                InvitationStatus newStatus = InvitationStatus.valueOf(payload.get("status"));
                invitation.setStatus(newStatus);
                ProjectInvitation saved = invitationRepository.save(invitation);

                String statusLower = newStatus.name().toLowerCase();
                String statusCapped = statusLower.substring(0, 1).toUpperCase() + statusLower.substring(1);
                String cssType = newStatus == InvitationStatus.ACCEPTED ? "SUCCESS" : "WARNING";

                activityService.logActivity(saved.getStudent().getId(), "STUDENT", "Project Invitation " + statusCapped,
                                "You " + statusLower + " the invitation for \"" + saved.getProject().getTitle() + "\"",
                                cssType);
                activityService.logActivity(saved.getProject().getTeacher().getId(), "TEACHER",
                                "Invitation " + statusCapped, saved.getStudent().getName() + " " + statusLower
                                                + " your invitation for \"" + saved.getProject().getTitle() + "\"",
                                cssType);

                return saved;
        }

        // Teacher views accepted candidates for a project
        @GetMapping("/project/{projectId}/accepted")
        public List<ProjectInvitation> getAcceptedProjectCandidates(
                        @PathVariable Long projectId) {
                return invitationRepository.findByProjectIdAndStatus(projectId, InvitationStatus.ACCEPTED);
        }

        // Student responds
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
