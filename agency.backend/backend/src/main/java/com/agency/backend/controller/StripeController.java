package com.agency.backend.controller;

import com.agency.backend.service.impl.StripePaymentService;
import com.stripe.exception.StripeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "*")
public class StripeController {

    private static final Logger logger = LoggerFactory.getLogger(StripeController.class);

    @Autowired
    private StripePaymentService stripePaymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            double amount = Double.parseDouble(request.get("amount").toString());
            String currency = request.get("currency").toString();
            String description = request.get("description").toString();

            String paymentIntentId = stripePaymentService.createPaymentIntent(amount, currency, description);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntentId);
            response.put("success", true);

            logger.info("Created Stripe payment intent: {}", paymentIntentId);
            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            logger.error("Error creating Stripe payment intent", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error creating payment intent", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create payment intent");
            errorResponse.put("success", false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Stripe controller is running");
        return ResponseEntity.ok(response);
    }
}
