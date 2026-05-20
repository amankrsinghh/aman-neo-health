import { FaFlask } from "react-icons/fa6";
import { BsFillFileImageFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";

function CreateAccountImage() {
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleGallery = (e) => {
    let files = [...e.target.files];

    if (files.length > 3) {
      setErrors({ gallery: "You can upload max 3 images" });
      return;
    }

    setGallery(files);
    setErrors({});
  };
  const thumbnailDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setThumbnail(file);
  };
  const thumbnailDragOver = (e) => {
    e.preventDefault();
  };
  const galaryDrop = (e) => {
    e.preventDefault();

    // Get files from the dataTransfer object
    let files = [...e.dataTransfer.files];

    if (files.length > 3) {
      setErrors({ gallery: "You can upload max 3 images" });
      return;
    }
    setGallery(files);
  };
  const galaryDragOver = (e) => {
    e.preventDefault();
  };

  const uploadImages = async () => {
    if (!thumbnail) {
      setErrors({ thumbnail: "Thumbnail image is required" });
      return;
    }

    if (gallery.length === 0) {
      setErrors({ gallery: "Please upload hospital images" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);

      gallery.forEach((img) => {
        formData.append("gallery", img);
      });

      const res = await API.post("/hospital/images", formData);

      console.log("IMAGES UPLOADED:", res.data);

      navigate("/create-account-address", { replace: true });
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="admin-login-section account-lg-section nw-create-account-section">
        <div className="container-fluid px-lg-0">
          {/* TOP STEPS */}
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
                  <div className="account-step-crd account-step-one">
                    <div className="account-step-bx">
                      <BsFillFileImageFill className="account-step-icon" />
                    </div>
                    <h6>Images</h6>
                  </div>
                </NavLink>
                <NavLink to="#">
                  <div className="account-step-crd account-step-one">
                    <div className="account-step-bx account-unstep-card">
                      <FaMapMarkerAlt className="account-step-icon" />
                    </div>
                    <h6>Address</h6>
                  </div>
                </NavLink>
                <NavLink to="#">
                  <div className="account-step-crd account-step-one">
                    <div className="account-step-bx account-unstep-card">
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
              <div className="nw-form-container">
                <div className="admin-vndr-login">
                  <h3>Upload Hospital Images</h3>
                  <p>Please upload the required images</p>
                </div>

                {/* Thumbnail */}
                <div className="custom-frm-bx" onDrop={(e) => thumbnailDrop(e)}
                  onDragOver={thumbnailDragOver}>
                  <label>Upload Thumbnail Image</label>

                  <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                    <div className="upload-icon">
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
                            accept=".png,.jpg,.jpeg"
                            className="d-none"
                            onChange={handleThumbnail}
                          />
                        </label>
                      </div>

                      {thumbnail && (
                        <p className="mt-2 text-success">{thumbnail.name}</p>
                      )}

                      {errors.thumbnail && (
                        <small className="text-danger">
                          {errors.thumbnail}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="custom-frm-bx" onDrop={(e) => galaryDrop(e)}
                  onDragOver={galaryDragOver}>
                  <label>Upload Hospital Images (Max 3)</label>

                  <div className="upload-box nw-upload-bx p-3 justify-content-center align-items-center">
                    <div className="upload-icon">
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
                          Browse Files
                          <input
                            type="file"
                            multiple
                            accept=".png,.jpg,.jpeg"
                            className="d-none"
                            onChange={handleGallery}
                          />
                        </label>
                      </div>

                      {gallery.length > 0 && (
                        <ul className="mt-2">
                          {gallery.map((g, i) => (
                            <li key={i}>{g.name}</li>
                          ))}
                        </ul>
                      )}

                      {errors.gallery && (
                        <small className="text-danger">{errors.gallery}</small>
                      )}
                    </div>
                  </div>
                </div>

                {/* NEXT BUTTON */}
                <div className="mt-4 gap-3 d-flex flex-column">
                  <button
                    className="admin-lg-btn w-100"
                    onClick={uploadImages}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? "Submitting..." : "Next"}
                  </button>
                   <Link
                    className="nw-thm-btn outline rounded-3 w-100"
                    to={'/create-account-address'}
                  >
                    Skip And Continue
                  </Link>
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
    </>
  );
}

export default CreateAccountImage;
