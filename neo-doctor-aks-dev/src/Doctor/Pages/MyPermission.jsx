import { PiTagChevronFill } from "react-icons/pi";
import { updateApiData } from "../../Services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../Loader/Loader";
;

function MyPermission() {
    const userId = localStorage.getItem("userId");
    const {permissions}=useSelector(state=>state.doctor)
    const storedPermission = JSON.parse(sessionStorage.getItem("permission")) || {};
    const { id: permissionId, name } = useParams();
    const navigate = useNavigate();




    return (

        <>


            {permissions?<div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">My Permission </h5>
                </div>
                <div className="all-profile-data-bx">
                    <div className="submega-main-bx">
                        <form >
                            <div className="permission-check-main-bx my-3">
                                <h4><PiTagChevronFill /> Appointment Management</h4>
                                <ul className="permision-check-list">
                                    {[
                                        ["appointmentAdd", "Add Appointment"],
                                        ["appointmentStatus", "Appointment Status"],
                                        ["appointmentVital", "Appointment Vital"],
                                        ["appointmentPayment", "Appointment Payment"]
                                    ].map(([key, label]) => (
                                        <li key={key}>
                                            <div className="form-check custom-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={permissions[key]}
                                                />
                                                <label className="form-check-label">{label}</label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Prescription */}
                            <div className="permission-check-main-bx my-3">
                                <h4><PiTagChevronFill /> Prescription Management</h4>
                                <ul className="permision-check-list">
                                    {[
                                        ["addPrescription", "Add Prescription"],
                                        ["editPrescription", "Edit Prescription"],
                                    ].map(([key, label]) => (
                                        <li key={key}>
                                            <div className="form-check custom-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={permissions[key]}
                                                />
                                                <label className="form-check-label">{label}</label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Lab */}
                            <div className="permission-check-main-bx my-3">
                                <h4><PiTagChevronFill /> Lab Test Management</h4>
                                <div className="form-check custom-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={permissions?.addLabTest}
                                    />
                                    <label className="form-check-label">Add Lab Test</label>
                                </div>
                            </div>

                            {/* Chat */}
                            <div className="permission-check-main-bx my-3">
                                <h4><PiTagChevronFill /> Chat Management</h4>
                                <div className="form-check custom-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={permissions?.chat}
                                    />
                                    <label className="form-check-label">Chat</label>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <div className="text-end">
                                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                                </div>

                            </div>

                        </form>
                    </div>

                </div>
            </div>:
            <Loader/>}







        </>



    );
}

export default MyPermission;
