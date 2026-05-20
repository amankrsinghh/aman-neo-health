import { useState } from "react";
import FivethPharPage from "../PharmacyLanding/FivethPhar";
import FourthPharPage from "../PharmacyLanding/Fourth";
import ThirdPharPage from "../PharmacyLanding/ThirdPhar";
import SecondPharPage from "../PharmacyLanding/SecondPhar";
import FirstPharPage from "../PharmacyLanding/FirstPhar";
import FirstDoctorPage from "../Doctor Landing/FirstDoctor";
import SecondDoctorPage from "../Doctor Landing/SecondDoctor";
import ThirdDoctorPage from "../Doctor Landing/ThirdDoctor";
import FourthDoctorPage from "../Doctor Landing/FourthPage";
import FivethDoctorPage from "../Doctor Landing/FivethDoctor";

function DoctorLandingFull() {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <h3 className="gradient-text mb-3">Doctor Landing Page</h3>
      <div className="employee-tabs">
        <ul className="nav nav-tabs gap-3 ps-2">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "first" ? "active" : ""}`}
              onClick={() => setActiveTab("first")}
            >
              First
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "second" ? "active" : ""}`}
              onClick={() => setActiveTab("second")}
            >
              Second
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "third" ? "active" : ""}`}
              onClick={() => setActiveTab("third")}
            >
              Third
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "fourth" ? "active" : ""}`}
              onClick={() => setActiveTab("fourth")}
            >
              Fourth
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "fiveth" ? "active" : ""}`}
              onClick={() => setActiveTab("fiveth")}
            >
              Fiveth
            </button>
          </li>


        </ul>
      </div>

      {/* 👇 Tab Content */}
      <div className="mt-4">
        {activeTab === "first" && <FirstDoctorPage />}
        {activeTab === "second" && <SecondDoctorPage />}
        {activeTab === "third" && <ThirdDoctorPage />}
        {activeTab === "fourth" && <FourthDoctorPage />}
        {activeTab === "fiveth" && <FivethDoctorPage />}
      </div>
    </div>
  );
}

export default DoctorLandingFull;