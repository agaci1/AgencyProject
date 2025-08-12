package com.agency.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
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
    @Pattern(regexp = "paypal")
    private String paymentMethod;

    private PaypalInfo paypal;  // for "paypal" method

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

    @Data
    public static class PaypalInfo {
        @Email
        private String email;

        @NotBlank
        private String transactionId;
    }
}
