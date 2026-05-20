import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { getApiData } from "../../Service/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail } from "../../redux/features/userSlice";

function CreateAccountAddress() {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [pin, setPin] = useState("");
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false)
    const [postLoading, setPostLoading] = useState(false)
    const { hospitalBasic, hospitalAddress, paymentInfo,
    } = useSelector(state => state.user)
    const dispatch=useDispatch()
    const [errors, setErrors] = useState({});

    // VALIDATION
    const validate = () => {
        let temp = {};
        if (!address.trim()) temp.address = "Address is required";
        if (!country.trim()) temp.country = "Country required";
        if (!state.trim()) temp.state = "State required";
        if (!city.trim()) temp.city = "City required";
        if (!pin.trim()) temp.pin = "Pin code required";

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const submitAddress = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const res = await API.post("/hospital/address", {
                fullAddress: address,
                country,
                state,
                city,
                pinCode: pin,
            });


            navigate("/create-account-person");
        } catch (err) {
            console.error(err.response?.data || err);
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
    useEffect(() => {
        if (hospitalAddress) {
            navigate('/create-account-person')
        }
    }, [hospitalAddress])
    useEffect(()=>{
        dispatch(fetchUserDetail())
    },[dispatch])
    return (
        <section className="admin-login-section account-lg-section nw-create-account-section">
            <div className="container-fluid px-lg-0">

                {/* Steps Header */}
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-8">
                        <div className="account-step-main-bx">

                            <NavLink to="#">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <FaFlask className="account-step-icon" />
                                    </div>
                                    <h6>Hospital Details</h6>
                                </div>
                            </NavLink>

                            <NavLink to="#">
                                <div className="account-step-crd account-step-one account-progress-done">
                                    <div className="account-step-bx account-step-complete">
                                        <BsFillFileImageFill className="account-step-icon" />
                                    </div>
                                    <h6>Images</h6>
                                </div>
                            </NavLink>

                            <NavLink to="#">
                                <div className="account-step-crd account-step-one">
                                    <div className="account-step-bx">
                                        <FaMapMarkerAlt className="account-step-icon" />
                                    </div>
                                    <h6>Address</h6>
                                </div>
                            </NavLink>

                            <NavLink to="#">
                                <div className="account-step-crd account-step-one ">
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

                {/* FORM */}
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8 col-sm-12">

                        <form onSubmit={submitAddress}>
                            <div className="nw-form-container">

                                <div className="admin-vndr-login">
                                    <h3>Hospital Address</h3>
                                    <p>Enter Hospital Address</p>
                                </div>

                                {/* Address */}
                                <div className="custom-frm-bx">
                                    <label>Full Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Full Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    {errors.address && <small className="text-danger">{errors.address}</small>}
                                </div>
                                
                                    {/* Country */}
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

                                    {/* State */}
                                    <div className="custom-frm-bx">
                                        <label>State</label>
                                        <select
                                            className="form-select"
                                            value={state}
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

                                    {/* City */}
                                    <div className="custom-frm-bx">
                                        <label>City</label>
                                        <select
                                            className="form-select"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="">---Select City---</option>
                                            {cities?.map((item, key) =>
                                                <option value={item?._id} key={key}>{item?.name}</option>)}
                                        </select>
                                        {errors.city && <small className="text-danger">{errors.city}</small>}
                                    </div>

                                    {/* Pin Code */}
                                    <div className="custom-frm-bx">
                                        <label>Pin Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Pin code"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                        />
                                        {errors.pin && <small className="text-danger">{errors.pin}</small>}
                                    </div>
                                

                                {/* NEXT BUTTON */}
                                <div className="d-flex flex-column gap-3 mt-4">
                                    <button type="submit" disabled={postLoading} className="admin-lg-btn w-100">
                                        {postLoading ? 'Submitting...' : 'Next'}
                                    </button>
                                    <Link
                                        className="nw-thm-btn outline rounded-3 w-100"
                                        to={'/create-account-person'}
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

export default CreateAccountAddress;
