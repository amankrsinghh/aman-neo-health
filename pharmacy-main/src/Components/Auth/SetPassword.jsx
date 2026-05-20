import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import base_url from '../../baseUrl'
import { toast } from 'react-toastify'
import { useState } from 'react'

function SetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isConf, setIsConf] = useState(false)
  const [isPass, setIsPass] = useState(false)
  const token = localStorage.getItem('otoken')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password and confirm password was not match")
      return
    }
    const data = {  password }
    try {
      const response = await axios.post(`${base_url}/pharmacy/reset-password`, data, {
        headers: {
          'Token': localStorage.getItem('ftoken')
        }
      });
      if (response.data.success) {
        toast.success("Password changed successfully")
        navigate('/login')
        sessionStorage.clear()
        localStorage.clear()
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }
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
                      <h3 className='text-grad'>Set Password</h3>
                      <p>Create a strong password to keep your account secure.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="custom-frm-bx admin-frm-bx">
                        <label htmlFor="">New Password</label>
                        <input
                          type={isPass ? "password" : "text"}
                          className="form-control nw-frm-select pe-5"
                          placeholder="*******"
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="pass-eye-bx">
                          <button type="button" onClick={(e) => setIsPass(!isPass)} className="pass-eye-slash-btn">
                            <FontAwesomeIcon icon={isPass ? faEye : faEyeSlash} />
                          </button>
                        </div>
                      </div>

                      <div className="custom-frm-bx admin-frm-bx">
                        <label htmlFor="">Confirm Password</label>
                        <input
                          type={isConf ? "password" : "text"}
                          className="form-control nw-frm-select pe-5"
                          placeholder="*******"
                          value={confirmPassword}
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="pass-eye-bx">
                          <button type="button" onClick={(e) => setIsConf(!isConf)} className="pass-eye-slash-btn">
                            <FontAwesomeIcon icon={isConf ? faEye : faEyeSlash} />
                          </button>
                        </div>
                      </div>

                      <div className='mt-3'>
                        <button type="submit" className="admin-lg-btn">
                          Save
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

export default SetPassword