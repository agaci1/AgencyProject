package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class DummyPaymentService implements PaymentService {

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {

        if ("card".equalsIgnoreCase(req.getPaymentMethod()) && req.getPayment() != null) {
            String cardNumber = req.getPayment().getNumber();
            booking.setCardLast4(cardNumber.length() >= 4 ? cardNumber.substring(cardNumber.length() - 4) : cardNumber);
            booking.setCardholderName(req.getPayment().getName());
            booking.setBillingAddress(req.getPayment().getAddress());
            booking.setCity(req.getPayment().getCity());
            booking.setZipCode(req.getPayment().getZip());
            booking.setCountry(req.getPayment().getCountry());

            // You can simulate card validation here if needed
            return true;
        }

        if ("paypal".equalsIgnoreCase(req.getPaymentMethod()) && req.getPaypal() != null) {
            booking.setPaypalEmail(req.getPaypal().getEmail());
            booking.setPaypalTxn(req.getPaypal().getTransactionId());

            // You could later validate this ID with PayPal API
            return true;
        }

        // Unknown or invalid method
        return false;
    }
}
