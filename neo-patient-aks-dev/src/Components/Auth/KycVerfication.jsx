import {
    faChevronLeft,
    faContactBook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import base_url from "../../baseUrl";
function KycVerfication() {
    const [loading, setLoading] = useState(false)
    const patientId = localStorage.getItem('patientId')
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [errors,setErrors]=useState({})
    const [kycForm, setKycForm] = useState({ type: "", frontImage: null, backImage: null })
    const onDropFront = useCallback((acceptedFiles) => {
        setKycForm((prev) => ({
            ...prev,
            frontImage: acceptedFiles[0],
        }));
    }, []);

    const onDropBack = useCallback((acceptedFiles) => {
        setKycForm((prev) => ({
            ...prev,
            backImage: acceptedFiles[0],
        }));
    }, []);

    const {
        getRootProps: getFrontRootProps,
        getInputProps: getFrontInputProps,
        isDragActive: isFrontDragActive,
    } = useDropzone({
        onDrop: onDropFront,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "application/pdf": [],
        },
        maxFiles: 1,
    });

    const {
        getRootProps: getBackRootProps,
        getInputProps: getBackInputProps,
        isDragActive: isBackDragActive,
    } = useDropzone({
        onDrop: onDropBack,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "application/pdf": [],
        },
        maxFiles: 1,
    });
    const validate = () => {
        let temp = {};

        if (!kycForm?.type?.trim()) temp.type = "Id type is required";
        if (!kycForm?.frontImage) temp.frontImage = "Front Image is required";
        if (!kycForm?.backImage) temp.backImage = "Front Image is required";


        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return;
        const data = new FormData()
        setLoading(true)
        data.append('type', kycForm.type)
        data.append('userId', userId)
        data.append('frontImage', kycForm.frontImage)
        data.append('backImage', kycForm.backImage)
        try {
            const response = await securePostData('patient/kyc', data)
            if (response.success) {
                toast.success("Kyc records sent")
                navigate('/personal-info')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    async function fetchUserKyc() {
        const result = await getSecureApiData(`patient/kyc/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data
            setKycForm({
                ...kycForm,
                type: data.type, frontImage: data.frontImage, backImage: data?.backImage
            })
        }
    }
    useEffect(() => {
        if (userId) {
            fetchUserKyc()
        }
    }, [userId])
    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    {/* <div className="position-relative">
                                        <Link to='/create-account' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div> */}

                                    <img src="new-login-bnnr.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12">

                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-3">
                                        <h3 className="heading-grad">KYC Verification</h3>
                                        <p className="py-1">Choose an ID you have handy for verification.</p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="custom-frm-bx">
                                            <label>Select Govt ID</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faContactBook} /> </span>
                                                <select className="nw-select" required value={kycForm.type} onChange={(e) => setKycForm({ ...kycForm, type: e.target.value })}>
                                                    <option>--Select--</option>
                                                    <option value="Aadhar">Aadhar</option>
                                                    <option value="Pan">Pan</option>
                                                    <option value="Passport">Passport</option>
                                                    <option value="Voter Id">Voter Id</option>
                                                </select>
                                            </div>
                                            {errors?.type && <small className="text-danger">{errors?.type}</small>}
                                        </div>

                                        <div className="row">
                                            <div className="custom-frm-bx mb-0">
                                                <label>Upload ID</label>
                                            </div>

                                            {/* Front Image */}
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <div
                                                        {...getFrontRootProps()}
                                                        className={`upload-box nw-upload-bx p-3 text-center ${isFrontDragActive ? "border-primary" : ""
                                                            }`}
                                                    >
                                                        <input {...getFrontInputProps()} />

                                                        <div className="upload-icon">
                                                            <IoCloudUploadOutline />
                                                        </div>

                                                        <p className="fw-semibold mb-0">
                                                            {isFrontDragActive
                                                                ? "Drop file here..."
                                                                : "Drop a file here"}
                                                        </p>

                                                        <small className="format-title">
                                                            File Support JPEG, PNG, PDF
                                                        </small>

                                                        <div className="mt-2 browse-btn">
                                                            Upload front image
                                                        </div>

                                                        {kycForm.frontImage && (
                                                            <div className="mt-3">
                                                                <p className="mb-1">
                                                                    {kycForm.frontImage.name || "Uploaded Image"}
                                                                </p>

                                                                <img
                                                                    src={
                                                                        kycForm.frontImage instanceof File
                                                                            ? URL.createObjectURL(kycForm.frontImage)
                                                                            : `${base_url}/${kycForm.frontImage}`
                                                                    }
                                                                    alt="Front Preview"
                                                                    className="kyc-picture"
                                                                    
                                                                />
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                                {errors?.frontImage && <small className="text-danger">{errors?.frontImage}</small>}
                                            </div>

                                            {/* Back Image */}
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <div className="custom-frm-bx">
                                                    <div
                                                        {...getBackRootProps()}
                                                        className={`upload-box nw-upload-bx p-3 text-center ${isBackDragActive ? "border-primary" : ""
                                                            }`}
                                                    >
                                                        <input {...getBackInputProps()} />

                                                        <div className="upload-icon">
                                                            <IoCloudUploadOutline />
                                                        </div>

                                                        <p className="fw-semibold mb-0">
                                                            {isBackDragActive
                                                                ? "Drop file here..."
                                                                : "Drop a file here"}
                                                        </p>

                                                        <small className="format-title">
                                                            File Support JPEG, PNG, PDF
                                                        </small>

                                                        <div className="mt-2 browse-btn">
                                                            Upload back image
                                                        </div>

                                                        {kycForm.backImage && (
                                                            <div className="mt-3">
                                                                <p className="mb-1">
                                                                    {kycForm.backImage.name || "Uploaded Image"}
                                                                </p>

                                                                <img
                                                                    src={
                                                                        kycForm.backImage instanceof File
                                                                            ? URL.createObjectURL(kycForm.backImage)
                                                                            : `${base_url}/${kycForm.backImage}`
                                                                    }
                                                                    alt="Back Preview"
                                                                    className="kyc-picture"
                                                                   
                                                                />
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                                {errors?.backImage && <small className="text-danger">{errors?.backImage}</small>}
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center">
                                            <button className="nw-thm-btn w-100" type="submit">Submit</button>
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

export default KycVerfication