import { Outlet, useLocation } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import TopHeader from "./TopHeader"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEmpDetail, fetchUserDetail } from "../../redux/feature/userSlice";

function AppLayout() {
  const dispatch=useDispatch()
  const location = useLocation();
  const path = location.pathname;
  const staticRoute = ['/login', '/wating-for-approval', '/forgot-password', '/otp', '/set-password', '/create-account', '/create-account-image', '/create-account-address', '/create-account-person', '/create-account-upload','/']
  useEffect(() => {
  const isOwner = localStorage.getItem('isOwner');

  if (isOwner === 'true') {
    dispatch(fetchUserDetail());
  } else if (isOwner === 'false') {
    dispatch(fetchEmpDetail(localStorage.getItem('staffId')));
  }
}, [dispatch]);


  return (
    <>
      <div className="all-tp-main-section">
        {!staticRoute.includes(path) && < LeftSidebar />}
        <div className="dashboard-right-side flex-grow-1 d-flex flex-column">
          {!staticRoute.includes(path) && <TopHeader />}
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AppLayout