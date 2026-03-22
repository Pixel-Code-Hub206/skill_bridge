package com.skillbridge.backend.invitation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {

    List<ProjectInvitation> findByStudentId(Long studentId);

    List<ProjectInvitation> findByProjectTeacherId(Long teacherId);

    List<ProjectInvitation> findByProjectIdAndStatus(Long projectId, InvitationStatus status);

    @jakarta.transaction.Transactional
    void deleteByProjectId(Long projectId);
}
