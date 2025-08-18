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
                
                // REAL PayPal API validation using Client ID/Secret
                logger.info("Validating PayPal payment for transaction: {}", transactionId);
                if (!validatePayPalPayment(transactionId)) {
                    logger.error("PayPal payment validation failed for transaction: {}", transactionId);
                    
                    // Additional error logging for debugging
                    try {
                        Map<String, Object> orderStatus = getOrderStatus(transactionId);
                        if (orderStatus != null) {
                            logger.error("PayPal order status details: {}", orderStatus);
                        }
                    } catch (Exception statusError) {
                        logger.error("Could not get order status for debugging: {}", statusError.getMessage());
                    }
                    
                    return false;
                }
                
                logger.info("✅ PayPal payment validation successful for transaction: {}", transactionId);
                
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
    public String createPayPalOrder(BigDecimal amount, String currency, String description, String customId) {
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
            
            // Add description and custom_id if provided
            if (description != null && !description.trim().isEmpty()) {
                purchaseUnit.put("description", description);
            }
            if (customId != null && !customId.trim().isEmpty()) {
                purchaseUnit.put("custom_id", customId);
            }
            
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
                logger.info("PayPal order created successfully: {}", orderId);
                return orderId;
            } else {
                logger.error("Failed to create PayPal order: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error creating PayPal order: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Capture a PayPal order and return the capture details
     * This follows the official PayPal pattern for order capture
     */
    public Map<String, Object> capturePayPalOrder(String orderId) {
        try {
            logger.info("Attempting to capture PayPal order: {}", orderId);
            
            if (orderId == null || orderId.trim().isEmpty()) {
                logger.error("Order ID is null or empty");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid order ID");
                errorResponse.put("details", "Order ID cannot be null or empty");
                return errorResponse;
            }
            
            // Validate order ID format (PayPal order IDs are typically EC-XXXXXXXXXXXXXXX format)
            if (!orderId.matches("[A-Z0-9_-]+")) {
                logger.error("Invalid order ID format: {}", orderId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid order ID format");
                errorResponse.put("details", "Order ID contains invalid characters");
                return errorResponse;
            }
            
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token for order capture");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Authentication failed");
                errorResponse.put("details", "Could not authenticate with PayPal");
                return errorResponse;
            }
            
            logger.info("Got PayPal access token, proceeding with capture");
            
            // First, check the order status before attempting capture
            String orderUrl = paypalBaseUrl + "/v2/checkout/orders/" + orderId;
            HttpHeaders orderHeaders = new HttpHeaders();
            orderHeaders.setBearerAuth(accessToken);
            orderHeaders.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> orderEntity = new HttpEntity<>(orderHeaders);
            
            try {
                logger.info("Checking order status before capture...");
                ResponseEntity<String> orderResponse = restTemplate.exchange(orderUrl, HttpMethod.GET, orderEntity, String.class);
                
                if (orderResponse.getStatusCode() != HttpStatus.OK) {
                    logger.error("Failed to get order status: {} - Status: {}", orderId, orderResponse.getStatusCode());
                    logger.error("Order status response: {}", orderResponse.getBody());
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Failed to get order status");
                    errorResponse.put("details", "PayPal returned status: " + orderResponse.getStatusCode());
                    errorResponse.put("paypalResponse", orderResponse.getBody());
                    return errorResponse;
                }
                
                // Parse order status
                JsonNode orderData = objectMapper.readTree(orderResponse.getBody());
                String orderStatus = orderData.path("status").asText();
                logger.info("Order status: {}", orderStatus);
                
                // Check if order is already completed
                if ("COMPLETED".equals(orderStatus)) {
                    logger.info("Order is already completed, returning existing order data");
                    return objectMapper.convertValue(orderData, Map.class);
                }
                
                // Check if order is already captured but not completed
                JsonNode purchaseUnits = orderData.path("purchase_units");
                if (purchaseUnits.isArray() && purchaseUnits.size() > 0) {
                    JsonNode payments = purchaseUnits.get(0).path("payments");
                    JsonNode captures = payments.path("captures");
                    
                    if (captures.isArray() && captures.size() > 0) {
                        String captureStatus = captures.get(0).path("status").asText();
                        if ("COMPLETED".equals(captureStatus)) {
                            logger.info("Order is already captured and completed, returning existing order data");
                            return objectMapper.convertValue(orderData, Map.class);
                        }
                    }
                }
                
                // Only proceed if order is APPROVED
                if (!"APPROVED".equals(orderStatus)) {
                    logger.error("Order is not in APPROVED state. Current status: {}", orderStatus);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Order not approved for capture");
                    errorResponse.put("details", "Order status is: " + orderStatus + ". Order must be approved by the buyer before capture.");
                    errorResponse.put("orderStatus", orderStatus);
                    errorResponse.put("paypalResponse", objectMapper.convertValue(orderData, Map.class));
                    return errorResponse;
                }
                
            } catch (Exception orderError) {
                logger.error("Error checking order status: {}", orderError.getMessage());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to check order status");
                errorResponse.put("details", orderError.getMessage());
                return errorResponse;
            }
            
            // Capture the order
            String captureUrl = paypalBaseUrl + "/v2/checkout/orders/" + orderId + "/capture";
            logger.info("Calling PayPal capture URL: {}", captureUrl);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            // Create empty body for capture request
            HttpEntity<String> entity = new HttpEntity<>("{}", headers);
            
            try {
                logger.info("Making capture request to PayPal...");
                logger.info("Capture URL: {}", captureUrl);
                logger.info("Request headers: {}", headers);
                
                ResponseEntity<String> response = restTemplate.exchange(captureUrl, HttpMethod.POST, entity, String.class);
                
                logger.info("PayPal capture response status: {}", response.getStatusCode());
                logger.info("PayPal capture response body: {}", response.getBody());
                
                if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                    try {
                        Map<String, Object> captureResponse = objectMapper.readValue(response.getBody(), Map.class);
                        logger.info("PayPal order captured successfully: {}", orderId);
                        logger.info("Capture response: {}", captureResponse);
                        return captureResponse;
                    } catch (Exception parseError) {
                        logger.error("Error parsing capture response: {}", parseError.getMessage());
                        logger.error("Raw response body: {}", response.getBody());
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Failed to parse capture response");
                        errorResponse.put("details", parseError.getMessage());
                        errorResponse.put("rawResponse", response.getBody());
                        return errorResponse;
                    }
                } else {
                    logger.error("Failed to capture PayPal order: {} - Status: {}", orderId, response.getStatusCode());
                    logger.error("Error response body: {}", response.getBody());
                    
                    // Try to parse error details
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "PayPal capture failed");
                    errorResponse.put("details", "PayPal returned status: " + response.getStatusCode());
                    errorResponse.put("paypalResponse", response.getBody());
                    
                    try {
                        JsonNode errorData = objectMapper.readTree(response.getBody());
                        String errorMessage = errorData.path("message").asText();
                        String errorName = errorData.path("name").asText();
                        JsonNode details = errorData.path("details");
                        
                        logger.error("PayPal error details - Name: {}, Message: {}", errorName, errorMessage);
                        errorResponse.put("paypalErrorName", errorName);
                        errorResponse.put("paypalErrorMessage", errorMessage);
                        
                        if (details.isArray() && details.size() > 0) {
                            for (JsonNode detail : details) {
                                String issue = detail.path("issue").asText();
                                String description = detail.path("description").asText();
                                logger.error("PayPal error detail - Issue: {}, Description: {}", issue, description);
                            }
                        }
                    } catch (Exception parseError) {
                        logger.error("Could not parse error response");
                    }
                    
                    return errorResponse;
                }
                
            } catch (Exception e) {
                logger.error("HTTP error during PayPal capture: {}", e.getMessage(), e);
                logger.error("Exception type: {}", e.getClass().getSimpleName());
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "PayPal API error");
                errorResponse.put("details", e.getMessage());
                
                // Check if it's a specific PayPal error
                if (e.getMessage().contains("400")) {
                    logger.error("PayPal returned 400 error - likely invalid order state or already captured");
                    errorResponse.put("paypalErrorType", "INVALID_ORDER_STATE");
                } else if (e.getMessage().contains("404")) {
                    logger.error("PayPal returned 404 error - order not found");
                    errorResponse.put("paypalErrorType", "ORDER_NOT_FOUND");
                } else if (e.getMessage().contains("401")) {
                    logger.error("PayPal returned 401 error - authentication failed");
                    errorResponse.put("paypalErrorType", "AUTHENTICATION_FAILED");
                } else if (e.getMessage().contains("422")) {
                    logger.error("PayPal returned 422 error - unprocessable entity, likely order already captured");
                    errorResponse.put("paypalErrorType", "ORDER_ALREADY_CAPTURED");
                }
                
                return errorResponse;
            }
            
        } catch (Exception e) {
            logger.error("Error capturing PayPal order: {}", e.getMessage(), e);
            logger.error("Exception type: {}", e.getClass().getSimpleName());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unexpected error");
            errorResponse.put("details", e.getMessage());
            return errorResponse;
        }
    }
    
    /**
     * Validate PayPal payment with PayPal's API using Client ID/Secret
     * Note: transactionId is actually the PayPal Order ID
     */
    private boolean validatePayPalPayment(String orderId) {
        try {
            // REJECT fake transaction IDs - they indicate payment validation failed
            if (orderId.startsWith("PAYPAL_FALLBACK_") || orderId.startsWith("CARD_PAYPAL_")) {
                logger.error("REJECTING fake transaction ID: {}. This indicates payment validation failed.", orderId);
                return false; // Reject fake transactions - they mean payment failed
            }
            
            // Get PayPal access token using Client ID/Secret
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
            
            // Check if order is completed or approved (for already captured orders)
            String status = orderData.path("status").asText();
            logger.info("PayPal order status: {} for order: {}", status, orderId);
            
            // Accept both COMPLETED and APPROVED statuses
            // COMPLETED = order was captured successfully
            // APPROVED = order was approved but might be already captured (422 case)
            if (!"COMPLETED".equals(status) && !"APPROVED".equals(status)) {
                logger.error("PayPal order status is not COMPLETED or APPROVED: {} for order: {}", status, orderId);
                return false;
            }
            
            // Check payment status and ensure payment was captured
            JsonNode purchaseUnits = orderData.path("purchase_units");
            if (purchaseUnits.isArray() && purchaseUnits.size() > 0) {
                JsonNode payments = purchaseUnits.get(0).path("payments");
                JsonNode captures = payments.path("captures");
                
                if (captures.isArray() && captures.size() > 0) {
                    String captureStatus = captures.get(0).path("status").asText();
                    logger.info("PayPal capture status: {} for order: {}", captureStatus, orderId);
                    
                    // Accept both COMPLETED and PENDING capture statuses
                    // COMPLETED = capture was successful
                    // PENDING = capture is pending (common for already captured orders)
                    if (!"COMPLETED".equals(captureStatus) && !"PENDING".equals(captureStatus)) {
                        logger.error("PayPal capture status is not COMPLETED or PENDING: {} for order: {}", captureStatus, orderId);
                        return false;
                    }
                    
                    // Get the actual capture ID (this is the real transaction ID)
                    String captureId = captures.get(0).path("id").asText();
                    logger.info("PayPal payment validated successfully - Order: {}, Capture: {}", orderId, captureId);
                    
                    // Additional validation: Check if capture is final (not pending)
                    String captureFinalStatus = captures.get(0).path("final_capture").asText();
                    if (!"true".equals(captureFinalStatus)) {
                        logger.warn("PayPal capture is not final for order: {}", orderId);
                        // This might indicate a pending capture that could fail
                    }
                    
                    // Check for any fraud indicators or holds
                    JsonNode captureStatusDetails = captures.get(0).path("status_details");
                    if (!captureStatusDetails.isMissingNode()) {
                        String reason = captureStatusDetails.path("reason").asText();
                        if ("BUYER_COMPLAINT".equals(reason) || "CHARGEBACK".equals(reason)) {
                            logger.error("PayPal capture has fraud indicator: {} for order: {}", reason, orderId);
                            return false;
                        }
                    }
                    
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
     * Get PayPal access token using Client ID/Secret (not API signature)
     * This follows the official PayPal OAuth2 pattern
     */
    private String getPayPalAccessToken() {
        try {
            logger.info("Getting PayPal access token...");
            logger.info("PayPal Base URL: {}", paypalBaseUrl);
            logger.info("PayPal Client ID length: {}", paypalClientId != null ? paypalClientId.length() : 0);
            logger.info("PayPal Client Secret length: {}", paypalClientSecret != null ? paypalClientSecret.length() : 0);
            
            String tokenUrl = paypalBaseUrl + "/v1/oauth2/token";
            logger.info("Token URL: {}", tokenUrl);
            
            // Create basic auth header with Client ID and Secret
            String credentials = paypalClientId + ":" + paypalClientSecret;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedCredentials);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            String body = "grant_type=client_credentials";
            
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            
            logger.info("Making token request...");
            ResponseEntity<String> response = restTemplate.exchange(
                tokenUrl, 
                HttpMethod.POST, 
                entity, 
                String.class
            );
            
            logger.info("Token response status: {}", response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenData = objectMapper.readTree(response.getBody());
                String accessToken = tokenData.path("access_token").asText();
                logger.info("Successfully obtained PayPal access token, length: {}", accessToken.length());
                return accessToken;
            } else {
                logger.error("Failed to get PayPal access token. Status: {}", response.getStatusCode());
                logger.error("Response body: {}", response.getBody());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error getting PayPal access token: {}", e.getMessage(), e);
            return null;
        }
    }
    
    // Getter methods for configuration testing
    public String getPaypalBaseUrl() {
        return paypalBaseUrl;
    }
    
    public String getPaypalClientId() {
        return paypalClientId;
    }
    
    public String getPaypalClientSecret() {
        return paypalClientSecret;
    }
    
    /**
     * Test method to get PayPal access token (public for testing)
     */
    public String getPayPalAccessTokenForTest() {
        return getPayPalAccessToken();
    }
    
    /**
     * Get order status from PayPal
     */
    public Map<String, Object> getOrderStatus(String orderId) {
        try {
            logger.info("Getting order status for: {}", orderId);
            
            if (orderId == null || orderId.trim().isEmpty()) {
                logger.error("Order ID is null or empty");
                return null;
            }
            
            String accessToken = getPayPalAccessToken();
            if (accessToken == null) {
                logger.error("Failed to get PayPal access token for order status check");
                return null;
            }
            
            String orderUrl = paypalBaseUrl + "/v2/checkout/orders/" + orderId;
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(orderUrl, HttpMethod.GET, entity, String.class);
            
            logger.info("Order status response status: {}", response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK) {
                try {
                    Map<String, Object> orderData = objectMapper.readValue(response.getBody(), Map.class);
                    logger.info("Order status retrieved successfully: {}", orderId);
                    return orderData;
                } catch (Exception parseError) {
                    logger.error("Error parsing order status response: {}", parseError.getMessage());
                    return null;
                }
            } else {
                logger.error("Failed to get order status: {} - Status: {}", orderId, response.getStatusCode());
                logger.error("Error response body: {}", response.getBody());
                return null;
            }
            
        } catch (Exception e) {
            logger.error("Error getting order status for {}: {}", orderId, e.getMessage(), e);
            return null;
        }
    }
} 