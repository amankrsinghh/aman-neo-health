import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { getApiData } from "../../Services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <footer className="neo-footer">
      <div className="container">

        <div className="row neo-footer-top">

          <div className="col-md-3">
            <div className="neo-footer-title">
              <img src="logo.png" width={100} alt="" />
            </div>
            <div className="neo-footer-text">
              <ul className="neo-btm-footer-list">
                <li className="ph-btn-item"><Link to="/page/billing-to-patient-wallet" className="ph-btm-item">Billing to patient wallet</Link></li>
                <li className="ph-btn-item"><Link to="/page/po-grn" className="ph-btm-item">PO/GRN</Link></li>
                <li className="ph-btn-item"><Link to="/page/inventory-fefo" className="ph-btm-item">Inventory FEFO</Link></li>
                <li className="ph-btn-item"><Link to="/page/scheduling" className="ph-btm-item">Scheduling</Link></li>
                <li className="ph-btn-item"><Link to="/access-control" className="ph-btm-item">Roles</Link></li>
                <li className="ph-btn-item"><Link to="/audit-log" className="ph-btm-item">Audit</Link></li>
              </ul>

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
          <div className="col-md-2">
            <div className="neo-footer-heading"><h6>Product</h6></div>
            <ul className="ph-landing-footer">
              <li> <Link to="/#modules" className="neo-footer-link">Modules</Link></li>
              <li><Link to="/#workflow" className="neo-footer-link">Workflow</Link></li>
              <li><Link to="/#roles" className="neo-footer-link">Roles</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <div className="neo-footer-heading"><h6>Security</h6></div>
            <ul className="ph-landing-footer">
              <li><Link to="/#ecosystem" className="neo-footer-link">Security overview</Link></li>
              <li><Link to="/audit-log" className="neo-footer-link">Audit logs</Link></li>
              <li><Link to="/access-control" className="neo-footer-link">Access control</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <div className="neo-footer-heading"><h6>Legal</h6></div>
            <ul className="ph-landing-footer">
              <li><Link to="/privacy-policy" className="neo-footer-link">Privacy Policy</Link></li>
              <li><Link to="/term-condition" className="neo-footer-link">Terms of Service</Link></li>
              <li><Link to="/medical-disclaimer" className="neo-footer-link">Medical Disclaimer</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <div className="neo-footer-heading"><h6>Contact</h6></div>
            <ul className="ph-landing-footer">
              <li>Contact : {socialLinks?.contactNumber}</li>
              <li>Email : {socialLinks?.email}</li>
              <li>Address : {socialLinks?.address}</li>
            </ul>
          </div>

        </div>

        <div className="neo-footer-bottom">

          <div className="neo-footer-copy">
            <p> © {new Date().getFullYear()} NeoHealthCard Private Limited</p>
          </div>

          <div className="neo-footer-note">
            <span className="neo-footer-dot"></span>
            <p> Bills delivered to patient NeoHealthCard wallet after dispensing.</p>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default LandingFooter
