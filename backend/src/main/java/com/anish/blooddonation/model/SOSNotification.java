package com.anish.blooddonation.model;



import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class SOSNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId; //[cite: 3]

    @OneToOne
    @JoinColumn(name = "match_id", nullable = false, unique = true)
    private MatchRecord matchRecord; //[cite: 3]

    @Column(nullable = false)
    private String channel = "push"; //[cite: 3]

    @Column(nullable = false)
    private String message; //[cite: 3]

    @Column(nullable = false)
    private String deliveryStatus = "sent"; // sent, delivered, failed[cite: 3]

    private LocalDateTime sentAt = LocalDateTime.now(); //[cite: 3]
}