package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PayPalPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalPaymentService.class);
    
    @Value("${paypal.client.id:}")
    private String paypalClientId;
    
    @Value("${paypal.client.secret:}")
    private String paypalClientSecret;
    
    @Value("${paypal.base.url:https://api-m.sandbox.paypal.com}")
    private String paypalBaseUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        if (!"paypal".equalsIgnoreCase(req.getPaymentMethod()) || req.getPaypal() == null) {
            logger.error("Invalid payment method for PayPal service: {}", req.getPaymentMethod());
            return false;
        }

        try {
            // Validate PayPal transaction
            boolean isValid = validatePayPalTransaction(req.getPaypal().getTransactionId());
            
            if (isValid) {
                booking.setPaypalEmail(req.getPaypal().getEmail());
                booking.setPaypalTxn(req.getPaypal().getTransactionId());
                logger.info("PayPal payment validated successfully - Transaction ID: {}", req.getPaypal().getTransactionId());
                return true;
            } else {
                logger.error("PayPal transaction validation failed - Transaction ID: {}", req.getPaypal().getTransactionId());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error processing PayPal payment", e);
            return false;
        }
    }

    private boolean validatePayPalTransaction(String transactionId) {
        // If PayPal credentials are not configured, fall back to basic validation
        if (paypalClientId.isEmpty() || paypalClientSecret.isEmpty()) {
            logger.warn("PayPal credentials not configured, using basic validation");
            return basicPayPalValidation(transactionId);
        }

        try {
            // Get access token
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token");
                return false;
            }

            // Verify the order
            return verifyPayPalOrder(transactionId, accessToken);
        } catch (Exception e) {
            logger.error("Error validating PayPal transaction", e);
            return false;
        }
    }

    private String getPayPalAccessToken() {
        try {
            String credentials = paypalClientId + ":" + paypalClientSecret;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Basic " + encodedCredentials);

            String body = "grant_type=client_credentials";

            HttpEntity<String> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                paypalBaseUrl + "/v1/oauth2/token", 
                request, 
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            logger.error("Error getting PayPal access token", e);
        }
        return null;
    }

    private boolean verifyPayPalOrder(String orderId, String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                paypalBaseUrl + "/v2/checkout/orders/" + orderId,
                HttpMethod.GET,
                request,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String status = (String) response.getBody().get("status");
                return "COMPLETED".equals(status);
            }
        } catch (Exception e) {
            logger.error("Error verifying PayPal order", e);
        }
        return false;
    }

    private boolean basicPayPalValidation(String transactionId) {
        // Basic validation for development/testing
        return transactionId != null && 
               !transactionId.trim().isEmpty() && 
               transactionId.length() > 10;
    }
} 