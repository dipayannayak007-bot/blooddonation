package com.anish.blooddonation.model;



import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Requester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requesterId; //

    @Column(nullable = false)
    private String name; //[cite: 3]

    private String contactPhone; //[cite: 3]

    @Column(unique = true)
    private String contactEmail; //[cite: 3]

    @Column(nullable = false)
    private String password = "password123";

    @Column(nullable = false)
    private String accountType; // individual, hospital_verified[cite: 3]
}