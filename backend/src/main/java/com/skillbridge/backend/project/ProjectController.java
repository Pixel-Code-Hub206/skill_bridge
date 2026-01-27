package com.skillbridge.backend.project;

import com.skillbridge.backend.project.dto.ProjectCreateRequest;
import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.skill.SkillRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final TeacherRepository teacherRepository;
    private final SkillRepository skillRepository;

    public ProjectController(
            ProjectRepository projectRepository,
            TeacherRepository teacherRepository,
            SkillRepository skillRepository
    ) {
       this.projectRepository = projectRepository;
       this.teacherRepository = teacherRepository;
       this.skillRepository = skillRepository;
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
}
