package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CardPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(CardPaymentService.class);

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        if (!"card".equalsIgnoreCase(req.getPaymentMethod()) || req.getPayment() == null) {
            logger.error("Invalid payment method for Card service: {}", req.getPaymentMethod());
            return false;
        }

        try {
            // Process card payment
            boolean isValid = processCardPayment(req, booking);
            
            if (isValid) {
                logger.info("Card payment processed successfully for: {}", booking.getCardholderName());
                return true;
            } else {
                logger.error("Card payment processing failed");
                return false;
            }
        } catch (Exception e) {
            logger.error("Error processing card payment", e);
            return false;
        }
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
}
