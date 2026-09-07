package com.anish.blooddonation.controller;

import com.anish.blooddonation.model.BloodRequest;
import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.model.Requester;
import com.anish.blooddonation.repository.BloodRequestRepository;
import com.anish.blooddonation.repository.DonorRepository;
import com.anish.blooddonation.repository.RequesterRepository;
import com.anish.blooddonation.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows your frontend to talk to the backend
public class DonationController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RequesterRepository requesterRepository;

    // BD-01a: Register Donor[cite: 3]
    @PostMapping("/donors")
    public ResponseEntity<Donor> registerDonor(@RequestBody Donor donor) {
        // Fallback in case the frontend sends an empty password
        if (donor.getPassword() == null || donor.getPassword().isEmpty()) {
            donor.setPassword("password123");
        }

        try {
            // Saves the donor along with their newly mapped password
            Donor newDonor = donorRepository.save(donor);
            return ResponseEntity.ok(newDonor);
        } catch (Exception e) {
            // Returns 409 Conflict if the email already exists in the database
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    // BD-01b: Get pending donors for admin verification[cite: 3]
    @GetMapping("/donors")
    public ResponseEntity<List<Donor>> getPendingDonors(@RequestParam String verification_status) {
        // Simple filter for the prototype
        List<Donor> allDonors = donorRepository.findAll();
        List<Donor> pending = allDonors.stream()
                .filter(d -> d.getVerificationStatus().equals(verification_status))
                .toList();
        return ResponseEntity.ok(pending);
    }

    // BD-02: Submit Blood Request[cite: 3]
    @PostMapping("/requests")
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequest request) {
        BloodRequest savedRequest = requestRepository.save(request);

        // Trigger the asynchronous matching and notification engine
        matchingService.processNewRequest(savedRequest);

        return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
    }

    @PostMapping("/requests/{requestId}/responses")
    public ResponseEntity<BloodRequest> respondToRequest(
            @PathVariable Long requestId,
            @RequestBody java.util.Map<String, String> payload) {

        String answer = payload.get("answer"); // "accept" or "decline"
        String donorIdString = payload.get("donorId");

        Optional<BloodRequest> optionalRequest = requestRepository.findById(requestId);
        if (optionalRequest.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 not found
        }

        BloodRequest request = optionalRequest.get();

        if ("accept".equalsIgnoreCase(answer)) {
            // Update the request status
            request.setStatus("matched");
            requestRepository.save(request);

            // 1. Look up the real donor in the database to get their name
            String realDonorName = "A Donor";
            if (donorIdString != null) {
                try {
                    Long donorId = Long.parseLong(donorIdString);
                    Optional<Donor> donor = donorRepository.findById(donorId);
                    if (donor.isPresent()) {
                        realDonorName = donor.get().getName();
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid donor ID format");
                }
            }

            // 2. Fire real-time update to the hospital's dashboard including the real name
            messagingTemplate.convertAndSend(
                    "/topic/requests/" + request.getRequester().getRequesterId(),
                    "{\"requestId\": " + requestId + ", \"status\": \"matched\", \"donorName\": \"" + realDonorName + "\"}"
            );
        }

        return ResponseEntity.ok(request);
    }

    @PostMapping("/requesters")
    public ResponseEntity<Requester> registerRequester(@RequestBody Requester requester) {
        // Fallback password
        if (requester.getPassword() == null || requester.getPassword().isEmpty()) {
            requester.setPassword("password123");
        }

        // Ensure the account type matches exactly what AuthController expects for login
        requester.setAccountType("hospital_verified");

        try {
            Requester newRequester = requesterRepository.save(requester);
            return ResponseEntity.ok(newRequester);
        } catch (Exception e) {
            // Returns 409 Conflict if email is already taken
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }
}