import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Building2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <header className="neo-header sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light-box " >
        <div className="container">
          <NavLink className="navbar-brand me-0" to="/">
            <div className="neo-landing-header">
              <div className="neo-landing-box">
                <img src="/logo.png" alt="" />
              </div>
              {/* <div className="neo-title">
                <h5>NeoHealthCard Pharma</h5>
                <h6>Pharmacy Console</h6>

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
                <Link className="nav-link" to="/#modules" onClick={closeMenu}>
                  Modules
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#workflow" onClick={closeMenu}>
                  Workflow
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#roles" onClick={closeMenu}>
                  Roles
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#security" onClick={closeMenu}>
                  Security
                </Link>
              </li>

            </ul>


            <div className=" neo-pharma-btn">
              {localStorage.getItem('token')?
              <Link to={'/dashboard'} className="ph-thm-btn">Go To Dashboard  →</Link>
              :<Link to={'/login'} className="ph-thm-btn">Join Free Now →</Link>}
            </div>
          </div>
        </div>
        {menuOpen && <div className="ph-mobile-overlay" onClick={closeMenu}></div>}
      </nav>
    </header>
  )
}

export default LandingHeader
