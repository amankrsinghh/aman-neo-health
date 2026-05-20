import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IMAGE_BASE_URL } from "../../utils/config";

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/ad-usr-logo.jpg");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/admin/profile");
        const data = res.data.data;

        setName(data.name || "");
        setMobile(data.mobile || "");
        setEmail(data.email || "");
        setGst(data.gst_number || "");
        setAbout(data.about || "");
        if (data.image) {
          setPreview(`${IMAGE_BASE_URL}${data.image}`);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !mobile) {
      toast.error("Name and Mobile are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("gst_number", gst);
    formData.append("about", about);
    if (image) formData.append("image", image);

    try {
      setSaving(true);

      await api.put("/api/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/user-profile");
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Doctor Detail</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#" className="breadcrumb-link">
                        Dashboard
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Doctor Detail
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="employee-tabs usr-profile-tabs">
            <ul
              className="nav nav-tabs gap-3 usr-ad-profile"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  href="#home"
                  role="tab"
                >
                  Profile
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
                  Password
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="new-mega-card mt-3">
          <div className="row">
            <div className="col-lg-12">
              <div className="">
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                  >
                    <form action="">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="">
                            <div className="lab-profile-mega-bx">
                              <div className="lab-profile-avatr-bx  position-relative">
                                <img src={preview} alt="" />
                                <div className="ad-edit-select-file">
                                  <a
                                    href="javascript:void(0)"
                                    className="edit-btn cursor-pointer"
                                  >
                                    <FontAwesomeIcon icon={faPen} />
                                  </a>
                                </div>
                                <input
                                  type="file"
                                  className="lab-profile-file-input"
                                  onChange={handleImageChange}
                                />
                              </div>

                              <div>
                                <h4 className="lg_title ">Jonh Smith</h4>
                                <p className="first_para">Admin</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="custom-frm-bx">
                            <label htmlFor="">Name</label>
                            <input
                              type="text"
                              className="form-control patient-frm-control"
                              placeholder=""
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="custom-frm-bx">
                            <label htmlFor="">Mobile Number</label>
                            <input
                              type="number"
                              className="form-control patient-frm-control"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="custom-frm-bx">
                            <label htmlFor="">Email Number</label>
                            <input
                              type="email"
                              className="form-control patient-frm-control"
                              value={email}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="custom-frm-bx">
                            <label htmlFor="">Gst Number</label>
                            <input
                              type="number"
                              className="form-control patient-frm-control"
                              value={gst}
                              onChange={(e) => setGst(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="custom-frm-bx">
                            <label htmlFor="">About</label>
                            <textarea
                              className="form-control patient-frm-control"
                              value={about}
                              onChange={(e) => setAbout(e.target.value)}
                            ></textarea>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                          <button
                            type="button"
                            className="nw-filtr-thm-btn outline"
                            onClick={() => navigate("/user-profile")}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="nw-filtr-thm-btn"
                            disabled={saving}
                            onClick={handleSave}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;