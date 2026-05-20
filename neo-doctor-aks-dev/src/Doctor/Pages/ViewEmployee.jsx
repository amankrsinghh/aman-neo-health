import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faEnvelope, faFilePdf, faHome, faLocationDot, faMoneyBill, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSecureApiData } from "../../Services/api";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";
;

function ViewEmployee() {
    const params = useParams()
    const name = params.name
    const staffId = params.id
    const [staffData,setStaffData]=useState()
    const [userData,setUserData]=useState()
    const [empData, setEmpData] = useState()
    const [employmentData, setEmployementData] = useState()
    const [accessData, setAccessData] = useState()
    const [proffData, setProffData] = useState()
    const {user,isOwner}=useSelector(state=>state.doctor)
    useEffect(() => {
        fetchStaffData()
    }, [staffId])
    const downloadFile = (url, fileName) => {
        fetch(url, { mode: "cors" })
            .then(res => res.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            })
            .catch(err => console.error(err));
    };
    async function fetchStaffData() {
        try {
            const result = await getSecureApiData(`api/staff/${staffId}`);
            if (result.success) {
                const staffdata=result.staffData
                setStaffData(staffdata)
                setEmployementData(result.employment)
                setUserData(result.user)
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
    return (
        <>


         <div className="profile-right-card">
                            <div className="profile-tp-header">
                                <h5 className="heading-grad fz-24 mb-0">{isOwner?'View Employee':"My Profile"}</h5>
                            </div>
                            <div className="all-profile-data-bx">
                              <div className="row">
                        <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                            <div className="view-employee-bx">
                                <div>
                                    <div className="view-avatr-bio-bx text-center">
                                        <img src={staffData?.profileImage ? `${base_url}/${staffData?.profileImage}` :
                                         "/table-avatar.jpg"} alt="" />
                                        <h4>{staffData?.name}</h4>
                                        <p><span className="vw-id">ID:</span> {userData?.nh12}</p>
                                        <h6 className="vw-activ text-capitalize">{employmentData?.status}</h6>

                                    </div>

                                    <div>
                                        <ul className="vw-info-list">
                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Join Date</p>
                                                    <p className="vw-info-value">{employmentData?.joinDate ? new Date(employmentData?.joinDate)?.toLocaleDateString('en-GB') : ''}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Date of Birth</p>
                                                    <p className="vw-info-value">{staffData?.dob ? new Date(staffData?.dob)?.toLocaleDateString('en-GB') : ''}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                <div>
                                                    <p className="vw-info-title">Gender </p>
                                                    <p className="vw-info-value text-capitalize">{staffData?.gender}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faHome} /></span>
                                                <div>
                                                    <p className="vw-info-title">Role </p>
                                                    <p className="vw-info-value text-capitalize">{staffData?.role}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faEnvelope} /></span>
                                                <div>
                                                    <p className="vw-info-title">Email </p>
                                                    <p className="vw-info-value">{userData?.email} </p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Phone </p>
                                                    <p className="vw-info-value">{userData?.contactNumber}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faPhone} /></span>
                                                <div>
                                                    <p className="vw-info-title">Emergency Contact Name </p>
                                                    <p className="vw-info-value"><span className="fw-700">({staffData?.emergencyContactName})
                                                    </span>{staffData?.emergencyContactPhone}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faLocationDot} /></span>
                                                <div>
                                                    <p className="vw-info-title">Address</p>
                                                    <p className="vw-info-value">{staffData?.address}</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faClock} /></span>
                                                <div>
                                                    <p className="vw-info-title">Experience</p>
                                                    <p className="vw-info-value">{staffData?.experience} years</p>
                                                </div>
                                            </li>

                                            <li className="vw-info-item">
                                                <span className="vw-info-icon"><FontAwesomeIcon icon={faMoneyBill} /></span>
                                                <div>
                                                    <p className="vw-info-title">Salary</p>
                                                    <p className="vw-info-value">₹ {employmentData?.salary}</p>
                                                </div>
                                            </li>

                                        </ul>

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9 col-md-12 col-sm-12">
                            <div className="view-employee-bx">
                                <div className="employee-tabs">
                                    <ul className="nav nav-tabs gap-3 pt-0" id="myTab" role="tablist">
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
                                                            <p className="">{staffData?.bio}</p>
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Specialization </h4>
                                                            <p className="">{staffData?.specialization} </p>
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Contract Details </h4>
                                                            <div className="vw-contract-bx">
                                                                <div>
                                                                    <h6 className="">Contract Start </h6>
                                                                    <p>{new Date(employmentData?.contractStart)?.toLocaleDateString()}</p>
                                                                </div>

                                                                <div>
                                                                    <h6 className="">Contract end</h6>
                                                                    <p>{new Date(employmentData?.contractEnd)?.toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="vw-contract-bx mt-3">
                                                                <div>
                                                                    <h6 className="">Note</h6>
                                                                    <p>{employmentData?.note}</p>
                                                                </div>

                                                            </div>
                                                        </div>

                      

                                                    </div>



                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="profile" role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Education</h4>
                                                        </div>

                                                        <div className="ovrview-bx vw-qualification-main-bx mb-3">
                                                            {staffData?.education?.map((item, key) =>
                                                                <div className="vw-contract-bx vw-qualification-bx" key={key}>
                                                                    <div>
                                                                        <h6 className="vw-qualification-title">{item?.degree}</h6>
                                                                        <p>{item?.university}</p>
                                                                    </div>

                                                                    <div>
                                                                        <p>{item?.yearFrom} to {item?.yearTo}</p>
                                                                    </div>
                                                                </div>)}
                                                        </div>

                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Certificate </h4>
                                                            {staffData?.certificates?.map((item, key) =>
                                                                <div key={key}>
                                                                    <div className="vw-contract-bx vw-qualification-main-bx">
                                                                        <div>
                                                                            <h6 className="vw-qualification-title my-3">{item?.certificateName}</h6>
                                                                        </div>
                                                                    </div>
                                                                    {item?.certificateFile && <div className="vw-contract-bx d-block vw-qualification-main-bx">
                                                                        <div className="form-control border-0 lablcense-frm-control">
                                                                                <div className="lablcense-bx">
                                                                                    <div>
                                                                                        <h6 ><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />{item?.certificateFile.split("\\").pop().split("-").slice(1).join("-")}</h6>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <button
                                                                                            className="pdf-download-tbn"
                                                                                            onClick={() => downloadFile(`${base_url}/${item?.certificateFile}`, item?.certificateFile)}
                                                                                        >
                                                                                            Download
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    </div>}
                                                                </div>)}

                                                        </div>

                                                    </div>



                                                </div>
                                            </div>

                                            <div className="tab-pane fade" id="contact" role="tabpanel">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="ovrview-bx mb-3">
                                                            <h4 className="new_title">Access</h4>
                                                        </div>

                                                        <div className="ovrview-bx  mb-3">
                                                            <div className="vw-contract-bx vw-qualification-bx">
                                                                <div>
                                                                    <h6 className="">Id</h6>
                                                                    <p>{user?.nh12}</p>
                                                                </div>

                                                                <div>
                                                                    <h6 className="">Email for Access</h6>
                                                                    <p>{employmentData?.email} </p>
                                                                </div>
                                                                <div>
                                                                    <h6 className="">Phone Number for Access</h6>
                                                                    <p>{employmentData?.contactNumber} </p>
                                                                </div>

                                                                {/* <div>
                                                                    <h6 className="">Password</h6>
                                                                    <p>{accessData?.password}</p>
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

                         <div className="text-end mt-4">
                             <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                              </div>


   

        </>
    )
}

export default ViewEmployee