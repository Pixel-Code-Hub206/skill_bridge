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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.skillbridge.backend.security.JwtUtils;
import java.security.Principal;
import com.skillbridge.backend.auth.dto.ChangePasswordRequest;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(@RequestBody LoginRequest request) {

        Optional<Student> studentOpt = studentRepository.findByUsername(request.getUsername());

        if (studentOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), studentOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        Student student = studentOpt.get();
        String token = jwtUtils.generateToken(student.getId(), "STUDENT");

        LoginResponse response = new LoginResponse(
                student.getId(),
                "STUDENT",
                student.getName(),
                token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<?> teacherLogin(@RequestBody LoginRequest request) {

        Optional<Teacher> teacherOpt = teacherRepository.findByUsername(request.getUsername());

        if (teacherOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), teacherOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        Teacher teacher = teacherOpt.get();
        String token = jwtUtils.generateToken(teacher.getId(), "TEACHER");

        LoginResponse response = new LoginResponse(
                teacher.getId(),
                "TEACHER",
                teacher.getName(),
                token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/change")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Long userId = Long.parseLong(principal.getName());
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isStudent = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));

        if (isStudent) {
            Optional<Student> studentOpt = studentRepository.findById(userId);
            if (studentOpt.isEmpty()
                    || !passwordEncoder.matches(request.getOldPassword(), studentOpt.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password");
            }
            Student student = studentOpt.get();
            student.setPassword(passwordEncoder.encode(request.getNewPassword()));
            studentRepository.save(student);
        } else {
            Optional<Teacher> teacherOpt = teacherRepository.findById(userId);
            if (teacherOpt.isEmpty()
                    || !passwordEncoder.matches(request.getOldPassword(), teacherOpt.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password");
            }
            Teacher teacher = teacherOpt.get();
            teacher.setPassword(passwordEncoder.encode(request.getNewPassword()));
            teacherRepository.save(teacher);
        }

        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password updated successfully"));
    }
}
