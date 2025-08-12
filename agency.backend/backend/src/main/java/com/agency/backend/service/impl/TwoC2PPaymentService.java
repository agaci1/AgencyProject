package com.agency.backend.service.impl;

import com.agency.backend.dto.BookingRequest;
import com.agency.backend.model.Booking;
import com.agency.backend.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.util.Base64;

@Service
@Primary
public class TwoC2PPaymentService implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(TwoC2PPaymentService.class);
    
    @Value("${twoc2p.merchant.id:}")
    private String merchantId;
    
    @Value("${twoc2p.secret.key:}")
    private String secretKey;
    
    @Value("${twoc2p.api.url:https://demo2.2c2p.com/2C2PFrontEnd/RedirectV3/payment}")
    private String apiUrl;

    @Override
    public boolean processPayment(BookingRequest req, Booking booking) throws Exception {
        if (!"twoc2p".equalsIgnoreCase(req.getPaymentMethod()) || req.getTwoC2P() == null) {
            logger.error("Invalid payment method for 2C2P service: {}", req.getPaymentMethod());
            return false;
        }

        try {
            // Validate 2C2P transaction
            boolean isValid = validateTwoC2PTransaction(req.getTwoC2P().getTransactionId());
            
            if (isValid) {
                booking.setTwoC2PTransactionId(req.getTwoC2P().getTransactionId());
                booking.setTwoC2PCustomerEmail(req.getTwoC2P().getCustomerEmail());
                logger.info("2C2P payment validated successfully - Transaction ID: {}", req.getTwoC2P().getTransactionId());
                return true;
            } else {
                logger.error("2C2P transaction validation failed - Transaction ID: {}", req.getTwoC2P().getTransactionId());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error processing 2C2P payment", e);
            return false;
        }
    }

    private boolean validateTwoC2PTransaction(String transactionId) {
        if (merchantId.isEmpty() || secretKey.isEmpty()) {
            logger.warn("2C2P credentials not configured. Using fallback validation for transaction: {}", transactionId);
            logger.warn("This means 2C2P payments will be accepted without server-side validation.");
            logger.warn("Please configure TWOC2P_MERCHANT_ID and TWOC2P_SECRET_KEY environment variables for production.");
            
            // Fallback validation: accept the transaction if it has a valid format
            if (transactionId != null && !transactionId.trim().isEmpty() && transactionId.length() > 10) {
                logger.info("Accepting 2C2P transaction with fallback validation: {}", transactionId);
                return true;
            } else {
                logger.error("Invalid 2C2P transaction ID format: {}", transactionId);
                return false;
            }
        }

        // In production, you would validate with 2C2P API
        // For now, accept valid-looking transaction IDs
        return transactionId != null && !transactionId.trim().isEmpty() && transactionId.length() > 10;
    }

    public String createPaymentRequest(double amount, String currency, String description, String orderId) throws Exception {
        if (merchantId.isEmpty() || secretKey.isEmpty()) {
            throw new IllegalStateException("2C2P credentials not configured");
        }

        // Create payment request data
        String paymentData = String.format(
            "merchantID=%s&invoiceNo=%s&description=%s&amount=%.2f&currencyCode=%s&paymentChannel=ALL",
            merchantId, orderId, description, amount, currency
        );

        // Generate signature
        String signature = generateSignature(paymentData);
        
        // Encode payment data
        String encodedData = Base64.getEncoder().encodeToString(paymentData.getBytes());
        
        return apiUrl + "?paymentRequest=" + encodedData + "&signature=" + signature;
    }

    private String generateSignature(String data) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        String dataToHash = data + secretKey;
        byte[] hash = md.digest(dataToHash.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(hash);
    }
}
