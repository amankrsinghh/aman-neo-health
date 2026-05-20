// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";
import 'animate.css';

import {
  Activity,
  AlertTriangle,
  Ambulance,
  BadgeCheck,
  Bed,
  Building2,
  CalendarClock,
  CreditCard,
  Database,
  FileText,
  Globe,
  HardDrive,
  HeartPulse,
  KeyRound,
  LineChart,
  Lock,
  Microscope,
  Network,
  Package,
  Receipt,
  Scan,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  Truck,
  Upload,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { FaHospital } from "react-icons/fa";

import { useEffect, useState } from "react";
import "../../assets/css/landing.css"
import AOS from "aos";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { getApiData } from '../../Service/api';
import base_url from '../../baseUrl';
import ContactQuery from './ContactQuery';


export default function LandingPage() {

  const [menuOpen, setMenuOpen] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState("Jaipur, India");

  // const locations = ["English", "Delhi"];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };



  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector(".navbar")
        ?.classList.toggle("fixed", window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  const [firstSection, setFirstSection] = useState()
  const [secondSection, setSecondSection] = useState()
  const [thirdSection, setThirdSection] = useState()
  const [activeCategory, setActiveCategory] = useState("All");
  const [securityData, setSecurityData] = useState([])
  const [interoperability, setInteroperability] = useState()
  const [depolyementData, setDeployementData] = useState([])
  const [featureSearch, setFeatureSearch] = useState()
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/hospital");
      if (res.success) {
        setFirstSection(res?.data?.firstSection);
        setSecondSection(res?.data?.secondSection)
        setSecurityData(res?.data?.fourthSection?.security)
        setDeployementData(res?.data?.fourthSection?.deployment)
        setInteroperability(res?.data?.fourthSection?.interoperability)
        setThirdSection(res?.data?.thirdSection)
      }


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const uniqueCategories = [
    ...new Map(
      (thirdSection?.bottomShot || []).map(item => [
        item.category?.toLowerCase(),
        item
      ])
    ).values()
  ];
  const filteredData =
    activeCategory === "All"
      ? thirdSection?.bottomShot
      : thirdSection?.bottomShot?.filter(
        item =>
          item.category?.toLowerCase() === activeCategory.toLowerCase()
      );
  const features = securityData?.feature || [];

  const half = Math.ceil(features.length / 3);

  const cardData = features.slice(0, half);
  const accordionData = features.slice(half);
  return (
    <div className="">
      <section className="hospital-hero">
        <div className="container text-center">
          <div className="row">
            <div className="col-lg-12">
              <div className="hospital-tags order-2 order-md-1">
                <ul className="hospital-tag-list">
                  {firstSection?.topShot?.map(t =>
                    <li className="hospital-tag-item">{t}</li>)}
                </ul>
              </div>
              <div className='order-1 order-md-2'>
                <div className="clinical-title" >
                  <h3 className=' heading-grad' data-aos="fade-up" data-aos-delay="50" >{firstSection?.title || 'NeoHealthCard Hospital'}</h3>
                  <p className="" data-aos="fade-up" >
                    {firstSection?.subTitle || "Clinical + Operations + Revenue, unified under one governance layer."}
                  </p>
                </div>


                <p className="hospital-neo-para" data-aos="fade-up">
                  {firstSection?.description || ` OPD, IPD, ICU, OT, Emergency, Labs, Radiology, Procurement, Inventory, Billing, Claims, Staff access, and
                  compliance — all connected to the same NeoHealthCard identity and audit backbone.`}
                </p>
                {/* <div className="hospital-hero-actions d-flex flex-wrap justify-content-center align-items-center mb-4">
                  <a href={firstSection?.btnLink?.first} target='_blank' className="hp-thm-btn">
                    Request Demo
                  </a>

                  <a href={firstSection?.btnLink?.second} target='_blank' className="hp-thm-btn outline">
                    Download Spec
                  </a>

                </div> */}
              </div>

            </div>
          </div>
          <div className="row">

            {firstSection?.bottomShot?.map(b =>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                <div className="hero-stat-card">
                  <span className="stat-label">{b?.category || "Care Continuum"}</span>
                  <h6 className="stat-value">{b?.title || 'OPD → IPD → ICU → OT'}</h6>
                  <small className="stat-hint">{b?.detail || "single timeline"}</small>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      <section id="platform" className="platform-section">
        <div className="container">

          <div className="text-center role-base-content">
            <h3 className="">ROLE-BASED INTELLIGENCE</h3>
            <h2 className="heading-grad fw-bold" data-aos="fade-up" data-aos-delay="50">{secondSection?.title}</h2>
            <p className="" data-aos="fade-up" data-aos-delay="50">
              {secondSection?.description}
            </p>
          </div>



          <div className="row platform-main">
            <ul className="nav justify-content-center platform-persona-buttons mb-4" role="tablist">
              {secondSection?.feature?.map((f, i) => (
                <li className="nav-item" key={i}>
                  <button
                    className={`persona-btn ${i === 0 ? "active" : ""}`}
                    data-bs-toggle="tab"
                    data-bs-target={`#tab-${i}`}
                    type="button"
                  >
                    {f?.category}
                  </button>
                </li>
              ))}
            </ul>
            <div className="col-md-7">
              <div className="tab-content">

                {/* ADMIN */}
                {secondSection?.feature?.map((f, i) => (
                  <div
                    key={i}
                    className={`tab-pane fade ${i === 0 ? "show active" : ""} mb-3`}
                    id={`tab-${i}`}
                  >
                    <div className="platform-card" data-aos="fade-up" data-aos-delay="50" >
                      <div className="platform-card-header d-flex justify-content-between">
                        <div>
                          <h3 className="platform-title">{f?.title}</h3>
                          <p className="platform-desc">
                            {f?.subTitle}
                          </p>
                        </div>
                        <div className="platform-icon-box">
                          <img src={`${base_url}/${f?.image}`} alt="" />
                        </div>
                      </div>

                      <ul className="platform-bullets">
                        {f?.desc?.split('.')?.map(d => <li><BadgeCheck size={18} /> {d}</li>)}
                      </ul>

                      <div className="d-flex align-items-center gap-3">
                        <a href={f?.firstLink} target='_blank' className="hp-thm-btn">See Demo Flow</a>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#contactQuery" className="hp-thm-btn outline">Talk Team</a>
                      </div>

                    </div>
                  </div>))}




              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-5">

              <div className="platform-widget" data-aos="fade-up" data-aos-delay="50" >
                <div className="platform-widget-header">
                  <h4>Operational Dashboards</h4>
                  <span className='platform-icon-box'><LineChart size={16} /></span>
                </div>

                <div className="row">

                  {secondSection?.otDashboard?.map(o=>
                  <div className="col-lg-6 mb-3">
                    <div className="platform-mini-card">
                      <div className="d-flex justify-content-between mb-2 align-items-center">
                        <h6><BadgeCheck size={18} /> {o?.title}</h6>
                        <span className=''>
                          <img src={`${base_url}/${o?.image}`} alt="" />
                        </span>
                      </div>
                      <div className="platform-mini-status">
                        <h5>{o?.status}</h5>
                      </div>

                      <div className="platform-progress">
                        <div className="platform-progress-fill" style={{width:`${o?.progress}%`}}></div>
                      </div>
                    </div>
                  </div>)}  

                </div>
              </div>


              <div className="platform-widget" data-aos="fade-up" data-aos-delay="50" >
                <div className="platform-widget-header">
                  <h4>Patient Timeline</h4>
                  <span className='platform-icon-box'><Database size={16} /></span>
                </div>

                <div className="platform-timeline">
                  {secondSection?.patientTimeline?.split('.')?.map(t=>
                  <div className="platform-timeline-item">{t}</div>)}
                </div>
              </div>


              <div className="platform-widget" data-aos="fade-up" data-aos-delay="50">
                <div className="d-flex align-items-center gap-3">
                  <div className="platform-icon-box">
                    <Sparkles size={18} className='health-icon' />
                  </div>
                  <div>
                    <div className="platform-ai-title">
                      <h5> NeoAI Assist</h5>
                    </div>
                    <div className="platform-ai-sub">
                      <p>{secondSection?.neoAiAssist}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      <section id="modules" className="modules-section">

        <div className="container">

          <div className="text-center role-base-content">
            <h3 className="">Full hospital feature set</h3>
            <h2 className="heading-grad  fw-bold" data-aos="fade-up" data-aos-delay="50">
              {thirdSection?.title || 'Everything your hospital uses — inside NeoHealthCard. '}</h2>
            <p className="" data-aos="fade-up" >
              {thirdSection?.description || 'Filter by category and search. All modules share identity + consent + audit + interoperability posture.'}
            </p>
          </div>


          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 modules-controls">

            <ul className="nav modules-categories mb-2 mb-md-0" role="tablist">

              <li className="nav-item">
                <button
                  className={`persona-btn ${activeCategory === "All" ? "active" : ""}`}
                  onClick={() => setActiveCategory("All")}
                  type="button"
                >
                  All
                </button>
              </li>

              {uniqueCategories.map((b, index) => (
                <li className="nav-item" key={index}>
                  <button
                    className={`persona-btn ${activeCategory === b.category ? "active" : ""}`}
                    onClick={() => setActiveCategory(b.category)}
                    type="button"
                  >
                    {b.category}
                  </button>
                </li>
              ))}

            </ul>

            <div className="custom-frm-bx mb-0" >
              <input type="text" value={featureSearch} onChange={(e) => setFeatureSearch(e.target.value)} className="form-control " placeholder="Search (OT, ICU, PO, claims, DICOM…)" />
            </div>

          </div>

          <div className="tab-content modules-grid">
            <div className="tab-pane fade show active" id="allModules">
              <div className="row">
                {filteredData?.filter(item =>
                  !featureSearch ||
                  item?.title?.toLowerCase().includes(featureSearch.toLowerCase())
                ).map((item, index) => (
                  <div className="col-md-4 mb-3" key={index}>
                    <div className="module-card h-100">
                      <div className="module-body">

                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="platform-icon-box">
                            <Users size={18} />
                          </div>
                          <div className="module-content">
                            <h6>NeoHealthCard</h6>
                          </div>
                        </div>

                        <h5>{item.title}</h5>
                        <p className="card-text">{item.subTitle}</p>

                        <ul className="list-unstyled mb-0">
                          {item.detail?.split(".").map((point, i) =>
                            point.trim() ? <li key={i}><BadgeCheck size={18} /> {point.trim()}</li> : null
                          )}
                        </ul>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* ROLLOUT CTA */}
          <div className=" mt-5 hp-modules-rollout" data-aos="fade-up" data-aos-delay="50">
            <div className="row align-items-center">

              <div className="col-md-8" >
                <div className="rollout-content">
                  <h4 className="">Phased rollout (no downtime)</h4>
                  <p className="">
                    {thirdSection?.phasedRollout?.desc || "Start with OPD + billing, expand to IPD/ICU/OT, then integrate LIS/RIS-PACS, procurement, inventory, and claims."}
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3 justify-content-end rollout-plan-box">
                  {/* <a href={thirdSection?.phasedRollout?.firstLink} target='_blank' className="hp-thm-btn">Request Rollout Plan</a> */}
                  <a href="#" data-bs-toggle="modal" data-bs-target="#contactQuery" className="hp-thm-btn outline">Talk to Team</a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      <section id="security" className="security-section">
        <div className="container">

          <div className="text-center role-base-content mb-5">
            <h3 className="">Security & governance</h3>
            <h2 className="heading-grad  fw-bold" data-aos="fade-up" data-aos-delay="50" >{securityData?.title || "Permissioned by design. Auditable by default."}</h2>
            <p className="" data-aos="fade-up"  >
              {securityData?.description}
            </p>
          </div>
          <div className="row security-row">


            <div className="col-lg-6">
              <div className="custom-accordion" id="securityAccordion">
                {accordionData.map((f, i) => (
                  <div
                    key={i}
                    className="accordion-item module-card nw-accordion-card"
                  >
                    <button
                      className="landing-accordion-btn"
                      data-bs-toggle="collapse"
                      data-bs-target={`#acc-${i}`}
                    >
                      <div className="security-tab mb-0">
                        <div className="platform-icon-box">
                          <Users size={18} />
                        </div>

                        <div>
                          <h6 > {f?.title}</h6>
                          {/* <span className="info-title">{f?.subTitle}</span> */}
                        </div>
                      </div>
                    </button>

                    <div
                      id={`acc-${i}`}
                      className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                      data-bs-parent="#securityAccordion"
                    >
                      <div className="accordion-body">
                        <p>{f.subTitle}</p>
                        <div className="module-body">
                          <ul>
                            {f?.detail?.split('.')?.map(d => <li> <BadgeCheck size={18} /> {d?.trim()}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="col-lg-6 mb-3 ">
              {cardData?.map(f =>
                <div className="module-card mb-3" data-aos="fade-up" data-aos-delay="50" >
                  <div className="protection-box mb-2">
                    <div className="platform-icon-box">
                      <Users size={18} />

                    </div>

                    <div className="protection-title">
                      <span className="neo-protection-title"> NeoHealthCard</span>
                    </div>
                  </div>
                  <div className="protection-title">
                    <h5 className=""> {f?.title}</h5>
                  </div>

                  <p className="fs-6">{f?.subTitle}</p>
                  <div className="module-body">
                    <ul>
                      {f?.detail?.split('.')?.map(d => <li> <BadgeCheck size={18} /> {d?.trim()}</li>)}
                    </ul>
                  </div>
                </div>)}

            </div>

          </div>
        </div>
      </section>


      <section id="interop" className="interop-section">
        <div className="container">

          <div className="text-center role-base-content mb-5">
            <h3 className="">Interoperability</h3>
            <h2 className="heading-grad fw-bold" data-aos="fade-up" data-aos-delay="50" >
              {interoperability?.title} </h2>
            <p className=" " data-aos="fade-up"  >
              {interoperability?.description || "Standards-first posture with staged migration from legacy systems."}
            </p>
          </div>




          <div className="row interop-features">

            {interoperability?.feature?.map(f =>
              <div className="col-lg-4 mb-3" data-aos="fade-up" data-aos-delay="50" >
                <div className="module-card h-100">

                  <div className="protection-box mb-2">
                    <div className="platform-icon-box">
                      <Users size={18} />

                    </div>

                    <div className="protection-title">
                      <span className="neo-protection-title"> NeoHealthCard</span>
                    </div>
                  </div>

                  <div className="protection-title">
                    <h5 className="">{f?.title}</h5>
                  </div>


                  <p>{f?.description}</p>
                  <ul>
                    {f?.detail?.split('.')?.map(d => <li> <BadgeCheck size={18} /> {d?.trim()}</li>)}
                  </ul>
                </div>
              </div>)}


          </div>


          <div className="interop-cta" data-aos="fade-up" data-aos-delay="50">
            <div className="row align-items-center">
              <div className="col-md-8 d-flex gap-3 align-items-start">
                <div className="platform-icon-box">
                  <Users size={18} />

                </div>
                <div>
                  <h6 className="mb-0">Migration without disruption</h6>
                  <p className="mb-0 fs-6">{interoperability?.migrationDesc}</p>
                </div>
              </div>

              <div className="col-md-4 text-md-end get-info-bx">
                <Link to='/login'  className="hp-thm-btn">Join Hospital Network</Link>
              </div>
            </div>
          </div>

        </div>
      </section>


      <section id="deploy" className="deploy-section">
        <div className="container">
          <div className="text-center role-base-content mb-5">
            <h3 className="">Deployment</h3>
            <h2 className="heading-grad fw-bold" data-aos="fade-up" data-aos-delay="50">{depolyementData?.title}</h2>
            <p className="" data-aos="fade-up" >
              {depolyementData?.description}
            </p>
          </div>


          <div className="row deploy-features">
            {depolyementData?.feature?.map(f =>
              <div className="col-lg-4 mb-3" data-aos="fade-up" data-aos-delay="50">
                <div className="module-card h-100">

                  <div className="protection-box mb-2">
                    <div className="platform-icon-box">
                      <Users size={18} />

                    </div>

                    <div className="protection-title">
                      <span className="neo-protection-title"> NeoHealthCard</span>
                    </div>
                  </div>

                  <div className="protection-title">
                    <h5 className=""> {f?.title}</h5>
                  </div>


                  <p>{f?.subTitle}</p>
                  <div className="module-body">
                    <ul>
                      {f?.detail?.split('.')?.map(d => <li> <BadgeCheck size={18} /> {d?.trim()}</li>)}
                    </ul>
                  </div>
                </div>
              </div>)}



          </div>

        </div>
      </section>


<ContactQuery/>

    </div>
  );
}
