import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFilePdf,
  faImage,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { getApiData, securePostData } from "../../Service/api";
import base_url from "../../baseUrl";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Common/Loader";
import { fetchUserDetail } from "../../redux/features/userSlice";
import Select from 'react-select'
function EditProfile() {
  /* ================================
      REFS
  ================================ */
  const navigate = useNavigate()
  const { dispatch } = useDispatch()
  const fileThumbRef = useRef(null);
  const fileGalleryRef = useRef(null);
  const contactPhotoRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [category, setCategory] = useState([])
  const [catData, setCatData] = useState([])
  const [cities, setCities] = useState([])
  const { hospitalBasic, user } = useSelector(state => state.user)

  /* ================================
      LOADING & PROFILE
  ================================ */
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  /* ================================
      BASIC FORM
  ================================ */
  const [basicForm, setBasicForm] = useState({
    hospitalName: "",
    licenseId: "",
    establishedYear: "",
    mobileNo: "",
    email: "",
    gstNumber: "",
    about: "",
    logo: null,
    category: []
  });

  /* ================================
      IMAGES FORM
  ================================ */
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [markedRemoveImageIds, setMarkedRemoveImageIds] = useState([]);

  /* ================================
      ADDRESS FORM
  ================================ */
  const [addressForm, setAddressForm] = useState({
    fullAddress: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
  });

  /* ================================
      CERTIFICATES (Option B)
  ================================ */
  const [licenseCert, setLicenseCert] = useState({
    licenseNumber: "",
    file: null,

    regNumber: "",
    regFile: null,

    accrNumber: "",
    accrFile: null,
  });

  const [extraCerts, setExtraCerts] = useState([]);

  const addRow = () => {
    setExtraCerts((prev) => [
      ...prev,
      { id: Date.now(), title: "", file: null },
    ]);
  };

  const removeRow = (id) => {
    setExtraCerts((prev) => prev.filter((x) => x.id !== id));
  };

  const updateRow = (id, key, value) => {
    setExtraCerts((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [key]: value } : x))
    );
  };
  useEffect(() => {
    if (localStorage.getItem('doctorId')) {
      navigate('/dashboard')
    }
  }, [])

  /* ================================
      CONTACT PERSON
  ================================ */
  const [contactForm, setContactForm] = useState({
    name: "",
    mobileNo: "",
    email: "",
    gender: "",
    profileFile: null,
    preview: null,
  });

  const handleContactPhoto = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setContactForm((p) => ({ ...p, profileFile: file, preview: url }));
  };

  /* ================================
      COMMON
  ================================ */
  const [saving, setSaving] = useState(false);

  /* ================================
      LOAD PROFILE FROM SERVER
  ================================ */
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await API.get("/hospital/get-hospital-profile");

      const data = res.data.profile;
      setProfile(data);
      console.log("data", data)

      /* ----- BASIC ----- */
      setBasicForm({
        hospitalName: data?.basic?.hospitalName || "",
        licenseId: data?.basic?.licenseId || "",
        establishedYear: data?.basic?.establishedYear || "",
        mobileNo: data?.basic?.mobileNo || "",
        email: data?.basic?.email || "",
        gstNumber: data?.basic?.gstNumber || "",
        about: data?.basic?.about || "",
        logo: data?.images?.logo?.[0]?.url || null,
        category: data?.basic?.category || [],
      });

      /* ----- IMAGES ----- */
      setThumbnailPreview(data?.images?.thumbnail?.[0]?.url || null);
      setGalleryPreviews((data?.images?.gallery || []).map((x) => x.url));

      /* ----- ADDRESS ----- */
      setAddressForm({
        fullAddress: data?.address?.fullAddress || "",
        country: data?.address?.country?._id || "",
        state: data?.address?.state?._id || "",
        city: data?.address?.city?._id || "",
        pinCode: data?.address?.pinCode || "",
      });
      fetchStates(data?.address?.country?.isoCode)
      fetchCities(data?.address?.state?.isoCode)

      /* ----- CONTACT ----- */
      setContactForm({
        name: data?.contact?.name || "",
        mobileNo: data?.contact?.mobileNumber || "",
        email: data?.contact?.email || "",
        gender: data?.contact?.gender || "",
        preview: data?.contact?.profilePhotoUrl
          ? data?.contact?.profilePhotoUrl
          : "/user-avatar.png",
        profileFile: null,
      });

      /* ----- CERTIFICATES (prefill fixed) ----- */
      const certs = data?.certificates || [];

      const hospital = certs.find((c) => c.certificateType === "hospital_license");
      const registration = certs.find((c) => c.certificateType === "registration");
      const accred = certs.find((c) => c.certificateType === "accreditation");

      setLicenseCert({
        licenseNumber: hospital?.licenseNumber || "",
        file: null,

        regNumber: registration?.licenseNumber || "",
        regFile: null,

        accrNumber: accred?.licenseNumber || "",
        accrFile: null,
      });

      /* ----- Extra certs ----- */
      const extras = certs.filter((c) => c.certificateType === "extra_certificate");
      setExtraCerts(
        extras.map((x) => ({
          id: x._id,
          title: x.licenseNumber,
          file: null,
          existingUrl: x.url,
        }))
      );

      setPaymentForm({
        ...paymentForm,
        bankName: data?.paymentInfo?.bankName || "",
        ifscCode: data?.paymentInfo?.ifscCode || "",
        accountNumber: data?.paymentInfo?.accountNumber || "",
        accountHolderName: data?.paymentInfo?.accountHolderName || "",
        branch: data?.paymentInfo?.branch || "",
        qr: data?.paymentInfo?.qr || ""
      })
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
        SUBMIT: BASIC
  =================================================== */
  const submitBasic = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.append('hospitalName', basicForm.hospitalName)
    data.append('licenseId', basicForm.licenseId)
    data.append('establishedYear', basicForm.establishedYear)
    data.append('mobileNo', basicForm.mobileNo)
    data.append('email', basicForm.email)
    data.append('gstNumber', basicForm.gstNumber)
    data.append('about', basicForm.about)
    data.append('category', basicForm.category)
    if (basicForm.logo instanceof File) {
      data.append('logo', basicForm.logo)
    }
    try {
      setSaving(true);
      const res = await API.post("/hospital/basic", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        toast.success("Basic details updated");
        loadProfile();
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===================================================
        SUBMIT: IMAGES
  =================================================== */
  const submitImages = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();

      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
      galleryFiles.forEach((f) => fd.append("gallery", f));

      if (markedRemoveImageIds.length > 0)
        fd.append("removeImageIds", JSON.stringify(markedRemoveImageIds));

      await API.post("/hospital/images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Images updated");
      loadProfile();

      setGalleryFiles([]);
      setThumbnailFile(null);
      setMarkedRemoveImageIds([]);
    } catch (err) {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===================================================
        SUBMIT: ADDRESS
  =================================================== */
  const submitAddress = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await API.post("/hospital/address", addressForm);
      toast.success("Address saved");
      loadProfile();
    } catch (err) {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===================================================
        SUBMIT: CERTIFICATES (Option B)
  =================================================== */
  const submitCertificates = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const upload = async (number, file, type) => {
        const fd = new FormData();
        fd.append("licenseNumber", number);
        fd.append("certificateType", type);
        if (file) fd.append("file", file);

        await API.post("/hospital/certificate", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      };

      await upload(licenseCert.licenseNumber, licenseCert.file, "hospital_license");
      await upload(licenseCert.regNumber, licenseCert.regFile, "registration");
      await upload(licenseCert.accrNumber, licenseCert.accrFile, "accreditation");

      for (let row of extraCerts) {
        if (row.file) {
          const fd = new FormData();
          fd.append("licenseNumber", row.title);
          fd.append("certificateType", "extra_certificate");
          fd.append("file", row.file);
          await API.post("/hospital/certificate", fd);
        }
      }

      toast.success("Certificates updated");
      loadProfile();
    } catch (err) {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===================================================
        SUBMIT: CONTACT PERSON
  =================================================== */
  const submitContact = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", contactForm.name);
      fd.append("mobileNumber", contactForm.mobileNo);
      fd.append("email", contactForm.email);
      fd.append("gender", contactForm.gender);

      if (contactForm.profileFile)
        fd.append("profilePhoto", contactForm.profileFile);

      await API.post("/hospital/contact", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Contact updated");
      loadProfile();
    } catch (err) {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (addressForm?.country?.isoCode) {
      fetchStates(addressForm.country.isoCode);
    }
  }, [addressForm]);

  useEffect(() => {
    if (addressForm?.state?.isoCode) {
      fetchCities(addressForm.state.isoCode);
    }
  }, [addressForm]);
  useEffect(() => {
    fetchCountries()
  }, [])
  async function fetchCountries() {
    // setLoading(true)
    try {
      const response = await getApiData('api/location/countries')
      const data = await response
      setCountries(data)
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  async function fetchStates(value) {
    // setLoading(true)
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
    // setLoading(true)
    try {
      const response = await getApiData(`api/location/cities/${value}`)
      const data = await response
      setCities(data)
    } catch (error) {

    } finally {
      // setLoading(false)
    }
  }
  const [paymentForm, setPaymentForm] = useState({
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    accountHolderName: "",
    branch: "",
    qr: null
  })
  const [paymentErrors, setPaymentErrors] = useState({})
  const validatePayment = () => {
    let temp = {};

    if (!paymentForm?.bankName?.trim())
      temp.bankName = "Bank name is required.";

    if (!paymentForm?.branch?.trim())
      temp.branch = "Bank branch is required.";

    if (!paymentForm?.ifscCode?.trim())
      temp.ifscCode = "Bank IFSC code is required.";

    if (!paymentForm?.accountHolderName?.trim())
      temp.accountHolderName = "Account holder name is required.";

    if (!paymentForm?.accountNumber?.trim())
      temp.accountNumber = "Account number is required.";

    setPaymentErrors(temp);

    return Object.keys(temp).length === 0; // ✅ important
  };
  const paymentChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "qr") {
      const file = files[0];

      if (file) {
        // ✅ check image type
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed");
          return;
        }

        // ✅ optional size limit (2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image size should be less than 2MB");
          return;
        }

        setPaymentForm({ ...paymentForm, qr: file });
      }
    } else {
      setPaymentForm({ ...paymentForm, [name]: value })
    }
  };
  const paymentSubmit = async (e) => {
    e.preventDefault()
    if (!validatePayment()) return
    const formData = new FormData()
    for (let key in paymentForm) {
      if (key === "qr") continue; // ✅ correct check
      formData.append(key, paymentForm[key]);
    }

    // QR file add karna hai to:
    if (paymentForm.qr) {
      formData.append("qr", paymentForm.qr);
    }
    setSaving(true)
    try {
      const res = await securePostData(`api/comman/payment-info`, formData)
      if (res.success) {
        toast.success(res?.message)
        loadProfile()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setSaving(false)
    }
  }
  useEffect(() => {
    return () => {
      if (paymentForm?.qr instanceof File) {
        URL.revokeObjectURL(paymentForm.qr);
      }
    };
  }, [paymentForm.qr]);

  useEffect(() => {
    getApiData('admin/hospital-category').then((res) => {
      const formattedData = res.data.map((item) => ({
        value: item._id,
        label: item.name
      }));

      setCatData(formattedData);
    });
  }, []);



  /* ================================================================
        RETURN JSX (ALL TABS) — YOUR DESIGN REMAINS EXACT SAME
     ================================================================ */
  return (
    <>
      {/* ==================== START JSX (Paste into return) ==================== */}
      {loading ? <Loader /> :
        <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">Edit Profile</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">

                      <li className="breadcrumb-item">
                        <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/profile" className="breadcrumb-link">Profile</NavLink>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">Edit Profile</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="patient-bio-tab p-0 nw-tab-edit">
            <ul className="nav nav-tabs gap-3 ps-2 mb-3" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab">Hospital Profile</a>
              </li>

              <li className="nav-item" role="presentation">
                <a className="nav-link" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab">Hospital Images</a>
              </li>

              <li className="nav-item" role="presentation">
                <a className="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab">Hospital Address</a>
              </li>

              <li className="nav-item" role="presentation">
                <a className="nav-link" id="upload-tab" data-bs-toggle="tab" href="#upload" role="tab">License And Certificate</a>
              </li>

              <li className="nav-item" role="presentation">
                <a className="nav-link" id="person-tab" data-bs-toggle="tab" href="#person" role="tab">Contact Person</a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link" id="payment-tab" data-bs-toggle="tab" href="#payment" role="tab">Payment Info</a>
              </li>
            </ul>

            <div className="new-panel-card">
              <div className="row">
                <div className="col-lg-12">
                  <div className="patient-edit-bio-tab">
                    <div className="tab-content" id="myTabContent">

                      {/* ---------------- BASIC TAB ---------------- */}
                      <div className="tab-pane fade show active" id="home" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form onSubmit={submitBasic}>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="lab-profile-mega-bx ">
                                  <div className="lab-profile-avatr-bx position-relative">
                                    <img
                                      src={logoPreview || hospitalBasic?.logoFileId ? `${base_url}/api/file/${hospitalBasic.logoFileId}` : "/user-avatar.png"}
                                      alt=""
                                      className="border"
                                    />
                                    <label className="lab-profile-edit-avatr" htmlFor="logoFor">
                                      <span
                                        className="edit-btn cursor-pointer"

                                      >
                                        <FontAwesomeIcon icon={faPen} />
                                      </span>
                                    </label>

                                    <input
                                      id="logoFor"
                                      type="file"
                                      accept="image/*"
                                      className="d-none lab-profile-file-input"
                                      onChange={(ev) => {
                                        const f = ev.target.files?.[0];
                                        if (!f) {
                                          setLogoPreview(profile?.images?.logo?.[0]?.url || null);
                                          return;
                                        }
                                        setBasicForm((p) => ({ ...p, logo: f }));
                                        const url = URL.createObjectURL(f);
                                        setLogoPreview(url);
                                      }}
                                    />
                                  </div>

                                  <div className="nw-content-details">
                                    <h4 className="lg_title">{basicForm.hospitalName || "Hospital Name"}</h4>
                                    <p className="first_para mb-2"><span className="fw-700">ID :</span> #{user?.nh12 || ""}</p>
                                    <p className="first_para mb-2"><span className="fw-700">Hospital License ID : </span> {basicForm.licenseId || ""}</p>
                                    <p className="first_para mb-2"><span className="fw-700">Established Year : </span> {basicForm.establishedYear || ""} Years</p>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Hospital Name</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={basicForm.hospitalName}
                                    onChange={(e) => setBasicForm((p) => ({ ...p, hospitalName: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Mobile Number</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={basicForm.mobileNo}
                                    onChange={(e) => setBasicForm((p) => ({ ...p, mobileNo: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Email</label>
                                  <input
                                    type="email"
                                    className="form-control nw-frm-control"
                                    value={basicForm.email}
                                    onChange={(e) => setBasicForm((p) => ({ ...p, email: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label htmlFor="">Category</label>
                                  <Select
                                    options={catData}
                                    isMulti
                                    value={catData.filter(option =>
                                      basicForm.category.includes(option.value)
                                    )}
                                    className="custom-select"
                                    placeholder="Select category..."
                                    onChange={(selectedOptions) => {
                                      const ids = selectedOptions.map((item) => item.value);
                                      setBasicForm({ ...basicForm, category: ids });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>GST Number</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={basicForm.gstNumber}
                                    onChange={(e) => setBasicForm((p) => ({ ...p, gstNumber: e.target.value }))}
                                  />
                                </div>
                              </div>



                              <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                  <label>About</label>
                                  <textarea
                                    className="form-control nw-frm-control"
                                    value={basicForm.about}
                                    onChange={(e) => setBasicForm((p) => ({ ...p, about: e.target.value }))}
                                  />
                                </div>
                              </div>



                              <div className="d-flex justify-content-end gap-3">
                                <button type="button" className="nw-filtr-thm-btn outline" onClick={() => loadProfile()}>Cancel</button>
                                <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                              </div>

                            </div>
                          </form>
                        </div>
                      </div>

                      {/* ---------------- IMAGES TAB ---------------- */}
                      <div className="tab-pane fade" id="profile" role="tabpanel">
                        <div className="sub-tab-brd lab-thumb-bx">
                          <form onSubmit={submitImages}>
                            <div className="row justify-content-between">
                              <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                  <label>Upload Thumbnail image</label>

                                  <div className="upload-box nw-upload-bx p-3 justify-content-center">
                                    <div className="upload-icon mb-2">
                                      <IoCloudUploadOutline />
                                    </div>

                                    <div>
                                      <p className="fw-semibold mb-1">
                                        <label htmlFor="thumbPicker" className="file-label file-select-label">Choose a file or drag & drop here</label>
                                      </p>

                                      <small className="format-title">JPEG / PNG</small>

                                      <div className="mt-3">
                                        <label htmlFor="thumbPicker" className="browse-btn">Browse File</label>
                                      </div>

                                      <input
                                        id="thumbPicker"
                                        ref={fileThumbRef}
                                        type="file"
                                        className="d-none"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={(e) => {
                                          const f = e.target.files?.[0];
                                          if (!f) { setThumbnailFile(null); setThumbnailPreview(profile?.images?.thumbnail?.[0]?.url || null); return; }
                                          setThumbnailFile(f);
                                          const url = URL.createObjectURL(f);
                                          setThumbnailPreview(url);
                                        }}
                                      />

                                      <div className="mt-3">
                                        {thumbnailPreview ? (
                                          <img src={thumbnailPreview} alt="thumb" className="img-thumbnail" style={{ maxWidth: 180 }} />
                                        ) : (
                                          <p className="text-muted small">No thumbnail</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="custom-frm-bx">
                                  <div className="form-control lablcense-frm-control align-content-center border-0">
                                    <div className="lablcense-bx">
                                      <div><h6><FontAwesomeIcon icon={faImage} /> Thumbnail</h6></div>
                                      <div></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-5">
                                <div className="custom-frm-bx">
                                  <label>Upload Laboratory images (max 5)</label>

                                  <div className="upload-box p-3 nw-upload-bx justify-content-center">
                                    <div className="upload-icon mb-2">
                                      <IoCloudUploadOutline />
                                    </div>

                                    <div>
                                      <p className="fw-semibold mb-1">
                                        <label htmlFor="galleryPicker" className="file-label file-select-label">Choose files or drag & drop here</label>
                                      </p>

                                      <small className="format-title">JPEG / PNG</small>

                                      <div className="mt-3">
                                        <label htmlFor="galleryPicker" className="browse-btn">Browse File</label>
                                      </div>

                                      <input
                                        id="galleryPicker"
                                        ref={fileGalleryRef}
                                        type="file"
                                        className="d-none"
                                        accept=".png,.jpg,.jpeg"
                                        multiple
                                        onChange={(e) => {
                                          const newFiles = Array.from(e.target.files || []);
                                          if (galleryFiles.length + newFiles.length > 5) {
                                            toast.error("Max 5 images allowed");
                                            return;
                                          }
                                          // append to existing new files
                                          const updatedFiles = [...galleryFiles, ...newFiles];
                                          setGalleryFiles(updatedFiles);

                                          // revoke previous previews we created locally
                                          galleryPreviews.forEach((p) => p && URL.revokeObjectURL(p));

                                          const previews = updatedFiles.map((f) => URL.createObjectURL(f));
                                          setGalleryPreviews(previews);
                                        }}
                                      />

                                      <div className="mt-3">
                                        {galleryPreviews.length > 0 && (
                                          <div className="d-flex flex-wrap gap-2">
                                            {galleryPreviews.map((p, idx) => (
                                              <div key={idx} className="position-relative">
                                                <img src={p} alt={`g-${idx}`} style={{ width: 120, height: 80, objectFit: "cover" }} />
                                                <button type="button" className="btn btn-sm" style={{ position: "absolute", top: 0, right: 0 }} onClick={() => {
                                                  // remove file at idx
                                                  const newFiles = galleryFiles.filter((_, i) => i !== idx);
                                                  setGalleryFiles(newFiles);
                                                  // revoke preview
                                                  if (galleryPreviews[idx]) URL.revokeObjectURL(galleryPreviews[idx]);
                                                  setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
                                                }}>✕</button>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <h6 className="mb-2">Existing Images</h6>
                                  <div className="d-flex flex-wrap gap-2">
                                    {(profile.images?.gallery || []).length === 0 && <p className="text-muted">No gallery images</p>}
                                    {(profile.images?.gallery || []).map((g) => (
                                      <div key={g._id} className="position-relative" style={{ width: 120 }}>
                                        <img src={g.url} alt="existing" style={{ width: "100%", height: 80, objectFit: "cover" }} />
                                        <div className="d-flex justify-content-between mt-1 align-items-center">
                                          <small className="text-muted">#{g._id}</small>
                                          <div>
                                            <label style={{ cursor: "pointer", fontSize: 12 }}>
                                              <input
                                                type="checkbox"
                                                checked={markedRemoveImageIds.includes(g._id)}
                                                onChange={() => {
                                                  setMarkedRemoveImageIds((prev) =>
                                                    prev.includes(g._id) ? prev.filter((id) => id !== g._id) : [...prev, g._id]
                                                  );
                                                }}
                                              />
                                              &nbsp; Remove
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </div>

                              <div className="d-flex justify-content-end gap-3 mt-3">
                                <button type="button" className="nw-filtr-thm-btn outline" onClick={() => {
                                  // revert selections
                                  setThumbnailFile(null);
                                  setGalleryFiles([]);
                                  galleryPreviews.forEach((p) => p && URL.revokeObjectURL(p));
                                  setGalleryPreviews([]);
                                  setThumbnailPreview(profile?.images?.thumbnail?.[0]?.url || null);
                                  setMarkedRemoveImageIds([]);
                                }}>Cancel</button>

                                <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                              </div>

                            </div>
                          </form>
                        </div>
                      </div>

                      {/* ---------------- ADDRESS TAB ---------------- */}
                      <div className="tab-pane fade" id="contact" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form onSubmit={submitAddress}>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Full Address</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={addressForm.fullAddress}
                                    onChange={(e) => setAddressForm((p) => ({ ...p, fullAddress: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Country</label>
                                  {/* <input
                                  type="text"
                                  className="form-control nw-frm-control"
                                  value={addressForm.country}
                                  onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                                /> */}
                                  <select
                                    className="form-select"
                                    value={addressForm.country}
                                    onChange={(e) => {
                                      const data = countries?.filter(item => item?._id === e.target.value)
                                      fetchStates(data[0].isoCode)
                                      setAddressForm((p) => ({ ...p, country: e.target.value }))
                                    }}
                                  >
                                    <option value="">---Select Country---</option>
                                    {countries?.map((item, key) =>
                                      <option value={item?._id} key={key}>{item?.name}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>State</label>
                                  {/* <input
                                  type="text"
                                  className="form-control nw-frm-control"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                                /> */}
                                  <select
                                    className="form-select"
                                    value={addressForm.state}
                                    onChange={(e) => {
                                      const data = states?.filter(item => item?._id === e.target.value)
                                      fetchCities(data[0].isoCode)
                                      setAddressForm((p) => ({ ...p, state: e.target.value }))
                                    }}
                                  >
                                    <option value="">---Select State---</option>
                                    {states?.map((item, key) =>
                                      <option value={item?._id} key={key}>{item?.name}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>City</label>
                                  {/* <input
                                  type="text"
                                  className="form-control nw-frm-control"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                                /> */}
                                  <select
                                    className="form-select"
                                    value={addressForm.city}
                                    onChange={(e) => {

                                      setAddressForm((p) => ({ ...p, city: e.target?.value }))
                                    }}
                                  >
                                    <option value="">---Select Country---</option>
                                    {cities?.map((item, key) =>
                                      <option value={item?._id} key={key}>{item?.name}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Pin Code</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={addressForm.pinCode}
                                    onChange={(e) => setAddressForm((p) => ({ ...p, pinCode: e.target.value }))}
                                  />
                                </div>
                              </div>

                              <div className="d-flex justify-content-end gap-3">
                                <button type="button" className="nw-filtr-thm-btn outline" onClick={() => {
                                  setAddressForm({
                                    fullAddress: profile?.address?.fullAddress || "",
                                    country: profile?.address?.country || "",
                                    state: profile?.address?.state || "",
                                    city: profile?.address?.city || "",
                                    pinCode: profile?.address?.pinCode || ""
                                  });
                                }}>Cancel</button>

                                <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* ---------------- CERTIFICATES TAB ---------------- */}
                      <div className="tab-pane fade" id="upload" role="tabpanel">
                        <div className="sub-tab-brd lab-thumb-bx edit-thumb">
                          <form onSubmit={submitCertificates}>
                            <div className="row">

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Hospital License Number</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={licenseCert.licenseNumber}
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, licenseNumber: e.target.value }))}
                                  />
                                </div>

                                <div className="custom-frm-bx">
                                  <label>Upload License</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, file: e.target.files?.[0] }))}
                                  />
                                </div>

                                {/* existing license file display */}
                                {profile.certificates?.filter((c) => c.certificateType === "hospital_license").map((c) => (
                                  <div className="custom-frm-bx" key={c._id}>
                                    <div className="form-control lablcense-frm-control border-0">
                                      <div className="lablcense-bx">
                                        <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> {c.fileId || c.licenseNumber}</h6>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Registration Certificate Number</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={licenseCert.regNumber}
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, regNumber: e.target.value }))}
                                  />
                                </div>

                                <div className="custom-frm-bx">
                                  <label>Upload Registration Certificate</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, regFile: e.target.files?.[0] }))}
                                  />
                                </div>

                                {profile.certificates?.filter((c) => c.certificateType === "registration").map((c) => (
                                  <div className="custom-frm-bx" key={c._id}>
                                    <div className="form-control lablcense-frm-control border-0">
                                      <div className="lablcense-bx">
                                        <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> {c.fileId || c.licenseNumber}</h6>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="col-lg-6 mt-3">
                                <div className="custom-frm-bx">
                                  <label>Accreditation Number</label>
                                  <input
                                    type="text"
                                    className="form-control nw-frm-control"
                                    value={licenseCert.accrNumber}
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, accrNumber: e.target.value }))}
                                  />
                                </div>

                                <div className="custom-frm-bx">
                                  <label>Upload Accreditation Certificate</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setLicenseCert((p) => ({ ...p, accrFile: e.target.files?.[0] }))}
                                  />
                                </div>

                                {profile.certificates?.filter((c) => c.certificateType === "accreditation").map((c) => (
                                  <div className="custom-frm-bx" key={c._id}>
                                    <div className="form-control lablcense-frm-control border-0">
                                      <div className="lablcense-bx">
                                        <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> {c.fileId || c.licenseNumber}</h6>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <h6 className="fw-bold mt-4">Other Certificates</h6>

                              {extraCerts.map((row, index) => (
                                <div key={row.id} className="upload-account-bx nw-account-add-bx mb-3">
                                  <div className="row">
                                    <div className="col-lg-11">
                                      <div className="custom-frm-bx">
                                        <label>Certificate Title</label>
                                        <input type="text" className="form-control" value={row.title} onChange={(e) => updateRow(row.id, "title", e.target.value)} />
                                      </div>

                                      <div className="custom-frm-bx">
                                        <label>Upload Certificate</label>
                                        <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => updateRow(row.id, "file", e.target.files?.[0])} />
                                      </div>

                                      {row.existingUrl && (
                                        <div className="custom-frm-bx">
                                          <div className="form-control lablcense-frm-control border-0">
                                            <div className="lablcense-bx">
                                              <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> Existing</h6>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="col-lg-1 d-flex align-items-center justify-content-end">
                                      <button type="button" className="text-danger" onClick={() => removeRow(row.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="text-end">
                                <button type="button" onClick={() => addRow()} className="btn">
                                  <FaPlusCircle style={{ color: "#34A853", fontSize: "22px" }} />
                                </button>
                              </div>

                              <div className="d-flex justify-content-end gap-3 mt-4">
                                <button type="button" className="nw-filtr-thm-btn outline" onClick={() => loadProfile()}>Cancel</button>
                                <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                              </div>

                            </div>
                          </form>
                        </div>
                      </div>

                      {/* ---------------- CONTACT PERSON TAB ---------------- */}
                      <div className="tab-pane fade" id="person" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form onSubmit={submitContact}>

                            <div className="lab-profile-mega-bx">
                              <div className="lab-profile-avatr-bx lab-contact-prson position-relative rounded-circle">
                                <img src={contactForm.preview || "/user-avatar.png"} alt="" />

                                <div className="lab-profile-edit-avatr">
                                  <a className="edit-btn cursor-pointer" onClick={(e) => { e.preventDefault(); contactPhotoRef.current && contactPhotoRef.current.click(); }}>
                                    <FontAwesomeIcon icon={faPen} />
                                  </a>
                                </div>

                                <input
                                  ref={contactPhotoRef}
                                  type="file"
                                  className="d-none lab-profile-file-input"
                                  accept=".png,.jpg,.jpeg"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    const url = URL.createObjectURL(f);
                                    setContactForm((p) => ({ ...p, profileFile: f, preview: url }));
                                  }}
                                />
                              </div>

                              <h4 className="lg_title mt-2">{contactForm.name}</h4>
                            </div>

                            <div className="row">
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Name</label>
                                  <input type="text" className="form-control nw-frm-control" value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Mobile Number</label>
                                  <input type="number" className="form-control nw-frm-control" value={contactForm.mobileNo} onChange={(e) => setContactForm((p) => ({ ...p, mobileNo: e.target.value }))} />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Email Address</label>
                                  <input type="email" className="form-control nw-frm-control" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Gender</label>
                                  <select className="form-select" value={contactForm.gender} onChange={(e) => setContactForm((p) => ({ ...p, gender: e.target.value }))}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-end gap-3 mt-3">
                              <button type="button" className="nw-filtr-thm-btn outline" onClick={() => loadProfile()}>Cancel</button>
                              <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* ---------------- PAYMENT INFO TAB ---------------- */}
                      <div className="tab-pane fade" id="payment" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form onSubmit={paymentSubmit}>



                            <div className="row">
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Bank Name</label>
                                  <input type="text" className="form-control nw-frm-control"
                                    value={paymentForm?.bankName}
                                    name="bankName"
                                    onChange={paymentChange} />
                                  {paymentErrors?.bankName && <small className="text-danger">{paymentErrors?.bankName}</small>}
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Account Number</label>
                                  <input type="number" className="form-control nw-frm-control"
                                    value={paymentForm?.accountNumber}
                                    name="accountNumber"
                                    onChange={paymentChange} />
                                  {paymentErrors?.accountNumber && <small className="text-danger">{paymentErrors?.accountNumber}</small>}

                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Account Holder Name</label>
                                  <input type="text" className="form-control nw-frm-control"
                                    value={paymentForm?.accountHolderName}
                                    name="accountHolderName"
                                    onChange={paymentChange} />
                                  {paymentErrors?.accountHolderName && <small className="text-danger">{paymentErrors?.accountHolderName}</small>}

                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>IFSC Code</label>
                                  <input type="text" className="form-control nw-frm-control"
                                    value={paymentForm?.ifscCode}
                                    name="ifscCode"
                                    onChange={paymentChange} />
                                  {paymentErrors?.ifscCode && <small className="text-danger">{paymentErrors?.ifscCode}</small>}

                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Branch Name</label>
                                  <input type="text" className="form-control nw-frm-control"
                                    value={paymentForm?.branch}
                                    name="branch"
                                    onChange={paymentChange} />
                                  {paymentErrors?.branch && <small className="text-danger">{paymentErrors?.branch}</small>}

                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>QR</label>
                                  <input type="file" className="form-control nw-frm-control"

                                    name="qr"
                                    accept="image/*"
                                    onChange={paymentChange} />
                                </div>
                                {paymentForm?.qr && (
                                  <img
                                    src={
                                      paymentForm.qr instanceof File
                                        ? URL.createObjectURL(paymentForm.qr)
                                        : `${base_url}/${paymentForm.qr}`
                                    }
                                    alt="QR Preview"
                                    style={{ width: "150px", marginTop: "10px" }}
                                  />
                                )}
                              </div>
                            </div>

                            <div className="d-flex justify-content-end gap-3 mt-3">
                              <button type="button" className="nw-filtr-thm-btn outline" onClick={() => loadProfile()}>Cancel</button>
                              <button type="submit" className="nw-filtr-thm-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                            </div>
                          </form>
                        </div>
                      </div>

                    </div> {/* tab-content */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {/* ==================== END JSX (Paste into return) ==================== */}

    </>
  );
}

export default EditProfile;
