import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faFileExport, faFilePdf, faPhone, faPrint } from "@fortawesome/free-solid-svg-icons"
import api from "../../utils/axios"
import Loader from "../Common/Loader"
import html2pdf from "html2pdf.js"
import { IMAGE_BASE_URL } from "../../utils/config"
import { getSecureApiData } from "../../Services/api"
import { calculateAge } from "../../Services/globalFunction"
import base_url from "../../Services/baseUrl"

function LaboratoryAppointmentDetails() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [patientData, setPatientData] = useState()
  const [labData, setLabData] = useState()
  const printRef = useRef()

  useEffect(() => {
    (async () => {
      try {
        const res = await getSecureApiData(`api/admin/lab/appointment/${id}`)
        if (res.success) {
          setData(res.appointmentData)
          setPatientData(res.patient)
          setLabData(res.lab)
        }
      } catch { } finally { setLoading(false) }
    })()
  }, [id])

  const handleExport = () => html2pdf().from(printRef.current).set({ filename: `lab-appt-${id}.pdf` }).save()

  if (loading) return <Loader />
  if (!data) return <div className="main-content p-3"><p className="text-muted">Appointment not found.</p></div>

  const lab = data.labId
  const patient = data.patientId
  const statusColors = { visited: "#00B4B5", pending: "#FEB052", cancelled: "#FF4560", due: "#7C3AED" }

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Appointment Details</h3>
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
                      Laboratory  Appointments
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                  >
                    Appointment Details
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="exprt-bx d-flex align-items-center gap-2">
            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faPrint} /> Print </button>
            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faFileExport} /> Export </button>
          </div>
        </div>
      </div>


      <div className='new-mega-card'>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="neo-health-patient-info-card mb-3">
              <h5>Patient Information</h5>
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="admin-table-bx">
                  <div className="admin-table-sub-bx">
                    <img src={patientData?.profileImage ?
                      `${base_url}/${patientData?.profileImage}` : "/admin-tb-logo.png"} alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/admin-tb-logo.png";
                      }} />
                    <div className="admin-table-sub-details doctor-title">
                      <h6>{data?.patientId?.name}</h6>
                      <p>{data?.patientId?.nh12}</p>
                    </div>
                  </div>
                </div>


                <div className="neo-health-contact-bx">
                  {/* <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faMessage} /></button> */}
                  <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faPhone} /></button>
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
                    <p>{patientData?.gender}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div>
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
                </div>
              </div>
              <div>
                <Link to={`/patients-info/${data?.patientId?._id}`} className="view-patient-btn text-center"><FontAwesomeIcon icon={faEye} /> View Patient Record</Link>
              </div>
            </div>

            <div className="neo-health-patient-info-card mb-3">
              <h5>Laboratory </h5>
              <div className="d-flex align-items-center justify-content-between my-3">
                <div className="admin-table-bx">
                  <div className="admin-table-sub-bx ">
                    <img src={labData?.logo ?
                      `${base_url}/${labData?.logo}` : '/profile-tab-avatar.png'
                    } alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/profile-tab-avatar.png";
                      }} />
                    <div className="admin-table-sub-details doctor-title">
                      <h6>{data?.labId?.name}</h6>
                      <p>{data?.labId?.nh12}</p>
                    </div>
                  </div>
                </div>


                <div className="neo-health-contact-bx">
                  {/* <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faMessage} /></button> */}
                  <button className="neo-health-contact-btn"><FontAwesomeIcon icon={faPhone} /></button>
                </div>
              </div>

              <div className="neo-health-user-information my-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h6>Address</h6>
                    <p>
                      {labData?.fullAddress}
                      {labData?.cityId && labData?.stateId && labData?.countryId && (
                        <>
                          {" "}
                          {labData.cityId?.name}, {labData.stateId?.name}, {labData.countryId?.name}
                        </>
                      )}
                    </p>
                  </div>

                </div>
              </div>
              <div>
                <Link to={`/lab-info-details/${data?.labId?._id}`} className="view-patient-btn text-center"><FontAwesomeIcon icon={faEye} /> View Lab Profile</Link>
              </div>
            </div>
          </div>


          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="neo-health-patient-info-card mb-3">
              <h5>Lab Report</h5>
              {/* <div className="my-3">
                                    <div className="">
                                        <div className="mb-3 d-flex align-items-center justify-content-between">
                                            <h6 className="mb-0">CBC Report</h6>
                                            <div className="lablcense-bx">
                                                 <button type="" className="lab-dw-tbn"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />  Download</button>
                                            </div>
                                        </div>

                                        <div className="mb-3 d-flex align-items-center justify-content-between">
                                            <h6 className="mb-0">Haemoglobin</h6>
                                            <div className="lablcense-bx">
                                                <button type="" className="lab-dw-tbn"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />  Download</button>
                                            </div>
                                        </div>
                                    </div>


                                </div> */}

              <div className="qrcode-prescriptions-bx">
                <div className="admin-table-bx d-flex align-items-center justify-content-between qr-cd-headr">
                  <div className="admin-table-sub-details final-reprt d-flex align-items-center gap-2">
                    <img src="/reprt-plus.png" alt="" className="rounded-0" />
                    <div>
                      <h6 className="fs-16 fw-600 text-black">Final Diagnostic Report</h6>

                    </div>
                  </div>

                </div>

                <div className="barcode-active-bx">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="admin-table-bx">
                      <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                        <div>
                          <h6>Advance Lab Tech</h6>
                          <p className="fs-14 fw-500">DO-4001</p>
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                      <div className="barcd-scannr barcde-scnnr-card">
                        <div className="barcd-content">
                          <h4 className="mb-1">SP-9879</h4>

                          <ul class="qrcode-list">
                            <li class="qrcode-item">Test  <span class="qrcode-title">: CBC</span></li>
                            <li class="qrcode-item">Draw  <span class="qrcode-title"> : 25-11-03  08:07</span> </li>
                          </ul>

                          <img src="/barcode.png" alt="" />
                        </div>

                        <div className="barcode-id-details">
                          <div>
                            <h6>Patient Id </h6>
                            <p>PS-9001</p>
                          </div>


                          <div>
                            <h6>Appointment ID </h6>
                            <p>OID-8876</p>
                          </div>
                        </div>

                      </div>

                      <div className="text-center mt-3">
                        <button className="pdf-download-tbn py-2"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Download Report</button>

                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                      <div className="barcd-scannr barcde-scnnr-card">
                        <div className="barcd-content">
                          <h4 className="mb-1">SP-9879</h4>

                          <ul class="qrcode-list">
                            <li class="qrcode-item">Test  <span class="qrcode-title">: CBC</span></li>
                            <li class="qrcode-item">Draw  <span class="qrcode-title"> : 25-11-03  08:07</span> </li>
                          </ul>
                          <img src="/barcode.png" alt="" />
                        </div>

                        <div className="barcode-id-details">
                          <div>
                            <h6>Patient Id </h6>
                            <p>PS-9001</p>
                          </div>


                          <div>
                            <h6>Appointment ID </h6>
                            <p>OID-8876</p>
                          </div>
                        </div>

                      </div>

                      <div className="text-center mt-3">
                        <button className="pdf-download-tbn py-2"><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Download Report</button>

                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>


            <div className="neo-health-patient-info-card mb-3">
              <h5>Appointment Information</h5>
              <div className="neo-health-user-information d-flex align-items-start justify-content-between my-3">
                <div className="">
                  <div className="mb-3">
                    <h6>Created Date</h6>
                    <p>{new Date(data?.createdAt)?.toLocaleDateString('en-GB')} </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="">Appointment Date</h6>
                    <p>{new Date(data?.date)?.toLocaleString('en-GB')}</p>
                  </div>

                  <div>
                    <div className="mb-3">
                      <h6>Status</h6>
                      <p><span className="approved  rounded-5 text-capitalize">{data?.status}</span></p>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="mb-3">
                    <h6>Appointment  Id</h6>
                    <p> #{data?.customId}</p>
                  </div>

                  <div className="mb-3">
                    <h6>Completed date </h6>
                    <p> {data?.status=="deliver-report"? new Date(data?.updatedAt)?.toLocaleDateString('en-GB'):'-'}</p>
                  </div>



                </div>




              </div>
            </div>


            <div className="neo-health-patient-info-card mb-3">
              <h5>Payment Information</h5>

              <div className=" my-3">
                {data?.testData?.map((item,key)=>
                <div className="d-flex align-items-center justify-content-between mb-2" key={key}>
                  <div>
                    <h6>{item?.name}</h6>

                  </div>
                  <div>
                    <p>{item?.fees}</p>
                  </div>
                </div>)}


                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>
                    <h6>Payment Status</h6>
                  </div>

                  <div>
                    <p><span className="approved rounded-5 px-3 py-2 text-capitalize">{data?.paymentStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>

      </div>
    </div>
  )
}

export default LaboratoryAppointmentDetails
