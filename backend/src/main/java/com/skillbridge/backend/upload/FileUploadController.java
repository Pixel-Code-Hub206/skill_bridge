package com.skillbridge.backend.upload;

import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public FileUploadController(StudentRepository studentRepository, TeacherRepository teacherRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    @PostMapping("/avatar/{role}/{id}")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable String role,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile multipartFile) throws IOException {

        if (multipartFile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "Empty file"));
        }

        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        String extension = "";

        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            extension = fileName.substring(i);
        }

        String storedFileName = role + "_" + id + "_" + System.currentTimeMillis() + extension;
        String uploadDir = "uploads/avatars/";

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Could not save file"));
        }

        String avatarUrl = "/uploads/avatars/" + storedFileName;

        if (role.equalsIgnoreCase("student")) {
            Optional<Student> studentOpt = studentRepository.findById(id);
            if (studentOpt.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            Student student = studentOpt.get();
            student.setAvatarUrl(avatarUrl);
            studentRepository.save(student);
        } else if (role.equalsIgnoreCase("teacher")) {
            Optional<Teacher> teacherOpt = teacherRepository.findById(id);
            if (teacherOpt.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            Teacher teacher = teacherOpt.get();
            teacher.setAvatarUrl(avatarUrl);
            teacherRepository.save(teacher);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Invalid role"));
        }

        return ResponseEntity.ok(Collections.singletonMap("avatarUrl", avatarUrl));
    }
}
