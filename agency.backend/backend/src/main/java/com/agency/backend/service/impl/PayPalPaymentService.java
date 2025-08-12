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
        if (!"paypal".equalsIgnoreCase(req.getPaymentMethod()) || req.getPaypal() == null) {
            logger.error("Invalid payment method for PayPal service: {}", req.getPaymentMethod());
            return false;
        }

        try {
            // Simple validation - accept any valid-looking transaction ID
            String transactionId = req.getPaypal().getTransactionId();
            String email = req.getPaypal().getEmail();
            
            if (transactionId != null && !transactionId.trim().isEmpty() && transactionId.length() > 5) {
                booking.setPaypalEmail(email);
                booking.setPaypalTxn(transactionId);
                logger.info("PayPal payment accepted - Transaction ID: {}, Email: {}", transactionId, email);
                return true;
            } else {
                logger.error("Invalid PayPal transaction ID: {}", transactionId);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error processing PayPal payment", e);
            return false;
        }
    }
} 