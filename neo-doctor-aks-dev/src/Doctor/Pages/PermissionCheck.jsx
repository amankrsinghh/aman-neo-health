import { PiTagChevronFill } from "react-icons/pi";
import { updateApiData } from "../../Services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
;

function PermissionCheck() {
    const userId = localStorage.getItem("userId");
    const storedPermission = JSON.parse(sessionStorage.getItem("permission")) || {};
    const { id: permissionId, name } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        permissionId,
        ownerId: userId,
        name,
        doctor: {
            appointmentAdd: false,
            addPrescription: false,
            editPrescription: false,
            appointmentVital: false,
            appointmentPayment: false,
            addLabTest: false,
            appointmentStatus: false,
            chat: false,
        }
    });

    /* ✅ checkbox toggle */
    const handleChange = (key) => {
        setFormData(prev => ({
            ...prev,
            doctor: {
                ...prev.doctor,
                [key]: !prev.doctor[key]
            }
        }));
    };

    /* ✅ load existing permission */
    useEffect(() => {
        if (storedPermission?.permissions) {
            setFormData(prev => ({
                ...prev,
                permissionId,
                ownerId: userId,
                name,
                doctor: {
                    ...prev.doctor,
                    ...storedPermission.permissions
                }
            }));
        }
    }, []);

    /* ✅ submit update */
    const updateDoctorPermission = async (e) => {
        e.preventDefault();
        try {
            const response = await updateApiData("api/comman/permission", formData);
            if (response.success) {
                sessionStorage.removeItem("permission");
                toast.success("Permission updated");
                navigate(-1);
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    return (

        <>


            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0"> Permission Check</h5>
                </div>
                <div className="all-profile-data-bx">
                    <div className="submega-main-bx">
                        <form onSubmit={updateDoctorPermission}>
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
                                                    checked={formData.doctor[key]}
                                                    onChange={() => handleChange(key)}
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
                                                    checked={formData.doctor[key]}
                                                    onChange={() => handleChange(key)}
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
                                        checked={formData.doctor.addLabTest}
                                        onChange={() => handleChange("addLabTest")}
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
                                        checked={formData.doctor.chat}
                                        onChange={() => handleChange("chat")}
                                    />
                                    <label className="form-check-label">Chat</label>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <div className="text-end">
                                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                                </div>

                                <button type="submit" className="nw-filtr-thm-btn">Save</button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>







        </>



    );
}

export default PermissionCheck;
