package com.agency.backend.controller;

import com.agency.backend.service.PaymentService;
import com.agency.backend.service.impl.PayPalPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"https://rilindishpk.com", "https://www.rilindishpk.com", "http://localhost:3000"})
public class PayPalController {

    private static final Logger logger = LoggerFactory.getLogger(PayPalController.class);

    @Autowired
    private PayPalPaymentService payPalPaymentService;

    /**
     * Create a PayPal order (following PayPal Standard pattern)
     * This endpoint is called by the frontend to create an order
     */
    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            logger.info("Creating PayPal order with request: {}", request);
            
            // Extract cart information (following PayPal Standard pattern)
            Object cartObj = request.get("cart");
            Map<String, Object> cart = new HashMap<>();
            
            if (cartObj instanceof List) {
                // Convert List to Map for processing
                List<?> cartList = (List<?>) cartObj;
                if (!cartList.isEmpty()) {
                    Object firstItem = cartList.get(0);
                    if (firstItem instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> cartItem = (Map<String, Object>) firstItem;
                        cart.put("0", cartItem);
                    }
                }
            } else if (cartObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> cartMap = (Map<String, Object>) cartObj;
                cart = cartMap;
            }
            
            // Calculate total amount from cart
            BigDecimal amount = calculateTotalFromCart(cart);
            String description = generateDescriptionFromCart(cart);
            String customId = generateCustomId();
            
            // Create order using PayPal service
            String orderId = payPalPaymentService.createPayPalOrder(amount, "EUR", description, customId);
            
            if (orderId != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", orderId);
                logger.info("PayPal order created successfully: {}", orderId);
                return ResponseEntity.ok(response);
            } else {
                logger.error("Failed to create PayPal order");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to create order");
                return ResponseEntity.status(500).body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error creating PayPal order: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Capture a PayPal order (following PayPal Standard pattern)
     * This endpoint is called by the frontend to capture payment
     */
    @PostMapping("/orders/{orderID}/capture")
    public ResponseEntity<?> captureOrder(@PathVariable String orderID) {
        try {
            logger.info("Capturing PayPal order: {}", orderID);
            logger.info("Order ID length: {}", orderID != null ? orderID.length() : 0);
            logger.info("Order ID format valid: {}", orderID != null && orderID.matches("[A-Z0-9_-]+"));
            
            // Validate order ID
            if (orderID == null || orderID.trim().isEmpty()) {
                logger.error("Order ID is null or empty");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid order ID");
                errorResponse.put("details", "Order ID cannot be null or empty");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            if (!orderID.matches("[A-Z0-9_-]+")) {
                logger.error("Invalid order ID format: {}", orderID);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid order ID format");
                errorResponse.put("details", "Order ID contains invalid characters");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            // Capture order using PayPal service
            Map<String, Object> captureResult = payPalPaymentService.capturePayPalOrder(orderID);
            
            // Check if the result contains an error
            if (captureResult.containsKey("error")) {
                logger.error("PayPal capture failed: {}", captureResult.get("error"));
                captureResult.put("orderId", orderID);
                return ResponseEntity.status(500).body(captureResult);
            } else {
                logger.info("PayPal order captured successfully: {}", orderID);
                return ResponseEntity.ok(captureResult);
            }
            
        } catch (Exception e) {
            logger.error("Error capturing PayPal order {}: {}", orderID, e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to capture order");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("orderId", orderID);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Calculate total amount from cart (following PayPal Standard pattern)
     */
    private BigDecimal calculateTotalFromCart(Map<String, Object> cart) {
        try {
            if (cart != null && cart.containsKey("0")) {
                // Extract price from cart item
                @SuppressWarnings("unchecked")
                Map<String, Object> cartItem = (Map<String, Object>) cart.get("0");
                Object price = cartItem.get("price");
                
                if (price != null) {
                    return new BigDecimal(price.toString());
                }
            }
            
            // Fallback to default amount
            logger.warn("Could not extract price from cart, using default amount");
            return new BigDecimal("100.00");
        } catch (Exception e) {
            logger.error("Error calculating total from cart: {}", e.getMessage());
            return new BigDecimal("100.00");
        }
    }

    /**
     * Generate description from cart (following PayPal Standard pattern)
     */
    private String generateDescriptionFromCart(Map<String, Object> cart) {
        try {
            if (cart != null && cart.containsKey("0")) {
                // Extract title from cart item
                @SuppressWarnings("unchecked")
                Map<String, Object> cartItem = (Map<String, Object>) cart.get("0");
                Object title = cartItem.get("title");
                Object quantity = cartItem.get("quantity");
                
                if (title != null) {
                    String description = title.toString();
                    if (quantity != null) {
                        description += " - " + quantity + " guest(s)";
                    }
                    return description;
                }
            }
            
            // Fallback to default description
            return "Tour Booking - Standard Checkout";
        } catch (Exception e) {
            logger.error("Error generating description from cart: {}", e.getMessage());
            return "Tour Booking - Standard Checkout";
        }
    }

    /**
     * Generate custom ID (following PayPal Standard pattern)
     */
    private String generateCustomId() {
        return "tour_booking_" + System.currentTimeMillis();
    }
    
    /**
     * Test endpoint to check PayPal configuration
     */
    @GetMapping("/paypal-config")
    public ResponseEntity<?> checkPayPalConfig() {
        try {
            Map<String, Object> config = new HashMap<>();
            config.put("baseUrl", payPalPaymentService.getPaypalBaseUrl());
            config.put("clientIdLength", payPalPaymentService.getPaypalClientId() != null ? payPalPaymentService.getPaypalClientId().length() : 0);
            config.put("clientSecretLength", payPalPaymentService.getPaypalClientSecret() != null ? payPalPaymentService.getPaypalClientSecret().length() : 0);
            config.put("clientIdSet", payPalPaymentService.getPaypalClientId() != null && !payPalPaymentService.getPaypalClientId().isEmpty());
            config.put("clientSecretSet", payPalPaymentService.getPaypalClientSecret() != null && !payPalPaymentService.getPaypalClientSecret().isEmpty());
            
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to check PayPal config: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Test endpoint to check PayPal API connectivity
     */
    @GetMapping("/paypal-test")
    public ResponseEntity<?> testPayPalAPI() {
        try {
            // Test getting access token
            String accessToken = payPalPaymentService.getPayPalAccessTokenForTest();
            if (accessToken != null) {
                Map<String, Object> result = new HashMap<>();
                result.put("status", "success");
                result.put("accessTokenLength", accessToken.length());
                result.put("message", "PayPal API is accessible");
                return ResponseEntity.ok(result);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("status", "error");
                error.put("message", "Failed to get PayPal access token");
                return ResponseEntity.status(500).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "PayPal API test failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Test endpoint to check specific order status
     */
    @GetMapping("/orders/{orderID}/status")
    public ResponseEntity<?> checkOrderStatus(@PathVariable String orderID) {
        try {
            logger.info("Checking status for order: {}", orderID);
            
            // Get order status using PayPal service
            Map<String, Object> orderStatus = payPalPaymentService.getOrderStatus(orderID);
            
            if (orderStatus != null) {
                logger.info("Order status retrieved successfully: {}", orderID);
                return ResponseEntity.ok(orderStatus);
            } else {
                logger.error("Failed to get order status: {}", orderID);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to get order status");
                errorResponse.put("orderId", orderID);
                return ResponseEntity.status(500).body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error checking order status {}: {}", orderID, e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to check order status");
            errorResponse.put("details", e.getMessage());
            errorResponse.put("orderId", orderID);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}

