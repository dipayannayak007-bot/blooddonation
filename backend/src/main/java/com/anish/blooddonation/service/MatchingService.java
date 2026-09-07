package com.anish.blooddonation.service;


import com.anish.blooddonation.model.BloodRequest;
import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.model.MatchRecord;
import com.anish.blooddonation.model.SOSNotification;
import com.anish.blooddonation.repository.DonorRepository;
import com.anish.blooddonation.repository.MatchRecordRepository;
import com.anish.blooddonation.repository.SOSNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MatchingService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Spring's WebSocket messaging tool

    @Autowired
    private MatchRecordRepository matchRepository;
    @Autowired
    private SOSNotificationRepository notificationRepository;

    @Transactional
    public void processNewRequest(BloodRequest request) {
        List<Donor> matchedDonors = donorRepository.findEligibleDonorsNearby(
                request.getBloodTypeNeeded(), request.getLatitude(), request.getLongitude(), 10.0
        );

        for (Donor donor : matchedDonors) {
            // Step 3 Trace: Write Match row[cite: 3]
            MatchRecord match = new MatchRecord();
            match.setRequest(request);
            match.setDonor(donor);
            // Hardcoded distance for prototype speed; normally calculated from coordinates
            match.setDistanceKm(2.5);
            MatchRecord savedMatch = matchRepository.save(match);

            // Step 4 Trace: Write SOSNotification row[cite: 3]
            SOSNotification notification = new SOSNotification();
            notification.setMatchRecord(savedMatch);
            notification.setMessage("Urgent match nearby! Type: " + request.getBloodTypeNeeded());
            notificationRepository.save(notification);

            // Fire the real-time push notification
            messagingTemplate.convertAndSend(
                    "/topic/alerts/" + donor.getDonorId(),
                    buildSosPayload(request)
            );
        }
    }

    private String buildSosPayload(BloodRequest request) {
        return String.format(
                "{\"requestId\": %d, \"bloodType\": \"%s\", \"urgency\": \"%s\", \"message\": \"Urgent match nearby!\"}",
                request.getRequestId(), request.getBloodTypeNeeded(), request.getUrgencyLevel()
        );
    }


}