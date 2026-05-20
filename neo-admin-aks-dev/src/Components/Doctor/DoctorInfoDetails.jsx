import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faDownload, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight
} from "react-icons/hi";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/date";
import { IMAGE_BASE_URL } from "../../utils/config";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { useRef } from "react";

function DoctorInfoDetails() {
     const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("home");
  const [cardName, setCardName]     = useState("");
  const [cardId, setCardId]         = useState("");
  const [cardReady, setCardReady]   = useState(false);
  const [apptSearch, setApptSearch] = useState("");
  const cardRef = useRef(null);

  // Pre-fill card with doctor data when tab opens
  const initCard = () => {
    if (!cardName) {
      setCardName(doctor?.name || "");
      setCardId(doctor?.nh12 || doctor?.user?.nh12 || "");
    }
  };

  const handleGenerate = () => {
    if (cardName) setCardReady(true);
  };

  const handleCardDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `NeoCard_${cardId || cardName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { }
  };

  const filteredAppointments = apptSearch
    ? appointments.filter(a =>
        a.patientId?.name?.toLowerCase().includes(apptSearch.toLowerCase()) ||
        a._id?.includes(apptSearch)
      )
    : appointments;


  /* ================= FETCH DOCTOR ================= */
  const loadDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/doctor/${id}`);
      setDoctor(res.data.data);
    } catch {
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH APPOINTMENTS ================= */
  const loadAppointments = async (p = 1) => {
    try {
      const res = await api.get(`/api/admin/doctor/${id}/appointments`, {
        params: { page: p }
      });

      setAppointments(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    loadDoctor();
    loadAppointments(page);
  }, [id, page]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!doctor) return null;

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Doctor Detail</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Doctor Detail
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='new-mega-card'>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="employee-tabs">
                                <ul className="nav nav-tabs gap-3 bg-white" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                        className={`nav-link ${activeTab === "home" ? "active" : ""}`}
                                        onClick={() => setActiveTab("home")}
                                        >
                                        Doctor Info
                                        </button>

                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <button
                                        className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                                        onClick={() => setActiveTab("profile")}
                                        >
                                        Appointment List
                                        </button>

                                    </li>



                                    <li className="nav-item" role="presentation">
                                        <button
                                        className={`nav-link ${activeTab === "card" ? "active" : ""}`}
                                        onClick={() => setActiveTab("card")}
                                        >
                                        NeoCard
                                        </button>

                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <div className="tab-content" id="myTabContent">
                                    <div className={`tab-pane fade ${activeTab === "home" ? "show active" : ""}`}>


                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="doctor-information-card mb-4">
                                                    <div className="doctor-main-profile-card">
                                                        <div className="doctor-profile-pic">
                                                            <img src={doctor?.profileImage ? `${IMAGE_BASE_URL}/uploads/doctor/${doctor.profileImage}` : "/doctor-info-pic.png"} alt="" onError={e => { e.target.src = "/doctor-info-pic.png"; }} />
                                                        </div>
                                                        <div className="doctor-content-details">
                                                            <div className="doctor-info-heading">
                                                                <h4>Dr. {doctor?.user?.name} </h4>
                                                                <p>DO-{doctor?.user?.unique_id}</p>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>{doctor.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gender</h6>
                                                                    <p>{doctor?.gender}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{doctor?.email}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Date of Birth</h6>
                                                                    <p>{doctor?.dob}</p>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Address & About You
                                                    </legend>

                                                    <div className="doctor-hospital-info">
                                                        <div className="doctor-hospital-pic">
                                                            <img src="/hospital.svg" alt="" />
                                                            <h5>{doctor?.about?.hospitalName}</h5>
                                                        </div>

                                                        <div className="doctor-info-list mb-3">
                                                            <div className="doctor-info-item">
                                                                <h6>Full Address</h6>
                                                                <p>{doctor?.about?.fullAddress}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Country</h6>
                                                                <p>{doctor?.about?.countryId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>State</h6>
                                                                <p>{doctor?.about?.stateId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>City</h6>
                                                                <p>{doctor?.about?.cityId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Pin code</h6>
                                                                <p>{doctor?.about?.pinCode}</p>
                                                            </div>

                                                        </div>

                                                        <div className="doctor-info-list mb-3">
                                                            <div className="doctor-info-item">
                                                                <h6>Specialty</h6>
                                                                <p>{doctor?.about?.specialty?.name || "N/A"}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Treatment Areas</h6>
                                                                <p>
                                                                {doctor?.about?.treatmentAreas?.length
                                                                    ? doctor.about.treatmentAreas.map(item => item.name).join(", ")
                                                                    : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="doctor-info-list mb-3">
                                                            <div className="doctor-info-item">
                                                                <h6>Fees</h6>
                                                                <p>₹{doctor?.about?.fees || 0}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Languages</h6>
                                                                <p>
                                                                {doctor?.about?.language?.length
                                                                    ? doctor.about.language.join(", ")
                                                                    : "N/A"}
                                                                </p>

                                                            </div>



                                                        </div>

                                                        <div className="doctor-info-list mb-3">
                                                            <div className="doctor-info-item">
                                                                <h6>About</h6>
                                                                <p>{doctor?.about?.aboutYou || "N/A"}</p>
                                                            </div>
                                                        </div>

                                                    </div>


                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Education
                                                    </legend>

                                                    <div className="doctor-hospital-info">
                                                        {doctor?.eduWork?.education?.map((edu) => (
                                                        <div key={edu._id} className="doctor-hospital-pic align-items-start">
                                                            <img src="/chevron-one.svg" alt="" />
                                                            <div>
                                                            <h5>{edu.university}</h5>
                                                            <p>{edu.degree}</p>
                                                            </div>
                                                            <div className="ms-auto">
                                                            <p>{edu.startYear} to {edu.endYear}</p>
                                                            </div>
                                                        </div>
                                                        ))}
                                                    </div>
                                                </fieldset>


                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Work & Experience
                                                    </legend>

                                                    <div className="doctor-hospital-info">
                                                        {doctor?.eduWork?.work?.map((work) => (
                                                        <div key={work._id} className="doctor-hospital-pic align-items-start">
                                                            <img src="/chevron-two.svg" alt="" />
                                                            <div>
                                                            <h5>{work.organization}</h5>
                                                            <p>{work.totalYear} Years {work.month} Months</p>
                                                            </div>
                                                            <div className="ms-auto">
                                                            <p>
                                                                {work.present ? (
                                                                <>
                                                                    <span style={{ color: "#34A853" }}>
                                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                                    </span>{" "}
                                                                    Present
                                                                </>
                                                                ) : (
                                                                "Completed"
                                                                )}
                                                            </p>
                                                            </div>
                                                        </div>
                                                        ))}
                                                    </div>
                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Medical License
                                                    </legend>

                                                    <div className="doctor-hospital-info">
                                                        <div className="doctor-hospital-pic align-items-start">
                                                            <img src="/chevron-three.svg" alt="" />
                                                            <h5>State Medical License</h5>
                                                        </div>

                                                        {doctor?.medicalLicense?.medicalLicense?.map((lic) => (
                                                        <div key={lic._id} className="doctor-license-upload mb-3">
                                                            <h6>{lic.certName}</h6>
                                                            <div className="doctor-license-pic">
                                                            <img
                                                                src={`${IMAGE_BASE_URL}/${lic.certFile}`}
                                                                alt=""
                                                            />
                                                            </div>
                                                        </div>
                                                        ))}


                                                    </div>
                                                </fieldset>
                                            </div>
                                        </div>




                                    </div>

                                    <div className={`tab-pane fade ${activeTab === "profile" ? "show active" : ""}`}>
                                        <div className="row">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="custom-frm-bx mb-0">
                                                            <input
                                                                type="text"
                                                                className="form-control admin-table-search-frm search-table-frm"
                                                                placeholder="Search patient..."
                                                                value={apptSearch}
                                                                onChange={e => setApptSearch(e.target.value)}
                                                            />
                                                            <div className="adm-search-bx">
                                                                <button className="tp-search-btn">
                                                                    <FontAwesomeIcon icon={faSearch} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="dropdown">
                                                    <a href="#" className="thm-btn lt-thm-btn" id="acticonMenus" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <FontAwesomeIcon icon={faFilter} /> Filter
                                                    </a>

                                                    <div className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                                        aria-labelledby="acticonMenus">

                                                        <div
                                                            className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-bottom">
                                                            <h6 className="mb-0 fz-18">Filter</h6>
                                                            <a href="#" className="fz-16 clear-btn">Reset</a>
                                                        </div>

                                                        <div className="p-3">
                                                            <ul className="filtring-list mb-3">
                                                                <h6>Status</h6>
                                                                <li>
                                                                    <div className="form-check new-custom-check">
                                                                        <input className="form-check-input" type="checkbox" id="reject" />
                                                                        <label className="form-check-label" htmlFor="reject">Active</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="form-check new-custom-check">
                                                                        <input className="form-check-input" type="checkbox" id="pending" />
                                                                        <label className="form-check-label" htmlFor="pending">Inactive</label>
                                                                    </div>
                                                                </li>
                                                            </ul>

                                                            <ul className="filtring-list">
                                                                <h6>Gender</h6>
                                                                <li>
                                                                    <div className="form-check new-custom-check">
                                                                        <input className="form-check-input" type="checkbox" id="psychologists" />
                                                                        <label className="form-check-label" htmlFor="psychologists">Male</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="form-check new-custom-check">
                                                                        <input className="form-check-input" type="checkbox" id="neurosurgery" />
                                                                        <label className="form-check-label" htmlFor="neurosurgery">Female</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="form-check new-custom-check">
                                                                        <input className="form-check-input" type="checkbox" id="ophthalmology" />
                                                                        <label className="form-check-label" htmlFor="ophthalmology">Other</label>
                                                                    </div>
                                                                </li>
                                                            </ul>

                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-between drop-heading-bx px-3 pt-2 pb-2 border-top">
                                                            <a href="javascript:void(0)" className="thm-btn thm-outline-btn rounded-4 px-5 py-2 outline"> Cancel</a>
                                                            <a href="javascript:void(0)" className="thm-btn rounded-4 px-5 py-2"> Apply</a>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="table-section admin-mega-section">
                                                    <div className="table table-responsive mb-0">
                                                        <table className="table mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Appointment  Id</th>
                                                                    <th>Patient</th>
                                                                    <th>Appointment  Date</th>
                                                                    <th>Doctor</th>
                                                                    <th>Status</th>
                                                                    {/* <th>Action</th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                    {filteredAppointments.length === 0 ? (
                                                                        <tr>
                                                                        <td colSpan="7" className="text-center py-4">
                                                                            No Appointments Found
                                                                        </td>
                                                                        </tr>
                                                                    ) : (
                                                                        filteredAppointments.map((item, index) => (
                                                                        <tr key={item._id}>
                                                                            <td>{(page - 1) * 10 + index + 1}.</td>

                                                                            <td>#{item._id?.slice(-6)}</td>

                                                                            <td>
                                                                            <div className="admin-table-bx">
                                                                                <div className="admin-table-sub-bx">
                                                                                <img
                                                                                    src={item.patientId?.image || "/admin-tb-logo.png"}
                                                                                    alt=""
                                                                                />
                                                                                <div className="admin-table-sub-details">
                                                                                    <h6>{item.patientId?.name || "N/A"}</h6>
                                                                                    <p>{item.patientId?.unique_id || "PA-0000"}</p>
                                                                                </div>
                                                                                </div>
                                                                            </div>
                                                                            </td>

                                                                            <td>{formatDate(item.date)}</td>

                                                                            <td>
                                                                            <div className="admin-table-bx">
                                                                                <div className="admin-table-sub-bx">
                                                                                <img
                                                                                    src={doctor.image || "/doctor-avatr.png"}
                                                                                    alt=""
                                                                                />
                                                                                <div className="admin-table-sub-details doctor-title">
                                                                                    <h6>{doctor.name}</h6>
                                                                                    <p>{doctor.user?.unique_id}</p>
                                                                                </div>
                                                                                </div>
                                                                            </div>
                                                                            </td>

                                                                            <td>
                                                                            <span
                                                                                className={`approved ${
                                                                                item.status === "Completed"
                                                                                    ? "approved-active"
                                                                                    : item.status === "Pending"
                                                                                    ? "approved-pending"
                                                                                    : "approved-inactive"
                                                                                }`}
                                                                            >
                                                                                {item.status || "Pending"}
                                                                            </span>
                                                                            </td>

                                                                            {/* <td>
                                                                            <a href="javascript:void(0)" className="grid-dots-btn">
                                                                                <TbGridDots />
                                                                            </a>
                                                                            </td> */}
                                                                        </tr>
                                                                        ))
                                                                    )}
                                                                    </tbody>

                                                        </table>
                                                    </div>

                                                    <div className="custom-pagination-wrapper d-flex justify-content-between align-items-center flex-wrap mt-3">

                                                        <div className="page-selector d-flex align-items-center mb-2 mb-md-0">
                                                            <p className="me-2 ">Page</p>
                                                            <select
                                                                className="form-select custom-page-dropdown"
                                                                value={page}
                                                                onChange={(e) => setPage(Number(e.target.value))}
                                                                >
                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                    <option key={i + 1} value={i + 1}>
                                                                    {i + 1}
                                                                    </option>
                                                                ))}
                                                                </select>
                                                                <p className="ms-2">of {totalPages}</p>
                                                        </div>

                                                        <nav aria-label="Page navigation">
                                                            <ul className="pagination custom-pagination mb-0">
                                                               <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                                    <button className="page-link" onClick={() => setPage(1)}>
                                                                        <HiChevronDoubleLeft />
                                                                    </button>
                                                                    </li>

                                                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                                    <button className="page-link" onClick={() => setPage(page - 1)}>
                                                                        <HiChevronLeft />
                                                                    </button>
                                                                    </li>

                                                                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                                                    <button className="page-link" onClick={() => setPage(page + 1)}>
                                                                        <HiChevronRight />
                                                                    </button>
                                                                    </li>

                                                                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                                                    <button className="page-link" onClick={() => setPage(totalPages)}>
                                                                        <HiChevronDoubleRight />
                                                                    </button>
                                                                    </li>

                                                            </ul>
                                                        </nav>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={`tab-pane fade ${activeTab === "card" ? "show active" : ""}`}
                                      onMouseEnter={initCard}>
                                        <div className="row justify-content-between">
                                            <div className="col-lg-6 mb-3">
                                                <div className="sub-tab-brd">
                                                    <div className="custom-frm-bx">
                                                        <label>Doctor Name</label>
                                                        <input type="text" className="form-control nw-select-frm"
                                                          placeholder="Enter Name"
                                                          value={cardName}
                                                          onChange={e => { setCardName(e.target.value); setCardReady(false); }} />
                                                    </div>
                                                    <div className="custom-frm-bx">
                                                        <label>Doctor ID</label>
                                                        <input type="text" className="form-control nw-select-frm"
                                                          placeholder="Enter ID"
                                                          value={cardId}
                                                          onChange={e => { setCardId(e.target.value); setCardReady(false); }} />
                                                    </div>
                                                    <div className="text-end">
                                                        <button className="nw-filtr-thm-btn" onClick={handleGenerate}
                                                          disabled={!cardName}>Generate</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-5">
                                                <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                                                    <div ref={cardRef} className="add-patients-clients">
                                                        <img src="/nw-card.png" alt="" />
                                                        <div className="patient-card-details">
                                                            <h4>{cardReady ? cardName.toUpperCase() : (doctor?.name?.toUpperCase() || "DOCTOR NAME")}</h4>
                                                            <p>Doctor ID</p>
                                                            <h6>{cardReady ? cardId : (doctor?.user?.nh12 || "NHCXXXXXXXX")}</h6>
                                                        </div>
                                                        <div className="qr-code-generate">
                                                          {cardReady && (
                                                            <QRCodeCanvas
                                                              value={`NEOHEALTH:${cardId}:${cardName}`}
                                                              size={60} level="M"
                                                              bgColor="transparent" fgColor="#ffffff"
                                                            />
                                                          )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className="patient-crd-down-btn"
                                                          onClick={handleCardDownload}
                                                          disabled={!cardReady}
                                                          style={{opacity: cardReady ? 1 : 0.4}}>
                                                          <FontAwesomeIcon icon={faDownload} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {!cardReady && (
                                                  <p className="text-center text-muted mt-2" style={{fontSize:12}}>
                                                    Name confirm karo aur Generate dabao
                                                  </p>
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
        </>
    )
}

export default DoctorInfoDetails