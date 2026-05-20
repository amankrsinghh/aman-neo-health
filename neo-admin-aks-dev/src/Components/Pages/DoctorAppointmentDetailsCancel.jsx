import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons"
import api from "../../utils/axios"
import Loader from "../Common/Loader"
import base_url from "../../utils/config"
import html2pdf from "html2pdf.js"
import { getSecureApiData } from "../../Services/api"

function DoctorAppointmentDetailsCancel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [patientData,setPatientData]=useState()
  const [doctorData,setDoctorData]=useState()
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  console.log(id)
  useEffect(() => {
    (async () => {
      try {
        const res = await getSecureApiData(`api/admin/doctor/appointment/${id}`)
        if(res.success){
          setData(res.appointmentData)
          setDoctorData(res.doctor)
          setPatientData(res.patient)
        }
      
      } catch {} finally { setLoading(false) }
    })()
  }, [id])

  const handleExport = () => {
    html2pdf().from(printRef.current).set({ filename: `appointment-${id}.pdf`, jsPDF: { format: "a4" } }).save()
  }

  if (loading) return <Loader />
  if (!data) return <div className="main-content p-3"><p className="text-muted">Appointment not found.</p></div>

  const doctor = data.doctorId
  const patient = data.patientId
  const statusColors = { completed: "#00B4B5", pending: "#FEB052", cancelled: "#FF4560", rejected: "#FF4560" }

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="innr-title mb-1 gradient-text">Appointment Details</h3>
          <nav><ol className="breadcrumb custom-breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/doctor-appointments">Appointments</Link></li>
            <li className="breadcrumb-item active">Details</li>
          </ol></nav>
        </div>
        <div className="d-flex gap-2">
          <button className="nw-exprt-btn" onClick={() => window.print()}><FontAwesomeIcon icon={faPrint} /> Print</button>
          <button className="nw-exprt-btn" onClick={handleExport}><FontAwesomeIcon icon={faFileExport} /> Export PDF</button>
        </div>
      </div>

      <div ref={printRef}>
        {/* Status banner */}
        <div className="mb-3 p-3 d-flex align-items-center justify-content-between"
          style={{ borderRadius: 12, background: (statusColors[data.status] || "#888") + "15", border: `1px solid ${statusColors[data.status] || "#888"}30` }}>
          <span className="fw-semibold" style={{ color: statusColors[data.status] || "#888", textTransform: "capitalize" }}>
            Status: {data.status}
          </span>
          {data.cancelReason && <span className="text-muted" style={{ fontSize: 13 }}>Reason: {data.cancelReason}</span>}
        </div>

        <div className="row g-3">
          {/* Doctor card */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-semibold mb-3">Doctor</h6>
              <div className="d-flex align-items-center gap-3">
                {doctor?.profileImage
                  ? <img src={`${base_url}/uploads/${doctor.profileImage}`} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} alt="" />
                  : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#31398C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>{doctor?.name?.charAt(0)?.toUpperCase() || "D"}</div>
                }
                <div>
                  <p className="fw-semibold mb-0">{doctor?.name || "—"}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>{doctor?.specialization}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 12 }}>{doctor?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient card */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-semibold mb-3">Patient</h6>
              <div className="d-flex align-items-center gap-3">
                {patient?.profileImage
                  ? <img src={`${base_url}/uploads/${patient.profileImage}`} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} alt="" />
                  : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EB5299", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>{patient?.name?.charAt(0)?.toUpperCase() || "P"}</div>
                }
                <div>
                  <p className="fw-semibold mb-0">{patient?.name || "—"}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>{patient?.contactNumber}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 12 }}>{patient?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment details */}
          <div className="col-12">
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-semibold mb-3">Appointment Info</h6>
              <div className="row">
                {[
                  ["Date", data.appointmentDate?.slice(0,10)],
                  ["Time", data.appointmentTime],
                  ["Type", data.appointmentType],
                  ["Fee", data.fee ? `₹${data.fee}` : "—"],
                  ["Booked On", data.createdAt?.slice(0,10)],
                  ["Updated", data.updatedAt?.slice(0,10)],
                ].map(([l,v]) => (
                  <div className="col-md-4 mb-3" key={l}>
                    <p className="text-muted mb-1" style={{ fontSize: 12 }}>{l}</p>
                    <p className="fw-semibold mb-0" style={{ textTransform: "capitalize" }}>{v || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prescription if any */}
          {data.prescriptions?.length > 0 && (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
                <h6 className="fw-semibold mb-3">Prescriptions</h6>
                {data.prescriptions.map((p, i) => (
                  <div key={i} className="mb-2 p-2" style={{ background: "#f9f9f9", borderRadius: 8 }}>
                    <p className="fw-semibold mb-1">{p.diagnosis}</p>
                    {p.medicines?.map((m, j) => (
                      <span key={j} className="badge bg-light text-dark me-1 mb-1">{m.name} {m.dosage}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointmentDetailsCancel
