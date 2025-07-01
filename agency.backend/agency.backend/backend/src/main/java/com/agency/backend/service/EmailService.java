package com.agency.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("your-email@gmail.com");      // TODO: swap in your real “from”
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
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
                "If you didn’t ask for this, you can safely ignore this email."
        );
        sendSimpleMessage(to, subject, text);
    }
}
