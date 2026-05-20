import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaHeartbeat } from "react-icons/fa";
import { FiGlobe, FiMail, FiUsers } from "react-icons/fi";

import "../../assets/css/landingHeader.css"
import { Users } from "lucide-react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdKey } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { WiStars } from "react-icons/wi";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { PiGlobe } from "react-icons/pi";
function LandingHeader() {
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const languages = [
    {
      label: "English",
      code: "en",

    },
    {
      label: "Hindi",
      code: "hi",

    },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFor, setIsFor] = useState(false);
  const [isModules, setIsModules] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsFor(false);
    setIsModules(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  const institutionsDropdown = () => {
    setIsFor(!isFor);
    setIsOpen(false);
    setIsModules(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  const modulesDropdown = () => {
    setIsModules(!isModules);
    setIsOpen(false);
    setIsFor(false);
    closeMenu(); // keep your existing closeMenu logic
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsModules(false);
        setIsFor(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>

      <nav className="navbar navbar-expand-lg dv-navbar-light-box py-0">
        <div className="container">
          <NavLink className="navbar-brand me-0" to="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </NavLink>
          <button className="navbar-toggler" style={{boxShadow : "none"}} type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarDvSupportedContent" >

            <div className="mobile-close-btn d-lg-none">
              <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
            </div>

            <ul className="navbar-nav mx-auto mb-2 mb-lg-0  gap-lg-2 gap-sm-0">
              <li className="nav-item">
                <NavLink to="/#capabilities" className="nav-link " onClick={closeMenu}>
                  Capabilities
                </NavLink>
              </li>
               <li className="nav-item">
                <NavLink to="/#ecosystem" className="nav-link " onClick={closeMenu}>
                  Ecosystem
                </NavLink>
              </li>
               <li className="nav-item">
                <NavLink to="/#doctorId" className="nav-link " onClick={closeMenu}>
                  Doctor ID
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/#security" className="nav-link " onClick={closeMenu}>
                  Trust
                </NavLink>
              </li>                      
            </ul>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {localStorage.getItem('token')?
                <Link to="/request-list" className="landing-thm-btn" onClick={closeMenu}>
                  Go To Dashboard <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                :<Link to="/login" className="landing-thm-btn" onClick={closeMenu}>
                  Apply <FontAwesomeIcon icon={faArrowRight} />
                </Link>}
              </div>
            </div>
          </div>
        </div>
        {menuOpen && <div className="dv-mobile-overlay" onClick={closeMenu}></div>}
      </nav>
      
    </>
    // <header className="sticky-top neo-topbar border-bottom">
    //   <nav className="navbar navbar-expand-lg navbar-light-box">
    //     <div className="container">
    //       <NavLink className="navbar-brand me-0" to="/">
    //         <div className="d-flex align-items-center gap-2">
    //           <div className="d-flex justify-content-center align-items-center neo-card rounded-2xl border" style={{ width: '36px', height: '36px' }}>
    //             <FaHeartbeat className="text-success" style={{ width: '14px', height: '14px' }} />
    //           </div>
    //           <div className="lh-1 dc-neo-content">
    //             <div className=""> <h4>NeoHealthCard</h4> </div>
    //             <div className=""><p>Security · Intelligence · Care</p></div>
    //           </div>
    //         </div>
    //       </NavLink>

    //       <button className="navbar-toggler" type="button" onClick={toggleMenu}>
    //         <span className="navbar-toggler-icon" />
    //       </button>

    //       <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
    //         id="navbarSupportedContent" >

    //         <div className="mobile-close-btn d-lg-none">
    //           <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
    //         </div>

    //         <ul className="navbar-nav mx-auto mb-2 mb-lg-0  gap-lg-2 gap-sm-0">
    //           <li className="nav-item">
    //             <Link to="/#capabilities" className="nav-link active" onClick={closeMenu}>
    //               Capabilities
    //             </Link>
    //           </li>

    //           <li className="nav-item">
    //             <Link className="nav-link" to="/#ecosystem" onClick={closeMenu}>
    //               Ecosystem
    //             </Link>
    //           </li>

    //           <li className="nav-item">
    //             <Link className="nav-link" to="/#security" onClick={closeMenu}>
    //               Security
    //             </Link>
    //           </li>

    //           <li className="nav-item">
    //             <Link className="nav-link" to="/#governance" onClick={closeMenu}>
    //               Governance
    //             </Link>
    //           </li>


    //         </ul>


    //         <div className="d-flex align-items-center gap-2 dc-nw-btn">
    //           {localStorage.getItem('token')?
    //           <Link to='/request-list' className=" dc-thm-btn">Go To Dashboard →</Link>
    //           :
    //           <Link to='/login' className=" dc-thm-btn">Join Free Now →</Link>}

    //         </div>
    //       </div>
    //     </div>
    //     {menuOpen && <div className="hp-mobile-overlay" onClick={closeMenu}></div>}
    //   </nav>
    // </header>

  )
}

export default LandingHeader
