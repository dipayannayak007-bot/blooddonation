package com.anish.blooddonation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Persists the relationship between a blood request and a matched donor.
 * This record also keeps compatibility, distance, and creation-time details.
 */
@Data
@Entity
public class MatchRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId; //

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest request; //[cite: 3]

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor; //[cite: 3]

    @Column(nullable = false)
    private String compatibilityResult = "compatible"; //[cite: 3]

    @Column(nullable = false)
    private Double distanceKm; //[cite: 3]

    private LocalDateTime createdAt = LocalDateTime.now(); //[cite: 3]
}
