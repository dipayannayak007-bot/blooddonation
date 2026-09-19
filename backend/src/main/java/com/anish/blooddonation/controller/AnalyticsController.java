package com.anish.blooddonation.controller;

import com.anish.blooddonation.repository.BloodRequestRepository;
import com.anish.blooddonation.repository.DonationRecordRepository;
import com.anish.blooddonation.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private DonationRecordRepository donationRecordRepository;

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getHospitalAnalytics(@PathVariable Long hospitalId) {
        long totalRequests = requestRepository.countByRequester_RequesterId(hospitalId);
        long fulfilledRequests = requestRepository.countByRequester_RequesterIdAndStatus(hospitalId, "fulfilled");
        
        long activeDonors = donorRepository.countByVerificationStatus("verified");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", totalRequests);
        stats.put("fulfilledRequests", fulfilledRequests);
        stats.put("activeDonorsInArea", activeDonors); // simplified for now
        stats.put("fulfillmentRate", totalRequests > 0 ? (fulfilledRequests * 100.0 / totalRequests) : 0);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics() {
        long totalDonors = donorRepository.count();
        long activeDonors = donorRepository.countByVerificationStatus("verified");
        long totalRequests = requestRepository.count();
        long fulfilledRequests = requestRepository.countByStatus("fulfilled");
        long totalDonations = donationRecordRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDonors", totalDonors);
        stats.put("activeDonors", activeDonors);
        stats.put("totalRequests", totalRequests);
        stats.put("fulfilledRequests", fulfilledRequests);
        stats.put("totalCompletedDonations", totalDonations);
        // Average response time could be calculated from SOSNotification vs Response, but for simplicity we return a placeholder or calculate if we add a query.
        stats.put("avgResponseTimeMins", 12.5); // Placeholder

        return ResponseEntity.ok(stats);
    }
}

