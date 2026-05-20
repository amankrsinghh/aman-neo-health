import { faCircleXmark, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getSecureApiData, updateApiData } from "../../Service/api"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Loader from "../Common/Loader"
import LabTestOrder from "../../All Template file/Lab Test Order"

function AppointmentDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const appointmentId = params.id
  const [appointmentData, setAppointmentData] = useState({})
  const [payData, setPayData] = useState({ appointmentId, paymentStatus: 'due' })
  const [actData, setActData] = useState({ appointmentId, status: '' })
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const fetchAppointmentData = async () => {
    setLoading(true)
    try {
      const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
      if (response.success) {
        setAppointmentData(response.data)
      } else {
        toast.error(response.message)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAppointmentData()
  }, [appointmentId])
  const appointmentAction = async (e, type) => {
    e.preventDefault()
    let data = {}
    if (type == 'status') {
      data = { type, labId: userId, appointmentId, status: actData?.status }
    }
    else if (type == 'payment') {
      data = { type, labId: userId, appointmentId: payData.appointmentId, paymentStatus: payData.paymentStatus }
    }
    try {
      const response = await updateApiData(`api/hospital/lab-action`, data);
      if (response.success) {
        if (type == 'status') {
          document.getElementById('aptStatus').click()
        } else {
          document.getElementById('pytStatus').click()
        }
        fetchAppointmentData()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    }
  }
  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <form action="">
            <div className="row mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="innr-title mb-2">Appointment Details</h3>
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
                            Test  Request
                          </a>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Appointment  Details
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
                <div>
                  <button disabled={pdfLoading} className="nw-thm-btn" onClick={() => setPdfLoading(true)}>{pdfLoading ? 'Downloading...' : 'Download'}</button>
                </div>
              </div>
            </div>
          </form>

          <div className="submega-main-bx sub-tab-brd">
            <div className="row">
              <div className="col-lg-6 mb-3">
                <div className="patient-main-bx">
                  <h5>Appointment  Details</h5>
                  <div>
                    <ul className="vw-info-list">
                      <li className="vw-info-item">
                        <span className="vw-info-icon"><img src="/schedule.svg" alt="" /></span>
                        <div>
                          <p className="vw-info-value mb-2">Appointment Date</p>
                          <p className="vw-info-title">{new Date(appointmentData?.date)?.toLocaleString('en-GB')}</p>
                        </div>
                      </li>

                    </ul>
                  </div>
                </div>

                <div className="nw-appointment-crd-details">
                  <ul className="nw-appointment-crd-list">
                    <li className="nw-appointment-crd-item">Appointment ID : <span className="nw-appointment-crd-title">#{appointmentData?.customId}</span></li>
                    <li className="nw-appointment-crd-item">Appointment Completed date  : <span className="nw-appointment-crd-title">{appointmentData?.status === 'deliver-report' ? new Date(appointmentData?.updatedAt)?.toLocaleDateString('en-GB') : '-'}</span></li>
                    <li className="nw-appointment-crd-item">Amount : <span className="nw-appointment-crd-title"> ₹ {appointmentData?.fees}</span></li>
                    <li className="nw-appointment-crd-item">Payment Status : <span className="nw-appointment-due-title"> {appointmentData?.paymentStatus}</span></li>
                  </ul>
                </div>

              </div>

              <div className="col-lg-6">
                <div className="d-flex gap-3 justify-content-end mb-3">
                  <div>
                    <h6 className="subtitle mb-2">Payment Status</h6>
                    <ul className="admin-paid-list justify-content-center">
                      <li>
                        <span className={`text-capitalize paid ${appointmentData?.paymentStatus == 'due' && 'due'}`}>{appointmentData?.paymentStatus}</span>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0)"
                          className="edit-btn" data-bs-toggle="modal" data-bs-target="#payment-Status"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h6 className="subtitle mb-2">Appointment Status</h6>
                    <ul className="admin-paid-list justify-content-center">
                      <li>

                        <span className={`text-capitalize paid ${appointmentData?.status == 'pending' && 'pending'}`}>
                          {appointmentData?.status}
                        </span>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0)"
                          className="edit-btn" data-bs-toggle="modal" data-bs-target="#appointment-Status"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>

                {appointmentData?.staff && <div className="nw-laboratory-bill-bx mt-lg-5 mt-sm-3 mb-3">
                  <h6 className="my-0">Lab Doctor </h6>
                  <h4>{appointmentData?.staff?.name}</h4>
                  <p><span className="laboratory-phne"> ID :</span> {appointmentData?.staff?.nh12}</p>
                </div>}
                {appointmentData?.doctorId && <div className="nw-laboratory-bill-bx mb-3">
                  <h6 className="my-0">Lab tests prescribed by the doctor</h6>
                  <h4>Dr.James Harris</h4>
                  <p><span className="laboratory-phne"> ID :</span> DO-7668</p>
                </div>}
              </div>
            </div>
          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
          </div>
          <div className="d-none">
            <LabTestOrder appointmentId={appointmentId} pdfLoading={pdfLoading} endLoading={()=>setPdfLoading(false)}/>
          </div>


        </div>}

      {/*Payment Status Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#payment-Status" */}
      <div className="modal step-modal" id="payment-Status" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-4">
            <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3 border-bottom">
              <div>
                <h6 className="lg_title mb-0">Payment Status</h6>
              </div>
              <div>
                <button type="button" className="" id='pytStatus' data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body px-4 pb-5">
              <form onSubmit={(e) => appointmentAction(e, 'payment')} className="row ">
                <div className="col-lg-12 ">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Status</label>

                    <div class="select-wrapper">
                      <select class="form-select custom-select"
                        name="paymentStatus" value={payData.paymentStatus}
                        onChange={(e) => setPayData({ ...payData, paymentStatus: e.target.value })}>
                        <option value="due">Due</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="nw-thm-btn rounded-2 w-100 "> Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*  Payment Status Popup End */}


      {/*Appointment Popup Start  */}
      {/* data-bs-toggle="modal" data-bs-target="#appointment-Status" */}
      <div className="modal step-modal" id="appointment-Status" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-4 ">
            <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3 border-bottom">
              <div>
                <h6 className="lg_title mb-0">Appointment Status</h6>
              </div>
              <div>
                <button type="button" id='aptStatus' className="" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>
            </div>
            <div className="modal-body px-4 pb-5">
              <form className="row " onSubmit={(e) => appointmentAction(e, 'status')}>
                <div className="col-lg-12 ">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Status</label>



                    <div class="select-wrapper">
                      <select class="form-select custom-select"
                        name="status" value={actData.status}
                        onChange={(e) => setActData({ ...actData, status: e.target.value })}>
                        <option value="pending" >Pending</option>
                        <option value="cancel" disabled>Cancel</option>
                        <option value="approved" >Approved</option>
                        <option value="rejected" >Rejected</option>
                        <option value="report-pending">Pending Report</option>
                        <option value="deliver-report">Deliver Report</option>
                      </select>
                    </div>
                  </div>

                  <div className="custom-frm-bx">
                    <label htmlFor="">Select Doctor</label>
                    <div class="select-wrapper">
                      <select class="form-select custom-select">
                        <option>Dr. Ravi Kumar</option>
                      </select>
                    </div>


                  </div>

                  <div>
                    <button type="submit" className="nw-thm-btn w-100"> Submit</button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Appointment Popup End */}
    </>
  )
}

export default AppointmentDetails