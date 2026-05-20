import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCopy,
    faFilePdf,
    faImage,
    faPen,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchUserDetail } from "../../redux/feature/userSlice";
import { getApiData, postApiData, securePostData } from "../../Services/api";
import base_url from "../../baseUrl";
import Loader from "../Layouts/Loader";
import Select from 'react-select'

function EditProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem("userId")
    const [catData, setCatData] = useState([])
    const { profiles, pharPerson, pharAddress, pharImg, customId,user,
        rating, avgRating, pharLicense, isRequest } = useSelector(state => state.user)

    //   Lab Data 
    const [pharData, setPharData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        gstNumber: "",
        about: "",
        logo: "",
        category: []
    });
    const pharChange = (e) => {
        const { type, name, value, files } = e.target;
        if (type === 'file') {
            setPharData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setPharData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const [logoPreview, setLogoPreview] = useState(null);
    const handleFilePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoPreview(null);
        }
    };

    // Submit form
    const pharSubmit = async (e) => {
        e.preventDefault();
        if (pharData.password !== pharData.confirmPassword) {
            toast.error("Password was not matched")
            return
        }
        const payload = new FormData();
        for (let key in pharData) {
            if (key == "category") {
                payload.append(key, JSON.stringify(pharData?.category))
            } else {

                payload.append(key, pharData[key]);
            }
        }
        payload.append('pharId', userId)
        try {
            const response = await postApiData('pharmacy', payload)
            if (response.success) {
                dispatch(fetchUserDetail())
                toast.success('Data updated successfully')
                // navigate('/create-account-image') 
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    };

    //   Lab Image 
    const [thumbnail, setThumbnail] = useState(null);
    const [pharImages, setPharImages] = useState([]);
    const [previewThumb, setPreviewThumb] = useState(null);
    const [previewPharImages, setPreviewPharImages] = useState([]);
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setPreviewThumb(URL.createObjectURL(file));
    };

    const handlePharImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 3); // max 3
        setPharImages(files);
        setPreviewPharImages(files.map(file => URL.createObjectURL(file)));
    };

    const imageSubmit = async (e) => {
        e.preventDefault()
        if (!thumbnail) return alert('Thumbnail required!');
        const formData = new FormData();
        formData.append('thumbnail', thumbnail);
        pharImages.forEach(file => formData.append('pharImg', file));
        formData.append('userId', localStorage.getItem('userId'));

        try {
            const res = await securePostData('pharmacy/image', formData);
            if (res.success) {
                setPreviewPharImages([])
                setPreviewThumb(null)
                dispatch(fetchUserDetail())
                toast.success("Images saved successfully")
                // navigate('/create-account-address')
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            console.error(error);
        }
    };
    //   Person 
    const [personData, setPersonData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        gender: "",
        about: "",
        photo: "",
        userId
    });
    const personChange = (e) => {
        const { type, name, value, files } = e.target;
        if (type === 'file') {
            setPersonData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setPersonData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const [photoPreview, setPhotoPreview] = useState(null);
    const handlePhotoPreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    };

    // Submit form
    const personSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        for (let key in personData) {
            if (key == 'photo') continue
            payload.append(key, personData[key]);
        }
        if (personData.photo) {
            payload.append('photo', personData.photo)
        }

        try {
            const response = await securePostData('pharmacy/person', payload)
            if (response.success) {
                toast.success('Contact person data saved successfully')
                // navigate('/create-account-upload')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    };
    //   Address
    const [addressData, setAddressData] = useState({
        fullAddress: "",
        countryId: "",
        stateId: "",
        cityId: "",
        pinCode: "",
        userId
    });
    const addressChange = (e) => {
        const { type, name, value, files } = e.target;
        if (type === 'file') {
            setAddressData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setAddressData(prev => ({
                ...prev,
                [name]: value
            }));
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
    const addressSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await securePostData('pharmacy/about', addressData)
            if (response.success) {
                toast.success('Address saved successfully')
                // navigate('/create-account-person')
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    };
    //   license 
    const [licenseData, setLicenseData] = useState({
        pharLicenseNumber: "",
        licenseFile: null,
        pharCert: [{ certName: "", certFile: null }]
    });
    const [certPreviews, setCertPreviews] = useState([]);
    const [licencePreview, setLicensePreview] = useState(null)
    const handleLicenseInput = (e) => {
        setLicenseData({ ...licenseData, pharLicenseNumber: e.target.value });
    };

    const handleLicenseFile = (e) => {
        setLicensePreview(URL.createObjectURL(e.target.files[0]))
        setLicenseData({ ...licenseData, licenseFile: e.target.files[0] });
    };

    // ⬆ Handle Certificate Inputs
    const handleCertChange = (key, e) => {
        const { name, value } = e.target;
        const list = [...licenseData.pharCert];
        list[key][name] = value;
        setLicenseData({ ...licenseData, pharCert: list });
    };

    const handleCertFile = (key, e) => {
        const file = e.target.files[0];

        // Update licenseData safely (immutable)
        const list = licenseData.pharCert.map((cert, index) => {
            if (index === key) {
                return { ...cert, certFile: file }; // create a new object
            }
            return cert;
        });
        setLicenseData({ ...licenseData, pharCert: list });

        // Update previews
        const previewList = [...certPreviews];
        previewList[key] = URL.createObjectURL(file);
        setCertPreviews(previewList);
    };



    // Add/Remove Certificates
    const addCertificate = () => {
        setLicenseData({
            ...licenseData,
            pharCert: [...licenseData.pharCert, { certName: "", certFile: null }]
        });
    };

    const removeCertificate = (key) => {
        const list = [...licenseData.pharCert];
        list.splice(key, 1);
        setLicenseData({ ...licenseData, pharCert: list });
    };
    const licenseSubmit = async (e) => {
        e.preventDefault();

        // --- Basic Validation ---
        if (!licenseData.pharLicenseNumber) {
            return alert("Please enter lab license number.");
        }

        if (!licenseData.licenseFile) {
            return alert("Please upload license file.");
        }

        for (let i = 0; i < licenseData.pharCert.length; i++) {
            const cert = licenseData.pharCert[i];
            if (!cert.certName) return alert(`Please enter certificate name for Certificate #${i + 1}`);
            if (!cert.certFile) return alert(`Please upload certificate file for Certificate #${i + 1}`);
        }

        // --- Create licenseData ---
        const dataToSend = new FormData();
        dataToSend.append("userId", userId);      // Make sure this exists
        dataToSend.append("pharLicenseNumber", licenseData.pharLicenseNumber);

        const certMeta = licenseData.pharCert.map(c => ({
            certName: c.certName,
            certFile: c.certFile instanceof File ? null : c.certFile // keep existing path
        }));
        dataToSend.append("pharCert", JSON.stringify(certMeta));
        licenseData.pharCert.forEach((item) => {
            if (item.certFile instanceof File) {
                dataToSend.append("certFiles", item.certFile);
            }
        });

        dataToSend.append("licenseFile", licenseData.licenseFile);
        try {
            const result = await securePostData("pharmacy/license", dataToSend);
            if (result.success) {
                toast.success("Lab license data saved successfully");
                dispatch(fetchUserDetail())
                setCertPreviews([])
            } else {
                toast.error(result.message);
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        dispatch(fetchUserDetail())
    }, [dispatch])

    useEffect(() => {
        if (profiles) {
            setPharData({
                ...profiles, category: profiles.category?.map(item => item._id) || []
            })
        }
        if (pharAddress) {
            fetchStates(pharAddress?.countryId?.isoCode)
            fetchCities(pharAddress?.stateId?.isoCode)
            setAddressData({ ...pharAddress, stateId: pharAddress?.stateId?._id, cityId: pharAddress?.cityId?._id, countryId: pharAddress?.countryId?._id })

        }
        if (pharImg) {
            setPharImages(pharImg)
            setThumbnail(pharImg.thumbnail)
        }
        if (pharLicense) {
            setLicenseData(pharLicense)
        }
        if (pharPerson) {
            setPersonData(pharPerson)
        }

    }, [profiles, pharAddress, pharImg, pharLicense, pharPerson])

    const handleDeleteImg = async (path, type) => {
        if (previewThumb) {
            setPharImages(pharImg)
            setPreviewThumb(null)
            return
        }
        const confirm = window.confirm('Are you sure')
        if (!confirm) {
            return
        }
        const data = { pharId: userId, path, type }
        try {
            const response = await securePostData('pharmacy/delete-image', data)
            if (response.success) {
                dispatch(fetchUserDetail())
                toast.success("Image deleted")
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const handleRemovePreview = (index) => {
        setPreviewPharImages(prev => prev?.filter((_, i) => i !== index));
        setPharImages(prev => ({
            ...prev,
            pharImg: prev.pharImg?.filter((_, i) => i !== index)
        }));
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
        getApiData('admin/pharmacy-category').then((res) => {
            const formattedData = res.data.map((item) => ({
                value: item._id,
                label: item.name
            }));

            setCatData(formattedData);
        });
    }, []);
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2">Edit Profile</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <NavLink to="/dashboard" className="breadcrumb-link">
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <NavLink to="/profile" className="breadcrumb-link">
                                                    Edit Profile
                                                </NavLink>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Profile
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lab-chart-crd">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="lab-tp-title patient-bio-tab">
                                    <div>
                                        <h6 className="mb-0 text-black fw-600 fz-22">Edit Profile</h6>
                                    </div>
                                </div>

                                <div className="patient-bio-tab patient-edit-bio-tab">
                                    <ul className="nav nav-tabs gap-3" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link active"
                                                id="home-tab"
                                                data-bs-toggle="tab"
                                                href="#home"
                                                role="tab"
                                            >
                                                Pharmacy Profile
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
                                                Pharmacy Images
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
                                                Pharmacy Address
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
                                                Upload License
                                            </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className="nav-link"
                                                id="person-tab"
                                                data-bs-toggle="tab"
                                                href="#person"
                                                role="tab"
                                            >
                                                Contact Person
                                            </a>
                                        </li>
                                    </ul>

                                    <div className="tab-content mt-4" id="myTabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="home"
                                            role="tabpanel"
                                        >
                                            <div className="sub-tab-brd">
                                                <form onSubmit={pharSubmit}>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="lab-profile-mega-bx ">
                                                                <div className="lab-profile-avatr-bx position-relative">
                                                                    <img
                                                                        src={
                                                                            pharData?.logo
                                                                                ? typeof pharData.logo === "string"
                                                                                    ? (pharData.logo.startsWith("uploads")
                                                                                        ? `${base_url}/${pharData.logo}`
                                                                                        : pharData.logo
                                                                                    )
                                                                                    : URL.createObjectURL(pharData.logo)
                                                                                : "/pharmacy-logo.png"
                                                                        }
                                                                        alt=""
                                                                        className="border"
                                                                    />

                                                                    <div className="lab-profile-edit-avatr">
                                                                        <a
                                                                            href="javascript:void(0)"
                                                                            className="edit-btn cursor-pointer"
                                                                        >
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </a>
                                                                    </div>

                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="lab-profile-file-input"
                                                                        name="logo"
                                                                        onChange={pharChange}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <h4 className="lg_title mb-0">{pharData?.name || "World Pharmacy"}</h4>
                                                                    <p className="first_para mb-0">ID : #{user?.nh12 || "94969548"}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Pharmacy Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    name="name"
                                                                    onChange={pharChange}
                                                                    value={pharData?.name}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Mobile Number</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control nw-frm-select"
                                                                    name="contactNumber"
                                                                    onChange={pharChange}
                                                                    value={pharData?.contactNumber}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Email</label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control nw-frm-select"
                                                                    name="email"
                                                                    onChange={pharChange}
                                                                    value={pharData?.email}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>GST Number</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    name="gstNumber"
                                                                    onChange={pharChange}
                                                                    value={pharData?.gstNumber}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Category</label>
                                                                <Select
                                                                    options={catData}
                                                                    isMulti
                                                                    value={catData.filter(option =>
                                                                        pharData.category?.includes(option.value)
                                                                    )}
                                                                    className="custom-select"
                                                                    placeholder="Select category..."
                                                                    onChange={(selectedOptions) => {
                                                                        const ids = selectedOptions.map((item) => item.value);
                                                                        setPharData({ ...pharData, category: ids });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12">
                                                            <div className="custom-frm-bx">
                                                                <label>About</label>
                                                                <textarea
                                                                    className="form-control nw-frm-select"
                                                                    name="about"
                                                                    onChange={pharChange}
                                                                    value={pharData?.about}
                                                                    required
                                                                ></textarea>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex justify-content-end gap-3">
                                                            <button type="button" onClick={() => navigate('/approve-profile')} className="nw-filtr-thm-btn outline">
                                                                Cancel
                                                            </button>
                                                            <button type="submit" className="nw-filtr-thm-btn">
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>

                                                {/* <form action="">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="lab-profile-mega-bx ">
                                                            <div className="lab-profile-avatr-bx position-relative">
                                                                <img src="/pharmacy-logo.png" alt="" className="border" />
                                                                <div className="lab-profile-edit-avatr">
                                                                    <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                                                        <FontAwesomeIcon icon={faPen} />
                                                                    </a>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept=""
                                                                    className="lab-profile-file-input"
                                                                />
                                                            </div>

                                                            <div>
                                                                <h4 className="lg_title ">World Pharmacy</h4>
                                                                <p className="first_para">ID : #94969548</p>
                                                            </div>



                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Pharmacy Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control nw-frm-select"
                                                                placeholder=""
                                                                value="World Pharmacy"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Mobile Number</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder=""
                                                                value="9665190183"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Email Number</label>
                                                            <input
                                                                type="email"
                                                                className="form-control nw-frm-select"
                                                                placeholder=""
                                                                value="advancelab68gmail.com "
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">Gst Number</label>
                                                            <input
                                                                type="number"
                                                                className="form-control nw-frm-select"
                                                                placeholder=""
                                                                value="9704789479247"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="custom-frm-bx">
                                                            <label htmlFor="">About</label>
                                                            <textarea name="" id="" className="form-control nw-frm-select" placeholder="Advance Lab Tech, a dedicated cardiologist, brings a wealth of experience to Golden Gate Cardiology Center in Golden Gate, "></textarea>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-end gap-3">
                                                        <button type="submit" className="nw-filtr-thm-btn outline">Cancel</button>
                                                        <button type="submit" className="nw-filtr-thm-btn">Save</button>
                                                    </div>


                                                </div>
                                            </form> */}
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="profile" role="tabpanel">
                                            <div className="sub-tab-brd lab-thumb-bx">
                                                <form onSubmit={imageSubmit}>
                                                    <div className="row justify-content-between">
                                                        <div className="col-lg-5 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Upload  Thumbnail image</label>
                                                                <div className="upload-box nw-upload-bx  p-3 justify-content-center">
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


                                                                        <div className="mt-3">
                                                                            <label htmlFor="fileInput1" className="browse-btn">
                                                                                Browse File
                                                                            </label>
                                                                        </div>

                                                                        <input
                                                                            type="file"
                                                                            className="d-none"
                                                                            id="fileInput1"
                                                                            name="thumbnail"
                                                                            onChange={handleThumbnailChange}
                                                                            accept=".png,jpg,.jpeg"
                                                                        />

                                                                        {previewThumb && <div id="filePreviewWrapper" className=" mt-3">
                                                                            <img src={previewThumb} alt="Preview" className="img-thumbnail" />
                                                                        </div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(pharImages?.thumbnail || pharImg?.thumbnail) && <div className="custom-frm-bx ">
                                                                <div className="form-control lablcense-frm-control align-content-center border-0">
                                                                    <div className="lablcense-bx">
                                                                        <div>
                                                                            <h6><FontAwesomeIcon icon={faImage} />
                                                                                {thumbnail?.name || pharImg?.thumbnail?.split("\\").pop().split("-").slice(1).join("-")}</h6>
                                                                        </div>
                                                                        <div className="">
                                                                            <button type="button" onClick={() => handleDeleteImg(pharImages.thumbnail, 'thumbnail')} className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                        </div>

                                                        <div className="col-lg-5 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Upload  Pharmacy images(max 3 images)</label>
                                                                <div className="upload-box p-3 nw-upload-bx   justify-content-center ">
                                                                    <div className="upload-icon mb-2">
                                                                        <IoCloudUploadOutline />
                                                                    </div>

                                                                    <div>
                                                                        <p className="fw-semibold mb-1">
                                                                            <label htmlFor="fileInput2" className="file-label file-select-label">
                                                                                Choose a file or drag & drop here
                                                                            </label>
                                                                        </p>

                                                                        <small className="format-title">JPEG Format</small>


                                                                        <div className="mt-3">
                                                                            <label htmlFor="fileInput2" className="browse-btn">
                                                                                Browse File
                                                                            </label>
                                                                        </div>

                                                                        <input
                                                                            type="file"
                                                                            className="d-none"
                                                                            id="fileInput2"
                                                                            name="pharImg"
                                                                            multiple
                                                                            disabled={pharImages?.pharImg?.length === 3}
                                                                            onChange={handlePharImagesChange}
                                                                            max={3 - pharImages?.pharImg?.length}
                                                                            accept=".png,.jpg,.jpeg"
                                                                        />

                                                                        <div id="filePreviewWrapper" className="d-none mt-3">
                                                                            <img src={previewPharImages} alt="Preview" className="img-thumbnail" />
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <ul>
                                                                {previewPharImages.map((src, idx) => (
                                                                    <div key={idx} style={{ display: "inline-block", position: "relative", marginRight: "10px" }}>
                                                                        <img
                                                                            src={src}
                                                                            alt={`Lab Preview ${idx}`}
                                                                            width={100}
                                                                            style={{ marginRight: '10px' }}
                                                                        />
                                                                        <button
                                                                            className="btn-close"
                                                                            type="button"
                                                                            onClick={() => handleRemovePreview(idx)}
                                                                            style={{ position: "absolute", top: 0, right: 0 }}
                                                                        ></button>
                                                                    </div>
                                                                ))}

                                                                {pharImg?.pharImg?.length > 0 && pharImg?.pharImg?.map((item, key) =>
                                                                    <li key={key}>
                                                                        <div className="custom-frm-bx ">
                                                                            <div className="form-control lablcense-frm-control align-content-center border-0">
                                                                                <div className="lablcense-bx">
                                                                                    <div>
                                                                                        <h6 ><FontAwesomeIcon icon={faImage} /> {item?.split("\\").pop().split("-").slice(1).join("-")}</h6>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <button type="button" onClick={() => handleDeleteImg(item, 'pharImg')} className="text-black"><FontAwesomeIcon icon={faTrash} /></button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>)}
                                                            </ul>

                                                        </div>

                                                        <div className="d-flex justify-content-end gap-3">
                                                            <button type="button" className="nw-filtr-thm-btn outline">Cancel</button>
                                                            <button type="submit" className="nw-filtr-thm-btn">Save</button>
                                                        </div>

                                                    </div>
                                                </form>

                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="contact" role="tabpanel">
                                            <div className="sub-tab-brd ">
                                                <form onSubmit={addressSubmit}>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Full Address</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    placeholder=""
                                                                    required
                                                                    name="fullAddress"
                                                                    onChange={addressChange}
                                                                    value={addressData?.fullAddress}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Country</label>
                                                                <select name="countryId" value={addressData.countryId} onChange={addressChange} id="" className="form-select nw-frm-select">
                                                                    <option value="">---Select Country---</option>
                                                                    {countries?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>

                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">State</label>
                                                                <select name="stateId" value={addressData.stateId} onChange={addressChange} id="" className="form-select nw-frm-select">
                                                                    <option value="">---Select State---</option>
                                                                    {states?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">City</label>
                                                                <select name="cityId" value={addressData.cityId} onChange={addressChange} id="" className="form-select nw-frm-select">
                                                                    <option value="">---Select City---</option>
                                                                    {cities?.map((item, key) =>
                                                                        <option value={item?._id} key={key}>{item?.name}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="custom-frm-bx">
                                                                <label htmlFor="">Pin Code</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    required
                                                                    name="pinCode"
                                                                    onChange={addressChange}
                                                                    value={addressData?.pinCode}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-end gap-3">
                                                            <button type="button" className="nw-filtr-thm-btn outline">Cancel</button>
                                                            <button type="submit" className="nw-filtr-thm-btn">Save</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="upload" role="tabpanel">

                                            <div className="sub-tab-brd lab-thumb-bx edit-thumb">
                                                <div className="mb-3">
                                                    <h5 className="fz-18">License</h5>
                                                    <div className="border border-black p-3">
                                                        <form onSubmit={licenseSubmit}>
                                                            <div className="row">

                                                                <div className="col-lg-5">
                                                                    <div className="custom-frm-bx">
                                                                        <label htmlFor="">Lab License Number</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control nw-frm-select"
                                                                            placeholder=""
                                                                            value={licenseData?.pharLicenseNumber}
                                                                            name="pharLicenseNumber"
                                                                            required
                                                                            onChange={handleLicenseInput}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-5">
                                                                    <div className="custom-frm-bx">
                                                                        <label htmlFor="">Upload License</label>
                                                                        <div className="upload-box p-3 nw-upload-bx  justify-content-center">
                                                                            <div className="upload-icon mb-2">
                                                                                {licencePreview ? <img style={{ borderRadius: '50%', objectFit: 'cover', height: '70px' }} src={licencePreview} /> : <IoCloudUploadOutline />}
                                                                            </div>

                                                                            <div>
                                                                                <p className="fw-semibold mb-1">
                                                                                    <label htmlFor="fileInput3" className="file-label file-select-label">
                                                                                        Choose a file or drag & drop here
                                                                                    </label>
                                                                                </p>

                                                                                <small className="format-title">JPEG Format</small>


                                                                                <div className="mt-3">
                                                                                    <label htmlFor="fileInput3" className="browse-btn">
                                                                                        Browse File
                                                                                    </label>
                                                                                </div>

                                                                                <input
                                                                                    type="file"
                                                                                    className="d-none"
                                                                                    id="fileInput3"
                                                                                    onChange={handleLicenseFile}
                                                                                    name="licenseFile"
                                                                                    accept=".png,.jpg,.jpeg"
                                                                                />

                                                                                {/* {licencePreview &&
                                                                            <div id="filePreviewWrapper position-relative display-inline" className=" mt-3">
                                                                                <img src={licencePreview} alt="Preview" className="img-thumbnail" />
                                                                                <button style={{ position: "absolute", top: 0, right: 0 }} onClick={()=>{setLicenseData({...licenseData,licenseFile:labLicense.licenceFile})
                                                                                    setLicensePreview(null)}} className="btn-close" type="button"></button>
                                                                            </div>} */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {!licencePreview && <div className="custom-frm-bx ">
                                                                        <div className="form-control lablcense-frm-control align-content-center border-0">
                                                                            <div className="lablcense-bx">
                                                                                <div>
                                                                                    <h6 ><FontAwesomeIcon icon={faImage} /> {pharLicense?.licenseFile.split("\\").pop().split("-").slice(1).join("-")}</h6>
                                                                                </div>
                                                                                <div className="">
                                                                                    <a href="javascript:void(0)" className="text-black"><FontAwesomeIcon icon={faTrash} /></a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <h5 className="fz-18 my-3">Certificate</h5>
                                                    <div className="border edit-licence-tp-box border-black p-3">
                                                        <form action="">
                                                            {licenseData?.pharCert?.length > 0 &&
                                                                licenseData?.pharCert?.map((item, key) =>
                                                                    <div className="row" key={key}>

                                                                        <div className="col-lg-5">
                                                                            <div className="custom-frm-bx">
                                                                                <label htmlFor="">Certified Name</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control nw-frm-select"
                                                                                    placeholder=""
                                                                                    value={item?.certName}
                                                                                    name="certName"
                                                                                    required
                                                                                    onChange={(e) => handleCertChange(key, e)}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-lg-5">
                                                                            <div className="custom-frm-bx">
                                                                                <label htmlFor="">Upload License</label>
                                                                                <div className="upload-box p-3 nw-upload-bx  justify-content-center">
                                                                                    <div className="upload-icon mb-2">
                                                                                        <IoCloudUploadOutline />

                                                                                    </div>

                                                                                    <div>
                                                                                        <p className="fw-semibold mb-1">
                                                                                            <label htmlFor={`certInput${key}`} className="file-label file-select-label">
                                                                                                Choose a file or drag & drop here
                                                                                            </label>
                                                                                        </p>

                                                                                        <small className="format-title">JPEG Format</small>


                                                                                        <div className="mt-3">
                                                                                            <label htmlFor={`certInput${key}`} className="browse-btn">
                                                                                                Browse File
                                                                                            </label>
                                                                                        </div>

                                                                                        <input
                                                                                            type="file"
                                                                                            className="d-none"
                                                                                            id={`certInput${key}`}
                                                                                            name="certFile"
                                                                                            required
                                                                                            onChange={(e) => handleCertFile(key, e)}
                                                                                            accept=".png,.jpg,.jpeg"
                                                                                        />

                                                                                        <div id="filePreviewWrapper" className="d-none mt-3">
                                                                                            <img src="" alt="Preview" className="img-thumbnail" />
                                                                                        </div>
                                                                                        {certPreviews[key] && (
                                                                                            <img
                                                                                                src={certPreviews[key]}
                                                                                                alt="Certificate Preview"
                                                                                                style={{ height: '70px', marginTop: '10px' }}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {item?.certFile && <div className="custom-frm-bx ">
                                                                                <div className="form-control lablcense-frm-control align-content-center border-0">
                                                                                    <div className="lablcense-bx">
                                                                                        <div>
                                                                                            <h6 ><FontAwesomeIcon icon={faImage} />
                                                                                                {item?.certFile instanceof File ? item?.certFile.name
                                                                                                    : item?.certFile?.split("\\").pop().split("-").slice(1).join("-")}</h6>
                                                                                        </div>
                                                                                        <div className="">
                                                                                            <a href="javascript:void(0)" className="text-black"><FontAwesomeIcon icon={faTrash} /></a>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>}
                                                                        </div>

                                                                        <div className="col-lg-2 d-flex align-items-center justify-content-end">
                                                                            <div className="d-flex flex-column">
                                                                                {licenseData.pharCert?.length !== 1 && <button type="button" onClick={() => removeCertificate(key)} className="text-danger"><FontAwesomeIcon icon={faTrash} /></button>}
                                                                                {key == licenseData.pharCert?.length - 1 && <button type="button" onClick={() => addCertificate()} className=""><FaPlusCircle style={{ color: "#34A853", fontSize: "20px" }} /></button>}
                                                                            </div>
                                                                        </div>

                                                                    </div>)}
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-end gap-3">
                                                    <button type="button" className="nw-filtr-thm-btn outline">Cancel</button>
                                                    <button type="button" onClick={(e) => licenseSubmit(e)} className="nw-filtr-thm-btn">Save</button>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="person" role="tabpanel">
                                            <div className="sub-tab-brd">
                                                <form onSubmit={personSubmit}>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="lab-profile-mega-bx">
                                                                <div className="lab-profile-avatr-bx lab-contact-prson position-relative rounded-circle">
                                                                    <img
                                                                        src={
                                                                            personData?.photo
                                                                                ? typeof personData.photo === "string"
                                                                                    ? (personData.photo.startsWith("uploads")
                                                                                        ? `${base_url}/${personData.photo}`
                                                                                        : personData.photo
                                                                                    )
                                                                                    : URL.createObjectURL(personData.photo)
                                                                                : "/user-avatar.png"
                                                                        }
                                                                        alt=""
                                                                    />

                                                                    <div className="lab-profile-edit-avatr">
                                                                        <a href="javascript:void(0)" className="edit-btn cursor-pointer">
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </a>
                                                                    </div>

                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        name="photo"
                                                                        onChange={personChange}
                                                                        className="lab-profile-file-input"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <h4 className="lg_title ">{personData?.name || "John Smith"}</h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    name="name"
                                                                    onChange={personChange}
                                                                    value={personData?.name}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Mobile Number</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control nw-frm-select"
                                                                    name="contactNumber"
                                                                    onChange={personChange}
                                                                    value={personData?.contactNumber}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Email</label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control nw-frm-select"
                                                                    name="email"
                                                                    onChange={personChange}
                                                                    value={personData?.email}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <label>Gender</label>
                                                                <select name="gender" value={personData.gender} required
                                                                    onChange={personChange} id="" className="form-select nw-frm-select">
                                                                    <option value="">---Select Gender---</option>

                                                                    <option value={"Male"} >Male</option>
                                                                    <option value={"Female"} >Female</option>
                                                                    <option value={"Other"} >Other</option>
                                                                </select>
                                                                {/* <input
                                                                    type="text"
                                                                    className="form-control nw-frm-select"
                                                                    name="gender"
                                                                    onChange={personChange}
                                                                    value={personData?.gender}
                                                                    required
                                                                /> */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-end gap-3">
                                                        <button type="button" className="nw-filtr-thm-btn outline">Cancel</button>
                                                        <button type="submit" className="nw-filtr-thm-btn" >
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

            {/*Edit Profile Popup Start  */}
            {/* data-bs-toggle="modal" data-bs-target="#edit-Request" */}
            {show && <div className="modal step-modal fade" id="edit-Request" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content edit-modal-content rounded-5 p-5">
                        {/* <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <button type="button" className="" data-bs-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                            </div>
                        </div> */}
                        <div className="modal-body p-0">
                            <div className="row justify-content-center">
                                <div className="col-lg-9">
                                    <div className="text-center your-document-mega-dv">
                                        <div className="submit-document-bx">
                                            <FontAwesomeIcon icon={faCopy} className="document-icon" />
                                            <div className="timr-bx">
                                                <img src="/timer.png" alt="" />
                                            </div>
                                        </div>

                                        <p className="mt-4">Your documents have been submitted for verification. This may take up to 48 hours. You’ll be notified once approved.</p>

                                        <div className="mt-5">
                                            <a href="javascript:void(0)" className="thm-btn w-75" data-bs-dismiss="modal">OK</a>
                                        </div>


                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {/*  Edit Profile Popup End */}

        </>
    )
}

export default EditProfile