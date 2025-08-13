package com.agency.backend.service;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;

public interface PaymentService {
    boolean processPayment(BookingRequest req, Booking booking) throws Exception;
}
