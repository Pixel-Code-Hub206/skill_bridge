package com.skillbridge.backend.security;

import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(StudentRepository studentRepository, TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("🔄 Checking for unhashed legacy passwords in database...");

        List<Student> students = studentRepository.findAll();
        int studentUpdates = 0;
        for (Student s : students) {
            if (s.getPassword() != null && !s.getPassword().startsWith("$2a$")) {
                s.setPassword(passwordEncoder.encode(s.getPassword()));
                studentRepository.save(s);
                studentUpdates++;
            }
        }

        List<Teacher> teachers = teacherRepository.findAll();
        int teacherUpdates = 0;
        for (Teacher t : teachers) {
            if (t.getPassword() != null && !t.getPassword().startsWith("$2a$")) {
                t.setPassword(passwordEncoder.encode(t.getPassword()));
                teacherRepository.save(t);
                teacherUpdates++;
            }
        }

        if (studentUpdates > 0 || teacherUpdates > 0) {
            System.out.println("✅ Successfully encrypted " + studentUpdates + " student(s) and " + teacherUpdates
                    + " teacher(s).");
        } else {
            System.out.println("✅ All database accounts are already securely hashed.");
        }
    }
}
