import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { BsPlusCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";


function AddPatient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [patientData, setPatientData] = useState()

    const [fetchById, setFetchById] = useState(false)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [patientId, setPatientId] = useState()
    const [byId, setById] = useState(true)
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: "",
        dob: "",
        gender: "",
        contactNumber: "",
        email: "",
        contact: {
            emergencyContactName: "",
            emergencyContactNumber: "",
        },
        address: "",
        countryId: null,
        stateId: "",
        cityId: "",
        pinCode: "",
        status: "Active"
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {

            setForm(prev => ({ ...prev, [name]: value }));
        }
        if (name === 'countryId' && value) {
            const data = countries?.filter(item => item?._id === value)
            fetchStates(data[0].isoCode);
        }
        if (name === 'stateId' && value) {
            const data = states?.filter(item => item?._id === value)
            fetchCities(data[0].isoCode);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await securePostData("doctor/add-patient", form);
            if (res.success) {
                toast.success("Patient added successfully");
                setForm({
                    name: "",
                    dob: "",
                    gender: "",
                    contactNumber: "",
                    email: "",
                    contact: {
                        emergencyContactName: "",
                        emergencyContactNumber: "",
                    },
                    address: "",
                    countryId: null,
                    stateId: "",
                    cityId: "",
                    pinCode: "",
                })
                navigate(`/add-appointment?patientId=${res.data._id}`)
            } else {
                toast.error(res?.message || "Failed to add patient");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApiData("api/location/countries")
            .then(res => setCountries(res))
            .catch(err => console.error(err));

    }, []);

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






    const validate = () => {
        let newErrors = {};

        //   if (!form.patientId.trim())
        //     newErrors.patientId = "Patient ID is required";

        if (!form.name.trim())
            newErrors.name = "Patient name is required";

        if (!form.dob)
            newErrors.dob = "Date of birth is required";

        if (!form.gender)
            newErrors.gender = "Gender is required";

        if (!form.contactNumber)
            newErrors.contactNumber = "Mobile number is required";
        else if (!/^\d{10}$/.test(form.contactNumber))
            newErrors.contactNumber = "Mobile number must be 10 digits";

        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
            newErrors.email = "Invalid email address";

        if (form.emergencyContactPhone && !/^\d{10}$/.test(form.emergencyContactPhone))
            newErrors.emergencyContactPhone = "Emergency phone must be 10 digits";



        if (!form.countryId)
            newErrors.countryId = "State is required";

        if (!form.stateId)
            newErrors.stateId = "State is required";

        if (!form.cityId)
            newErrors.cityId = "City is required";

        if (form.pinCode && !/^\d{6}$/.test(form.pinCode))
            newErrors.pinCode = "Pincode must be 6 digits";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        if (!form.stateId) return;

        const fetchCities = async () => {
            try {
                const res = await getApiData(`location/cities/${form.stateId}`);
                setCities(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCities();
    }, [form.stateId]);
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">Add Patient</h5>
                </div>

                <div className="all-profile-data-bx">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Patient ID</label>
                                                    <input type="text" className="form-control new-control-frm" placeholder="Enter Patient ID" />

                                                </div>
                                            </div> */}

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Patient Name </label>
                                    <input type="text" name="name"
                                        value={form.name}
                                        onChange={handleChange} className="form-control new-control-frm" placeholder="Enter Patient Name " />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Date of Birth</label>
                                    <input type="date" name="dob"
                                        value={form.dob}
                                        onChange={handleChange} className="form-control new-control-frm" placeholder="Enter " />
                                    {errors.dob && <small className="text-danger">{errors.dob}</small>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Gender</label>
                                    <select className="form-select new-control-frm" name="gender"
                                            value={form.gender}
                                            onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mobile Number</label>
                                    <input type="number" className="form-control new-control-frm" placeholder="Enter  mobile number "
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleChange} />
                                    {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Email</label>
                                    <input name="email"
                                        value={form.email}
                                        onChange={handleChange} type="email" className="form-control new-control-frm" placeholder="Enter  Email " />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency contact person name</label>
                                    <input name="contact.emergencyContactName"
                                        value={form.emergencyContactName}
                                        onChange={handleChange} type="text" className="form-control new-control-frm" placeholder="Emergency contact person name" />
                                    {errors.emergencyContactName && <small className="text-danger">{errors.emergencyContactName}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency Contact Phone</label>
                                    <input name="contact.emergencyContactNumber"
                                        value={form?.contact?.emergencyContactNumber}
                                        onChange={handleChange} type="number" className="form-control new-control-frm" placeholder="Enter  Emergency Contact Phone" />
                                    {errors.emergencyContactNumber && <small className="text-danger">{errors.emergencyContactNumber}</small>}

                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Address</label>
                                    <textarea name="address"
                                        value={form.address}
                                        onChange={handleChange} id="" className="form-control new-control-frm"></textarea>
                                    {errors.address && <small className="text-danger">{errors.address}</small>}


                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Country</label>
                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select">
                                        <select className="nw-select" value={form.countryId}
                                            name="countryId"
                                            onChange={handleChange}>
                                            <option value="">---Select Country---</option>
                                            {countries?.map((s) => (
                                                <option key={s._id} value={s._id} >
                                                    {s.name}
                                                </option>
                                            ))}

                                        </select>
                                        {errors.countryId && <small className="text-danger">{errors.countryId}</small>}

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>State</label>
                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select">
                                        <select className="nw-select" value={form.stateId}
                                            name="stateId"
                                            onChange={handleChange}>
                                            <option value={""}>---Select State---</option>
                                            {states?.map((s) => (
                                                <option key={s._id} value={s._id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.stateId && <small className="text-danger">{errors.stateId}</small>}

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>City</label>
                                    <div className="field custom-frm-bx mb-0 custom-select nw-custom-select">
                                        <select className="nw-select" value={form.cityId}
                                            name="cityId"
                                            onChange={handleChange}>
                                            <option value={""}>---Select City---</option>
                                            {cities?.map((c, index) => (
                                                <option key={index} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.cityId && <small className="text-danger">{errors.cityId}</small>}

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Pin code</label>
                                    <input type="number" className="form-control new-control-frm" placeholder="Enter Pin code" />

                                </div>
                            </div>


                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <div className="text-end"> 
                                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                                 </div>

                            <button className="nw-thm-btn" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
                        </div>

                    </form>
                </div>

            </div>

        </>
    )
}

export default AddPatient