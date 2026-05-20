import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { PiTagChevronFill } from "react-icons/pi";
import { updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";

const defaultPermissions = {
    doctors: {
        list: false,
        add: false,
        edit: false,
        view: false,
        delete: false,
    },
    appointments: {
        list: false,
        add: false,
        view: false,
        cancel: false,
        addPrescription: false,
        editPrescription: false,
    },
    beds: {
        add: false,
        addAllotment: false,
        editAllotment: false,
        addPayment: false,
        dischargePatient: false,
        delete: false,
    },
    patients: {
        list: false,
        add: false,
        edit: false,
        view: false,
        delete: false,
    },
    staff: {
        list: false,
        add: false,
        edit: false,
        view: false,
        delete: false,
    },
    pharmacy: {
        listInventory: false,
        addInventory: false,
        editInventory: false,
        deleteInventory: false,
    },
    chat: {
        access: false,
    },
};

function PermissionCheck() {
    const navigate = useNavigate()
    const { permissionId, name } = useParams()
    const [loading, setLoading] = useState(true)
    const [step1, setStep1] = useState(false)
    const [step2, setStep2] = useState(false)
    const [step3, setStep3] = useState(false)
    const [step4, setStep4] = useState(false)
    const [step5, setStep5] = useState(false)
    const [step6, setStep6] = useState(false)

    const permission = JSON.parse(sessionStorage.getItem('permission'))
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id
    const [permissions, setPermissions] = useState({
        permissionId, name,
        ownerId: userId,
        ...defaultPermissions
    });
    useEffect(() => {
        if (permission && Object.keys(permission).length > 0) {
            const data = permission?.permissions
            setPermissions(prev => ({
                ...prev,
                permissionId,
                name,
                ownerId: userId,
                doctors: { ...defaultPermissions.doctors, ...data?.doctors },
                appointments: { ...defaultPermissions.appointments, ...data?.appointments },
                beds: { ...defaultPermissions.beds, ...data?.beds },
                patients: { ...defaultPermissions.patients, ...data?.patients },
                staff: { ...defaultPermissions.staff, ...data?.staff },
                lab: { ...defaultPermissions.lab, ...data?.lab },
                pharmacy: { ...defaultPermissions.pharmacy, ...data?.pharmacy },
                billing: { ...defaultPermissions.billing, ...data?.billing },
                chat: { ...defaultPermissions.chat, ...data?.chat },
            }));
            setLoading(false)
        }
    }, [permissionId,]);

    const handlePermissionChange = (module, action) => {
        setPermissions((prev) => ({
            ...prev,
            [module]: {
                ...prev[module],
                [action]: !prev[module][action],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            ownerId: userId,
            permissionId, name,
            hospital: {
                doctors: permissions.doctors,
                appointments: permissions?.appointments,
                beds: permissions?.beds,
                patients: permissions?.patients,
                staff: permissions?.staff,
                pharmacy: permissions?.pharmacy,
                lab: permissions?.lab,
                chat: permissions?.chat,
                billing: permissions?.billing,
            }
        }
        try {

            const response = await updateApiData(`api/comman/permission`, data);
            if (response.success) {
                sessionStorage.removeItem('permission')
                toast.success("Permission updated")
                navigate(-1)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {

            setLoading(false)
        }
    };

    const handleSelectAll = (module, checked) => {
        const updatedModule = Object.keys(permissions[module]).reduce((acc, key) => {
            acc[key] = checked;
            return acc;
        }, {});

        setPermissions(prev => ({
            ...prev,
            [module]: updatedModule
        }));
    };
    useEffect(() => {
        if (localStorage.getItem('doctorId')) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <form action="">
                        <div className="row mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="innr-title mb-2">Permission</h3>
                                    <div className="admin-breadcrumb">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb custom-breadcrumb">
                                                <li className="breadcrumb-item">
                                                    <a href="#" className="breadcrumb-link">
                                                        Dashboard
                                                    </a>
                                                </li>
                                                <li className="breadcrumb-item">
                                                    <a href="#" className="breadcrumb-link">
                                                        Permission Type
                                                    </a>
                                                </li>
                                                <li
                                                    className="breadcrumb-item active"
                                                    aria-current="page"
                                                >
                                                    Permission
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>



                    <div className="new-panel-card">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* Doctors */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <h4><PiTagChevronFill /> Doctors Management</h4>
                                            <div className="form-check custom-check">
                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.doctors).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("doctors", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>
                                        <ul className="permision-check-list">
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.doctors.list} onChange={() => handlePermissionChange("doctors", "list")} /><label className="form-check-label"> List View</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.doctors.add} onChange={() => handlePermissionChange("doctors", "add")} /><label className="form-check-label"> Add Doctor</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.doctors.edit} onChange={() => handlePermissionChange("doctors", "edit")} /><label className="form-check-label"> Edit Doctor</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.doctors.view} onChange={() => handlePermissionChange("doctors", "view")} /><label className="form-check-label"> View Doctor</label></div></li> */}
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.doctors.delete} onChange={() => handlePermissionChange("doctors", "delete")} /><label className="form-check-label"> Delete</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Appointment */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Appointment</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.appointments).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("appointments", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.list} onChange={() => handlePermissionChange("appointments", "list")} /><label className="form-check-label"> Appointment List</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.add} onChange={() => handlePermissionChange("appointments", "add")} /><label className="form-check-label"> Add Appointment</label></div></li>

                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.view} onChange={() => handlePermissionChange("appointments", "view")} /><label className="form-check-label"> View Appointment</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.status} onChange={() => handlePermissionChange("appointments", "status")} /><label className="form-check-label"> Status update</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.addPrescription} onChange={() => handlePermissionChange("appointments", "addPrescription")} /><label className="form-check-label"> Add Prescriptions</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.appointments.editPrescription} onChange={() => handlePermissionChange("appointments", "editPrescription")} /><label className="form-check-label"> Edit Prescriptions</label></div></li>
                                        </ul>
                                    </div>

                                    {/* Bed */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Bed Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.beds).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("beds", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.add} onChange={() => handlePermissionChange("beds", "add")} /> <label className="form-check-label">Add Bed </label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.viewDetails} onChange={() => handlePermissionChange("beds", "viewDetails")} /> <label className="form-check-label"> View Details</label></div>
                                            </li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.addAllotment} onChange={() => handlePermissionChange("beds", "addAllotment")} /> <label className="form-check-label"> Add Allotment</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.editAllotment} onChange={() => handlePermissionChange("beds", "editAllotment")} /> <label className="form-check-label"> Edit Allotment</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.dischargePatient} onChange={() => handlePermissionChange("beds", "dischargePatient")} /> <label className="form-check-label"> Discharge Patient</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.beds.delete} onChange={() => handlePermissionChange("beds", "delete")} /> <label className="form-check-label"> Delete Bed</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Patients */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Patient Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.patients).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("patients", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.patients.list} onChange={() => handlePermissionChange("patients", "list")} /> <label className="form-check-label"> Patients List</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.patients.add} onChange={() => handlePermissionChange("patients", "add")} /> <label className="form-check-label"> Add Patient</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.patients.edit} onChange={() => handlePermissionChange("patients", "edit")} /> <label className="form-check-label"> Edit Patient</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.patients.view} onChange={() => handlePermissionChange("patients", "view")} /> <label className="form-check-label"> View Patient</label></div></li> */}
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.patients.delete} onChange={() => handlePermissionChange("patients", "delete")} /> <label className="form-check-label"> Delete</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Staff */}
                                    {/* <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Staff Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.staff).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("staff", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>
                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.staff.list} onChange={() => handlePermissionChange("staff", "list")} /> <label className="form-check-label"> Staff List</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.staff.add} onChange={() => handlePermissionChange("staff", "add")} /> <label className="form-check-label"> Add Staff</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.staff.edit} onChange={() => handlePermissionChange("staff", "edit")} /> <label className="form-check-label"> Edit Staff</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.staff.view} onChange={() => handlePermissionChange("staff", "view")} /> <label className="form-check-label"> View Staff</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.staff.delete} onChange={() => handlePermissionChange("staff", "delete")} /> <label className="form-check-label"> Delete</label></div></li>
                                        </ul>
                                    </div> */}

                                    {/* Pharmacy */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Pharmacy Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.pharmacy).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("pharmacy", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.pharmacy.listInventory} onChange={() => handlePermissionChange("pharmacy", "listInventory")} /> <label className="form-check-label" > Medicine List</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.pharmacy.addInventory} onChange={() => handlePermissionChange("pharmacy", "addInventory")} /> <label className="form-check-label" > Add Medicine</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.pharmacy.editInventory} onChange={() => handlePermissionChange("pharmacy", "editInventory")} /> <label className="form-check-label" > Edit Medicine</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.pharmacy.deleteInventory} onChange={() => handlePermissionChange("pharmacy", "sellMedicine")} /> <label className="form-check-label" > Sell Medicine</label></div></li>
                                        </ul>
                                    </div>

                                    {/* Laboratory */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Laboratory Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object?.values(permissions?.lab).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("lab", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.addAppointment} onChange={() => handlePermissionChange("lab", "addAppointment")} />
                                                    <label className="form-check-label" > Add Appointment</label></div>
                                            </li>
                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.appointmentStatus} onChange={() => handlePermissionChange("lab", "appointmentStatus")} />
                                                    <label className="form-check-label" >Appointment Status</label>
                                                </div></li>
                                                <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.paymentStatus} onChange={() => handlePermissionChange("lab", "paymentStatus")} />
                                                    <label className="form-check-label" >Payment Status</label>
                                                </div></li>
                                                <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.addReport} onChange={() => handlePermissionChange("lab", "addReport")} />
                                                    <label className="form-check-label" > Generate Report</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.addTest} onChange={() => handlePermissionChange("lab", "addTest")} />
                                                    <label className="form-check-label" > Add Test</label></div></li>                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.editTest} onChange={() => handlePermissionChange("lab", "editTest")} /> <label className="form-check-label" > Edit Test</label></div></li>
                                        
                                        </ul>
                                    </div>

                                    {/* Payment  */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Billing Management</h4>
                                            <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissions.billing).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("billing", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div>
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.billing?.doctorPayment} onChange={() => handlePermissionChange("billing", "doctorPayment")} />
                                                    <label className="form-check-label" > Doctor Payment</label></div>
                                            </li>
                                            <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.billing?.labPayment} onChange={() => handlePermissionChange("billing", "labPayment")} />
                                                    <label className="form-check-label" > Lab Payment</label>
                                                </div></li>
                                                <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.billing?.allotmentPayment} onChange={() => handlePermissionChange("billing", "allotmentPayment")} />
                                                    <label className="form-check-label" >Allotment Payment</label>
                                                </div></li>
                                                <li>
                                            </li>
                                            
                                        </ul>
                                    </div>

                                    {/* Chat */}
                                    <div className="permission-check-main-bx my-4">
                                        <h4><PiTagChevronFill /> Chat</h4>
                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissions.chat.access} onChange={() => handlePermissionChange("chat", "access")} /><label className="form-check-label"> Chat</label></div></li>
                                        </ul>
                                    </div>

                                    <div className="text-end">
                                        <button type="submit" className="nw-filtr-thm-btn">Save</button>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
        </>
    )
}

export default PermissionCheck