import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faChevronRight, faClose, faCreditCard, faEdit, faFile, faGear, faUser, faCalendarCheck, faBell, faMapMarkerAlt, faTruck, faStethoscope, faFlask, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { IMAGE_BASE_URL } from "../../utils/config";
import { faPage4 } from "@fortawesome/free-brands-svg-icons";

function LeftSidebar() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/admin/profile");
        setAdmin(res.data.data);
      } catch {}
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const MenuItem = ({ to, icon, label }) => (
    <li className="nav-item">
      <NavLink to={to} className="nav-link">{icon} {label}</NavLink>
    </li>
  );

  const SubMenu = ({ id, icon, label, children }) => (
    <li className="nav-item">
      <NavLink to={`#${id}`} className="nav-link product-toggle"
        data-bs-toggle="collapse" role="button" aria-expanded="false"
        aria-controls={id} data-bs-parent=".nav">
        {icon} {label}
        <FontAwesomeIcon icon={faChevronRight} className="ms-auto toggle-admin-icon" />
      </NavLink>
      <ul className="product-submenu collapse" id={id} data-bs-parent=".nav">
        {children}
      </ul>
    </li>
  );

  const Sub = ({ to, label }) => (
    <li className="nav-item"><NavLink to={to} className="nav-link submenu-link">{label}</NavLink></li>
  );

  return (
    <div className="dashboard-left-side text-white min-vh-100 flex-shrink-0">
      <div className="text-end admn-mob-close-bx">
        <NavLink href="#" className="d-lg-none tp-mobile-close-btn mb-3 fs-6 text-black">
          <FontAwesomeIcon icon={faClose} />
        </NavLink>
      </div>

      <div className="task-vendr-left-title-bx">
        <div className="dashboard-logo-tp d-flex justify-content-center align-items-center">
          <h4 className="mb-0">
            <NavLink to="/" className="dash-hp-title"><img src="/logo.png" alt="" /></NavLink>
          </h4>
        </div>
      </div>

      <div className="d-flex flex-column p-3">
        <div className="left-navigation flex-grow-1 overflow-auto">
          <ul className="nav flex-column mt-lg-3">

            {/* Dashboard */}
            <MenuItem to="/" icon={<FontAwesomeIcon icon={faBorderAll} />} label="Dashboard" />

            {/* Request Management */}
            <SubMenu id="reqMgmtSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Request Management">
              <Sub to="/doctor-request"     label="Doctor Request" />
              <Sub to="/laboratory-request" label="Laboratory Request" />
              <Sub to="/pharmacy-request"   label="Pharmacy Request" />
              <Sub to="/hospital-request"   label="Hospital Request" />
              {/* <Sub to="/edit-request"       label="Edit Requests" /> */}
              <Sub to="/medicine-request" label="Medicine Request" />
            </SubMenu>

            {/* User Management */}
            <SubMenu id="userMgmtSubmenu" icon={<FontAwesomeIcon icon={faUser} />} label="User Management">
              <Sub to="/patients"       label="Patients" />
              <Sub to="/doctor-list"    label="Doctors" />
              <Sub to="/laboratory-list" label="Laboratories" />
              <Sub to="/pharmacy-list"  label="Pharmacies" />
              <Sub to="/hospital-list"  label="Hospitals" />
            </SubMenu>

            {/* Appointments */}
            <SubMenu id="apptSubmenu" icon={<FontAwesomeIcon icon={faCalendarCheck} />} label="Appointments">
              <Sub to="/doctor-appointment"    label="Doctor Appointments" />
              <Sub to="/lab-appointment"       label="Lab Appointments" />
            </SubMenu>

            {/* Card Generator */}
            <MenuItem to="/neo-card" icon={<FontAwesomeIcon icon={faCreditCard} />} label="Card Generator" />

            {/* Edit Requests */}
            <SubMenu id="editReqSubmenu" icon={<FontAwesomeIcon icon={faEdit} />} label="Edit Requests">
              <Sub to="/patient-edit-request"     label="Patient Request" />
              <Sub to="/doctor-edit-request"      label="Doctor Request" />
              <Sub to="/laboratory-edit-request"  label="Laboratory Request" />
              <Sub to="/pharmacy-edit-request"    label="Pharmacy Request" />
              <Sub to="/hospital-edit-request"    label="Hospital Request" />
            </SubMenu>

            {/* Pages / Content */}
            <SubMenu id="pagesMgmtSubmenu" icon={<FontAwesomeIcon icon={faGear} />} label="Pages">
              <Sub to="/user-profile"   label="User Profile" />
              <Sub to="/blogs"          label="Blogs" />
              <Sub to="/faqs"           label="FAQs" />
              <Sub to="/social"         label="Social Links & Contact" />
              {/* <Sub to="/cms-page-list"  label="CMS Pages" /> */}
              <Sub to="/notification"   label="Notifications" />
            </SubMenu>
            <MenuItem to="/schedule-medicines" icon={<FontAwesomeIcon icon={faBorderAll} />} label="Schedule medicines" />
            <MenuItem to="/landing/patient-test-category" icon={<FontAwesomeIcon icon={faBorderAll} />} label="Test Category" />

            {/* <SubMenu id="catSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Test Categories">
              <Sub to="/landing/patient-test-category"   label="Test Category" />
              <Sub to="/landing/sub-test-category"   label="Sub Test Category" />
            </SubMenu> */}
            
            {/* Pages / Content */}
            <SubMenu id="cmsMgmtSubmenu" icon={<FontAwesomeIcon icon={faNoteSticky} />} label="CMS Pages">
              <Sub to="/cms-page-list?panel=website"   label="Website" />
              <Sub to="/cms-page-list?panel=hospital"          label="Hospital" />
              <Sub to="/cms-page-list?panel=lab"           label="Laboratory" />
              <Sub to="/cms-page-list?panel=doctor"         label="Doctor" />
              <Sub to="/cms-page-list?panel=patient"  label="Patient" />
              <Sub to="/cms-page-list?panel=pharmacy"   label="Pharmacy" />
            </SubMenu>
            <SubMenu id="contactQuerySubmenu" icon={<FontAwesomeIcon icon={faGear} />} label="Contact Query">
              <Sub to="/contact-query?panel=hospital"   label="Hospital" />
              <Sub to="/contact-query?panel=lab"          label="Lab" />
              <Sub to="/contact-query?panel=website"           label="Website" />
            </SubMenu>

            {/* Landing Pages */}
            {/* <SubMenu id="landingSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Landing Pages">
              <Sub to="/landing/doctor"   label="Doctor Landing" />
              <Sub to="/landing/hospital" label="Hospital Landing" />
              <Sub to="/landing/lab"      label="Laboratory Landing" />
              <Sub to="/landing/pharmacy" label="Pharmacy Landing" />
            </SubMenu> */}

            {/* <SubMenu id="pharSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Pharmacy Landing Pages">
              <Sub to="/landing/first-pharmacy"   label="First Section" />
              <Sub to="/landing/second-pharmacy"   label="Second Section" />
              <Sub to="/landing/third-pharmacy"   label="Third Section" />
              <Sub to="/landing/fourth-pharmacy"   label="Fourth Section" />
              <Sub to="/landing/fiveth-pharmacy"   label="Fiveth Section" />
            </SubMenu>
            <SubMenu id="labSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Lab Landing Pages">
              <Sub to="/landing/first-lab"   label="First Section" />
              <Sub to="/landing/second-lab"   label="Second Section" />
              <Sub to="/landing/third-lab"   label="Third Section" />
              <Sub to="/landing/fourth-lab"   label="Fourth Section" />
              <Sub to="/landing/fiveth-lab"   label="Fiveth Section" />
              <Sub to="/landing/six-lab"   label="Six Section" />
              <Sub to="/landing/seven-lab"   label="Seven Section" />
            </SubMenu>
            <SubMenu id="doctorSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Doctor Landing Pages">
              <Sub to="/landing/first-doctor"   label="First Section" />
              <Sub to="/landing/second-doctor"   label="Second Section" />
              <Sub to="/landing/third-doctor"   label="Third Section" />
              <Sub to="/landing/fourth-doctor"   label="Fourth Section" />
              <Sub to="/landing/fiveth-doctor"   label="Fiveth Section" />
            </SubMenu> */}
            <SubMenu id="patientSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Patient Landing Pages">
              <Sub to="/landing/first-patient"   label="Basic Information" />
               <Sub to="/landing/patient-speciality"   label="Doctor Category" />
              <Sub to="/landing/patient-services"   label="Services" />
              
              <Sub to="/landing/patient-hospital-category"   label="Hospital Category" />
              <Sub to="/landing/patient-pharmacy-category"   label="Pharmacy Category" />
              <Sub to="/landing/patient-how-it-work"   label="How It Works" />
              <Sub to="/landing/patient-testimonial"   label="Testimonial" />
              <Sub to="/landing/patient-banner"   label="Banner" />
            </SubMenu>
            <SubMenu id="hospitalSubmenu" icon={<FontAwesomeIcon icon={faFile} />} label="Landing Pages">
              <Sub to="/landing/hospital"   label="Hospital" />
               <Sub to="/landing/pharmacy"   label="Pharmacy" />
               <Sub to="/landing/laboratory"   label="Laboratory" />
               <Sub to="/landing/doctor"   label="Doctor" />
               <Sub to="/landing/website"   label="Main" />

            </SubMenu>

            {/* Location Management */}
            <SubMenu id="locationSubmenu" icon={<span>📍</span>} label="Location Management">
              <Sub to="/location/countries" label="🌍 Countries" />
              <Sub to="/location/states"    label="🏛️ States" />
              <Sub to="/location/cities"    label="🏙️ Cities" />
            </SubMenu>

            {/* Supplier Management */}
            <SubMenu id="supplierSubmenu" icon={<span>🧾</span>} label="Supplier Management">
              <Sub to="/suppliers"     label="📋 All Suppliers" />
              <Sub to="/suppliers/add" label="➕ Add Supplier" />
            </SubMenu>

            {/* Settings / Profile */}
            <SubMenu id="settingsSubmenu" icon={<FontAwesomeIcon icon={faGear} />} label="Settings">
              <Sub to="/user-profile"   label="Admin Profile" />
              <Sub to="/edit-profile"   label="Edit Profile" />
            </SubMenu>

            {/* Logout */}
            <li className="nav-item">
              <a href="#" className="nav-link" onClick={e => { e.preventDefault(); handleLogout(); }}>
                🚪 Logout
              </a>
            </li>

          </ul>
        </div>

        <div className="task-vendor-profile-crd mt-3">
          <NavLink to="/user-profile">
            <div className="task-vendor-profile-bx">
              <img src={admin?.image ? `${IMAGE_BASE_URL}${admin.image}` : "/user-avatar.png"} alt="" />
              <div>
                <h6 className="new_title fw-700 mb-0 text-black">{admin?.name || "Admin"}</h6>
                <p>#{admin?._id?.slice(-8) || "00000000"}</p>
              </div>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
export default LeftSidebar;
