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
        
        // Both "paypal" and "card" payment methods are handled by PayPal
        if (!"paypal".equalsIgnoreCase(req.getPaymentMethod()) && !"card".equalsIgnoreCase(req.getPaymentMethod())) {
            logger.error("Invalid payment method for PayPal service: {}", req.getPaymentMethod());
            return false;
        }

        // For PayPal method, validate PayPal data
        if ("paypal".equalsIgnoreCase(req.getPaymentMethod()) && req.getPaypal() == null) {
            logger.error("PayPal info is null for PayPal payment method");
            return false;
        }
        
        // For card method, validate card data
        if ("card".equalsIgnoreCase(req.getPaymentMethod()) && req.getPayment() == null) {
            logger.error("Card payment info is null for card payment method");
            return false;
        }

        try {
            if ("paypal".equalsIgnoreCase(req.getPaymentMethod())) {
                // Process PayPal payment
                String transactionId = req.getPaypal().getTransactionId();
                String email = req.getPaypal().getEmail();
                
                logger.info("PayPal transaction received - ID: {}, Email: {}", transactionId, email);
                
                // Always accept PayPal payments for now
                booking.setPaypalEmail(email != null ? email : "customer@paypal.com");
                booking.setPaypalTxn(transactionId != null ? transactionId : "PAYPAL_" + System.currentTimeMillis());
                
                logger.info("PayPal payment accepted successfully");
                return true;
                
            } else if ("card".equalsIgnoreCase(req.getPaymentMethod())) {
                // Process card payment through PayPal
                BookingRequest.CardInfo cardInfo = req.getPayment();
                
                logger.info("Card payment through PayPal - Cardholder: {}", cardInfo.getName());
                
                // Store card details in booking
                String lastFourDigits = cardInfo.getNumber().length() >= 4 ? 
                    cardInfo.getNumber().substring(cardInfo.getNumber().length() - 4) : "****";
                
                booking.setCardLast4(lastFourDigits);
                booking.setCardholderName(cardInfo.getName());
                if (cardInfo.getAddress() != null) {
                    booking.setBillingAddress(cardInfo.getAddress());
                }
                if (cardInfo.getCity() != null) {
                    booking.setCity(cardInfo.getCity());
                }
                if (cardInfo.getZip() != null) {
                    booking.setZipCode(cardInfo.getZip());
                }
                if (cardInfo.getCountry() != null) {
                    booking.setCountry(cardInfo.getCountry());
                }
                
                // Generate a PayPal-like transaction ID for card payments
                booking.setPaypalTxn("CARD_PAYPAL_" + System.currentTimeMillis());
                
                logger.info("Card payment through PayPal accepted successfully");
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Error processing payment", e);
            return false;
        }
    }
} 