import React, { useEffect, } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { PiGlobe } from "react-icons/pi";
import { GoLocation } from "react-icons/go";
import { faLock, } from "@fortawesome/free-solid-svg-icons"
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { IoLayersSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa6";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FiDatabase } from "react-icons/fi";
import { MdOutlineWifiOff } from "react-icons/md";
import { TbAlertHexagon, TbFileCheck } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { PiStarFourBold } from "react-icons/pi";
import { CiCircleCheck, CiHospital1 } from "react-icons/ci";
import { PiTestTubeFill } from "react-icons/pi";
import { RiCapsuleLine } from "react-icons/ri";
// import { FaHeartPulse } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { HiChip } from "react-icons/hi";
import { BsToggles } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { LuHeartPulse } from "react-icons/lu";
import { PiTestTubeLight } from "react-icons/pi";
import { IoLayersOutline } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";
import "../Landing/landing.css"
import "../Landing/responsive.css"


function Landing() {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }, []);





    return (
        <>
            {/* <nav className="navbar navbar-expand-lg dv-navbar-light-box">
                <div className="container">
                    <NavLink className="navbar-brand me-0" to="/">
                        <img src="/logo.png" alt="Logo" className="logo-img" />
                    </NavLink>
                    <button className="navbar-toggler" type="button" onClick={toggleMenu}>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
                        id="navbarDvSupportedContent" >

                        <div className="mobile-close-btn d-lg-none">
                            <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
                        </div>

                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0  gap-lg-2 gap-sm-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link active" onClick={closeMenu}>
                                    Home
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={closeMenu}>
                                    Ecosystem
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={closeMenu}>
                                    Modules
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={closeMenu}>
                                    Security
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={closeMenu}>
                                    For institutions
                                </a>
                            </li>



                            <div className="dropdown">
                                <a
                                    href="#"
                                    className="dropdown-toggle nw-address-btn d-flex align-items-center gap-1"
                                    data-bs-toggle="dropdown"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <span className="globe-emoji lh-1">
                                        <PiGlobe size={17} />

                                    </span>
                                    {selectedLanguage.label}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end mt-2 nw-location-bx">
                                    {languages.map((lang, index) => (
                                        <li
                                            key={index}
                                            className="prescription-item"
                                            onClick={() => setSelectedLanguage(lang)}
                                        >
                                            <div className="prescription-nav d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2">

                                                    {lang.label}
                                                </div>

                                                {selectedLanguage.code === lang.code && (
                                                    <FontAwesomeIcon icon={faCheck} />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>




                        </ul>


                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <a href="#" className="landing-thm-btn" onClick={closeMenu}>
                                    Create Now <FontAwesomeIcon icon={faArrowRight} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {menuOpen && <div className="dv-mobile-overlay" onClick={closeMenu}></div>}
            </nav> */}


            <section className="dv-home-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <div className="hospital-global-bx " data-aos="fade-up" data-aos-delay="50">
                                <ul className="hospital-global-list">
                                    <li className="hospital-global-item"> <span className="health-icon"><GoGlobe /></span> Global health ID</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><PiStarFourBold /></span> NeoAI</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><VscWorkspaceTrusted /></span> Audit Trail</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><FaRoute /></span> WHO-aligned clinical work flow</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><TbFileCheck /></span> ABDM-ready interoperability</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><TbLock /></span> Consent-first sharing</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><VscWorkspaceTrusted /></span> Tamper-evident audit trail</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><BsToggles /></span> NeoMiddleware ingestion layer</li>
                                    <li className="hospital-global-item"> <span className="health-icon"><HiChip /></span> NeoEdge on-prem connectivity</li>
                                </ul>
                            </div>

                            <div className="hospital-trasnport-content" data-aos="fade-up" data-aos-delay="50">
                                <h5 >TRANSFORMING HEALTHCARE WITH SECURITY, INTELLIGENCE, AND CARE</h5>
                            </div>

                            <div className="global-title">
                                <h2 data-aos="fade-up" data-aos-delay="50">A global health <br /> operating system for <br />  real life.</h2>
                            </div>

                            <div className="medical-record-title">
                                <p data-aos="fade-up">One lifetime medical record that travels across hospitals borders - preserving medical truth with consent, Clinical governance, and a tamper-evident audit trail.</p>
                            </div>

                            <div className="d-flex align-items-center gap-3 hp-create-bx" data-aos="fade-up" data-aos-delay="50">
                                <Link to='/select-account-type' type="button" className="landing-thm-btn">Create NeoHealthCard <FontAwesomeIcon icon={faArrowRight} /> </Link>
                                <button type="button" className="landing-thm-btn outline">Institutional Demo <FontAwesomeIcon icon={faArrowRight} /> </button>
                            </div>


                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 my-auto">
                            <div className="hero-right" data-aos="fade-up" data-aos-delay="50">
                                <div className="orbit">
                                    <div className="orbit-ring"></div>
                                    <span className="label top"> <FaUserDoctor className="patient-icon" /> Doctor</span>
                                    <span className="label right"> <CiHospital1 className="patient-icon" />  Hospital</span>
                                    <span className="label bottom-right"> <PiTestTubeLight className="patient-icon" /> Labs</span>
                                    <span className="label bottom"> <RiCapsuleLine className="patient-icon" /> Pharmacy</span>
                                    <span className="label bottom-left"> <FiUsers className="patient-icon" />  Patients</span>
                                    <span className="label left"> <PiStarFourBold className="capture-icon" /> NeoAI</span>


                                    <div className="center-card">
                                        <h4>NEOHEALTHCARD ID</h4>
                                        <h3>One record. One truth. Anywhere.</h3>
                                        <p>
                                            Lifetime clinical history with consented
                                            sharing and an audit trail.
                                        </p>
                                        <a href="javascript:void(0)" className="chip"> <VscWorkspaceTrusted /> Audit Trail</a>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            <section className="one-living-section" >
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading">
                            <span className="built-title">Everything connected</span>
                            <h5 data-aos="fade-up" data-aos-delay="50" >One living health ecosystem</h5>
                            <p></p>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <FiUsers className="patient-icon" /> Patients & families</h5>
                                <p>One NeoHealthCard ID for lifetime history, vaccinations, chronic follow-up and emergency view — with patient-controlled sharing.</p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <FaUserDoctor className="patient-icon" /> Doctors</h5>
                                <p>Structured history, AI summaries and interaction checks — reduce repetition and paperwork so clinicians focus on care.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <CiHospital1 className="patient-icon" /> Hospitals</h5>
                                <p>OPD, IPD and ER linked into one verifiable record — fewer duplicate tests and fewer missing notes.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <PiTestTubeLight className="patient-icon" /> Labs</h5>
                                <p>Digital orders and instant results back to the same record — traceable, tamper-evident and shareable in seconds.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <RiCapsuleLine className="patient-icon" /> Pharmacies</h5>
                                <p>Fraud-resistant e-prescriptions, NeoQR/QR verification and audit-ready dispensing.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3  aos-init aos-animate" data-aos="fade-up" data-aos-delay="50" >
                            <div className="patient-family-bx">
                                <h5> <LuHeartPulse className="patient-icon" /> Payers & programs</h5>
                                <p>Structured, consented data for insurers and public programs — faster claims, fewer disputes, better population insight.</p>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            <section className="dv-how-it-work-section">
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-3">
                            <span className="built-title">How it works</span>
                            <h5 data-aos="fade-up" data-aos-delay="50" >Clinical events become structured, verifiable blocks</h5>
                            <p data-aos="fade-up"  >Four primitives turn fragmented care into one trusted record.</p>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50" >
                            <div className="capture-bx">
                                <div className="capture-content">
                                    <div>
                                        <h5><TbFileCheck className="capture-icon" /> Capture</h5>
                                    </div>

                                    <div>
                                        <span className="capture-count-title">01</span>
                                    </div>
                                </div>

                                <p>Consultations,labs,prescriptions and discharge notes become structured clinical events.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50" >
                            <div className="capture-bx">
                                <div className="capture-content">
                                    <div>
                                        <h5><VscWorkspaceTrusted className="capture-icon" /> Verify</h5>
                                    </div>

                                    <div>
                                        <span className="capture-count-title">02</span>
                                    </div>
                                </div>

                                <p>Every update is tamper-evident,time-stamped,and audit-ready.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50" >
                            <div className="capture-bx">
                                <div className="capture-content">
                                    <div>
                                        <h5><TbLock className="capture-icon" /> Consent</h5>
                                    </div>

                                    <div>
                                        <span className="capture-count-title">03</span>
                                    </div>
                                </div>

                                <p>Patients control who sees what; emergency mode revels only essential, life-saving data.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50" >
                            <div className="capture-bx">
                                <div className="capture-content">
                                    <div>
                                        <h5><PiStarFourBold className="capture-icon" /> Assist</h5>
                                    </div>

                                    <div>
                                        <span className="capture-count-title">04</span>
                                    </div>
                                </div>

                                <p>NeoAI drafts summaries and flags risk-clinicians remain in command.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="eco-system-section">
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-4">
                            <span className="built-title">Ecosystem</span>
                            <h5 data-aos="fade-up" data-aos-delay="50" >One ecosystem.End to end</h5>
                            <p data-aos="fade-up" >NeoEdge connects healthcare where it happens NeoMiddleware makes data interoper able.NeoHealthCard <br /> delivers unified experiences across patients and providers</p>

                            <ul className="neo-middle-ware-list" data-aos="fade-up" >
                                <li className="neo-middle-item">Edge</li>
                                <li className="neo-middle-item">Interoperability</li>
                                <li className="neo-middle-item">Unified record</li>
                                <li className="neo-middle-item">Deployable</li>
                                <li className="neo-middle-item">AI-first</li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50" >
                            <div className="eco-system-card">
                                <h6>AI WORKLOADS</h6>

                                <h4>NeoAI -ready data flow</h4>

                                <p>Structured records designed for clinical-grade  AI and analytics</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="eco-system-card">
                                <h6>EDGE INFERENCE</h6>

                                <h4>Low-latency, on site decisions</h4>

                                <p>Privacy-preserving intelligence where care  happens.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="eco-system-card">
                                <h6>ACCELERATION</h6>

                                <h4>GPU-ready roadmap</h4>

                                <p>Designed to benefit from hardware acceleration for AI pipelines.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="health-care-card">
                                <div className="standardize-bx">
                                    <span className="standardize-title"><FaRoute /></span>
                                    <div>
                                        <h5>NeoEdge</h5>
                                        <p className="mb-0">On-site connectivity</p>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <p>On-site connectivity for  hospitals and devices.</p>
                                </div>

                                <ul className="neo-middle-ware-list">
                                    <li className="neo-middle-item">Connect device</li>
                                    <li className="neo-middle-item">Buffer Securely</li>
                                    <li className="neo-middle-item">Sync reliable</li>

                                </ul>

                            </div>
                        </div>

                        {/* <div className="">
                            <span className="ecoedge-right-icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                        </div> */}

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="health-care-card">
                                <div className="standardize-bx">
                                    <span className="standardize-title"><IoLayersOutline /></span>
                                    <div>
                                        <h5>NeoMiddleware</h5>
                                        <p className="mb-0">Interoperability engine</p>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <p>The interoperability engine behind the ecosystem</p>
                                </div>

                                <ul className="neo-middle-ware-list">
                                    <li className="neo-middle-item">Connect device</li>
                                    <li className="neo-middle-item">Buffer Securely</li>
                                    <li className="neo-middle-item">Sync reliable</li>

                                </ul>

                            </div>
                        </div>

                        {/* <div className="">
                            <span className="ecoedge-right-icon"><FontAwesomeIcon icon={faArrowRight} /></span>
                        </div> */}

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="health-care-card">
                                <div className="standardize-bx">
                                    <span className="standardize-title"><CiCreditCard1 /></span>
                                    <div>
                                        <h5>NeoHealthCard</h5>
                                        <p className="mb-0">Unified care experience</p>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <p>The unified patient and provider experience.</p>
                                </div>

                                <ul className="neo-middle-ware-list">
                                    <li className="neo-middle-item">Connect device</li>
                                    <li className="neo-middle-item">Buffer Securely</li>
                                    <li className="neo-middle-item">Sync reliable</li>

                                </ul>

                            </div>
                        </div>
                    </div>







                    <div className="built-platform-bx" data-aos="fade-up" data-aos-delay="50">
                        <div className="row">
                            <div className="col-lg-9 co-md-6 col-sm-12 mb-3">
                                <div className="architecture-bx">
                                    <h6>ARCHITECTURE OVERVIEW</h6>

                                    <h5>AI-first healthcare infrastructure stack</h5>

                                    <p>NeoEdge captures data at the source. NeoMiddleware standardizes and routes it. NeoHealthCard exposes unified clinical workflows for applications,analytics and NeoAI</p>

                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-12">
                                <ul className="neo-middle-ware-list">
                                    <li className="neo-middle-item">AI-first</li>
                                    <li className="neo-middle-item">Edge + Cloud</li>
                                    <li className="neo-middle-item">Interoperability</li>
                                    <li className="neo-middle-item">Scalable</li>

                                </ul>
                            </div>

                        </div>
                    </div>


                </div>
            </section>

            <section className="neo-edge-section">
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-4">
                            <span className="built-title">NEOEDGE</span>
                            <h5 data-aos="fade-up" data-aos-delay="50">Healthcare,at the edge</h5>
                            <p data-aos="fade-up" >Connect devices.Keep data safe.Sync when ready.</p>

                            <ul className="neo-middle-ware-list" data-aos="fade-up" data-aos-delay="50">
                                <li className="neo-middle-item">Edge</li>
                                <li className="neo-middle-item">Interoperability</li>
                                <li className="neo-middle-item">Unified record</li>
                                <li className="neo-middle-item">Deployable</li>
                                <li className="neo-middle-item">AI-first</li>
                            </ul>

                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="neo-middle-ware-card">
                                <div>
                                    <h6>ARCHITECTURE OVERVIEW</h6>
                                    <h5>AI-first healthcare infrastructure stack</h5>
                                    <p>NeoEdge operates inside facilities to captures data at the source. it keeps workflows running through outages,stores securely on-site, and syncs reliably to the NeoHealthCard ecosystem.</p>
                                </div>

                                <div>
                                    <span className="neo-middle-btm-title">NeoEdge brings the ecosystem on-site.</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8 col-sm-12" data-aos="fade-up" data-aos-delay="50">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><FaRoute /></span>
                                            <h5>Capture at the source</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Connect directly to systems and devices where care is delivered</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><MdOutlineWifiOff /></span>
                                            <h5>Offline-first</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Continue operations during connectivity loss.Sync automatically when restored.</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><VscWorkspaceTrusted /></span>
                                            <h5>Secure by design</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Encrypted storage, authenticated endpoints, and controlled access.</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><FiDatabase /></span>
                                            <h5>Reliable buffering</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Protect against dropped messages and data loss with edge persistence.</p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>



                    </div>
                </div>
            </section>

            <section className="neo-middle-ware-section">
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-4">
                            <span className="built-title">NEOMIDDLEWARE</span>
                            <h5 data-aos="fade-up" data-aos-delay="50">Make every system speak healthcare.</h5>
                            <p data-aos="fade-up" >HL7 in. DICOM in. Structured records out.</p>

                            <ul className="neo-middle-ware-list" data-aos="fade-up" data-aos-delay="50">
                                <li className="neo-middle-item">HL7</li>
                                <li className="neo-middle-item">FHIR posture</li>
                                <li className="neo-middle-item">DICOM metadata</li>
                                <li className="neo-middle-item">Validation</li>
                                <li className="neo-middle-item">Normalization</li>
                            </ul>

                        </div>

                        <div className="col-lg-4 col-md-4 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="neo-middle-ware-card">
                                <div>
                                    <h6>OVERVIEW</h6>
                                    <h5>Interoperability you can deploy</h5>
                                    <p>NeoMiddleware validates, normalizes, and routes clinical data into unified records-so every participant in the ecosystem can trust what they receive and act on it safety.</p>
                                </div>

                                <div>
                                    <span className="neo-middle-btm-title">NeoMiddleware turns raw data into usable care</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-8 col-sm-12" >
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><IoLayersOutline /></span>
                                            <h5>Standardize</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Transform fragmented inputs into consistent, structured clinical records.</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><FaRoute /></span>
                                            <h5>Route securely</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Deliver the right data to the right tenant, service and workflow.</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><VscWorkspaceTrusted /></span>
                                            <h5>Trust the output</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Validation-first pipelines built for clinical-grade reliability.</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                                    <div className="health-care-card">
                                        <div className="standardize-bx">
                                            <span className="standardize-title"><FiDatabase /></span>
                                            <h5>AI-ready flows</h5>
                                        </div>

                                        <div className="mt-4">
                                            <p>Structured data streams designed for analytics, automation, and NeoAI.</p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>



                    </div>
                </div>
            </section>

            <section className="product-module-section">
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-3">
                            <span className="built-title">Product modules</span>
                            <h5 data-aos="fade-up" data-aos-delay="50">One platform. Six experiences.</h5>

                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title "><span className="no-add-icon"></span> Patient App</h5>

                                <h6>Patients  App</h6>

                                <p>Lifetime digital health record, NeoAI guidance, nearest verified care and vaccination vault — free forever.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> NeoAI</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Audit trail</li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title "><span className="no-add-icon"></span> Doctor App</h5>

                                <h6>Doctor App</h6>

                                <p>Complete history at first glance, AI-assisted decisions, e-prescriptions and telemedicine — free for doctors.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> NeoAI</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Audit trail</li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title "><span className="no-add-icon"></span> Pharmacies Panel</h5>

                                <h6>Pharmacies Panel</h6>

                                <p>AI-driven inventory, QR/NeoQR traceability, and e-prescription fulfilment from any NeoHealthCard.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> NeoAI</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Audit trail</li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title "><span className="no-add-icon"></span> Labs Panel</h5>

                                <h6>Labs Panel</h6>

                                <p>Advanced lab workflows with smart labels, digital reports and instant sharing to patients and doctors.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> NeoAI</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Audit trail</li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title"><span className="no-add-icon"></span> Hospitals Panel</h5>

                                <h6>Hospitals Panel</h6>

                                <p>OPD, IPD, ER + pharmacy + lab in one smooth, WHO-aligned flow built for Indian hospitals.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> NeoAI</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Audit trail</li>

                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="product-modules-bx">
                                <h5 className="patient-title"><span className="no-add-icon"></span> NeoAI Intelligence Layer</h5>

                                <h6>NeoAI</h6>

                                <p>The intelligence layer connecting everyone — checking interactions, summarising visits and guarding consent.</p>

                                <ul className="doctor-list">
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Explainable</li>
                                    <li className="doctor-items"> <span className="no-add-icon"></span> Logged</li>

                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="built-platform-bx" data-aos="fade-up" data-aos-delay="50">
                        <div className="row">
                            <h4 className="dv-innr-title">Built-in platform layer</h4>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <TbLock className="secure-built-icon" /> Consent & access control</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <CiCircleCheck className="secure-built-icon" />Identify verification</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <HiOutlineShieldCheck className="secure-built-icon" /> Audit trail</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <IoLayersOutline icon={faLock} className="secure-built-icon" /> Interoperability layer</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <TbAlertHexagon className="secure-built-icon" /> Emergency view</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <div className="secure-built-bx">
                                    <div className="secure-built-content">
                                        <h4> <PiStarFourBold className="secure-built-icon" /> NeoAI governance</h4>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="why-it-exsits-section" >
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-3">
                            <span className="built-title">WHY IT EXISTS</span>
                            <h5 data-aos="fade-up" data-aos-delay="50">Before vs with NeoHealthCard</h5>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="security-bx why-it-exist-content">

                                <h3> <span className="before-neo"></span> Before Neohealthcard</h3>

                                <ul className="security-list">
                                    <li className="security-item">Paper files and PDFs across different hospitals and labs</li>
                                    <li className="security-item">Patients repeating history and medicines at every visit</li>
                                    <li className="security-item">Doctors working with incomplete data</li>
                                    <li className="security-item">Emergency teams guessing without past records</li>
                                    <li className="security-item">No single view for chronic conditions like diabetes or heart disease</li>
                                </ul>

                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="security-bx why-it-exist-content">
                                <h3> <span className="after-neo"></span> With NeoHealthCard</h3>
                                <ul className="security-list">
                                    <li className="security-item">One lifetime record, secured by blockchain and accessible with consent.</li>
                                    <li className="security-item">Doctors see structured history, labs and prescriptions in seconds.</li>
                                    <li className="security-item">NeoAI supports patients and clinicians — it does not replace them.</li>
                                    <li className="security-item">Emergency view shows only essential life-saving information when it matters.</li>
                                    <li className="security-item">Safer decisions for every visit across the entire health journey.</li>
                                </ul>
                                <div className="after-neo-bx">
                                    <p>NeoHealthCard converts clinical events into structured, verifiable blocks — so clinicians, families, programs and regulators rely on the same truth.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="neo-ai-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3 d-flex align-items-center" >
                            <div>
                                <div className="neo-title-heading">
                                    <span className="built-title">NEO AI</span>
                                    <h5 data-aos="fade-up" data-aos-delay="50">NeoAI — the intelligence layer</h5>
                                    <p data-aos="fade-up" >NeoAI is integrated into the health record. It checks interactions, interprets lab trends, drafts summaries and reduces repetitive paperwork — while logging suggestions and keeping doctors in command.</p>

                                </div>

                                <div>
                                    <ul className="neo-ai-list" data-aos="fade-up" data-aos-delay="50">
                                        <li className="neo-ai-item"> <span className="neo-ai-bullet"></span> Drug interaction checker</li>
                                        <li className="neo-ai-item"> <span className="neo-ai-bullet"></span> Doctor smart summary</li>
                                        <li className="neo-ai-item"> <span className="neo-ai-bullet"></span> AI lab trend interpreter</li>
                                        <li className="neo-ai-item"> <span className="neo-ai-bullet"></span> Paperwork reduction (auto-drafts)</li>
                                    </ul>
                                    <span className="auditable-title" data-aos="fade-up" data-aos-delay="100">Explainable·Doctor in command·Logged + auditable</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="50">
                            <div className="neo-wrapper">
                                <div className="neo-card">

                                    <div className="dv-neo-card-header">
                                        <span className="dv-neo-icon"><img src="/images/brain.png" alt="" /></span>
                                        <h5 className="">NEO AI · INTELLIGENCE LAYER</h5>
                                    </div>

                                    <div className="neo-card-body">
                                        <div className="neo-feature-box">
                                            <h3>Drug interaction checker</h3>
                                            <p>Flags high-risk combinations; clinicians decide the final plan.</p>
                                        </div>

                                        <div className="neo-feature-box">
                                            <h3>AI lab trend interpreter</h3>
                                            <p>Highlights trend-based abnormalities and potential early warnings.</p>
                                        </div>

                                        <div className="neo-feature-box">
                                            <h3>Doctor smart summary</h3>
                                            <p>Compresses long histories into clinician-friendly summaries saved to the record.</p>
                                        </div>

                                        <div className="neo-feature-box">
                                            <h3>Paperwork reduction</h3>
                                            <p>Auto-drafts structured notes and claim-ready packets to reduce scanning and typing.</p>
                                        </div>

                                    </div>

                                    <div className="neo-card-footer">
                                        <span>Explainable · Logged · Auditable</span>
                                        <span className="neo-footer-right">Doctor in command</span>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </section>

            <section className="security-trust-section" >
                <div className="container">
                    <div className="row">
                        <div className="neo-title-heading mb-3">
                            <span className="built-title">Built for governance</span>
                            <h5 data-aos="fade-up" data-aos-delay="50">Security, Trust & Compliance</h5>
                            <p data-aos="fade-up">Secure by default - with patient control, auditability, and institution - grade reporting.</p>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                            <div className="security-bx nw-security-content-bx">
                                <h6 className="shield-title"><HiOutlineShieldCheck className="shield-icon" /> Secure health ledger</h6>
                                <h4>Consent based  audit-ready</h4>

                                <ul className="security-list">
                                    <li className="security-item">Sell or monetise patient health data</li>
                                    <li className="security-item">Show advertisements or non-medical profiling</li>
                                    <li className="security-item">Replace doctors with automated decisions</li>
                                    <li className="security-item">Lock patients into a single hospital or provider</li>
                                </ul>

                            </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="50">
                            <div className="security-bx d-flex flex-column justify-content-between">
                                <div>
                                    <h4>Institutional readiness</h4>
                                    <p>Multi-tenant operations, multi-region-region deployment, offline-friendly edges,and standards-ready exchange (FHIR/HL7/DICOM).</p>
                                </div>

                                <div className="d-flex align-items-center justify-content-start gap-3 flex-wrap">
                                    <button className="landing-lg-thm-btn ">Talk to Partnerships<FontAwesomeIcon icon={faArrowRight} /> </button>
                                    <Link to='/select-account-type' className="landing-thm-btn outline">Get NeoHealthCard<FontAwesomeIcon icon={faArrowRight} /> </Link>
                                </div>
                            </div>




                        </div>
                    </div>
                </div>
            </section>

            <section className="medical-truth-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12" data-aos="fade-up" data-aos-delay="50">
                            <div className="medical-truth-content">
                                <h5>Bring medical truth everywhere life goes.</h5>

                                <p>Create a NeoHealthCard in minutes-or deploy across hospital, labs and pharmacies <br /> with governance-ready interoperability.</p>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12 my-auto" data-aos="fade-up" data-aos-delay="50">
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <Link to='/select-account-type' className="nw-landing-thm-btn">Get NeoHealthCard<FontAwesomeIcon icon={faArrowRight} /> </Link>
                                <button className="landing-lg-thm-btn ">Institutional Demo<FontAwesomeIcon icon={faArrowRight} /> </button>
                            </div>
                        </div>
                    </div>
                </div>

            </section>





        </>
    )
}

export default Landing