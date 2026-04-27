package com.achievepro.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String role; // "admin", "teacher", "student"
    
    // Student specific fields
    private String course;
    private String year;
    private String teacherId;
    
    // Teacher specific fields
    private String department;
}
