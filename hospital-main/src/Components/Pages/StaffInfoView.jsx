import { TbGridDots } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCalendar, faClock, faEnvelope, faFilePdf, faHome, faLocationDot, faMoneyBill, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { getSecureApiData } from "../../Service/api";
import base_url from "../../baseUrl";

function StaffInfoView() {

    const { id } = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [staffUser, setStaffUser] = useState()
     const [staffData,setStaffData]=useState()
    const [userData,setUserData]=useState()
    const [employmentData, setEmployementData] = useState()

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await getSecureApiData(`api/staff/${id}`);
            if (res.success) {
                const staffdata = res.staffData
                setStaffData(staffdata)
                setEmployementData(res.employment)
                setUserData(res.user)
            }
        } catch (err) {
            toast.error("Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!staffData) return <p>No data found</p>;
    const certificates =
        staffData?.certificates?.filter(
            (c) => c && c.certificateName
        ) || [];


    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">View</h3>
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
                                                Doctors
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            View
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>


                    </div>
                </div>



                <div className="view-employee-bx">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                            <div className="view-employee-bx">
                                <div>
                                    <div className="view-avatr-bio-bx text-center">
                                        <img src={
                                            staffData?.profileImage
                                                ? `${base_url}/${staffData?.profileImage}`
                                                : "/profile.png"

                                        }
                                            alt=""
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/profile.png";
                                            }} />
                                        <h4>{staffData?.name}</h4>
                                        <p><span className="vw-id">ID:</span> {userData?.nh12}</p>
                                        <h6 className="vw-activ text-capitalize">{employmentData.status || "active"}</h6>

                                    </div>

                                    <div>
                                        <ul className="vw-info-list">
                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Join Date</p>
                                                    <p className="vw-info-value">
                                                        {employmentData?.joinDate
                                                            ? new Date(employmentData.joinDate).toDateString()
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Date of Birth</p>
                                                    <p className="vw-info-value">
                                                        {staffData?.dob
                                                            ? new Date(staffData.dob).toDateString()
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Gender </p>
                                                    <p className="vw-info-value">{staffData?.gender}</p>
                                                </div>
                                            </li>
                                            {/* <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faBuilding} /></span>
                                                <div>
                                                    <p className="vw-info-title">Department </p>
                                                    <p className="vw-info-value">{employmentData?.department?.departmentName} </p>
                                                </div>
                                            </li> */}
                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faHome} /></span>
                                                <div>
                                                    <p className="vw-info-title">Role </p>
                                                    <p className="vw-info-value">{employmentData?.position}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                                <div>
                                                    <p className="vw-info-title">Email </p>
                                                    <p className="vw-info-value">{staffData?.email}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Phone </p>
                                                    <p className="vw-info-value">{staffData?.mobile}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Emergency Contact Name </p>
                                                    <p className="vw-info-value"><span className="fw-700">
                                                        ({staffData?.emergencyContactName})
                                                    </span>{" "}
                                                        {staffData?.emergencyContactPhone}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                                <div>
                                                    <p className="vw-info-title">Address</p>
                                                    <p className="vw-info-value">
                                                        {staffData?.address},
                                                        {staffData?.cityId?.name},{" "}
                                                        {staffData?.stateId?.name} - {staffData?.pincode}
                                                    </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faClock} /></span>
                                                <div>
                                                    <p className="vw-info-title">Experience</p>
                                                    <p className="vw-info-value">{staffData?.experience || "-"}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faMoneyBill} /></span>
                                                <div>
                                                    <p className="vw-info-title">Salary</p>
                                                    <p className="vw-info-value">
                                                        {employmentData?.salary
                                                            ? `₹${employmentData.salary}`
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

                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="view-employee-bx">
                                <div className="employee-tabs">
                                    <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
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
                                                            <p>{staffData?.bio || "-"}</p>
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Specialization </h4>
                                                            <p>{staffData?.specialization || "-"}</p>
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Contract Details </h4>
                                                            <div className="vw-contract-bx">
                                                                <div>
                                                                    <h6 className="">Contract Start </h6>
                                                                    <p>
                                                                        {employmentData?.contractStart
                                                                            ? new Date(employmentData.contractStart).toDateString()
                                                                            : "-"}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <h6 className="">Contract end</h6>
                                                                    <p>
                                                                        {employmentData?.contractEnd
                                                                            ? new Date(employmentData.contractEnd).toDateString()
                                                                            : "-"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="vw-contract-bx mt-3">
                                                                <div>
                                                                    <h6 className="">Note</h6>
                                                                    <p>-</p>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </div>



                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="profile" role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12 ps-0">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Education</h4>
                                                        </div>

                                                        <div className="ovrview-bx vw-qualification-main-bx mb-3">
                                                            {staffData?.education?.length > 0 ? (
                                                                staffData.education.map((edu, i) => (
                                                                    <div key={i} className="vw-contract-bx vw-qualification-bx">
                                                                        <div>
                                                                            <h6 className="vw-qualification-title">{edu.degree}</h6>
                                                                            <p>{edu.university}</p>
                                                                        </div>

                                                                        <div>
                                                                            <p>{edu.yearFrom} to {edu.yearTo}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p>-</p>
                                                            )}

                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Certificate </h4>
                                                            <div className="vw-contract-bx vw-qualification-main-bx">
                                                                <div>
                                                                    <h6 className="vw-qualification-title my-3">Board Certification in Cardiology</h6>
                                                                </div>
                                                            </div>
                                                            <div className="vw-contract-bx d-block vw-qualification-main-bx">
                                                                {certificates.length > 0 ? (
                                                                    certificates.map((cert, i) => (
                                                                        <div key={i} className="custom-frm-bx">
                                                                            <div className="form-control border-0 lablcense-frm-control">
                                                                                <div className="lablcense-bx">
                                                                                    <div>
                                                                                        <h6 ><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />{cert.certificateName}</h6>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        {cert.certificateFile && (
                                                                                            <a
                                                                                                href={`${base_url}/${cert.certificateFile}`}
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

                                            <div className="tab-pane fade" id="contact" role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12 ps-0">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Access</h4>
                                                        </div>

                                                        <div className="ovrview-bx  mb-3">
                                                            <div className="vw-contract-bx vw-qualification-bx">
                                                                <div>
                                                                    <h6 className="">Contact Number</h6>
                                                                    <p>{userData?.contactNumber}</p>
                                                                </div>

                                                                <div>
                                                                    <h6 className="">Email for Access</h6>
                                                                    <p>{employmentData?.email}</p>
                                                                </div>
                                                                <div>
                                                                    <h6 className="">Phone Number for Access</h6>
                                                                    <p>{employmentData?.contactNumber}</p>
                                                                </div>

                                                                {/* <div>
                                                                    <h6 className="">Password</h6>
                                                                    <p>robert78</p>
                                                                </div> */}


                                                            </div>
                                                        </div>

                                                        <div className="ovrview-bx  mb-3">
                                                            <h4 className="new_title">Permission</h4>
                                                            <div className="vw-contract-bx vw-qualification-bx">
                                                                <div>
                                                                    <h6 className="">Permission  Type</h6>
                                                                    <p>{employmentData?.permissionId?.name}</p>
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
                    </div>
                </div>
                <div className="text-end mt-3">
                    <Link className="nw-thm-btn outline" to={-1}>Go Back</Link>
                </div>

            </div>
        </>
    )
}

export default StaffInfoView