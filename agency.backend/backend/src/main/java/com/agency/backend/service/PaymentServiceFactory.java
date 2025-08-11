package com.agency.backend.service;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.impl.CardPaymentService;
import com.agency.backend.service.impl.PayPalPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceFactory {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceFactory.class);

    @Autowired
    private PayPalPaymentService payPalPaymentService;

    @Autowired
    private CardPaymentService cardPaymentService;

    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        String paymentMethod = req.getPaymentMethod();
        
        logger.info("Processing payment with method: {}", paymentMethod);

        if ("paypal".equalsIgnoreCase(paymentMethod)) {
            return payPalPaymentService.processPayment(req, booking);
        } else if ("card".equalsIgnoreCase(paymentMethod)) {
            return cardPaymentService.processPayment(req, booking);
        } else {
            logger.error("Unsupported payment method: {}", paymentMethod);
            throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
    }
}
