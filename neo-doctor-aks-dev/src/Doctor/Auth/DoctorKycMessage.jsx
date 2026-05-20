import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function DoctorKycMessage() {
    const navigate=useNavigate()
    useEffect(()=>{
        setTimeout(() => {
            localStorage.clear()
            sessionStorage.clear()
            navigate('/')
        }, 5000);
    },[])
    return (
        <>
            {/* <section className="error-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4">
                            <div className="text-center  kyc-notice-bx">
                                <div className="submit-document-bx kyc-done-message">
                                    <FontAwesomeIcon icon={faCopy} className="document-kyc-icon" />
                                    <div className="timr-ky-bx">
                                        <img src="/timer.png" alt="" />
                                    </div>
                                </div>
                                <div className="my-4">
                                    <h6 className="fz-16 fw-400">Your documents have been submitted for verification. This <br /> may take up to 48 hours. You’ll be notified once approved.</h6>
                                </div>
                                <div className="kyc-verification-bx">
                                    <p>“Your KYC verification is in progress. You can continue browsing but cannot <br /> access patient data until approval.”</p>
                                </div>
                                <div className="mt-5">
                                    <a href="javascript:void(0)" onClick={()=>{
                                        localStorage.clear()
                                        sessionStorage.clear()
                                        navigate('/')
                                    }} className="nw-thm-btn w-50" data-bs-dismiss="modal">OK</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            <section className="error-section">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-5">
        <div className="text-center your-document-mega-dv">
          <div className="submit-document-bx kyc-done-message">
            <FontAwesomeIcon icon={faCopy} className="document-icon" />
            <div className="timr-bx">
              <img src="/timer.png" alt="" />
            </div>
          </div>

          <div className="kyc-approve-bx my-3">
            <h6 
              className="fz-20 fw-500" 
              style={{ color: "#052F59" }}
            >
              Your documents have been submitted for verification. This may take up to 48 hours. You’ll be notified once approved.
            </h6>
          </div>
          <div className="kyc-verification-bx my-3">
            <p>
              “Your KYC verification is in progress. You can continue browsing but cannot access patient data until approval.”
            </p>
          </div>

          <div className="mt-4">
            <a
              href="javascript:void(0)"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/");
              }}
              className="nw-thm-btn w-50"
            >
              OK
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>
            </section>

        </>
    )
}

export default DoctorKycMessage