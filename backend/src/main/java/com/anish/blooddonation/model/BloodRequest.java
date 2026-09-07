package com.anish.blooddonation.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId; //

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Requester requester; //[cite: 3]

    @Column(nullable = false)
    private String bloodTypeNeeded; //[cite: 3]

    @Column(nullable = false)
    private Integer unitsNeeded; //[cite: 3]

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private String urgencyLevel; // urgent, standard[cite: 3]

    @Column(nullable = false)
    private String status = "open"; // open, matched, fulfilled, expired[cite: 3]

    private LocalDateTime createdAt = LocalDateTime.now(); //[cite: 3]
}