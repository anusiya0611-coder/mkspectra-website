package com.mkspectra.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String to;
    private final String from;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.to}") String to,
                        @Value("${spring.mail.username}") String from) {
        this.mailSender = mailSender;
        this.to = to;
        this.from = from;
    }

    public void sendEnquiry(ContactRequest r) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(from);               // Gmail only allows the authenticated account as sender
        mail.setTo(to);
        mail.setReplyTo(r.email().trim()); // hitting "Reply" answers the visitor directly
        mail.setSubject("New enquiry from MK SPECTRA website - " + oneLine(r.name()));
        mail.setText(
                "You received a new enquiry from the website contact form.\n\n"
              + "Name    : " + oneLine(r.name()) + "\n"
              + "Email   : " + oneLine(r.email()) + "\n"
              + "Phone   : " + oneLine(r.phone()) + "\n"
              + "Company : " + orDash(r.company()) + "\n"
              + "Service : " + oneLine(r.service()) + "\n"
              + "Budget  : " + orDash(r.budget()) + "\n\n"
              + "Message :\n" + r.message().trim() + "\n");
        mailSender.send(mail);
    }

    private static String orDash(String s) {
        String v = oneLine(s);
        return v.isEmpty() ? "-" : v;
    }

    /** Strips line breaks so user input can never inject extra mail headers. */
    private static String oneLine(String s) {
        return s == null ? "" : s.replaceAll("[\\r\\n]+", " ").trim();
    }
}