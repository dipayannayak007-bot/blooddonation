package com.anish.blooddonation.config;


import com.anish.blooddonation.model.Donor;
import com.anish.blooddonation.repository.DonorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(DonorRepository donorRepository) {
        return args -> {
            // Only seed if the database is empty to avoid duplicates on restart
            if (donorRepository.count() == 0) {

                // 1. The Perfect Match (O-, within 10km radius)
                Donor closeMatch = new Donor();
                closeMatch.setName("Priya Sharma");
                closeMatch.setContactEmail("priya@example.com");
                closeMatch.setPassword("password123");
                closeMatch.setBloodType("O-");
                closeMatch.setLatitude(12.9720); // Very close to hospital (12.9716)
                closeMatch.setLongitude(77.5950);
                closeMatch.setVerificationStatus("verified");
                donorRepository.save(closeMatch);

                // 2. The Distance Failure (O-, but 300km away in Chennai)
                Donor farDonor = new Donor();
                farDonor.setName("Rahul Verma");
                farDonor.setContactEmail("rahul@example.com");
                farDonor.setPassword("password123");
                farDonor.setBloodType("O-");
                farDonor.setLatitude(13.0827);
                farDonor.setLongitude(80.2707);
                farDonor.setVerificationStatus("verified");
                donorRepository.save(farDonor);

                // 3. The Blood Type Failure (Within 10km, but wrong blood type)
                Donor wrongType = new Donor();
                wrongType.setName("Vikram Singh");
                wrongType.setContactEmail("vikram@example.com");
                wrongType.setPassword("password123");
                wrongType.setBloodType("AB+");
                wrongType.setLatitude(12.9725);
                wrongType.setLongitude(77.5940);
                wrongType.setVerificationStatus("verified");
                donorRepository.save(wrongType);

                System.out.println("✅ Mock Data Seeded: Ready for Live Demo.");
            }
        };
    }
}