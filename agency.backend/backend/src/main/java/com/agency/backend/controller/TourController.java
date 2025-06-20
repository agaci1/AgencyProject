package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
@CrossOrigin(origins = "*")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    @GetMapping
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        return tourRepository.save(tour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        if (tourRepository.existsById(id)) {
            tourRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }


}

