import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn } from "react-icons/fa";
import "../../assets/css/PharmacyLogin.css";
import logo from "../../assets/img/logo.png";
import footergoogleplayicon from "../../assets/img/footer-google-play-icon.png";
import footerappstoreicon from "../../assets/img/footer-app-store-icon.png";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container py-5">
        <div className="row">

          {/* LEFT SECTION */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="" className="footer-logo" />
            </div>

            <p className="footer-text">
              Lorem ipsum is a dummy or placeholder text commonly used in graphic design,
              publishing, and web development.
            </p>

            <div className="d-flex gap-2 mt-3 mb-4">

<a href="#">  <img src={footergoogleplayicon} alt="Google Play" className="store-btn" />
</a>
<a href="#">              <img src={footerappstoreicon} alt="App Store" className="store-btn" />
</a>
            </div>

            <div className="footer-social mt-3">
              <FaFacebookF />
              <FaInstagram />
              <FaYoutube />
              <FaTiktok />
              <FaLinkedinIn />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Quick Link</h5>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Find a Doctor</li>
              <li>Hospital</li>
              <li>Lab</li>
              <li>Faq</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* CATEGORY */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Category</h5>
            <ul className="footer-links">
              <li>Cardiologist</li>
              <li>Pulmonologist</li>
              <li>Dentistry</li>
              <li>General</li>
              <li>Pulmonologist</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Contact</h5>

           <a className="footer-contact" href="tel:+919876543210">
  <FaPhoneAlt /> +91-9876543210
</a>
 <a className="footer-contact" href="mailto:neohealthcard@gmail.com">
  <i className="far fa-envelope"></i> neohealthcard@gmail.com
</a>

            <p className="footer-contact-box footer-contact">
              <FaMapMarkerAlt /> 10–E, Malviya Industrial Area, Jaipur 302017
            </p>
          </div>
        </div>

        <hr  />

        <div className="d-flex justify-content-between footer-bottom">
          <p>© 2024 NeoHealthCard. All rights reserved.</p>
          <div className="d-flex gap-4">
  <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
  <a href="/terms-of-service" className="footer-link">Terms of Service</a>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
