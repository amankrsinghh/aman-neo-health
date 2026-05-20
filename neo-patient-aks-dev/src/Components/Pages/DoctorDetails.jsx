import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RatingSlider from "./RatingSlider";
import base_url, { client_url } from "../../baseUrl";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
function DoctorDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [isFull, setIsFull] = useState(false)
  const [loading, setLoading] = useState(false)
  const [doctorCertificate, setDoctorCertificate] = useState([])
  const [doctorData, setDoctorData] = useState([])
  const [doctorAbout, setDoctorAbout] = useState()
  const [totalPaitents, setTotalPatients] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [ratings, setRatings] = useState([])
  const [favIds, setFavIds] = useState([])
  const [doctorTest, setDoctorTest] = useState([])
  const [selectedTest, setSelectedTest] = useState([])
  async function fetchDoctorData() {
    setLoading(true)
    try {
      const result = await getApiData(`doctor/data/${params.id}`)
      if (result.success) {
        setRatings(result.rating)
        setDoctorCertificate(result.doctorLicense?.medicalLicense)
        setAvgRating(result.avgRating)
        setDoctorData(result.user)
        setTotalPatients(result.totalPatients)
        setDoctorAbout(result.doctorAbout)
        setIsFull(result?.doctorAbout?.aboutYou > 150 ? true : false)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  async function fetchFavData() {
    if(!userId){
      return
    }
    const result = await getSecureApiData(`patient/favorite/${userId}?limit=1000000`)
    if (result.success) {
      setFavIds(result.data)
    }
  }

  useEffect(() => {
    fetchDoctorData()
  }, [params])
  useEffect(() => {
    fetchFavData()
  }, [userId])
  const handleFavorite = async () => {
    const data = { userId, doctorId: params.id }
    try {
      const response = await securePostData('patient/favorite', data)
      if (response.success) {
        // toast.success("")
        fetchFavData()
      } else {
        toast.success(response.message)
      }
    } catch (error) {

    }
  }
  const handleCopy = () => {
    const text = `${client_url}/doctor-details/${params?.name}/${params.id}`;
    if (navigator.clipboard && window.isSecureContext) {
      // Modern clipboard API
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Copy failed"));
    } else {
      // Fallback for HTTP / older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Copied to clipboard!");
      } catch (err) {
        toast.error("Copy failed");
      }
      document.body.removeChild(textArea);
    }

  };

  return (
    <>
      <section className="tp-breadcrum-section">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="text-center">
                <h4 className="lg_title">Doctor Details</h4>
              </div>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <NavLink to="/" className="breadcrumb-link">
                        <FontAwesomeIcon icon={faHome} />
                      </NavLink>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      Doctor Details
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='doctor-details-seaction '>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="date-time-main-bx">
                <div className="doctor-parent-crd ">
                  <div className="doctor-detailsseaction-contant">
                    <div className="doctor-detailsseaction-contant-img">
                      <img src={doctorData?.profileImage ?
                        `${base_url}/${doctorData?.profileImage}` :
                        "/docer.png"} alt="doctor" />
                    </div>
                    <div className="doctor-detailsseaction-contant-text flex-grow-1 ">
                      <div className="d-flex justify-content-between  align-items-start">
                        <div className="docotr-estetment-bx">
                          <h4>Dr. {doctorData?.name}</h4>
                          <h6> {doctorAbout?.specialty?.name}  <span className="slash-title"> | </span> {doctorAbout?.hospitalName} </h6>
                          <p> Language : <span className="language-title">{doctorAbout?.language?.map(l => l).join(', ')}</span> </p>
                          <h5> <i className="fas fa-map-marker-alt me-1" style={{ color: "#052F59" }}></i> {doctorAbout?.cityId?.name + ', ' + doctorAbout?.stateId?.name} </h5>
                        </div>
                        <div className="ms-auto d-flex gap-3">
                          <button className="heart-btn" onClick={handleFavorite}>
                            {favIds?.some(fav => fav?.doctorId === params.id) ?
                              <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                              : <i className="fa-regular fa-heart"></i>}</button>
                          <button className="heart-btn" onClick={handleCopy}><i className="fas fa-share-alt"></i></button>
                        </div>
                      </div>
                      <div className="contentcardicon mt-3">
                        <div className=" d-flex align-items-center gap-3">
                          <div className="doctor-detailsseaction-contant-text-icon">
                            <span className="doctor-nw-icon"><i className="fas fa-user-friends"></i></span>
                          </div>
                          <div>
                            <h5>{totalPaitents}</h5>
                            <p>Patients</p>
                          </div>
                        </div>
                        <div className=" d-flex align-items-center gap-3">
                          <div className="doctor-detailsseaction-contant-text-icon">
                            <span className="doctor-nw-icon"><i className="fas fa-award"></i></span>
                          </div>
                          <div>
                            <h5>{doctorCertificate?.length}</h5>
                            <p>Certificates</p>
                          </div>
                        </div>
                        <div className=" d-flex align-items-center gap-3">
                          <div className="doctor-detailsseaction-contant-text-icon">
                            <span className="doctor-nw-icon"> <i class="fas fa-star"></i></span>
                          </div>
                          <div>
                            <h5>{avgRating}</h5>
                            <p>Rating</p>
                          </div>
                        </div>
                        <div className=" d-flex align-items-center gap-3">
                          <div className="doctor-detailsseaction-contant-text-icon">
                            <span className="doctor-nw-icon"><i className="fas fa-money-bill-wave"></i></span>
                          </div>
                          <div>
                            <h5>₹{doctorAbout?.fees}</h5>
                            <p>Fees</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-end mt-4 mobile-patient-box">
                        <Link to={`/book-doctor-appointment/${doctorData?.name}/${doctorData?.userId}`} className='nw-thm-btn'>Book Appointment</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-me">
                <h2>About Me</h2>
                <p className="new_para about-para">“{!isFull ?
                  doctorAbout?.aboutYou?.slice(0, 150) : doctorAbout?.aboutYou}” {doctorAbout?.aboutYou?.length > 150 && <button onClick={() => setIsFull(!isFull)} className="more-btn">{isFull ?
                    'Read Less' : 'Read More'}</button>} </p>
              </div>

              <div className="about-me specialty-bx my-3">
                <h2>Specialty</h2>
                <ul className="specialty-list">
                  <li className="specialty-item"> <span className="specialty-title"> {doctorAbout?.specialty?.name}</span></li>
                </ul>
              </div>

              <div className="about-me specialty-bx">
                <h2>Treatment Areas</h2>
                <ul className="specialty-list">
                  {doctorAbout?.treatmentAreas?.map((t, key) =>
                    <li className="specialty-item" key={key}> <span className="specialty-title"> {t.name}</span></li>)}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      <RatingSlider ratings={ratings} />


    </>

  )
}

export default DoctorDetails