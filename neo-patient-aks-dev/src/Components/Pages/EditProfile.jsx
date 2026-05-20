import { faCalendar, faCity, faClose, faDroplet, faFile, faGlobe, faLocation, faPhone, faSatellite, faTrash, faUser, faWeight, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { useDispatch, useSelector } from "react-redux"
import { fetchPatientDetail } from "../../Redux/features/patient"
import { useEffect, useState } from "react"
import base_url from "../../baseUrl"
import { FiPlusSquare } from "react-icons/fi"
import { toast } from "react-toastify"
import { deleteApiData, getApiData, securePostData } from "../../Services/api"
import Loader from "../../Loader/Loader"

function EditProfile() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const { profiles, medicalHistory, demographic, labAppointment, kyc, prescription, isRequest, customId, allowEdit } = useSelector(state => state.patient)
    const [personalForm, setPersonalForm] = useState({
        height: "", weight: "", bloodGroup: "", dob: null,
        contact: {
            emergencyContactName: "",
            emergencyContactNumber: null,
        }, address: "", countryId: "", stateId: "", cityId: "",
    })
    const [medicalForm, setMedicalForm] = useState({
        chronicCondition: "",
        onMedication: false,
        medicationDetail: "",
        allergies: "",
        smoking: false,
        alcohol: false,
    })
    const [familyForm, setFamilyForm] = useState({ chronicHistory: "", diseasesInFamiy: "" })
    const [prescriptionForm, setPrescriptionForm] = useState([{ name: "", fileUrl: null, preview: null }])
    useEffect(() => {
        fetchCountries()
    }, [])
    useEffect(() => {
        if (demographic) {
            const data =
                setPersonalForm({
                    ...demographic, dob: demographic.dob
                        ? new Date(demographic.dob).toISOString().split("T")[0]
                        : "",
                    countryId: demographic?.countryId?._id || "", stateId: demographic?.stateId?._id || "", cityId: demographic?.cityId?._id || "",

                })
        }
        if (medicalHistory) {
            setMedicalForm(medicalHistory)
            setFamilyForm(medicalHistory.familyHistory)
        } if (prescription) {
            setPrescriptionForm(prescription.prescriptions)
        }
    }, [demographic, medicalHistory, prescription])
    const personalChange = (e) => {
        const { name, value } = e.target;



        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setPersonalForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setPersonalForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
        if (name === 'countryId' && value) {
            const selectedCountry = countries?.find(
                item => item?._id === value
            );

            if (selectedCountry) {
                fetchStates(selectedCountry.isoCode);
            }
        }

        if (name === 'stateId' && value) {
            const selectedState = states?.find(
                item => item?._id === value
            );

            if (selectedState) {
                fetchCities(selectedState.isoCode);
            }
        }
    };

    // const medicalChange = (e) => {
    //     const { type, name, value, files } = e.target;
    //     setMedicalForm(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    const medicalChange = (e) => {
        const { type, name, value } = e.target;

        setMedicalForm(prev => ({
            ...prev,
            [name]: type === "radio" ? value === "true" : value
        }));
    };

    const familyChange = (e) => {
        const { type, name, value, files } = e.target;
        setFamilyForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleNameChange = (index, e) => {
        const newReports = [...prescriptionForm];
        newReports[index].name = e.target.value;
        setPrescriptionForm(newReports);
    };

    // Handle file select / drag & drop
    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newReports = [...prescriptionForm];
        newReports[index].fileUrl = file;
        // newReports[index].preview = URL.createObjectURL(file);
        setPrescriptionForm(newReports);
    };

    // Add new report
    const handleAddReport = () => {
        setPrescriptionForm([...prescriptionForm, { name: "", file: null, preview: null }]);
    };

    // Delete a report
    const handleDeleteReport = async (index, item) => {
        if (item?._id) {
            await deletePrescription(prescription?._id, item?._id)
            return
        }
        if (prescriptionForm?.length === 1) return; // always keep at least 1
        const newReports = prescriptionForm?.filter((_, i) => i !== index);
        setPrescriptionForm(newReports);
    };
    // const validate = () => {
    //     let newErrors = {};
    //     if (!personalForm.height.trim())
    //         newErrors.name = "Height is required";

    //     if (!personalForm.weight)
    //         newErrors.dob = "Weight is required";

    //     if (!personalForm.bloodGroup)
    //         newErrors.gender = "Blood group is required";
    //     if (!personalForm.address)
    //         newErrors.address = "Address is required";

    //     if (!personalForm.contactNumber)
    //         newErrors.contactNumber = "Mobile number is required";
    //     else if (!/^\d{10}$/.test(personalForm.contactNumber))
    //         newErrors.contactNumber = "Mobile number must be 10 digits";

    //     if (!personalForm.email)
    //         newErrors.email = "Email is required";
    //     else if (!/^\S+@\S+\.\S+$/.test(personalForm.email))
    //         newErrors.email = "Invalid email address";

    //     if (!personalForm.contact.emergencyContactName)
    //         newErrors.emergencyContactName = "Emergency contact name is required";

    //     if (!personalForm.contact.emergencyContactNumber)
    //         newErrors.emergencyContactNumber = "Emergency contact number is required";
    //     else if (!/^\d{10}$/.test(personalForm.contact.emergencyContactNumber))
    //         newErrors.emergencyContactNumber = "Emergency contact number must be 10 digits";

    //     if (!personalForm.department)
    //         newErrors.department = "Department is required";

    //     if (!personalForm.countryId && !id)
    //         newErrors.countryId = "State is required";

    //     if (!personalForm.stateId && !id)
    //         newErrors.stateId = "State is required";

    //     if (!personalForm.cityId && !id)
    //         newErrors.cityId = "City is required";
    //     // if (!form.pinCode)
    //     //   newErrors.pinCode = "Pincode is required";
    //     // else if (!/^\d{6}$/.test(form.pinCode))
    //     //   newErrors.pinCode = "Pincode must be 6 digits";

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };
    
    const personalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = { userId, ...personalForm }
        try {
            const response = await securePostData('patient/demographic', data)
            if (response.success) {
                dispatch(fetchPatientDetail())
                toast.success('Records saved successfully')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    const medicalSubmit = async (e) => {
        e.preventDefault();
        const data = { userId, ...medicalForm }
        try {
            const response = await securePostData('patient/medical-history', data)
            if (response.success) {
                toast.success("Medical records sent")
                dispatch(fetchPatientDetail())
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    };
    const familySubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = { userId, familyHistory: familyForm }
        try {
            const response = await securePostData('patient/family-medical-history', data)
            if (response.success) {
                toast.success("Medical records sent")
                dispatch(fetchPatientDetail())
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };
    const prescriptionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('prescriptions', JSON.stringify(
            prescriptionForm.map(report => ({
                name: report.name,
            }))
        ));

        prescriptionForm.forEach(report => {
            formData.append('fileUrl', report.fileUrl);
        });

        try {
            const response = await securePostData('patient/prescription', formData);
            if (response.success) {
                toast.success('Prescriptions submitted successfully!');
                dispatch(fetchPatientDetail())
            } else {
                toast.error('Submission failed: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false)
        }
    };

    const deletePrescription = async (itemId, id) => {
        const confirm = window.confirm('Are You sure ?')
        if (!confirm) {
            return
        }
        const data = { userId, ...medicalForm }
        try {
            const response = await deleteApiData(`patient/prescription/${itemId}/${id}`)
            if (response.success) {
                toast.success("Prescription record deleted")
                dispatch(fetchPatientDetail())
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
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
    useEffect(() => {
        console.log("demographic", demographic)
        if (demographic?.countryId?.isoCode) {
            fetchStates(demographic.countryId.isoCode);
        }
    }, [demographic?.countryId?.isoCode]);

    useEffect(() => {
        if (demographic?.stateId?.isoCode) {
            fetchCities(demographic.stateId.isoCode);
        }
    }, [demographic?.stateId?.isoCode]);
    useEffect(() => {
        dispatch(fetchPatientDetail())
    }, [dispatch])

    const handleRemoveImage = (index) => {
        setPrescriptionForm((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                fileUrl: null // ya "" bhi kar sakte ho
            };
            return updated;
        });
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
                        <h5 className="heading-grad fz-24 mb-0"> Edit My NeoHealthCard  Details</h5>
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
                                        Personal  Info
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
                                        Medical History
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
                                        Family Medical History
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
                                        Prescriptions and Reports
                                    </a>
                                </li>

                            </ul>

                            <div className="new-panel-card">
                                <div className="employee-tabs">
                                    <div className="tab-content" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="home"
                                            role="tabpanel"
                                        >
                                            <form onSubmit={personalSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Height (in feet)</label>
                                                                <input type="number" name="height" value={personalForm.height} onChange={personalChange} className="form-control new-control-frm px-5" placeholder="Enter your height" />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faWeight} /> </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Weight (in kg)</label>
                                                                <input type="number" name="weight" value={personalForm.weight} onChange={personalChange} className="form-control new-control-frm px-5" placeholder="Enter your weight" />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faWeight} /> </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Blood Group</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faDroplet} /> </span>
                                                                    <select className="nw-select" name="bloodGroup" value={personalForm.bloodGroup} onChange={personalChange}>
                                                                        <option value="">--Select--</option>
                                                                        <option value="A+">A+</option>
                                                                        <option value="A-">A-</option>
                                                                        <option value="B+">B+</option>
                                                                        <option value="B-">B-</option>
                                                                        <option value="O+">O+</option>
                                                                        <option value="O-">O-</option>
                                                                        <option value="AB+">AB+</option>
                                                                        <option value="AB-">AB-</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Date of Birth</label>
                                                                <input type="date" name="dob" value={personalForm.dob} onChange={personalChange} className="form-control new-control-frm ps-5" placeholder="Enter your weight" />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Emergency Contact Name</label>
                                                                <input
                                                                    type="text"
                                                                    name="contact.emergencyContactName"
                                                                    value={personalForm?.contact?.emergencyContactName}
                                                                    onChange={personalChange}
                                                                    className="form-control new-control-frm px-5"
                                                                    placeholder="Enter emergency contact name"
                                                                />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Emergency Contact Number</label>
                                                                <input
                                                                    type="number"
                                                                    name="contact.emergencyContactNumber"
                                                                    value={personalForm?.contact?.emergencyContactNumber}
                                                                    onChange={personalChange}
                                                                    className="form-control new-control-frm px-5"
                                                                    placeholder="Enter emergency contact number"
                                                                />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPhone} /> </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">

                                                                <label htmlFor="countryId">Country</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faGlobe} /> </span>
                                                                    <select required name="countryId" value={personalForm.countryId} onChange={personalChange} id="countryId" className="nw-select">
                                                                        <option value="">---Select Country---</option>
                                                                        {countries?.map((item, key) =>
                                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">

                                                                <label htmlFor="stateId">State</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faSatellite} /> </span>
                                                                    <select required name="stateId" value={personalForm.stateId} onChange={personalChange} id="" className="nw-select">
                                                                        <option value="">---Select State---</option>
                                                                        {states?.map((item, key) =>
                                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">

                                                                <label htmlFor="cityId">City</label>
                                                                <div className="field custom-frm-bx mb-0 custom-frm-bx custom-select nw-custom-select">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCity} /> </span>

                                                                    <select required name="cityId" value={personalForm.cityId} onChange={personalChange} id="" className="nw-select">
                                                                        <option value="">---Select City---</option>
                                                                        {cities?.map((item, key) =>
                                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx ">
                                                                <label htmlFor="">Full Address</label>
                                                                <input type="text" name="address" value={personalForm.address} onChange={personalChange} className="form-control new-control-frm px-5" placeholder="Enter your height" />
                                                                <div className="contact-add-icon">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLocation} /> </span>
                                                                </div>
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
                                            <form onSubmit={medicalSubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">


                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Do you have any chronic conditions?</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                    <select className="nw-select" name="chronicCondition"
                                                                        value={medicalForm.chronicCondition}
                                                                        onChange={medicalChange}>
                                                                        <option value="">--Select--</option>
                                                                        <option value="diabetes">Diabetes</option>
                                                                        <option value="hypertension">Hypertension</option>
                                                                        <option value="asthma">Asthma</option>
                                                                        <option value="heart">Heart Disease</option>
                                                                        <option value="none">None</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx ">
                                                                <label htmlFor="">Are you currently on any medications?</label>

                                                                <div className="custom-radio-group d-flex align-items-center gap-2 mt-lg-3">
                                                                    <div className="form-check form-check-inline me-0">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="onMedication"
                                                                            value={true}
                                                                            checked={medicalForm.onMedication}
                                                                            onChange={medicalChange}
                                                                            id="medYes"
                                                                        />
                                                                        <label className="form-check-label" htmlFor="textOption">
                                                                            Yes
                                                                        </label>
                                                                    </div>

                                                                    <div className="form-check form-check-inline me-0">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="onMedication"
                                                                            value={false}
                                                                            checked={!medicalForm.onMedication}
                                                                            onChange={medicalChange}
                                                                            id="medNo"
                                                                        />
                                                                        <label className="form-check-label" htmlFor="selectOption">
                                                                            No
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Medication Details</label>
                                                                <textarea name="medicationDetail"
                                                                    value={medicalForm.medicationDetail}
                                                                    onChange={medicalChange} id="" className="form-control new-control-frm"></textarea>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Allergies</label>
                                                                <textarea name="allergies"
                                                                    value={medicalForm.allergies}
                                                                    onChange={medicalChange} id="" className="form-control new-control-frm"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button type="button" className="nw-thm-btn outline" onClick={() => openTab('home-tab')}>Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="contact" role="tabpanel">
                                            <form onSubmit={familySubmit}>
                                                <div className="all-profile-data-bx">
                                                    <div className="row">


                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label>Any family history of chronic disease?</label>
                                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                                    <select
                                                                        name="chronicHistory"
                                                                        value={familyForm.chronicHistory}
                                                                        onChange={familyChange}
                                                                        className="nw-select"
                                                                    >
                                                                        <option value="">--Select--</option>
                                                                        <option value="diabetes">Diabetes</option>
                                                                        <option value="hypertension">Hypertension</option>
                                                                        <option value="asthma">Asthma</option>
                                                                        <option value="heart">Heart Disease</option>
                                                                        <option value="none">None</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Chronic Diseases in Family</label>
                                                                <textarea name="diseasesInFamily" value={familyForm?.diseasesInFamily}
                                                                    onChange={familyChange} id="" className="form-control new-control-frm"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <button type="button" className="nw-thm-btn outline" onClick={() => openTab('profile-tab')}>Back</button>
                                                        </div>
                                                        <div>
                                                            <button className="thm-btn">Save & Next</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="upload" role="tabpanel">
                                            <form onSubmit={prescriptionSubmit}>
                                                {prescriptionForm?.map((item, index) => (
                                                    <div className="all-profile-data-bx" key={item.id || index}>
                                                        <div className="pres-report-bx nw-press-report-bx">
                                                            <div className="row flex-grow-1">
                                                                <div className="col-12">
                                                                    {/* Name */}
                                                                    <div className="custom-frm-bx">
                                                                        <label>Prescriptions and Reports Name</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control new-control-frm px-5"
                                                                            placeholder="Enter Prescriptions and Reports Name"
                                                                            value={item.name || ""}
                                                                            onChange={(e) =>
                                                                                handleNameChange(index, e)
                                                                            }
                                                                        />
                                                                        <div className="contact-add-icon">
                                                                            <span className="nw-contact-icon">
                                                                                <FontAwesomeIcon icon={faFile} />
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Upload Preview */}
                                                                    <div className="pres-uploading-box">
                                                                        <div className="custom-frm-bx">
                                                                            <label>Prescriptions and Reports Upload</label>

                                                                            <div className="file-upload-wrapper mb-3">
                                                                                <input
                                                                                    type="file"
                                                                                    id={`fileUpload-${index}`}
                                                                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                                                                    className="file-input"
                                                                                    onChange={(e) => handleFileChange(index, e)}
                                                                                />

                                                                                <label htmlFor={`fileUpload-${index}`} className="file-label">
                                                                                    <span className="file-text">Choose File</span>
                                                                                    <span className="file-btn">Browse</span>
                                                                                </label>
                                                                            </div>

                                                                            {item.fileUrl && (
                                                                                <div className="pres-picture-bx">
                                                                                    <img
                                                                                        src={
                                                                                            item.fileUrl instanceof File
                                                                                                ? URL.createObjectURL(item.fileUrl)
                                                                                                : `${base_url}/${item.fileUrl}`
                                                                                        }
                                                                                        alt="Prescription"
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {/* Remove image */}
                                                                            {item?.fileUrl && <div className="close-pres-bx">
                                                                                <button
                                                                                    type="button"
                                                                                    className="remv-pic-btn"
                                                                                    onClick={() => handleRemoveImage(index)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faClose} />
                                                                                </button>
                                                                            </div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Delete entire report */}
                                                            <div className="nw-press-delete-bx">
                                                                <button
                                                                    type="button"
                                                                    className="text-danger"
                                                                    onClick={() => handleDeleteReport(index, item)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>



                                                ))}

                                                <div className="all-profile-data-bx text-end pt-0">
                                                    <button
                                                        type="button"
                                                        className="nw-thm-btn outline align-items-center justify-content-center gap-2 nw-dashed-brd"
                                                        onClick={handleAddReport}
                                                    >
                                                        <FiPlusSquare /> Add More
                                                    </button>
                                                </div>




                                                {/* Footer */}
                                                <div className="profile-btm-footer">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <button type="button" className="nw-thm-btn outline" onClick={() => openTab('contact-tab')}>
                                                            Back
                                                        </button>

                                                        <button type="submit" className="thm-btn">
                                                            Save & Next
                                                        </button>
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
        </>
    )
}

export default EditProfile