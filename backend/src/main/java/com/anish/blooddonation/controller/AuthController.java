package com.anish.blooddonation.controller;


import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.model.Requester;
import com.anish.blooddonation.repository.DonorRepository;
import com.anish.blooddonation.repository.RequesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private RequesterRepository requesterRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password"); // Capture the password
        String role = credentials.get("role");

        Map<String, Object> response = new HashMap<>();

        if ("donor".equalsIgnoreCase(role)) {
            Optional<Donor> donor = donorRepository.findByContactEmail(email);
            // Verify both presence AND password match
            if (donor.isPresent() && donor.get().getPassword().equals(password)) {
                response.put("id", donor.get().getDonorId());
                response.put("role", "donor");
                response.put("name", donor.get().getName());
                return ResponseEntity.ok(response);
            }
        } else if ("hospital".equalsIgnoreCase(role)) {
            Optional<Requester> hospital = requesterRepository.findByContactEmail(email);
            if (hospital.isPresent() && hospital.get().getPassword().equals(password)) {
                if ("hospital_verified".equals(hospital.get().getAccountType())) {
                    response.put("id", hospital.get().getRequesterId());
                    response.put("role", "hospital");
                    response.put("name", hospital.get().getName());
                    return ResponseEntity.ok(response);
                }
            }
        }

        // Returns 401 if email is wrong, password is wrong, or role mismatches
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}