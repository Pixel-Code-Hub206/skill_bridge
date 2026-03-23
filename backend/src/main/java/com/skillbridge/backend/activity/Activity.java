package com.skillbridge.backend.activity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userRole; // "STUDENT" or "TEACHER"

    private String title;
    private String description;
    private String cssType; // e.g. "SUCCESS", "INFO", "WARNING"

    private LocalDateTime timestamp;

    public Activity() {
    }

    public Activity(Long userId, String userRole, String title, String description, String cssType) {
        this.userId = userId;
        this.userRole = userRole;
        this.title = title;
        this.description = description;
        this.cssType = cssType;
        this.timestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCssType() {
        return cssType;
    }

    public void setCssType(String cssType) {
        this.cssType = cssType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
