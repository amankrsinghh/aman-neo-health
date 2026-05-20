import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faDownload,
  faFilePdf,
  faPen,
  faShareNodes
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import base_url from "../../baseUrl";
import html2canvas from "html2canvas";
import Loader from "../Common/Loader";
import { securePostData } from "../../Service/api";
import { QRCodeCanvas } from "qrcode.react";
import { Hospital } from "lucide-react";
function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const cardRef = useRef(null);

  const { user, hospitalBasic, hospitalPerson } = useSelector(state => state.user)

  useEffect(() => {
    loadProfile();
  }, []);


  async function loadProfile() {
    try {
      const res = await API.get("/hospital/get-hospital-profile");
      setProfile(res.data.profile);
    } catch (err) {
      console.log("Profile Load Error:", err);
    } finally {
      setLoading(false);
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
    console.log("object")
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
    if (profile?.paymentInfo) {
      setPaymentForm({
        ...paymentForm,
        bankName: profile?.paymentInfo?.bankName || "",
        ifscCode: profile?.paymentInfo?.ifscCode || "",
        accountNumber: profile?.paymentInfo?.accountNumber || "",
        accountHolderName: profile?.paymentInfo?.accountHolderName || "",
        branch: profile?.paymentInfo?.branch || "",
        qr: profile?.paymentInfo?.qr || ""
      })
    }
  }, [profile])

  // if (loading) return <div className="p-5 text-center fw-bold">Loading...</div>;
  if (!profile) return <div className="p-5 text-center fw-bold"></div>;

  const basic = profile.basic || {};
  const images = profile.images || {};
  const address = {
    fullAddress: profile?.address?.fullAddress || "",
    country: profile?.address?.country?.name || "",
    state: profile?.address?.state?.name || "",
    city: profile?.address?.city?.name || "",
    pinCode: profile?.address?.pinCode || "",
  };
  const contact = profile.contact || {};
  const certificates = profile.certificates || [];


  async function handleSendEditRequest() {
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      const res = await API.post("/hospital/edit-request", { note });

      toast.success("Edit request sent successfully!");

      setNote("");
      await loadProfile();
    } catch (err) {
      console.log("REQUEST ERROR:", err);
      toast.error(err?.response?.data?.message || "Request failed");
    }
  }

  const handleCardDownload = (e) => {
    e.preventDefault()
    if (cardRef.current) {
      html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        scale: 2, // better quality
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${profile?.hospitalName || "hospital-card"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };



  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between sub-header-bx">
              <div>
                <h3 className="innr-title mb-2">Profile</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Profile
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="add-nw-bx">
                {profile.editRequestStatus === "approved" && (
                  <button
                    className="add-nw-btn nw-thm-btn"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </button>
                )}
                {profile.editRequestStatus == "none" && <a
                  href="javascript:void(0)"
                  className="add-nw-btn nw-thm-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#edit-Request"
                >
                  Send Profile Edit Request
                </a>}

              </div>
            </div>
          </div>

          <div className="employee-tabs">
            <ul className="nav nav-tabs gap-3 ps-2 mb-3" id="myTab" role="tablist">

              {/* ---------------- TAB FIX APPLIED HERE ---------------- */}
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  role="tab"
                >
                  Hospital Profile
                </a>
              </li>

              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                >
                  Hospital Images
                </a>
              </li>

              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#contact"
                  role="tab"
                >
                  Hospital Address
                </a>
              </li>

              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="upload-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#upload"
                  role="tab"
                >
                  License And Certificate
                </a>
              </li>

              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="person-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#person"
                  role="tab"
                >
                  Contact Person
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="payment-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#payment"
                  role="tab"
                >
                  Payment Info
                </a>
              </li>
              {/* ------------------------------------------------------ */}

            </ul>

            <div className="new-panel-card">
              <div className="row">
                <div className="col-lg-12">

                  <div className="employee-tabs">
                    <div className="tab-content" id="myTabContent">

                      {/* HOME TAB */}
                      <div className="tab-pane fade show active" id="home" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="d-flex align-items-center justify-content-between laboratory-card">
                                  <div className="lab-profile-mega-bx">
                                    <div className="lab-profile-avatr-bx position-relative">
                                      <img
                                        src={hospitalBasic?.logoFileId ? `${base_url}/api/file/${hospitalBasic.logoFileId}`
                                          : "/pharmacy-logo.png"
                                        }
                                        alt=""
                                        className="border"
                                      />

                                      <div className="lab-profile-edit-avatr">
                                        <a className="edit-btn cursor-pointer">
                                          <FontAwesomeIcon icon={faPen} />
                                        </a>
                                      </div>

                                      <input type="file" className="lab-profile-file-input" />
                                    </div>

                                    <div className="nw-content-details">
                                      <h4 className="lg_title">{basic.hospitalName}</h4>
                                      <p className="first_para mb-2">
                                        <span className="fw-700">ID :</span> #{user?.nh12}
                                      </p>
                                      <p className="first_para mb-2">
                                        <span className="fw-700">Hospital License ID :</span>{" "}
                                        {basic.licenseId}
                                      </p>
                                      <p className="first_para mb-2">
                                        <span className="fw-700">Established Year :</span>{" "}
                                        {basic.establishedYear} Years
                                      </p>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                                    <div ref={cardRef} className="add-patients-clients">
                                      <div className="nw-chip-card">
                                        {/* <Hospital color="#fff" size={50}/> */}
                                      </div>
                                      <img src="/NeoCard.png" alt="" />
                                      <div className="patient-card-details">
                                        <h4>{basic.hospitalName?.length > 17 ? basic?.hospitalName(0, 14) + '...' : basic?.hospitalName}</h4>
                                        {/* <p>Hospital ID</p> */}
                                        <h6>{user?.nh12}</h6>
                                      </div>
                                      <div className="qr-code-generate">
                                        <QRCodeCanvas
                                          value={`https://www.neohealthcard.com/user/${user?.nh12}`}
                                          size={256}
                                          // className="qr-code"
                                          bgColor="transparent"
                                          fgColor="#ffffff"
                                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex flex-column gap-2 card-down-bx">
                                      <button className="pharmacy-card-tbn">
                                        <FontAwesomeIcon icon={faDownload} onClick={handleCardDownload} />
                                      </button>
                                      <button className="pharmacy-card-tbn crd-share-btn">
                                        <FontAwesomeIcon icon={faShareNodes} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Hospital Name</label>
                                  <input type="text" className="form-control nw-frm-control" value={basic.hospitalName} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Mobile Number</label>
                                  <input type="text" className="form-control nw-frm-control" value={basic.mobileNo} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Email</label>
                                  <input type="email" className="form-control nw-frm-control" value={basic.email} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>GST Number</label>
                                  <input type="text" className="form-control nw-frm-control" value={basic.gstNumber} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-12">
                                <div className="custom-frm-bx">
                                  <label>About</label>
                                  <textarea className="form-control nw-frm-control" value={basic.about} readOnly />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* IMAGES TAB */}
                      <div className="tab-pane fade" id="profile" role="tabpanel">
                        <div className="sub-tab-brd lab-thumb-bx">
                          <div className="row mb-3">
                            <h5 className="text-black fw-700">Thumbnail image</h5>
                            <div className="col-lg-4">
                              {images.thumbnail?.length ? (
                                <img src={images.thumbnail[0].url} className="lab-images-bx" />
                              ) : (
                                <p>No Thumbnail Uploaded</p>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <h5 className="text-black fw-700">Image</h5>
                            {images.gallery?.map((img) => (
                              <div className="col-lg-4 mb-3" key={img._id}>
                                <img src={img.url} className="lab-multi-image-bx" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ADDRESS TAB */}
                      <div className="tab-pane fade" id="contact" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Full Address</label>
                                  <input type="text" className="form-control nw-frm-control" value={address.fullAddress || ""} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Country</label>
                                  <input type="text" className="form-control nw-frm-control" value={address.country || ""} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>State</label>
                                  <input type="text" className="form-control nw-frm-control" value={address.state || ""} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>City</label>
                                  <input type="text" className="form-control nw-frm-control" value={address.city || ""} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Pin Code</label>
                                  <input type="text" className="form-control nw-frm-control" value={address.pinCode || ""} readOnly />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* CERTIFICATE TAB */}
                      <div className="tab-pane fade" id="upload" role="tabpanel">
                        <div className="sub-tab-brd lab-thumb-bx">
                          <h5 className="text-black fw-700">License Details</h5>

                          {certificates.length === 0 && <p>No certificates uploaded</p>}

                          {certificates.map((cert) => (
                            <div className="row mb-3" key={cert._id}>
                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>{cert.certificateType}</label>
                                  <input type="text" className="form-control nw-frm-control" value={cert.licenseNumber} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Certificate Document</label>
                                  <div className="form-control lablcense-frm-control">
                                    <div className="lablcense-bx">
                                      <h6>
                                        <FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} />
                                        &nbsp; {cert.certificateType}.pdf
                                      </h6>

                                      <a href={cert.url} target="_blank" className="pdf-download-tbn">
                                        Download
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CONTACT PERSON TAB */}
                      <div className="tab-pane fade" id="person" role="tabpanel">
                        <div className="sub-tab-brd">
                          <form>
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="lab-profile-mega-bx">
                                  <div className="lab-profile-avatr-bx lab-contact-prson position-relative rounded-circle">
                                    <img
                                      src={
                                        contact.profilePhotoId
                                          ? `https://api.neohealthcard.com:9100/api/file/${contact.profilePhotoId}`
                                          : "/user-avatar.png"
                                      }
                                      alt=""
                                    />

                                    {/* <div className="lab-profile-edit-avatr">
                                    <a className="edit-btn cursor-pointer">
                                      <FontAwesomeIcon icon={faPen} />
                                    </a>
                                  </div> */}

                                    <input type="file" className="lab-profile-file-input" />
                                  </div>

                                  <div>
                                    <h4 className="lg_title">{contact.name}</h4>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Name</label>
                                  <input type="text" className="form-control nw-frm-control" value={contact.name} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Mobile Number</label>
                                  <input type="text" className="form-control nw-frm-control" value={contact.mobileNumber} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Email</label>
                                  <input type="email" className="form-control nw-frm-control" value={contact.email} readOnly />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="custom-frm-bx">
                                  <label>Gender</label>
                                  <input type="text" className="form-control nw-frm-control" value={contact.gender} readOnly />
                                </div>
                              </div>

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

                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div className="text-end mt-4">
            <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
          </div>
        </div>}

      {/* MODAL */}
      <div className="modal step-modal" id="edit-Request" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-5">
            <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
              <h6 className="lg_title mb-0">Edit Request from Admin</h6>
              <button type="button" className="fz-18" data-bs-dismiss="modal" style={{ color: "#00000040" }}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>

            <div className="modal-body px-4 pb-5">
              <div className="edit-request-bx">
                <div className="float-left">
                  <img src="/edit-reqest.png" alt="" />
                </div>
                <div className="float-right">
                  <p>
                    You can edit your profile when you click on the request button.
                    The edit option will appear after your request is approved.
                  </p>
                </div>
              </div>

              <div className="custom-frm-bx">
                <label>Note</label>
                <textarea className="form-control" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
              </div>

              {/* <button className="nw-thm-btn w-100" data-bs-dismiss="modal" onClick={() => navigate("/approve-profile")}> */}
              <button className="nw-thm-btn w-100" data-bs-dismiss="modal" onClick={handleSendEditRequest}>
                Send Edit Request
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
