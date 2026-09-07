package com.anish.blooddonation.repository;

import com.anish.blooddonation.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {}