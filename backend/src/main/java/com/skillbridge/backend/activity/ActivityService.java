package com.skillbridge.backend.activity;

import org.springframework.stereotype.Service;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void logActivity(Long userId, String userRole, String title, String description, String cssType) {
        Activity activity = new Activity(userId, userRole, title, description, cssType);
        activityRepository.save(activity);
    }
}
