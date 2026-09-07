package com.anish.blooddonation.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donorId; //

    @Column(nullable = false)
    private String name; //

    @Column(nullable = false)
    private String bloodType; //

    private String contactPhone; //

    @Column(unique = true)
    private String contactEmail; //[cite: 3]

    @Column(nullable = false)
    private String password = "password123";

    // Storing coordinates for the 10km radius calculation[cite: 3]
    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private String verificationStatus = "pending"; // pending, verified, rejected[cite: 3]

    private LocalDateTime lastDonationDate; //[cite: 3]
}