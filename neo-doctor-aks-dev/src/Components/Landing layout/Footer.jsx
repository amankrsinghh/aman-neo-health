import { useEffect, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { FiGlobe, FiMail, FiUsers } from "react-icons/fi";

import "../../assets/css/landingFooter.css"
import { Users } from "lucide-react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdKey } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { WiStars } from "react-icons/wi";
import { Link, NavLink } from "react-router-dom";
import { getApiData } from "../../Services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { GoLocation } from "react-icons/go";
function LandingFooter() {
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
  }, [])
  return (
    <footer className="ldp-footer-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div className="d-flex align-items-center mb-3 landing-footer-content">
              <NavLink to="/"><img src="/logo.png" alt="" width={100} height={60} /></NavLink>
              {/* <div>
                <h6>NeoHealthCard</h6>
                <p>Transforming healthcare with security, intelligence and care</p>
              </div> */}
            </div>

            <p className="footer-text">
              Build on consent.Secaured by audit trails.Powered by NeoAI
            </p>
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
            <div className="my-2">

            <p className="footer-text">Email :{socialLinks?.email}</p>
            <p className="footer-text">Address :{socialLinks?.address}</p>
            <p className="footer-text">Contact :{socialLinks?.contactNumber}</p>
            </div>

          </div>
          <div className="col-lg-3 col-md-6 col-sm-12  mb-4">
            <h5 className="dv-innr-title">For Doctors</h5>
            <ul className="footer-links">
              <li className="dv-footer-item"> <Link to="/doctor-app" className="dv-footer-nav-link">Doctor App</Link> </li>
              <li className="dv-footer-item"> <Link to="/verification-onboarding" className="dv-footer-nav-link">Verification & Onboarding</Link></li>
              <li className="dv-footer-item"> <Link to="/telemedicine" className="dv-footer-nav-link">Telemedicine</Link> </li>
              <li className="dv-footer-item"> <Link to="/clinic-tools" className="dv-footer-nav-link">Clinic Tools</Link> </li>
              <li className="dv-footer-item"> <Link to="/global-practice" className="dv-footer-nav-link">Global Practice</Link> </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <h5 className="dv-innr-title">Ecosystem</h5>
            <ul className="footer-links">
              <li className="dv-footer-item"> <NavLink to="/neoai" className="dv-footer-nav-link">NeoAI</NavLink> </li>
              {/* <li className="dv-footer-item"> <NavLink to="/neo-middleware" className="dv-footer-nav-link">Neo Middleware</NavLink> </li> */}
              {/* <li className="dv-footer-item"> <NavLink to="/neo-edge" className="dv-footer-nav-link">Neo Edge</NavLink> </li> */}
              <li className="dv-footer-item"> <NavLink to="/blockchain-security" className="dv-footer-nav-link">Blockchain Security</NavLink> </li>
              <li className="dv-footer-item"> <NavLink to="/emergency-network" className="dv-footer-nav-link">Emergency Network</NavLink> </li>
            </ul>


          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <h5 className="dv-innr-title">Trust &  Compliance</h5>
            <ul className="footer-links">
              <li className="dv-footer-item"> <NavLink to="/privacy-policy" className="dv-footer-nav-link">Privacy Policy</NavLink> </li>
              <li className="dv-footer-item"> <NavLink to="/term-condition" className="dv-footer-nav-link">Terms of Service</NavLink> </li>
              <li className="dv-footer-item"> <NavLink to="/medical-disclaimer" className="dv-footer-nav-link">Medical Disclaimer</NavLink> </li>
              {/* <li className="dv-footer-item"> <NavLink to="/digital-health" className="dv-footer-nav-link">Who Digital Health</NavLink> </li> */}
              <li className="dv-footer-item"> <NavLink to="/abdm-ready" className="dv-footer-nav-link">ABDM (india)</NavLink> </li>
            </ul>


          </div>
        </div>
        <div className="footer-bottom">
          <p className="new_para mb-0">© 2026 NeoHealthCard Private Limited. All rights reserved.</p>
          {/* <div className="footer-badges">
            <span className="badge-pill"> Audit-ready</span>
            <span className="badge-pill"> Consent-first  </span>
            <span className="badge-pill"> Clinician oversight</span>
          </div> */}
          <div className="">
            <ul className="footer-links d-flex gap-lg-3 gap-sm-1 dhc-footer">
              <li className="dv-footer-item py-0">  <NavLink to="/audit-ready" className="dv-footer-nav-link">Audit-ready</NavLink></li>
              <li className="dv-footer-item py-0"> <NavLink to="/consent-first" className="dv-footer-nav-link">Consent-first  </NavLink> </li>
              <li className="dv-footer-item py-0"> <NavLink to="/clinician-oversight" className="dv-footer-nav-link">Clinician oversight</NavLink> </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
