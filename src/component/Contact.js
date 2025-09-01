import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  can later connect this with backend/email service
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="main-content"
    >
      <h1 style={{ fontWeight: "700", fontSize: "2.2rem", marginBottom: "1.5rem" }}>
        Contact Us
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "0.3rem",
              border: "none",
              backgroundColor: "#1b2a2aff",
              color: "white",
            }}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "0.3rem",
              border: "none",
              backgroundColor: "#1b2a2aff",
              color: "white",
            }}
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "0.3rem",
              border: "none",
              backgroundColor: "#1b2a2aff",
              color: "white",
              resize: "none",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: "0.8rem",
              border: "none",
              borderRadius: "0.3rem",
              backgroundColor: "#3420e8ff",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Send Message
          </button>
        </form>
      ) : (
        <p style={{ textAlign: "center", color: "#d1d5db", marginTop: "2rem" }}>
          ✅ Thanks for contacting us! We'll get back to you soon.
        </p>
      )}
    </div>
  );
}

export default Contact;
