package com.skillbridge.backend.project;

import com.skillbridge.backend.project.dto.MatchedStudentsDTO;
import com.skillbridge.backend.project.dto.ProjectCreateRequest;
import com.skillbridge.backend.invitation.ProjectInvitationRepository;
import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.skill.SkillRepository;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

        private final ProjectRepository projectRepository;
        private final TeacherRepository teacherRepository;
        private final SkillRepository skillRepository;
        private final StudentRepository studentRepository;
        private final ProjectInvitationRepository invitationRepository;

        public ProjectController(
                        ProjectRepository projectRepository,
                        TeacherRepository teacherRepository,
                        SkillRepository skillRepository,
                        StudentRepository studentRepository,
                        ProjectInvitationRepository invitationRepository) {
                this.projectRepository = projectRepository;
                this.teacherRepository = teacherRepository;
                this.skillRepository = skillRepository;
                this.studentRepository = studentRepository;
                this.invitationRepository = invitationRepository;
        }

        @PostMapping
        public Project createProject(@RequestBody ProjectCreateRequest request) {

                Teacher teacher = teacherRepository.findById(request.getTeacherId())
                                .orElseThrow(() -> new RuntimeException("Teacher not found"));

                List<Skill> skills = skillRepository.findAllById(request.getRequiredSkillIds());

                Project project = new Project();
                project.setTitle(request.getTitle());
                project.setDescription(request.getDescription());
                project.setDeadline(request.getDeadline());
                project.setTeacher(teacher);
                project.setRequiredSkills(skills);

                return projectRepository.save(project);
        }

        @GetMapping
        public List<Project> getAllProjects() {
                return projectRepository.findAll();
        }

        @GetMapping("/teacher/{teacherId}")
        public List<Project> getProjectsByTeacher(@PathVariable Long teacherId) {
                return projectRepository.findByTeacherId(teacherId);
        }

        @GetMapping("/{projectId}/matched-students")
        public List<MatchedStudentsDTO> getMatchedStudents(
                        @PathVariable Long projectId,
                        @RequestParam(required = false) String department,
                        @RequestParam(required = false) String academicYear,
                        @RequestParam(required = false) String availabilityStatus,
                        @RequestParam(required = false) String skill) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                List<String> requiredSkillNames = project.getRequiredSkills()
                                .stream()
                                .map(s -> s.getName())
                                .toList();

                return studentRepository.findAll().stream()
                                .map(student -> {
                                        List<String> matchedSkills = student.getSkills().stream()
                                                        .map(ss -> ss.getSkill().getName())
                                                        .filter(requiredSkillNames::contains)
                                                        .toList();

                                        return new MatchedStudentsDTO(
                                                        student.getId(),
                                                        student.getName(),
                                                        student.getDepartment().name(),
                                                        student.getAcademicYear().name(),
                                                        student.getAvailabilityStatus().name(),
                                                        matchedSkills);
                                })
                                .filter(dto -> dto != null)
                                .filter(dto -> department == null || dto.getDepartment().equals(department))
                                .filter(dto -> academicYear == null || dto.getAcademicYear().equals(academicYear))
                                .filter(dto -> availabilityStatus == null
                                                || dto.getAvailabilityStatus().equals(availabilityStatus))
                                .filter(dto -> skill == null || dto.getMatchedSkills().contains(skill))
                                .toList();
        }

        @PutMapping("/{projectId}")
        public Project updateProject(
                        @PathVariable Long projectId,
                        @RequestBody Map<String, Object> payload) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                project.setTitle((String) payload.get("title"));
                project.setDescription((String) payload.get("description"));

                if (payload.get("status") != null) {
                        try {
                                project.setStatus(ProjectStatus.valueOf((String) payload.get("status")));
                        } catch (IllegalArgumentException e) {
                                // ignore invalid default status casts
                        }
                }

                String deadlineStr = (String) payload.get("deadline");
                if (deadlineStr != null && !deadlineStr.trim().isEmpty()) {
                        project.setDeadline(LocalDate.parse(deadlineStr));
                }

                if (payload.get("requiredSkillIds") != null) {
                        @SuppressWarnings("unchecked")
                        List<Integer> skillIdsRaw = (List<Integer>) payload.get("requiredSkillIds");

                        List<Long> skillIds = skillIdsRaw.stream()
                                        .map(Integer::longValue)
                                        .toList();

                        List<Skill> skills = skillRepository.findAllById(skillIds);

                        project.setRequiredSkills(skills);
                }

                return projectRepository.save(project);
        }

        @DeleteMapping("/{projectId}")
        public org.springframework.http.ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
                invitationRepository.deleteByProjectId(projectId);
                projectRepository.deleteById(projectId);
                return org.springframework.http.ResponseEntity.ok().build();
        }
}
