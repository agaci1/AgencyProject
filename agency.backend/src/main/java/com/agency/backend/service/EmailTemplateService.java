package com.agency.backend.service;

import com.agency.backend.model.Booking;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailTemplateService {

    private static String escapePercent(String input) {
        return input == null ? "" : input.replace("%", "%%");
    }

    public String getCustomerBookingConfirmationTemplate(Booking booking) {
        double pricePerPerson = booking.getTour().getPrice();
        int guests = booking.getGuests();
        double baseTotal = pricePerPerson * guests;
        boolean isRoundTrip = booking.getReturnDate() != null;
        double total = isRoundTrip ? baseTotal * 2 : baseTotal;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        
        // Build conditional content
        String roundTripSection = isRoundTrip ? 
            "<div class=\"payment-row\"><span>Round trip (x2):</span><span>€" + String.format("%.2f", baseTotal) + "</span></div>" : "";
        
        String customerName = escapePercent(booking.getUserName());
        String tourName = escapePercent(booking.getTourName());
        String tripType = isRoundTrip ? "Round Trip" : "One Way";
        String departureDate = booking.getDepartureDate().format(formatter);
        String returnDate = booking.getReturnDate() == null ? "—" : booking.getReturnDate().format(formatter);
        String paymentMethod = escapePercent(booking.getPaymentMethod().toUpperCase());
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
                    .header .logo { font-size: 18px; margin-top: 10px; opacity: 0.9; }
                    .content { padding: 40px; }
                    .booking-id { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
                    .booking-id h2 { margin: 0; color: #495057; font-size: 24px; }
                    .booking-id .id { font-size: 32px; font-weight: bold; color: #667eea; }
                    .section { margin-bottom: 30px; }
                    .section h3 { color: #495057; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
                    .trip-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; }
                    .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .detail-label { font-weight: 600; color: #495057; }
                    .detail-value { color: #6c757d; }
                    .payment-breakdown { background-color: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
                    .payment-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .total-row { border-top: 2px solid #667eea; padding-top: 15px; margin-top: 15px; font-weight: bold; font-size: 18px; }
                    .footer { background-color: #495057; color: white; padding: 30px; text-align: center; }
                    .footer h3 { margin: 0 0 15px 0; color: #667eea; }
                    .contact-info { margin-top: 20px; }
                    .contact-item { margin-bottom: 8px; }
                    .highlight { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
                    @media (max-width: 600px) {
                        .content { padding: 20px; }
                        .detail-row { flex-direction: column; }
                        .payment-row { flex-direction: column; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎫 Booking Confirmation</h1>
                        <div class="logo">RILINDI SHPK - Travel Agency</div>
                    </div>
                    
                    <div class="content">
                        <div class="booking-id">
                            <h2>Booking ID</h2>
                            <div class="id">#%d</div>
                        </div>
                        
                        <div class="highlight">
                            <strong>Dear %s,</strong><br>
                            Thank you for choosing RILINDI SHPK for your Albanian Alps adventure! Your booking has been confirmed and payment received.
                        </div>
                        
                        <div class="section">
                            <h3>📋 Trip Details</h3>
                            <div class="trip-details">
                                <div class="detail-row">
                                    <span class="detail-label">Tour:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Trip Type:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Departure Date:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Return Date:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests:</span>
                                    <span class="detail-value">%d</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Payment Method:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>💰 Payment Breakdown</h3>
                            <div class="payment-breakdown">
                                <div class="payment-row">
                                    <span>Price per person:</span>
                                    <span>€%.2f</span>
                                </div>
                                <div class="payment-row">
                                    <span>Number of guests:</span>
                                    <span>%d</span>
                                </div>
                                <div class="payment-row">
                                    <span>Base total:</span>
                                    <span>€%.2f</span>
                                </div>
                                %s
                                <div class="payment-row total-row">
                                    <span>Total Amount:</span>
                                    <span>€%.2f</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="highlight">
                            <strong>🎯 What's Next?</strong><br>
                            • You will receive a reminder email 24 hours before departure<br>
                            • Please arrive 15 minutes before departure time<br>
                            • Bring comfortable walking shoes and weather-appropriate clothing<br>
                            • Don't forget your camera for the stunning mountain views!
                        </div>
                    </div>
                    
                    <div class="footer">
                        <h3>Safe Travels!</h3>
                        <p>We look forward to showing you the beauty of the Albanian Alps.</p>
                        
                        <div class="contact-info">
                            <div class="contact-item">📞 +355 672 121 800</div>
                            <div class="contact-item">📧 rilindi-shpk@hotmail.com</div>
                            <div class="contact-item">📍 Across the Museum, Bajram Curri, Tropoja</div>
                            <div class="contact-item">🕒 Mon-Fri: 08:00-19:00 | Sat-Sun: 08:00-16:00</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, 
            booking.getId(),
            customerName,
            tourName,
            tripType,
            departureDate,
            returnDate,
            guests,
            paymentMethod,
            pricePerPerson,
            guests,
            baseTotal,
            roundTripSection,
            total
        );
    }

    public String getAgencyBookingNotificationTemplate(Booking booking) {
        double pricePerPerson = booking.getTour().getPrice();
        int guests = booking.getGuests();
        double baseTotal = pricePerPerson * guests;
        boolean isRoundTrip = booking.getReturnDate() != null;
        double total = isRoundTrip ? baseTotal * 2 : baseTotal;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        
        // Build conditional content
        String paypalEmailSection = booking.getPaypalEmail() != null ? 
            "<div class=\"detail-row\"><span class=\"detail-label\">PayPal Email:</span><span class=\"detail-value\">" + escapePercent(booking.getPaypalEmail()) + "</span></div>" : "";
        
        String roundTripSection = isRoundTrip ? 
            "<div class=\"payment-row\"><span>Round trip (x2):</span><span>€" + String.format("%.2f", baseTotal) + "</span></div>" : "";
        
        String customerName = escapePercent(booking.getUserName());
        String customerEmail = escapePercent(booking.getUserEmail());
        String tourName = escapePercent(booking.getTourName());
        String tripType = isRoundTrip ? "Round Trip" : "One Way";
        String departureDate = booking.getDepartureDate().format(formatter);
        String returnDate = booking.getReturnDate() == null ? "—" : booking.getReturnDate().format(formatter);
        String paymentMethod = escapePercent(booking.getPaymentMethod().toUpperCase());
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Booking Notification</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #28a745 0%%, #20c997 100%%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
                    .header .logo { font-size: 18px; margin-top: 10px; opacity: 0.9; }
                    .content { padding: 40px; }
                    .booking-id { background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; border: 1px solid #c3e6cb; }
                    .booking-id h2 { margin: 0; color: #155724; font-size: 24px; }
                    .booking-id .id { font-size: 32px; font-weight: bold; color: #28a745; }
                    .section { margin-bottom: 30px; }
                    .section h3 { color: #495057; border-bottom: 2px solid #28a745; padding-bottom: 10px; margin-bottom: 20px; }
                    .customer-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; }
                    .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .detail-label { font-weight: 600; color: #495057; }
                    .detail-value { color: #6c757d; }
                    .trip-details { background-color: #e8f4fd; padding: 20px; border-radius: 8px; }
                    .payment-summary { background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; }
                    .payment-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .total-row { border-top: 2px solid #28a745; padding-top: 15px; margin-top: 15px; font-weight: bold; font-size: 18px; }
                    .footer { background-color: #495057; color: white; padding: 30px; text-align: center; }
                    .footer h3 { margin: 0 0 15px 0; color: #28a745; }
                    .action-buttons { margin-top: 20px; }
                    .action-btn { display: inline-block; padding: 10px 20px; margin: 5px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; }
                    @media (max-width: 600px) {
                        .content { padding: 20px; }
                        .detail-row { flex-direction: column; }
                        .payment-row { flex-direction: column; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 New Booking Received</h1>
                        <div class="logo">RILINDI SHPK - Travel Agency</div>
                    </div>
                    
                    <div class="content">
                        <div class="booking-id">
                            <h2>Booking ID</h2>
                            <div class="id">#%d</div>
                        </div>
                        
                        <div class="section">
                            <h3>👤 Customer Information</h3>
                            <div class="customer-info">
                                <div class="detail-row">
                                    <span class="detail-label">Name:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Email:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Payment Method:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                %s
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>🎫 Trip Details</h3>
                            <div class="trip-details">
                                <div class="detail-row">
                                    <span class="detail-label">Tour:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Trip Type:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Departure Date:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Return Date:</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests:</span>
                                    <span class="detail-value">%d</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>💰 Payment Summary</h3>
                            <div class="payment-summary">
                                <div class="payment-row">
                                    <span>Price per person:</span>
                                    <span>€%.2f</span>
                                </div>
                                <div class="payment-row">
                                    <span>Number of guests:</span>
                                    <span>%d</span>
                                </div>
                                <div class="payment-row">
                                    <span>Base total:</span>
                                    <span>€%.2f</span>
                                </div>
                                %s
                                <div class="payment-row total-row">
                                    <span>Total Revenue:</span>
                                    <span>€%.2f</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <a href="mailto:%s?subject=Booking ID %d - %s" class="action-btn">📧 Reply to Customer</a>
                            <a href="tel:+355672121800" class="action-btn">📞 Call Customer</a>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <h3>Booking Management</h3>
                        <p>This booking has been automatically confirmed and payment processed.</p>
                        <p>Please ensure all arrangements are in place for the scheduled departure.</p>
                    </div>
                </div>
            </body>
            </html>
            """, 
            booking.getId(),
            customerName,
            customerEmail,
            paymentMethod,
            paypalEmailSection,
            tourName,
            tripType,
            departureDate,
            returnDate,
            guests,
            pricePerPerson,
            guests,
            baseTotal,
            roundTripSection,
            total,
            customerEmail,
            booking.getId(),
            tourName
        );
    }

    public String getPasswordResetTemplate(String resetLink) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - RILINDI SHPK</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            🔐 Password Reset
                        </h1>
                    </div>
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #667eea; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
                            Reset Your Password
                        </h2>
                        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 15px; margin: 20px 0;">
                            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                                We received a request to reset your password for your RILINDI SHPK account.
                            </p>
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="%s" style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                    🔐 Reset Password
                                </a>
                            </div>
                            <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                                If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                            </p>
                        </div>
                        <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ffc107;">
                            <p style="margin: 0; color: #374151; font-size: 14px;">
                                <strong>🔒 Security Note:</strong> This link will expire in 24 hours for your security.
                            </p>
                        </div>
                        <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 25px; border-radius: 15px; text-align: center;">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; text-shadow: 0 1px 0 #fff;">📍 Visit Us</h3>
                            <p style="margin: 5px 0; font-size: 16px;"><strong>Across the Museum, Bajram Curri, Tropoja</strong></p>
                            <p style="margin: 5px 0; font-size: 16px;">📞 <strong>+355 672 121 800</strong></p>
                            <p style="margin: 5px 0; font-size: 16px;">📧 <strong>rilindi-shpk@hotmail.com</strong></p>
                        </div>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                Safe travels,<br>
                                <strong style="color: #667eea; font-size: 16px;">RILINDI SHPK ❤️</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """, resetLink);
    }
}
