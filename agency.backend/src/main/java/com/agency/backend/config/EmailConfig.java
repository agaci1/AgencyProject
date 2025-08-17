package com.agency.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {
    private static final Logger logger = LoggerFactory.getLogger(EmailConfig.class);

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Bean
    public JavaMailSender javaMailSender() {
        // Check if email credentials are configured
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            logger.warn("⚠️ EMAIL SYSTEM NOT CONFIGURED - Missing MAIL_USERNAME or MAIL_PASSWORD environment variables");
            logger.warn("Email functionality will be disabled. To enable emails, set:");
            logger.warn("  MAIL_USERNAME=your-email@gmail.com");
            logger.warn("  MAIL_PASSWORD=your-app-password");
            return createDummyMailSender();
        }
        
        logger.info("📧 Configuring email system with host: {}:{}", host, port);
        logger.info("📧 Email username: {}", username);
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.debug", "false");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");

        logger.info("✅ Email system configured successfully");
        return mailSender;
    }

    /**
     * Creates a dummy mail sender that logs emails instead of sending them
     * This prevents the application from crashing when email credentials are missing
     */
    private JavaMailSender createDummyMailSender() {
        return new JavaMailSender() {
            @Override
            public jakarta.mail.internet.MimeMessage createMimeMessage() {
                logger.warn("📧 DUMMY MAIL SENDER: createMimeMessage() called - email would be logged instead of sent");
                return null;
            }

            @Override
            public jakarta.mail.internet.MimeMessage createMimeMessage(java.io.InputStream contentStream) {
                logger.warn("📧 DUMMY MAIL SENDER: createMimeMessage(InputStream) called - email would be logged instead of sent");
                return null;
            }

            @Override
            public void send(jakarta.mail.internet.MimeMessage mimeMessage) {
                logger.warn("📧 DUMMY MAIL SENDER: send(MimeMessage) called - email would be logged instead of sent");
            }

            @Override
            public void send(jakarta.mail.internet.MimeMessage... mimeMessages) {
                logger.warn("📧 DUMMY MAIL SENDER: send(MimeMessage[]) called - {} emails would be logged instead of sent", mimeMessages.length);
            }

            @Override
            public void send(org.springframework.mail.SimpleMailMessage simpleMessage) {
                logger.warn("📧 DUMMY MAIL SENDER: Email would be logged instead of sent");
                logger.warn("📧 To: {}", simpleMessage.getTo());
                logger.warn("📧 Subject: {}", simpleMessage.getSubject());
                logger.warn("📧 Content: {}", simpleMessage.getText());
            }

            @Override
            public void send(org.springframework.mail.SimpleMailMessage... simpleMessages) {
                logger.warn("📧 DUMMY MAIL SENDER: {} emails would be logged instead of sent", simpleMessages.length);
                for (org.springframework.mail.SimpleMailMessage msg : simpleMessages) {
                    logger.warn("📧 To: {}, Subject: {}", msg.getTo(), msg.getSubject());
                }
            }
        };
    }
} 