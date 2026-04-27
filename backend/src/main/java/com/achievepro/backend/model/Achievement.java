package com.achievepro.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String title;
    private String category;
    private String type;
    
    private String status;
    private String date;
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 1000)
    private String feedback;
    
    private String studentId;
    private String studentName;
}
