import { Outlet, useLocation, useNavigate } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import TopHeader from "./TopHeader"


function AppLayout() {
  const location = useLocation();
  const path = location.pathname;
  const staticRoute = ['/login']
  const navigate = useNavigate()

  return (
    <>
      <div className="all-tp-main-section">
        {!staticRoute.includes(path) && < LeftSidebar />}
        <div className="dashboard-right-side flex-grow-1 d-flex flex-column">
          {!staticRoute.includes(path) && <TopHeader />}
          <Outlet />
          {/* {!staticRoute.includes(path) && (
            <div className="go-back-wrapper">
              <button
                onClick={() => navigate(-1)}
                className="nw-thm-btn"
              >
                ← Go Back
              </button>
            </div>
          )} */}
        </div>
      </div>
    </>
  )
}

export default AppLayout