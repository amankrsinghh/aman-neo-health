import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoCloudUploadOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useEffect, useState } from "react";
import { getApiData } from "../../Service/api";
import Select from "react-select";
import { toast } from "react-toastify";
function CreateAccount() {

    const navigate = useNavigate();
    const [loading,setLoading]=useState(false)
    const [hospitalName, setHospitalName] = useState("");
    const [licenseId, setLicenseId] = useState("");
    const [establishedYear, setEstablishedYear] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [gst, setGst] = useState("");
    const [about, setAbout] = useState("");
    const [logo, setLogo] = useState(null);
    const [password, setPassword] = useState("");
    const [category, setCategory] = useState([])
    const [catData, setCatData] = useState([])
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(true)
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [fullAddress,setFullAddress]=useState('')
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [errors, setErrors] = useState({});

    // VALIDATION
    const validate = () => {
        let temp = {};

        if (!hospitalName.trim()) temp.hospitalName = "Hospital name is required";
        if (!fullAddress.trim()) temp.fullAddress = "Full Address is required";
        if (!pinCode.trim()) temp.pinCode = "Pin code is required";
        if (!country.trim()) temp.country = "Country  is required";
        if (!state.trim()) temp.state = "State is required";
        if (!city.trim()) temp.city = "City is required";
        if (!gst.trim()) temp.gst = "Gst is required";
        if (!licenseId.trim()) temp.licenseId = "License ID is required";
        if (!establishedYear.trim()) temp.establishedYear = "Established Year is required";
        if (category?.length == 0) temp.category = "Please select at least 1 category";

        if (!mobileNo.trim()) temp.mobileNo = "Mobile number is required";
        else if (mobileNo.length !== 10) temp.mobileNo = "Mobile number must be 10 digits";

        if (!email.trim()) temp.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            temp.email = "Invalid email format";

        if (!password.trim()) temp.password = "Password is required";
        else if (password.length < 6) temp.password = "Password must be at least 6 characters";

        if (!confirmPassword.trim()) temp.confirmPassword = "Confirm password is required";
        else if (password !== confirmPassword)
            temp.confirmPassword = "Passwords do not match";

        // if (!logo) temp.logo = "Hospital logo is required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    async function fetchCountries() {
        try {
            const response = await getApiData('api/location/countries')
            const data = await response
            setCountries(data)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchCountries()
    }, [])
    // SUBMIT
    const submitBasic = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true)
            // -------------------------
            // CALL 1 → REGISTER USER
            // -------------------------
            const registerPayload = {
                name: hospitalName,
                email: email,
                password: password, mobileNo,
                hospitalName: hospitalName
            };

            const reg = await API.post("/auth/register", registerPayload);
            if (!reg.data.success) {
                toast.error(reg.data.message)
            }

            // console.log("REGISTER SUCCESS:", reg.data);
            // console.log(reg.data.token)
            // Save token
            localStorage.setItem("token", reg.data.token);

            // -------------------------
            // CALL 2 → SAVE HOSPITAL BASIC DETAILS
            // -------------------------
            const formData = new FormData();
            formData.append("hospitalName", hospitalName);
            formData.append("licenseId", licenseId);
            formData.append("establishedYear", establishedYear);
            formData.append("mobileNo", mobileNo);
            formData.append("email", email);
            formData.append("gstNumber", gst);
            formData.append("about", about);
            formData.append("country", country);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("pinCode", pinCode);
            formData.append("fullAddress", fullAddress);
            formData.append("category", category);
            if (logo) formData.append("logo", logo);

            const basic = await API.post("/hospital/basic", formData);
            if (basic.data.success) {
                localStorage.setItem('user', JSON.stringify(basic.data.user))
                console.log("HOSPITAL BASIC SAVED:", basic.data);

                // NEXT STEP
                navigate("/create-account-image", { replace: true });
            }else{
                toast.error(basic.data.message)
            }

        } catch (err) {
            console.error(err.response?.data || err);
            toast.error(err?.response?.data?.message)
        } finally{
            setLoading(false)
        }
    };
    const logoDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        setLogo(file);
    };
    const logoDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        getApiData('admin/hospital-category').then((res) => {
            const formattedData = res.data.map((item) => ({
                value: item._id,
                label: item.name
            }));

            setCatData(formattedData);
        });
    }, []);

    async function fetchStates(value) {
        setLoading(true)
        try {
            const response = await getApiData(`api/location/states/${value}`)
            setStates(response)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    async function fetchCities(value) {
        setLoading(true)
        try {
            const response = await getApiData(`api/location/cities/${value}`)
            setCities(response)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    return (
        <section className="admin-login-section account-lg-section nw-create-account-section">
            <div className="container-fluid px-lg-0">

                {/* TOP STEPS UI */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <div className="account-step-main-bx">

                            <NavLink to="/create-account">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx nw-step-bx">
                                        <FaFlask className="account-step-icon" />
                                    </div>
                                    <h6>Hospital Details</h6>
                                </div>
                            </NavLink>

                            <NavLink to={isDisabled ? "#" : "/create-account-image"}>
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx account-unstep-card">
                                        <BsFillFileImageFill className="account-step-icon" />
                                    </div>
                                    <h6>Images</h6>
                                </div>
                            </NavLink>

                            <NavLink to={isDisabled ? "#" : "/create-account-address"}>
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx account-unstep-card">
                                        <FaMapMarkerAlt className="account-step-icon" />
                                    </div>
                                    <h6>Address</h6>
                                </div>
                            </NavLink>

                            <NavLink to={isDisabled ? "#" : "/create-account-person"}>
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx account-unstep-card">
                                        <FaUser className="account-step-icon" />
                                    </div>
                                    <h6>Contact Person</h6>
                                </div>
                            </NavLink>

                            <NavLink to={isDisabled ? "#" : "/create-account-upload"}>
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

                {/* FORM */}
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8 col-sm-12">

                        <form onSubmit={submitBasic}>
                            <div className="nw-form-container">

                                <div className="admin-vndr-login">
                                    <h3>Create Account</h3>
                                    <p>Give credential to sign up your account</p>
                                </div>

                                {/* Hospital Name */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Hospital Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Hospital Name"
                                        value={hospitalName}
                                        onChange={(e) => setHospitalName(e.target.value)}
                                    />
                                    {errors.hospitalName && <small className="text-danger">{errors.hospitalName}</small>}
                                </div>

                                {/* License */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Hospital License ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter License ID"
                                        value={licenseId}
                                        onChange={(e) => setLicenseId(e.target.value)}
                                    />
                                    {errors.licenseId && <small className="text-danger">{errors.licenseId}</small>}
                                </div>

                                {/* Year */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Established Year</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Established Year"
                                        value={establishedYear}
                                        onChange={(e) => setEstablishedYear(e.target.value)}
                                    />
                                    {errors.establishedYear && <small className="text-danger">{errors.establishedYear}</small>}
                                </div>

                                {/* Mobile */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Mobile No</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter Mobile No"
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}
                                    />
                                    {errors.mobileNo && <small className="text-danger">{errors.mobileNo}</small>}
                                </div>

                                {/* Email */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Email ID</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email ID"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Categories</label>
                                    <Select
                                        options={catData}
                                        isMulti
                                        className="custom-select"
                                        placeholder="Select category..."
                                        onChange={(selectedOptions) => {
                                            const ids = selectedOptions.map((item) => item.value);
                                            setCategory(ids);
                                        }}
                                    />

                                    {/* {errors.category && <small className="text-danger">{errors.category}</small>} */}
                                </div>

                                {/* PASSWORD */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="*******"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {errors.password && <small className="text-danger">{errors.password}</small>}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="*******"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                </div>

                                {/* GST */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter GST Number"
                                        value={gst}
                                        onChange={(e) => setGst(e.target.value)}
                                    />
                                    {errors.gst && <small className="text-danger">{errors.gst}</small>}
                                </div>

                                {/* About */}
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>About</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="About you"
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="custom-frm-bx">
                                    <label>Country</label>
                                    <select
                                        className="form-select"
                                        value={country}
                                        onChange={(e) => {
                                            const data = countries?.filter(item => item?._id === e.target.value)
                                            fetchStates(data[0].isoCode)
                                            setCountry(e.target.value)
                                        }}
                                    >
                                        <option value="">---Select Country---</option>
                                        {countries?.map((item, key) =>
                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                    </select>
                                    {errors.country && <small className="text-danger">{errors.country}</small>}
                                </div>
                                <div className="custom-frm-bx">
                                    <label>State</label>
                                    <select
                                        className="form-select"
                                        value={state}
                                        disabled={states?.length==0}
                                        onChange={(e) => {
                                            const data = states?.filter(item => item?._id === e.target.value)
                                            fetchCities(data[0].isoCode)
                                            setState(e.target.value)
                                        }}
                                    >
                                        <option value="">---Select State---</option>
                                        {states?.map((item, key) =>
                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                    </select>
                                    {errors.state && <small className="text-danger">{errors.state}</small>}
                                </div>
                                <div className="custom-frm-bx">
                                    <label>City</label>
                                    <select
                                        className="form-select"
                                        value={city}
                                        disabled={cities?.length==0}
                                        onChange={(e) => {
                                            setCity(e.target.value)
                                        }}
                                    >
                                        <option value="">---Select City---</option>
                                        {cities?.map((item, key) =>
                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                    </select>
                                    {errors.city && <small className="text-danger">{errors.city}</small>}
                                </div>
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Pin Code </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                    />
                                    {errors.pinCode && <small className="text-danger">{errors.pinCode}</small>}
                                </div>
                                <div className="custom-frm-bx admin-frm-bx">
                                    <label>Full Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={fullAddress}
                                        onChange={(e) => setFullAddress(e.target.value)}
                                    />
                                    {errors.fullAddress && <small className="text-danger">{errors.fullAddress}</small>}
                                </div>

                                {/* LOGO */}
                                <div className="custom-frm-bx" onDrop={(e) => logoDrop(e)}
                                    onDragOver={logoDragOver}>
                                    <label htmlFor="">Upload Laboratory logo</label>
                                    <div className="upload-box nw-upload-bx p-3 justify-content-center">
                                        <div className="upload-icon mb-2">
                                            <IoCloudUploadOutline />
                                        </div>

                                        <div >
                                            <p className="fw-semibold mb-1">
                                                <label htmlFor="fileInput1" className="file-label file-select-label">
                                                    Choose a file or drag & drop here
                                                </label>
                                            </p>

                                            <small className="format-title">JPEG Format</small>


                                            <div className="mt-3">
                                                <label htmlFor="fileInput1" className="browse-btn">
                                                    Browse File
                                                </label>
                                            </div>

                                            <input
                                                type="file"
                                                className="d-none"
                                                id="fileInput1"
                                                accept=".png,.jpg,.jpeg"
                                                onChange={(e) => setLogo(e.target.files[0])}
                                            />

                                            {logo && <div id="filePreviewWrapper" className=" mt-3">
                                                <img src={logo && URL.createObjectURL(logo)} width={100} height={100} alt="Preview" className="img-thumbnail" />
                                            </div>}
                                        </div>
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="mt-3">
                                    <button type="submit" disabled={loading} className="admin-lg-btn w-100">
                                        {loading?"Submitting...":"Next"}
                                    </button>
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

export default CreateAccount;
