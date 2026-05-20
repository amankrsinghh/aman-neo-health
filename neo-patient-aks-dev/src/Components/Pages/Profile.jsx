import { faEnvelope, faMarsAndVenus, faPen, faPhone, faUser, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { HiCheckBadge } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateApiData } from "../../Services/api";
import { fetchPatientDetail } from "../../Redux/features/patient";
import { toast } from "react-toastify";
import base_url from "../../baseUrl";
import { Link } from "react-router-dom";


function Profile() {
    const dispatch = useDispatch()
    const userId = localStorage.getItem('userId')
    const { profiles, medicalHistory, user, demographic, notAllowed, labAppointment, kyc, prescription, isRequest, customId } = useSelector(state => state.patient)
    const [formData, setFormData] = useState({ name: "", email: "", contactNumber: "", gender: "", profileImage: null })

    const handleChange = (e) => {
        const { type, name, value, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        for (let key in formData) {
            if (key == 'profileImage') continue;
            data.append(key, formData[key])
        }
        if (formData.profileImage instanceof File) {
            data.append('profileImage', formData.profileImage)
        }
        try {
            const response = await updateApiData('patient', data)
            if (response.success) {
                dispatch(fetchPatientDetail())
                toast.success("Data updated")
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in updating profile")
        }
    }
    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])
    useEffect(() => {
        if (profiles && Object?.keys(profiles)?.length > 0) {
            setFormData(profiles)
        }
    }, [profiles])
    return (
        <>

            <div className="profile-right-card" >
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0"> Profile</h5>
                </div>
                {notAllowed && <div className="doctor-review-bx mt-3 mx-auto">
                    <div className="doctor-submit-bx">
                        <p>Your profile has been submitted and is under review by the doctor.
                            Approval is required before your account becomes active.</p>
                    </div>
                </div>}
                <div className="all-profile-data-bx">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="lab-profile-mega-bx text-center">
                                    <div className="lab-profile-avatr-bx position-relative d-inline-block">
                                        <img src={formData?.profileImage ?
                                            formData?.profileImage instanceof File ? URL.createObjectURL(formData.profileImage)
                                                : `${base_url}/${formData?.profileImage}`
                                            : "/profile.png"} alt="" className="rounded-cricle"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/profile.png";
                                            }} />
                                        <div className="lab-profile-edit-avatr">
                                            <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                                <FontAwesomeIcon icon={faPen} />
                                            </a>
                                        </div>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            onChange={handleChange}
                                            accept=""
                                            className="lab-profile-file-input"
                                        />
                                    </div>
                                    <div className="user-detail-bx my-2">
                                        <h5 className="">{profiles?.name}</h5>
                                        <p>ID: {user?.nh12}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter your name" />
                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mobile Number</label>
                                    <input type="number" name="contactNumber" value={formData.contactNumber} className="form-control new-control-frm verify-account-frm px-5" placeholder="Enter your number" />
                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                    </div>

                                    <div className="verification-num-bx">
                                        <span className="verify-title"> <HiCheckBadge /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter your email" />
                                    <div className="contact-add-icon">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Gender</label>
                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMarsAndVenus} /> </span>
                                        <select className="nw-select" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option>--Select Gender--</option>
                                            <option value='Male'>Male</option>
                                            <option value='Female'>Female</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="text-end mt-3">
                                <button className="nw-thm-btn">Save</button>
                            </div>
                        </div>
                    </form>
                </div>





            </div>

            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>

        </>
    )
}

export default Profile