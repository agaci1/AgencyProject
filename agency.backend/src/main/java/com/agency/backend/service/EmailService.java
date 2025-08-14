package com.agency.backend.service;

import com.agency.backend.model.Booking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${spring.mail.password:}")
    private String mailPassword;
    
    @Value("${app.agency.email}")
    private String agencyEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            // Check if email credentials are configured
            if (mailPassword == null || mailPassword.isEmpty()) {
                logger.error("❌ EMAIL SYSTEM NOT CONFIGURED - Missing MAIL_PASSWORD environment variable");
                logger.error("Email to: {}", to);
                logger.error("Subject: {}", subject);
                logger.error("Content: {}", text);
                throw new RuntimeException("Email system not configured. Please set MAIL_PASSWORD environment variable.");
            }
            
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
            logger.info("Simple email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send simple email to: {}", to, e);
            // Log the email content for debugging
            logger.error("Failed email subject: {}", subject);
            logger.error("Failed email content: {}", text);
        }
    }

    public void sendHtmlMessage(String to, String subject, String htmlContent) {
        try {
            // Check if email credentials are configured
            if (mailPassword == null || mailPassword.isEmpty()) {
                logger.error("❌ EMAIL SYSTEM NOT CONFIGURED - Missing MAIL_PASSWORD environment variable");
                logger.error("HTML Email to: {}", to);
                logger.error("Subject: {}", subject);
                logger.error("HTML content length: {} characters", htmlContent.length());
                throw new RuntimeException("Email system not configured. Please set MAIL_PASSWORD environment variable.");
            }
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content
            
            mailSender.send(message);
            logger.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send HTML email to: {}", to, e);
            // Log the email content for debugging
            logger.error("Failed email subject: {}", subject);
            logger.error("Failed email HTML content length: {} characters", htmlContent.length());
        }
    }

    /**
     * Send beautiful invoice-like email to customer
     */
    public void sendCustomerBookingConfirmation(Booking booking) {
        try {
            String subject = "🎫 Your Booking Confirmation — " + booking.getTourName();
            String htmlContent = generateCustomerEmailHtml(booking);
            sendHtmlMessage(booking.getUserEmail(), subject, htmlContent);
            logger.info("Customer booking confirmation sent to: {}", booking.getUserEmail());
        } catch (Exception e) {
            logger.error("Failed to send customer booking confirmation to: {}", booking.getUserEmail(), e);
        }
    }

    /**
     * Send notification email to agency
     */
    public void sendAgencyBookingNotification(Booking booking) {
        try {
            String subject = "📋 New Booking Received — ID " + booking.getId();
            String htmlContent = generateAgencyEmailHtml(booking);
            sendHtmlMessage(agencyEmail, subject, htmlContent);
            logger.info("Agency booking notification sent to: {}", agencyEmail);
        } catch (Exception e) {
            logger.error("Failed to send agency booking notification to: {}", agencyEmail, e);
        }
    }

    private String generateCustomerEmailHtml(Booking booking) {
        double pricePerPerson = booking.getTour().getPrice();
        int guests = booking.getGuests();
        double baseTotal = pricePerPerson * guests;
        boolean isRoundTrip = booking.getReturnDate() != null;
        double total = isRoundTrip ? baseTotal * 2 : baseTotal;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
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
            """.formatted(
                booking.getId(),
                booking.getUserName(),
                booking.getTourName(),
                isRoundTrip ? "Round Trip" : "One Way",
                booking.getDepartureDate().format(formatter),
                booking.getReturnDate() == null ? "—" : booking.getReturnDate().format(formatter),
                guests,
                booking.getPaymentMethod().toUpperCase(),
                pricePerPerson,
                guests,
                baseTotal,
                isRoundTrip ? "<div class=\"payment-row\"><span>Round trip (x2):</span><span>€" + String.format("%.2f", baseTotal) + "</span></div>" : "",
                total
            );
    }

    private String generateAgencyEmailHtml(Booking booking) {
        double pricePerPerson = booking.getTour().getPrice();
        int guests = booking.getGuests();
        double baseTotal = pricePerPerson * guests;
        boolean isRoundTrip = booking.getReturnDate() != null;
        double total = isRoundTrip ? baseTotal * 2 : baseTotal;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Booking Notification</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
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
                            <a href="mailto:%s?subject=Booking #%d - %s" class="action-btn">📧 Reply to Customer</a>
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
            """.formatted(
                booking.getId(),
                booking.getUserName(),
                booking.getUserEmail(),
                booking.getPaymentMethod().toUpperCase(),
                booking.getPaypalEmail() != null ? "<div class=\"detail-row\"><span class=\"detail-label\">PayPal Email:</span><span class=\"detail-value\">" + booking.getPaypalEmail() + "</span></div>" : "",
                booking.getTourName(),
                isRoundTrip ? "Round Trip" : "One Way",
                booking.getDepartureDate().format(formatter),
                booking.getReturnDate() == null ? "—" : booking.getReturnDate().format(formatter),
                guests,
                pricePerPerson,
                guests,
                baseTotal,
                isRoundTrip ? "<div class=\"payment-row\"><span>Round trip (x2):</span><span>€" + String.format("%.2f", baseTotal) + "</span></div>" : "",
                total,
                booking.getUserEmail(),
                booking.getId(),
                booking.getTourName()
            );
    }

    /**
     * Convenience for password-reset emails
     */
    public void sendPasswordResetMail(String to, String link) {
        String subject = "🔐 Your password reset link";
        String text = String.join(
                "\n",
                "We got a request to reset your password.",
                "Click here to choose a new one:",
                link,
                "",
                "If you didn't ask for this, you can safely ignore this email."
        );
        sendSimpleMessage(to, subject, text);
    }
}
