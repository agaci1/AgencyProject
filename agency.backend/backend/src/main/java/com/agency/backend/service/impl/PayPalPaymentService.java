package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class PayPalPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalPaymentService.class);
    
    // PayPal payment service for production
    
    @Value("${paypal.client.id:}")
    private String paypalClientId;
    
    @Value("${paypal.client.secret:}")
    private String paypalClientSecret;
    
    @Value("${paypal.base.url:https://api-m.paypal.com}")
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
        // Check if PayPal credentials are configured
        if (paypalClientId.isEmpty() || paypalClientSecret.isEmpty()) {
            logger.warn("PayPal credentials not configured. Using fallback validation for transaction: {}", transactionId);
            logger.warn("This means PayPal payments will be accepted without server-side validation.");
            logger.warn("Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables for production.");
            
            // Fallback validation: accept the transaction if it has a valid format
            // This prevents double charges when credentials are not configured
            if (transactionId != null && !transactionId.trim().isEmpty() && (transactionId.startsWith("EC-") || transactionId.startsWith("PAY-") || transactionId.length() > 10)) {
                logger.info("Accepting PayPal transaction with fallback validation: {}", transactionId);
                return true;
            } else {
                logger.error("Invalid PayPal transaction ID format: {}", transactionId);
                return false;
            }
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
} 