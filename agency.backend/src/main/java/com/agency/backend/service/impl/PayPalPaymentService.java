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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;

@Service
@Primary
public class PayPalPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalPaymentService.class);
    
    @Value("${paypal.client.id:}")
    private String paypalClientId;
    
    @Value("${paypal.client.secret:}")
    private String paypalClientSecret;
    
    @Value("${paypal.base.url:https://api-m.paypal.com}")
    private String paypalBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        logger.info("Processing PayPal payment for method: {}", req.getPaymentMethod());
        
        // Both "paypal" and "card" payment methods are handled by PayPal
        if (!"paypal".equalsIgnoreCase(req.getPaymentMethod()) && !"card".equalsIgnoreCase(req.getPaymentMethod())) {
            logger.error("Invalid payment method for PayPal service: {}", req.getPaymentMethod());
            return false;
        }

        // For PayPal method, validate PayPal data
        if ("paypal".equalsIgnoreCase(req.getPaymentMethod()) && req.getPaypal() == null) {
            logger.error("PayPal info is null for PayPal payment method");
            return false;
        }
        
        // For card method, validate card data
        if ("card".equalsIgnoreCase(req.getPaymentMethod()) && req.getPayment() == null) {
            logger.error("Card payment info is null for card payment method");
            return false;
        }

        try {
            if ("paypal".equalsIgnoreCase(req.getPaymentMethod())) {
                // Process PayPal payment with REAL API validation
                String transactionId = req.getPaypal().getTransactionId();
                String email = req.getPaypal().getEmail();
                
                logger.info("PayPal transaction received - ID: {}, Email: {}", transactionId, email);
                
                // Validate PayPal transaction
                if (transactionId == null || transactionId.trim().isEmpty()) {
                    logger.error("PayPal transaction ID is missing");
                    return false;
                }
                
                if (email == null || email.trim().isEmpty()) {
                    logger.error("PayPal email is missing");
                    return false;
                }
                
                // REAL PayPal API validation
                if (!validatePayPalPayment(transactionId)) {
                    logger.error("PayPal payment validation failed for transaction: {}", transactionId);
                    return false;
                }
                
                logger.info("PayPal payment validated and accepted successfully for transaction: {}", transactionId);
                
                // Store validated payment details
                booking.setPaypalEmail(email);
                booking.setPaypalTxn(transactionId);
                
                return true;
                
            } else if ("card".equalsIgnoreCase(req.getPaymentMethod())) {
                // Process card payment through PayPal
                BookingRequest.CardInfo cardInfo = req.getPayment();
                
                logger.info("Card payment through PayPal - Cardholder: {}", cardInfo.getName());
                
                // Store card details in booking
                String lastFourDigits = cardInfo.getNumber().length() >= 4 ? 
                    cardInfo.getNumber().substring(cardInfo.getNumber().length() - 4) : "****";
                
                booking.setCardLast4(lastFourDigits);
                booking.setCardholderName(cardInfo.getName());
                if (cardInfo.getAddress() != null) {
                    booking.setBillingAddress(cardInfo.getAddress());
                }
                if (cardInfo.getCity() != null) {
                    booking.setCity(cardInfo.getCity());
                }
                if (cardInfo.getZip() != null) {
                    booking.setZipCode(cardInfo.getZip());
                }
                if (cardInfo.getCountry() != null) {
                    booking.setCountry(cardInfo.getCountry());
                }
                
                // For card payments, we need to validate with PayPal first
                // This should be done through PayPal's hosted card fields
                logger.error("Card payment validation not implemented. Payment rejected.");
                return false;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("Error processing payment", e);
            return false;
        }
    }

    /**
     * Create a PayPal order and return the order ID
     * This follows the official PayPal pattern for order creation
     */
    public String createPayPalOrder(BigDecimal amount, String currency) {
        try {
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token for order creation");
                return null;
            }
            
            // Create order payload following PayPal's format
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("intent", "CAPTURE");
            
            Map<String, Object> purchaseUnit = new HashMap<>();
            Map<String, Object> amountData = new HashMap<>();
            amountData.put("currency_code", currency);
            amountData.put("value", amount.toString());
            purchaseUnit.put("amount", amountData);
            
            List<Map<String, Object>> purchaseUnits = new ArrayList<>();
            purchaseUnits.add(purchaseUnit);
            orderData.put("purchase_units", purchaseUnits);
            
            // Call PayPal API to create order
            String createOrderUrl = paypalBaseUrl + "/v2/checkout/orders";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderData, headers);
            ResponseEntity<Map> response = restTemplate.exchange(createOrderUrl, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                Map<String, Object> orderResponse = response.getBody();
                String orderId = (String) orderResponse.get("id");
                logger.info("✅ PayPal order created successfully: {}", orderId);
                return orderId;
            } else {
                logger.error("❌ Failed to create PayPal order: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("❌ Error creating PayPal order: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Capture a PayPal order and return the capture details
     * This follows the official PayPal pattern for order capture
     */
    public Map<String, Object> capturePayPalOrder(String orderId) {
        try {
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token for order capture");
                return null;
            }
            
            // Capture the order
            String captureUrl = paypalBaseUrl + "/v2/checkout/orders/" + orderId + "/capture";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(captureUrl, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.CREATED) {
                Map<String, Object> captureResponse = response.getBody();
                logger.info("✅ PayPal order captured successfully: {}", orderId);
                return captureResponse;
            } else {
                logger.error("❌ Failed to capture PayPal order: {} - Status: {}", orderId, response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("❌ Error capturing PayPal order: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Validate PayPal payment with PayPal's API
     * Note: transactionId is actually the PayPal Order ID
     */
    private boolean validatePayPalPayment(String orderId) {
        try {
            // REJECT fake transaction IDs - they indicate payment validation failed
            if (orderId.startsWith("PAYPAL_FALLBACK_") || orderId.startsWith("CARD_PAYPAL_")) {
                logger.error("REJECTING fake transaction ID: {}. This indicates payment validation failed.", orderId);
                return false; // Reject fake transactions - they mean payment failed
            }
            
            // Get PayPal access token
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token");
                return false;
            }

            // Get order details from PayPal using the Order ID
            String orderUrl = paypalBaseUrl + "/v2/checkout/orders/" + orderId;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                orderUrl, 
                HttpMethod.GET, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() != HttpStatus.OK) {
                logger.error("PayPal API returned status: {} for order: {}", response.getStatusCode(), orderId);
                return false;
            }
            
            // Parse response
            JsonNode orderData = objectMapper.readTree(response.getBody());
            
            // Check if order is completed
            String status = orderData.path("status").asText();
            if (!"COMPLETED".equals(status)) {
                logger.error("PayPal order status is not COMPLETED: {} for order: {}", status, orderId);
                return false;
            }
            
            // Check payment status
            JsonNode purchaseUnits = orderData.path("purchase_units");
            if (purchaseUnits.isArray() && purchaseUnits.size() > 0) {
                JsonNode payments = purchaseUnits.get(0).path("payments");
                JsonNode captures = payments.path("captures");
                
                if (captures.isArray() && captures.size() > 0) {
                    String captureStatus = captures.get(0).path("status").asText();
                    if (!"COMPLETED".equals(captureStatus)) {
                        logger.error("PayPal capture status is not COMPLETED: {} for order: {}", captureStatus, orderId);
                        return false;
                    }
                    
                    // Get the actual capture ID (this is the real transaction ID)
                    String captureId = captures.get(0).path("id").asText();
                    logger.info("PayPal payment validated successfully - Order: {}, Capture: {}", orderId, captureId);
                } else {
                    logger.error("No captures found for PayPal order: {}", orderId);
                    return false;
                }
            }
            
            logger.info("PayPal payment validation successful for order: {}", orderId);
            return true;
            
        } catch (Exception e) {
            logger.error("Error validating PayPal payment for order {}: {}", orderId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Get PayPal access token for API calls
     */
    private String getPayPalAccessToken() {
        try {
            String tokenUrl = paypalBaseUrl + "/v1/oauth2/token";
            
            // Create basic auth header
            String credentials = paypalClientId + ":" + paypalClientSecret;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedCredentials);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            String body = "grant_type=client_credentials";
            
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                tokenUrl, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenData = objectMapper.readTree(response.getBody());
                return tokenData.path("access_token").asText();
            } else {
                logger.error("Failed to get PayPal access token. Status: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error getting PayPal access token: {}", e.getMessage(), e);
            return null;
        }
    }
} 