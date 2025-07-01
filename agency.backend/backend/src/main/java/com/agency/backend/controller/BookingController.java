package com.agency.backend.controller;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.model.Tour;
import com.agency.backend.repository.BookingRepository;
import com.agency.backend.repository.TourRepository;
import com.agency.backend.service.EmailService;
import com.agency.backend.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final EmailService emailService;
    private final PaymentService paymentService;

    @Value("${app.agency.email}")
    private String agencyEmail;

    @Autowired
    public BookingController(BookingRepository bookingRepository,
                             TourRepository tourRepository,
                             EmailService emailService,
                             PaymentService paymentService) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.emailService = emailService;
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {
        // 1) find the Tour
        Optional<Tour> tourOpt = tourRepository.findById(req.getTourId());
        if (tourOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid tourId: " + req.getTourId());
        }

        // 2) map DTO → entity
        Booking booking = new Booking();
        booking.setTour(tourOpt.get());
        booking.setUserName(req.getName());
        booking.setUserEmail(req.getEmail());
        try {
            booking.setDepartureDate(LocalDate.parse(req.getDepartureDate()));
            if (req.getReturnDate() != null) {
                booking.setReturnDate(LocalDate.parse(req.getReturnDate()));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid date format.");
        }

        booking.setGuests(req.getGuests());
        booking.setPaymentMethod(req.getPaymentMethod());

        // 3) process payment (dummy)
        try {
            boolean paid = paymentService.processPayment(req, booking);
            booking.setStatus(paid ? "PAID" : "FAILED");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payment failed: " + ex.getMessage());
        }

        // 4) save booking
        Booking saved = bookingRepository.save(booking);

        // 5) compute receipt amounts
        double pricePerPerson = saved.getTour().getPrice();
        int guests = saved.getGuests();
        double subtotal = pricePerPerson * guests;
        double taxes = subtotal * 0.10;
        double total = subtotal + taxes;

        // 6a) email customer
        String customerSubject = "Your Booking Receipt — " + saved.getTourName();
        String customerText = String.format(
                "Dear %s,%n%n" +
                        "Thank you for booking \"%s\"!%n" +
                        "Booking ID: %d%n%n" +
                        "Trip Details:%n" +
                        "  • Departure Date: %s%n" +
                        "  • Return Date:    %s%n" +
                        "  • Guests:         %d%n%n" +
                        "Payment Breakdown:%n" +
                        "  • Price/person:   $%.2f%n" +
                        "  • Subtotal:        $%.2f%n" +
                        "  • Taxes (10%%):     $%.2f%n" +
                        "  • Total Charged:   $%.2f%n%n" +
                        "We hope you enjoy your trip!%n%n" +
                        "Safe travels,%n" +
                        "Albanian Alps Adventures",
                saved.getUserName(),
                saved.getTourName(),
                saved.getId(),
                saved.getDepartureDate(),
                saved.getReturnDate() == null ? "—" : saved.getReturnDate(),
                guests,
                pricePerPerson,
                subtotal,
                taxes,
                total
        );
        emailService.sendSimpleMessage(saved.getUserEmail(), customerSubject, customerText);

        // 6b) email agency
        String ownerSubject = "New Booking Received — ID " + saved.getId();
        String ownerText = String.format(
                "New booking received:%n%n" +
                        "  • Customer: %s <%s>%n" +
                        "  • Tour:     %s%n" +
                        "  • Departure: %s%n" +
                        "  • Return:    %s%n" +
                        "  • Guests:   %d%n" +
                        "Booking ID:  %d%n%n" +
                        "Payment:%n" +
                        "  • Subtotal: $%.2f%n" +
                        "  • Taxes:    $%.2f%n" +
                        "  • Total:    $%.2f%n",
                saved.getUserName(),
                saved.getUserEmail(),
                saved.getTourName(),
                saved.getDepartureDate(),
                saved.getReturnDate() == null ? "—" : saved.getReturnDate(),
                guests,
                saved.getId(),
                subtotal,
                taxes,
                total
        );
        emailService.sendSimpleMessage(agencyEmail, ownerSubject, ownerText);

        // 7) return booking
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> list = bookingRepository.findAll();
        return ResponseEntity.ok(list);
    }
}
