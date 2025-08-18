package com.agency.backend.controller;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.model.Tour;
import com.agency.backend.repository.BookingRepository;
import com.agency.backend.repository.TourRepository;
import com.agency.backend.service.EmailService;
import com.agency.backend.service.PaymentService;
import com.agency.backend.service.PaymentServiceFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@CrossOrigin(origins = {"https://rilindishpk.com", "https://www.rilindishpk.com", "http://localhost:3000"})
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final EmailService emailService;
    private final PaymentServiceFactory paymentServiceFactory;

    @Value("${app.agency.email}")
    private String agencyEmail;

    @Autowired
    public BookingController(BookingRepository bookingRepository,
                            TourRepository tourRepository,
                            EmailService emailService,
                            PaymentServiceFactory paymentServiceFactory) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.emailService = emailService;
        this.paymentServiceFactory = paymentServiceFactory;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {
        logger.info("Received booking request for tour ID: {}, guests: {}, payment method: {}", 
                   req.getTourId(), req.getGuests(), req.getPaymentMethod());
        
        // 1) find the Tour
        Optional<Tour> tourOpt = tourRepository.findById(req.getTourId());
        if (tourOpt.isEmpty()) {
            logger.error("Invalid tour ID requested: {}", req.getTourId());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid tourId: " + req.getTourId());
        }

        // 2) map DTO → entity
        Booking booking = new Booking();
        booking.setTour(tourOpt.get());
        
        // Sanitize and validate input
        String sanitizedName = req.getName() != null ? req.getName().trim() : "";
        String sanitizedEmail = req.getEmail() != null ? req.getEmail().trim().toLowerCase() : "";
        
        if (sanitizedName.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Name is required.");
        }
        
        if (sanitizedEmail.isEmpty() || !sanitizedEmail.contains("@")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Valid email is required.");
        }
        
        booking.setUserName(sanitizedName);
        booking.setUserEmail(sanitizedEmail);
        try {
            LocalDate departureDate = LocalDate.parse(req.getDepartureDate());
            LocalDate today = LocalDate.now();
            
            // Validate departure date is not in the past
            if (departureDate.isBefore(today)) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Departure date cannot be in the past.");
            }
            
            booking.setDepartureDate(departureDate);
            
            if (req.getReturnDate() != null) {
                LocalDate returnDate = LocalDate.parse(req.getReturnDate());
                
                // Validate return date is after departure date
                if (returnDate.isBefore(departureDate)) {
                    return ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body("Return date must be after departure date.");
                }
                
                booking.setReturnDate(returnDate);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid date format.");
        }

        // Validate number of guests
        if (req.getGuests() <= 0) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Number of guests must be at least 1.");
        }
        
        if (req.getGuests() > tourOpt.get().getMaxGuests()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Number of guests (" + req.getGuests() + ") exceeds maximum capacity (" + tourOpt.get().getMaxGuests() + ").");
        }
        
        booking.setGuests(req.getGuests());
        
        // Validate payment method
        if (req.getPaymentMethod() == null || req.getPaymentMethod().trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Payment method is required.");
        }
        
        String paymentMethod = req.getPaymentMethod().toLowerCase();
        if (!paymentMethod.equals("paypal") && !paymentMethod.equals("card")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payment method. Only 'paypal' and 'card' are supported.");
        }
        
        booking.setPaymentMethod(req.getPaymentMethod());

        // 3) process payment (PayPal or Card validation)
        try {
            logger.info("Processing payment for booking - Method: {}, Guests: {}, Round Trip: {}", 
                req.getPaymentMethod(), req.getGuests(), req.getReturnDate() != null);
            
            boolean paid = paymentServiceFactory.processPayment(req, booking);
            booking.setStatus(paid ? "PAID" : "FAILED");
            
            logger.info("Payment processing result: {} for booking", paid ? "SUCCESS" : "FAILED");
            
            if (!paid) {
                logger.error("❌ Payment failed for booking - Method: {}, Guests: {}, Round Trip: {}", 
                    req.getPaymentMethod(), req.getGuests(), req.getReturnDate() != null);
            }
        } catch (Exception ex) {
            logger.error("❌ Payment processing exception for booking - Method: {}, Guests: {}, Round Trip: {}", 
                req.getPaymentMethod(), req.getGuests(), req.getReturnDate() != null, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Payment failed: " + ex.getMessage());
        }

        // 4) save booking
        Booking saved = bookingRepository.save(booking);

        // 5) compute receipt amounts
        double pricePerPerson = saved.getTour().getPrice();
        int guests = saved.getGuests();
        double baseTotal = pricePerPerson * guests;
        
        // Check if this is a round-trip booking (has return date)
        boolean isRoundTrip = saved.getReturnDate() != null;
        double total = isRoundTrip ? baseTotal * 2 : baseTotal;

        // 6a) email customer with beautiful HTML template
        try {
            logger.info("Attempting to send customer confirmation email to: {}", saved.getUserEmail());
            logger.info("Customer email field value: '{}'", saved.getUserEmail());
            logger.info("Booking details - ID: {}, Status: {}, Guests: {}, Round Trip: {}", 
                saved.getId(), saved.getStatus(), saved.getGuests(), saved.getReturnDate() != null);
            
            // Only send confirmation email if payment was successful
            if (!"PAID".equals(saved.getStatus())) {
                logger.warn("⚠️ Skipping customer confirmation email - Payment status is: {}", saved.getStatus());
            } else if (saved.getUserEmail() == null || saved.getUserEmail().trim().isEmpty()) {
                logger.error("❌ Customer email is null or empty - cannot send confirmation email");
            } else {
                emailService.sendCustomerBookingConfirmation(saved);
                logger.info("✅ Customer confirmation email sent to: {}", saved.getUserEmail());
            }
        } catch (Exception e) {
            logger.error("❌ Failed to send customer confirmation email to: {}", saved.getUserEmail(), e);
            logger.error("Booking details for failed email - ID: {}, Status: {}, Guests: {}, Round Trip: {}", 
                saved.getId(), saved.getStatus(), saved.getGuests(), saved.getReturnDate() != null);
            // Don't fail the booking if email fails
        }

        // 6b) email agency with beautiful HTML template
        try {
            logger.info("Attempting to send agency notification email for booking ID: {}", saved.getId());
            logger.info("Agency email: {}, Booking status: {}", agencyEmail, saved.getStatus());
            
            // Always send agency notification (even for failed payments) so they know about the attempt
            emailService.sendAgencyBookingNotification(saved);
            logger.info("✅ Agency notification email sent to: {}", agencyEmail);
        } catch (Exception e) {
            logger.error("❌ Failed to send agency notification email to: {}", agencyEmail, e);
            logger.error("Booking details for failed agency email - ID: {}, Status: {}, Guests: {}, Round Trip: {}", 
                saved.getId(), saved.getStatus(), saved.getGuests(), saved.getReturnDate() != null);
            // Don't fail the booking if email fails
        }

        // 7) return booking
        logger.info("Booking created successfully. ID: {}, Customer: {}, Total: €{}", 
                   saved.getId(), saved.getUserName(), total);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> list = bookingRepository.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            String subject = "🧪 Email System Test - RILINDI SHPK";
            String text = "This is a test email to verify the email system is working correctly.\n\n" +
                         "If you receive this email, the email system is properly configured.\n\n" +
                         "Best regards,\nRILINDI SHPK Team";
            
            emailService.sendSimpleMessage(email, subject, text);
            return ResponseEntity.ok("Test email sent successfully to: " + email);
        } catch (Exception e) {
            logger.error("Failed to send test email to: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send test email: " + e.getMessage());
        }
    }
    
    @GetMapping("/email-config")
    public ResponseEntity<String> getEmailConfiguration() {
        try {
            String configStatus = emailService.getEmailConfigurationStatus();
            return ResponseEntity.ok(configStatus);
        } catch (Exception e) {
            logger.error("Failed to get email configuration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get email configuration: " + e.getMessage());
        }
    }
}
