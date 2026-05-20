import {
    faBuilding,
    faBuildingFlag,
    faChevronLeft,
    faClinicMedical,
    faDollarSign,
    faEarth,
    faHospital,
    faLanguage,
    faLocationDot,
    faRupeeSign,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { languageOptions, specialtyOptions } from "../../Services/globalFunction";
import Select from "react-select";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

function DoctorAddressAbout() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [hospitalOptions, setHospitalOptions] = useState([])
    const [formData, setFormData] = useState({
        hospitalName: "",
        countryId: "",
        stateId: "",
        cityId: "",
        pinCode: "",
        specialty: "",
        treatmentAreas: [""],
        fees: "",
        language: [""],
        lat: null,
        long: null,
        aboutYou: "",
        fullAddress: "",
        clinic: false,
        userId
    });
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
    async function fetchSpecialityData() {
        const result = await getApiData(`admin/speciality`)
        if (result.success) {
            setSpecialities(result.data)
        }
    }

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
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};
        if (!formData?.hospitalName?.trim())
            temp.hospitalName = "Hospital name is required";
        if (!formData?.specialty?.trim())
            temp.specialty = "Speciality is required";
        if (!formData?.language[0]?.trim())
            temp.language = "Please choose at least one language.";
        if (!formData?.treatmentAreas[0]?.trim())
            temp.treatmentAreas = "Please choose at least one treatment area ";
        if (!formData?.fees?.trim())
            temp.fees = "Fees is required";
        if (!formData?.countryId?.trim())
            temp.country = "Country is required";
        if (!formData?.stateId?.trim())
            temp.state = "State is required";
        if (!formData?.cityId?.trim())
            temp.city = "City is required";
        if (!formData?.pinCode?.trim())
            temp.pinCode = "Pin code is required";
        if (!formData?.fullAddress?.trim())
            temp.fullAddress = "Address is required";
        if (!formData?.aboutYou?.trim())
            temp.aboutYou = "About is required";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return
        setLoading(true)
        try {
            const response = await securePostData('doctor/about', formData)
            if (response.success) {
                toast.success('Records saved')
                navigate('/clinic')
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    };
    async function fetchAboutData() {
        setLoading(true)
        const result = await getSecureApiData(`doctor/about/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data
            fetchStates(data?.countryId?.isoCode)
            fetchCities(data?.stateId?.isoCode)

            setFormData(prev => ({
                ...prev, // preserve existing lat/long
                ...data, // update data from API
                countryId: data?.countryId?._id,
                stateId: data?.stateId?._id,
                cityId: data?.cityId?._id
            }));

        } setLoading(false)
    }
    useEffect(() => {
        if (userId) {
            fetchAboutData()
        }
    }, [userId])
    const treatmentOptions = specialities?.map(item => ({
        value: item._id,
        label: item.name
    }));

    const treatmentValue =
        treatmentOptions?.filter(opt =>
            formData.treatmentAreas.includes(opt.value)
        );
    const language = formData.language[0] !== '' && formData.language?.map(area => ({
        value: area,
        label: area
    }));

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }));
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, []);

    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to="/medical-license" className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="/doctor-pic.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 py-lg-3 py-sm-0 ">
                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-2">
                                        <h3 className="heading-grad">Address & About you</h3>

                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">

                                                <label htmlFor="">Organization / Hospital Name</label>
                                                <input type="text" name="hospitalName" value={formData?.hospitalName} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Organization / Hospital Name" />

                                                <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faHospital} /> </span>
                                                </div>
                                            </div>
                                            {errors.hospitalName && <small className="text-danger">{errors.hospitalName}</small>}
                                        </div>

                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">

                                                <label htmlFor="">Full Address</label>
                                                <input type="text" name="fullAddress" value={formData?.fullAddress} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Full Address" />
                                                <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLocationDot} /> </span>
                                                </div>
                                            </div>
                                            {errors.fullAddress && <small className="text-danger">{errors.fullAddress}</small>}
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Country</label>


                                                    <div className="select-gradient-wrapper">
                                                        <select name="countryId" value={formData.countryId} onChange={handleChange} id="" className="form-select gradient-select">
                                                        <option value="">---Select Country---</option>
                                                        {countries?.map((item, key) =>
                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                    </select>
                                                     <span><i class="fa-solid fa-chevron-down select-icon"></i></span>

                                                    </div>

                                                    

                                                    {errors.country && <small className="text-danger">{errors.country}</small>}
                                                    {/* <input type="text" className="form-control new-control-frm px-5" placeholder="Enter Country" /> */}
                                                    {/* <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faEarth} /> </span>
                                                </div> */}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">State</label>
                                                   <div className="select-gradient-wrapper">
                                                     <select name="stateId" value={formData.stateId} onChange={handleChange} id="" className="form-select gradient-select">
                                                        <option value="">---Select State---</option>
                                                        {states?.map((item, key) =>
                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                    </select>

                                                     <span><i class="fa-solid fa-chevron-down select-icon"></i></span>

                                                   </div>
                                                    {errors.state && <small className="text-danger">{errors.state}</small>}
                                                    {/* <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faBuilding} /> </span>
                                                </div> */}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">City</label>

                                                    <div className="select-gradient-wrapper">
                                                        <select name="cityId" value={formData.cityId} onChange={handleChange} id="" className="form-select gradient-select">
                                                        <option value="">---Select City---</option>
                                                        {cities?.map((item, key) =>
                                                            <option value={item?._id} key={key}>{item?.name}</option>)}
                                                    </select>


                                                     <span><i class="fa-solid fa-chevron-down select-icon"></i></span>
                                                       

                                                    </div>

                                                    
                                                    {errors.city && <small className="text-danger">{errors.city}</small>}
                                                    {/* <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faBuildingFlag} /> </span>
                                                </div> */}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <div className="custom-frm-bx mb-0">
                                                        <label htmlFor="">Pin code</label>
                                                        <input type="number" name="pinCode" value={formData?.pinCode} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Pin Code" />
                                                        <div className="contact-add-icon">
                                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faLocationDot} /> </span>
                                                        </div>
                                                    </div>
                                                    {errors.pinCode && <small className="text-danger">{errors.pinCode}</small>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="custom-frm-bx">
                                            <label>Specialty</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUser} /> </span>
                                                <select className="nw-select" name="specialty" value={formData.specialty} onChange={handleChange}>
                                                    <option>--Select--</option>
                                                    {specialities?.map((item, key) =>
                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                </select>
                                            </div>
                                            {errors.specialty && <small className="text-danger">{errors.specialty}</small>}
                                        </div>
                                        <div className="custom-frm-bx">
                                            <label>Treatment Areas</label>
                                            <div className="react-select-wrapper">
                                                <Select
                                                    options={treatmentOptions}
                                                    isMulti

                                                    name="treatMent"
                                                    value={treatmentValue}
                                                    classNamePrefix="custom-select"
                                                    placeholder="Select areas(s)"
                                                    onChange={(selectedOptions) => {
                                                        // selectedOptions is an array of { value, label }
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            treatmentAreas: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            {errors.treatmentAreas && <small className="text-danger">{errors.treatmentAreas}</small>}
                                        </div>



                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">

                                                <label htmlFor="">Fees(₹)</label>
                                                <input type="number" name="fees" value={formData?.fees} onChange={handleChange} className="form-control new-control-frm px-5" placeholder="Enter Fees" />
                                                <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faRupeeSign} /> </span>
                                                </div>
                                            </div>
                                            {errors.fees && <small className="text-danger">{errors.fees}</small>}
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label>Languages</label>

                                            <div className="react-select-wrapper">

                                                <Select
                                                    options={languageOptions}
                                                    isMulti

                                                    name="language"
                                                    value={language}
                                                    classNamePrefix="custom-select"
                                                    placeholder="Select language(s)"
                                                    onChange={(selectedOptions) => {
                                                        // selectedOptions is an array of { value, label }
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            language: selectedOptions ? selectedOptions.map(opt => opt.value) : []
                                                        }));
                                                    }}
                                                />
                                            </div>

                                            {errors.language && <small className="text-danger">{errors.language}</small>}
                                        </div>


                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">

                                                <label htmlFor="">About You</label>
                                                <textarea name="aboutYou" value={formData?.aboutYou} onChange={handleChange} id="" className="form-control new-control-frm"></textarea>
                                            </div>
                                            {errors.aboutYou && <small className="text-danger">{errors.aboutYou}</small>}
                                        </div>
                                        <div className="custom-frm-bx">
                                            <label>You have clinic ?</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faClinicMedical} /> </span>
                                                <select required className="nw-select" name="clinic" value={formData.clinic} onChange={handleChange}>
                                                    {/* <option>--Select--</option> */}
                                                    <option value={true}>Yes</option>
                                                    <option value={false}>No</option>

                                                </select>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <button type="submit" className="nw-thm-btn w-100">Continue</button>
                                        </div>



                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}



        </>
    )
}

export default DoctorAddressAbout