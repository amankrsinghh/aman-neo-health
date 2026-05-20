import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Building2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState("Jaipur, India");

  // const locations = ["English", "Delhi"];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light-box">
        <div className="container">
          <NavLink className="navbar-brand me-0" to="/">
            <div className="d-flex align-items-center gap-2">
              <div className="">
                <img src='/logo.png' />
              </div>

              {/* <div>
                <div className="hospital-brand "><h4 className='mb-0'> NeoHealthCard </h4></div>
                <div className="hospital-subtitle"><p className='mb-0'>Hospital Suite </p></div>
              </div> */}
            </div>
          </NavLink>

          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
            id="navbarSupportedContent" >

            <div className="mobile-close-btn d-lg-none">
              <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
            </div>

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0  gap-lg-2 gap-sm-0">
              <li className="nav-item">
                <Link to="/#platform" className="nav-link active" onClick={closeMenu}>
                  Platform
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#modules" onClick={closeMenu}>
                  Modules
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#security" onClick={closeMenu}>
                  Security
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#interop" onClick={closeMenu}>
                  Interoperability
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#deploy" onClick={closeMenu}>
                  Deployment
                </Link>
              </li>

            </ul>


            <div className="d-flex align-items-center gap-3 hospital-request-box">
              {localStorage.getItem('token') ?
                <Link to='/dashboard' className="hp-thm-btn">
                  Go To Dashboard  →
                </Link>
                :
                <Link to='/login' className="hp-thm-btn">
                  Join Free Now →
                </Link>}
            </div>
          </div>
        </div>
        {menuOpen && <div className="hp-mobile-overlay" onClick={closeMenu}></div>}
      </nav>
    </header>
  )
}

export default LandingHeader
