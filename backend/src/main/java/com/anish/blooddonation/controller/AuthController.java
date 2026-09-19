package com.anish.blooddonation.controller;


import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.model.Requester;
import com.anish.blooddonation.repository.DonorRepository;
import com.anish.blooddonation.repository.RequesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
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

    // Client ID from Google Cloud Console
    private static final String CLIENT_ID = "214393700151-5duu1v90sc6i81jqqs5qrnd48af0glmm.apps.googleusercontent.com";

    @PostMapping("/google-login")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> payload) {
        String idTokenString = payload.get("token");
        String role = payload.get("role");

        String email = null;
        String name = null;

        // Mock verification for testing without a real Client ID
        if ("mock-google-token".equals(idTokenString)) {
            email = payload.get("email"); // Fallback to provided email for mock
            name = payload.get("name");
        } else {
            try {
                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                        .setAudience(Collections.singletonList(CLIENT_ID))
                        .build();

                GoogleIdToken idToken = verifier.verify(idTokenString);
                if (idToken != null) {
                    GoogleIdToken.Payload googlePayload = idToken.getPayload();
                    email = googlePayload.getEmail();
                    name = (String) googlePayload.get("name");
                } else {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }

        if (email == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Map<String, Object> response = new HashMap<>();

        if ("donor".equalsIgnoreCase(role)) {
            Optional<Donor> donor = donorRepository.findByContactEmail(email);
            if (donor.isPresent()) {
                response.put("id", donor.get().getDonorId());
                response.put("role", "donor");
                response.put("name", donor.get().getName());
                return ResponseEntity.ok(response);
            } else {
                // User needs to complete profile
                response.put("status", "incomplete_profile");
                response.put("email", email);
                response.put("name", name);
                response.put("role", "donor");
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
            }
        } else if ("hospital".equalsIgnoreCase(role)) {
            Optional<Requester> hospital = requesterRepository.findByContactEmail(email);
            if (hospital.isPresent()) {
                response.put("id", hospital.get().getRequesterId());
                response.put("role", "hospital");
                response.put("name", hospital.get().getName());
                return ResponseEntity.ok(response);
            } else {
                // User needs to complete profile
                response.put("status", "incomplete_profile");
                response.put("email", email);
                response.put("name", name);
                response.put("role", "hospital");
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
            }
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role");

        Map<String, Object> response = new HashMap<>();

        // Admin login logic remains traditional email/password
        if ("admin".equalsIgnoreCase(role)) {
            if ("admin@admin.com".equals(email) && "admin123".equals(password)) {
                response.put("id", 0);
                response.put("role", "admin");
                response.put("name", "Platform Admin");
                return ResponseEntity.ok(response);
            }
        }
        
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}