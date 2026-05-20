import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDateTime } from "../../Services/globalFunction"
import { Link } from "react-router-dom"

function Congratulations() {
  const data=JSON.parse(sessionStorage.getItem('newAptData'))
  return (
    <>
    <section className="error-section">
      <div className="container">
      <div className="row">
        <div className="col-lg-12">

            <div className="">
                <a href="javascript:void(0)" className="back-btn"> <FontAwesomeIcon icon={faChevronLeft}/> </a>
            </div>

          <div className="text-center">
            <div className="error-picture-bx">
            <img src="/congratulations.png" alt="" />
          </div>
          <div>
            <h4 className="title" style={{color : "#34A853"}}>Congratulations!</h4>
            <p className="new_para fz-18">Your appointment with {data?.name} is <br /> confirmed for <span className="fw-700 ">{formatDateTime(data?.date)}</span></p>

            <div className="pt-3">
                <Link to='/my-appointment' onClick={()=>sessionStorage.removeItem('newAptData')} className="nw-thm-btn">My  Appointment</Link>
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

export default Congratulations