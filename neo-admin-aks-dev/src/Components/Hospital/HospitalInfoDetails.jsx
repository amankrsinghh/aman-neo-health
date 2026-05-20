import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf, faSearch } from "@fortawesome/free-solid-svg-icons";
import { TbGridDots } from "react-icons/tb";
import { useParams, NavLink } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { IMAGE_BASE_URL } from "../../utils/config";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import Pagination from "../Common/Pagination";

function HospitalInfoDetails() {
  const { id } = useParams();
  const cardRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState(null);
  const [contact, setContact] = useState(null);
  const [address, setAddress] = useState(null);
  const [images, setImages] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // NeoCard states
  const [cardName, setCardName] = useState("");
  const [cardId, setCardId] = useState("");
  const [cardReady, setCardReady] = useState(false);

  // Doctor list pagination + search
  const [docSearch, setDocSearch] = useState("");
  const [docPage, setDocPage] = useState(1);
  const DOC_LIMIT = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/hospitals/${id}`);
      const d = res.data;
      setHospital(d.hospital);
      setContact(d.contactPerson);
      setAddress(d.address);
      setImages(d.images || []);
      setCertificates(d.certificates || []);
      setDoctors(d.doctors || []);
      setUniqueId(d.uniqueId || "");
    } catch {
      toast.error("Failed to load hospital details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  // Pre-fill card
  const initCard = () => {
    if (!cardName) {
      setCardName(hospital?.hospitalName || "");
      setCardId(uniqueId || hospital?._id?.slice(-8) || "");
    }
  };

  const handleGenerate = () => { if (cardName) setCardReady(true); };

  const handleCardDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `NeoCard_${cardId || cardName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { }
  };

  const imgUrl = (path, folder = "hospital") =>
    path ? `${IMAGE_BASE_URL}/uploads/${folder}/${path}` : null;

  // Filtered + paginated doctors
  const filteredDocs = docSearch
    ? doctors.filter(d => d.name?.toLowerCase().includes(docSearch.toLowerCase())
      || d.contactNumber?.includes(docSearch))
    : doctors;
  const docTotalPages = Math.max(1, Math.ceil(filteredDocs.length / DOC_LIMIT));
  const pagedDocs = filteredDocs.slice((docPage - 1) * DOC_LIMIT, docPage * DOC_LIMIT);

  if (loading) return <div className="p-4 text-center"><div className="spinner-border text-primary" /></div>;
  if (!hospital) return <div className="p-4 text-muted">Hospital not found.</div>;

  const statusClass = (s) => s === "approved" ? "approved-active" : s === "pending" ? "approved-pending" : "approved-reject";

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Hospital Details</h3>
              <div className="admin-breadcrumb">

                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item"><NavLink to="/" className="breadcrumb-link">Dashboard</NavLink></li>
                    <li className="breadcrumb-item"><NavLink to="/hospital-list" className="breadcrumb-link">Hospitals</NavLink></li>
                    <li className="breadcrumb-item active">Details</li>
                  </ol>
                </nav>
              </div>
            </div>
            <span className={`approved ${statusClass(hospital?.kycStatus)}`}>
              {hospital?.kycStatus || "—"}
            </span>
          </div>
        </div>

        <div className="new-mega-card">
          <div className="row">
            <div className="col-lg-12">
              {/* ── TABS ── */}
              <div className="employee-tabs">
                <ul className="nav nav-tabs gap-3 bg-white" id="hosTab" role="tablist">
                  {[["info", "Hospital Info"], ["contact", "Contact Person"], ["doctors", "Doctor List"], ["card", "NeoCard"]].map(([key, label]) => (
                    <li className="nav-item" key={key}>
                      <button className={`nav-link ${activeTab === key ? "active" : ""}`}
                        onClick={() => { setActiveTab(key); if (key === "card") setTimeout(initCard, 100); }}>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">

                {/* ══ TAB 1: HOSPITAL INFO ══ */}
                {activeTab === "info" && (
                  <div>
                    {/* Basic Info */}
                    <div className="doctor-information-card mb-4">
                      <div className="doctor-main-profile-card">
                        <div className="lab-personal-pic">
                          <img src={imgUrl(hospital?.logo) || "/profile-tab-avatar.png"} alt=""
                            onError={e => { e.target.src = "/profile-tab-avatar.png" }} />
                        </div>
                        <div className="doctor-content-details">
                          <div className="doctor-info-heading">
                            <h4>{hospital?.hospitalName || "—"}</h4>
                            <p>{uniqueId ? `HOS-${uniqueId}` : "—"}</p>
                          </div>
                          <div className="doctor-info-list">
                            {[
                              ["Mobile Number", hospital?.mobileNo],
                              ["Email", hospital?.email],
                              ["GST Number", hospital?.gstNumber],
                              ["License ID", hospital?.licenseId],
                            ].map(([l, v]) => v ? (
                              <div className="doctor-info-item" key={l}>
                                <h6>{l}</h6><p>{v}</p>
                              </div>
                            ) : null)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* About */}
                    {hospital?.about && (
                      <fieldset className="address-fieldset mb-4">
                        <legend className="float-none w-auto px-3 legend-title">About</legend>
                        <p>{hospital.about}</p>
                      </fieldset>
                    )}

                    {/* Images */}
                    {images.length > 0 && (
                      <fieldset className="address-fieldset mb-4">
                        <legend className="float-none w-auto px-3 legend-title">Hospital Images</legend>
                        <div className="row">
                          {images.map((img, i) => (
                            <div className="col-lg-4 col-md-6 mb-3" key={i}>
                              <div className="lab-thumb-bx">
                                <h5>{img.type === "thumbnail" ? "Thumbnail" : img.caption || `Image ${i + 1}`}</h5>
                                <img src={img.fileUrl || imgUrl(img.fileId) || "/pharmacy-pic-one.png"}
                                  alt="" style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover" }}
                                  onError={e => { e.target.src = "/pharmacy-pic-one.png" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {/* Address */}
                    {address && (
                      <fieldset className="address-fieldset mb-4">
                        <legend className="float-none w-auto px-3 legend-title">Address</legend>
                        <div className="doctor-content-details mb-3">
                          <div className="doctor-info-list">
                            <div className="doctor-info-item"><h6>Full Address</h6><p>{address?.fullAddress || "—"}</p></div>
                          </div>
                        </div>
                        <div className="doctor-content-details">
                          <div className="doctor-info-list">
                            {[
                              ["Country", address?.country?.name],
                              ["State", address?.state?.name],
                              ["City", address?.city?.name],
                              ["Pincode", address?.pinCode],
                            ].map(([l, v]) => (
                              <div className="doctor-info-item" key={l}><h6>{l}</h6><p>{v || "—"}</p></div>
                            ))}
                          </div>
                        </div>
                      </fieldset>
                    )}

                    {/* Certificates */}
                    {certificates.length > 0 && (
                      <fieldset className="address-fieldset mb-4">
                        <legend className="float-none w-auto px-3 legend-title">License & Certificates</legend>
                        <div className="row">
                          {certificates.map((cert, i) => (
                            <div className="col-lg-3 mb-3" key={i}>
                              <div className="lab-thumb-bx">
                                <h5>{cert.certificateType || "Certificate"}</h5>
                                <div className="lab-license-bx">
                                  <h6>License Number</h6>
                                  <p>{cert.licenseNumber || "—"}</p>
                                  {cert.fileUrl && (
                                    <div className="lab-certificate-dwn">
                                      <h6><FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> {cert.fileName || "Document.pdf"}</h6>
                                      <a href={cert.fileUrl} target="_blank" rel="noreferrer">
                                        <button className="notifi-remv-btn"><FontAwesomeIcon icon={faDownload} /></button>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </div>
                )}

                {/* ══ TAB 2: CONTACT PERSON ══ */}
                {activeTab === "contact" && (
                  <div>
                    {contact ? (
                      <div className="doctor-information-card mb-4">
                        <div className="doctor-main-profile-card">
                          <div className="doctor-profile-pic">
                            <img src="/doctor-info-pic.png" alt="" />
                          </div>
                          <div className="doctor-content-details justify-content-evenly">
                            <div className="doctor-info-heading">
                              <h4>{contact?.name || "—"}</h4>
                            </div>
                            <div className="doctor-info-list">
                              {[
                                ["Mobile Number", contact?.mobileNumber],
                                ["Email", contact?.email],
                                ["Gender", contact?.gender],
                              ].map(([l, v]) => (
                                <div className="doctor-info-item" key={l}><h6>{l}</h6><p>{v || "—"}</p></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted p-3">No contact person found.</p>
                    )}
                  </div>
                )}

                {/* ══ TAB 3: DOCTOR LIST ══ */}
                {activeTab === "doctors" && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="custom-frm-bx mb-0">
                        <input type="text" className="form-control admin-table-search-frm search-table-frm"
                          placeholder="Search doctor..."
                          value={docSearch}
                          onChange={e => { setDocSearch(e.target.value); setDocPage(1); }} />
                        <div className="adm-search-bx">
                          <button className="tp-search-btn"><FontAwesomeIcon icon={faSearch} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="table-section admin-mega-section">
                      <div className="table table-responsive mb-0">
                        <table className="table mb-0">
                          <thead>
                            <tr>
                              <th>#</th><th>Image</th><th>Name</th>
                              <th>Contact</th><th>Specialty</th><th>Status</th><th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagedDocs.length === 0 ? (
                              <tr><td colSpan={7} className="text-center py-4 text-muted">No doctors found</td></tr>
                            ) : pagedDocs.map((doc, i) => (
                              <tr key={doc._id}>
                                <td>{(docPage - 1) * DOC_LIMIT + i + 1}.</td>
                                <td>
                                  <img src={doc.doctorId?.profileImage
                                    ? imgUrl(doc.doctorId.profileImage, "doctor")
                                    : "/doctor-avatr.png"}
                                    alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                                    onError={e => { e.target.src = "/doctor-avatr.png" }} />
                                </td>
                                <td>
                                  <div className="admin-table-sub-details">
                                    <h6>{doc.name || "—"}</h6>
                                    <p>{doc.unique_id || "—"}</p>
                                  </div>
                                </td>
                                <td>
                                  <ul className="ad-info-list">
                                    <li className="ad-info-item"><span className="ad-info-title">Mobile:</span> {doc.contactNumber || "—"}</li>
                                    <li className="ad-info-item"><span className="ad-info-title">Email:</span> {doc.email || "—"}</li>
                                  </ul>
                                </td>
                                <td>{doc.about?.specialty?.name || "—"}</td>
                                <td>
                                  <span className={`approved ${doc.doctorId?.status === "approved" ? "approved-active" : "approved-pending"}`}>
                                    {doc.doctorId?.status || "—"}
                                  </span>
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <a href="javascript:void(0)" className="grid-dots-btn"
                                      data-bs-toggle="dropdown"><TbGridDots /></a>
                                    <ul className="dropdown-menu dropdown-menu-end mt-2 admin-dropdown-card">
                                      <li className="prescription-item">
                                        <NavLink to={`/doctor-info-details/${doc._id}`} className="prescription-nav">
                                          View Details
                                        </NavLink>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination page={docPage} totalPages={docTotalPages} onPageChange={setDocPage} />
                    </div>
                  </div>
                )}

                {/* ══ TAB 4: NEOCARD ══ */}
                {activeTab === "card" && (
                  <div className="row justify-content-between">
                    <div className="col-lg-6 mb-3">
                      <div className="sub-tab-brd">
                        <div className="custom-frm-bx">
                          <label>Hospital Name</label>
                          <input type="text" className="form-control nw-select-frm"
                            placeholder="Enter hospital name"
                            value={cardName}
                            onChange={e => { setCardName(e.target.value); setCardReady(false); }} />
                        </div>
                        <div className="custom-frm-bx">
                          <label>Hospital ID</label>
                          <input type="text" className="form-control nw-select-frm"
                            placeholder="Enter ID"
                            value={cardId}
                            onChange={e => { setCardId(e.target.value); setCardReady(false); }} />
                        </div>
                        <div className="text-end">
                          <button className="nw-filtr-thm-btn" onClick={handleGenerate} disabled={!cardName}>
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="d-flex align-items-center justify-content-center gap-2 carding-bx">
                        <div ref={cardRef} className="add-patients-clients">
                          <img src="/nw-card.png" alt="" />
                          <div className="patient-card-details">
                            <h4>{cardReady ? cardName.toUpperCase() : (hospital?.hospitalName?.toUpperCase() || "HOSPITAL NAME")}</h4>
                            <p>Hospital ID</p>
                            <h6>{cardReady ? cardId : (uniqueId || "NHCXXXXXXXX")}</h6>
                          </div>
                          <div className="qr-code-generate">
                            {cardReady && (
                              <QRCodeCanvas value={`NEOHEALTH:${cardId}:${cardName}`}
                                size={60} level="M" bgColor="transparent" fgColor="#ffffff" />
                            )}
                          </div>
                        </div>
                        <div>
                          <button className="patient-crd-down-btn" onClick={handleCardDownload}
                            disabled={!cardReady} style={{ opacity: cardReady ? 1 : 0.4 }}>
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        </div>
                      </div>
                      {!cardReady && (
                        <p className="text-center text-muted mt-2" style={{ fontSize: 12 }}>
                          Name confirm karo aur Generate dabao
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HospitalInfoDetails;
