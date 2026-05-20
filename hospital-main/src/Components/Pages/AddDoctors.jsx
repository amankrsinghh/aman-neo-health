import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getApiData, getSecureApiData, securePostData } from "../../Service/api";
import api from "../../api/api";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { PiHandEye } from "react-icons/pi";
import { specialtyOptions } from "../../Service/globalFunction";
import Select from "react-select";
import { toast } from "react-toastify";
import { Tab } from "bootstrap";
import base_url from "../../baseUrl";
import { useSelector } from "react-redux";
function AddDoctors() {
    const { id } = useParams();
    const navigate = useNavigate()
    const isEdit = Boolean(id);
    const { user } = useSelector(state => state.user)
    const userId = user?._id
    const [fetchById, setFetchById] = useState(false)
    const [isDefault, setIsDefault] = useState(false)
    const [doctorId, setDoctorId] = useState()
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [department, setDepartment] = useState([]);
    const [permisions, setPermissions] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [personal, setPersonal] = useState({
        profileImage: null,
        previewProfile: null,
        name: '',
        email: '',
        contactNumber: '',
        gender: '',
        dob: null,
    })
    const [address, setAddress] = useState({
        countryId: null,
        stateId: null,
        cityId: null,
        pinCode: null,
        fullAddress: '',
        specialty: '',
        treatmentAreas: [''],
        fees: null,
        language: [''],
        aboutYou: '',
        contact: {
            emergencyContactName: '',
            emergencyContactNumber: ''
        }
    })
    const [professionalInfo, setProfessionalInfo] = useState({
        education: [{
            university: '',
            degree: null,
            startYear: '',
            endYear: ''
        }],
        work: [{
            organization: '',
            totalYear: '',
            month: '',
            present: false
        }]
    })
    const [license, setLicense] = useState({
        medicalLicense: [{
            certName: '',
            certFile: null
        }],
    })
    const [employmentInfo, setEmploymentInfo] = useState({
        role: '',
        joinDate: '',
        onLeaveDate: '',
        contractStart: '',
        contractEnd: '',
        salary: '',
        note: '',
        department: null,
        status: 'Active',
        fees: null

    });

    const handlePersonalChange = (e) => {
        const { type, name, value, files } = e.target;

        if (type === 'file') {
            const file = files[0];

            setPersonal(prev => ({
                ...prev,
                [name]: file,
                previewProfile: file ? URL.createObjectURL(file) : null
            }));
        } else {
            setPersonal(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // 2. Professional Info
    const handleProfessionalChange = (e, index = null, section = null) => {
        const { name, value, checked, type } = e.target;

        const fieldValue = type === "checkbox" ? checked : value;

        // Education section
        if (section === "education") {
            setProfessionalInfo(prev => ({
                ...prev,
                education: prev.education.map((item, i) =>
                    i === index ? { ...item, [name]: fieldValue } : item
                )
            }));
            return;
        }

        // Work section
        if (section === "work") {
            setProfessionalInfo(prev => ({
                ...prev,
                work: prev.work.map((item, i) =>
                    i === index ? { ...item, [name]: fieldValue } : item
                )
            }));
            return;
        }
    };

    const addEducation = () => {
        setProfessionalInfo(prev => ({
            ...prev,
            education: [...prev.education, { university: "", degree: "", startYear: "", endYear: "" }]
        }));
    };
    const addWork = () => {
        setProfessionalInfo(prev => ({
            ...prev,
            work: [...prev.work, { totalYear: "", month: "", organization: "", present: false }]
        }));
    };

    const addCertificate = () => {
        setLicense(prev => ({
            ...prev,
            medicalLicense: [...prev.medicalLicense, { certName: "", certFile: null }]
        }));
    };
    const removeEducation = async (index, item) => {
        if (item && item._id) {
            const data = { empId: staffId, id: item._id, type: 'education' }
            await securePostData('lab/sub-professional', data)
        }
        setProfessionalInfo(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };
    const removeWork = async (index, item) => {
        setProfessionalInfo(prev => ({
            ...prev,
            work: prev.work.filter((_, i) => i !== index)
        }));
    };

    const removeCertificate = async (index, item) => {
        if (item && item._id) {
            const data = { empId: staffId, id: item._id, type: 'cert' }
            await securePostData('lab/sub-professional', data)
        }
        setLicense(prev => ({
            ...prev,
            medicalLicense: prev.medicalLicense.filter((_, i) => i !== index)
        }));
    };

    const handleLicenseChange = (e, index = null) => {
        const { name, value, files } = e.target;

        // Handle File upload (certFile)
        if (files) {
            const file = files[0];

            // Allow only PDF or Image
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
            if (!validTypes.includes(file.type)) {
                return alert("Only images or PDF allowed");
            }
            setLicense(prev => ({
                ...prev,
                medicalLicense: prev.medicalLicense.map((item, i) =>
                    i === index ? { ...item, certFile: file } : item
                )
            }));

            return;
        }
        setLicense(prev => ({
            ...prev,
            medicalLicense: prev.medicalLicense.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        }));
        return;

    };
    // 3. Employment Info
    const handleEmploymentChange = (e) => {
        const { name, value } = e.target;
        setEmploymentInfo((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    useEffect(() => {
        api.get("/location/countries")
            .then(res => setCountries(res.data))
            .catch(err => console.error(err));
        if (isEdit) {
            fetchDoctor();
        }
        fetchSpecialityData()
    }, [id]);
    async function fetchSpecialityData() {
        const result = await getApiData(`admin/speciality`)
        if (result.success) {
            setSpecialities(result.data)
        }
    }

    async function fetchStates(value) {
        try {
            const response = await getApiData(`api/location/states/${value}`)
            const data = await response
            setStates(data)
        } catch (error) {

        }
    }
    async function fetchCities(value) {
        try {
            const response = await getApiData(`api/location/cities/${value}`)
            const data = await response
            setCities(data)
        } catch (error) {

        }
    }

    const handleAddressChange = async (e) => {
        const { name, value } = e.target
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'countryId' && value) {
            const data = await countries?.filter(item => item?._id === value)
            await fetchStates(data[0]?.isoCode);
        }
        if (name === 'stateId' && value) {
            const data = await states?.filter(item => item?._id === value)
            await fetchCities(data[0]?.isoCode);
        }
    }
    const handleEmergencyChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [name]: value
            }
        }));
    };
    const [personalErrors, setPersonalErrors] = useState({})
    const validate = () => {
        let temp = {};

        if (!personal?.name?.trim())
            temp.name = "Doctor name is required";
        if (!personal?.profileImage)
            temp.profileImage = "Doctor profile image is required";

        if (!personal?.gender?.trim())
            temp.gender = "Gender is required";
        if (!personal?.dob?.trim())
            temp.dob = "Dob is required";
        if (!address?.countryId?.trim())
            temp.countryId = "Country is required";
        if (!address?.stateId?.trim())
            temp.stateId = "State is required";
        if (!address?.cityId?.trim())
            temp.cityId = "City is required";
        if (!address?.pinCode?.trim())
            temp.pinCode = "Pin code is required";
        if (!address?.fullAddress?.trim())
            temp.fullAddress = "Address is required";


        if (!personal?.contactNumber?.trim())
            temp.contactNumber = "Mobile number is required";
        else if (personal?.contactNumber.length !== 10)
            temp.contactNumber = "Mobile number must be 10 digits";

        if (!address?.contact.emergencyContactName?.trim())
            temp.emergencyName = "Emergency contact name is required";

        if (!address?.contact.emergencyContactNumber?.trim())
            temp.emergencyNumber = "Emergency mobile number is required";
        else if (address?.contact.emergencyContactNumber.length !== 10)
            temp.emergencyNumber = "Emergency mobile number must be 10 digits";

        if (!personal?.email?.trim())
            temp.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal?.email))
            temp.email = "Invalid email format";


        setPersonalErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const personalSubmit = async (e) => {
        e.preventDefault()
        if (isDefault) {
            return handleBack(e, "#profile-tab")
        }
        if (!validate()) return;
        const formData = new FormData();

        // Append personal info
        for (let key in personal) {
            if (key === 'profileImage' && personal.profileImage) {
                formData.append('profileImage', personal.profileImage);
            }
            else if (key === 'previewProfile' && personal.previewProfile) {
                continue;
            } else {
                formData.append(key, personal[key]);
            }
        }

        // Append address info
        for (let key in address) {
            if (key === 'contact') {
                formData.append('emergencyContactName', address.contact.emergencyContactName);
                formData.append('emergencyContactNumber', address.contact.emergencyContactNumber);
            } else if (Array.isArray(address[key])) {
                // Convert array to JSON string
                formData.append(key, JSON.stringify(address[key]));
            } else {
                formData.append(key, address[key]);
            }
        }
        try {
            const result = await securePostData('api/hospital-doctor/create', formData)
            if (result.success) {
                setDoctorId(result.doctorId)
                toast.success('Doctor Created')
                switchTab(e, '#profile-tab')
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    const handleBack = (e, name) => {
        e.preventDefault(); // prevent page reload
        const tabTrigger = document.querySelector(name); // the tab button for "contact"
        const tab = new Tab(tabTrigger);
        tab.show();
    };
    const fetchDoctor = async () => {
        const ptId = doctorId || id
        try {
            const result = await getSecureApiData(`api/hospital-doctor/get-by-id/${ptId}`)

            if (result.success) {
                const general = result.data.doctor
                const doctorAbout = result.data?.aboutDoctor
                setIsDefault(true)
                if (general?.dob && doctorAbout?.aboutYou) {
                }
                setPersonal({
                    ...general,
                    dob: general?.dob
                        ? new Date(general.dob)?.toISOString()?.split("T")[0]
                        : ""
                })
                setAddress({
                    ...doctorAbout,
                    countryId: doctorAbout?.countryId?._id,
                    stateId: doctorAbout?.stateId?._id,
                    cityId: doctorAbout?.cityId?._id,
                    contact: doctorAbout?.contact,
                    treatmentAreas: doctorAbout?.treatmentAreas || [],
                    specialty: doctorAbout?.specialty || '',
                    aboutYou: doctorAbout?.aboutYou || ''
                })
                setProfessionalInfo({
                    education: result?.aboutDoctorEduWork?.education || [],
                    work: result?.aboutDoctorEduWork?.work || [],
                })
                setEmploymentInfo({
                    ...result?.employmentDetails,
                    department: result?.employmentDetails?.department?._id || null,
                    contractStart: result?.employmentDetails?.contractStart ? new Date(result?.employmentDetails?.contractStart)?.toISOString()?.split("T")[0] : null,
                    contractEnd: result?.employmentDetails?.contractEnd ? new Date(result?.employmentDetails?.contractEnd)?.toISOString()?.split("T")[0] : null,
                    joinDate: result?.employmentDetails?.contractEnd ? new Date(result?.employmentDetails?.joinDate)?.toISOString()?.split("T")[0] : null,

                })
                setAccessInfo({
                    ...accessInfo, email: result?.employmentDetails?.email,
                    contactNumber: result?.employmentDetails?.contactNumber, permissionId: result?.employmentDetails?.permissionId?._id, password: ''
                })
                setFetchById(true)
                fetchStates(doctorAbout?.countryId?.isoCode)
                fetchCities(doctorAbout?.stateId?.isoCode)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log(error)
        }
    };
    const fetchDepartments = async () => {
        try {
            const res = await getSecureApiData("api/department/list?limit=100");
            setDepartment(res.data);

        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchDepartments()
    }, [])
    const [proffErrors, setProffErrors] = useState({})
    const validateProff = () => {
        let temp = {};
        if (!address?.specialty?.trim())
            temp.specialty = "Specility is required";
        if (!address?.treatmentAreas[0]?.trim())
            temp.treatmentAreas = "Please select at least one treatment area.";
        if (!address?.aboutYou?.trim())
            temp.aboutYou = "Professional Bio is required";

        /* ---------------- EDUCATION ---------------- */

        if (!professionalInfo.education || professionalInfo.education.length === 0) {
            temp.education = "At least one education record is required";
        } else {
            professionalInfo.education.forEach((edu, index) => {

                if (!edu.degree?.trim()) {
                    temp[`education_${index}_degree`] = "Degree is required";
                }

                if (!edu.college?.trim()) {
                    temp[`education_${index}_college`] = "College is required";
                }

                if (!edu.year?.trim()) {
                    temp[`education_${index}_year`] = "Passing year is required";
                }

            });
        }

        /* ---------------- WORK EXPERIENCE ---------------- */

        if (!professionalInfo.work || professionalInfo.work.length === 0) {
            temp.work = "At least one work experience is required";
        } else {

            professionalInfo.work.forEach((work, index) => {

                if (!work.hospital?.trim()) {
                    temp[`work_${index}_hospital`] = "Hospital name required";
                }

                if (!work.totalYear?.trim()) {
                    temp[`work_${index}_totalYear`] = "Total year is required";
                }
                if (!work.month?.trim()) {
                    temp[`work_${index}_month`] = "Month is required";
                }

            });

        }


        /* ---------------- MEDICAL LICENSE ---------------- */

        if (!license.medicalLicense || license.medicalLicense.length === 0) {
            temp.medicalLicense = "At least one medical license required";
        } else {

            license.medicalLicense.forEach((lic, index) => {

                if (!lic.certName?.trim()) {
                    temp[`license_${index}_name`] = "Certificate name required";
                }

                if (!lic.certFile && !lic.url) {
                    temp[`license_${index}_file`] = "Certificate file required";
                }

            });

        }

        setProffErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const professionalSubmit = async (e) => {
        e.preventDefault();
        if (isDefault) {
            return handleBack(e, "#contact-tab");
        }
        if (!validateProff()) return
        const formData = new FormData();
        const certMeta = license.medicalLicense.map(i => ({
            certName: i.certName,
        }));
        formData.append("doctorId", doctorId || id);
        formData.append("education", JSON.stringify(professionalInfo.education));
        formData.append("work", JSON.stringify(professionalInfo.work));
        formData.append("medicalLicenseMeta", JSON.stringify(certMeta));
        formData.append("specialty", address.specialty);
        formData.append("treatmentAreas", JSON.stringify(address.treatmentAreas));
        formData.append("aboutYou", address.aboutYou);
        license.medicalLicense.forEach(item => {
            if (item.certFile) {
                formData.append("medicalLicenseFiles", item.certFile);
            }
        });
        try {
            const result = await securePostData(
                "api/hospital-doctor/professional-details",
                formData
            );
            if (result.success) {
                toast.success("Professional Details Saved");
                handleBack(e, "#upload-tab");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    const switchTab = (tabSelector) => {
        const tabTrigger = document.querySelector(tabSelector);
        if (tabTrigger) {
            const tab = new Tab(tabTrigger);
            tab.show();
        }
    };

    const employementSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = [
            "role",
            "joinDate",
            "contractStart",
            "contractEnd",
            "salary",
            "note",
            "department",
            "fees"
        ];

        for (let key of requiredFields) {
            if (
                employmentInfo[key] === '' ||
                employmentInfo[key] === null ||
                employmentInfo[key] === undefined
            ) {
                return toast.error(`Please fill the ${key} field`);
            }
        }
        const data = {
            ...employmentInfo,
            doctorId: doctorId || id
        };
        try {
            const result = await securePostData(
                "api/hospital-doctor/employment-details",
                data
            );
            if (result.success) {
                handleBack(e, "#upload-tab")
                toast.success("Employment Details Saved");

                // Redirect or perform other actions as needed
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    // const treatmentValue = address.treatmentAreas[0] !== '' && address.treatmentAreas?.map(area => ({
    //     value: area,
    //     label: area
    // }));
    const fetchHospitalPermission = async () => {
        try {
            const response = await getSecureApiData(`api/comman/permission/${userId}?limit=100&type=hospital`);
            if (response.success) {
                setPermissions(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }
    useEffect(() => {
        if (userId) {

            fetchHospitalPermission()
        }
    }, [userId])
    const [accessInfo, setAccessInfo] = useState({
        contactNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        permissionId: '', // ref to lab-permission
    });
    const handleAccessChange = (e) => {
        const { name, value } = e.target;
        setAccessInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const accessSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...accessInfo,
            userId: doctorId || id,
            hospitalId: userId,
        };
        // if (!accessInfo?._id && accessInfo.password !== accessInfo.confirmPassword) {
        //     return toast.error("Password and Confirm Password do not match");
        // }
        try {
            const result = await securePostData(
                "api/hospital-doctor/access-details",
                data
            );
            if (result.success) {
                toast.success("Access Details Saved");
                document.getElementById("addedDoctor")?.click()
                // Redirect or perform other actions as needed
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    const treatmentOptions = specialities?.map(item => ({
        value: item._id,
        label: item.name
    }));

    const treatmentValue =
        treatmentOptions?.filter(opt =>
            address.treatmentAreas.includes(opt.value)
        );
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">{id ? 'Edit' : 'Add'} Doctors</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/doctor" className="breadcrumb-link">
                                                Doctors
                                            </NavLink>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Add Doctors
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="employee-tabs mb-4">
                            <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        href="#home"
                                        role="tab"
                                    >
                                        Personal Information
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
                                        Professional Details
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
                                        Employment Details
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="upload-tab"
                                        data-bs-toggle="tab"
                                        href="#upload"
                                        role="tab"
                                    >
                                        Access
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="new-panel-card">
                            <div className="">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="home"
                                        role="tabpanel"
                                    >
                                        <form onSubmit={personalSubmit}>
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


                                                                <div className="mt-2">
                                                                    <label htmlFor="fileInput1" className="browse-btn">
                                                                        Browse File
                                                                    </label>
                                                                </div>

                                                                <input
                                                                    type="file"
                                                                    name="profileImage"
                                                                    disabled={isDefault}
                                                                    onChange={handlePersonalChange}
                                                                    className="d-none"
                                                                    id="fileInput1"
                                                                    accept=".png,.jpg,.jpeg"
                                                                />

                                                                <div id="filePreviewWrapper" className="d-none mt-3">
                                                                    <img src="" alt="Preview" className="img-thumbnail" />
                                                                </div>


                                                                {personal.previewProfile && (
                                                                    <img
                                                                        src={personal.previewProfile}
                                                                        alt="Profile Preview"
                                                                        width="100"
                                                                        height="100"
                                                                    />
                                                                )}
                                                                {typeof personal?.profileImage === "string" &&
                                                                    personal.profileImage.startsWith("uploads") && (
                                                                        <img
                                                                            src={`${base_url}/${personal.profileImage}`}
                                                                            alt="Profile Preview"
                                                                            width="100"
                                                                            height="100"
                                                                        />
                                                                    )}



                                                            </div>
                                                        </div>
                                                    </div>
                                                    {personalErrors?.profileImage && <small className="text-danger">{personalErrors?.profileImage}</small>}
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
                                                            name="name"
                                                            disabled={isDefault}
                                                            value={personal?.name}
                                                            onChange={handlePersonalChange}
                                                        />
                                                        {personalErrors?.name && <small className="text-danger">{personalErrors?.name}</small>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx ">
                                                        <label htmlFor="">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder=""
                                                            name="dob"
                                                            disabled={isDefault}
                                                            value={personal?.dob}
                                                            onChange={handlePersonalChange}
                                                        />
                                                        {personalErrors?.dob && <small className="text-danger">{personalErrors?.dob}</small>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Gender</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select "
                                                                disabled={isDefault} name="gender" value={personal.gender}
                                                                onChange={handlePersonalChange}>
                                                                <option>---Select Gender---</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                        {personalErrors?.gender && <small className="text-danger">{personalErrors?.gender}</small>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Address</label>
                                                        <textarea name="fullAddress" disabled={isDefault} value={address?.fullAddress} onChange={handleAddressChange} id="" className="form-control nw-frm-select" placeholder="Enter Address"></textarea>
                                                        {personalErrors?.fullAddress && <small className="text-danger">{personalErrors?.fullAddress}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Country</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select"
                                                                value={address?.countryId}
                                                                disabled={countries.length == 0 || isDefault} name="countryId" onChange={handleAddressChange}>
                                                                <option>---Select Country---</option>
                                                                {countries?.map((c, k) => <option value={c._id} key={k}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        {personalErrors?.countryId && <small className="text-danger">{personalErrors?.countryId}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>State</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select"
                                                                value={address?.stateId} disabled={states.length == 0 || isDefault} name="stateId" onChange={handleAddressChange}>
                                                                <option>---Select State---</option>
                                                                {states?.map((s, k) => <option value={s._id} key={k}>{s.name}</option>)}
                                                            </select>
                                                        </div>
                                                        {personalErrors?.stateId && <small className="text-danger">{personalErrors?.stateId}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>City</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select"
                                                                value={address?.cityId} disabled={cities.length == 0 || isDefault} name="cityId" onChange={handleAddressChange}>
                                                                <option>---Select City---</option>
                                                                {cities?.map((c, k) => <option value={c._id} key={k}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        {personalErrors?.cityId && <small className="text-danger">{personalErrors?.cityId}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Pin code</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="302012"
                                                            name="pinCode"
                                                            disabled={isDefault}
                                                            value={address?.pinCode}
                                                            onChange={handleAddressChange}
                                                        />
                                                        {personalErrors?.pinCode && <small className="text-danger">{personalErrors?.pinCode}</small>}

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
                                                            name="contactNumber"
                                                            disabled={isDefault}
                                                            value={personal?.contactNumber}
                                                            onChange={handlePersonalChange}
                                                        />
                                                        {personalErrors?.contactNumber && <small className="text-danger">{personalErrors?.contactNumber}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Email"
                                                            name="email"
                                                            disabled={isDefault}
                                                            value={personal?.email}
                                                            onChange={handlePersonalChange}
                                                        />
                                                        {personalErrors?.email && <small className="text-danger">{personalErrors?.email}</small>}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Emergency Contact Name</label>
                                                        <input
                                                            type="name"
                                                            disabled={isDefault}
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Emergency Contact Name"
                                                            name="emergencyContactName"
                                                            value={address?.contact?.emergencyContactName}
                                                            onChange={handleEmergencyChange}
                                                        />
                                                        {personalErrors?.emergencyName && <small className="text-danger">{personalErrors?.emergencyName}</small>}

                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Emergency Contact Phone</label>
                                                        <input
                                                            type="number"
                                                            disabled={isDefault}
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Emergency Contact Phone"
                                                            name="emergencyContactNumber"
                                                            value={address?.contact?.emergencyContactNumber}
                                                            onChange={handleEmergencyChange}
                                                        />
                                                        {personalErrors?.emergencyNumber && <small className="text-danger">{personalErrors?.emergencyNumber}</small>}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <button type="submit" className="nw-thm-btn">Save & Continue</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane fade" id="profile" role="tabpanel">
                                        <form onSubmit={professionalSubmit}>
                                            <div className="row">
                                                <h4 className="lg_title text-black fw-700 mb-3">Professional Information</h4>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Treatment Areas</label>
                                                        <Select
                                                            options={treatmentOptions}
                                                            isMulti
                                                            required
                                                            classNamePrefix="custom-select"
                                                            className="select-categories"
                                                            name="treatMent"
                                                            isDisabled={isDefault}
                                                            value={address.treatmentAreas ? treatmentValue : []}
                                                            placeholder="Select areas(s)"
                                                            onChange={(selectedOptions) => {
                                                                setAddress(prev => ({
                                                                    ...prev,
                                                                    treatmentAreas: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Specialization</label>
                                                        <div className="select-wrapper">
                                                            <select required disabled={isDefault} className="form-select custom-select" name="specialty" value={address.specialty} onChange={handleAddressChange}>
                                                                <option>--Select--</option>
                                                                {specialities?.map((item, key) =>
                                                                    <option value={item?._id} key={key}>{item?.name}</option>)}
                                                            </select>
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Total Experience</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value=""
                                                        />
                                                    </div>
                                                </div> */}

                                                <div className="col-lg-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Professional Bio</label>
                                                        <textarea name="aboutYou" onChange={handleAddressChange} disabled={isDefault}
                                                            value={address?.aboutYou} id="" className="form-control nw-frm-select" placeholder="Enter professional biography and experience"></textarea>
                                                    </div>
                                                </div>


                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Education</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {professionalInfo?.education?.map((item, index) => (
                                                <div className="education-frm-bx mb-3" key={index}>
                                                    <div className="row" >

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>University / Institution</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter University / Institution"
                                                                    value={item.university}
                                                                    disabled={isDefault}
                                                                    name="university"
                                                                    onChange={(e) => handleProfessionalChange(e, index, "education")}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Degree / Qualification</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Degree / Qualification"
                                                                    value={item.degree}
                                                                    disabled={isDefault}
                                                                    name="degree"
                                                                    onChange={(e) => handleProfessionalChange(e, index, "education")}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Year From</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Year From"
                                                                    value={item.startYear}
                                                                    disabled={isDefault}
                                                                    name="startYear"
                                                                    onChange={(e) => handleProfessionalChange(e, index, "education")}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx flex-column flex-grow-1">
                                                                    <label>Year To</label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control nw-frm-select"
                                                                        placeholder="Enter Year To"
                                                                        value={item.endYear}
                                                                        disabled={isDefault}
                                                                        name="endYear"
                                                                        onChange={(e) => handleProfessionalChange(e, index, "education")}
                                                                        required
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <button
                                                                        type="button"
                                                                        disabled={professionalInfo.education.length === 1}
                                                                        className="text-black"
                                                                        onClick={() => removeEducation(index, item)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}

                                            <div className="text-end mt-3">
                                                <button className="add-employee-btn" type="button" onClick={() => addEducation()}><FaPlusSquare /> Add More</button>
                                            </div>
                                            <div className="col-lg-12 my-3">
                                                <div className="">
                                                    <h5 className="add-contact-title">Work Experience</h5>
                                                </div>
                                            </div>

                                            {professionalInfo?.work?.map((item, index) => (
                                                <div className="education-frm-bx mb-3" key={index}>
                                                    <div className="row" >

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Organization</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Organization"
                                                                    value={item.organization}
                                                                    name="organization"
                                                                    disabled={isDefault}
                                                                    onChange={(e) => handleProfessionalChange(e, index, "work")}

                                                                />
                                                                {proffErrors[`work_${index}_hospital`] && (
                                                                    <div className="text-danger">
                                                                        {proffErrors[`work_${index}_hospital`]}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Total Year</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="8 years"
                                                                    value={item.totalYear}
                                                                    disabled={isDefault}
                                                                    name="totalYear"
                                                                    onChange={(e) => handleProfessionalChange(e, index, "work")}

                                                                />
                                                                {proffErrors[`work_${index}_totalYear`] && (
                                                                    <div className="text-danger">
                                                                        {proffErrors[`work_${index}_totalYear`]}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Month</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="3 months"
                                                                    value={item.month}
                                                                    disabled={isDefault}
                                                                    name="month"
                                                                    onChange={(e) => handleProfessionalChange(e, index, "work")}

                                                                />
                                                                {proffErrors[`work_${index}_month`] && (
                                                                    <div className="text-danger">
                                                                        {proffErrors[`work_${index}_month`]}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12 align-content-center">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx mb-0 flex-grow-1 d-flex flex-column align-items-start justify-content-center">
                                                                    <label>Present</label>
                                                                    <div className="switch">
                                                                        <input type="checkbox" disabled={isDefault} name="present" id="toggle7" checked={item?.present == true}
                                                                            onChange={(e) => handleProfessionalChange(e, index, "work")} />
                                                                        <label for="toggle7"></label>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <button
                                                                        type="button"
                                                                        disabled={professionalInfo.work.length === 1}
                                                                        className="text-black"
                                                                        onClick={() => removeWork(index, item)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}

                                            <div className="text-end mt-3">
                                                <button className="add-employee-btn" type="button" onClick={() => addWork()}><FaPlusSquare /> Add More</button>
                                            </div>

                                            <div className="col-lg-12 my-3">
                                                <div className="">
                                                    <h5 className="add-contact-title">Medical License</h5>
                                                </div>
                                            </div>

                                            {license?.medicalLicense?.map((item, index) => (
                                                <div className="education-frm-bx mt-3 mb-3" key={index}>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">License</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder="Enter Certificate Name"
                                                                    value={item.certName}
                                                                    name="certName"
                                                                    disabled={isDefault}
                                                                    onChange={(e) => handleLicenseChange(e, index)}

                                                                />
                                                                {proffErrors[`license_${index}_name`] && (
                                                                    <div className="text-danger">
                                                                        {proffErrors[`license_${index}_name`]}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="return-box">
                                                                <div className="custom-frm-bx mb-3 flex-column flex-grow-1">
                                                                    <label className="">License Upload</label>

                                                                    <div className="custom-file-wrapper">
                                                                        <span className="em-browse-btn">Browse File</span>
                                                                        <span className="em-file-name">{item.certFile ? (item.certFile.name || item?.certFile.split("\\").pop().split("-").slice(1).join("-")) : "No Choose file"}</span>
                                                                        <input type="file" disabled={isDefault} name="certFile" onChange={(e) => handleLicenseChange(e, index)} className="real-file-input" />
                                                                    </div>
                                                                    {proffErrors[`license_${index}_file`] && (
                                                                        <div className="text-danger">
                                                                            {proffErrors[`license_${index}_file`]}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <button className="text-black" type="button"
                                                                        disabled={license?.medicalLicense?.length === 0}
                                                                        onClick={() => removeCertificate(index, item)}><FontAwesomeIcon icon={faTrash} /></button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}



                                            <div className="text-end mt-3">
                                                <button className="add-employee-btn" type="button" onClick={() => addCertificate()}><FaPlusSquare /> Add More</button>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-3">
                                                <button type="button" className="nw-thm-btn outline rounded-3">Back </button>
                                                <button type="submit" className="nw-thm-btn rounded-3" >Save & Continue</button>
                                            </div>

                                        </form>
                                    </div>


                                    <div className="tab-pane fade" id="contact" role="tabpanel">
                                        <form onSubmit={employementSubmit}>
                                            <div className="row">

                                                <div className="d-flex align-items-center gap-3">
                                                    <h4 className="lg_title text-black fw-700 mb-3">Employment Details</h4>

                                                </div>



                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Department</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select" value={employmentInfo.department} name="department" onChange={handleEmploymentChange}>
                                                                <option>---Select Department---</option>
                                                                {department.map((dept) => (
                                                                    <option key={dept._id} value={dept._id}>
                                                                        {dept.departmentName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Position/Role</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Position/Role"
                                                            value={employmentInfo.role} name="role" onChange={handleEmploymentChange}
                                                        />
                                                        {/* <select class="form-select custom-select" value={employmentInfo.position} name="position" onChange={handleEmploymentChange}>
                                                            <option>---Select Department---</option>

                                                            <option value="Doctor">
                                                                Doctor
                                                            </option>
                                                            <option value="Doctor">
                                                                Nurse
                                                            </option>

                                                        </select> */}
                                                    </div>
                                                </div>



                                                {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Employment Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select" value={employmentInfo.employmentType} name="employmentType" onChange={handleEmploymentChange}>
                                                                <option>---Select Employment Type---</option>
                                                                <option value={"Full-Time"}>Full-Time</option>
                                                                <option value={"Part-Time"}>Part-Time</option>
                                                                <option value={"Contract"}>Contract</option>
                                                                <option value={"Temporary"}>Temporary</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div> */}

                                                {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Reporting To</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select" value={employmentInfo.reportingTo} name="reportingTo" onChange={handleEmploymentChange}>
                                                                <option>---Select---</option>
                                                                <option value={"Manager"}>Manager</option>
                                                                <option value={"CEO"}>CEO</option>
                                                                <option value={"Director"}>Director</option>

                                                            </select>
                                                        </div>
                                                    </div>
                                                </div> */}


                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Join Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value={employmentInfo.joinDate} name="joinDate" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">On Leave Date</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value={employmentInfo.onLeaveDate} name="onLeaveDate" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div> */}

                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Salary(₹)</label>
                                                        <input
                                                            type="number"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Salary"
                                                            value={employmentInfo.salary} name="salary" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Fees(₹)</label>
                                                        <input
                                                            type="number"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Fees"
                                                            value={employmentInfo.fees} name="fees" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Status</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select" value={employmentInfo.status} name="status" onChange={handleEmploymentChange}>
                                                                <option>---Select Status---</option>
                                                                <option value={"active"}>Active</option>
                                                                <option value={"inactive"}>Inactive</option>
                                                                <option value={"onleave"}>On Leave</option>
                                                                {/* <option value={"Temporary"}>Temporary</option> */}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Contract Details</h5>
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Contract Start</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value={employmentInfo.contractStart} name="contractStart" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Contract End</label>
                                                        <input
                                                            type="date"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter  Total Experience"
                                                            value={employmentInfo.contractEnd} name="contractEnd" onChange={handleEmploymentChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-12 ">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Note</label>
                                                        <textarea value={employmentInfo.note} name="note" onChange={handleEmploymentChange} id="" className="form-control nw-frm-select" placeholder="Enter Note"></textarea>
                                                    </div>
                                                </div>

                                            </div>




                                            <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">
                                                <button type="button" className="nw-thm-btn outline rounded-3">Back </button>
                                                <button type="submit" className="nw-thm-btn rounded-3" >Save & Continue</button>
                                            </div>

                                        </form>
                                    </div>


                                    <div className="tab-pane fade" id="upload" role="tabpanel">
                                        <form onSubmit={accessSubmit}>
                                            <div className="row">
                                                <h4 className="lg_title text-black fw-700 mb-3">Access</h4>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Hospital Id</label>
                                                        <input
                                                            type="number"
                                                            readOnly
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Username"
                                                            value={user?.nh12}
                                                        // name="contactNumber"
                                                        // onChange={handleAccessChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Contact Number</label>
                                                        <input
                                                            type="number"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Username"
                                                            value={accessInfo.contactNumber}
                                                            name="contactNumber"
                                                            onChange={handleAccessChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Email</label>
                                                        <input
                                                            type="email"

                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Email  Address"
                                                            value={accessInfo.email}
                                                            name="email"
                                                            onChange={handleAccessChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Temporary Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Password"
                                                            value={accessInfo.password}
                                                            name="password"
                                                            onChange={handleAccessChange}
                                                        />
                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="custom-frm-bx">
                                                        <label htmlFor="">Confirm Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Confirm Password"
                                                            value={accessInfo.confirmPassword}
                                                            name="confirmPassword"
                                                            onChange={handleAccessChange}
                                                        />
                                                    </div>
                                                </div> */}
                                                {/* <div className="col-lg-6 my-3">
                                                    <div className="">
                                                        <h5 className="add-contact-title">Permission</h5>
                                                    </div>
                                                </div> */}
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Permission Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select" value={accessInfo.permissionId} name="permissionId" onChange={handleAccessChange}>
                                                                <option>---Select Permission Type---</option>
                                                                {permisions.map((perm) => (
                                                                    <option key={perm._id} value={perm._id}>
                                                                        {perm.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-end gap-3">
                                                    <button type="submit" className="nw-thm-btn outline rounded-3">Back </button>
                                                    <button type="submit" className="nw-thm-btn rounded-3" >Submit</button>
                                                </div>
                                                <a href="#" className="d-none" data-bs-toggle="modal" data-bs-target="#added-Doctor" id="addedDoctor" ></a>

                                            </div>
                                        </form>
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
            </div>

            {/* <!-- add-Department Alert Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#added-Doctor" --> */}
            <div className="modal step-modal fade" id="added-Doctor" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">

                        <div className="modal-body  py-5 px-4">
                            <div className="row ">
                                <div className="col-lg-12">
                                    <div className="text-center add-success-bx">
                                        <span className="success-doctor-icon"><FontAwesomeIcon icon={faCheck} /></span>

                                        <h5 className="py-4">Doctor Added Successfully</h5>

                                        <Link to='/doctor'
                                            onClick={() => {
                                                setTimeout(() => {
                                                    navigate("/doctor")
                                                }, 200);
                                            }}
                                            className="nw-thm-btn" data-bs-dismiss="modal" aria-label="Close">Go To List</Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- add-Department Popup End --> */}
        </>
    )
}

export default AddDoctors