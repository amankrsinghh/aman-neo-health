import { faDownload, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../../utils/axios";
import html2canvas from "html2canvas";
import { getSecureApiData, securePostData } from "../../Services/api";
import Loader from "../Common/Loader";
import { toast } from "react-toastify";

function NeoCardGenerate() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [cardReady, setCardReady] = useState(false);
  const [userData, setUserData] = useState()
  const cardRef = useRef(null);

  const fetchUser = async (q = "") => {
    if (!q?.trim()) return
    setLoading(true);
    try {
      const res = await getSecureApiData(`admin/users?search=${q}`);
      if (res.success) {
        setUserData(res.data || []);
        setName(res?.data?.name)
        setUserId(res?.data?.nh12)
      }
    } catch { setPatients([]); }
    finally { setLoading(false); }
  };




  const handleGenerate = async () => {
    if (!name || !userId) return;
    try {
      const res = await securePostData('admin/generate-card', { userId: userData?._id })
      if (res.success) {
        setCardReady(true);
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    } finally {
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `NeoCard_${userId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) { console.error("Download failed", err); }
  };

  return (
    <>
      {loading ? <Loader />
        : <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2 gradient-text">Generate NeoCard</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#" className="breadcrumb-link">Dashboard</a>
                      </li>
                      <li className="breadcrumb-item active">Generate NeoCard</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className='new-mega-card'>
            <div className="row justify-content-between">

              {/* ── Left Form ── */}
              <div className="col-lg-6 mb-3">
                <div className="sub-tab-brd">

                  {/* Search */}
                  <div className="custom-frm-bx">
                    <label>Search Patient</label>
                    <div className="d-flex gap-2">
                      <input type="text" className="form-control nw-select-frm"
                        placeholder="Name / Mobile / Email..."
                        value={search}
                        onChange={e => {
                          setCardReady(false)
                          setUserData()
                          setSearch(e.target.value)
                        }}
                        onKeyDown={e => e.key === "Enter" && fetchUser(search)} />
                      <button className="nw-filtr-btn" onClick={() => fetchUser(search)}>
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  {userData?.nh12 && <>
                    {/* Patient Dropdown */}
                    <div className="custom-frm-bx">
                      <label>User Role</label>
                      <select className="form-control nw-select-frm nw-frm-control" aria-readonly value={userData?.role}>
                        <option value="">---Select----</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="lab">Laboratory</option>
                        <option value="hospital">Hospital</option>
                        {/* <option value=""></option> */}
                      </select>
                    </div>

                    {/* Name */}
                    <div className="custom-frm-bx">
                      <label>Name</label>
                      <input type="text" placeholder="Enter Name"
                        className="form-control nw-select-frm"
                        value={userData?.name}
                        readOnly />
                    </div>
                    <div className="custom-frm-bx">
                      <label>Contact Number</label>
                      <input type="text"
                        className="form-control nw-select-frm"
                        value={userData?.contactNumber}
                        readOnly />
                    </div>
                    <div className="custom-frm-bx">
                      <label>Email</label>
                      <input type="text" placeholder="Enter Name"
                        className="form-control nw-select-frm"
                        value={userData?.email}
                        readOnly />
                    </div>

                    {/* User ID */}
                    <div className="custom-frm-bx">
                      <label>User Id</label>
                      <input type="text" placeholder="Enter user Id"
                        className="form-control nw-select-frm"
                        value={userData?.nh12}
                        readOnly />
                    </div>

                    <div className="text-end">
                      <button className="nw-filtr-thm-btn" onClick={handleGenerate}
                        disabled={!userData?.name}>
                        Generate
                      </button>
                    </div>
                  </>}
                </div>
              </div>

              {/* ── Right Card Preview (ORIGINAL DESIGN) ── */}
              {cardReady && <div className="col-lg-5">
                <div className="d-flex align-items-center justify-content-center gap-2">

                  {/* Original card — just replace static text with dynamic */}
                  <div ref={cardRef} className="add-patients-clients">
                    <div className={userData?.role == "patient" ?
                      "patient-chip-card" : userData?.role == "hospital" ?
                        "hospital-chip-card" : userData?.role == "lab" ?
                          "lab-chip-card" : userData?.role == "pharmacy" ?
                            "phar-chip-card" :
                            "doctor-chip-card"}></div>
                    <img src={"/NeoCard.png"} alt="" />
                    <div className="patient-card-details">
                      <h4>{name?.length > 17 ? name.slice(0, 14) + '...' : name}</h4>
                      {/* <p>Patient ID</p> */}
                      <h6>{cardReady ? userId : "PATIENT20240423"}</h6>
                    </div>
                    <div className="qr-code-generate">
                      {cardReady && (
                        <QRCodeCanvas
                          value={userData?.nh12}
                          size={256}
                          style={{ height: "auto", maxWidth: "100%", width: "20%" }}
                          bgColor="transparent"
                          fgColor="#ffffff"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <button className="patient-crd-down-btn" onClick={handleDownload}
                      disabled={!cardReady} style={{ opacity: cardReady ? 1 : 0.5 }}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </div>
                </div>

                {!cardReady && (
                  <p className="text-center text-muted mt-2" style={{ fontSize: 13 }}>
                    Patient select karke "Generate" dabao
                  </p>
                )}
              </div>}

            </div>
          </div>
        </div>}
    </>
  );
}

export default NeoCardGenerate;
