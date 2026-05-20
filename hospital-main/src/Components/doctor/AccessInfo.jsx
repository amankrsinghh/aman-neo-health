import { useState, useEffect } from "react";


function AccessInfo({ staffData, setStaffData, onFinalSubmit }) {
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [accessEmail, setAccessEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ===== TAB NAV =====
  const goToBackTab = () => {
    document.querySelector('a[href="#employment"]')?.click();
  };

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


const handleFinalSubmit = () => {
  if (!validate()) return;

  if (password && password !== confirmPassword) {
    alert("Password and Confirm Password do not match");
    return;
  }

  const accessInfo = {
    username,
    accessEmail
  };

  // ✅ password ONLY if user entered new one
  if (password) {
    accessInfo.password = password;
  }

  setStaffData(prev => ({
    ...prev,
    accessInfo
  }));

  if (typeof onFinalSubmit === "function") {
    onFinalSubmit();
  }
};



  useEffect(() => {
  if (!staffData?.accessInfo) return;

  const a = staffData.accessInfo;

  setUsername(a.username || "");
  setAccessEmail(a.accessEmail || "");

  setPassword("");
  setConfirmPassword("");

}, [staffData]);


const validate = () => {
  let newErrors = {};

  if (!username.trim()) {
    newErrors.username = "Username is required";
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
                                                        <label>Username</label>
                                                        <input
                                                            type="text"
                                                            className="form-control nw-frm-select"
                                                            placeholder="Enter Username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                        />
                                                        {errors.username && (
                                                            <small className="text-danger">{errors.username}</small>
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
                                                {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div class="custom-frm-bx">
                                                        <label>Permission Type</label>
                                                        <div class="select-wrapper">
                                                            <select class="form-select custom-select">
                                                                <option>---Select Permission Type---</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                </div> */}

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
