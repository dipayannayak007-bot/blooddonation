package com.anish.blooddonation.repository;



import com.anish.blooddonation.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(String status);
    
    long countByRequester_RequesterId(Long requesterId);
    
    long countByRequester_RequesterIdAndStatus(Long requesterId, String status);
    
    long countByStatus(String status);
    
    List<BloodRequest> findByRequester_RequesterIdOrderByCreatedAtDesc(Long requesterId);
}