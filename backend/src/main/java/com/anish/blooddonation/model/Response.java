package com.anish.blooddonation.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long responseId; //[cite: 3]

    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false, unique = true)
    private SOSNotification notification; //[cite: 3]

    @Column(nullable = false)
    private String answer; // accept, decline[cite: 3]

    private LocalDateTime respondedAt = LocalDateTime.now(); //[cite: 3]
}
