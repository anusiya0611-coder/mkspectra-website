// MK SPECTRA - contact form API (Vercel serverless function)
// Same behaviour as the Java backend: validation, honeypot, rate limit, email to MAIL_TO.
// Env vars (Vercel -> Settings -> Environment Variables): MAIL_USERNAME, MAIL_PASSWORD, optional MAIL_TO

const nodemailer = require("nodemailer");

const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map(); // ip -> array of timestamps (best-effort: resets when the function instance restarts)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[0-9 ()\-]{7,20}$/;

const oneLine = (s) => (s == null ? "" : String(s).replace(/[\r\n]+/g, " ").trim());
const orDash = (s) => oneLine(s) || "-";
const str = (v) => (v == null ? "" : String(v));

function allow(key) {
  const now = Date.now();
  const q = (hits.get(key) || []).filter((t) => now - t <= WINDOW_MS);
  if (q.length >= MAX_PER_WINDOW) {
    hits.set(key, q);
    return false;
  }
  q.push(now);
  hits.set(key, q);
  if (hits.size > 10000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
    }
  }
  return true;
}

function validate(b) {
  const name = str(b.name).trim();
  const email = str(b.email).trim();
  const phone = str(b.phone).trim();
  const service = str(b.service).trim();
  const message = str(b.message).trim();

  if (!name) return "Please enter your name.";
  if (name.length > 100) return "Name is too long.";
  if (!email || !EMAIL_RE.test(email)) return "Please enter a valid email.";
  if (email.length > 150) return "Email is too long.";
  if (!phone) return "Please enter your phone number.";
  if (!PHONE_RE.test(phone)) return "Please enter a valid phone number.";
  if (str(b.company).length > 150) return "Company name is too long.";
  if (!service) return "Please choose a service.";
  if (service.length > 100) return "Service is too long.";
  if (str(b.budget).length > 100) return "Budget value is too long.";
  if (!message) return "Please write a short message.";
  if (message.length > 3000) return "Message is too long (max 3000 characters).";
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Invalid request." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ message: "Invalid request." });
    }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ message: "Invalid request." });
  }

  const error = validate(body);
  if (error) return res.status(400).json({ message: error });

  // Honeypot filled => a bot. Pretend success, send nothing.
  if (str(body.website).trim()) {
    return res.status(200).json({ message: "Thank you! Your message has been sent." });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (!allow(ip)) {
    return res.status(429).json({ message: "Too many messages. Please try again in a few minutes." });
  }

  const to = process.env.MAIL_TO || "mkspectra27@gmail.com";
  const from = process.env.MAIL_USERNAME;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: from, pass: process.env.MAIL_PASSWORD },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: oneLine(body.email),
      subject: "New enquiry from MK SPECTRA website - " + oneLine(body.name),
      text:
        "You received a new enquiry from the website contact form.\n\n" +
        "Name    : " + oneLine(body.name) + "\n" +
        "Email   : " + oneLine(body.email) + "\n" +
        "Phone   : " + oneLine(body.phone) + "\n" +
        "Company : " + orDash(body.company) + "\n" +
        "Service : " + oneLine(body.service) + "\n" +
        "Budget  : " + orDash(body.budget) + "\n\n" +
        "Message :\n" + str(body.message).trim() + "\n",
    });

    return res.status(200).json({ message: "Thank you! Your message has been sent." });
  } catch (err) {
    console.error("Could not send enquiry email", err);
    return res
      .status(502)
      .json({ message: "Sorry, we could not send your message right now. Please email us directly." });
  }
};
