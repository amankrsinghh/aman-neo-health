import React from "react";
import "../../assets/css/PharmacyLogin.css";
import logo from "../../assets/img/logo.png";
import { FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light-box ">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" className="logo-img" />
        </a>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Doctors
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={'/find-hospital'}>
                Hospitals
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Labs
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center flex-wrap gap-4">

            {/* Location Dropdown */}
            <div class="dropdown">
              <button class=" dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-map-marker me-1"></i>
                Jaipur, India  </button>
              <ul class="dropdown-menu ">
                <li><a class="dropdown-item active" href="#">Jaipur, India </a></li>
                <li><a class="dropdown-item" href="#">Jaipur, India </a></li>

              </ul>
            </div>

            {/* Login / Register */}
            <div className="d-flex align-items-center  gap-3">
              <a href="#" className="text-decoration-none  horizontal">
                <FaUser className="me-1" /> Login
              </a>

              <a href="#" className="text-decoration-none horizontal-box ">
                Register Here
              </a>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
