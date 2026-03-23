package com.skillbridge.backend.project.dto;

import java.time.LocalDate;
import java.util.List;

public class ProjectCreateRequest {

    private String title;
    private String description;
    private LocalDate deadline;
    private Long teacherId;
    private List<Long> requiredSkillIds;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public List<Long> getRequiredSkillIds() {
        return requiredSkillIds;
    }
}
