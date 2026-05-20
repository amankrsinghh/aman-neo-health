import { useEffect, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
import { FiGlobe, FiMail, FiUsers } from "react-icons/fi";

import "../../assets/css/landingdoctor.css"
import { Users } from "lucide-react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdKey } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { WiStars } from "react-icons/wi";


import {
  Building2

} from "lucide-react";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getApiData } from "../../Services/api"

export default function Home() {

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
  const [fourthSection, setFourthSection] = useState()
  const [fivethSection, setFivethSection] = useState()
  const [sixSection, setSixSection] = useState()
  const [sevenSection, setSevenSection] = useState()
  const fetchData = async () => {
    try {
      const res = await getApiData("api/admin/landing/doctor");
      if(res.success){
        setFirstSection(res?.data?.firstSection);
        setSecondSection(res?.data?.secondSection)
        setThirdSection(res?.data?.thirdSection)
        setFourthSection(res?.data?.fourthSection)
        setFivethSection(res?.data?.fivethSection)
        setSixSection(res?.data?.sixSection)
        setSevenSection(res?.data?.sevenSection)
      }


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);





  return (
    <div className="neo-doctor-wrapper">
      {/* {mode === "dark" && <Glow />} */}

      <div className="relative">
        {/* <section className="mx-auto max-w-6xl px-4 pt-14 md:pt-20">
          <motion.div {...fade} className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="flex flex-wrap gap-2">
                <Chip icon={I.Shield} label="Verified doctor network • Consent-first" theme={theme} />
                <Chip icon={I.Lock} label="Secure rooms • Audit trails" theme={theme} />
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
                Your practice, upgraded.
                <span className="block">Verified identity. Global reach. Real trust.</span>
              </h1>

              <p className={`mt-4 text-base leading-relaxed ${theme.subtle}`}>
                NeoHealthCard helps doctors access verified patient timelines, run secure consultations, and build professional credibility with
                accountable reviews — powered by NeoAI and protected by governance-grade security. Video calls and group rooms support secure file
                sharing during meetings with audit trails.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className={`rounded-2xl ${theme.solidBtn}`}>Apply for Verification</Button>
                <Button variant="outline" className={`rounded-2xl ${theme.outlineBtn}`}>
                  See Doctor ID
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <Stat label="Faster charting" value="↓ 40%" theme={theme} />
                <Stat label="Safer handoffs" value="↑ 3×" theme={theme} />
                <Stat label="Audit-ready" value="Always" theme={theme} />
              </div>

              <div className={`mt-5 text-xs ${theme.subtle}`}>
                NeoAI is assistive (summaries, drafting, safety prompts). Final clinical decisions remain with the licensed clinician.
              </div>
            </div>


            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-white/5 blur-2xl" />
              <div className={`relative overflow-hidden rounded-[36px] border shadow-2xl ${theme.card}`}>
                <div className={`flex items-center justify-between border-b px-5 py-4 ${mode === "light" ? "border-zinc-200" : "border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${theme.mutedDot}`} />
                  </div>
                  <Badge className={theme.pill}>Doctor App UI</Badge>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`rounded-3xl border p-4 ${theme.subcard}`}>
                      <div className={`text-xs font-semibold ${theme.strong}`}>Screenshots (your app)</div>
                      <div className={`mt-1 text-xs ${theme.subtle}`}>Dashboard • Timeline • Chat • Rooms</div>
                      <div className="mt-4 grid gap-3">
                        <MiniShot label="Patient Timeline" theme={theme} />
                        <MiniShot label="Secure Room" theme={theme} />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <MiniShot label="Appointment Requests" theme={theme} />
                      <MiniShot label="Approvals" theme={theme} />
                      <MiniShot label="NeoAI Assist" theme={theme} />
                    </div>
                  </div>
                  <div className={`mt-5 rounded-2xl border px-4 py-3 text-xs ${theme.subtle} ${theme.subcard}`}>
                    Designed for real clinics: approvals, appointments, history, staff, permissions, scanning, secure chat, and NeoAI.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section> */}

        <section className="dc-health-care-section">
          <div className="container">
            <div className="row align-items-center">

              <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                {/* Chips */}
                <div className="mb-3">
                  <ul className="neo-chip-list">
                    {firstSection?.topShot?.map(t=>
                    <li className="neo-chip-item">{t}</li>)}
                    {/* <li className="neo-chip-item"> Secure rooms • Audit trails</li> */}
                    {/* <li className="neo-chip-item"> WHO-aligned workflows </li>
        <li className="neo-chip-item"> ABDM-ready interoperability  </li>
        <li className="neo-chip-item">Consent-first access  </li>
        <li className="neo-chip-item">Audit-ready </li> */}
                  </ul>
                </div>

                <div className="doctor-heading-content">
                  <h2 className="heading-grad  mt-3" data-aos="fade-up" data-aos-delay="50">
                    {firstSection?.firstTitle}
                    <span className="d-lg-block d-sm-inline">{firstSection?.secondTitle}</span>
                    {/* <span className="d-lg-block d-sm-inline">reach. Real trust.</span> */}
                  </h2>

                  <p className="mt-3 " data-aos="fade-up" data-aos-delay="50">
                    {firstSection?.description || 'NeoHealthCard helps doctors access verified patient timelines, run secure consultations, and build professional credibility with accountable reviews — powered by NeoAI and protected by governance-grade security. Video calls and group rooms support secure file sharing during meetings with audit trails.'}
                  </p>
                </div>

                <div className="mt-4 d-flex flex-column flex-sm-row gap-2 " data-aos="fade-up" data-aos-delay="50">
                  <a href={firstSection?.btnLink} target="_blank" className="dc-thm-btn">Apply for Verification</a>
                  {/* <button className="dc-thm-btn outline">Governance & Compliance →</button> */}
                </div>

                {/* Stats */}
                <div className="mt-3 row">
                  {firstSection?.bottomShot?.map(b=>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                    <div className="dc-module-cards">
                      <h5>{b?.label}</h5>
                      <p>  {b?.value}</p>

                    </div>
                  </div>)}                 

                </div>

                <div className="neo-ai-content" data-aos="fade-up" data-aos-delay="50">
                  <p> {firstSection?.bottomDesc || 'NeoAI is assistive (summaries, drafting, safety prompts). Final clinical decisions remain with the licensed clinician.'}</p>
                </div>
              </div>


              <div className="col-lg-6 col-md-12 col-sm-12 position-relative" data-aos="fade-up" data-aos-delay="50">
                <div class="nhc-wrapper">
                  <div class="nhc-header">
                    <div class="nhc-logo"><div class="neo-dots-loader">
                      <span class="neo-dot"></span>
                      <span class="neo-dot"></span>
                      <span class="neo-dot"></span>
                    </div></div>
                    <h6 class="nhc-audit-btn d-flex align-items-center gap-1 mb-0">
                      Doctor App UI
                    </h6>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <div class="nhc-consent-box mb-0">
                        <div class="nhc-consent-top">
                          <div>
                            <h2 class="nhc-title fz-16 mb-2">Screenshots (Your App)</h2>
                            <p class="nhc-sub">
                              Dashboard • Timeline • Chat • Rooms
                            </p>
                          </div>

                        </div>

                        <div class="mt-3">
                          {firstSection?.appUiShot?.slice(0,2)?.map(s=>
                          <div class="nhc-info-card mb-2 justify-content-center">
                            <span> {s}</span>
                          </div>)}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6 mb-3">
                      <div class="nhc-consent-box mb-0">
                        {firstSection?.appUiShot?.slice(2)?.map(s=>
                        <div class="nhc-info-card mb-2 justify-content-center">
                          <span class="">{s}</span>
                        </div>)}

                        
                      </div>

                    </div>


                  </div>






                  <div class="nhc-ai-box">
                    <p>
                      {firstSection?.appUiDesc || 'Designed for real clinics: approvals, appointments, history, staff, permissions, scanning, secure chat, and NeoAI.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>



        <section id="capabilities" className="capabilities-section">
          <div className="container">
            <div class="doctor-works-content">
              {/* <h6 class="section-label"><span className="built-title">HOW IT WORKS</span></h6> */}
              <h2 class="section-title" data-aos="fade-up" data-aos-delay="50">
                {secondSection?.title || 'Doctor-first capabilities'}
              </h2>
              <p class="section-description" data-aos="fade-up" >
                {secondSection?.description}
              </p>
            </div>

            <div className="row">
              {secondSection?.model?.map(m=>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
                <div className="work-card h-100">
                  <div className="protection-title">
                    <h5 className="mb-2">{m?.name}</h5>
                    <h6 className="secure-title">{m?.title}</h6>
                  </div>

                  <ul>
                    {m?.description?.split('.')?.map(d=><li><p >{d}</p></li>)}
                  </ul>



                </div>
              </div>)}
            </div>
          </div>
        </section>

        <section id="ecosystem" className="neo-section">
          <div className="container">
            <div class="doctor-works-content">
            {/* <h6 class="section-label"><span className="built-title">EVERYTHING CONNECTED</span></h6> */}
            <h2 class="section-title" data-aos="fade-up" data-aos-delay="50">
             {thirdSection?.title || " One system, many modules"}
            </h2>
            <p class="section-description" data-aos="fade-up" >
              {thirdSection?.description}
            </p>
          </div>

          <div className="row">
            {thirdSection?.model?.map(m=>
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
              <div className="work-card h-100">
                <div className="protection-title">
                  <h5 className="mb-2">{m?.title}</h5>
                </div>
                <ul>
                  {m?.description?.split('.')?.map(d=><li><p >{d}</p></li>)}
                </ul>
              </div>
            </div>)}
          </div>

          </div>
          
        </section>



        <section id="security" className="  neo-section">
          <div className="container">
             <div class="doctor-works-content">
            {/* <h6 class="section-label"><span className="built-title">GOVERNANCE & COMPLIANCE</span></h6> */}
            <h2 class="section-title" data-aos="fade-up" data-aos-delay="50">
              Trust, quality and protection

            </h2>
            <p class="section-description" data-aos="fade-up" data-aos-delay="50">
              NeoHealthCard replaces anonymous ratings with accountable feedback from verified patients — <span className="d-lg-block d-sm-inline">while protecting doctors with tamper-evident audit trails and medico-legal safeguards.</span>
            </p>
          </div>

          <div className="row ">
            {fourthSection?.model?.map(m=>
            <div className="col-lg-6 col-md-6 col-sm-12 mb-3" data-aos="fade-up" data-aos-delay="50">
              <div className="work-card h-100">
                <div className="protection-title">
                  <h5 className="mb-2">{m?.title} </h5>
                </div>
                <ul>
                  {m?.description?.split('.')?.map(d=><li><p >{d}</p></li>)}
                </ul>
              </div>
            </div>)}
            

            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="50">
              <ul className="porities-list">
               {fourthSection?.model?.map(m=> <li className="porities-item"><span className="porities-title">{m?.title}
                </span></li>)}
              </ul>
            </div>
          </div>

          </div>

         


          {/* <div className="mt-3 d-flex flex-wrap gap-2">
    <span className="neo-badge">Blockchain audit trails</span>
    <span className="neo-badge">Consent-first access</span>
    <span className="neo-badge">Verified patients</span>
    <span className="neo-badge">Accountable reviews</span>
    <span className="neo-badge">Emergency-safe</span>
    <span className="neo-badge">WHO-aligned principles</span>
    <span className="neo-badge">ABDM-ready posture</span>
  </div> */}
        </section>


        {/* <section id="doctorid" className="mx-auto max-w-6xl px-4 pt-14 md:pt-18 pb-16">
          <div className={`relative overflow-hidden rounded-[40px] border p-8 md:p-10 ${theme.card}`}>
            <div aria-hidden className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className={theme.chip}>
                  <I.Id className={theme.chipIcon} />
                  <span>One verified identity</span>
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">One verified identity. One global practice.</h3>
                <p className={`mt-3 text-sm leading-relaxed ${theme.subtle}`}>
                  After verification, doctors receive a NeoHealthCard Doctor ID that connects them with verified patients and care networks worldwide —
                  securely and professionally.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button className={`rounded-2xl ${theme.solidBtn}`}>Apply for Verification</Button>
                <Button variant="outline" className={`rounded-2xl ${theme.outlineBtn}`}>
                  Talk to NeoHealthCard
                </Button>
              </div>
            </div>
          </div>
        </section> */}

        <section id="doctorId" className="doctor-id-section" >
          <div className="container ">
            <div className="row  align-items-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <span className="read-insti-bx"> {fivethSection?.tag}</span>
                </div>

                <h3 className="neo-heading mb-2">
                  {fivethSection?.title}
                </h3>

                <p className="neo-paragraph">
                  {fivethSection?.description || "After verification, doctors receive a NeoHealthCard Doctor ID that connects them with verified patients and care networks worldwide — securely and professionally."}
                </p>



              </div>




              <div className="col-md-6 ">
                <div className=" text-center mt-3 mt-md-0">
                  <a href={fivethSection?.btnLink} target="_blank" className="dc-lg-btn">Apply for Verification</a>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* <footer className={`border-t backdrop-blur-xl ${theme.footer}`}>
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${theme.card}`}>
                    <I.Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">NeoHealthCard</div>
                    <div className={`text-xs ${theme.subtle}`}>Doctor App</div>
                  </div>
                </div>
                <div className={`mt-4 text-sm leading-relaxed ${theme.subtle}`}>
                  Built on consent. Secured by audit trails. Powered by NeoAI.
                </div>
              </div>

              {[ 
                {
                  title: "For Doctors",
                  links: ["Doctor App", "Verification & Onboarding", "Telemedicine", "Clinical Tools", "Global Practice"],
                },
                {
                  title: "Ecosystem",
                  links: ["NeoAI", "NeoMiddleware", "NeoEdge", "Blockchain Security", "Emergency Network"],
                },
                {
                  title: "Trust & Compliance",
                  links: ["Privacy Policy", "Terms of Service", "Medical Disclaimer", "WHO Digital Health", "ABDM (India)"],
                },
              ].map((col) => (
                <div key={col.title}>
                  <div className={`text-sm font-semibold ${theme.strong}`}>{col.title}</div>
                  <ul className={`mt-3 space-y-2 text-sm ${theme.subtle}`}>
                    {col.links.map((l) => (
                      <li key={l}>
                        <a className={navHover} href="#">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Separator className={`my-8 ${theme.sep}`} />

            <div className={`flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between ${theme.subtle}`}>
              <div>© {new Date().getFullYear()} NeoHealthCard. All rights reserved.</div>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2">
                  <I.Shield className="h-3.5 w-3.5" /> Audit-ready
                </span>
                <span className="inline-flex items-center gap-2">
                  <I.Lock className="h-3.5 w-3.5" /> Consent-first
                </span>
                <span className="inline-flex items-center gap-2">
                  <I.Brain className="h-3.5 w-3.5" /> Clinician oversight
                </span>
              </div>
            </div>
          </div>
        </footer> */}

      </div>
    </div>



  );
}
