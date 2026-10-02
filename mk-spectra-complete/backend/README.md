# MK SPECTRA – Contact form backend (Java / Spring Boot),

Receives the website contact form and emails it to `mkspectra27@gmail.com`.

## 1. Gmail App Password (one time)
1. Google Account → Security → turn on **2-Step Verification**.
2. Google Account → Security → **App passwords** → create one (name: "MK Spectra site").
3. Copy the 16-character password. This is `MAIL_PASSWORD` (not your normal Gmail password).

## 2. Run locally (Java 17+ and Maven)
Windows (PowerShell):
```
$env:MAIL_USERNAME="mkspectra27@gmail.com"
$env:MAIL_PASSWORD="your-16-char-app-password"
mvn spring-boot:run
```
Mac/Linux:
```
export MAIL_USERNAME=mkspectra27@gmail.com
export MAIL_PASSWORD=your-16-char-app-password
mvn spring-boot:run
```
API starts at `http://localhost:8080/api/contact`.

Open `contact.html` with VS Code **Live Server** (http://127.0.0.1:5500) – opening the file by double-click will be blocked by CORS.

Quick test without the website:
```
curl -X POST http://localhost:8080/api/contact -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","service":"Web Development","message":"Hello"}'
```

## 3. Going live
- Deploy this app (Render, Railway, AWS, a VPS…) and set env vars `MAIL_USERNAME`, `MAIL_PASSWORD`, and
  `CORS_ORIGINS=https://your-domain.com` (comma separate if several).
- In `contact.html` change `API_URL` to your deployed URL, e.g. `https://api.your-domain.com/api/contact`.
- Use HTTPS for both the site and the API.

## Built-in protections
Validation on every field, hidden honeypot field for bots, 5 messages / 10 min per IP (change in `application.properties`),
line-break stripping to prevent email header injection, CORS limited to your site.
