package com.skillbridge.backend.student;
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
}
