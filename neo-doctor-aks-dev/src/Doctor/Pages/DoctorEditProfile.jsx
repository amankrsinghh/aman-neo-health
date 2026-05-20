import { faCalendar, faCircleDollarToSlot, faCity, faClose, faDriversLicense, faEarth, faEnvelope, faFile, faHospital, faLanguage, faLocationCrosshairs, faLocationDot, faMapPin, faMarsAndVenus, faPhone, faTrash, faUser, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { FiPlusSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDoctorDetail } from "../../Redux/features/doctor";
import { deleteApiData, getApiData, securePostData, updateApiData } from "../../Services/api";
import { toast } from "react-toastify";
import { languageOptions, specialtyOptions } from "../../Services/globalFunction";
import Select from "react-select";
import Loader from "../../Loader/Loader";
import base_url from "../../baseUrl";
import { Link } from "react-router-dom";
function DoctorEditProfile() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [message, setMessage] = useState('')
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [hospitalOptions, setHospitalOptions] = useState([])
    const [specialities, setSpecialities] = useState([])
    const { profiles, kyc, medicalLicense, allowEdit, aboutDoctor, educationWork, customId, isRequest, clinicData } = useSelector(state => state.doctor)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        dob: null,
        password: "",
        gender: "",
    })
    const handleFormChange = (e) => {
        const { type, name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };
    const [addressData, setAddressData] = useState({
        hospitalName: "",
        countryId: "",
        stateId: "",
        cityId: "",
        lat: "",
        long: "",
        pinCode: "",
        specialty: "",
        treatmentAreas: [],
        fees: "",
        language: [""],
        aboutYou: "",
        fullAddress: "",
        userId
    });
    const handleAddressChange = (e) => {
        const { type, name, value, files } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'countryId' && value) {
            const data = countries?.filter(item => item?._id === value)
            fetchStates(data[0].isoCode);
        }
        if (name === 'stateId' && value) {
            const data = states?.filter(item => item?._id === value)
            fetchCities(data[0].isoCode);
        }

    };
    const addressSubmit = async (e) => {
        e.preventDefault();
        if (!aboutValidate()) return
        setLoading(true)
        try {
            const response = await securePostData('doctor/about', addressData)
            if (response.success) {
                toast.success('Records saved')
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };

    const basicSubmit = async (e) => {
        e.preventDefault();
        if (!basicValidate()) return
        setLoading(true)
        try {
            const response = await updateApiData('doctor', formData)
            if (response.success) {
                dispatch(fetchDoctorDetail())
                toast.success('Records saved')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    async function fetchCountries() {
        setLoading(true)
        try {
            const response = await getApiData('api/location/countries')
            const data = await response
            setCountries(data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCountries()
        fetchSpecialityData()
    }, [])
    async function fetchStates(value) {
        setLoading(true)
        try {
            const response = await getApiData(`api/location/states/${value}`)
            const data = await response
            setStates(data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchCities(value) {
        setLoading(true)
        try {
            const response = await getApiData(`api/location/cities/${value}`)
            const data = await response
            setCities(data)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    const [education, setEducation] = useState([
        {
            university: "",
            degree: "",
            startYear: "",
            endYear: "",
        },
    ]);
    const [experience, setExperience] = useState([
        {
            organization: "",
            totalYear: "",
            month: "",
            present: false,
        },
    ]);
    /* ================= EDUCATION ================= */

    const addEducation = () => {
        setEducation([
            ...education,
            { university: "", degree: "", startYear: "", endYear: "" },
        ]);
    };

    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    /* ================= EXPERIENCE ================= */

    const addExperience = () => {
        setExperience([
            ...experience,
            { organization: "", startYear: "", endYear: "", present: false },
        ]);
    };

    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    const handleExperienceChange = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    /* ================= SUBMIT ================= */

    const handleWorkEduSubmit = async (e) => {
        e.preventDefault();
        if (!eduWorkValidate()) return;
        setLoading(true)
        const data = { userId, education, work: experience }
        try {
            const response = await securePostData('doctor/education-work', data)
            if (response.success) {
                toast.success('Records saved')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    const [licenses, setLicenses] = useState([
        { certName: "", certFile: null, preview: "" },
    ]);

    const handleLicChange = (index, field, value) => {
        const updated = [...licenses];

        updated[index] = { ...updated[index] }; // object clone

        if (field === "certFile") {
            updated[index].certFile = null;
            updated[index].preview = "";
        } else {
            updated[index][field] = value;
        }

        setLicenses(updated);
    };

    const handleFileChange = (index, file) => {
        const updated = [...licenses];

        updated[index] = { ...updated[index] }; // clone object

        updated[index].certFile = file;

        if (file && file.type.startsWith("image/")) {
            updated[index].preview = URL.createObjectURL(file);
        } else {
            updated[index].preview = "";
        }

        setLicenses(updated);
    };


    const addMore = () => {
        setLicenses([...licenses, { certName: "", certFile: null, preview: "" }]);
    };

    const removeItem = (index) => {
        const updated = licenses.filter((_, i) => i !== index);
        setLicenses(updated);
    };

    const handleLicenseSubmit = async (e) => {
        e.preventDefault();
        if (!validateLicenses()) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('userId', userId);

            // License data me _id, certName, _index bhejna
            formData.append(
                'medicalLicense',
                JSON.stringify(
                    licenses.map((report, idx) => ({
                        _id: report._id || null,
                        certName: report.certName,
                        _index: idx
                    }))
                )
            );

            // Files ko index ke saath append karo
            licenses.forEach((report, idx) => {
                if (report.certFile instanceof File) {
                    formData.append(`certFile[${idx}]`, report.certFile);
                }
            });

            const response = await securePostData('doctor/medical-license', formData);

            if (response.success) {
                dispatch(fetchDoctorDetail())
                toast.success('Medical license submitted successfully!');

            } else {
                toast.error('Submission failed: ' + response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };
    const deleteLicenseItem = async (id) => {
        // Ask for confirmation first
        if (!window.confirm('Are you sure you want to delete?')) {
            return;
        }

        try {
            const res = await deleteApiData(`doctor/medical-license/${userId}/${id}`);
            if (res.success) {
                dispatch(fetchDoctorDetail())
                toast.success("License deleted");
            } else {
                toast.error(res?.message || "Failed to delete license");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        dispatch(fetchDoctorDetail())
    }, [dispatch])
    const [doctorClinic, setDoctorClinic] = useState({
        clinicName: "",
        licenseNumber: "",
        licenseImage: null,
        clinicImage: null
    })


    useEffect(() => {
        if (profiles) {
            setFormData({
                ...profiles, dob: profiles?.dob
                    ? new Date(profiles.dob).toISOString().split('T')[0]
                    : ''
            })
        }
        if (medicalLicense) {
            setLicenses(medicalLicense?.medicalLicense)
        }
        if (educationWork) {
            setEducation(educationWork?.education)
            setExperience(educationWork?.work)
        }
        if (aboutDoctor) {
            // fetchStates(aboutDoctor?.countryId?.isoCode)
            // fetchCities(aboutDoctor?.stateId?.isoCode)
            setAddressData(prev => ({
                ...prev,
                ...aboutDoctor,
                countryId: aboutDoctor?.countryId?._id,
                stateId: aboutDoctor?.stateId?._id,
                cityId: aboutDoctor?.cityId?._id,
                hospitalName: aboutDoctor?.hospitalName,
                specialty: aboutDoctor?.specialty?._id,
                treatmentAreas: aboutDoctor?.treatmentAreas?.map(item => item?._id) || []
            }));
        }
        if (clinicData) {
            setDoctorClinic(clinicData)
        }

    }, [profiles, medicalLicense, educationWork, aboutDoctor, clinicData])
    const treatmentOptions = specialities?.map(item => ({
        value: item._id,
        label: item.name
    }));

    const treatmentValue =
        treatmentOptions?.filter(opt =>
            addressData.treatmentAreas.includes(opt.value)
        );

    const language = addressData.language[0] !== '' && addressData.language?.map(item => ({
        value: item,
        label: item
    }));
    useEffect(() => {
        if (aboutDoctor?.countryId?.isoCode) {
            fetchStates(aboutDoctor.countryId.isoCode);
        }
    }, [aboutDoctor?.countryId?.isoCode]);

    useEffect(() => {
        if (aboutDoctor?.stateId?.isoCode) {
            fetchCities(aboutDoctor.stateId.isoCode);
        }
    }, [aboutDoctor?.stateId?.isoCode]);
    async function fetchSpecialityData() {
        const result = await getApiData(`admin/speciality`)
        if (result.success) {
            setSpecialities(result.data)
        }
    }

    const clinicSubmit = async (e) => {
        e.preventDefault();
        if (!clinicValidate()) return;
        const data = new FormData()
        data.append('clinicName', doctorClinic.clinicName)
        data.append('licenseNumber', doctorClinic.licenseNumber)
        data.append("clinicImage", doctorClinic.clinicImage.file)
        data.append("licenseImage", doctorClinic.licenseImage.file)
        data.append("userId", userId)
        setLoading(true)
        try {
            const response = await securePostData('doctor/clinic', data)
            if (response.success) {
                toast.success('Records saved')
                dispatch(fetchDoctorDetail())
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    const clinicChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type === "file") {
            const file = files[0];
            if (!file) return;

            const isImage = file.type.startsWith("image/");
            const preview = isImage ? URL.createObjectURL(file) : null;

            setDoctorClinic((prev) => ({
                ...prev,
                [name]: {
                    file,
                    preview,
                    type: file.type,
                    name: file.name
                }
            }));
        } else {
            setDoctorClinic((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const [basicErrors, setBasicErrors] = useState({});
    const basicValidate = () => {
        let temp = {};

        if (!formData?.name?.trim())
            temp.name = "Doctor name is required";

        if (!formData?.gender?.trim())
            temp.gender = "Gender is required";
        if (!formData?.dob?.trim())
            temp.dob = "Dob is required";

        if (!formData?.contactNumber?.trim())
            temp.contactNumber = "Mobile number is required";
        else if (formData.contactNumber.length !== 10)
            temp.contactNumber = "Mobile number must be 10 digits";

        if (!formData?.email?.trim())
            temp.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            temp.email = "Invalid email format";


        setBasicErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const [eduWorkErrors, setEduWorkErrors] = useState({});
    const eduWorkValidate = () => {
        let temp = {
            education: [],
            experience: []
        };

        // Education validation
        education.forEach((item, index) => {
            let eduError = {};

            if (!item.university?.trim()) {
                eduError.university = "University is required";
            }

            if (!item.degree || item.degree === "--Select--") {
                eduError.degree = "Degree is required";
            }

            if (!item.startYear?.trim()) {
                eduError.startYear = "Start year is required";
            }

            if (!item.endYear?.trim()) {
                eduError.endYear = "End year is required";
            }

            temp.education[index] = eduError;
        });

        // Experience validation
        experience.forEach((item, index) => {
            let expError = {};

            if (!item.organization?.trim()) {
                expError.organization = "Organization name is required";
            }

            if (!item.totalYear) {
                expError.totalYear = "Total year is required";
            }

            if (!item.month) {
                expError.month = "Total month is required";
            }

            temp.experience[index] = expError;
        });

        setEduWorkErrors(temp);

        const hasEducationError = temp.education.some(obj => Object.keys(obj).length > 0);
        const hasExperienceError = temp.experience.some(obj => Object.keys(obj).length > 0);

        return !(hasEducationError || hasExperienceError);
    };
    const [aboutErrors, setAboutErrors] = useState({})
    const aboutValidate = () => {
        let temp = {};
        if (!addressData?.hospitalName?.trim())
            temp.hospitalName = "Hospital name is required";
        if (!addressData?.specialty)
            temp.specialty = "Speciality is required";
        if (addressData?.language?.length == 0)
            temp.language = "Please choose at least one language.";
        if (addressData?.treatmentAreas?.length == 0)
            temp.treatmentAreas = "Please choose at least one treatment area ";
        if (!addressData?.fees?.trim())
            temp.fees = "Fees is required";
        if (!addressData?.countryId)
            temp.country = "Country is required";
        if (!addressData?.stateId)
            temp.state = "State is required";
        if (!addressData?.cityId)
            temp.city = "City is required";
        if (!addressData?.pinCode?.trim())
            temp.pinCode = "Pin code is required";
        if (!addressData?.fullAddress?.trim())
            temp.fullAddress = "Address is required";
        if (!addressData?.aboutYou?.trim())
            temp.aboutYou = "About is required";
        setAboutErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const [medicalErrors, setMedicalErrors] = useState([]);
    const validateLicenses = () => {
        let newErrors = [];

        licenses.forEach((item, index) => {
            let err = {};

            if (!item.certName || item.certName.trim() === "") {
                err.certName = "License name is required";
            }

            if (!item.certFile) {
                err.certFile = "License file is required";
            }

            newErrors[index] = err;
        });

        setMedicalErrors(newErrors);

        return newErrors.every(e => Object.keys(e).length === 0);
    };

    const [clinicErrors, setClinicErrors] = useState({});
    const clinicValidate = () => {
        let temp = {};
        if (!doctorClinic?.clinicName?.trim())
            temp.clinicName = "Clinic name is required";
        if (!doctorClinic?.licenseNumber?.trim())
            temp.licenseNumber = "License number is required";
        if (!doctorClinic?.clinicImage)
            temp.clinicImage = "Please upload clinic image.";
        if (!doctorClinic?.licenseImage)
            temp.licenseImage = "Please upload license image.";
        ;
        setClinicErrors(temp);
        return Object.keys(temp).length === 0;
    };


    const openTab = (tabId) => {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;
 
        const tab = new window.bootstrap.Tab(tabEl);
        tab.show();
    };

    return (
        <>
            {loading ? <Loader />
                :
                <div className="profile-right-card">
                    <div className="profile-tp-header">
                        <h5 className="heading-grad fz-24 mb-0">Edit Profile</h5>
                    </div>

                    <div className="">
                        <div className="employee-tabs">
                            <ul className="nav nav-tabs gap-3 mt-3 px-3" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        href="#home"
                                        role="tab"
                                    >
                                        Basic Details
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
                                        Education & Work & Experience
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
                                        Medical License
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
                                        Address & About you
                                    </a>
                                </li>
                                {aboutDoctor?.clinic && <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="clinic-tab"
                                        data-bs-toggle="tab"
                                        href="#clinic"
                                        role="tab"
                                    >
                                        Clinic
                                    </a>
                                </li>}

                            </ul>

                            <div className="">
                                <div className="employee-tabs">
                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="home"
                                            role="tabpanel"
                                        >
                                            <form onSubmit={basicSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Name</label>
                                                                    <input type="text" name="name" value={formData?.name} onChange={handleFormChange} className="form-control new-control-frm px-5" placeholder="Enter your name" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                    </div>
                                                                </div>
                                                                {basicErrors.name && <small className="text-danger">{basicErrors.name}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Mobile Number</label>
                                                                    <input type="number" name="contactNumber" value={formData?.contactNumber} onChange={handleFormChange} className="form-control new-control-frm px-5" placeholder="Enter your number" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                                    </div>
                                                                </div>
                                                                {basicErrors.contactNumber && <small className="text-danger">{basicErrors.contactNumber}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Email</label>
                                                                    <input type="email" name="email" value={formData?.email} onChange={handleFormChange} className="form-control new-control-frm px-5" placeholder="Enter your email" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEnvelope} /> </span>
                                                                    </div>
                                                                </div>
                                                                {basicErrors.email && <small className="text-danger">{basicErrors.email}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">Date of Birth</label>
                                                                    <input type="date" name="dob" value={formData?.dob} onChange={handleFormChange} className="form-control new-control-frm px-5" placeholder="Enter your date" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                    </div>
                                                                </div>
                                                                {basicErrors.dob && <small className="text-danger">{basicErrors.dob}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Gender</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMarsAndVenus} /> </span>
                                                                    <select className="nw-select" name="gender" value={formData?.gender} onChange={handleFormChange}>
                                                                        <option value={""}>--Select Gender--</option>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                        <option value="Other">Other</option>
                                                                    </select>
                                                                </div>
                                                                {basicErrors.gender && <small className="text-danger">{basicErrors.gender}</small>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="profile-btm-footer">
                                                    <div className="text-end">
                                                        <button className="thm-btn">Save & Next</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="tab-pane fade" id="profile" role="tabpanel">
                                            <form onSubmit={handleWorkEduSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <h5 className="fz-20 fw-700 text-black">Education</h5>
                                                    {education?.map((item, index) =>
                                                        <div className="pres-report-bx nw-press-report-bx mb-3" key={index}>
                                                            <div className="row">
                                                                <div className="col-lg-6 col-md-6 col-sm-12" >
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">University / Institution</label>
                                                                            <input type="text" name="university" value={item?.university} onChange={(e) => handleEducationChange(key, 'university', e.target.value)} className="form-control new-control-frm px-5" placeholder="Enter Your University / Institution" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faFile} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.education?.[index]?.university && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.education[index].university}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <label>Degree / Qualification</label>
                                                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                            <select className="nw-select" name="degree" value={item?.degree} onChange={(e) => handleEducationChange(key, 'degree', e.target.value)}>
                                                                                <option>--Select Degree / Qualification--</option>
                                                                                <option value="High School">High School</option>
                                                                                <option value="Intermediate">Intermediate / Higher Secondary</option>

                                                                                {/* Diploma */}
                                                                                <option value="Diploma">Diploma</option>
                                                                                <option value="Medical Diploma">Medical Diploma</option>

                                                                                {/* Undergraduate */}
                                                                                <option value="BA">BA</option>
                                                                                <option value="BSc">BSc</option>
                                                                                <option value="BCom">BCom</option>
                                                                                <option value="BBA">BBA</option>
                                                                                <option value="BCA">BCA</option>
                                                                                <option value="MBBS">MBBS</option>
                                                                                <option value="BDS">BDS</option>
                                                                                <option value="BAMS">BAMS</option>
                                                                                <option value="BHMS">BHMS</option>
                                                                                <option value="BPT">BPT</option>
                                                                                <option value="BPharm">B.Pharm</option>
                                                                                <option value="GNM">GNM</option>
                                                                                <option value="BSc Nursing">B.Sc Nursing</option>

                                                                                {/* Postgraduate */}
                                                                                <option value="MA">MA</option>
                                                                                <option value="MSc">MSc</option>
                                                                                <option value="MCom">MCom</option>
                                                                                <option value="MBA">MBA</option>
                                                                                <option value="MCA">MCA</option>
                                                                                <option value="MD">MD</option>
                                                                                <option value="MS">MS</option>
                                                                                <option value="MDS">MDS</option>
                                                                                <option value="MPT">MPT</option>
                                                                                <option value="MPharm">M.Pharm</option>
                                                                                <option value="MSc Nursing">M.Sc Nursing</option>

                                                                                {/* Doctorate */}
                                                                                <option value="PhD">PhD</option>

                                                                            </select>
                                                                        </div>
                                                                        {eduWorkErrors?.education?.[index]?.degree && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.education[index].degree}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Year form</label>
                                                                            <input type="number" name="startYear" value={item?.startYear} onChange={(e) => handleEducationChange(key, 'startYear', e.target.value)} className="form-control new-control-frm px-5" placeholder="" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.education?.[index]?.startYear && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.education[index].startYear}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Year To</label>
                                                                            <input type="number" name="endYear" value={item?.endYear} onChange={(e) => handleEducationChange(key, 'endYear', e.target.value)} className="form-control new-control-frm px-5" placeholder="" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.education?.[index]?.endYear && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.education[index].endYear}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="nw-press-delete-bx">
                                                                <button disabled={education?.length == 1} type="button" className="text-danger" onClick={() => removeEducation(key)}> <FontAwesomeIcon icon={faTrash} /> </button>
                                                            </div>

                                                        </div>
                                                    )}
                                                    <div className="add-more-bx d-flex justify-content-end mt-3">
                                                        <button type="button" onClick={addEducation} className="nw-thm-btn outline d-flex align-items-center justify-content-center gap-2 nw-dashed-brd"> <FiPlusSquare />   Add More</button>
                                                    </div>

                                                    <h5 className="fz-20 fw-700 text-black">Work & Experience</h5>
                                                    {experience?.map((item, index) =>
                                                        <div className="pres-report-bx nw-press-report-bx mb-3" key={index}>
                                                            <div className="row flex-grow-1">
                                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Organization / Hospital Name</label>
                                                                            <input type="text" name="organization" value={item?.organization} onChange={(e) => handleExperienceChange(key, 'organization', e.target.value)} className="form-control new-control-frm px-5" placeholder="Enter Your Organization / Hospital Name" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faFile} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.experience?.[index]?.organization && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.experience[index].organization}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Year</label>
                                                                            <input type="number" name="totalYear" value={item?.totalYear} onChange={(e) => handleExperienceChange(key, 'totalYear', e.target.value)} className="form-control new-control-frm px-5" placeholder="" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.experience?.[index]?.totalYear && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.experience[index].totalYear}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-3 col-md-6 col-sm-12">
                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Month</label>
                                                                            <input type="number" name="month" value={item?.month} onChange={(e) => handleExperienceChange(key, 'month', e.target.value)} className="form-control new-control-frm px-5" placeholder="" />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                            </div>
                                                                        </div>
                                                                        {eduWorkErrors?.experience?.[index]?.month && (
                                                                            <small className="text-danger">
                                                                                {eduWorkErrors.experience[index].month}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="nw-press-delete-bx">
                                                                <button className="text-danger"> <FontAwesomeIcon icon={faTrash} /> </button>
                                                            </div>
                                                        </div>)}

                                                    <div className="add-more-bx d-flex justify-content-end mt-3">
                                                        <button type="button" onClick={addExperience} className="nw-thm-btn outline d-flex align-items-center justify-content-center gap-2 nw-dashed-brd"> <FiPlusSquare />   Add More</button>
                                                    </div>

                                                </div>


                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button type="button" onClick={() => openTab('home-tab')}  className="nw-thm-btn outline">Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="tab-pane fade" id="contact" role="tabpanel">
                                            <form onSubmit={handleLicenseSubmit}>
                                                <div className="all-profile-data-bx">
                                                    {licenses?.map((item, key) =>
                                                        <div className="pres-report-bx nw-press-report-bx mb-3" key={key}>
                                                            <div className="row flex-grow-1">
                                                                <div className="col-lg-12 col-md-12 col-sm-12">

                                                                    <div className="custom-frm-bx">
                                                                        <div className="custom-frm-bx mb-0">
                                                                            <label htmlFor="">Medical License Certificate Name</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control new-control-frm px-5"
                                                                                value={item?.certName}
                                                                                placeholder="License Name "
                                                                                onChange={(e) => handleLicChange(key, "certName", e.target.value)}
                                                                            />
                                                                            <div className="contact-add-icon">
                                                                                <span className="nw-contact-icon">
                                                                                    <FontAwesomeIcon icon={faFile} />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {medicalErrors[key]?.certName && (
                                                                            <small className="text-danger">{medicalErrors[key].certName}</small>
                                                                        )}
                                                                    </div>

                                                                    <div className="pres-uploading-box">
                                                                        <div className="custom-frm-bx">
                                                                            <label htmlFor=""> Medical License Certificate</label>
                                                                             {/* <div>
                                                                                   <input
                                                                                type="file"
                                                                                key={item.certFile ? item.certFile : key}
                                                                                style={{ marginBottom: "10px" }}
                                                                                onChange={(e) => handleFileChange(key, e.target.files[0])}
                                                                            />
                                                                             </div> */}

                                                                             <div className="file-upload-wrapper mb-3">
                                                                                <input
                                                                                    type="file"
                                                                                    id={`fileUpload-${key}`}
                                                                                    className="file-input"
                                                                                    onChange={(e) => handleFileChange(key, e.target.files[0])}
                                                                                />

                                                                                <label htmlFor={`fileUpload-${key}`} className="file-label">
                                                                                    <span className="file-text">Choose File</span>
                                                                                    <span className="file-btn">Browse</span>
                                                                                </label>
                                                                                </div>

                                                                            {(item.preview || item.certFile) && (
                                                                                <div className="pres-picture-bx">
                                                                                    <img
                                                                                        src={
                                                                                            item.preview
                                                                                                ? item.preview
                                                                                                : `${base_url}/${item?.certFile}`
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {item?.certFile &&
                                                                             <div className="close-pres-bx">
                                                                                <button
                                                                                    type="button"
                                                                                    className="remv-pic-btn"
                                                                                    onClick={() => handleLicChange(key, "certFile")}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faClose} />
                                                                                </button>
                                                                            </div>}
                                                                            
                                                                            {medicalErrors[key]?.certFile &&
                                                                                <small className="text-danger">{medicalErrors[key].certFile}</small>
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="nw-press-delete-bx">
                                                                <button
                                                                    type="button"
                                                                    disabled={licenses?.length === 1}
                                                                    onClick={() => {
                                                                        if (item?.certFile?.startsWith("uploads")) {
                                                                            deleteLicenseItem(item?._id);
                                                                        } else {
                                                                            removeItem(key)
                                                                        }
                                                                    }}
                                                                    className="text-danger"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="add-more-bx d-flex justify-content-end mt-3">
                                                        <button
                                                            type="button"
                                                            onClick={addMore}
                                                            className="nw-thm-btn outline d-flex align-items-center justify-content-center gap-2 nw-dashed-brd"
                                                        >
                                                            <FiPlusSquare /> Add More
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button  type="button" onClick={() => openTab('profile-tab')}  className="nw-thm-btn outline">Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="upload" role="tabpanel">
                                            <form onSubmit={addressSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Organization / Hospital Name</label>
                                                                    <input type="text" name="hospitalName" value={addressData?.hospitalName} onChange={handleAddressChange} id="" className="form-control new-control-frm px-5" placeholder="Enter your Organization / Hospital Name" />

                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faHospital} /> </span>
                                                                    </div>
                                                                </div>
                                                                {aboutErrors.hospitalName && <small className="text-danger">{aboutErrors.hospitalName}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Full Address</label>
                                                                    <input type="text" name="fullAddress" value={addressData?.fullAddress} onChange={handleAddressChange} id="" className="form-control new-control-frm px-5" placeholder="Enter Your Address" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLocationDot} /> </span>
                                                                    </div>
                                                                </div>
                                                                {aboutErrors.fullAddress && <small className="text-danger">{aboutErrors.fullAddress}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Country</label>

                                                                <div className="select-gradient-wrapper">
                                                                    <select name="countryId" value={addressData.countryId} onChange={handleAddressChange} id="" className="form-select gradient-select">
                                                                    <option value="">---Select Country---</option>
                                                                    {countries?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>

                                                                <span><i class="fa-solid fa-chevron-down select-icon"></i></span>
                                                                    
                                                                </div>

                                                                
                                                                {aboutErrors.country && <small className="text-danger">{aboutErrors.country}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">State</label>

                                                                <div className="select-gradient-wrapper">
                                                                     <select name="stateId" value={addressData.stateId} onChange={handleAddressChange} id="" className="form-select gradient-select">
                                                                    <option value="">---Select State---</option>
                                                                    {states?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>

                                                                <span><i class="fa-solid fa-chevron-down select-icon"></i></span>



                                                                </div>

                                                               
                                                                {aboutErrors.state && <small className="text-danger">{aboutErrors.state}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">City</label>

                                                                <div className="select-gradient-wrapper">
                                                                    <select name="cityId" value={addressData.cityId} onChange={handleAddressChange} id="" className="form-select gradient-select">
                                                                    <option value="">---Select City---</option>
                                                                    {cities?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>


                                                                <span><i class="fa-solid fa-chevron-down select-icon"></i></span>

                                                                </div>

                                                              
                                                                {aboutErrors.city && <small className="text-danger">{aboutErrors.city}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Pin code</label>
                                                                    <input type="number" name="pinCode" value={addressData?.pinCode} onChange={handleAddressChange} id="" className="form-control new-control-frm px-5" placeholder="enter pin code" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faMapPin} /> </span>
                                                                    </div>
                                                                </div>
                                                                {aboutErrors.pinCode && <small className="text-danger">{aboutErrors.pinCode}</small>}
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Specialty</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                    <select required className="nw-select" name="specialty" value={addressData.specialty} onChange={handleAddressChange}>
                                                                        <option>--Select--</option>
                                                                        {specialities?.map((item, key) =>
                                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                    </select>
                                                                </div>
                                                                {aboutErrors.specialty && <small className="text-danger">{aboutErrors.specialty}</small>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Treatment Areas</label>
                                                                <div className=" react-select-wrapper">
                                                                    <Select
                                                                        options={treatmentOptions}
                                                                        isMulti
                                                                        name="treatMent"
                                                                        value={treatmentValue}
                                                                        classNamePrefix="custom-select"
                                                                        placeholder="Select area(s)"
                                                                        onChange={(selectedOptions) => {
                                                                            setAddressData(prev => ({
                                                                                ...prev,
                                                                                treatmentAreas: selectedOptions
                                                                                    ? selectedOptions.map(opt => opt.value)
                                                                                    : []
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                                {aboutErrors.treatmentAreas && <small className="text-danger">{aboutErrors.treatmentAreas}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">Fees(₹)</label>
                                                                    <input type="number" name="fees" value={addressData?.fees} onChange={handleAddressChange} id="" className="form-control new-control-frm px-5" placeholder="enter pin code" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCircleDollarToSlot} /> </span>
                                                                    </div>
                                                                </div>
                                                                {aboutErrors.fees && <small className="text-danger">{aboutErrors.fees}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Languages</label>
                                                                <div className="react-select-wrapper">
                                                                    <Select
                                                                        options={languageOptions}
                                                                        isMulti
                                                                        required
                                                                        name="language"
                                                                        value={language}
                                                                        classNamePrefix="custom-select"
                                                                        placeholder="Select language(s)"
                                                                        onChange={(selectedOptions) => {
                                                                            // selectedOptions is an array of { value, label }
                                                                            setAddressData(prev => ({
                                                                                ...prev,
                                                                                language: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                                {aboutErrors.language && <small className="text-danger">{aboutErrors.language}</small>}

                                                                {/* <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                            <select ref={selectRef} multiple ></select>
                                                                            </div> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">About You</label>
                                                                    <textarea name="aboutYou" value={addressData?.aboutYou} onChange={handleAddressChange} id="" className="form-control new-control-frm"></textarea>
                                                                </div>
                                                                {aboutErrors.aboutYou && <small className="text-danger">{aboutErrors.aboutYou}</small>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button  type="button" onClick={() => openTab('contact-tab')}  className="nw-thm-btn outline">Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="clinic" role="tabpanel">
                                            <form onSubmit={clinicSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Clinic Name</label>
                                                                    <input type="text" name="clinicName" value={doctorClinic?.clinicName} onChange={clinicChange} id="" className="form-control new-control-frm px-5" placeholder="Enter your Organization / Hospital Name" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faHospital} /> </span>
                                                                    </div>
                                                                </div>
                                                                {clinicErrors?.clinicName && <small className="text-danger">{clinicErrors.clinicName}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">License Number</label>
                                                                    <input type="text" name="licenseNumber" value={doctorClinic?.licenseNumber} onChange={clinicChange} id="" className="form-control new-control-frm px-5" placeholder="Enter License Number" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faDriversLicense} /> </span>
                                                                    </div>
                                                                </div>
                                                                {clinicErrors.licenseNumber && <small className="text-danger">{clinicErrors.licenseNumber}</small>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="clinicImage" style={{ cursor: "pointer" }}>Clinic Image (click here to upload)</label>
                                                                <div className="pres-picture-bx">
                                                                    {/* If new file selected */}
                                                                    {doctorClinic?.clinicImage?.file ? (
                                                                        doctorClinic.clinicImage.type === "application/pdf" ? (
                                                                            <p className="mb-0 fw-semibold">
                                                                                📄 {doctorClinic.clinicImage.name}
                                                                            </p>
                                                                        ) : (
                                                                            <img
                                                                                src={doctorClinic.clinicImage.preview}
                                                                                alt="Clinic"
                                                                                width="120"
                                                                            />
                                                                        )
                                                                    ) : doctorClinic?.clinicImage ? (
                                                                        // If coming from DB
                                                                        doctorClinic.clinicImage.endsWith(".pdf") ? (
                                                                            <p className="mb-0 fw-semibold">
                                                                                📄 {doctorClinic.clinicImage.split("/").pop()}
                                                                            </p>
                                                                        ) : (
                                                                            <img
                                                                                src={`${base_url}/${doctorClinic.clinicImage}`}
                                                                                alt="Clinic"
                                                                                width="120"
                                                                            />
                                                                        )
                                                                    ) : null}
                                                                </div>

                                                                <input
                                                                    type="file"
                                                                    className="d-none"
                                                                    id="clinicImage"
                                                                    name="clinicImage"
                                                                    accept=".png,.jpg,.jpeg"
                                                                    onChange={clinicChange}
                                                                />
                                                                {clinicErrors.clinicImage && <small className="text-danger">{clinicErrors.clinicImage}</small>}


                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx" >
                                                                <label htmlFor="licenseImage" style={{ cursor: "pointer" }} className="">License Image (click here to upload)</label>
                                                                <div className="pres-picture-bx" htmlFor="licenseImage">
                                                                    {/* If new file selected */}
                                                                    {doctorClinic?.licenseImage?.file ? (
                                                                        doctorClinic.licenseImage.type === "application/pdf" ? (
                                                                            <p className="mb-0 fw-semibold">
                                                                                📄 {doctorClinic.licenseImage.name}
                                                                            </p>
                                                                        ) : (
                                                                            <img
                                                                                src={doctorClinic.licenseImage.preview}
                                                                                alt="License"
                                                                                width="120"
                                                                            />
                                                                        )
                                                                    ) : doctorClinic?.licenseImage ? (
                                                                        // If coming from DB
                                                                        doctorClinic.licenseImage.endsWith(".pdf") ? (
                                                                            <p className="mb-0 fw-semibold">
                                                                                📄 {doctorClinic.licenseImage.split("/").pop()}
                                                                            </p>
                                                                        ) : (
                                                                            <img
                                                                                src={`${base_url}/${doctorClinic.licenseImage}`}
                                                                                alt="License"
                                                                                width="120"
                                                                            />
                                                                        )
                                                                    ) : null}
                                                                </div>

                                                                <input
                                                                    type="file"
                                                                    className="d-none"
                                                                    id="licenseImage"
                                                                    name="licenseImage"
                                                                    accept=".png,.jpg,.jpeg,.pdf"
                                                                    onChange={clinicChange}
                                                                />
                                                                {clinicErrors.licenseImage && <small className="text-danger">{clinicErrors.licenseImage}</small>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button  type="button" onClick={() => openTab('upload-tab')}  className="nw-thm-btn outline">Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

             <div className="text-end mt-4">
                 <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
              </div>

        </>
    )
}

export default DoctorEditProfile