package com.skillbridge.backend.auth.dto;

public class LoginRequest {

    private String username;
    private String password;

    public LoginRequest() {}

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
