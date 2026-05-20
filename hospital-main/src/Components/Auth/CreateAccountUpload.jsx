import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt, FaUser, FaCloudUploadAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FaPlusCircle } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail } from "../../redux/features/userSlice";

function CreateAccountUpload() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  // FIXED FIELDS
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const { hospitalBasic, hospitalAddress, paymentInfo,
  } = useSelector(state => state.user)
  const [regNumber, setRegNumber] = useState("");
  const [regFile, setRegFile] = useState(null);

  const [accrNumber, setAccrNumber] = useState("");
  const [accrFile, setAccrFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // DYNAMIC CERTIFICATES
  const [extraCerts, setExtraCerts] = useState([
    { id: 1, title: "", file: null },
  ]);

  const [errors, setErrors] = useState({});

  /** VALIDATION */
  const validate = () => {
    let temp = {};

    // Fixed Validation
    if (!licenseNumber.trim()) temp.licenseNumber = "License number required";
    if (!licenseFile) temp.licenseFile = "License file required";

    if (!regNumber.trim()) temp.regNumber = "Registration certificate required";
    if (!regFile) temp.regFile = "Registration file required";

    if (!accrNumber.trim()) temp.accrNumber = "Accreditation number required";
    if (!accrFile) temp.accrFile = "Accreditation file required";

    // Dynamic validation
    extraCerts.forEach((row) => {
      if (!row.title.trim()) temp[`title_${row.id}`] = "Title required";
      if (!row.file) temp[`file_${row.id}`] = "File required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /** Add extra certificate row */
  const addRow = () => {
    setExtraCerts([...extraCerts, { id: Date.now(), title: "", file: null }]);
  };

  /** Remove row */
  const removeRow = (id) => {
    setExtraCerts(extraCerts.filter((item) => item.id !== id));
  };

  /** Update row */
  const updateRow = (id, field, value) => {
    setExtraCerts(
      extraCerts.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  /** SUBMIT ALL CERTIFICATES */
  const submitAll = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. Upload License
      const f1 = new FormData();
      f1.append("licenseNumber", licenseNumber);
      f1.append("certificateType", "hospital_license");
      f1.append("file", licenseFile);
      await API.post("/hospital/certificate", f1);

      // 2. Upload Registration Certificate
      const f2 = new FormData();
      f2.append("licenseNumber", regNumber);
      f2.append("certificateType", "registration");
      f2.append("file", regFile);
      await API.post("/hospital/certificate", f2);

      // 3. Upload Accreditation Certificate
      const f3 = new FormData();
      f3.append("licenseNumber", accrNumber);
      f3.append("certificateType", "accreditation");
      f3.append("file", accrFile);
      await API.post("/hospital/certificate", f3);

      // 4. Upload Extra (Dynamic) Certificates
      for (let row of extraCerts) {
        const fd = new FormData();
        fd.append("licenseNumber", row.title);
        fd.append("certificateType", "extra_certificate");
        fd.append("file", row.file);
        await API.post("/hospital/certificate", fd);
      }

      // OPEN POPUP
      if (hospitalBasic?.kycStatus !== "approved") {
        document.getElementById("openModal").click();
      }
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };
  const licenseDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setLicenseFile(file);
  };
  const licenseDragOver = (e) => {
    e.preventDefault();
  };

  const regDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setRegFile(file);
  };
  const regDragOver = (e) => {
    e.preventDefault();
  };
  const accrDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setAccrFile(file);
  };
  const accrDragOver = (e) => {
    e.preventDefault();
  };
  const otherDrop = (e, id) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setExtraCerts(
      extraCerts.map((item) =>
        item.id === id ? { ...item, file: file } : item,
      ),
    )
  };
  const otherDragOver = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    dispatch(fetchUserDetail())
  }, [dispatch])

  return (
    <>
      <section className="admin-login-section account-lg-section nw-create-account-section">
        <div className="container-fluid px-lg-0">
          {/* STEPS */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="account-step-main-bx">
                <NavLink to="/#">
                  <div className="account-step-crd account-progress-done">
                    <div className="account-step-bx account-step-complete">
                      <FaFlask className="account-step-icon" />
                    </div>
                    <h6>Hospital Details</h6>
                  </div>
                </NavLink>

                <NavLink to="/#">
                  <div className="account-step-crd account-progress-done">
                    <div className="account-step-bx account-step-complete">
                      <BsFillFileImageFill className="account-step-icon" />
                    </div>
                    <h6>Images</h6>
                  </div>
                </NavLink>

                <NavLink to="/#">
                  <div className="account-step-crd account-progress-done">
                    <div className="account-step-bx account-step-complete">
                      <FaMapMarkerAlt className="account-step-icon" />
                    </div>
                    <h6>Address</h6>
                  </div>
                </NavLink>

                <NavLink to="/#">
                  <div className="account-step-crd account-progress-done">
                    <div className="account-step-bx account-step-complete">
                      <FaUser className="account-step-icon" />
                    </div>
                    <h6>Contact Person</h6>
                  </div>
                </NavLink>

                <NavLink to="#">
                  <div className="account-step-crd">
                    <div className="account-step-bx">
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
            <div className="col-lg-5 col-md-8">
              <div className="nw-form-container">
                <div className="admin-vndr-login">
                  <h3>Upload License & Certificates</h3>
                  <p>Please upload all required documents</p>
                </div>

                {/* LICENSE SECTION */}
                <h6 className="fw-bold mb-3 fz-18">License Details</h6>
                <div className="upload-account-bx">
                  <div className="custom-frm-bx">
                    <label>Hospital License Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                    {errors.licenseNumber && (
                      <small className="text-danger">
                        {errors.licenseNumber}
                      </small>
                    )}
                  </div>

                  {/* <div className="custom-frm-bx">
                                    <label>Upload License</label>

                                    <input type="file" className="form-control"
                                        accept=".jpg,.png,.jpeg,.pdf"
                                        onChange={(e) => setLicenseFile(e.target.files[0])}
                                    />
                                    {errors.licenseFile && <small className="text-danger">{errors.licenseFile}</small>}
                                </div> */}

                  <div className="custom-frm-bx" onDrop={(e) => licenseDrop(e)}
                    onDragOver={licenseDragOver}>
                    <label>Upload License</label>
                    <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                      <div className="upload-icon mb-2">
                        <IoCloudUploadOutline />
                      </div>

                      <div>
                        <p className="fw-semibold mb-1">
                          <label
                            htmlFor="fileInput1"
                            className="file-label file-select-label"
                          >
                            Choose a file or drag & drop here
                          </label>
                        </p>

                        <small className="format-title">JPEG Format</small>

                        <div className="mt-3">
                          <label className="browse-btn">
                            Browse File
                            <input
                              type="file"
                              className="d-none"
                              accept=".jpg,.png,.jpeg,.pdf"
                              onChange={(e) =>
                                setLicenseFile(e.target.files[0])
                              }
                            />
                          </label>
                        </div>

                        {licenseFile &&
                          licenseFile.type.startsWith("image/") && (
                            <div className="mt-2">
                              <img
                                src={URL.createObjectURL(licenseFile)}
                                alt="preview"
                                style={{
                                  width: "150px",
                                  height: "80px",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          )}

                        {errors.licenseFile && (
                          <small className="text-danger">
                            {errors.licenseFile}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* REGISTRATION CERTIFICATE */}
                <h6 className="fw-bold mb-3 fz-18">Registration Certificate</h6>
                <div className="upload-account-bx">
                  <div className="custom-frm-bx">
                    <label>Registration Certificate Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                    />
                    {errors.regNumber && (
                      <small className="text-danger">{errors.regNumber}</small>
                    )}
                  </div>

                  {/* <div className="custom-frm-bx">
                                    <label>Upload Registration Certificate</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".jpg,.png,.jpeg,.pdf"
                                        onChange={(e) => setRegFile(e.target.files[0])}
                                    />
                                    {errors.regFile && (
                                        <small className="text-danger">{errors.regFile}</small>
                                    )}
                                </div> */}

                  <div className="custom-frm-bx" onDrop={(e) => regDrop(e)}
                    onDragOver={regDragOver}>
                    <label>Upload Registration Certificate</label>

                    <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                      <div className="upload-icon mb-2">
                        <IoCloudUploadOutline />
                      </div>

                      <div>
                        <p className="fw-semibold mb-1">
                          <label
                            htmlFor="fileInput2"
                            className="file-label file-select-label"
                          >
                            Choose a file or drag & drop here
                          </label>
                        </p>

                        <small className="format-title">JPEG Format</small>

                        <div className="mt-3">
                          <label className="browse-btn">
                            Browse File
                            <input
                              type="file"
                              className="d-none"
                              accept=".jpg,.png,.jpeg,.pdf"
                              onChange={(e) => setRegFile(e.target.files[0])}
                            />
                          </label>
                        </div>

                        {regFile && regFile.type.startsWith("image/") && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(regFile)}
                              alt="preview"
                              style={{
                                width: "150px",
                                height: "80px",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}

                        {errors.regFile && (
                          <small className="text-danger">
                            {errors.regFile}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACCREDITATION CERTIFICATE */}
                <h6 className="fw-bold mb-3 fz-18">
                  Accreditation Certificate
                </h6>
                <div className="upload-account-bx">
                  <div className="custom-frm-bx">
                    <label>Accreditation Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={accrNumber}
                      onChange={(e) => setAccrNumber(e.target.value)}
                    />
                    {errors.accrNumber && (
                      <small className="text-danger">{errors.accrNumber}</small>
                    )}
                  </div>

                  {/* <div className="custom-frm-bx">
                                    <label>Upload Accreditation Certificate</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".jpg,.png,.jpeg,.pdf"
                                        onChange={(e) => setAccrFile(e.target.files[0])}
                                    />
                                    {errors.accrFile && (
                                        <small className="text-danger">{errors.accrFile}</small>
                                    )}
                                </div> */}

                  <div className="custom-frm-bx" onDrop={(e) => accrDrop(e)}
                    onDragOver={accrDragOver}>
                    <label>Upload Accreditation Certificate</label>

                    <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                      <div className="upload-icon mb-2">
                        <IoCloudUploadOutline />
                      </div>

                      <div>
                        <p className="fw-semibold mb-1">
                          <label
                            htmlFor="fileInput3"
                            className="file-label file-select-label"
                          >
                            Choose a file or drag & drop here
                          </label>
                        </p>

                        <small className="format-title">JPEG Format</small>

                        <div className="mt-3">
                          <label className="browse-btn">
                            Browse File
                            <input
                              type="file"
                              className="d-none"
                              accept=".jpg,.png,.jpeg,.pdf"
                              onChange={(e) => setAccrFile(e.target.files[0])}
                            />
                          </label>
                        </div>

                        {accrFile && accrFile.type.startsWith("image/") && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(accrFile)}
                              alt="preview"
                              style={{
                                width: "150px",
                                height: "80px",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}

                        {errors.accrFile && (
                          <small className="text-danger">
                            {errors.accrFile}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXTRA CERTIFICATES */}
                <h6 className="fw-bold mb-3 fz-18">Other Certificates</h6>
                {extraCerts.map((row, index) => (
                  <div
                    key={row.id}
                    className="upload-account-bx nw-account-add-bx mb-3"
                  >
                    <div className="row">
                      <div className="col-lg-11">
                        <div className="custom-frm-bx">
                          <label>Certificate Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={row.title}
                            onChange={(e) =>
                              updateRow(row.id, "title", e.target.value)
                            }
                          />
                          {errors[`title_${row.id}`] && (
                            <small className="text-danger">
                              {errors[`title_${row.id}`]}
                            </small>
                          )}
                        </div>

                        {/* <div className="custom-frm-bx">
                                                    <label>Upload Certificate</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept=".jpg,.png,.jpeg,.pdf"
                                                        onChange={(e) =>
                                                            updateRow(row.id, "file", e.target.files[0])
                                                        }
                                                    />
                                                    {errors[`file_${row.id}`] && (
                                                        <small className="text-danger">
                                                            {errors[`file_${row.id}`]}
                                                        </small>
                                                    )}
                                                </div> */}

                        <div className="custom-frm-bx" onDrop={(e) => otherDrop(e, row.id)}
                          onDragOver={otherDragOver}>
                          <label>Upload Certificate</label>
                          <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                            <div className="upload-icon mb-2">
                              <IoCloudUploadOutline />
                            </div>

                            <div>
                              <p className="fw-semibold mb-1">
                                <label
                                  htmlFor="fileInput1"
                                  className="file-label file-select-label"
                                >
                                  Choose a file or drag & drop here
                                </label>
                              </p>

                              <small className="format-title">
                                JPEG Format
                              </small>

                              <div className="mt-3">
                                <label className="browse-btn">
                                  Browse File
                                  <input
                                    type="file"
                                    className="d-none"
                                    accept=".jpg,.png,.jpeg,.pdf"
                                    onChange={(e) =>
                                      updateRow(
                                        row.id,
                                        "file",
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                </label>
                              </div>

                              {row.file &&
                                row.file.type?.startsWith("image/") && (
                                  <div className="mt-2">
                                    <img
                                      src={URL.createObjectURL(row.file)}
                                      alt="preview"
                                      style={{
                                        width: "150px",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  </div>
                                )}

                              {errors[`file_${row.id}`] && (
                                <small className="text-danger">
                                  {errors[`file_${row.id}`]}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-1 d-flex align-items-center justify-content-end pe-0">

                        <button
                          type="button"
                          disabled={extraCerts?.length == 1}
                          className="text-danger"
                          onClick={() => removeRow(row.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                      </div>
                    </div>
                  </div>
                ))}

                {/* ADD MORE BUTTON */}
                <div className="text-end">
                  <button type="button" onClick={addRow} className="btn">
                    <FaPlusCircle
                      style={{ color: "#34A853", fontSize: "22px" }}
                    />
                  </button>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="mt-4 d-flex flex-column gap-3">
                  <button
                    className="admin-lg-btn w-100"
                    disabled={loading}
                    onClick={submitAll}
                  >
                    {loading ? "Submitting...." : "Submit"}
                  </button>
                  <Link
                    className="nw-thm-btn outline rounded-3 w-100"
                    to={'/dashboard'}
                  >
                    Skip And Continue
                  </Link>

                  <button
                    id="openModal"
                    data-bs-toggle="modal"
                    data-bs-target="#edit-Request"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
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

      {/* SUBMISSION POPUP */}
      <div
        className="modal step-modal fade"
        id="edit-Request"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content edit-modal-content p-4">
            <div className="text-end">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="fz-18 text-danger"
                data-bs-dismiss="modal"
              >
                Logout
              </button>
            </div>

            <div className="modal-body text-center">
              <FontAwesomeIcon icon={faCopy} className="document-icon" />

              <h6 className="text-white my-3">
                Your documents have been submitted.
              </h6>
              <p>KYC verification is in progress.</p>

              <button
                className="thm-btn w-75 mt-4"
                data-bs-dismiss="modal"
                onClick={() => navigate("/login")}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccountUpload;
