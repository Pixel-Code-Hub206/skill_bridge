package com.skillbridge.backend.auth;

import com.skillbridge.backend.auth.dto.LoginRequest;
import com.skillbridge.backend.auth.dto.LoginResponse;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public AuthController(StudentRepository studentRepository,
                          TeacherRepository teacherRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestBody LoginRequest request) {

        Optional<Student> studentOpt = studentRepository.findByUsername(request.getUsername());

        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        Student student = studentOpt.get();

        if (!student.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        LoginResponse response = new LoginResponse(
                student.getId(),
                "STUDENT",
                student.getName()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<?> teacherLogin(@RequestBody LoginRequest request) {

        Optional<Teacher> teacherOpt =
                teacherRepository.findByUsername(request.getUsername());

        if(teacherOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        Teacher teacher = teacherOpt.get();

        if(!teacher.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        LoginResponse response = new LoginResponse(
                teacher.getId(),
                "TEACHER",
                teacher.getName()
        );

        return ResponseEntity.ok(response);
    }
}
