import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import NotificationHandler from "./NotificationHandler";
import LeftSidebar from "./LeftSidebar";

function AppLayouts() {
  const location = useLocation();
  const path = location.pathname;

  const staticRoutes = [
    '/congratulations',
    '/forgot-password',
    '/near-by-doctor',
    '/book-appointment',
    '/doctor-pending',
    '/login',
    '/otp',
    '/set-password',
    '/create-account',
    '/kyc',
    '/personal-info',
    '/medical-history',
    '/family-medical-history',
    '/select-account-type',
    '/prescriptions-reports',
    '/medical-license',
    '/address-about',
    '/education-work',
    '/select-type',
    '/kyc-message',
    '/clinic',
    '/'
  ];

  const isStaticRoute = staticRoutes.includes(path);
  const isFullWidthRoute =
    isStaticRoute || path === "/neo-ai" || path === "/chat";

  return (
    <>
      <NotificationHandler />

      <div className="app-layout">
        {!isStaticRoute && <Header />}

        <div className="page-content pt-5">
          <div className="container">
            <div className="row">
              {/* Sidebar */}
              {!isFullWidthRoute && (
                <div className="col-lg-3 col-sm-12 mb-3">
                  <LeftSidebar />
                </div>
              )}
              {/* Main Content */}
              <div className={isFullWidthRoute ? "col-12" : "col-lg-9 col-sm-12 mb-3"}>
                <Outlet />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppLayouts;