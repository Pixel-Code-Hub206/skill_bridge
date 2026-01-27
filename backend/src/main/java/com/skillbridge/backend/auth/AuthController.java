package com.skillbridge.backend.auth;

import com.skillbridge.backend.auth.dto.LoginRequest;
import com.skillbridge.backend.auth.dto.LoginResponse;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentRepository studentRepository;

    public AuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestBody LoginRequest request) {

        Optional<Student> studentOpt = studentRepository.findByUsername(request.getUsername());

        if(studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        Student student = studentOpt.get();

        if(!student.getPassword().equals(request.getPassword())) {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        LoginResponse response = new LoginResponse(
                student.getId(),
                "STUDENT",
                student.getName()
        );

        return ResponseEntity.ok(response);
    }
}
