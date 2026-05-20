import {
    faBuilding,
    faCalendar,
    faChevronLeft,
    faDroplet,
    faGlobe,
    faHome,
    faRulerVertical,
    faSatellite,
    faWeightScale,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

function PersonalInfo() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [formData, setFormData] = useState({
        height: "", weight: "", bloodGroup: "", dob: null
        , countryId: "", stateId: "", cityId: "", address: ""
    })
    const handleChange = (e) => {
        const { type, name, value, files } = e.target;
        setFormData(prev => ({
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
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};
        if (!formData?.height?.trim())
            temp.height = "Height is required";
        if (!formData?.weight?.trim())
            temp.weight = "Weight is required";
        if (!formData?.bloodGroup?.trim())
            temp.bloodGroup = "Blood group is required";
        if (!formData?.dob?.trim())
            temp.dob = "Dob is required";
        if (!formData?.countryId?.trim())
            temp.country = "Country is required";
        if (!formData?.stateId?.trim())
            temp.state = "State is required";
        if (!formData?.cityId?.trim())
            temp.city = "City is required";
        if (!formData?.address?.trim())
            temp.address = "Address is required";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        const data = { userId, ...formData }
        try {
            const response = await securePostData('patient/demographic', data)
            if (response.success) {
                toast.success('Records saved successfully')
                navigate('/medical-history')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
            console.error("Error creating lab:", err);
        } finally {
            setLoading(false)
        }
    };
    async function fetchUserProfile() {
        const result = await getSecureApiData(`patient/demographic/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data
            setFormData({
                ...data, dob: data.dob
                    ? new Date(data.dob).toISOString().split("T")[0]
                    : ""
            })
        }
    }
    useEffect(() => {
        if (userId) {
            fetchUserProfile()
        }
    }, [userId])
    useEffect(() => {
        fetchCountries()
    }, [])
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

    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to='/kyc' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="new-login-bnnr.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 py-lg-3 py-sm-0">
                                <div>
                                    <div className="nw-form-container">
                                        <div className="login-logo">
                                            <img src="/logo.png" alt="" />
                                        </div>

                                        <div className="admin-vndr-login my-2">
                                            <h3 className="heading-grad">Personal & Demographic Info</h3>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            {/* Height */}
                                            <div className="custom-frm-bx">
                                                <label>Height</label>
                                                <div className="custom-frm-bx mb-0">
                                                    <input
                                                        type="text"
                                                        name="height"

                                                        value={formData.height}
                                                        onChange={handleChange}
                                                        className="form-control new-control-frm px-5"
                                                        placeholder="Enter your height"
                                                    />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={faRulerVertical} />
                                                        </span>
                                                    </div>
                                                </div>
                                                {errors.height && <small className="text-danger">{errors.height}</small>}

                                            </div>

                                            {/* Weight */}
                                            <div className="custom-frm-bx">
                                                <label>Weight (Kg)</label>
                                                <div className="custom-frm-bx mb-0">

                                                    <input
                                                        type="number"
                                                        name="weight"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        className="form-control new-control-frm px-5"
                                                        placeholder="Enter your weight"
                                                    />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={faWeightScale} />
                                                        </span>
                                                    </div>
                                                </div>
                                                {errors.weight && <small className="text-danger">{errors.weight}</small>}
                                            </div>

                                            {/* Blood Group */}
                                            <div className="custom-frm-bx">
                                                <label>Blood Group</label>
                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm">
                                                    <span className="nw-contact-icon">
                                                        <FontAwesomeIcon icon={faDroplet} />
                                                    </span>
                                                    <select

                                                        name="bloodGroup"
                                                        value={formData.bloodGroup}
                                                        onChange={handleChange}
                                                        className="nw-select"
                                                    >
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
                                                {errors.bloodGroup && <small className="text-danger">{errors.bloodGroup}</small>}
                                            </div>

                                            {/* Date of Birth */}
                                            <div className="custom-frm-bx">
                                                <label>Date of Birth</label>
                                                <div className="custom-frm-bx mb-0">

                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        max={new Date().toISOString().split("T")[0]}
                                                        value={formData.dob}
                                                        onChange={handleChange}
                                                        className="form-control new-control-frm ps-5"
                                                    />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={faCalendar} />
                                                        </span>
                                                    </div>
                                                </div>
                                                {errors.dob && <small className="text-danger">{errors.dob}</small>}
                                            </div>
                                            {/* Country */}
                                            <div className="custom-frm-bx">
                                                <label>Country</label>
                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm">
                                                    <span className="nw-contact-icon">
                                                        <FontAwesomeIcon icon={faGlobe} />
                                                    </span>
                                                    <select
                                                        name="countryId"

                                                        value={formData.countryId}
                                                        onChange={handleChange}
                                                        className="nw-select"
                                                    >
                                                        <option value="">--Select--</option>
                                                        {countries?.map((item) => (
                                                            <option key={item._id} value={item._id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.country && <small className="text-danger">{errors.country}</small>}
                                            </div>
                                            {/* State */}
                                            <div className="custom-frm-bx">
                                                <label>State</label>
                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm">
                                                    <span className="nw-contact-icon">
                                                        <FontAwesomeIcon icon={faSatellite} />
                                                    </span>
                                                    <select
                                                        name="stateId"
                                                        value={formData.stateId}
                                                        onChange={handleChange}
                                                        className="nw-select"

                                                    >
                                                        <option value="">--Select--</option>
                                                        {states?.map((item) => (
                                                            <option key={item._id} value={item._id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.state && <small className="text-danger">{errors.state}</small>}
                                            </div>
                                            {/* City */}
                                            <div className="custom-frm-bx">
                                                <label>City </label>
                                                <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm">
                                                    <span className="nw-contact-icon">
                                                        <FontAwesomeIcon icon={faBuilding} />
                                                    </span>
                                                    <select

                                                        name="cityId"
                                                        value={formData.cityId}
                                                        onChange={handleChange}
                                                        className="nw-select"
                                                    >
                                                        <option value="">--Select--</option>
                                                        {cities?.map((item) => (
                                                            <option key={item._id} value={item._id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.city && <small className="text-danger">{errors.city}</small>}
                                            </div>

                                            <div className="custom-frm-bx">
                                                <label>Address</label>
                                                <div className="custom-frm-bx mb-0">
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="form-control new-control-frm px-5"
                                                        placeholder="Enter your address"
                                                    />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={faHome} />
                                                        </span>
                                                    </div>
                                                </div>
                                                {errors.address && <small className="text-danger">{errors.address}</small>}
                                            </div>

                                            {/* Submit */}
                                            <div className="mt-4 text-center">
                                                <button type="submit" className="nw-thm-btn w-100">
                                                    Submit & Next
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </>
    )
}

export default PersonalInfo