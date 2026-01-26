package com.skillbridge.backend.student;
import com.skillbridge.backend.student.dto.StudentProfileDTO;
import com.skillbridge.backend.student.dto.StudentSkillDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student){
        return studentRepository.save(student);
    }

    @GetMapping
    public List<Student> getAllStudents() {
       return studentRepository.findAll();
    }

    @GetMapping("/{id}/profile")
    public StudentProfileDTO getStudentProfile(@PathVariable Long id){

        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

        List<StudentSkillDTO> skillDTOs = student.getSkills().stream()
                .map(ss -> new StudentSkillDTO(
                        ss.getSkill().getName(),
                        ss.getProficiency()
                )).toList();

        return new StudentProfileDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getDepartment(),
                student.getAcademicYear(),
                student.getAvailabilityStatus(),
                skillDTOs
        );
    }
}
