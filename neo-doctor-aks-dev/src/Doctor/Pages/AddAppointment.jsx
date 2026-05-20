
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { BsPlusCircleFill } from "react-icons/bs";
import { use, useEffect, useState } from "react";
import Select from 'react-select'
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDetail } from "../../Redux/features/doctor";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { calculateAge } from "../../Services/globalFunction";
import base_url from "../../baseUrl";

function AddAppointment() {
    const dispath = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [users, setUsers] = useState()
    const doctorId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [patientId, setPatientId] = useState()
    const [ptId, setPtId] = useState()
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const { aboutDoctor } = useSelector(state => state.doctor)
    const [uniqueId, setUniqueId] = useState()
    const [patientData, setPatientData] = useState()
    const [ptLoading, setPtLoading] = useState(false)

    const handleBook = async (e) => {
        e.preventDefault();
        if (!patientData?.userId || !date || !time) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            // Combine date + time into Date object
            const appointmentDate = new Date(`${date}T${time}`);

            const data = {
                patientId: patientData?.userId,
                doctorId,
                date: appointmentDate,
                fees: aboutDoctor?.fees
            };

            const response = await securePostData("doctor/appointment", data);

            if (response?.success) {
                toast.success("Appointment add successfully!");
                // reset form if needed
                setPatientId("");
                setDate("");
                setTime("");
                navigate('/requests')
            } else {
                toast.error(response?.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        dispath(fetchDoctorDetail())
    }, [dispath])
    useEffect(() => {
        const requestId = searchParams.get('patientId');
        if (requestId) {
            setPatientId(requestId)
        }
    }, [searchParams])
    async function fetchPatientData() {
        setPtLoading(true)
        try {
            const res = await getApiData(`patient/${uniqueId}`)
            if (res?.success) {
                setPatientData(res.data)
                setPtId(res.userId)
            } else {
                toast.error(res?.message || "Patient not found")
            }

        } catch (error) {

        } finally {
            setPtLoading(false)
        }
    }
    useEffect(() => {
        if (uniqueId?.length > 7) {
            fetchPatientData()
        }
    }, [uniqueId])
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0"> Add Appointment</h5>
                </div>
                <div className="all-profile-data-bx">
                    <form onSubmit={handleBook}>
                        <div className="new-panel-card mb-3">
                            <div className="row">
                                <div>
                                    <h5 className="text-black fz-18 fw-700">Appointment Details</h5>
                                    <p className="fz-16 fw-400">Enter the details for the new appointment.</p>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Appointment Date</label>
                                        <input type="date"
                                            value={date} onChange={(e) => setDate(e.target.value)}
                                            className="form-control new-control-frm" placeholder="" />

                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Appointment Time</label>
                                        <input type="time"
                                            value={time} onChange={(e) => setTime(e.target.value)}
                                            className="form-control new-control-frm" placeholder="" />

                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="new-panel-card ">
                            <div className="row">
                                <div className="d-flex align-item-center justify-content-between flex-wrap">
                                    <div>
                                        <h5 className="text-black fz-18 fw-700">Select Patient</h5>
                                        <p className="fz-16 fw-400">select a patient for this appointment.</p>
                                    </div>

                                    <div>
                                        <Link to={'/add-patient'} className="nw-exprt-btn"><BsPlusCircleFill /> Add Patient</Link>
                                    </div>
                                </div>



                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="custom-frm-bx">
                                        <label>Patient</label>
                                        <input className="form-control new-control-frm" type="text" value={uniqueId}
                                            onChange={(e) => setUniqueId(e.target.value)} />
                                        {/* <div className="select-wrapper">

                                                            <Select
                                                                options={users}
                                                                value={users?.find(option => option.value === patientId) || null}
                                                                name="patientId"
                                                                classNamePrefix="custom-select"
                                                                placeholder="Select patient"
                                                                onChange={(selectedOption) => {
                                                                    setPatientId(selectedOption.value);
                                                                }}
                                                            />
                                                        </div> */}
                                    </div>
                                </div>
                                {ptLoading && <p>Loading...</p>}
                                {patientData && <>
                                    <h4>Pateint Detail</h4>

                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Name</label>
                                            <input className="form-control" type="text" value={patientData?.name || ''}
                                                readOnly />

                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Contact Number</label>
                                            <input className="form-control" type="text" value={patientData?.contactNumber || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Email</label>
                                            <input className="form-control" type="text" value={patientData?.email || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Age (in years)</label>
                                            <input className="form-control" type="text" value={calculateAge(patientData?.dob)}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Gender</label>
                                            <input className="form-control" type="text" value={patientData?.gender || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Height</label>
                                            <input className="form-control" type="text" value={patientData?.height || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Weight</label>
                                            <input className="form-control" type="text" value={patientData?.weight || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="custom-frm-bx">
                                            <label>Blood Group</label>
                                            <input className="form-control" type="text" value={patientData?.bloodGroup || ''}
                                                readOnly />
                                        </div>
                                    </div>
                                </>}
                            </div>

                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-3">

                             <div className="text-end "> <Link to={-1} className="nw-thm-btn outline">Go Back</Link> </div>

                            <button className="nw-thm-btn">Submit</button>
                        </div>

                    </form>
                </div>
            </div>

           

        </>
    )
}

export default AddAppointment