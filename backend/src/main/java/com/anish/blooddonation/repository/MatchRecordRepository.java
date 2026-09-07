package com.anish.blooddonation.repository;

import com.anish.blooddonation.model.MatchRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRecordRepository extends JpaRepository<MatchRecord, Long> {}