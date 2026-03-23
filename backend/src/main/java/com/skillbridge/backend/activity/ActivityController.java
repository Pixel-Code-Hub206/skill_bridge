package com.skillbridge.backend.activity;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityRepository activityRepository;

    public ActivityController(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @GetMapping("/{role}/{userId}")
    public List<Activity> getRecentActivities(@PathVariable String role, @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return activityRepository.findByUserIdAndUserRoleOrderByTimestampDesc(userId, role.toUpperCase(), pageable);
    }
}
