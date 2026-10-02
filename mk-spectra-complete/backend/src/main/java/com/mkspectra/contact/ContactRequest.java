package com.mkspectra.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** JSON body sent by the contact form. "website" is a hidden honeypot field bots fill in. */
public record ContactRequest(
        @NotBlank(message = "Please enter your name.")
        @Size(max = 100, message = "Name is too long.")
        String name,

        @NotBlank(message = "Please enter a valid email.")
        @Email(message = "Please enter a valid email.")
        @Size(max = 150, message = "Email is too long.")
        String email,

        @NotBlank(message = "Please enter your phone number.")
        @Pattern(regexp = "^[+]?[0-9 ()\\-]{7,20}$", message = "Please enter a valid phone number.")
        String phone,

        @Size(max = 150, message = "Company name is too long.")
        String company,

        @NotBlank(message = "Please choose a service.")
        @Size(max = 100, message = "Service is too long.")
        String service,

        @Size(max = 100, message = "Budget value is too long.")
        String budget,

        @NotBlank(message = "Please write a short message.")
        @Size(max = 3000, message = "Message is too long (max 3000 characters).")
        String message,

        @Size(max = 200)
        String website
) {}