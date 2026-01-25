package com.skillbridge.backend.studentskill;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentId(Long studentId);

    List<StudentSkill> findBySkillId(Long skillId);
}
