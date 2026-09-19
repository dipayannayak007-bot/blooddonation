package com.anish.blooddonation.repository;

import com.anish.blooddonation.model.DonationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRecordRepository extends JpaRepository<DonationRecord, Long> {
    List<DonationRecord> findByDonor_DonorIdOrderByDonationDateDesc(Long donorId);
}

