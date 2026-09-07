package com.anish.blooddonation.repository;


import com.anish.blooddonation.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByContactEmail(String email);

    // Find verified donors with compatible blood types within a specific radius (in km)
    @Query(value = "SELECT * FROM donor d WHERE d.verification_status = 'verified' " +
            "AND d.blood_type = :bloodType " +
            "AND (d.last_donation_date IS NULL OR d.last_donation_date <= NOW() - INTERVAL '56 days') " +
            "AND (6371 * acos(cos(radians(:reqLat)) * cos(radians(d.latitude)) * " +
            "cos(radians(d.longitude) - radians(:reqLon)) + " +
            "sin(radians(:reqLat)) * sin(radians(d.latitude)))) <= :radius",
            nativeQuery = true)
    List<Donor> findEligibleDonorsNearby(@Param("bloodType") String bloodType,
                                         @Param("reqLat") Double reqLat,
                                         @Param("reqLon") Double reqLon,
                                         @Param("radius") Double radius);
}