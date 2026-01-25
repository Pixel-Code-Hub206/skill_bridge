package com.skillbridge.backend.studentskill;

import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.skill.SkillRepository;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import org.springframework.web.bind.annotation.*;

@RestController
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
}
