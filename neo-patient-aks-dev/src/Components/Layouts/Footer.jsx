
import { FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { getApiData } from "../../Services/api";
import { useEffect, useState } from "react";
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function Footer() {
  const [socialLinks, setSocilLinks] = useState([])
  async function fetchSocialLink() {
    try {
      const res = await getApiData('api/social-links')
      if (res.success) {
        setSocilLinks(res.data)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchSocialLink()
    fetchData()
  }, [])
  const [footerCat, setFooterCat] = useState([])
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/patient");
      if (res.success) {
        setFooterCat(res?.data?.firstSection?.category);
      }


    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  return (
    <>
      <footer className="footer-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="d-flex align-items-center mb-3">
                <a href="javascript:void(0)"><img src="/logo.png" alt="" width={100} height={60} /></a>
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
                <a href={socialLinks?.facebook} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>

                <a href={socialLinks?.instagram} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>

                <a href={socialLinks?.youtube} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>

                <a href={socialLinks?.twitter} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>

                <a href={socialLinks?.linkedin} className="dv-social-icon-btn" target="_blank">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-12  mb-4">
              <h5 className="innr-title">Quick Link</h5>
              <ul className="footer-links">
                <li className="footer-item"> <a href="https://laboratory.neohealthcard.com" target="_blank" className="dropdown-item footer-nav">Laboratory</a></li>
                <li className="footer-item"> <a href="https://pharmacy.neohealthcard.com" target="_blank" className="dropdown-item footer-nav">Pharmacy</a> </li>
                <li className="footer-item"> <a href="https://hospitals.neohealthcard.com" target="_blank" className="dropdown-item footer-nav">Hospital</a> </li>
                <li className="footer-item"> <a href="https://doctor.neohealthcard.com/login" target="_blank" className="dropdown-item footer-nav">Doctor</a> </li>
                {/* <li className="footer-item"> <NavLink to="/about-us" className="footer-nav-link">About Us</NavLink></li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Find a Doctor</NavLink> </li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Hospital</NavLink> </li>
                <li className="footer-item"> <NavLink to="/" className="footer-nav-link">Lab</NavLink> </li>
                <li className="footer-item"> <NavLink to="/faq" className="footer-nav-link">Faq</NavLink> </li>
                <li className="footer-item"> <NavLink to="/blogs" className="footer-nav-link">Blog</NavLink> </li>
                <li className="footer-item"> <NavLink to="/contact-us" className="footer-nav-link">Contact Us</NavLink> </li> */}
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-12 mb-4">
              <h5 className="innr-title">Category</h5>
              <ul className="footer-links">
                {footerCat?.map(f => {
                  let path = "";

                  if (f.panel === "hospital") {
                    path = `/hospital/${f.label}/${f.value}`;
                  } else if (f.panel === "lab") {
                    path = `/labs/${f.label}/${f.value}`;
                  } else if (f.panel === "pharmacy") {
                    path = `/pharmacy/${f.label}/${f.value}`;
                  } else if (f.panel === "doctor") {
                    path = `/doctor/${f.label}/${f.value}`;
                  }

                  return (
                    <li className="footer-item" key={f.value}>
                      <Link to={path} className="footer-nav-link">
                        {f.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 mb-4">
              <h5 className="innr-title">Governance & Compliance</h5>
              <ul className="footer-links">
                <li className="dv-footer-item"> <NavLink to="/page/clinical-safety-statement" className="dv-footer-nav-link">Clinical Safety statement</NavLink> </li>
                <li className="dv-footer-item"> <NavLink to="/page/medical-disclaimer" className="dv-footer-nav-link">Medical disclaimer</NavLink> </li>
                {/* <li className="dv-footer-item"> <NavLink to="/page/privacy-policy" className="dv-footer-nav-link">Privacy & data protection</NavLink> </li> */}
                <li className="dv-footer-item"> <NavLink to="/page/access-modal" className="dv-footer-nav-link">Consent & access model</NavLink> </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <h5 className="innr-title">Contact</h5>
              <ul className="footer-links">
                <li className="footer-item"> <a className="footer-contact" href="tel:+919876543210">
                  <FaPhoneAlt /> {socialLinks?.contactNumber}
                </a></li>

                <li className="footer-item"><a className="footer-contact" href={`mailto:${socialLinks?.email}`}>
                  <i className="far fa-envelope"></i> {socialLinks?.email} </a>
                </li>
                <li className="footer-item">
                  <p className="footer-contact-box footer-contact">
                    <FaMapMarkerAlt className="fz-22" /> {socialLinks?.address}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="new_para mb-0">© 2026 NeoHealthCard Private Limited. All rights reserved.</p>
            <div className="">
              <ul className="footer-links d-flex gap-3">
                <li className="footer-item py-0">  <Link to='/privacy-policy' className="footer-nav-link">Privacy Policy</Link></li>
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



