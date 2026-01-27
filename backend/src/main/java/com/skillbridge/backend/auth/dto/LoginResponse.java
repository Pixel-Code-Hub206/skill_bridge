package com.skillbridge.backend.auth.dto;

public class LoginResponse {

    private Long id;
    private String role;
    private String name;

    public LoginResponse(Long id, String role, String name) {
        this.id = id;
        this.role = role;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }
}
