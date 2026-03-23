package com.skillbridge.backend.studentskill;

import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.skill.SkillRepository;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/student-skills")
public class StudentSkillController {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentSkillController(
            StudentSkillRepository studentSkillRepository,
            StudentRepository studentRepository,
            SkillRepository skillRepository
    ) {
        this.studentSkillRepository = studentSkillRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    @PostMapping
    public StudentSkill addSkillToStudent(
            @RequestParam Long studentId,
            @RequestParam Long skillId,
            @RequestParam int proficiency
    ) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Skill skill = skillRepository.findById(skillId).orElseThrow();

        StudentSkill studentSkill = new StudentSkill(student, skill, proficiency);
        return studentSkillRepository.save(studentSkill);
    }

    @GetMapping("/student/{studentId}")
    public List<StudentSkill> getStudentSkills(@PathVariable Long studentId) {
        return studentSkillRepository.findByStudentId(studentId);
    }

    @DeleteMapping("/{id}")
    public void deleteStudentSkill(@PathVariable Long id) {
        studentSkillRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public StudentSkill updateProficiency(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload
    ) {
        StudentSkill studentSkill = studentSkillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        studentSkill.setProficiency(payload.get("proficiency"));

        return studentSkillRepository.save(studentSkill);
    }
}
