import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { BsPlusCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";


function AddPharmacy() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [doctorData, setDoctorData] = useState()

    const [fetchById, setFetchById] = useState(false)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [doctorId, setDoctorId] = useState()
    const [byId, setById] = useState(true)
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: "",
        gstNumber: "",
        about: "",
        contactNumber: "",
        email: "",
        contact: {
            emergencyContactName: "",
            emergencyContactNumber: "",
        },
        fullAddress: "",
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
            const res = await securePostData("admin/add-pharmacy", form);
            if (res.success) {
                toast.success("Pharmacy added successfully");
                setForm({
                    name: "",
                    gstNumber: "",
                    about: "",
                    contactNumber: "",
                    email: "",
                    contact: {
                        emergencyContactName: "",
                        emergencyContactNumber: "",
                    },
                    fullAddress: "",
                    countryId: null,
                    stateId: "",
                    cityId: "",
                    pinCode: "",
                })
                navigate(`/pharmacy-list`)
            } else {
                toast.error(res?.message || "Failed to add doctor");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApiData("api/location/countries")
            .then(res => {
                const data = res.find(item => item?.name == "India")
                setForm({ ...form, countryId: data?._id })
                fetchStates(data?.isoCode)
                setCountries(res)
            })
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

        //   if (!form.doctorId.trim())
        //     newErrors.doctorId = "Lab ID is required";

        if (!form.name.trim())
            newErrors.name = "Pharmacy name is required";

        if (!form.gstNumber)
            newErrors.gstNumber = "Gst Number is required";

        if (!form.about)
            newErrors.about = "About is required";

        if (!form.contactNumber)
            newErrors.contactNumber = "Mobile number is required";
        else if (!/^\d{10}$/.test(form.contactNumber))
            newErrors.contactNumber = "Mobile number must be 10 digits";

        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
            newErrors.email = "Invalid email fullAddress";

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



    return (
        <>

            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">Add Pharmacy</h5>
                </div>

                <div className="all-profile-data-bx">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Lab ID</label>
                                                    <input type="text" className="form-control nw-select-frm" placeholder="Enter Lab ID" />

                                                </div>
                                            </div> */}

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Pharmacy Name </label>
                                    <input type="text" name="name"
                                        value={form.name}
                                        onChange={handleChange} className="form-control nw-select-frm" placeholder="Enter Pharmacy Name " />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">GST Number</label>
                                    <input type="text" name="gstNumber"
                                        value={form.gstNumber}
                                        onChange={handleChange} className="form-control nw-select-frm" placeholder="Enter " />
                                    {errors.gstNumber && <small className="text-danger">{errors.gstNumber}</small>}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>About</label>
                                    <input type="text" className="form-control nw-select-frm" placeholder="Enter about pharmacy"
                                        name="about"
                                        value={form.about}
                                        onChange={handleChange} />
                                    {errors.about && <small className="text-danger">{errors.about}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mobile Number</label>
                                    <input type="number" className="form-control nw-select-frm" placeholder="Enter  mobile number "
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
                                        onChange={handleChange} type="email" className="form-control nw-select-frm" placeholder="Enter  Email " />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency contact person name</label>
                                    <input name="contact.emergencyContactName"
                                        value={form.emergencyContactName}
                                        onChange={handleChange} type="text" className="form-control nw-select-frm" placeholder="Emergency contact person name" />
                                    {errors.emergencyContactName && <small className="text-danger">{errors.emergencyContactName}</small>}

                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Emergency Contact Phone</label>
                                    <input name="contact.emergencyContactNumber"
                                        value={form?.contact?.emergencyContactNumber}
                                        onChange={handleChange} type="number" className="form-control nw-select-frm" placeholder="Enter  Emergency Contact Phone" />
                                    {errors.emergencyContactNumber && <small className="text-danger">{errors.emergencyContactNumber}</small>}

                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Address</label>
                                    <textarea name="fullAddress"
                                        value={form.fullAddress}
                                        onChange={handleChange} id="" className="form-control nw-select-frm"></textarea>
                                    {errors.fullAddress && <small className="text-danger">{errors.fullAddress}</small>}


                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Country</label>
                                    <div className="fieldmb-0  ">
                                        <select className="form-control nw-select-frm" value={form.countryId}
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
                                    <div className="field  mb-0  ">
                                        <select className="form-control nw-select-frm" value={form.stateId}
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
                                    <div className="field mb-0 ">
                                        <select className="form-control nw-select-frm" value={form.cityId}
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
                                    <input type="number" name="pinCode" value={form.pinCode} onChange={handleChange} className="form-control nw-select-frm" placeholder="Enter Pin code" />
                                    {errors.pinCode && <small className="text-danger">{errors.pinCode}</small>}

                                </div>
                            </div>


                        </div>

                        <div className="text-end mt-3">
                            <button className="nw-thm-btn" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
                        </div>

                    </form>
                </div>

            </div>

        </>
    )
}

export default AddPharmacy