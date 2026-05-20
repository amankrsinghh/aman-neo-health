import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCheck, faTimes, faSearch, faBell, faBorderAll, faKitMedical, faArrowRightToBracket, faChevronUp, faChevronDown, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import base_url from "../../baseUrl";
import { fetchPatientDetail } from "../../Redux/features/patient";
import { getSecureApiData } from "../../Services/api";
import Autocomplete from "react-google-autocomplete";

function HeaderSecond() {
    const [menuOpen, setMenuOpen] = useState(false);
    const userId = localStorage.getItem('userId')
    const [selectedLocation, setSelectedLocation] = useState(
        localStorage.getItem('location') || ''
    );

    const locations = ["Jaipur, India", "Delhi, India", "Mumbai, India"];

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch()
    const [userData, setUserData] = useState()
    const [role, setRole] = useState()

    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])
    useEffect(() => {
        if (userId) {
            getUserData()
        }
    }, [userId])

    async function getUserData() {
        try {
            const res = await getSecureApiData(`user/${userId}`)
            if (res?.success) {
                setUserData(res.data)
                setRole(res.data.role);
            }
        } catch (error) {
        }
    }

    const profiles = useSelector(state => {
        if (role === 'patient') return state.patient.profiles;
        if (role === 'doctor') return state.doctor.profiles;
        return null;
    });
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

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
            setIsSticky(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>

            <header className={`tp-header-section ${isSticky ? "tp-header-sticky" : ""}`}>

                <nav className="navbar navbar-expand-lg navbar-light-box py-lg-0 py-2" ref={headerRef}>
                    <div className="container">
                        <NavLink className="navbar-brand me-0" to="/">
                            <img src="/logo.png" alt="Logo" className="logo-img" />
                        </NavLink>


                        {/* <button className="navbar-toggler" type="button" onClick={toggleMenu}>
                        <span className="navbar-toggler-icon" />
                    </button> */}


                        {/* Login Hone Ke Baad */}
                        {userId && (
                            <div className="d-lg-none">
                                <div className="d-flex align-items-center gap-2">
                                    <div>
                                        <Link to='/notification' className="nw-custom-btn nw-bell-btn"> <FontAwesomeIcon icon={faBell} /> </Link>
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
                                                <img src={profiles?.profileImage ?
                                                    `${base_url}/${profiles?.profileImage}` : "/call-pic.jpg"} alt="" />
                                            </div>

                                            <div className="profile-info me-1">
                                                <span className="user-mobile-name">
                                                    <h4 className="profile-name text-ellipse">{profiles?.name?.length > 8 ? profiles?.name?.slice(0, 8) : profiles?.name}</h4>
                                                    <p className="profile-id text-capitalize">{role}</p>
                                                </span>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={open ? faChevronUp : faChevronDown}
                                                className="location-active-icon"
                                                style={{ color: '#052F59' }}
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
                                                    <img src={profiles?.profileImage ?
                                                        `${base_url}/${profiles?.profileImage}` : "/call-pic.jpg"} alt="Profile" className="profile-image" />
                                                    <div className="profile-info">
                                                        <h4 className="profile-name">{profiles?.name}</h4>
                                                        <p className="profile-id text-capitalize">{role}</p>
                                                    </div>
                                                </div>
                                                <ul className="head-list">
                                                    <li className="head-item">
                                                        <Link to={role == "patient" ? '/my-appointment' : "/doctor/request-list"} className="head-nav-link">
                                                            <FontAwesomeIcon icon={faBorderAll} /> Dashboard
                                                        </Link>
                                                    </li>
                                                    <li className="head-item">
                                                        <Link to={role == 'patient' ? '/my-appointment' : '/doctor/appointment-list'} className="head-nav-link">
                                                            <FontAwesomeIcon icon={faKitMedical} /> My Appointment
                                                        </Link>
                                                    </li>
                                                    <li className="head-item">
                                                        <Link to='/' onClick={() => {
                                                            localStorage.clear()
                                                            sessionStorage.clear()
                                                        }} className="head-nav-link">
                                                            <FontAwesomeIcon icon={faArrowRightToBracket} /> Logout
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!userId && (
                            <button className="navbar-toggler" onClick={toggleMenu}>
                                <span className="navbar-toggler-icon" />
                            </button>
                        )}


                        <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
                            id="navbarSupportedContent"
                        >

                            <div className="mobile-close-btn d-lg-none">
                                <FontAwesomeIcon icon={faTimes} onClick={closeMenu} />
                            </div>

                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2 gap-sm-0">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link active" onClick={closeMenu}>
                                        Home
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to='/new-doctor-details' onClick={closeMenu}>
                                        Doctors
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/find-pharmacy' onClick={closeMenu}>
                                        Pharmacy
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to={'/find-hospital'} onClick={closeMenu}>
                                        Hospitals
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/find-labs" onClick={closeMenu}>
                                        Labs
                                    </Link>
                                </li>

                                {/* <li className="nav-item">
                                <a className="nav-link" href="#" onClick={closeMenu}>
                                    Book ambulance
                                </a>
                            </li> */}

                                <li className="nav-item">
                                    <Link className="nav-link" to="/about-us" onClick={closeMenu}>
                                        About
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/contact-us" onClick={closeMenu}>
                                        Contact
                                    </Link>
                                </li>
                            </ul>


                            <div className="d-flex align-items-center gap-2">
                                <div className="dropdown">

                                    <a
                                        href="#"
                                        className=" nw-address-btn"
                                        data-bs-toggle="dropdown"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <FontAwesomeIcon icon={faLocationDot} /> {selectedLocation}
                                    </a>
                                </div>

                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="d-flex align-items-centet gap-2">
                                            <div className="dropdown">
                                                <a
                                                    href="javascript:void(0)"
                                                    className="nw-custom-btn"
                                                    id="acticonMenu1"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </a>
                                                <ul
                                                    className="dropdown-menu dropdown-menu-end nw-search-dropdown"
                                                    aria-labelledby="acticonMenu1"
                                                >
                                                    <div className="custom-frm-bx">
                                                        <Autocomplete
                                                            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                                                            placeholder="Type city or location..."
                                                            className="form-control new-control-frm"
                                                            options={{
                                                                types: ["(cities)"],   // 👈 only cities
                                                                componentRestrictions: { country: "in" } // optional
                                                            }}
                                                            onPlaceSelected={(place) => {
                                                                const city =
                                                                    place.address_components?.find(c =>
                                                                        c.types.includes("locality")
                                                                    )?.long_name;

                                                                setSelectedLocation(city || place.formatted_address);
                                                                localStorage.setItem('location', city)
                                                            }}

                                                        />
                                                        {/* <div className="adm-search-bx">
                                                        <button className="tp-search-btn text-secondary">
                                                            <FontAwesomeIcon icon={faSearch} />
                                                        </button>
                                                    </div> */}
                                                    </div>

                                                    {/* <div className="location-box">
                                                    <div className="current-location-bx">
                                                        <span> <FontAwesomeIcon icon={faLocationCrosshairs} /> </span>
                                                        <div>
                                                            <h4>Get current location </h4>
                                                            <p>Using GPS</p>
                                                        </div>
                                                    </div>
                                                </div> */}

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Link to='/notification' className="nw-custom-btn nw-bell-btn"> <FontAwesomeIcon icon={faBell} /> </Link>
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
                                            <img src={profiles?.profileImage ?
                                                `${base_url}/${profiles?.profileImage}` : "/profile.jpg"} alt=""
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/profile.png";
                                                }} />
                                        </div>

                                        <div className="profile-info me-1">
                                            <span className="user-mobile-name">
                                                <h4 className="profile-name text-ellipse">{profiles?.name?.length > 8 ? profiles?.name?.slice(0, 8) : profiles?.name}</h4>
                                                <p className="profile-id text-capitalize">{role}</p>
                                            </span>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={open ? faChevronUp : faChevronDown}
                                            className="location-active-icon"
                                            style={{ color: '#052F59' }}
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
                                                <img src={profiles?.profileImage ?
                                                    `${base_url}/${profiles?.profileImage}` : "/profile.png"} alt="Profile" className="profile-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/profile.png";
                                                    }} />
                                                <div className="profile-info">
                                                    <h4 className="profile-name">{profiles?.name}</h4>
                                                    <p className="profile-id text-capitalize">{role}</p>
                                                </div>
                                            </div>
                                            <ul className="head-list">
                                                <li className="head-item">
                                                    <Link to={role == "patient" ? '/my-appointment' : "/doctor/request-list"} className="head-nav-link">
                                                        <FontAwesomeIcon icon={faBorderAll} /> Dashboard
                                                    </Link>
                                                </li>
                                                <li className="head-item">
                                                    <Link to={role == 'patient' ? '/my-appointment' : '/doctor/appointment-list'} className="head-nav-link">
                                                        <FontAwesomeIcon icon={faKitMedical} /> My Appointment
                                                    </Link>
                                                </li>
                                                <li className="head-item">
                                                    <Link to='/' onClick={() => {
                                                        localStorage.clear()
                                                        sessionStorage.clear()
                                                    }} className="head-nav-link">
                                                        <FontAwesomeIcon icon={faArrowRightToBracket} /> Logout
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                {menuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

            </header>


        </>
    )
}

export default HeaderSecond