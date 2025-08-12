package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class PayPalPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalPaymentService.class);
    
    @Value("${paypal.client.id:}")
    private String paypalClientId;
    
    @Value("${paypal.client.secret:}")
    private String paypalClientSecret;

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        logger.info("Processing PayPal payment for method: {}", req.getPaymentMethod());
        
        if (!"paypal".equalsIgnoreCase(req.getPaymentMethod())) {
            logger.error("Invalid payment method for PayPal service: {}", req.getPaymentMethod());
            return false;
        }

        if (req.getPaypal() == null) {
            logger.error("PayPal info is null");
            return false;
        }

        try {
            // Accept any PayPal transaction
            String transactionId = req.getPaypal().getTransactionId();
            String email = req.getPaypal().getEmail();
            
            logger.info("PayPal transaction received - ID: {}, Email: {}", transactionId, email);
            
            // Always accept PayPal payments for now
            booking.setPaypalEmail(email != null ? email : "customer@paypal.com");
            booking.setPaypalTxn(transactionId != null ? transactionId : "PAYPAL_" + System.currentTimeMillis());
            
            logger.info("PayPal payment accepted successfully");
            return true;
        } catch (Exception e) {
            logger.error("Error processing PayPal payment", e);
            return false;
        }
    }
} 