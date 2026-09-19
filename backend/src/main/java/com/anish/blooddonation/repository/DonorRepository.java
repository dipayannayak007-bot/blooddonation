package com.anish.blooddonation.repository;


import com.anish.blooddonation.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    long countByVerificationStatus(String status);

    Optional<Donor> findByContactEmail(String email);

    // Find verified donors with compatible blood types within a specific radius (in km)
    @Query(value = "SELECT * FROM donor d WHERE d.verification_status = 'verified' ",
            nativeQuery = true)
    List<Donor> findEligibleDonorsNearby(@Param("bloodType") String bloodType,
                                         @Param("reqLat") Double reqLat,
                                         @Param("reqLon") Double reqLon,
                                         @Param("radius") Double radius);
}