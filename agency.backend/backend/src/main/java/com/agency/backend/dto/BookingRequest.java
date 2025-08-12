package com.agency.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
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
    @Pattern(regexp = "card|paypal|stripe|twoc2p")
    private String paymentMethod;

    private CardInfo payment;   // for "card" method
    private PaypalInfo paypal;  // for "paypal" method
    private StripeInfo stripe;  // for "stripe" method
    private TwoC2PInfo twoC2P;  // for "twoc2p" method

    @Data
    public static class CardInfo {
        @NotBlank
        private String number;

        @NotBlank
        private String expiry;

        @NotBlank
        private String cvv;

        @NotBlank
        private String name;

        @NotBlank
        private String address;

        @NotBlank
        private String city;

        @NotBlank
        private String zip;

        @NotBlank
        private String country;
    }

    @Data
    public static class PaypalInfo {
        @Email
        private String email;

        @NotBlank
        private String transactionId;
    }

    @Data
    public static class StripeInfo {
        @NotBlank
        private String paymentIntentId;

        @Email
        private String customerEmail;
    }

    @Data
    public static class TwoC2PInfo {
        @NotBlank
        private String transactionId;

        @Email
        private String customerEmail;
    }
}
