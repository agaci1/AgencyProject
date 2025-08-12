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
    @Pattern(regexp = "paypal")
    private String paymentMethod;

    private PaypalInfo paypal;  // for "paypal" method

    @Data
    public static class PaypalInfo {
        @Email
        private String email;

        @NotBlank
        private String transactionId;
    }
}
