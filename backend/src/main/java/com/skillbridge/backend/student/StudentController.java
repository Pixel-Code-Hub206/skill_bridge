package com.skillbridge.backend.student;
import com.skillbridge.backend.student.dto.StudentProfileDTO;
import com.skillbridge.backend.student.dto.StudentSkillDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/students")
@CrossOrigin(
        origins = "*"
)
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
                student.getGithubUrl(),
                student.getLinkedinUrl(),
                student.getPortfolioUrl(),
                student.getBehanceUrl(),
                skillDTOs
        );
    }
    @PutMapping("/{studentId}")
    public Student updateStudent(
            @PathVariable Long studentId,
            @RequestBody Student updatedStudent
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setDepartment(updatedStudent.getDepartment());
        student.setAcademicYear(updatedStudent.getAcademicYear());
        student.setAvailabilityStatus(updatedStudent.getAvailabilityStatus());
        student.setGithubUrl(updatedStudent.getGithubUrl());
        student.setLinkedinUrl(updatedStudent.getLinkedinUrl());
        student.setPortfolioUrl(updatedStudent.getPortfolioUrl());
        student.setBehanceUrl(updatedStudent.getBehanceUrl());

        return studentRepository.save(student);
    }
}
