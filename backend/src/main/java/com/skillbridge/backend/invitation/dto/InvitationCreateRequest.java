package com.skillbridge.backend.invitation.dto;

public class InvitationCreateRequest {

    private Long projectId;
    private Long studentId;

    public Long getProjectId() {
        return projectId;
    }

    public Long getStudentId() {
        return studentId;
    }
}
