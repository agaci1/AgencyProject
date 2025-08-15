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
@CrossOrigin(origins = "*")
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
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> cartList = (List<Map<String, Object>>) cartObj;
                if (!cartList.isEmpty()) {
                    cart.put("0", cartList.get(0));
                }
            } else if (cartObj instanceof Map) {
                @SuppressWarnings("unchecked")
                cart = (Map<String, Object>) cartObj;
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
            
            // Capture order using PayPal service
            Map<String, Object> captureResult = payPalPaymentService.capturePayPalOrder(orderID);
            
            if (captureResult != null) {
                logger.info("PayPal order captured successfully: {}", orderID);
                return ResponseEntity.ok(captureResult);
            } else {
                logger.error("Failed to capture PayPal order: {}", orderID);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Failed to capture order");
                return ResponseEntity.status(500).body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error capturing PayPal order {}: {}", orderID, e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to capture order: " + e.getMessage());
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
}

