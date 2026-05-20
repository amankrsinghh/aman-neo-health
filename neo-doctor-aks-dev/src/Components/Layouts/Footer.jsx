
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";



function Footer() {
  return (
    <>
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 mb-4">
              <div className="d-flex align-items-center mb-3">
                <a href="javascript:void(0)"><img src="/logo.png" alt="" className="footer-logo" /></a>
              </div>

              <p className="footer-text new_para">
                Lorem ipsum is a dummy or placeholder text commonly used in graphic design,
                publishing, and web development.
              </p>

              <div className="d-flex gap-2 mt-3 mb-4">

                <a href="#">  <img src="/footer-app-store-icon.png" alt="Google Play" className="store-btn" />
                </a>
                <a href="#"> <img src="/footer-google-play-icon.png" alt="App Store" className="store-btn" />
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

            <div className="col-lg-2 col-md-2 col-sm-12  mb-4">
              <h5 className="innr-title">Quick Link</h5>
              <ul className="footer-links">
                <li className="footer-item"> <NavLink to="/about-us" className="footer-nav-link">About Us</NavLink></li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Find a Doctor</NavLink> </li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Hospital</NavLink> </li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Lab</NavLink> </li>
                <li className="footer-item"> <NavLink to="/faq" className="footer-nav-link">Faq</NavLink> </li>
                <li className="footer-item"> <NavLink to="/blogs" className="footer-nav-link">Blog</NavLink> </li>
                <li className="footer-item"> <NavLink to="/contact-us" className="footer-nav-link">Contact Us</NavLink> </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-2 col-sm-12 mb-4">
              <h5 className="innr-title">Category</h5>
              <ul className="footer-links">
                <li className="footer-item"> <a href="javascript:void(0)" className="footer-nav-link">Cardiologist</a> </li>
                <li className="footer-item"> <a href="javascript:void(0)" className="footer-nav-link">Pulmonologist</a> </li>
                <li className="footer-item"> <a href="javascript:void(0)" className="footer-nav-link">Dentistry</a> </li>
                <li className="footer-item"> <a href="javascript:void(0)" className="footer-nav-link">General</a> </li>
                <li className="footer-item"> <a href="javascript:void(0)" className="footer-nav-link">Pulmonologist</a> </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12 mb-4">
              <h5 className="innr-title">Contact</h5>
              <ul className="footer-links">
                <li className="footer-item"> <a className="footer-contact" href="tel:+919876543210">
                  <FaPhoneAlt /> +91-9876543210
                </a></li>

                <li className="footer-item"><a className="footer-contact" href="mailto:neohealthcard@gmail.com">
                  <i className="far fa-envelope"></i> neohealthcard@gmail.com </a>
                </li>
                <li className="footer-item">
                  <p className="footer-contact-box footer-contact">
                    <FaMapMarkerAlt className="fz-22" /> 10-E, Malviya Industrial Area, Jaipur 302017
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="new_para mb-0">© 2024 NeoHealthCard. All rights reserved.</p>
            <div className="">
              <ul className="footer-links d-flex gap-3">
                <li className="footer-item py-0">  <Link to='/privacy-policy'  className="footer-nav-link">Privacy Policy</Link></li>
                <li className="footer-item py-0"> <Link to="/term-condition" className="footer-nav-link">Terms of Service</Link> </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer



