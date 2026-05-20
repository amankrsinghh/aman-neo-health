import { useEffect, useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../api/api"; // axios instance
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required check
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    // New ≠ Current
    if (currentPassword === newPassword) {
      return toast.error("New password must be different from current password");
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      return toast.error("New password & confirm password do not match");
    }
    try {
      await API.post("/hospital/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (localStorage.getItem('doctorId')) {
      navigate('/dashboard')
    }
  }, [])
  return (
    <div className="main-content flex-grow-1 p-3">
      <form action="">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between sub-header-bx">
            <div>
              <h3 className="innr-title mb-2">Change Password</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <NavLink to="/dashboard" className="breadcrumb-link">
                        Dashboard
                      </NavLink>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      Change Password
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="new-panel-card">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-12 col-sm-12">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value="hospital@email.com"
                readOnly
                hidden
              />
              {/* Current Password */}
              <div className="custom-frm-bx">
                <label>Current Password</label>
                <input
                  type={show.current ? "text" : "password"}
                  className="form-control pe-5 nw-frm-select"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <span
                  className="search-item-bx"
                  onClick={() => setShow({ ...show, current: !show.current })}
                >
                  <FontAwesomeIcon icon={show.current ? faEye : faEyeSlash} />
                </span>
              </div>

              {/* New Password */}
              <div className="custom-frm-bx">
                <label>New Password</label>
                <input
                  type={show.new ? "text" : "password"}
                  className="form-control pe-5 nw-frm-select"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <span
                  className="search-item-bx"
                  onClick={() => setShow({ ...show, new: !show.new })}
                >
                  <FontAwesomeIcon icon={show.new ? faEye : faEyeSlash} />
                </span>
              </div>

              {/* Confirm Password */}
              <div className="custom-frm-bx">
                <label>Confirm New Password</label>
                <input
                  type={show.confirm ? "text" : "password"}
                  className="form-control pe-5 nw-frm-select"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <span
                  className="search-item-bx"
                  onClick={() => setShow({ ...show, confirm: !show.confirm })}
                >
                  <FontAwesomeIcon icon={show.confirm ? faEye : faEyeSlash} />
                </span>
              </div>

              <div className="text-center mt-3">
                <button className="nw-thm-btn" type="submit">
                  Change Password
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
      <div className="text-end mt-4">
        <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
      </div>
    </div>
  );
}

export default ChangePassword;
