package com.skillbridge.backend.auth.dto;

public class LoginResponse {

    private Long id;
    private String role;
    private String name;
    private String token;

    public LoginResponse(Long id, String role, String name, String token) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.token = token;
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

    public String getToken() {
        return token;
    }
}
