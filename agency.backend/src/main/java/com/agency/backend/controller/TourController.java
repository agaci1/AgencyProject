package com.agency.backend.controller;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/tours")
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

    @GetMapping("/simple")
    public ResponseEntity<String> simpleEndpoint() {
        return ResponseEntity.ok("Simple tours endpoint working");
    }

    @GetMapping
    public ResponseEntity<?> getAllTours() {
        try {
            System.out.println("Attempting to fetch tours from database...");
            long count = tourRepository.count();
            System.out.println("Tour count in database: " + count);
            
            if (count == 0) {
                System.out.println("No tours found in database, returning hardcoded tours as fallback");
                return ResponseEntity.ok(getHardcodedTours());
            }
            
            List<Tour> tours = tourRepository.findAll();
            System.out.println("Successfully fetched " + tours.size() + " tours from database");
            return ResponseEntity.ok(tours);
        } catch (Exception e) {
            System.err.println("Error fetching tours from database: " + e.getMessage());
            e.printStackTrace();
            System.out.println("Falling back to hardcoded tours due to database error");
            return ResponseEntity.ok(getHardcodedTours());
        }
    }

    private List<Map<String, Object>> getHardcodedTours() {
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

        Map<String, Object> tour3 = new HashMap<>();
        tour3.put("id", 3);
        tour3.put("title", "Fierza → Valbonë");
        tour3.put("description", "Ride through mountainous roads from Fierza to Valbonë");
        tour3.put("price", 7.0);
        tour3.put("departureTime", "12:30");
        tour3.put("location", "Fierza");
        tour3.put("rating", 5.0);
        tour3.put("image", "/valbona.jpg");
        tour3.put("maxGuests", 50);
        tour3.put("routeDescription", "Departure at 12:30 from Fierza ferry area to Valbonë village");
        tour3.put("startLocationLink", "https://maps.app.goo.gl/LyzZLKrrHtUZdesM6");
        tour3.put("highlights", Arrays.asList("Mountainous terrain", "Valbonë village", "Scenic mountain roads", "Fierza ferry connection"));

        Map<String, Object> tour4 = new HashMap<>();
        tour4.put("id", 4);
        tour4.put("title", "Valbonë → Fierza (Ferry)");
        tour4.put("description", "A scenic transfer from Valbonë to Fierza, where you can catch the ferry");
        tour4.put("price", 7.0);
        tour4.put("departureTime", "10:00");
        tour4.put("location", "Valbonë");
        tour4.put("rating", 5.0);
        tour4.put("image", "/fierza.jpg");
        tour4.put("maxGuests", 50);
        tour4.put("routeDescription", "Departure from Valbonë at 10:00 heading towards Fierza ferry dock");
        tour4.put("startLocationLink", "https://maps.app.goo.gl/ieNwY6kLX8Ea6gKz8");
        tour4.put("highlights", Arrays.asList("Valbonë departure", "Ferry connection", "Scenic transfer", "Fierza ferry dock"));

        Map<String, Object> tour5 = new HashMap<>();
        tour5.put("id", 5);
        tour5.put("title", "🧪 Test Tour - €0.01");
        tour5.put("description", "This is a test tour for payment system testing. Very low cost for testing purposes.");
        tour5.put("price", 0.01);
        tour5.put("departureTime", "14:00");
        tour5.put("location", "Test Location");
        tour5.put("rating", 5.0);
        tour5.put("image", "/Tirana.webp");
        tour5.put("maxGuests", 10);
        tour5.put("routeDescription", "Test departure for payment system validation");
        tour5.put("startLocationLink", "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6");
        tour5.put("highlights", Arrays.asList("Test Tour", "Low Cost", "Payment Testing"));

        return Arrays.asList(tour1, tour2, tour3, tour4, tour5);
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
