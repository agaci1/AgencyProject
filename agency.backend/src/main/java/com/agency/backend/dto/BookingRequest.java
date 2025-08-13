package com.agency.backend.dto;

import jakarta.validation.constraints.*;

// Manual constructors instead of Lombok
public class BookingRequest {

    @NotNull
    private Long tourId;

    @NotBlank
    private String name;

    @Email
    private String email;

    @NotBlank
    private String departureDate;

    private String returnDate;

    @Min(1)
    private int guests;

    @NotBlank
    @Pattern(regexp = "paypal|card")
    private String paymentMethod;

    private PaypalInfo paypal;  // for "paypal" method
    private CardInfo payment;   // for "card" method

    // Manual constructors
    public BookingRequest() {}

    public BookingRequest(Long tourId, String name, String email, String departureDate, String returnDate, int guests, String paymentMethod, PaypalInfo paypal) {
        this.tourId = tourId;
        this.name = name;
        this.email = email;
        this.departureDate = departureDate;
        this.returnDate = returnDate;
        this.guests = guests;
        this.paymentMethod = paymentMethod;
        this.paypal = paypal;
    }

    // Manual getters and setters
    public Long getTourId() { return tourId; }
    public void setTourId(Long tourId) { this.tourId = tourId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartureDate() { return departureDate; }
    public void setDepartureDate(String departureDate) { this.departureDate = departureDate; }

    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }

    public int getGuests() { return guests; }
    public void setGuests(int guests) { this.guests = guests; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaypalInfo getPaypal() { return paypal; }
    public void setPaypal(PaypalInfo paypal) { this.paypal = paypal; }

    public CardInfo getPayment() { return payment; }
    public void setPayment(CardInfo payment) { this.payment = payment; }

    public static class PaypalInfo {
        @Email
        private String email;

        @NotBlank
        private String transactionId;

        // Manual getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    }

    public static class CardInfo {
        @NotBlank
        private String number;

        @NotBlank
        private String expiry;

        @NotBlank
        private String cvv;

        @NotBlank
        private String name;

        @Email
        private String email;

        private String address;
        private String city;
        private String zip;
        private String country;

        // Manual getters and setters
        public String getNumber() { return number; }
        public void setNumber(String number) { this.number = number; }

        public String getExpiry() { return expiry; }
        public void setExpiry(String expiry) { this.expiry = expiry; }

        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getZip() { return zip; }
        public void setZip(String zip) { this.zip = zip; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }
}
