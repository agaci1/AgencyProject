package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.BookingRepository;
import com.agency.backend.repository.TourRepository;
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

    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;

    @Autowired
    public TourController(TourRepository tourRepository, BookingRepository bookingRepository) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tour controller is working");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllTours() {
        try {
            System.out.println("Attempting to fetch tours...");
            long count = tourRepository.count();
            System.out.println("Tour count: " + count);
            List<Tour> tours = tourRepository.findAll();
            System.out.println("Successfully fetched " + tours.size() + " tours");
            return ResponseEntity.ok(tours);
        } catch (Exception e) {
            System.err.println("Error fetching tours: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching tours: " + e.getMessage() + " - " + e.getClass().getSimpleName());
        }
    }

    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody Tour tour) {
        Tour savedTour = tourRepository.save(tour);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTour);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        if (!tourRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        bookingRepository.deleteByTourId(id);  // 💥 delete child bookings first
        tourRepository.deleteById(id);         // ✅ then delete the tour

        return ResponseEntity.noContent().build();
    }
}
