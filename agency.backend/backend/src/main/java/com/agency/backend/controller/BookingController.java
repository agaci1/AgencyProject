package com.agency.backend.controller;

import com.agency.backend.model.Booking;
import com.agency.backend.repository.BookingRepository;
import com.agency.backend.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);

        // Send booking confirmation email
        String to = savedBooking.getCustomerEmail();
        String subject = "Booking Confirmation - " + savedBooking.getTourName();
        String text = "Dear " + savedBooking.getCustomerName() + ",\n\n" +
                "Thank you for booking '" + savedBooking.getTourName() + "'. Your trip starts on " +
                savedBooking.getStartDate() + ".\n\n" +
                "Best regards,\nAlbanian Alps Adventures";

        emailService.sendSimpleMessage(to, subject, text);

        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
