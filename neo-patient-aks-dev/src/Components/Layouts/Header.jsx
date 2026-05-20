
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Jaipur, India");

  const locations = ["Jaipur, India", "Delhi, India", "Mumbai, India"];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };


    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    // Mobile view no scroll
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [menuOpen]);

    const [isSticky, setIsSticky] = useState(false);
   useEffect(() => {
  const handleScroll = () => {
    setIsSticky(window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <>

    <header className={`tp-header-section ${isSticky ? "tp-header-sticky" : ""}`}>

      <nav className="navbar navbar-expand-lg navbar-light-box py-lg-0 py-2" ref={headerRef}>
        <div className="container">
          <NavLink className="navbar-brand me-0" to="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </NavLink>


          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon" />
          </button>


          <div
            className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="navbarSupportedContent"
          >

            <div className="mobile-close-btn d-lg-none">
              <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
            </div>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2 gap-sm-0">
  
  <li className="nav-item">
    <NavLink 
      to="/" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Home
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/new-doctor-details" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Doctors
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/find-pharmacy" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Pharmacy
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/find-hospital" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Hospitals
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/find-labs" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Labs
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/about-us" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      About
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink 
      to="/contact-us" 
      className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
      onClick={closeMenu}
    >
      Contact
    </NavLink>
  </li>

            </ul>


            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="dropdown mobile-auth-box">
                <a
                  href="#"
                  className="dropdown-toggle nw-address-btn"
                  data-bs-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <FontAwesomeIcon icon={faLocationDot} /> {selectedLocation}
                </a>

                <ul className="dropdown-menu dropdown-menu-end mt-2 nw-location-bx">
                  {locations.map((loc, index) => (
                    <li
                      key={index}
                      className="prescription-item"
                      onClick={() => setSelectedLocation(loc)}
                    >
                      <div className="prescription-nav d-flex justify-content-between align-items-center">
                        {loc}
                        {selectedLocation === loc && (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap mobile-auth-box">
                <Link to='/login' className="nw-thm-btn outline" onClick={closeMenu}>
                  <FaUser className="me-1" /> Login
                </Link>

                <Link to='/create-account' className="nw-thm-btn" onClick={closeMenu}>
                  Register Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>


      {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

    </header>

      
    </>
  );
};

export default Header;

