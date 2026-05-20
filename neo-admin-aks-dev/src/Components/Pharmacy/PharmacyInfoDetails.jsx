import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faDownload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { IMAGE_BASE_URL } from "../../utils/config";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { useRef } from "react";


function PharmacyInfoDetails() {
const cardRef = useRef(null);
const { id } = useParams();
const [loading, setLoading] = useState(true);
const [pharmacy, setPharmacy] = useState(null);
const [address, setAddress] = useState(null);
const [contact, setContact] = useState(null);
const [documents, setDocuments] = useState(null);
const [images, setImages] = useState([]);


const downloadCard = async () => {
  const canvas = await html2canvas(cardRef.current);
  const link = document.createElement("a");
  link.download = "pharmacy-card.png";
  link.href = canvas.toDataURL();
  link.click();
};


const loadData = async () => {
  try {
    setLoading(true);

    const res = await api.get(`/api/admin/pharmacy/${id}`);

    const d = res.data;

    setPharmacy(d.user);
    setContact(d.pharPerson);
    setAddress(d.pharAddress);
    setDocuments(d.pharLicense);
    setImages(d.pharImg);

  } catch {
    toast.error("Failed to load pharmacy details");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  loadData();
}, [id]);

if (loading) return <div className="p-4">Loading...</div>;

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Pharmacy  Details</h3>
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
                                                Pharmacy List
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Pharmacy  Details
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
                                            Pharmacy Profile
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
                                            id="medicine-tab"
                                            data-bs-toggle="tab"
                                            href="#medicine"
                                            role="tab"
                                        >
                                            H1 Medicine Request
                                        </a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a
                                            className="nav-link"
                                            id="sell-tab"
                                            data-bs-toggle="tab"
                                            href="#sell"
                                            role="tab"
                                        >
                                            Sell  H1 Medicine
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
                                                            <img
                                                                src={
                                                                    pharmacy?.logo
                                                                        ? `${IMAGE_BASE_URL}/${pharmacy.logo}`
                                                                        : "/pharmacy-logo.png"
                                                                    }
                                                                alt=""
                                                                onError={(e) => (e.target.src = "/pharmacy-logo.png")}
                                                                />
                                                        </div>
                                                        <div className="doctor-content-details">
                                                            <div className="doctor-info-heading">
                                                                <h4>{pharmacy?.name}</h4>
                                                                <p>PHA-{pharmacy?.userId?.slice(-6)}</p>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>+91-{pharmacy?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{pharmacy?.email}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gst Number</h6>
                                                                    <p>{pharmacy?.gstNumber}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        About
                                                    </legend>
                                                    <p>{pharmacy?.about} </p>
                                                </fieldset>

                                                <fieldset className="address-fieldset mb-4">
                                                    <legend className="float-none w-auto px-3 legend-title">
                                                        Pharmacy  Images
                                                    </legend>

                                                    <div className="row">
                                                        {/* Thumbnail */}
                                                        {images?.thumbnail && (
                                                            <div className="col-lg-4 mb-3">
                                                            <div className="lab-thumb-bx">
                                                                <h5>Thumbnail</h5>
                                                                <img
                                                                    src={`${IMAGE_BASE_URL}/${images.thumbnail}`}
                                                                    alt=""
                                                                    />
                                                            </div>
                                                            </div>
                                                        )}
                                                        {/* Gallery */}
                                                        {images?.pharImg?.map((img, i) => (
                                                            <div className="col-lg-4 mb-3" key={i}>
                                                            <div className="lab-thumb-bx">
                                                                <h5>Pharmacy Image</h5>
                                                                <img src={`${IMAGE_BASE_URL}/${img}`} alt="" />
                                                            </div>
                                                            </div>
                                                        ))}

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
                                                                <p>{address?.fullAddress}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="doctor-content-details">
                                                        <div className="doctor-info-list">
                                                            <div className="doctor-info-item">
                                                                <h6>Country</h6>
                                                                <p>{address?.countryId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>State</h6>
                                                                <p>{address?.stateId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>City </h6>
                                                                <p>{address?.cityId?.name}</p>
                                                            </div>

                                                            <div className="doctor-info-item">
                                                                <h6>Pincode </h6>
                                                                <p>{address?.pinCode}</p>
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
                                                                    <p>{documents?.pharLicenseNumber}</p>

                                                                    <div className="lab-certificate-dwn">
                                                                        <div>
                                                                            <h6 ><a
                                                                                href={`${IMAGE_BASE_URL}/${documents?.licenseFile}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                >
                                                                                <FontAwesomeIcon icon={faFilePdf} /> License.pdf
                                                                                </a></h6>
                                                                        </div>
                                                                        <div className="">
                                                                            <a
                                                                            href={`${IMAGE_BASE_URL}/${documents?.licenseFile}`}
                                                                            download
                                                                            className="notifi-remv-btn"
                                                                            >
                                                                            <FontAwesomeIcon icon={faDownload} />
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {documents?.pharCert?.map((cert) => (
                                                        <div className="col-lg-3 mb-3" key={cert._id}>
                                                            <div className="lab-thumb-bx">
                                                            <h5>Certificate</h5>

                                                            <div className="lab-license-bx">
                                                                <h6>Certified Name</h6>
                                                                <p>{cert.certName}</p>

                                                                <div className="lab-certificate-dwn">
                                                                <h6>
                                                                    <FontAwesomeIcon icon={faFilePdf} /> Certificate
                                                                </h6>

                                                                <a
                                                                    href={`${IMAGE_BASE_URL}/${cert.certFile}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="notifi-remv-btn"
                                                                >
                                                                    <FontAwesomeIcon icon={faDownload} />
                                                                </a>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        ))}

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
                                                                        contact?.photo
                                                                        ? `${IMAGE_BASE_URL}/${contact.photo}`
                                                                        : "/doctor-info-pic.png"
                                                                    }
                                                                alt=""
                                                                onError={(e) => (e.target.src = "/doctor-info-pic.png")}
                                                                />
                                                        </div>
                                                        <div className="doctor-content-details justify-content-evenly">
                                                            <div className="doctor-info-heading">
                                                                <h4>{contact?.name}</h4>
                                                            </div>

                                                            <div className="doctor-info-list">
                                                                <div className="doctor-info-item">
                                                                    <h6>Mobile Number</h6>
                                                                    <p>+91-{contact?.contactNumber}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Gender</h6>
                                                                    <p>{contact?.gender}</p>
                                                                </div>

                                                                <div className="doctor-info-item">
                                                                    <h6>Email</h6>
                                                                    <p>{contact?.email}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="medicine" role="tabpanel">
                                        <div className="col-lg-12">
                                            <div className="table-section">
                                                <div className="table table-responsive mb-0">
                                                    <table className="table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>S.no.</th>
                                                                <th>Medicine Name</th>
                                                                <th>Date</th>
                                                                <th>Description</th>
                                                                <th>Stock</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            <tr>
                                                                <td>1</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td><span className="paid-title"> Approved</span></td>
                                                                <td></td>
                                                                
                                                            </tr>
                                                            <tr>
                                                                <td>2</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td></td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <a href="javascript:void(0)" className="approved" data-bs-toggle="modal" data-bs-target="#medicineRequset">Approve</a>
                                                                    <a href="javascript:void(0)" className="approved reject">Reject</a>
                                                                    </div>
                                                                </td>
                                                                
                                                            </tr>

                                                            <tr>
                                                                <td>3</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td></td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <a href="javascript:void(0)" className="approved">Approve</a>
                                                                    <a href="javascript:void(0)" className="approved reject">Reject</a>
                                                                    </div>
                                                                </td>
                                                                
                                                            </tr>

                                                            <tr>
                                                                <td>4</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td><span className="paid-title reject-title"> Rejected</span></td>
                                                                <td></td>
                                                                
                                                            </tr>

                                                            <tr>
                                                                <td>5</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td><span className="paid-title pending-title">  Pending</span></td>
                                                                <td></td>
                                                                
                                                            </tr>

                                                            <tr>
                                                                <td>6</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td><span className="paid-title">   Approved</span></td>
                                                                <td></td>
                                                                
                                                            </tr>

                                                             <tr>
                                                                <td>7</td>
                                                                <td>
                                                                    Alprazolam
                                                                </td>
                                                                <td>20 June 2025</td>
                                                                <td>
                                                                   Lorem ipsum is and web development.
                                                                </td>
                                                                <td> 100</td>
                                                                <td><span className="paid-title pending-title">  Pending</span></td>
                                                                <td></td>
                                                                
                                                            </tr>

                                                          



                                                        </tbody>
                                                    </table>
                                                </div>




                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="sell" role="tabpanel">
                                        <div className="col-lg-12">
                                            <div className="table-section admin-mega-section">
                                                <div className="table table-responsive mb-0">
                                                    <table className="table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th>Patient Name</th>
                                                                <th>Prescriber Name </th>
                                                                <th>H1 Medicine </th>
                                                                <th>Note</th>
                                                                <th>Prescription</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            <tr>
                                                                <td>01-Oct-25</td>
                                                                <td>
                                                                    Ram Kumar
                                                                </td>
                                                                <td>
                                                                    Dr. Arjun Singh
                                                                </td>
                                                                <td>Alprazolam(20)</td>
                                                                <td>-</td>
                                                               <td>
                                              
                                                    <div className="dropdown">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="admin-sub-dropdown "
                                                            id="acticonMenu1"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                           View
                                                        </a>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                            aria-labelledby="acticonMenu1"
                                                        >
                                                            <li className="prescription-item">
                                                                <NavLink to="/pharmacy-detail"  className="prescription-nav" href="#">
                                                                   View 
                                                                </NavLink>
                                                            </li>

                                                            <li className="prescription-item">
                                                                <a className=" prescription-nav" href="#">
                                                                   
                                                                   Patient details  
                                                                </a>
                                                            </li>

                                                            <li className=" prescription-item">
                                                                <a className="prescription-nav" href="#">
                                                                   
                                                                   Delete 
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                               </td>

                                                                <td>
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="grid-dots-btn"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>01-Oct-25</td>
                                                                <td>
                                                                    Ram Kumar
                                                                </td>
                                                                <td>
                                                                    Dr. Arjun Singh
                                                                </td>
                                                                <td>Alprazolam(20)</td>
                                                                <td>-</td>
                                                               <td>
                                              
                                                    <div className="dropdown">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="admin-sub-dropdown "
                                                            id="acticonMenu1"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                           View
                                                        </a>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                            aria-labelledby="acticonMenu1"
                                                        >
                                                            <li className="prescription-item">
                                                                 <NavLink to="/pharmacy-detail"  className="prescription-nav" href="#">
                                                                   View 
                                                                </NavLink>
                                                            </li>

                                                            <li className="prescription-item">
                                                                <a className=" prescription-nav" href="#">
                                                                   
                                                                   Patient details  
                                                                </a>
                                                            </li>

                                                            <li className=" prescription-item">
                                                                <a className="prescription-nav" href="#">
                                                                   
                                                                   Delete 
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                               </td>

                                                                <td>
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="grid-dots-btn"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>01-Oct-25</td>
                                                                <td>
                                                                    Ram Kumar
                                                                </td>
                                                                <td>
                                                                    Dr. Arjun Singh
                                                                </td>
                                                                <td>Alprazolam(20)</td>
                                                                <td>-</td>
                                                              <td>
                                              
                                                    <div className="dropdown">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="admin-sub-dropdown "
                                                            id="acticonMenu1"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                           View
                                                        </a>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                            aria-labelledby="acticonMenu1"
                                                        >
                                                            <li className="prescription-item">
                                                                 <NavLink to="/pharmacy-detail"  className="prescription-nav" href="#">
                                                                   View 
                                                                </NavLink>
                                                            </li>

                                                            <li className="prescription-item">
                                                                <a className=" prescription-nav" href="#">
                                                                   
                                                                   Patient details  
                                                                </a>
                                                            </li>

                                                            <li className=" prescription-item">
                                                                <a className="prescription-nav" href="#">
                                                                   
                                                                   Delete 
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                               </td>

                                                                <td>
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="grid-dots-btn"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>01-Oct-25</td>
                                                                <td>
                                                                    Ram Kumar
                                                                </td>
                                                                <td>
                                                                    Dr. Arjun Singh
                                                                </td>
                                                                <td>Alprazolam(20)</td>
                                                                <td>-</td>
                                                               <td>
                                              
                                                    <div className="dropdown">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="admin-sub-dropdown "
                                                            id="acticonMenu1"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                           View
                                                        </a>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                            aria-labelledby="acticonMenu1"
                                                        >
                                                            <li className="prescription-item">
                                                                 <NavLink to="/pharmacy-detail"  className="prescription-nav" href="#">
                                                                   View 
                                                                </NavLink>
                                                            </li>

                                                            <li className="prescription-item">
                                                                <a className=" prescription-nav" href="#">
                                                                   
                                                                   Patient details  
                                                                </a>
                                                            </li>

                                                            <li className=" prescription-item">
                                                                <a className="prescription-nav" href="#">
                                                                   
                                                                   Delete 
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                               </td>

                                                                <td>
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="grid-dots-btn"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>01-Oct-25</td>
                                                                <td>
                                                                    Ram Kumar
                                                                </td>
                                                                <td>
                                                                    Dr. Arjun Singh
                                                                </td>
                                                                <td>Alprazolam(20)</td>
                                                                <td>-</td>
                                                               <td>
                                              
                                                    <div className="dropdown">
                                                        <a
                                                            href="javascript:void(0)"
                                                            className="admin-sub-dropdown "
                                                            id="acticonMenu1"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                           View
                                                        </a>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-end  tble-action-menu admin-dropdown-card"
                                                            aria-labelledby="acticonMenu1"
                                                        >
                                                            <li className="prescription-item">
                                                                <NavLink to="/pharmacy-detail"  className="prescription-nav" href="#">
                                                                   View 
                                                                </NavLink>
                                                            </li>

                                                            <li className="prescription-item">
                                                                <a className=" prescription-nav" href="#">
                                                                   
                                                                   Patient details  
                                                                </a>
                                                            </li>

                                                            <li className=" prescription-item">
                                                                <a className="prescription-nav" href="#">
                                                                   
                                                                   Delete 
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                               </td>

                                                                <td>
                                                                    <a
                                                                        href="javascript:void(0)"
                                                                        className="grid-dots-btn"
                                                                    >
                                                                        <TbGridDots />
                                                                    </a>
                                                                </td>
                                                            </tr>



                                                        </tbody>
                                                    </table>
                                                </div>




                                            </div>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="card" role="tabpanel">
                                         <div className="row justify-content-between">
                                                                                    <div className="col-lg-6 mb-3">
                                                                                        <div className="sub-tab-brd">
                                                                                            <div className="custom-frm-bx">
                                                                                                <label htmlFor="">Pharmacy Name</label>
                                                                                                <input type="text" placeholder="" value={pharmacy?.name || ""} readOnly className="form-control nw-select-frm" />
                                                                                            </div>
                                        
                                                                                            <div className="text-end">
                                                                                                <button className="nw-filtr-thm-btn">Generate</button>
                                                                                            </div>
                                        
                                                                                        </div>
                                                                                    </div>
                                        
                                                                                    <div className="col-lg-6">
                                                                                        <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                                                                                            <div className="add-patients-clients" onClick={downloadCard}>
                                                                                                <div className="chip-card"></div>
                                                                                                <img src="/pharmacy-card.png" alt="" />
                                                                                                <div className="patient-card-details">
                                                                                                <h4>{pharmacy?.name}</h4>
                                                                                                <p>Pharmacy ID</p>
                                                                                                <h6>PHA-{pharmacy?.userId?.slice(-6)}</h6>
                                                                                                </div>

                                                                                                <div className="qr-code-generate">
                                                                                                <QRCodeCanvas
                                                                                                    value={`PHARMACY-${pharmacy?._id}`}
                                                                                                    size={90}
                                                                                                />
                                                                                                </div>

                                        
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


            {/* <!-- Client Member Alert Popup Start --> */}
                        {/* <!--  data-bs-toggle="modal" data-bs-target="#medicineRequset" --> */}
                        <div className="modal step-modal" id="medicineRequset" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                            aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-md">
                                <div className="modal-content rounded-5 p-4">
                                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2">
                                        <div>
                                            <h6 className="lg_title mb-0">Send  H1 Medicine Request</h6>
                                        </div>
                                        <div>
                                            <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                                <FontAwesomeIcon icon={faClose} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-body p-0">
                                        <div className="row ">
                                            <div className="col-lg-12 mt-4">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Select Medicine </label>
                                                    <select name="" id="" className="form-select nw-frm-select">
                                                        <option value="">Alprazolam</option>
                                                    </select>
                                                </div>

                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Quantity</label>
                                                    <input type="text" name="" id="" className="form-control admin-table-search-frm" placeholder="100" />
                                                </div>
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Message</label>
                                                    <textarea name="" id="" className="form-control admin-table-search-frm" placeholder="Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        {/* <!-- Meeting Alert Popup End --> */}

        </>
    )
}

export default PharmacyInfoDetails