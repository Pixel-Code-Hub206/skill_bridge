package com.skillbridge.backend.studentskill;

import com.skillbridge.backend.skill.Skill;
import com.skillbridge.backend.student.Student;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(
        name = "student_skills",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "skill_id"})
        }
)
public class StudentSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(nullable = false)
    private int proficiency;  //Ranging from 1 to 5

    public StudentSkill() {}

    public StudentSkill(Student student, Skill skill, int proficiency) {
        this.student = student;
        this.skill = skill;
        this.proficiency = proficiency;
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public Skill getSkill() {
        return skill;
    }

    public int getProficiency() {
        return proficiency;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public void setProficiency(int proficiency) {
        this.proficiency = proficiency;
    }
}
