package com.anish.blooddonation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BloodDonationApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodDonationApplication.class, args);
    }
}