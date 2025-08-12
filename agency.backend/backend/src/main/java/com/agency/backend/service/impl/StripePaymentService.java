package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class StripePaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(StripePaymentService.class);
    
    @Value("${stripe.secret.key:}")
    private String stripeSecretKey;
    
    @Value("${stripe.publishable.key:}")
    private String stripePublishableKey;

    public StripePaymentService() {
        // Initialize Stripe with secret key when service is created
    }

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        if (!"stripe".equalsIgnoreCase(req.getPaymentMethod()) || req.getStripe() == null) {
            logger.error("Invalid payment method for Stripe service: {}", req.getPaymentMethod());
            return false;
        }

        try {
            // Initialize Stripe with secret key
            Stripe.apiKey = stripeSecretKey;
            
            // Validate the payment intent
            boolean isValid = validateStripePayment(req.getStripe().getPaymentIntentId());
            
            if (isValid) {
                booking.setStripePaymentIntentId(req.getStripe().getPaymentIntentId());
                booking.setStripeCustomerEmail(req.getStripe().getCustomerEmail());
                logger.info("Stripe payment validated successfully - Payment Intent ID: {}", req.getStripe().getPaymentIntentId());
                return true;
            } else {
                logger.error("Stripe payment validation failed - Payment Intent ID: {}", req.getStripe().getPaymentIntentId());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error processing Stripe payment", e);
            return false;
        }
    }

    private boolean validateStripePayment(String paymentIntentId) {
        if (stripeSecretKey.isEmpty()) {
            logger.warn("Stripe secret key not configured. Using fallback validation for payment intent: {}", paymentIntentId);
            logger.warn("This means Stripe payments will be accepted without server-side validation.");
            logger.warn("Please configure STRIPE_SECRET_KEY environment variable for production.");
            
            // Fallback validation: accept the payment if it has a valid format
            if (paymentIntentId != null && !paymentIntentId.trim().isEmpty() && paymentIntentId.startsWith("pi_")) {
                logger.info("Accepting Stripe payment with fallback validation: {}", paymentIntentId);
                return true;
            } else {
                logger.error("Invalid Stripe payment intent ID format: {}", paymentIntentId);
                return false;
            }
        }

        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            return "succeeded".equals(paymentIntent.getStatus());
        } catch (StripeException e) {
            logger.error("Error validating Stripe payment intent", e);
            return false;
        }
    }

    public String createPaymentIntent(double amount, String currency, String description) throws StripeException {
        if (stripeSecretKey.isEmpty()) {
            throw new IllegalStateException("Stripe secret key not configured");
        }

        Stripe.apiKey = stripeSecretKey;
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100)) // Convert to cents
                .setCurrency(currency.toLowerCase())
                .setDescription(description)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        return paymentIntent.getId();
    }
}
