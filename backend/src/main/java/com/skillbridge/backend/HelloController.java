package com.skillbridge.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/status")
    public UserResponse sayHello(){
        return new UserResponse("Pixel", "Online and Killin!", 911);
    }
}
