package com.agency.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Value("${mail.username:}")
    private String username;

    @Value("${mail.password:}")
    private String password;

    @Bean
    @ConditionalOnProperty(name = {"mail.username", "mail.password"}, havingValue = ".+", matchIfMissing = false)
    public JavaMailSender javaMailSender() {
        // Temporarily disable email service to fix backend startup
        return null;
        
        // Original code (commented out for now)
        /*
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return null;
        }
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp-mail.outlook.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");

        return mailSender;
        */
    }
} 