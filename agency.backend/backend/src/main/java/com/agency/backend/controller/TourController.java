package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
@CrossOrigin(origins = "*")
public class TourController {

    private final TourRepository tourRepository;

    @Autowired
    public TourController(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        List<Tour> tours = tourRepository.findAll();
        return ResponseEntity.ok(tours);
    }

    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody Tour tour) {
        Tour savedTour = tourRepository.save(tour);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        if (!tourRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tourRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
