package com.skillbridge.backend.student.dto;

public class StudentSkillDTO {

    private String skillName;
    private int proficiency;

    public StudentSkillDTO(String skillName, int proficiency) {
        this.skillName = skillName;
        this.proficiency = proficiency;
    }

    public String getSkillName() {
        return skillName;
    }

    public int getProficiency() {
        return proficiency;
    }
}
