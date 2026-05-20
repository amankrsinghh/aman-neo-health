import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import { postApiData } from "../../Services/api";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate=useNavigate()
  const [contactNumber,setContactNumber]=useState('')
   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await postApiData('pharmacy/forgot-password', {contactNumber})
        if (response.success) {
          toast.success('Otp sent successfully')
          navigate(`/otp?contact=${contactNumber}&type=forgot-password`)
        } else {
          toast.error(response.message)
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong")
      }
    };
  return (
    <>
    <section className="admin-login-section ">
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 px-0 mb-sm-3 mb-lg-0">
            <div className="admin-pisture-bx">
              <img src="pharmacy-login-bnnr.jpg" alt="" />
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12 d-flex flex-column justify-content-center">
            <div>
                <div className="admin-frm-vendor-bx">
              <div className="admin-lg-title">
                <h4 className="mb-0"><a href="javascript:void(0)" className="dash-hp-title">
                <img src="/logo.png" alt="" />
              </a></h4>
              </div>

              <div className="admin-vendor-login">
                <div className="admin-vndr-login">
                  <h3 className="text-grad">Forgot Password</h3>
                  <p>Please enter mobile number below</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="custom-frm-bx admin-frm-bx">
                    <label htmlFor="">Mobile Number</label>
                    <input
                      type="number"
                      value={contactNumber}
                      onChange={(e)=>setContactNumber(e.target.value)}
                      className="form-control nw-frm-select"
                      placeholder="Enter Mobile Number"
                    />
                  </div>

                  <div className='mt-3'>
                    <button type="submit" className="nw-thm-btn py-3 w-100">
                      Submit
                    </button>
                  </div>
                </form>
              </div>

            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default ForgotPassword