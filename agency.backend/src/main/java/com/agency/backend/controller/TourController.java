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

    @GetMapping
    public ResponseEntity<?> getAllTours() {
        try {
            List<Tour> tours = tourRepository.findAll();
            return ResponseEntity.ok(tours);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching tours: " + e.getMessage());
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
