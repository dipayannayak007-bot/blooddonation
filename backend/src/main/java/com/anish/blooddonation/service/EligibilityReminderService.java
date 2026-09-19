package com.anish.blooddonation.service;

import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EligibilityReminderService {

    @Autowired
    private DonorRepository donorRepository;

    // Run every day at midnight (for testing, run every minute if you want: "0 * * * * ?")
    @Scheduled(cron = "0 0 0 * * ?")
    public void sendEligibilityReminders() {
        System.out.println("Running daily eligibility check for donors...");
        List<Donor> allDonors = donorRepository.findAll();
        
        for (Donor donor : allDonors) {
            if (donor.getLastDonationDate() != null) {
                long daysSinceDonation = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDateTime.now());
                if (daysSinceDonation >= 56) { // standard cooldown is often 56 days
                    System.out.println("[Reminder Service] Donor " + donor.getName() + " (" + donor.getContactEmail() + ") is eligible to donate again! (Days since last donation: " + daysSinceDonation + ")");
                    // Here you would integrate with an email/SMS service.
                }
            }
        }
    }
}

