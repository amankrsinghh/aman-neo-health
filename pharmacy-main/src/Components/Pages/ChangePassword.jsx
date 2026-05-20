import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { securePostData } from "../../Services/api";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function ChangePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isConf, setIsConf] = useState(false)
  const [isPass, setIsPass] = useState(false)
  const [isOld, setIsOld] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('otoken')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password and confirm password was not match")
      return
    }
    const data = { userId, oldPassword, newPassword: password }
    try {
      const response = await securePostData(`pharmacy/change-password`, data);
      if (response.success) {
        setConfirmPassword('')
        setOldPassword('')
        setPassword('')
        toast.success("Password changed successfully")
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <form action="">
          <div className="row mb-2">
            <div className="d-flex align-items-center justify-content-between">
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
        <div className="new-mega-card">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Current Password</label>
                  <input
                    type={isOld ? "password" : "text"}
                    className="form-control nw-frm-select "
                    placeholder="Enter Current Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <div className="search-item-bx">
                    <a href="javascript:void(0)" onClick={() => setIsOld(!isOld)} className="search-item-btn">
                      <FontAwesomeIcon icon={isOld ? faEye : faEyeSlash} className="text-black" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">New Password</label>
                  <input
                    type={isPass ? "password" : "text"}
                    className="form-control nw-frm-select "
                    placeholder="Enter New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="search-item-bx">
                    <a href="javascript:void(0)" onClick={() => setIsPass(!isPass)} className="search-item-btn">
                      <FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} className="text-black" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="custom-frm-bx">
                  <label htmlFor="">Confirm New Password</label>
                  <input
                    type={isConf ? "password" : "text"}
                    className="form-control nw-frm-select "
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="search-item-bx">
                    <a href="javascript:void(0)" onClick={() => setIsConf(!isConf)} className="search-item-btn">
                      <FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} className="text-black" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button type="submit" className="nw-thm-btn sub-nw-brd-tbn">Change Password</button>
              </div>
            </div>
          </form>
        </div>
        <div className="text-end mt-4">
          <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
        </div>
      </div>
    </>
  )
}

export default ChangePassword