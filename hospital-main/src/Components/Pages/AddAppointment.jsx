import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Select from 'react-select'
import { getSecureApiData, securePostData } from "../../Service/api";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "../Common/Loader";
function AddAppointment() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState()
    const [doctorData, setDoctorData] = useState()
    const [doctors, setDoctors] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    // const doctorId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [patientId, setPatientId] = useState()
    const [fees, setFees] = useState()
    const [doctorId, setDoctorId] = useState()
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [bookLoading, setBookLoading] = useState(false)
    const [nh12, setNh12] = useState('')
    async function fetchPatient() {
        if (nh12?.length < 12) {
            toast.error("Please enter valid id")
        }
        setLoading(true)
        try {
            const result = await getSecureApiData(`api/comman/user-data/${nh12}`)
            if (result.success) {
                if (result.data.role !== "patient") {
                    return toast.error("The user is not registerd for patient")
                }
                setUserData(result.data)
            } else {
                toast.error(result.message)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchDoctors() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`api/neo/hospital-doctor`)
            if (result.success) {
                const formattedOptions = result.doctors.map(item => ({
                    value: item?.userId?._id,   // or item._id depending on your data
                    label: item?.userId.name, // display name
                    fees: item?.fees
                }));
                setDoctors(formattedOptions)
                setDoctorData(result.data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDoctors()
    }, [])
    const handleBook = async (e) => {
        e.preventDefault();

        if (!userData?._id || !date || !time) {
            toast.error("Please fill all fields");
            return;
        }
        setBookLoading(true);
        try {
            // Combine date + time into Date object
            const appointmentDate = new Date(`${date}T${time}`);

            const data = {
                patientId: userData?._id,
                doctorId,
                hospitalId: userId,
                date: appointmentDate,status:"approved",
                fees
            };
            const response = await securePostData("appointment/hospital/doctor", data);

            if (response?.success) {
                toast.success("Appointment add successfully!");
                // reset form if needed
                setUserData("");
                setNh12("")
                setDate("");
                setTime("");
                navigate(-1)
            } else {
                toast.error(response?.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong");
        } finally {
            setBookLoading(false);
        }
    };
    return (
        <>
            {loading ? <Loader />
                : <form onSubmit={handleBook} className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Add Appointment</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/appointment" className="breadcrumb-link">
                                                Appointment
                                            </NavLink>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Add Appointment
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className='new-panel-card'>
                        <div className="new-panel-card mb-3">
                            <div >
                                <div className="row">
                                    <div>
                                        <h4 className="fz-18 fw-700 text-black">Appointment Details</h4>
                                        <p className="fw-400 fz-16">Enter the details for the new appointment.</p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Appointment Date</label>
                                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                                className="form-control nw-frm-select" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Appointment Time</label>
                                            <input type="time"
                                                value={time} onChange={(e) => setTime(e.target.value)} required className="form-control nw-frm-select" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="new-panel-card">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <div>
                                            <h4 className="fz-18 fw-700 text-black">Select Patient</h4>
                                            <p className="fw-400 fz-16">select a patient for this appointment.</p>
                                        </div>
                                        <div>
                                            <NavLink to="/add-patient" className="nw-exprt-btn">
                                                <FaPlusCircle />  Add Patient
                                            </NavLink>
                                        </div>
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Patient Id </label>
                                        <div className="d-flex gap-2">
                                            <input type="text" className="form-control nw-frm-select" value={nh12}
                                                onChange={(e) => setNh12(e.target.value)} />
                                            <button className="nw-thm-btn" type="button" onClick={() => fetchPatient()}>
                                                <FontAwesomeIcon icon={faSearch} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="new-panel-card">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <div>
                                            <h4 className="fz-18 fw-700 text-black">Select Doctor</h4>
                                            <p className="fw-400 fz-16">Choose a doctor for this appointment.</p>
                                        </div>
                                        <div>
                                            <NavLink to="/add-doctor" className="nw-exprt-btn">
                                                <FaPlusCircle />  Add Doctor
                                            </NavLink>
                                        </div>
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Doctor</label>
                                         <Select
                                                options={doctors}
                                                name="patientId"
                                                classNamePrefix="custom-select"
                                                className="select-categories"
                                                placeholder="Select doctor"
                                                onChange={(selectedOption) => {
                                                    setDoctorId(selectedOption.value);
                                                    setFees(selectedOption.fees)
                                                }}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {userData && <div className="row">
                            <h3>Patient Data</h3>
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">

                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Name  </label>
                                    <input type="text" className="form-control" value={userData?.name} readOnly />
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">

                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Email  </label>
                                    <input type="text" className="form-control" value={userData?.email} readOnly />
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">

                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Contact Number  </label>
                                    <input type="text" className="form-control" value={userData?.contactNumber} readOnly />
                                </div>

                            </div>
                        </div>}

                        <div className="d-flex justify-content-between mt-4">
                            <Link to={-1} className="nw-thm-btn outline">
                                Go Back
                            </Link>
                            <button className="nw-thm-btn" type="submit">{bookLoading ? 'Submiting....' : 'Submit'}</button>
                        </div>
                    </div>
                </form>}
        </>
    )
}

export default AddAppointment