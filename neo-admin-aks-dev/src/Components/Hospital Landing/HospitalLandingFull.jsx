import { useState } from "react";
import FirstHospitalPage from "./FirstHospital";
import SecondHospitalPage from "./SecondHospital";
import ThirdHospitalPage from "./ThirdHospital";
import SecurityHospitalPage from "./Security";
import InteroperabilityHospitalPage from "./Interoperability";
import DeployementHospitalPage from "./Deployement";

function HospitalLandingFull() {
    const [activeTab, setActiveTab] = useState("hero");

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <h3 className="gradient-text mb-3">Hospital Landing Page</h3>
            <div className="employee-tabs">
                <ul className="nav nav-tabs gap-3 ps-2">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "hero" ? "active" : ""}`}
                            onClick={() => setActiveTab("hero")}
                        >
                            Hero Section
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "features" ? "active" : ""}`}
                            onClick={() => setActiveTab("features")}
                        >
                            Features
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "role" ? "active" : ""}`}
                            onClick={() => setActiveTab("role")}
                        >
                            Role-Based
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "security" ? "active" : ""}`}
                            onClick={() => setActiveTab("security")}
                        >
                            Security
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "interop" ? "active" : ""}`}
                            onClick={() => setActiveTab("interop")}
                        >
                            Interoperability
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "deploy" ? "active" : ""}`}
                            onClick={() => setActiveTab("deploy")}
                        >
                            Deployment
                        </button>
                    </li>
                </ul>
            </div>

            {/* 👇 Tab Content */}
            <div className="mt-4">
                {activeTab === "hero" && <FirstHospitalPage />}
                {activeTab === "features" && <SecondHospitalPage />}
                {activeTab === "role" && <ThirdHospitalPage />}
                {activeTab === "security" && <SecurityHospitalPage />}
                {activeTab === "interop" && <InteroperabilityHospitalPage />}
                {activeTab === "deploy" && <DeployementHospitalPage />}
            </div>
        </div>
    );
}

export default HospitalLandingFull;