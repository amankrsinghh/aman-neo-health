import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../../utils/config";

function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/admin/profile");
        setProfile(res.data.data);
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All password fields are required");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    if (newPassword.length < 8)
      return toast.error("New password must be at least 8 characters");

    setSaving(true);
    try {
      await api.put("/api/admin/change-password", { currentPassword, newPassword });
      Swal.fire({
        title: "Password Changed",
        text: "You will be logged out for security.",
        icon: "success", confirmButtonText: "OK", allowOutsideClick: false
      }).then(() => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/login", { replace: true });
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setSaving(false); }
  };

  const imgSrc = profile?.profileImage
    ? `${IMAGE_BASE_URL}/uploads/admin/${profile.profileImage}`
    : "/ad-usr-logo.jpg";

  if (loading) return <div className="p-4 text-muted">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="main-content flex-grow-1 p-3 overflow-auto">
      {/* Header */}
      <div className="row mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="innr-title mb-2 gradient-text">Admin Profile</h3>
            <div className="admin-breadcrumb">

              <nav aria-label="breadcrumb">
                <ol className="breadcrumb custom-breadcrumb">
                  <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                  <li className="breadcrumb-item active">Admin Profile</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="employee-tabs usr-profile-tabs">
        <ul className="nav nav-tabs gap-3 usr-ad-profile" id="profileTab" role="tablist">
          <li className="nav-item" role="presentation">
            <a className="nav-link active" data-bs-toggle="tab" href="#tab-profile" role="tab">Profile</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" data-bs-toggle="tab" href="#tab-password" role="tab">Password</a>
          </li>
        </ul>
      </div>

      <div className="new-mega-card mt-3">
        <div className="tab-content" id="profileTabContent">

          {/* ── Profile Tab ── */}
          <div className="tab-pane fade show active" id="tab-profile" role="tabpanel">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex align-items-center justify-content-between ad-usr-profile mb-4">
                  <div className="lab-profile-mega-bx">
                    <div className="lab-profile-avatr-bx">
                      <img src={imgSrc} alt=""
                        onError={e => { e.target.src = "/ad-usr-logo.jpg"; }} />
                    </div>
                    <div>
                      <h4 className="lg_title">{profile.name || "Admin"}</h4>
                      <p className="first_para text-capitalize">{profile.role}</p>
                      {profile.unique_id && <p className="text-muted" style={{ fontSize: 12 }}>#{profile.unique_id}</p>}
                    </div>
                  </div>
                  <NavLink to="/edit-profile" className="add-nw-btn nw-thm-btn sub-nw-brd-tbn">
                    Edit Profile
                  </NavLink>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="custom-frm-bx">
                  <label>Name</label>
                  <input type="text" className="form-control patient-frm-control"
                    value={profile.name || ""} readOnly />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="custom-frm-bx">
                  <label>Mobile Number</label>
                  <input type="text" className="form-control patient-frm-control"
                    value={profile.contactNumber || ""} readOnly />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="custom-frm-bx">
                  <label>Email</label>
                  <input type="email" className="form-control patient-frm-control"
                    value={profile.email || ""} readOnly />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="custom-frm-bx">
                  <label>NHC ID</label>
                  <input type="text" className="form-control patient-frm-control"
                    value={profile.unique_id || "—"} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* ── Password Tab ── */}
          <div className="tab-pane fade" id="tab-password" role="tabpanel">
            <div className="row">
              {[
                { label: "Current Password", val: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
                { label: "New Password", val: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(v => !v) },
                { label: "Confirm New Password", val: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
              ].map(({ label, val, set, show, toggle }) => (
                <div className="col-lg-4 col-md-6" key={label}>
                  <div className="custom-frm-bx">
                    <label>{label}</label>
                    <input type={show ? "text" : "password"}
                      className="form-control pe-5 nw-select-frm"
                      placeholder={`Enter ${label}`}
                      value={val} onChange={e => set(e.target.value)} />
                    <div className="search-item-bx">
                      <button type="button" className="search-item-btn" onClick={toggle}>
                        <FontAwesomeIcon icon={show ? faEye : faEyeSlash} className="text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 text-end">
                <button type="button" className="add-nw-btn nw-thm-btn sub-nw-brd-tbn d-inline-block"
                  onClick={handleChangePassword} disabled={saving}>
                  {saving ? "Saving..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default UserProfile;
