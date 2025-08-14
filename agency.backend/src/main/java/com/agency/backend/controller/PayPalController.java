package com.agency.backend.controller;

import com.agency.backend.service.impl.PayPalPaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = "*")
public class PayPalController {

    private static final Logger logger = LoggerFactory.getLogger(PayPalController.class);
    
    @Autowired
    private PayPalPaymentService payPalPaymentService;

    /**
     * Create a PayPal order
     * This follows the official PayPal pattern
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            logger.info("Creating PayPal order with request: {}", request);
            
            // Extract parameters from request
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String currency = (String) request.get("currency");
            String description = (String) request.get("description");
            String customId = (String) request.get("custom_id");
            
            if (currency == null) {
                currency = "EUR"; // Default to EUR
            }
            
            // Create PayPal order with additional details
            String orderId = payPalPaymentService.createPayPalOrder(amount, currency, description, customId);
            
            if (orderId != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", orderId);
                response.put("status", "CREATED");
                
                logger.info("PayPal order created successfully: {}", orderId);
                return ResponseEntity.ok(response);
            } else {
                logger.error("Failed to create PayPal order");
                return ResponseEntity.status(500).body(Map.of("error", "Failed to create PayPal order"));
            }
            
        } catch (Exception e) {
            logger.error("Error creating PayPal order: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Capture a PayPal order
     * This follows the official PayPal pattern
     */
    @PostMapping("/capture-order")
    public ResponseEntity<Map<String, Object>> captureOrder(@RequestBody Map<String, Object> request) {
        try {
            logger.info("🔄 Capture order request received: {}", request);
            
            String orderId = (String) request.get("orderId");
            logger.info("📋 Order ID from request: {}", orderId);
            
            if (orderId == null || orderId.trim().isEmpty()) {
                logger.error("❌ Order ID is null or empty in request");
                return ResponseEntity.badRequest().body(Map.of("error", "Order ID is required"));
            }
            
            logger.info("🔄 Calling PayPal service to capture order: {}", orderId);
            
            // Capture PayPal order
            Map<String, Object> captureResult = payPalPaymentService.capturePayPalOrder(orderId);
            
            if (captureResult != null) {
                logger.info("✅ PayPal order captured successfully: {}", orderId);
                logger.info("📋 Capture result: {}", captureResult);
                return ResponseEntity.ok(captureResult);
            } else {
                logger.error("❌ PayPal service returned null for order: {}", orderId);
                return ResponseEntity.status(500).body(Map.of("error", "Failed to capture PayPal order - service returned null"));
            }
            
        } catch (Exception e) {
            logger.error("❌ Error capturing PayPal order: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * Test PayPal configuration
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testPayPal() {
        try {
            logger.info("Testing PayPal configuration");
            
            // Try to create a test order for 1 EUR
            String testOrderId = payPalPaymentService.createPayPalOrder(new BigDecimal("1.00"), "EUR", "Test Order", "test_" + System.currentTimeMillis());
            
            if (testOrderId != null) {
                logger.info("PayPal test successful - created order: {}", testOrderId);
                return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "PayPal configuration is working",
                    "test_order_id", testOrderId
                ));
            } else {
                logger.error("PayPal test failed - could not create order");
                return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "PayPal configuration test failed"
                ));
            }
            
        } catch (Exception e) {
            logger.error("PayPal test error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "PayPal test error: " + e.getMessage()
            ));
        }
    }
}
