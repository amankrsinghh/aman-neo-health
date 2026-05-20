import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaUser, FaCloudUploadAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";

function CreateAccountPerson() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    // VALIDATION
    const validate = () => {
        let temp = {};

        if (!name.trim()) temp.name = "Name is required";
        if (!mobileNo.trim()) temp.mobile = "Mobile number required";
        else if (mobileNo.length !== 10) temp.mobile = "Invalid mobile number";

        if (!email.trim()) temp.email = "Email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            temp.email = "Invalid email format";

        if (!gender.trim()) temp.gender = "Gender required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const submitContact = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true)

        const formData = new FormData();
        formData.append("name", name);
        formData.append("mobileNumber", mobileNo);
        formData.append("email", email);
        formData.append("gender", gender);
        if (profilePhoto) formData.append("profilePhoto", profilePhoto);

        try {
            const res = await API.post("/hospital/contact", formData);
            console.log("CONTACT SAVED:", res.data);

            // NEXT PAGE
            navigate("/create-account-upload", { replace: true });

        } catch (err) {
            console.error(err.response?.data || err);
        } finally {
            setLoading(false)
        }
    };

    const photoDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setProfilePhoto(file);
    };
    const photoDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <section className="admin-login-section account-lg-section nw-create-account-section">
            <div className="container-fluid px-lg-0">

                {/* Steps */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <div className="account-step-main-bx">

                            <NavLink to="/#">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <FaFlask className="account-step-icon" />
                                    </div>
                                    <h6>Hospital Details</h6>
                                </div>
                            </NavLink>

                            <NavLink to="/#">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <BsFillFileImageFill className="account-step-icon" />
                                    </div>
                                    <h6>Images</h6>
                                </div>
                            </NavLink>

                            <NavLink to="/#">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <FaMapMarkerAlt className="account-step-icon" />
                                    </div>
                                    <h6>Address</h6>
                                </div>
                            </NavLink>

                            <NavLink to="#">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx">
                                        <FaUser className="account-step-icon" />
                                    </div>
                                    <h6>Contact Person</h6>
                                </div>
                            </NavLink>

                            <NavLink to="#">
                                <div className="account-step-crd">
                                    <div className="account-step-bx account-unstep-card">
                                        <FaCloudUploadAlt className="account-step-icon" />
                                    </div>
                                    <h6>Upload</h6>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-5 col-md-8 col-sm-12">

                        <form onSubmit={submitContact}>
                            <div className="nw-form-container">

                                <div className="admin-vndr-login">
                                    <h3>Contact Person</h3>
                                    <p>Enter Hospital Contact Person</p>
                                </div>

                                {/* Name */}
                                <div className="custom-frm-bx">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                </div>

                                {/* Mobile */}
                                <div className="custom-frm-bx">
                                    <label>Mobile Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter Mobile Number"
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}
                                    />
                                    {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                                </div>

                                {/* Email */}
                                <div className="custom-frm-bx">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>

                                {/* Gender */}
                                <div className="custom-frm-bx">
                                    <label>Gender</label>
                                    <select
                                        className="form-select"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">---Select Gender---</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                </div>

                                {/* Profile Photo */}
                                <div className="custom-frm-bx" onDrop={(e) => photoDrop(e)}
                                    onDragOver={photoDragOver}>
                                    <label>Upload Profile Photo</label>
                                    <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                                        <div className="upload-icon mb-2">
                                            <IoCloudUploadOutline />
                                        </div>

                                        <div className="">

                                            <p className="fw-semibold mb-1">
                                                <label htmlFor="fileInput1" className="file-label file-select-label">
                                                    Choose a file or drag & drop here
                                                </label>
                                            </p>

                                            <small className="format-title">JPEG Format</small>

                                            <div className="mt-3">
                                                <label className="browse-btn" htmlFor="profileFile">
                                                    Browse File
                                                    <input
                                                        type="file"
                                                        id="profileFile"
                                                        className="d-none"
                                                        accept=".png,.jpg,.jpeg"
                                                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                                                    />

                                                </label>
                                            </div>

                                            {profilePhoto instanceof File &&
                                                <img src={URL.createObjectURL(profilePhoto)} height={50} width={50} />}
                                        </div>
                                    </div>
                                </div>

                                {/* NEXT */}
                                <div className="d-flex flex-column gap-3 mt-4">
                                    <button type="submit" disabled={loading} className="admin-lg-btn w-100">
                                        {loading ? 'Submitting...' : 'Next'}
                                    </button>
                                    <Link
                                        className="nw-thm-btn outline rounded-3 w-100"
                                        to={'/create-account-upload'}
                                    >
                                        Skip And Continue
                                    </Link>
                                </div>

                            </div>
                        </form>

                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 px-0">
                        <div className="footer-banner-wrap">
                            <img src="/hospital-footer-bnner.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreateAccountPerson;
