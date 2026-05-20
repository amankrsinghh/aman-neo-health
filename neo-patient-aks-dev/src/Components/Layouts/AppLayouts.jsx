import { matchPath, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HeaderSecond from "./HeaderSecond";
import NotificationHandler from "./NotificationHandler";
import LeftSideBar from "./LeftSideBar";
import { useEffect } from "react";
function AppLayouts() {
  const location = useLocation();
  const path = location.pathname;
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (userId && role !== 'patient') {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("doctorId");
      localStorage.removeItem("staffId");
      window.location.href = "/login";
    }
  }, [userId, role]);

  const staticRoutes = [
    '/congratulations', '/forgot-password', '/near-by-doctor', '/book-appointment/:id',
    '/doctor-pending', '/login', '/otp', '/set-password', '/create-account', '/kyc',
    '/personal-info', '/medical-history', '/family-medical-history', '/select-account-type',
    '/prescriptions-reports', '/doctor/login', '/doctor/forgot-password', '/doctor/otp',
    '/doctor/set-password', '/doctor/medical-license', '/doctor/create-account',
    '/doctor/kyc', '/doctor/address-about', '/doctor/education-work',
    '/doctor/select-type', '/doctor/kyc-message', '/doctor/clinic', ''
  ];




  const renderHeader = () => {
    if (userId && role === 'patient') return <HeaderSecond />;
    return <Header />;
  };
  const isStaticRoute = staticRoutes.includes(path);
  const patientRoutes = ['/my-appointment', '/lab-report', '/prescription', '/profile', '/edit-profile', '/health-card-details',
    '/share-health-card', '/favorite', '/change-password', '/appointment-detail/:name/:id',
    '/lab-appointment-details/:name/:id'
  ]
  const isPatientRoute = patientRoutes.some((route) =>
    matchPath({ path: route, end: true }, path)
  );


  return (
    <>
      <NotificationHandler />

      <div className="app-layout">
        {!staticRoutes.includes(path) && renderHeader()}
        <div className={`page-content ${isPatientRoute && "my-5"}`}>
          {isPatientRoute ?<div className="container">
            <div className="row">
              {isPatientRoute &&
                <div className="col-lg-3 mb-lg-0 mb-3">
                  <LeftSideBar />
                </div>}
              <div className={!isPatientRoute ? "col-12" : "col-lg-9 col-sm-12"}>
                <Outlet />
              </div>
            </div>
          </div>:
          <Outlet/>}
        </div>
        {!staticRoutes.includes(path) && <Footer />}
      </div>
    </>
  );
}


export default AppLayouts;
