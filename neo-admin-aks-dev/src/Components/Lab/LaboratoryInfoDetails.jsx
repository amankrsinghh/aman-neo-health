import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faEye, faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { IMAGE_BASE_URL } from "../../utils/config";

function LaboratoryInfoDetails() {
    const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState(null);
  const [appointments, setAppointments] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [apptLoading, setApptLoading] = useState(false);

  /* ================= LOAD ================= */

const loadLabs = async () => {
  try {
    setLoading(true);

    const res = await api.get(`/api/admin/lab/lab-detail/${id}`);

    console.log("FULL RESPONSE:", res);
    console.log("DATA:", res.data);

    setLabs(res.data);

  } catch (err) {
    console.error("API ERROR:", err.response || err);
    toast.error("Failed to load laboratory details");
  } finally {
    setLoading(false);
  }
};


 const loadAppointments = async (p = 1) => {
  try {
    setApptLoading(true);

    const res = await api.get(`/api/admin/lab/lab-appointments/${id}`, {
      params: { page: p }
    });

    setAppointments(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
    setPage(p);

  } catch (err) {
    toast.error("Failed to load appointments");
  } finally {
    setApptLoading(false);
  }
};



  useEffect(() => {
    loadLabs();
    loadAppointments(1);
  }, [id]);

  /* ================= SAFE DATA ================= */
  const user = labs?.user;
  const labPerson = labs?.labPerson;
  const labAddress = labs?.labAddress;
  const labImg = labs?.labImg;
  const labLicense = labs?.labLicense;


  const fileUrl = (path) =>
  path ? `${IMAGE_BASE_URL}${path}` : "";



  /* ================= LOADING ================= */

  if (loading || !labs) return <div className="p-4">Loading...</div>;


    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Laboratory Detail</h3>
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
                                            Laboratory Detail
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
                                        <a
                                            className="nav-link active"
                                            id="home-tab"
                                            data-bs-toggle="tab"
                                            href="#home"
                                            role="tab"
                                        >
                                            Laboratory Profile
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
                                            Contact Person
                                        </a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a
                                            className="nav-link"
                                            id="appoitment-tab"
                                            data-bs-toggle="tab"
                                            href="#appoitment"
                                            role="tab"
                                        >
                                            Appoitment List
                                        </a>
                                    </li>



                                    <li className="nav-item" role="presentation">
                                        <a
                                            className="nav-link"
                                            id="card-tab"
                                            data-bs-toggle="tab"
                                            href="#card"
                                            role="tab"
                                        >
                                            NeoCard
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="home"
                                        role="tabpanel"
                                    >

                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="doctor-information-card mb-4">
                                                    <div className="doctor-main-profile-card">
                                                        <div className="lab-personal-pic">
                                                            <img src="/profile-tab-avatar.png" alt="" />
                                                        </div>
                                                        <div className="doctor-content-details">
                                                            <div className="doctor-info-heading">
                                                                <h4>{user?.name}</h4>
                                                                <p>LAB-{labs?.customId}</p>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>+91-{user?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{user?.email}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gst Number</h6>
                                                                    <p>{user?.gstNumber}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        About
                                                    </legend>

                                                    <p>{user?.about}</p>


                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Lab Images
                                                    </legend>

                                                    <div className="row">
                                                        <div className="col-lg-4 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Thumbnail image</h5>
                                                                <img src={labImg?.thumbnail ? fileUrl(labImg.thumbnail) : "/pic-two.png"} alt="thumbnail" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Laboratory images</h5>
                                                                {labImg?.labImg?.map((img, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={fileUrl(img)}
                                                                    alt="lab"
                                                                    className="me-2 mb-2"
                                                                    style={{ width: 120 }}
                                                                />
                                                                ))}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </fieldset>


                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Address
                                                    </legend>
                                                    <div className="doctor-content-details mb-3">
                                                        <div className="doctor-info-list ">
                                                            <div className="doctor-info-item">
                                                                <h6>Full Address</h6>
                                                                <p>{labAddress?.fullAddress}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="doctor-content-details">
                                                        <div className="doctor-info-list">
                                                            <div className="doctor-info-item">
                                                                <h6>Country</h6>
                                                                <p>{labAddress?.countryId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>State</h6>
                                                                <p>{labAddress?.stateId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>City </h6>
                                                                <p>{labAddress?.cityId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Pincode </h6>
                                                                <p>{labAddress?.pinCode}</p>
                                                            </div>
                                                        </div>

                                                    </div>


                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        License And Certificate
                                                    </legend>

                                                    <div className="row">
                                                        <div className="col-lg-3 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>License </h5>

                                                                <div className="lab-license-bx ">
                                                                    <h6>Lab License Number</h6>
                                                                    <p>{labLicense?.labLicenseNumber}</p>

                                                                    <div className="lab-certificate-dwn">
                                                                        <div>
                                                                            <h6 ><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Lablcense.pdf</h6>
                                                                        </div>
                                                                        <div className="">
                                                                            <button type="" className="notifi-remv-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Certificate</h5>

                                                                {labLicense?.labCert?.map((cert) => (
                                                                    <div key={cert._id} className="lab-license-bx">
                                                                        <h6>Certified Name</h6>
                                                                        <p>{cert.certName}</p>

                                                                        <div className="lab-certificate-dwn">
                                                                        <h6>
                                                                            <FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />{" "}
                                                                            Certificate.pdf
                                                                        </h6>

                                                                        <a
                                                                            href={`${IMAGE_BASE_URL}/${cert.certFile}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <button className="notifi-remv-btn">
                                                                            <FontAwesomeIcon icon={faDownload} />
                                                                            </button>
                                                                        </a>
                                                                        </div>
                                                                    </div>
                                                                    ))}
                                                            </div>


                                                        </div>
                                                    </div>


                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="profile" role="tabpanel">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="doctor-information-card mb-4">
                                                    <div className="doctor-main-profile-card">
                                                        <div className="doctor-profile-pic">
                                                            <img
                                                                src={
                                                                labPerson?.photo
                                                                    ? fileUrl(labPerson.photo)
                                                                    : "/doctor-info-pic.png"
                                                                }
                                                                width={80}
                                                                alt="person"
                                                            />
                                                        </div>
                                                        <div className="doctor-content-details justify-content-evenly">
                                                            <div className="doctor-info-heading">
                                                                <h4>{labPerson?.name}</h4>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>+91-{labPerson?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gender</h6>
                                                                    <p>{labPerson?.gender}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{labPerson?.email}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>


                                    <div className="tab-pane fade" id="appoitment" role="tabpanel">
                                        <div className="row">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="custom-frm-bx mb-0">
                                                            <input
                                                                type="email"
                                                                className="form-control admin-table-search-frm search-table-frm"
                                                                id="email"
                                                                placeholder="Search"
                                                                required
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
                                                                    <th>Appointment  Details</th>
                                                                    <th>Laboratory </th>
                                                                    <th>Status</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {apptLoading ? (
                                                                    <tr>
                                                                    <td colSpan="7" className="text-center p-4">
                                                                        Loading appointments...
                                                                    </td>
                                                                    </tr>
                                                                ) : appointments.length === 0 ? (
                                                                    <tr>
                                                                    <td colSpan="7" className="text-center p-4">
                                                                        No appointments found
                                                                    </td>
                                                                    </tr>
                                                                ) : (
                                                                    appointments.map((item, i) => (
                                                                    <tr key={item._id}>
                                                                        <td>{i + 1}.</td>

                                                                        <td>#{item.appointmentId}</td>

                                                                        {/* Patient */}
                                                                        <td>
                                                                        <div className="admin-table-bx">
                                                                            <div className="admin-table-sub-bx">
                                                                            <img src="/admin-tb-logo.png" alt="" />
                                                                            <div className="admin-table-sub-details">
                                                                                <h6>{item.patientName}</h6>
                                                                                <p>PA-{item.patientId}</p>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        </td>

                                                                        {/* Appointment Details */}
                                                                        <td>
                                                                        <ul className="ad-info-list">
                                                                            <li className="ad-info-item">
                                                                            <span className="ad-info-title">Appointment Date :</span>{" "}
                                                                            {new Date(item.date).toLocaleString()}
                                                                            </li>

                                                                            <li className="ad-info-item">
                                                                            <span className="ad-info-title">Total Amount :</span> ₹
                                                                            {item.amount}
                                                                            </li>

                                                                            <li className="ad-info-item patient-report-item">
                                                                            <span className="ad-info-title">Test:</span>{" "}
                                                                            {item.tests.join(", ")}
                                                                            </li>
                                                                        </ul>
                                                                        </td>

                                                                        {/* Lab Info */}
                                                                        <td>
                                                                        <div className="admin-table-bx">
                                                                            <div className="admin-table-sub-bx ">
                                                                            <div className="laboratory-pic">
                                                                                <img src="/profile-tab-avatar.png" alt="" />
                                                                            </div>
                                                                            <div className="admin-table-sub-details ">
                                                                                <h6>{user?.name}</h6>
                                                                                <p>LAB-{labs?.customId}</p>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        </td>

                                                                        {/* Status */}
                                                                        <td>
                                                                        <span className={`approved approved-${item.status}`}>
                                                                            {item.status}
                                                                        </span>
                                                                        </td>

                                                                        {/* Actions */}
                                                                        <td>
                                                                        <div className="dropdown position-static">
                                                                            <a
                                                                            href="#"
                                                                            className="grid-dots-btn"
                                                                            data-bs-toggle="dropdown"
                                                                            >
                                                                            <TbGridDots />
                                                                            </a>

                                                                            <ul className="dropdown-menu dropdown-menu-end admin-dropdown-card">
                                                                            <li className="prescription-item">
                                                                                <NavLink
                                                                                to={`/lab-appointment-details/${item._id}`}
                                                                                className="prescription-nav"
                                                                                >
                                                                                View Details
                                                                                </NavLink>
                                                                            </li>

                                                                            <li className="prescription-item">
                                                                                <a className="prescription-nav" href="#">
                                                                                Delete
                                                                                </a>
                                                                            </li>
                                                                            </ul>
                                                                        </div>
                                                                        </td>
                                                                    </tr>
                                                                    ))
                                                                )}
                                                            </tbody>

                                                        </table>
                                                    </div>

                                                    <div className="custom-pagination-wrapper d-flex justify-content-between align-items-center flex-wrap mt-3">

                                                        <div className="page-selector d-flex align-items-center mb-2 mb-md-0">
                                                            <p className="me-2 ">Page</p>
                                                            <select className="form-select custom-page-dropdown">
                                                                <option value="1" selected>1</option>
                                                                <option value="2">2</option>
                                                            </select>
                                                            <p className="ms-2">of 10</p>
                                                        </div>

                                                        <nav>
                                                            <ul className="pagination custom-pagination mb-0">

                                                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => loadAppointments(page - 1)}
                                                                >
                                                                    <HiChevronLeft />
                                                                </button>
                                                                </li>

                                                                {[...Array(totalPages)].map((_, i) => (
                                                                <li
                                                                    key={i}
                                                                    className={`page-item ${page === i + 1 ? "active" : ""}`}
                                                                >
                                                                    <button
                                                                    className="page-link"
                                                                    onClick={() => loadAppointments(i + 1)}
                                                                    >
                                                                    {i + 1}
                                                                    </button>
                                                                </li>
                                                                ))}

                                                                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => loadAppointments(page + 1)}
                                                                >
                                                                    <HiChevronRight />
                                                                </button>
                                                                </li>

                                                            </ul>
                                                            </nav>

                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="tab-pane fade" id="card" role="tabpanel">
                                        <div className="row justify-content-between">
                                            <div className="col-lg-6 mb-3">
                                                <div className="sub-tab-brd">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Patient Name</label>
                                                        <input type="text" placeholder="" value='RAVI KUMAR' className="form-control nw-select-frm" />
                                                    </div>

                                                    <div className="text-end">
                                                        <button className="nw-filtr-thm-btn">Generate</button>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                                                    <div className="add-patients-clients">
                                                        <div className="chip-card"></div>
                                                        <img src="/lab-card.png" alt="" />
                                                        <div className="patient-card-details nw-patient-card-details">
                                                            <h4>RAVI Kumar</h4>
                                                            <p>Laboratory ID</p>
                                                            <h6>Lab202425</h6>
                                                        </div>
                                                        <div className="qr-code-generate"></div>

                                                    </div>

                                                    <div>
                                                        <button className="patient-crd-down-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                                    </div>
                                                </div>

                                            </div>



                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>




            </div>


            {/*Payment Status Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            <div className="modal step-modal" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5 p-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="lg_title mb-0">Lab Report</h6>
                            </div>
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body p-0">
                            <div className="row justify-content-center ">
                                <div className="col-lg-9 my-5">
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
                                                    <div className="">
                                                        <div className="admin-table-sub-details d-flex align-items-center gap-2 doctor-title ">
                                                            <div>
                                                                <h6>Dr. David Patel </h6>
                                                                <p className="fs-14 fw-500">DO-4001</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="d-flex align-items gap-2">
                                                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faPrint} /></button>
                                                    <button type="button" className="card-sw-btn"><FontAwesomeIcon icon={faEye} /></button>
                                                </div>
                                            </div>

                                            <div className="barcd-scannr barcde-scnnr-card">
                                                <div className="barcd-content">
                                                    <h4>SP-9879</h4>
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
                    </div>
                </div>
            </div>
            {/*  Payment Status Popup End */}

        </>
    )
}

export default LaboratoryInfoDetails