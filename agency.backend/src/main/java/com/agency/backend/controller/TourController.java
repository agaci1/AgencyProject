package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@RestController
@RequestMapping("/tours")
@CrossOrigin(origins = "*")
public class TourController {

    private final TourRepository tourRepository;

    @Autowired
    public TourController(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tour controller is working");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hardcoded")
    public ResponseEntity<List<Map<String, Object>>> getHardcodedTours() {
        Map<String, Object> tour1 = new HashMap<>();
        tour1.put("id", 1);
        tour1.put("title", "Tirana [Terminal] → Koman");
        tour1.put("description", "Bus trip from Tirana through the Albanian Alps to Koman ferry dock");
        tour1.put("price", 10.0);
        tour1.put("departureTime", "06:00");
        tour1.put("location", "Tirana");
        tour1.put("rating", 5.0);
        tour1.put("image", "/koman .jpg");
        tour1.put("maxGuests", 50);
        tour1.put("routeDescription", "Departure from Tirana North-South Terminal at 06:00, arriving at Koman ferry dock");
        tour1.put("startLocationLink", "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6");
        tour1.put("highlights", Arrays.asList("Albanian Alps", "Scenic mountain roads", "Koman ferry dock", "Early morning departure"));

        Map<String, Object> tour2 = new HashMap<>();
        tour2.put("id", 2);
        tour2.put("title", "Koman → Tirana");
        tour2.put("description", "Afternoon return journey from Koman to Tirana");
        tour2.put("price", 10.0);
        tour2.put("departureTime", "15:30");
        tour2.put("location", "Koman");
        tour2.put("rating", 5.0);
        tour2.put("image", "/Tirana.webp");
        tour2.put("maxGuests", 50);
        tour2.put("routeDescription", "Departure from Koman ferry dock at 15:30, arriving at Tirana North-South Terminal");
        tour2.put("startLocationLink", "https://maps.app.goo.gl/HBLEbRbWruJBKf4KA");
        tour2.put("highlights", Arrays.asList("Return journey", "Afternoon departure", "Tirana terminal", "Comfortable bus ride"));

        List<Map<String, Object>> tours = Arrays.asList(tour1, tour2);
        return ResponseEntity.ok(tours);
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
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        if (!tourRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        tourRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
