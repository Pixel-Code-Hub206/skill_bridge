package com.skillbridge.backend;

public class UserResponse {

    private String username;
    private String status;
    private int password;

    public UserResponse(String username, String status, int password){
        this.username = username;
        this.status = status;
        this.password = password;
    }

    public String getUsername(){return username; }
    public String getStatus(){return status; }
    public int getPassword(){return password; }
}
