package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.BookingRepository;
import com.agency.backend.repository.TourRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/tours")
@CrossOrigin(origins = "*")
public class TourController {

    private static final Logger logger = LoggerFactory.getLogger(TourController.class);
    
    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public TourController(TourRepository tourRepository, BookingRepository bookingRepository) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        logger.info("Tour test endpoint called");
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tour controller is working");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllTours() {
        try {
            logger.info("Fetching all tours from database");
            List<Tour> tours = tourRepository.findAll();
            logger.info("Successfully fetched {} tours", tours.size());
            return ResponseEntity.ok(tours);
        } catch (Exception e) {
            logger.error("Error fetching tours: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to fetch tours", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createTour(@RequestBody Tour tour) {
        try {
            logger.info("Creating new tour: {}", tour.getTitle());
            Tour savedTour = tourRepository.save(tour);
            logger.info("Successfully created tour with ID: {}", savedTour.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTour);
        } catch (Exception e) {
            logger.error("Error creating tour: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to create tour", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteTour(@PathVariable Long id) {
        try {
            logger.info("Attempting to delete tour with ID: {}", id);
            if (!tourRepository.existsById(id)) {
                logger.warn("Tour with ID {} not found", id);
                return ResponseEntity.notFound().build();
            }

            bookingRepository.deleteByTourId(id);
            tourRepository.deleteById(id);
            logger.info("Successfully deleted tour with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting tour with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to delete tour", e.getMessage()));
        }
    }

    // Error response class
    public static class ErrorResponse {
        private String message;
        private String details;

        public ErrorResponse(String message, String details) {
            this.message = message;
            this.details = details;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }
}
