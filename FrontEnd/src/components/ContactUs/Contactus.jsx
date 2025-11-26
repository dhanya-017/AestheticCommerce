import React from "react";
import "./Contactus.css";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";

const ContactUs = () => (
  <div className="contact-main">
    <div className="contact-sidebar">
      <a href="mailto:consulting@businesscurative.com" target="_blank" rel="noopener noreferrer" className="icon-link">
        <MdEmail />
        <span className="tooltip-text">Mail to us</span>
      </a>
      <a href="https://wa.me/00000009009" target="_blank" rel="noopener noreferrer" className="icon-link">
        <FaWhatsapp />
        <span className="tooltip-text">Chat with us</span>
      </a>
      <a href="https://www.instagram.com/aestheticommerce/" target="_blank" rel="noopener noreferrer" className="icon-link">
        <FaInstagram />
        <span className="tooltip-text">Our Public Profile</span>
      </a>
      <a href="https://www.linkedin.com/company/aestheticommerce" target="_blank" rel="noopener noreferrer" className="icon-link">
        <FaLinkedin />
        <span className="tooltip-text">Our Official Profile</span>
      </a>
    </div>
    <div className="contact-container">
      <form className="contact-form">
        <h2>Contact Us</h2>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your name"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Enter your email"
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          placeholder="Type your message here"
        />

        <button type="submit">Send Message</button>
      </form>

    </div>
  </div>
);

export default ContactUs;