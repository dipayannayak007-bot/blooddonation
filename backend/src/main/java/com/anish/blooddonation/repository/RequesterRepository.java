package com.anish.blooddonation.repository;


import com.anish.blooddonation.model.Requester;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RequesterRepository extends JpaRepository<Requester, Long> {
    Optional<Requester> findByContactEmail(String email);
}