import {
    faBuilding,
    faBuildingFlag,
    faChevronLeft,
    faDollarSign,
    faDriversLicense,
    faEarth,
    faHospital,
    faLanguage,
    faLocationDot,
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
import base_url from "../../baseUrl";
import { IoCloudUploadOutline } from "react-icons/io5";

function DoctorClinic() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [hospitalOptions, setHospitalOptions] = useState([])
    const [formData, setFormData] = useState({
        clinicName: "",
        licenseImage: null,
        clinicImage: null,
        licenseNumber: "",
        userId
    });
    const handleChange = (e) => {
        const { type, name, value, files } = e.target;

        if (type === "file") {
            const file = files[0];

            if (!file) return;

            const preview = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null;

            setFormData((prev) => ({
                ...prev,
                [name]: {
                    file,
                    preview,
                    type: file.type,
                    name: file.name
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null;

        setFormData((prev) => ({
            ...prev,
            clinicImage: {
                file,
                preview,
                type: file.type,
                name: file.name
            }
        }));
    };

    const licenseDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null;

        setFormData((prev) => ({
            ...prev,
            licenseImage: {
                file,
                preview,
                type: file.type,
                name: file.name
            }
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const licenseDragOver = (e) => {
        e.preventDefault();
    };
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};
        if (!formData?.clinicName?.trim())
            temp.clinicName = "Clinic name is required";
        if (!formData?.licenseNumber?.trim())
            temp.licenseNumber = "License number is required";
        if (!formData?.clinicImage)
            temp.clinicImage = "Please upload clinic image.";
        if (!formData?.licenseImage)
            temp.licenseImage = "Please upload license image.";
        ;
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        const data = new FormData()
        data.append('clinicName', formData.clinicName)
        data.append('licenseNumber', formData.licenseNumber)
        data.append("clinicImage", formData.clinicImage.file)
        data.append("licenseImage", formData.licenseImage.file)
        data.append("userId", userId)
        try {
            const response = await securePostData('doctor/clinic', data)
            if (response.success) {
                toast.success('Records saved')
                navigate('/kyc-message')
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    };
    async function fetchClinicData() {
        setLoading(true)
        const result = await getSecureApiData(`doctor/clinic/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data

            setFormData(prev => ({
                ...prev, // preserve existing lat/long
                ...data, // update data from API
            }));

        } setLoading(false)
    }
    useEffect(() => {
        if (userId) {
            fetchClinicData()
        }
    }, [userId])

    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row ">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to="/address-about" className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="/doctor-pic.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12  align-content-center py-lg-3 py-sm-0">
                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-2">
                                        <h3 className="heading-grad">Clinic Details</h3>

                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">
                                                <label htmlFor="">Clinic Name</label>
                                                <input type="text" name="clinicName" value={formData?.clinicName}
                                                    onChange={handleChange} className="form-control new-control-frm px-5"
                                                    placeholder="Enter Clinic Name" />

                                                <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faHospital} /> </span>
                                                </div>
                                            </div>
                                            {errors.clinicName && <small className="text-danger">{errors.clinicName}</small>}
                                        </div>
                                        <div className="custom-frm-bx">
                                            <div className="custom-frm-bx mb-0">
                                                <label htmlFor="">License Number</label>
                                                <input type="text" name="licenseNumber" value={formData?.licenseNumber} onChange={handleChange}
                                                    className="form-control new-control-frm px-5" placeholder="Enter License Number" />
                                                <div className="contact-add-icon">
                                                    <span className="nw-contact-icon"> <FontAwesomeIcon icon={faDriversLicense} /> </span>
                                                </div>
                                            </div>
                                            {errors.licenseNumber && <small className="text-danger">{errors.licenseNumber}</small>}
                                        </div>
                                        <div className="custom-frm-bx">
                                            <label>Upload Clinic License </label>
                                            <div className="upload-box nw-upload-bx p-3 text-center" onDrop={(e) => licenseDrop(e)}
                                                onDragOver={licenseDragOver}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="upload-icon">
                                                            <IoCloudUploadOutline />
                                                        </div>
                                                        <div className="text-start">
                                                            <p className="fw-semibold mb-0">
                                                                <label
                                                                    htmlFor="licenseImage"
                                                                    className=" fw-600 fz-16 mb-0"
                                                                >
                                                                    Drop a file here
                                                                </label>
                                                            </p>
                                                            <small className="format-title">
                                                                File Support JPEG, PDF
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2">
                                                        <label
                                                            htmlFor="licenseImage"
                                                            className="browse-btn"
                                                        >
                                                            Browse
                                                        </label>
                                                    </div>
                                                </div>

                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    id="licenseImage"
                                                    name="licenseImage"
                                                    accept=".png,.jpg,.jpeg,.pdf"
                                                    onChange={handleChange}
                                                />


                                                {formData?.licenseImage && (
                                                    <div className="mt-3 text-center">
                                                        {formData.licenseImage.type === "application/pdf" ? (
                                                            <p className="mb-0 fw-semibold">
                                                                📄 {formData.licenseImage.name}
                                                            </p>
                                                        ) : (
                                                            formData.licenseImage.preview && (
                                                                <img
                                                                    src={formData.licenseImage.preview}
                                                                    alt="Uploaded"
                                                                    className="clinic-pic"
                                                                   
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                            {errors.licenseImage && <small className="text-danger">{errors.licenseImage}</small>}
                                        </div>
                                        <div className="custom-frm-bx">
                                            <label>Upload Clinic Imgae </label>
                                            <div className="upload-box nw-upload-bx p-3 text-center" onDrop={(e) => handleDrop(e)}
                                                onDragOver={handleDragOver}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="upload-icon">
                                                            <IoCloudUploadOutline />
                                                        </div>
                                                        <div className="text-start">
                                                            <p className="fw-semibold mb-0">
                                                                <label
                                                                    htmlFor="clinicImage"
                                                                    className=" fw-600 fz-16 mb-0"
                                                                >
                                                                    Drop a file here
                                                                </label>
                                                            </p>
                                                            <small className="format-title">
                                                                File Support JPEG, PDF
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2">
                                                        <label
                                                            htmlFor="clinicImage"
                                                            className="browse-btn"
                                                        >
                                                            Browse
                                                        </label>
                                                    </div>
                                                </div>

                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    id="clinicImage"
                                                    name="clinicImage"
                                                    accept=".png,.jpg,.jpeg"
                                                    onChange={handleChange}
                                                />


                                                {formData?.clinicImage && (
                                                    <div className="mt-3 text-center">
                                                        {formData.clinicImage.type === "application/pdf" ? (
                                                            <p className="mb-0 fw-semibold">
                                                                📄 {formData.clinicImage.name}
                                                            </p>
                                                        ) : (
                                                            formData.clinicImage.preview && (
                                                                <img
                                                                    src={formData.clinicImage.preview}
                                                                    alt="Uploaded"
                                                                    className="clinic-pic"
                                                                   
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                            {errors.clinicImage && <small className="text-danger">{errors.clinicImage}</small>}
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

export default DoctorClinic