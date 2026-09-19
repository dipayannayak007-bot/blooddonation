package com.anish.blooddonation.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class DonationRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest request;

    @Column(nullable = false)
    private LocalDateTime donationDate = LocalDateTime.now();
}

