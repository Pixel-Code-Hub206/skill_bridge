package com.skillbridge.backend.security;

import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.skill.SkillRepository;
import com.skillbridge.backend.student.AcademicYear;
import com.skillbridge.backend.student.AvailabilityStatus;
import com.skillbridge.backend.student.Department;
import com.skillbridge.backend.student.Student;
import com.skillbridge.backend.student.StudentRepository;
import com.skillbridge.backend.studentskill.StudentSkill;
import com.skillbridge.backend.studentskill.StudentSkillRepository;
import com.skillbridge.backend.teacher.Teacher;
import com.skillbridge.backend.teacher.TeacherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(StudentRepository studentRepository, TeacherRepository teacherRepository,
            SkillRepository skillRepository, StudentSkillRepository studentSkillRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // ─── 1. Hash any legacy plaintext passwords ───────────────────────────
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

        // ─── 2. Seed skill catalogue ──────────────────────────────────────────
        seedSkills();

        // ─── 3. Seed demo student profiles ───────────────────────────────────
        seedDemoStudents();

        // ─── 4. Seed demo teacher profiles ───────────────────────────────────
        seedDemoTeachers();
    }

    // ─── Skill Helpers ────────────────────────────────────────────────────────

    private Skill getOrCreateSkill(String name) {
        return skillRepository.findByName(name)
                .orElseGet(() -> skillRepository.save(new Skill(name)));
    }

    private void addSkill(Student student, String skillName, int proficiency) {
        Skill skill = getOrCreateSkill(skillName);
        boolean exists = studentSkillRepository.findByStudentId(student.getId()).stream()
                .anyMatch(ss -> ss.getSkill().getId().equals(skill.getId()));
        if (!exists) {
            studentSkillRepository.save(new StudentSkill(student, skill, proficiency));
        }
    }

    private void seedSkills() {
        String[] skills = {
                "Flutter", "Spring Boot", "React", "Vue.js", "Angular",
                "Java", "Python", "JavaScript", "TypeScript", "Node.js",
                "Git", "Docker", "PostgreSQL", "MySQL", "MongoDB",
                "HTML", "CSS", "Figma", "Adobe XD", "UI/UX Design",
                "Machine Learning", "Data Analysis", "TensorFlow", "Kotlin",
                "Swift", "C++", "C#", "PHP", "Laravel", "Django"
        };
        for (String s : skills) {
            getOrCreateSkill(s);
        }
        System.out.println("✅ Skill catalogue seeded.");
    }

    // ─── Demo Student Seeding ─────────────────────────────────────────────────

    private void seedDemoStudents() {
        String demoPassword = passwordEncoder.encode("demo123");

        Object[][] data = {
                // name, email, username, dept, year, status, github, linkedin
                { "Arun Goyal", "arun@skillbridge.dev", "arun", "BCA", "SECOND_YEAR", "AVAILABLE",
                        "https://github.com/arungoyal", "https://linkedin.com/in/arungoyal" },
                { "Priya Sharma", "priya@skillbridge.dev", "priya", "MCA", "FIRST_YEAR", "OPEN_TO_WORK",
                        "https://github.com/priyasharma", "https://linkedin.com/in/priyasharma" },
                { "Rahul Mehta", "rahul@skillbridge.dev", "rahul", "BCA", "THIRD_YEAR", "AVAILABLE",
                        "https://github.com/rahulmehta", "https://linkedin.com/in/rahulmehta" },
                { "Sneha Patel", "sneha@skillbridge.dev", "sneha", "BSC_CS", "SECOND_YEAR", "BUSY",
                        "https://github.com/snehapatel", "https://linkedin.com/in/snehapatel" },
                { "Arjun Nair", "arjun@skillbridge.dev", "arjun", "MCA", "SECOND_YEAR", "AVAILABLE",
                        "https://github.com/arjunnair", "https://linkedin.com/in/arjunnair" },
                { "Kavya Reddy", "kavya@skillbridge.dev", "kavya", "BCA", "FOURTH_YEAR", "OPEN_TO_WORK",
                        "https://github.com/kavyareddy", "https://linkedin.com/in/kavyareddy" },
                { "Rohan Verma", "rohan@skillbridge.dev", "rohan", "BSC_CS", "FIRST_YEAR", "AVAILABLE",
                        "https://github.com/rohanverma", "https://linkedin.com/in/rohanverma" },
                { "Anjali Singh", "anjali@skillbridge.dev", "anjali", "MCA", "THIRD_YEAR", "OPEN_TO_WORK",
                        "https://github.com/anjalisingh", "https://linkedin.com/in/anjalisingh" },
                { "Vikram Kumar", "vikram@skillbridge.dev", "vikram", "BCA", "SECOND_YEAR", "AVAILABLE",
                        "https://github.com/vikramkumar", "https://linkedin.com/in/vikramkumar" },
                { "Divya Menon", "divya@skillbridge.dev", "divya", "BSC_CS", "THIRD_YEAR", "BUSY",
                        "https://github.com/divyamenon", "https://linkedin.com/in/divyamenon" },
                { "Siddharth Joshi", "sid@skillbridge.dev", "sid", "MCA", "FOURTH_YEAR", "AVAILABLE",
                        "https://github.com/siddharthjoshi", "https://linkedin.com/in/siddharthjoshi" },
                { "Neha Gupta", "neha@skillbridge.dev", "neha", "BCA", "FIRST_YEAR", "OPEN_TO_WORK",
                        "https://github.com/nehagupta", "https://linkedin.com/in/nehagupta" },
                { "Karan Malhotra", "karan@skillbridge.dev", "karan", "BSC_CS", "SECOND_YEAR", "AVAILABLE",
                        "https://github.com/karanmalhotra", "https://linkedin.com/in/karanmalhotra" },
        };

        // Skills to assign per student [skillName, proficiency]
        Object[][][] studentSkills = {
                { { "React", 4 }, { "JavaScript", 4 }, { "CSS", 3 }, { "Figma", 3 } },
                { { "Python", 4 }, { "Machine Learning", 3 }, { "TensorFlow", 2 }, { "Data Analysis", 3 } },
                { { "Java", 5 }, { "Spring Boot", 4 }, { "PostgreSQL", 3 }, { "Git", 4 } },
                { { "Flutter", 4 }, { "Kotlin", 3 }, { "Firebase", 2 }, { "Git", 3 } },
                { { "Node.js", 4 }, { "JavaScript", 4 }, { "MongoDB", 3 }, { "Docker", 2 } },
                { { "UI/UX Design", 5 }, { "Figma", 5 }, { "Adobe XD", 4 }, { "HTML", 3 }, { "CSS", 4 } },
                { { "Python", 3 }, { "Django", 3 }, { "PostgreSQL", 2 }, { "Git", 3 } },
                { { "Angular", 4 }, { "TypeScript", 4 }, { "HTML", 4 }, { "CSS", 3 } },
                { { "Java", 4 }, { "Spring Boot", 3 }, { "MySQL", 3 }, { "Git", 4 } },
                { { "Vue.js", 4 }, { "JavaScript", 4 }, { "Node.js", 3 }, { "MongoDB", 3 } },
                { { "C++", 4 }, { "Python", 3 }, { "Machine Learning", 3 }, { "Git", 4 } },
                { { "HTML", 4 }, { "CSS", 4 }, { "JavaScript", 3 }, { "Figma", 2 } },
                { { "PHP", 3 }, { "Laravel", 3 }, { "MySQL", 4 }, { "Git", 3 } },
        };

        Department[] deptMap = {
                Department.BCA, Department.MCA, Department.BCA, Department.BSC,
                Department.MCA, Department.BCA, Department.BSC, Department.MCA,
                Department.BCA, Department.BSC, Department.MCA, Department.BCA, Department.BSC
        };

        AcademicYear[] yearMap = {
                AcademicYear.SECOND_YEAR, AcademicYear.FIRST_YEAR, AcademicYear.THIRD_YEAR, AcademicYear.SECOND_YEAR,
                AcademicYear.SECOND_YEAR, AcademicYear.FOURTH_YEAR, AcademicYear.FIRST_YEAR, AcademicYear.THIRD_YEAR,
                AcademicYear.SECOND_YEAR, AcademicYear.THIRD_YEAR, AcademicYear.FOURTH_YEAR, AcademicYear.FIRST_YEAR,
                AcademicYear.SECOND_YEAR
        };

        AvailabilityStatus[] statusMap = {
                AvailabilityStatus.AVAILABLE, AvailabilityStatus.OPEN_TO_WORK, AvailabilityStatus.AVAILABLE,
                AvailabilityStatus.BUSY, AvailabilityStatus.AVAILABLE, AvailabilityStatus.OPEN_TO_WORK,
                AvailabilityStatus.AVAILABLE, AvailabilityStatus.OPEN_TO_WORK, AvailabilityStatus.AVAILABLE,
                AvailabilityStatus.BUSY, AvailabilityStatus.AVAILABLE, AvailabilityStatus.OPEN_TO_WORK,
                AvailabilityStatus.AVAILABLE
        };

        int seeded = 0;
        for (int i = 0; i < data.length; i++) {
            String username = (String) data[i][2];
            boolean exists = studentRepository.findAll().stream()
                    .anyMatch(s -> s.getUsername() != null && s.getUsername().equals(username));
            if (exists)
                continue;

            Student s = new Student(
                    (String) data[i][0],
                    (String) data[i][1],
                    username,
                    demoPassword,
                    deptMap[i],
                    yearMap[i],
                    statusMap[i]);
            s.setGithubUrl((String) data[i][6]);
            s.setLinkedinUrl((String) data[i][7]);
            Student saved = studentRepository.save(s);

            for (Object[] skillEntry : studentSkills[i]) {
                addSkill(saved, (String) skillEntry[0], (Integer) skillEntry[1]);
            }
            seeded++;
        }
        System.out.println("✅ Seeded " + seeded + " new student demo profile(s). Password: demo123");
    }

    // ─── Demo Teacher Seeding ─────────────────────────────────────────────────

    private void seedDemoTeachers() {
        String demoPassword = passwordEncoder.encode("demo123");

        Object[][] data = {
                // name, email, username
                { "Prof. Anita Sharma", "anita@skillbridge.dev", "anita" },
                { "Dr. Ramesh Iyer", "ramesh@skillbridge.dev", "ramesh" },
                { "Prof. Sunita Verma", "sunita@skillbridge.dev", "sunita" },
                { "Dr. Karthik Menon", "karthik@skillbridge.dev", "karthik" },
                { "Prof. Deepa Nair", "deepa@skillbridge.dev", "deepa" },
                { "Dr. Suresh Patel", "suresh@skillbridge.dev", "suresh" },
                { "Prof. Lavanya Kumar", "lavanya@skillbridge.dev", "lavanya" },
                { "Dr. Vivek Joshi", "vivek@skillbridge.dev", "vivek" },
                { "Prof. Meera Reddy", "meera@skillbridge.dev", "meera" },
                { "Dr. Arun Krishnan", "akrishnan@skillbridge.dev", "akrishnan" },
                { "Prof. Pooja Malhotra", "pooja@skillbridge.dev", "pooja" },
        };

        int seeded = 0;
        for (Object[] row : data) {
            String username = (String) row[2];
            boolean exists = teacherRepository.findAll().stream()
                    .anyMatch(t -> t.getUsername() != null && t.getUsername().equals(username));
            if (exists)
                continue;

            Teacher t = new Teacher(
                    (String) row[0],
                    (String) row[1],
                    username,
                    demoPassword);
            teacherRepository.save(t);
            seeded++;
        }
        System.out.println("✅ Seeded " + seeded + " new teacher demo profile(s). Password: demo123");
    }
}
