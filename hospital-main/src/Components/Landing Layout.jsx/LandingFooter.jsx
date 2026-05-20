import React, { useEffect, useState } from 'react'
import { FaHospital } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { getApiData } from '../../Service/api'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
        <footer className="footer-section">

            <div className="container">

                <div className="row footer-top">


                    <div className="col-lg-3">
                        <div className="footer-brand d-flex align-items-center">
                            <div className="footer-logo">
                                <img src='/logo.png' width={100} height={60} />
                            </div>

                        </div>


                        <p className="footer-desc">
                            A unified hospital operating platform inside NeoHealthCard — designed for global scale and real clinical workflows.
                        </p>

                        <div className="footer-tags">
                            <Link to={'/page/rbac'} className="footer-tag">RBAC</Link>
                            <Link to={'/page/consent'} className="footer-tag">Consent</Link>
                            <Link to={'/page/audit'} className="footer-tag">Audit</Link>
                            <Link to={'/page/fhir-hl7-dicom'} className="footer-tag">FHIR/HL7/DICOM</Link>
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


                    <div className="col-lg-9">
                        <div className="row footer-links">

                            <div className="col-sm-3">
                                <h6>Quick Links</h6>
                                <ul>
                                    <li><Link to="/#modules">Modules</Link></li>
                                    <li><Link to="/#security">Security</Link></li>
                                    <li><Link to="/#interop">Interoperability</Link></li>
                                    <li><Link to="/#deploy">Deployment</Link></li>
                                </ul>
                            </div>

                            <div className="col-sm-3">
                                <h6>Hospital Ops</h6>
                                <ul>
                                    <li> <Link to='/purchase-orders'> Purchase Orders</Link>  </li>
                                    <li> <Link to='/inventory-and-store'>Inventory & Store</Link>   </li>
                                    <li> <Link to='/ot-scheduling'>OT Scheduling</Link>   </li>
                                    <li> <Link to='/insurance-claim'>Insurance Claims</Link>   </li>
                                </ul>
                            </div>

                            <div className="col-sm-3">
                                <h6>Compliance</h6>
                                <ul>
                                    <li> <Link to="/privacy-policy">Privacy Policy</Link> </li>
                                    <li> <Link to="/term-condition">Terms of Service</Link> </li>
                                    <li> <Link to="/medical-disclaimer">Medical Disclaimer</Link> </li>
                                    <li> <Link to="/government-public-health">Governance & Compliance</Link> </li>
                                </ul>
                            </div>
                            <div className="col-sm-3">
                                <h6>Contact</h6>
                                <ul>
                                    <li>Contact : {socialLinks?.contactNumber}</li>
                                    <li>Email : {socialLinks?.email}</li>
                                    <li>Address : {socialLinks?.address}</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>


                <div className="footer-bottom d-md-flex justify-content-between align-items-center">

                    <div className="footer-copy">
                        <p>© 2026 NeoHealthCard Private Limited. All rights reserved.</p>
                    </div>

                    <div className="footer-badges">
                        <Link to={"/page/security-first"} className="badge-pill"> Security-first</Link>
                        <Link to={"/page/global-ready"} className="badge-pill"> Global-ready</Link>
                        <Link to={"/page/interoperable"} className="badge-pill"> Interoperable</Link>
                    </div>

                </div>

            </div>

        </footer>
    )
}

export default LandingFooter
