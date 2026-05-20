import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { PiTagChevronFill } from "react-icons/pi";
import { updateApiData } from "../../Service/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmpDetail } from "../../redux/features/userSlice";

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

function MyPermissions() {
    const dispatch = useDispatch()
    const { permissionId, name } = useParams()
    const [loading, setLoading] = useState(false)
    const {permissions}=useSelector(state=>state.user)
    const permission = JSON.parse(sessionStorage.getItem('mypermission'))
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id
    const [permissionData, setPermissionData] = useState({
        permissionId, name,
        ownerId: userId,
        ...defaultPermissions
    });
    console.log(permissions)
    useEffect(() => {
        if (permissions && Object.keys(permissions).length > 0) {
            const data = permissions
            setPermissionData(prev => ({
                ...prev,
                permissionId,
                name,
                ownerId: userId,
                doctors: { ...defaultPermissions.doctors, ...data?.doctors },
                appointments: { ...defaultPermissions.appointments, ...data?.appointments },
                beds: { ...defaultPermissions.beds, ...data?.beds },
                patients: { ...defaultPermissions.patients, ...data?.patients },
                staff: { ...defaultPermissions.staff, ...data?.staff },
                pharmacy: { ...defaultPermissions.pharmacy, ...data?.pharmacy },
                lab: { ...defaultPermissions.lab, ...data?.lab },
                chat: { ...defaultPermissions.chat, ...data?.chat },
                billing: { ...defaultPermissions.billing, ...data?.billing },
            }));
        }
    }, [permissions]);

    useEffect(()=>{
        dispatch(fetchEmpDetail(localStorage.getItem("staffId")))
    },[])
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
                                                        Permission
                                                    </a>
                                                </li>
                                                <li
                                                    className="breadcrumb-item active"
                                                    aria-current="page"
                                                >
                                                    My Permission
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>



                    <div className="new-panel-card">
                        <form>
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* Doctors */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <h4><PiTagChevronFill /> Doctors Management</h4>
                                            
                                        </div>
                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.doctors.list} /><label className="form-check-label"> List View</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.doctors.add}  /><label className="form-check-label"> Add Doctor</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.doctors.edit} /><label className="form-check-label"> Edit Doctor</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.doctors.view} /><label className="form-check-label"> View Doctor</label></div></li> */}
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.doctors.delete} /><label className="form-check-label"> Delete</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Appointment */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Appointment</h4>
                                            
                                        </div>

                                        <ul className="permision-check-list">
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.list} /><label className="form-check-label"> Appointment List</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.add}/><label className="form-check-label"> Add Appointment</label></div></li>
                                            
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.view}  /><label className="form-check-label"> View Appointment</label></div></li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.cancel} /><label className="form-check-label"> Status update</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.addPrescription}  /><label className="form-check-label"> Add Prescriptions</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.appointments.editPrescription}  /><label className="form-check-label"> Edit Prescriptions</label></div></li>
                                        </ul>
                                    </div>

                                    {/* Bed */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Bed Management</h4>
                                            
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.add} onChange={() => handlePermissionChange("beds", "add")} /> <label className="form-check-label">Add Bed </label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.viewDetails} onChange={() => handlePermissionChange("beds", "viewDetails")} /> <label className="form-check-label"> View Details</label></div>
                                            </li> */}
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.addAllotment}/> <label className="form-check-label"> Add Allotment</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.editAllotment} /> <label className="form-check-label"> Edit Allotment</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.addPayment} /> <label className="form-check-label"> Add Payment</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.dischargePatient}  /> <label className="form-check-label"> Discharge Patient</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.beds.delete}  /> <label className="form-check-label"> Delete Bed</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Patients */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Patient Management</h4>
                                           
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.patients.list} /> <label className="form-check-label"> Patients List</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.patients.add}  /> <label className="form-check-label"> Add Patient</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.patients.edit}  /> <label className="form-check-label"> Edit Patient</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.patients.view} /> <label className="form-check-label"> View Patient</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.patients.delete}  /> <label className="form-check-label"> Delete</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Staff */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Staff Management</h4>
                                            
                                        </div>
                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.staff.list}  /> <label className="form-check-label"> Staff List</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.staff.add} /> <label className="form-check-label"> Add Staff</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.staff.edit} /> <label className="form-check-label"> Edit Staff</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.staff.view} /> <label className="form-check-label"> View Staff</label></div></li>
                                            {/* <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.staff.delete}  /> <label className="form-check-label"> Delete</label></div></li> */}
                                        </ul>
                                    </div>

                                    {/* Pharmacy */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Pharmacy Management</h4>
                                     
                                        </div>

                                        <ul className="permision-check-list">
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.pharmacy.listInventory} /> <label className="form-check-label" > Medicine List</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.pharmacy.addInventory} /> <label className="form-check-label" > Add Medicine</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.pharmacy.editInventory}  /> <label className="form-check-label" > Edit Medicine</label></div></li>
                                            <li>
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.pharmacy.sellMedicine}  /> <label className="form-check-label" > Sell Medicine</label></div></li>
                                        </ul>
                                    </div>
                                    {/* Laboratory */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Laboratory Management</h4>
                                            <div className="form-check custom-check">

                                                {/* <input className="form-check-input" type="checkbox" checked={Object?.values(permissions?.lab).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("lab", e.target.checked)} /> <label className="form-check-label"> Select All</label> */}
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
                                            {/* <li>
                                                <div className="form-check custom-check">
                                                    <input type="checkbox" className="form-check-input" checked={permissions?.lab?.deleteTest} onChange={() => handlePermissionChange("lab", "deleteTest")} />
                                                    <label className="form-check-label" > Delete test</label>
                                                </div>
                                            </li> */}
                                        </ul>
                                    </div>
                                    {/* Payment  */}
                                    <div className="permission-check-main-bx my-4">
                                        <div className="d-flex align-items-center gap-2">

                                            <h4><PiTagChevronFill /> Billing Management</h4>
                                            {/* <div className="form-check custom-check">

                                                <input className="form-check-input" type="checkbox" checked={Object.values(permissionData.billing).every(Boolean)}
                                                    onChange={(e) => handleSelectAll("billing", e.target.checked)} /> <label className="form-check-label"> Select All</label>
                                            </div> */}
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
                                                <div className="form-check custom-check"><input type="checkbox" className="form-check-input" checked={permissionData.chat.access}/><label className="form-check-label"> Chat</label></div></li>
                                        </ul>
                                    </div>


                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
        </>
    )
}

export default MyPermissions