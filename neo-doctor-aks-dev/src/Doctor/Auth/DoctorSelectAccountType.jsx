import {

  faArrowRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Navigate, NavLink } from "react-router-dom";

function DoctorSelectAccountType() {
  return (
    <>
      <section className="admin-login-section nw-hero-section ">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="admin-pisture-bx">
                <div className="position-relative">
                  <Link to='/' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                </div>

                <img src="/new-login-bnnr.png" alt="" />
              </div>
            </div>

            <div className="col-lg-6 col-md-12 col-sm-12 align-content-center">

              <div className="nw-form-container">
                <div className="login-logo">
                  <img src="/logo.png" alt="" />
                </div>

                <div className="admin-vndr-login my-3">
                  <h3 className="heading-grad">Select Account Type </h3>
                  <p>Sign up and Login Account</p>
                </div>

                <div className="doctor-type-bx mb-3">
                  <div className="doctor-mega-type-bx">
                    <div className="doctor-type-content">
                      <img src="/doctor-type-pic.png" alt="" />
                      <div className="nw-content-type">
                        <h4>I am a Doctor</h4>
                        <p>Access verified doctor tools, create e-prescriptions, manage patients, and get AI clinical support.</p>
                      </div>
                    </div>
                    <div>
                      <Link to='/create-account' className="go-nw-doctr-btn"><FontAwesomeIcon icon={faArrowRight} /></Link>
                    </div>
                  </div>
                </div>

                <div className="doctor-type-bx mb-3">
                  <div className="doctor-mega-type-bx">
                    <div className="doctor-type-content">
                      <img src="/patient-type-pic.png" alt="" />
                      <div className="nw-content-type">
                        <h4>I am a Patient</h4>
                        <p>Create your digital health card, view
                          prescriptions, upload reports, and get personalized health</p>
                      </div>
                    </div>
                    <div>
                      <Link to='/create-account' className="go-nw-patient-btn"><FontAwesomeIcon icon={faArrowRight} /></Link>
                    </div>
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

export default DoctorSelectAccountType