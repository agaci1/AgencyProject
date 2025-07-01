package com.agency.backend.controller;

import java.time.LocalDate;

public class CreateBookingRequest {
    private Long tourId;
    private String userName;
    private String userEmail;
    private LocalDate departureDate;
    private LocalDate returnDate; // nullable
    private int guests;

    // ─── Getters & setters ───

    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }
}
