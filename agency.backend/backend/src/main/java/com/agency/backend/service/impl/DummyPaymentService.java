package com.agency.backend.service.impl;

import org.springframework.context.annotation.Primary;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@Primary
public class DummyPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(DummyPaymentService.class);

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        logger.info("Processing payment for booking - Method: {}, Tour: {}", 
                   req.getPaymentMethod(), booking.getTour() != null ? booking.getTour().getTitle() : "Unknown");

        if ("card".equalsIgnoreCase(req.getPaymentMethod()) && req.getPayment() != null) {
            return processCardPayment(req, booking);
        }

        if ("paypal".equalsIgnoreCase(req.getPaymentMethod()) && req.getPaypal() != null) {
            return processPayPalPayment(req, booking);
        }

        logger.error("Invalid payment method: {}", req.getPaymentMethod());
        return false;
    }

    private boolean processCardPayment(BookingRequest req, Booking booking) {
        try {
            String cardNumber = req.getPayment().getNumber();
            
            // Basic card validation
            if (cardNumber == null || cardNumber.length() < 13 || cardNumber.length() > 19) {
                logger.error("Invalid card number length: {}", cardNumber != null ? cardNumber.length() : "null");
                return false;
            }

            // Store only last 4 digits for security
            booking.setCardLast4(cardNumber.length() >= 4 ? cardNumber.substring(cardNumber.length() - 4) : cardNumber);
            booking.setCardholderName(req.getPayment().getName());
            booking.setBillingAddress(req.getPayment().getAddress());
            booking.setCity(req.getPayment().getCity());
            booking.setZipCode(req.getPayment().getZip());
            booking.setCountry(req.getPayment().getCountry());

            logger.info("Card payment processed successfully for: {}", booking.getCardholderName());
            return true;
        } catch (Exception e) {
            logger.error("Error processing card payment", e);
            return false;
        }
    }

    private boolean processPayPalPayment(BookingRequest req, Booking booking) {
        try {
            // Validate PayPal transaction data
            if (req.getPaypal().getTransactionId() == null || req.getPaypal().getTransactionId().trim().isEmpty()) {
                logger.error("PayPal transaction ID is missing or empty");
                return false;
            }

            if (req.getPaypal().getEmail() == null || req.getPaypal().getEmail().trim().isEmpty()) {
                logger.error("PayPal email is missing or empty");
                return false;
            }

            // Store PayPal transaction details
            booking.setPaypalEmail(req.getPaypal().getEmail());
            booking.setPaypalTxn(req.getPaypal().getTransactionId());

            logger.info("PayPal payment processed successfully - Transaction ID: {}, Email: {}", 
                       req.getPaypal().getTransactionId(), req.getPaypal().getEmail());
            
            // TODO: In production, validate the transaction ID with PayPal API
            // This would involve making a server-to-server call to PayPal to verify the transaction
            
            return true;
        } catch (Exception e) {
            logger.error("Error processing PayPal payment", e);
            return false;
        }
    }
}
