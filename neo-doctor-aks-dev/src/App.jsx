
// import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
// import Header from './page/header/Header.jsx'
// import Footer from './page/header/footer.jsx'
// import Home from './page/Home'
// import Doctorlisting from './page/Doctorlisting'
// import DoctorDetails from './page/Doctor-Details'
// import Datetime from './page/Date time'
// import Doctorlistings  from './page/Doctor listing'

import { ToastContainer } from "react-toastify";
import Router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GlobalCallListener from "./Components/GlobalCallModal";
import { SocketProvider } from "./Context/SocketContext";
import { CallProvider } from "./Context/CallContext";
import CallModal from "./Components/CallModal";
import { GlobalSocketProvider } from "./Utils/useGlobalSocket";
import GlobalCallUI from "./Utils/GlobalCallUi";


function App() {
  return (
    <>
      {/* <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Doctor-listing" element={<Doctorlisting />} />
          <Route path="/Doctor-Details" element={<DoctorDetails />} />
          <Route path="/Date-time" element={<Datetime />} />
          <Route path="/Doctor-listings" element={<Doctorlistings />} />
        </Routes>
        <Footer />
      </BrowserRouter> */}
      <GlobalSocketProvider>
      <GlobalCallUI />

          <Router />
        <ToastContainer />
        </GlobalSocketProvider>

    </>
  );
}

export default App;
