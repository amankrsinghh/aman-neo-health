import { IoCloudUploadOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from '../../api/api'



function PersonalInfo({ staffData, setStaffData }) {
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [countryCode, setCountryCode] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [emergencyContactName, setEmergencyName] = useState("");
    const [emergencyContactPhone, setEmergencyPhone] = useState("");


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const goToNextTab = () => {
        const nextTab = document.querySelector(
            'a[href="#professional"]'
        );

        if (nextTab) {
            nextTab.click();
        }
    };


    const handleSaveAndNext = () => {
        if (!validate()) return;

        setStaffData(prev => ({
            ...prev,
            personalInfo: {
                ...personalInfo,
                profileImage
            }
        }));;

        goToNextTab();
    };



    useEffect(() => {
        api.get("/location/countries")
            .then(res => setCountries(res.data))
            .catch(err => console.error(err));
    }, []);


    const handleCountryChange = async (e) => {
        const code = e.target.value;
        setCountryCode(code);
        setStateCode("");
        setStates([]);
        setCities([]);

        if (!code) return;

        const res = await api.get(`/location/states/${code}`);
        setStates(res.data);
    };


    const handleStateChange = async (e) => {
        const code = e.target.value;
        setStateCode(code);
        setCities([]);

        if (!code) return;

        const res = await api.get(`/location/cities/${code}`);
        setCities(res.data);
    };


    const personalInfo = {
        name,
        dob,
        gender,
        address,
        countryCode,
        stateCode,
        city,
        pincode,
        mobile,
        email,
        emergencyContactName,
        emergencyContactPhone,
        profileImage: File
    };


    useEffect(() => {
        if (!staffData?.personalInfo) return;

        const p = staffData.personalInfo;

        setName(p.name || "");
        setDob(p.dob ? p.dob.substring(0, 10) : "");
        setGender(p.gender || "");
        setAddress(p.address || "");
        setCountryCode(p.countryCode || "");
        setStateCode(p.stateCode || "");
        setCity(p.city || "");
        setPincode(p.pincode || "");
        setMobile(p.mobile || "");
        setEmail(p.email || "");
        setEmergencyName(p.emergencyContactName || "");
        setEmergencyPhone(p.emergencyContactPhone || "");

        // ✅ IMAGE PREVIEW (EDIT MODE)
        if (p.profileImage && typeof p.profileImage === "string") {
            setPreview(p.profileImage);
        }

    }, [staffData]);


    const validate = () => {
        let newErrors = {};

        if (!name.trim()) newErrors.name = "Name is required";
        if (!dob) newErrors.dob = "Date of birth is required";
        if (!gender) newErrors.gender = "Gender is required";
        if (!address.trim()) newErrors.address = "Address is required";
        if (!countryCode) newErrors.countryCode = "Country is required";
        if (!stateCode) newErrors.stateCode = "State is required";
        if (!city) newErrors.city = "City is required";

        if (!mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^\d{10}$/.test(mobile)) {
            newErrors.mobile = "Mobile must be 10 digits";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        if (emergencyContactPhone && !/^\d{10}$/.test(emergencyContactPhone)) {
            newErrors.emergencyContactPhone = "Emergency phone must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };










    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="lg_title text-black fw-700 mb-3">Personal Information</h4>

                    </div>
                    <div className="col-lg-4">
                        <div className="custom-frm-bx">
                            <div className="upload-box  p-3">
                                <div className="upload-icon mb-2">
                                    <IoCloudUploadOutline />
                                </div>

                                <div>
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
                                        onChange={handleFileChange}
                                    />

                                    {preview && (
                                        <div className="mt-3">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="img-thumbnail"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <small className="text-danger">{errors.name}</small>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx ">
                            <label htmlFor="">Date of Birth</label>
                            <input
                                type="date"
                                className="form-control nw-frm-select"
                                placeholder=""
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                            {errors.dob && <small className="text-danger">{errors.dob}</small>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Gender</label>
                            <div className="select-wrapper">
                                <select className="form-select custom-select" value={gender}
                                    onChange={(e) => setGender(e.target.value)}>
                                    <option>---Select Gender---</option>
                                    <option key='male' value='male'>Male</option>
                                    <option key='female' value='female'>FeMale</option>
                                    <option key='other' value='other'>Other</option>
                                </select>
                                {errors.gender && <small className="text-danger">{errors.gender}</small>}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Address</label>
                            <textarea value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control nw-frm-select"
                                placeholder="Enter Address"></textarea>
                            {errors.address && <small className="text-danger">{errors.address}</small>}
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>Country</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select custom-select"
                                    onChange={handleCountryChange}
                                    value={countryCode}
                                >
                                    <option value="">--- Select Country ---</option>
                                    {countries.map(c => (
                                        <option key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.countryCode && (
                                    <small className="text-danger">{errors.countryCode}</small>
                                )}
                            </div>
                        </div>
                    </div>



                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>State</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select custom-select"
                                    onChange={handleStateChange}
                                    disabled={!countryCode}
                                    value={stateCode}
                                >
                                    <option value="">--- Select State ---</option>
                                    {states.map(s => (
                                        <option key={s.isoCode} value={s.isoCode}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.stateCode && <small className="text-danger">{errors.stateCode}</small>}
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label>City</label>
                            <div className="select-wrapper">
                                <select
                                    className="form-select custom-select"
                                    disabled={!stateCode}
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="">--- Select City ---</option>
                                    {cities.map(c => (
                                        <option key={c.name} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city && <small className="text-danger">{errors.city}</small>}
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Pin code</label>
                            <input
                                type="text"
                                className="form-control nw-frm-select"
                                placeholder="Enter pin code"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                        </div>
                    </div>

                    <div className="col-lg-12 my-3">
                        <div className="">
                            <h5 className="add-contact-title">Contact Information</h5>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Mobile Number</label>
                            <input
                                type="number"
                                className="form-control nw-frm-select"
                                placeholder="Enter  mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                            {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Email</label>
                            <input
                                type="email"
                                className="form-control nw-frm-select"
                                placeholder="Enter  Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Emergency Contact Name</label>
                            <input
                                type="email"
                                className="form-control nw-frm-select"
                                placeholder="Enter  Emergency Contact Name"
                                value={emergencyContactName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                            />
                            {errors.emergencyContactName && <small className="text-danger">{errors.emergencyContactName}</small>}
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="custom-frm-bx">
                            <label htmlFor="">Emergency Contact Phone</label>
                            <input
                                type="number"
                                className="form-control nw-frm-select"
                                placeholder="Enter Emergency Contact Phone"
                                value={emergencyContactPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                            />
                            {errors.emergencyContactPhone && <small className="text-danger">{errors.emergencyContactPhone}</small>}
                        </div>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="nw-thm-btn" onClick={handleSaveAndNext}>Save & Continue</button>
                    </div>

                </div>
            </form>
        </>
    );
}

export default PersonalInfo;
