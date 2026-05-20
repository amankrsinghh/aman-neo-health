import { useEffect } from "react";
import Router from "./Components/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initFCM } from "./utils/initFCM";

function App() {


   useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      // console.log(token)
      // initFCM(); 
    }
  }, []);

  return (
    <>
      <Router />

      {/* 🔔 GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;
