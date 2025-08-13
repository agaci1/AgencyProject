package com.agency.backend.config;

import com.agency.backend.model.Tour;
import com.agency.backend.repository.TourRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private TourRepository tourRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Checking if tours need to be initialized...");
        
        // Check if tours already exist
        List<Tour> existingTours = tourRepository.findAll();
        if (!existingTours.isEmpty()) {
            logger.info("Tours already exist in database. Skipping initialization.");
            return;
        }

        logger.info("No tours found. Initializing default tours...");

        // Create the 4 main tours + 1 test tour
        createTour("Tirana [Terminal] → Koman", 
                  "Bus trip from Tirana through the Albanian Alps to Koman ferry dock", 
                  10.0, "06:00", "Tirana", 5.0, "/koman .jpg", 50,
                  "Departure from Tirana North-South Terminal at 06:00, arriving at Koman ferry dock",
                  "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6",
                  new String[]{"Albanian Alps", "Scenic mountain roads", "Koman ferry dock", "Early morning departure"});

        createTour("Koman → Tirana", 
                  "Afternoon return journey from Koman to Tirana", 
                  10.0, "15:30", "Koman", 5.0, "/Tirana.webp", 50,
                  "Departure from Koman ferry dock at 15:30, arriving at Tirana North-South Terminal",
                  "https://maps.app.goo.gl/HBLEbRbWruJBKf4KA",
                  new String[]{"Return journey", "Afternoon departure", "Tirana terminal", "Comfortable bus ride"});

        createTour("Fierza → Valbonë", 
                  "Ride through mountainous roads from Fierza to Valbonë", 
                  7.0, "12:30", "Fierza", 5.0, "/valbona.jpg", 50,
                  "Departure at 12:30 from Fierza ferry area to Valbonë village",
                  "https://maps.app.goo.gl/LyzZLKrrHtUZdesM6",
                  new String[]{"Mountainous terrain", "Valbonë village", "Scenic mountain roads", "Fierza ferry connection"});

        createTour("Valbonë → Fierza (Ferry)", 
                  "A scenic transfer from Valbonë to Fierza, where you can catch the ferry", 
                  7.0, "10:00", "Valbonë", 5.0, "/fierza.jpg", 50,
                  "Departure from Valbonë at 10:00 heading towards Fierza ferry dock",
                  "https://maps.app.goo.gl/ieNwY6kLX8Ea6gKz8",
                  new String[]{"Valbonë departure", "Ferry connection", "Scenic transfer", "Fierza ferry dock"});

        // Test tour for payment testing
        createTour("🧪 Test Tour - €0.01", 
                  "This is a test tour for payment system testing. Very low cost for testing purposes.", 
                  0.01, "14:00", "Test Location", 5.0, "/Tirana.webp", 10,
                  "Test departure for payment system validation",
                  "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6",
                  new String[]{"Test Tour", "Low Cost", "Payment Testing"});

        logger.info("Successfully initialized {} tours", tourRepository.count());
    }

    private void createTour(String title, String description, double price, String departureTime, 
                           String location, double rating, String image, int maxGuests, 
                           String routeDescription, String startLocationLink, String[] highlights) {
        try {
            Tour tour = new Tour();
            tour.setTitle(title);
            tour.setDescription(description);
            tour.setPrice(price);
            tour.setDepartureTime(departureTime);
            tour.setLocation(location);
            tour.setRating(rating);
            tour.setImage(image);
            tour.setMaxGuests(maxGuests);
            tour.setRouteDescription(routeDescription);
            tour.setStartLocationLink(startLocationLink);
            
            // Set highlights
            for (String highlight : highlights) {
                tour.addHighlight(highlight);
            }
            
            tourRepository.save(tour);
            logger.info("Created tour: {}", title);
        } catch (Exception e) {
            logger.error("Failed to create tour: {}", title, e);
        }
    }
}
