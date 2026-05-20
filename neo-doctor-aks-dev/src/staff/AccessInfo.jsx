import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getSecureApiData } from "../Services/api";


function AccessInfo({ staffData, setStaffData, onFinalSubmit }) {
  const { user } = useSelector(state => state.user)
  const userId = user?._id
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({});
  const [contactNumber, setContactNumber] = useState("");
  const [accessEmail, setAccessEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permisions, setPermissions] = useState([])
  const [permissionId, setPermissionId] = useState()
  // ===== TAB NAV =====
  const goToBackTab = () => {
    document.querySelector('a[href="#employment"]')?.click();
  };
  useEffect(() => {
    dispatch(fetchUserDetail())
  }, [])

  // ===== FINAL SUBMIT =====
  //   const handleFinalSubmit = () => {
  //     if (password !== confirmPassword) {
  //       alert("Password and Confirm Password do not match");
  //       return;
  //     }

  //     if (typeof setStaffData !== "function") {
  //       console.error("setStaffData not received in AccessInfo");
  //       return;
  //     }

  //     const accessInfo = {
  //       username,
  //       accessEmail,
  //       password
  //     };

  //     setStaffData(prev => ({
  //       ...prev,
  //       accessInfo
  //     }));

  //     // optional API call trigger
  //     if (typeof onFinalSubmit === "function") {
  //       onFinalSubmit();
  //     }
  //   };

  const fetchHospitalPermission = async () => {
    try {
      const response = await getSecureApiData(`api/comman/permission/${userId}?limit=100&type=hospital`);
      if (response.success) {
        setPermissions(response.data)
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");;
    }
  }
  useEffect(() => {
    if (userId) {

      fetchHospitalPermission()
    }
  }, [userId])
  const handleFinalSubmit = () => {
    if (!validate()) return;

    if (password && password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    const accessInfo = {
      contactNumber,
      accessEmail, permissionId
    };

    // ✅ password ONLY if user entered new one
    if (password) {
      accessInfo.password = password;
    }
    const updatedStaffData = { ...staffData, accessInfo };

    setStaffData(updatedStaffData);


    if (typeof onFinalSubmit === "function") {
      onFinalSubmit(updatedStaffData);
    }
  };


  useEffect(() => {
    if (!staffData?.accessInfo) return;

    const a = staffData.accessInfo;

    setContactNumber(a.contactNumber || "");
    setAccessEmail(a.accessEmail || "");
    setPermissionId(a.permissionId || "");

    setPassword("");
    setConfirmPassword("");

  }, [staffData]);


  const validate = () => {
    let newErrors = {};

    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }

    if (!accessEmail) {
      newErrors.accessEmail = "Access email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accessEmail)) {
      newErrors.accessEmail = "Invalid email format";
    }

    // Password validation (ONLY if user enters it)
    if (password) {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };





  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <h4 className="lg_title text-black fw-700 mb-3">Access</h4>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label>Hospital Id</label>
              <input
                type="number"
                className="form-control nw-frm-select"
                readOnly
                value={user?.nh12}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label>Contact Number</label>
              <input
                type="number"
                className="form-control nw-frm-select"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              {errors.contactNumber && (
                <small className="text-danger">{errors.contactNumber}</small>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label>Email for Access</label>
              <input
                type="email"
                className="form-control nw-frm-select"
                placeholder="Enter Email  Address"
                value={accessEmail}
                onChange={(e) => setAccessEmail(e.target.value)}
              />
              {errors.accessEmail && (
                <small className="text-danger">{errors.accessEmail}</small>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label>Temporary Password</label>
              <input
                type="password"
                className="form-control nw-frm-select"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="custom-frm-bx">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control nw-frm-select"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </div>
          </div>
          <div className="col-lg-12 my-3">
            <div className="">
              <h5 className="add-contact-title">Permission</h5>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div class="custom-frm-bx">
              <label>Permission Type</label>
              <div class="select-wrapper">
                <select class="form-select custom-select" value={permissionId} required
                  name="permissionId" onChange={(e) => setPermissionId(e.target.value)}>
                  <option>---Select Permission Type---</option>
                  {permisions.map((perm) => (
                    <option key={perm._id} value={perm._id}>
                      {perm.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          <div className="d-flex align-items-center justify-content-end gap-3">
            <button type="button" className="nw-thm-btn outline rounded-3" onClick={goToBackTab}>Back</button>
            <button type="button" className="nw-thm-btn rounded-3" onClick={handleFinalSubmit}>Submit</button>
          </div>


        </div>
      </form>
    </>
  );
}

export default AccessInfo;
