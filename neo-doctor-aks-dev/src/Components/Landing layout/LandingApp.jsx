import { Outlet, useLocation } from "react-router-dom";
import LandingFooter from "./Footer";
import LandingHeader from "./Header";
import ScrollToHash from "./ScrollToHash";

function LandingApp() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <>
        

           <div className="doctor-app-layout">
    <ScrollToHash />
    <LandingHeader />

    <main className="doctor-layout-content">
        <Outlet />
    </main>

    <LandingFooter />
</div>

        </>
    );
}

export default LandingApp;