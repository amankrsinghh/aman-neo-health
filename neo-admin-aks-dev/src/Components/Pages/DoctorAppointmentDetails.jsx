import { faEye, faFileExport, faFilePdf, faLocationDot, faMessage, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import api from "../../utils/axios"
import Loader from "../Common/Loader"
import { IMAGE_BASE_URL } from "../../utils/config"
import { getSecureApiData } from "../../Services/api"
import { calculateAge } from "../../Services/globalFunction"
import base_url from "../../Services/baseUrl"

function DoctorAppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [patientData, setPatientData] = useState()
  const [doctorData, setDoctorData] = useState()
  const printRef = useRef()

  useEffect(() => {
    (async () => {
      try {
        const res = await getSecureApiData(`api/admin/doctor/appointment/${id}`)
        if (res.success) {
          setAppt(res.appointmentData)
          setDoctorData(res.doctor)
          setPatientData(res.patient)
        }

      } catch { } finally { setLoading(false) }
    })()
  }, [id])

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"
  const fmtFull = (d) => d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"
  const calcAge = (dob) => dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000)) : "—"
  const statusClass = (s) => s === "completed" ? "approved-active" : s === "pending" ? "approved-pending" : s === "approved" ? "approved-visited" : "approved-reject"

  const imgUrl = (path, folder) => path ? `${IMAGE_BASE_URL}/uploads/${folder}/${path}` : null

  if (loading) return <Loader />

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Appointment Details</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/" className="breadcrumb-link">Dashboard</NavLink></li>
                    <li className="breadcrumb-item"><NavLink to="/doctor-appointment" className="breadcrumb-link">Doctor Appointments</NavLink></li>
                    <li className="breadcrumb-item active">Appointment Details</li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="exprt-bx d-flex align-items-center gap-2">
              <button className="nw-exprt-btn" onClick={() => window.print()}><FontAwesomeIcon icon={faPrint} /> Print</button>
            </div>
          </div>
        </div>

        {!appt ? (
          <div className="new-mega-card p-4 text-center text-muted">Appointment not found.</div>
        ) : (
          <div className="new-mega-card">
            <div className="row">

              {/* ── LEFT COLUMN ── */}
              <div className="col-lg-6 col-md-6 col-sm-12">

                {/* Patient Info */}
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Patient Information</h5>
                  <div className="d-flex align-items-center justify-content-between my-3">
                    <div className="admin-table-bx">
                      <div className="admin-table-sub-bx">
                        <img src={patientData?.profileImage ?
                          `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"}
                          alt="" onError={e => { e.target.src = "/admin-tb-logo.png" }} />
                        <div className="admin-table-sub-details doctor-title">
                          <h6>{appt.patientId?.name || "—"}</h6>
                          <p>{appt.patientId?.nh12 || "—"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="neo-health-contact-bx">
                      <a
                        href={`tel:${appt.patientId?.contactNumber}`}
                        className="neo-health-contact-btn"
                        title={appt.patientId?.contactNumber}
                      >
                        <FontAwesomeIcon icon={faPhone} />
                      </a>
                    </div>
                  </div>
                  <div className="neo-health-user-information my-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6>Age</h6>
                        <p>{calculateAge(patientData?.dob)} Years</p>
                      </div>
                      <div>
                        <h6>Gender</h6>
                        <p>{patientData?.gender || "—"}</p>
                      </div>
                    </div>
                    <div>
                      <h6>Email</h6>
                      <p>{appt.patientId?.email || "—"}</p>
                    </div>
                    <div className="mt-2">
                      <h6>Mobile</h6>
                      <p>{appt.patientId?.contactNumber || "—"}</p>
                    </div>
                    {patientData?.address && (
                      <div className="mt-2">
                        <h6>Address</h6>
                         <p>
                      {patientData?.address}
                      {patientData?.cityId && patientData?.stateId && patientData?.countryId && (
                        <>
                          {" "}
                          , {patientData.cityId?.name}, {patientData.stateId?.name}, {patientData.countryId?.name}
                        </>
                      )}
                    </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <button className="view-patient-btn"
                      onClick={() => navigate(`/patients-info/${appt.patientId?._id}`)}>
                      <FontAwesomeIcon icon={faEye} /> View Patient Record
                    </button>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Doctor Information</h5>
                  <div className="d-flex align-items-center justify-content-between my-3">
                    <div className="admin-table-bx">
                      <div className="admin-table-sub-bx">
                        <img src={doctorData?.profileImage ?
                          `${base_url}/${doctorData?.profileImage}` : "/doctor-avatr.png"}
                          alt="" onError={e => { e.target.src = "/doctor-avatr.png" }} />
                        <div className="admin-table-sub-details doctor-title">
                          <h6>{appt.doctorId?.name || "—"}</h6>
                          <p>{appt.doctorId?.nh12 || "—"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="neo-health-contact-bx">
                      <a className="neo-health-contact-btn" href={`tel:${appt.doctorId?.contactNumber}`} title={appt.doctorId?.contactNumber}>
                        <FontAwesomeIcon icon={faPhone} />
                      </a>
                    </div>
                  </div>
                  <div className="neo-health-user-information my-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6>Fees</h6>
                        <p>₹{appt.fees || 0}</p>
                      </div>
                      <div>
                        <h6>Specialization</h6>
                        <p>{doctorData?.specialty?.name || "—"}</p>
                      </div>
                    </div>
                    {appt.doctorId?.email && (
                      <div><h6>Email</h6><p>{appt.doctorId.email}</p></div>
                    )}
                    {appt.note && (
                      <div className="mt-2"><h6>Note</h6><p>{appt.note}</p></div>
                    )}
                  </div>
                  <div>
                    <button className="view-patient-btn"
                      onClick={() => navigate(`/doctor-info-details/${appt.doctorId?._id}`)}>
                      <FontAwesomeIcon icon={faEye} /> View Doctor Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="col-lg-6 col-md-6 col-sm-12">

                {/* Appointment Info */}
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Appointment Information</h5>
                  <div className="neo-health-user-information d-flex align-items-center justify-content-between my-3">
                    <div>
                      <div className="mb-3">
                        <h6>Created Date</h6>
                        <p>{fmt(appt.createdAt)}</p>
                      </div>
                      <div className="mb-3">
                        <h6>Appointment Date</h6>
                        <p>{fmtFull(appt.date)}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-3">
                        <h6>Appointment ID</h6>
                        <p>#{appt.customId || appt._id?.slice(-8)}</p>
                      </div>
                      <div className="mb-3">
                        <h6>Status</h6>
                        <p><span className={`approved rounded-5 ${statusClass(appt.status)}`}>
                          {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
                        </span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Payment Information</h5>
                  <div className="my-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6>Fees</h6>
                      <p>₹{appt.fees || 0}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <h6>Payment Status</h6>
                      <p>
                        <span className={`approved rounded-5 ${appt.paymentStatus === "paid" ? "approved-active" : "approved-pending"}`}>
                          {appt.paymentStatus === "paid" ? "Payment Complete" : "Payment Due"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prescription */}
                <div className="neo-health-patient-info-card mb-3">
                  <h5>Prescriptions</h5>
                  {appt.prescriptionId ? (
                    <div className="prescriptin-bx mt-3">
                      <div className="prescriptin-content">
                        <div className="prescriptin-picture">
                          <img src="/prescriptin-pic.png" alt="" />
                          <div>
                            <p>Prescription Date</p>
                            <h6>{fmt(appt.prescriptionId?.createdAt)}</h6>
                          </div>
                        </div>
                        <div>
                          <h6 className={`active-status ${appt.prescriptionId?.status === "Inactive" ? "in-active" : ""}`}>
                            {appt.prescriptionId?.status || "Active"}
                          </h6>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted mt-2" style={{ fontSize: 13 }}>No prescription for this appointment</p>
                  )}
                </div>

                {/* Lab Tests */}
                {appt.labTest?.testCat && (
                  <div className="neo-health-patient-info-card mb-3">
                    <h5>Lab Tests Prescribed</h5>
                    {appt.labTest?.testCat && (
                      <div className="lab-parent-bx my-3">
                        <div className="lab-test-bx">
                          <div>
                            <h6>{appt.labTest.testCat?.name || "—"}</h6>
                            {appt.labTest?.subCat?.map(item => <p>{item?.name || "—"}</p>)}
                          </div>
                        </div>
                      </div>
                    )}
                    {appt.labTest?.labTests?.map((test, i) => (
                      <div className="prescriptin-bx" key={i}>
                        <div className="prescriptin-content">
                          <div className="prescriptin-picture lab-test-bx">
                            <img src="/test-tubs.svg" alt="" style={{ width: 50, height: 50 }} />
                            <div>
                              <h6 className="fz-18 fw-700 mb-0">{test?.name || test?.shortName || "—"}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DoctorAppointmentDetails
