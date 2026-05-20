import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBorderAll, faKitMedical, faArrowRightToBracket, faChevronUp, faChevronDown, faChevronLeft, faCircleXmark, faSearch, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FaUser } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDetail } from "../../Redux/features/doctor";
import base_url from "../../baseUrl";
import { IoMdQrScanner } from "react-icons/io";
import Scanner from "../../Doctor/Pages/Scanner";

function Header() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const handleLogout = () => {
        localStorage.clear()
        sessionStorage.clear()
        navigate('/')
    }
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [message, setMessage] = useState('')
    const { profiles, staffData,staffUser, isOwner, kyc, medicalLicense, allowEdit, aboutDoctor, educationWork, customId, isRequest } = useSelector(state => state.doctor)
    useEffect(() => {
        dispatch(fetchDoctorDetail())
    }, [dispatch])
    const handleDetected = (code) => {
        const id = code.includes('/') ? code.split('/').filter(Boolean).pop() : code;
        navigate(`/user/${id}`);
        // Close the modal
        const modalElement = document.getElementById('scanner-Request');
        if (modalElement) {
            const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
        }
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);



    const [menuOpen, setMenuOpen] = useState(false);
    // Mobile view no scroll
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [menuOpen]);

    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 70);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);




    return (
        <>
            <header className={`tp-header-section ${isSticky ? "tp-header-sticky" : ""}`}>
                <nav className="navbar navbar-expand-lg navbar-light-box nw-header-bx" ref={headerRef}>
                    <div className="container">
                        <div className="collapse navbar-collapse">
                            <div className="d-flex aling-items-center flex-grow-1">
                                <div className="d-flex  align-items-center ">
                                    <Link to='/' className="header-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> <span className="mobile-name-title">Back to home</span> </Link>
                                    {/* <div className="top-header-icon tp-header-search-br ">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="custom-frm-bx mb-0 position-relative">
                                            <input
                                                type="email"
                                                className="form-control headr-search-table-frm ps-5"
                                                id="email"
                                                placeholder=""
                                                required
                                            />
                                            <div className="tp-search-bx">
                                                <button className="tp-search-btn2 text-secondary">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                </div>

                                <div className="d-flex align-items-center flex-grow-1 justify-content-end  gap-2">
                                    <div>
                                        <Link to="/add-patient" className="rq-scan-btn">
                                            <img src="white-plus.png" alt="" width={25} height={25} /> Patient
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/add-appointment" className="rq-scan-btn">
                                            <img src="white-plus.png" alt="" width={25} height={25} /> Appointment
                                        </Link>
                                    </div>
                                    <div>
                                        <button className="rq-scan-btn" data-bs-toggle="modal" data-bs-target="#scanner-Request" ><IoMdQrScanner className="fz-18" /> <span className="mobile-name-title">SCAN</span> </button>
                                    </div>
                                    <div>
                                        <a href="javascript:void(0)" className="nw-custom-btn nw-bell-btn doctor-bell-icon"> <FontAwesomeIcon icon={faBell} /> </a>
                                    </div>

                                    <div className="header-user dropdown tp-right-admin-details d-flex align-items-center" ref={dropdownRef}>
                                        <a
                                            href="#"
                                            className="user-toggle d-flex align-items-center"
                                            id="userMenu"
                                            data-bs-toggle="dropdown"
                                            aria-expanded={open}
                                            onClick={() => setOpen(!open)}
                                        >
                                            <div className="admn-icon me-2">
                                                <img src={isOwner ?
                                                    `${base_url}/${profiles?.profileImage}` : `${base_url}/${staffData?.profileImage}`} alt="" />
                                            </div>

                                            <div className="profile-info me-1">
                                                <h4 className="profile-name text-white fw-700"><span className="mobile-name-title">{isOwner ? profiles?.name : staffUser?.name}</span></h4>
                                                <p className="profile-id"><span className="mobile-name-title">{isOwner ? 'Doctor' : 'Staff'}</span></p>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={open ? faChevronUp : faChevronDown}
                                                className="location-active-icon"
                                            />
                                        </a>

                                        <ul
                                            className="dropdown-menu dropdown-menu-end user-dropdown  p-0 rounded-3"
                                            aria-labelledby="userMenu"
                                            onClick={() => setOpen(false)}
                                            onBlur={() => setOpen(false)}
                                        >
                                            <div className="profile-card-box">
                                                <div className="profile-top-section">
                                                    <img src={isOwner ?
                                                        `${base_url}/${profiles?.profileImage}` : `${base_url}/${staffData?.profileImage}`} alt="Profile" className="profile-image" />
                                                    <div className="profile-info">
                                                        <h4 className="profile-name">{isOwner ? profiles?.name : staffUser?.name}</h4>
                                                        {<p className="profile-id">{isOwner ? 'Doctor' : 'Staff'}</p>}
                                                    </div>
                                                </div>

                                                <ul className="head-list">
                                                    <li className="head-item">
                                                        <Link to="/request-list" className="head-nav-link">
                                                            <FontAwesomeIcon icon={faBorderAll} /> Dashboard
                                                        </Link>
                                                    </li>

                                                    <li className="head-item">
                                                        <Link to='/appointment-list' className="head-nav-link">
                                                            <FontAwesomeIcon icon={faKitMedical} /> My Appointment
                                                        </Link>
                                                    </li>

                                                    <li className="head-item">
                                                        <button type="button" onClick={handleLogout} className="head-nav-link">
                                                            <FontAwesomeIcon icon={faArrowRightToBracket} /> Logout
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </nav>
            </header>


            <div className="modal step-modal fade" id="scanner-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5 p-4">

                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="lg_title mb-0">Scan </h6>
                            </div>
                            <div>
                                <button type="button" className="fz-18" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-0">
                            <div className="row ">
                                <div className="col-lg-12">
                                    <Scanner onDetected={handleDetected} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Header