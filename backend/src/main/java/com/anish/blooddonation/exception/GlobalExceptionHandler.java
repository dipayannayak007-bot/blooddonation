package com.anish.blooddonation.exception;



import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseConstraints(DataIntegrityViolationException ex) {
        Map<String, String> errorResponse = new HashMap<>();

        // Check if the error is specifically a unique constraint violation
        if (ex.getMessage() != null && ex.getMessage().contains("duplicate key value")) {
            errorResponse.put("error", "Conflict");
            errorResponse.put("message", "An account with this email already exists.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT); // Returns 409[cite: 3]
        }

        // Fallback for other database errors
        errorResponse.put("error", "Bad Request");
        errorResponse.put("message", "Database constraint violated.");
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}