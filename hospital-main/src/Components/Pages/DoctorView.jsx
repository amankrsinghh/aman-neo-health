import { TbGridDots } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCalendar,
  faCheck,
  faClock,
  faDownload,
  faEnvelope,
  faFilePdf,
  faFilter,
  faHome,
  faLocationDot,
  faMoneyBill,
  faPhone,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { getSecureApiData } from "../../Service/api";
import base_url from "../../baseUrl";
import { formatDateTime } from "../../Service/globalFunction";
import Loader from "../Common/Loader";


function DoctorView() {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [baseurl, setBaseUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [aboutDoctor, setAboutDoctor] = useState(null);
  const [employementData, setEmployementData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [accessInfo, setAccessInfo] = useState(null);
  const [customId, setCustomId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()
  const [doctorEduWork, setDoctorEduWork] = useState({
    education: [],
    work: []
  })


  const fetchStaff = async () => {
    try {
      const result = await getSecureApiData(`api/hospital-doctor/get-by-id/${id}`)
      if (result.success) {
        setDoctorData(result.data.doctor);
        setAboutDoctor(result.data.aboutDoctor);
        setEmployementData(result.employmentDetails);
        setCertificates(result?.licenses?.medicalLicense || []);
        setAccessInfo(result?.accessInfo);
        setCustomId(result?.customId);
        setDoctorEduWork(prev => ({
          ...prev,
          education: result?.aboutDoctorEduWork?.education || [],
          work: result?.aboutDoctorEduWork?.work || []
        }))
      } else {
        toast.error(result.message)
        setTimeout(() => {

          navigate('/dashboard')
        }, 3000);
      }
    } catch (err) {
      toast.error("Failed to load doctor", err);
    } finally {
      setLoading(false);
    }
  };


  // if (loading) return <p>Loading...</p>;

  const fetchAppointment = async () => {
    try {
      const result = await getSecureApiData(`appointment/hospital/doctor/${id}?limit=5&page=${currentPage}`)
      if (result.success) {
        setAppointments(result.data);
        setTotalPages(result.pagination.totalPages);
        setLoading(false);
      }
    } catch (err) {
      toast.error("Failed to load doctor", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);
  useEffect(() => {

    fetchAppointment();
  }, [currentPage])
  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-2">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">View Doctor</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/" className="breadcrumb-link">
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/doctor" className="breadcrumb-link">
                          Doctor List
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        View Doctor
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="view-employee-bx">
            <div className="row">
              <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                <div className="view-employee-bx">
                  <div>
                    <div className="view-avatr-bio-bx text-center">
                      <img
                        src={
                          doctorData?.profileImage
                            ? `${base_url}/${doctorData.profileImage}`
                            : "/doctor-avatr.png"
                        }
                        alt=""
                      />
                      <h4>{doctorData?.name}</h4>
                      <p>
                        <span className="vw-id">ID:</span>{" "}
                        {customId}
                      </p>
                      <h6 className="vw-activ text-capitalize">{doctorData?.status || "active"}</h6>
                    </div>

                    <div>
                      <ul className="vw-info-list">
                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faCalendar} />
                          </span>
                          <div>
                            <p className="vw-info-title">Join Date</p>
                            <p className="vw-info-value">
                              {employementData?.joinDate
                                ? new Date(
                                  employementData.joinDate
                                ).toDateString()
                                : "-"}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faCalendar} />
                          </span>
                          <div>
                            <p className="vw-info-title">Date of Birth</p>
                            <p className="vw-info-value">
                              {doctorData?.dob
                                ? new Date(doctorData.dob).toDateString()
                                : "-"}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faCalendar} />
                          </span>
                          <div>
                            <p className="vw-info-title">Gender </p>
                            <p className="vw-info-value">
                              {doctorData?.gender}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faBuilding} />
                          </span>
                          <div>
                            <p className="vw-info-title">Department </p>
                            <p className="vw-info-value">
                              {employementData?.department?.departmentName}{" "}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faHome} />
                          </span>
                          <div>
                            <p className="vw-info-title">Role </p>
                            <p className="vw-info-value">
                              {employementData?.role}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </span>
                          <div>
                            <p className="vw-info-title">Email </p>
                            <p className="vw-info-value">
                              {doctorData?.email}
                            </p>
                          </div>
                        </li>

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faPhone} />
                          </span>
                          <div>
                            <p className="vw-info-title">Phone </p>
                            <p className="vw-info-value">
                              {doctorData?.contactNumber}
                            </p>
                          </div>
                        </li>

                        {aboutDoctor?.contact?.emergencyContactName && <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faPhone} />
                          </span>
                          <div>
                            <p className="vw-info-title">
                              Emergency Contact Name{" "}
                            </p>
                            <p className="vw-info-value">
                              <span className="fw-700">
                                ({aboutDoctor?.contact?.emergencyContactName})
                              </span>{" "}
                              {aboutDoctor?.contact?.emergencyContactNumber}
                            </p>
                          </div>
                        </li>}

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faLocationDot} />
                          </span>
                          <div>
                            <p className="vw-info-title">Address</p>
                            <p className="vw-info-value">
                              {aboutDoctor?.fullAddress},
                              {aboutDoctor?.cityId?.name},{" "}
                              {aboutDoctor?.stateId?.name} -{" "}
                              {aboutDoctor?.pinCode}
                            </p>
                          </div>
                        </li>

                        {/* <li className="vw-info-item">
                        <span className="vw-info-icon">
                          <FontAwesomeIcon icon={faClock} />
                        </span>
                        <div>
                          <p className="vw-info-title">Experience</p>
                          <p className="vw-info-value">
                            {aboutDoctor.experience || "-"}
                          </p>
                        </div>
                      </li> */}

                        <li className="vw-info-item">
                          <span className="vw-info-icon">
                            <FontAwesomeIcon icon={faMoneyBill} />
                          </span>
                          <div>
                            <p className="vw-info-title">Salary</p>
                            <p className="vw-info-value">
                              {employementData?.salary
                                ? `₹${employementData.salary}`
                                : "-"}
                            </p>
                          </div>
                        </li>

                        {/* <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faMoneyBill} /></span>
                                                <div>
                                                    <p className="vw-info-title">Fees</p>
                                                    <p className="vw-info-value">$25</p>
                                                </div>
                                            </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="view-employee-bx">
                  <div className="employee-tabs">
                    <ul
                      className="nav nav-tabs gap-3 ps-2"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link active"
                          id="home-tab"
                          data-bs-toggle="tab"
                          href="#home"
                          role="tab"
                        >
                          Overview
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          href="#profile"
                          role="tab"
                        >
                          Qualifications
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="contact-tab"
                          data-bs-toggle="tab"
                          href="#contact"
                          role="tab"
                        >
                          Access
                        </a>
                      </li>

                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="appointement-tab"
                          data-bs-toggle="tab"
                          href="#appointement"
                          role="tab"
                        >
                          Appointments
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="">
                    <div className="patient-bio-tab ">
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="home"
                          role="tabpanel"
                        >
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">About</h4>
                                <p>{aboutDoctor?.aboutYou || "-"}</p>
                              </div>

                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Specialization </h4>
                                <p>
                                  {aboutDoctor?.specialty?.name || "-"}
                                </p>
                              </div>
                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Treatment Areas </h4>
                                <p>
                                  {aboutDoctor?.treatmentAreas?.length
                                    ? aboutDoctor.treatmentAreas.map(area => area?.name).join(', ')
                                    : "-"}
                                </p>
                              </div>

                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Contract Details </h4>
                                <div className="vw-contract-bx">
                                  <div>
                                    <h6 className="">Contract Start </h6>
                                    <p className="mb-0">
                                      {employementData?.contractStart
                                        ? new Date(
                                          employementData.contractStart
                                        ).toDateString()
                                        : "-"}
                                    </p>
                                  </div>

                                  <div>
                                    <h6 className="">Contract end</h6>
                                    <p className="mb-0">
                                      {employementData?.contractEnd
                                        ? new Date(
                                          employementData.contractEnd
                                        ).toDateString()
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="vw-contract-bx mt-3">
                                  <div>
                                    <h6 className="">Note</h6>
                                    <p className="mb-0">{employementData?.note}</p>
                                  </div>
                                </div>
                              </div>

                              {/* <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Other </h4>
                                <div className="vw-contract-bx">
                                  <div>
                                    <h6 className="">Employment Type</h6>
                                    <p>
                                      {employementData?.employmentType ||
                                        "-"}
                                    </p>
                                  </div>

                                  <div>
                                    <h6 className="">Reporting To</h6>
                                    <p>
                                      <span className="reprting-name">
                                        {employementData?.reportingTo || "-"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="profile"
                          role="tabpanel"
                        >
                          <div className="row">
                            <div className="col-lg-12 ps-0">
                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Education</h4>
                              </div>

                              <div className="ovrview-bx vw-qualification-main-bx mb-3">
                                {doctorEduWork?.education?.length > 0 ? (
                                  doctorEduWork?.education?.map(
                                    (edu, i) => (
                                      <div
                                        key={i}
                                        className="vw-contract-bx vw-qualification-bx"
                                      >
                                        <div>
                                          <h6 className="vw-qualification-title">
                                            {edu.degree}
                                          </h6>
                                          <p>{edu.university}</p>
                                        </div>

                                        <div>
                                          <p>
                                            {edu.startYear} to {edu.endYear}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p>-</p>
                                )}
                              </div>

                              <div className="ovrview-bx mb-3">
                                <h4 className="new_title">Certificate </h4>

                                <div className="vw-contract-bx d-block ">
                                  {certificates?.length > 0 ? (
                                    certificates?.map((cert, i) => (
                                      <div key={i} className="custom-frm-bx">
                                        <div className="form-control border-0 lablcense-frm-control align-content-center rounded-3" >
                                          <div className="lablcense-bx">
                                            <div>
                                              <h6>
                                                <FontAwesomeIcon
                                                  icon={faFilePdf}
                                                  style={{ color: "#EF5350" }}
                                                />
                                                {cert?.certName}
                                              </h6>
                                            </div>
                                            <div className="">
                                              {cert?.certFile && (
                                                <a
                                                  href={`${base_url}/${cert?.certFile}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="pdf-download-tbn"
                                                >
                                                  Download
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p>-</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="contact"
                          role="tabpanel"
                        >
                          <div className="row">
                            <div className="col-lg-12 ps-0">
                              <div className="ovrview-bx mb-2">
                                <h4 className="new_title">Access</h4>
                              </div>
                              <div className="ovrview-bx  mb-3">
                                <div className="vw-contract-bx vw-qualification-bx">
                                  {/* <div>
                                    <h6 className="mb-0">Username</h6>
                                    <p>{accessInfo?.userName}</p>
                                  </div> */}

                                  <div>
                                    <h6 className="mb-0">Email for Access</h6>
                                    <p>{employementData?.email}</p>
                                  </div>
                                  <div>
                                    <h6 className="mb-0">Phone Number for Access</h6>
                                    <p>{employementData?.contactNumber}</p>
                                  </div>

                                </div>
                              </div>

                              <div className="ovrview-bx mb-2">
                                <h4 className="new_title">Permission</h4>
                              </div>
                              <div className="ovrview-bx  mb-3">
                                <div className="vw-contract-bx vw-qualification-bx">

                                  <div>
                                    <h6 className="mb-0">Permission  Type</h6>
                                    <p>{employementData?.permissionId?.name}</p>
                                  </div>

                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="appointement"
                          role="tabpanel"
                        >
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="table-section">
                                <div className="table table-responsive mb-0">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>Appointment  Id</th>
                                        <th>Patient Details</th>
                                        <th>Appointment  Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {appointments?.length > 0 ?
                                        appointments?.map((item, key) =>
                                          <tr key={key}>
                                            <td>{key + 1}.</td>
                                            <td> #{item?.customId}</td>
                                            <td>
                                              <div className="admin-table-bx">
                                                <div className="admin-table-sub-bx">
                                                  <img src={item?.patientId?.patientId?.profileImage ?
                                                    `${base_url}/${item?.patientId?.patientId?.profileImage}` : "/admin-tb-logo.png"} alt="" />
                                                  <div className="admin-table-sub-details doctor-title">
                                                    <h6>{item?.patientId?.name}</h6>
                                                    <p>{item?.patientId?.nh12}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </td>
                                            <td>
                                              {formatDateTime(item?.date)}
                                            </td>
                                            <td >{item?.status == 'completed' ? <span className="approved approved-active ">Completed </span> :
                                              item?.status == 'cancel' ? <span className="approved approved-active reject text-capitalize">{item?.status} </span> : <span className="approved approved-active leaved text-capitalize">{item?.status} </span>}</td>
                                            <td>
                                              <div className="dropdown">
                                                <a
                                                  href="javascript:void(0)"
                                                  className="grid-dots-btn"
                                                  id="acticonMenu1"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <TbGridDots />
                                                </a>
                                                <ul
                                                  className="dropdown-menu dropdown-menu-end admin-dropdown-card"
                                                  aria-labelledby="acticonMenu1"
                                                >
                                                  <li className="prescription-item">
                                                    <NavLink to={`/doctor-appointment-details/${item?._id}`} className="prescription-nav" >
                                                      View  Appointment
                                                    </NavLink>
                                                  </li>
                                                  {/* <li className="prescription-item">
                                                                        <NavLink to="/add-appointment" className="prescription-nav" href="#" >
                                                                            Edit
                                                                        </NavLink>
                                                                    </li>
                                                                    <li className="prescription-item">
                                                                        <a className="prescription-nav" href="#" data-bs-toggle="modal" data-bs-target="#edit-Supplier">
                                                                            Reschedule
                                                                        </a>
                                                                    </li> */}

                                                  {/* <li className="prescription-item">
                                                  <button className=" prescription-nav " onClick={() => appointmentAction(item, 'approved')}>

                                                    <span className="text-success"> <FontAwesomeIcon icon={faCheck} />  Mark as in progress</span>
                                                  </button>
                                                </li>

                                                <li className="prescription-item">
                                                  <button className=" prescription-nav " onClick={() => appointmentAction(item, 'cancel')}>

                                                    <span className="text-danger"> Cancel appointment</span>
                                                  </button>
                                                </li> */}
                                                </ul>
                                              </div>

                                            </td>
                                          </tr>) : (
                                          <tr>
                                            <td colSpan="5" className="text-center py-4 fw-600">
                                              No appointment request
                                            </td>
                                          </tr>
                                        )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            {/* Pagination for Appointment */}
                            {appointments.length > 0 && (
                              <div className="d-flex justify-content-end mt-4">
                                <nav>
                                  <ul className="pagination">
                                    {/* Previous Button */}
                                    <li
                                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                    >
                                      <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                      >
                                        Previous
                                      </button>
                                    </li>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, i) => {
                                      const pageNumber = i + 1;
                                      return (
                                        <li
                                          key={pageNumber}
                                          className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                                        >
                                          <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(pageNumber)}
                                          >
                                            {pageNumber}
                                          </button>
                                        </li>
                                      );
                                    })}

                                    {/* Next Button */}
                                    <li
                                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                    >
                                      <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                      >
                                        Next
                                      </button>
                                    </li>
                                  </ul>
                                </nav>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline" >
              Go Back
            </Link>
          </div>
        </div>}
    </>
  );
}

export default DoctorView;
