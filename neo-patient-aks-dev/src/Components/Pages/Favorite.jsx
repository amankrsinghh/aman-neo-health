import { faLocationDot, faRoute, } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { useEffect, useState } from "react"
import { getSecureApiData, securePostData } from "../../Services/api"
import base_url from "../../baseUrl"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getDistanceInKm } from "../../Services/globalFunction"

function Favorite() {
    const userId = localStorage.getItem('userId')
    const [favIds, setFavIds] = useState([])
    const lat = localStorage.getItem('lat')
    const long = localStorage.getItem('long')
    const [activeTab, setActiveTab] = useState('doctor')
    const [counts, setCounts] = useState()
    async function fetchFavData() {
        const result = await getSecureApiData(`patient/favorite-data/${userId}?limit=1000000&type=${activeTab}`)
        if (result.success) {
            setFavIds(result.data)
            setCounts(result.counts)
        }
    }

    useEffect(() => {
        fetchFavData()
    }, [userId, activeTab])
    const handleFavorite = async (id) => {
        
        const data = { userId, labId: id }
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
    const handlePharFavorite = async (id) => {
        const data = { userId, pharId: id }
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
    const handleDoctorFavorite = async (id) => {
        const data = { userId, doctorId: id }
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
    const handleHospitalFavorite = async (id) => {
        const data = { userId, hospitalId: id }
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
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0"> Favorite </h5>
                </div>

                <div className="">
                    <div className="employee-tabs">
                        <ul className="nav nav-tabs gap-3 mt-3 px-3" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link active"
                                    id="home-tab"
                                    data-bs-toggle="tab"
                                    href="#home"
                                    role="tab"
                                    onClick={() => setActiveTab('doctor')}

                                >
                                    Doctor

                                    <span className="count-card">{counts?.doctor}</span>


                                </a>
                            </li>

                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="profile-tab"
                                    data-bs-toggle="tab"
                                    href="#profile"
                                    role="tab"
                                    onClick={() => setActiveTab('hospital')}

                                >
                                    Hospital

                                    <span className="count-card">{counts?.hospital}</span>
                                </a>
                            </li>

                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="contact-tab"
                                    data-bs-toggle="tab"
                                    href="#contact"
                                    role="tab"
                                    onClick={() => setActiveTab('lab')}
                                >
                                    Lab

                                    <span className="count-card">{counts?.lab}</span>
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className="nav-link"
                                    id="pharmacy-tab"
                                    data-bs-toggle="tab"
                                    href="#pharmacy"
                                    role="tab"
                                    onClick={() => setActiveTab('pharmacy')}
                                >
                                    Pharmacy

                                    <span className="count-card">{counts?.pharmacy}</span>
                                </a>
                            </li>
                        </ul>

                        <div className="new-panel-card">
                            <div className="employee-tabs">
                                <div className="tab-content" id="myTabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="home"
                                        role="tabpanel"
                                    >

                                        <div className="all-profile-data-bx">
                                            <div className="row">
                                                {favIds?.length > 0 &&
                                                    favIds?.map((item, key) =>
                                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                                                            <div className="favorite-docotr-card">
                                                                <div className="favorite-doctor-picture text-center">
                                                                    <img src={item?.doctorProfile?.profileImage ? `${base_url}/${item?.doctorProfile?.profileImage}`
                                                                        : "/date-time-img.png"} alt="" />
                                                                    <div className="favorite-doctor-details">
                                                                        <h4 className="">Dr.{item?.doctor?.name}</h4>
                                                                        <div className="my-2">
                                                                            <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> {item?.avgRating}</span>
                                                                        </div>
                                                                        <h6 className="nw-hospital-title">{item?.specialty?.name} <span className="slash-title" >|</span> {item?.doctorAbout?.hospitalName}</h6>
                                                                        <p className=""><FontAwesomeIcon icon={faRoute} /> {getDistanceInKm(lat, long,
                                                                            item?.doctorAbout?.lat, item?.doctorAbout?.long)} km</p>
                                                                        <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.doctorAbout?.city}, {item?.doctorAbout?.state}</p>
                                                                        <h5 className="ammount-title"><span className="fees-title">Fees :</span> $ {item?.doctorAbout?.fees}</h5>
                                                                        <div className="d-flex justify-content-between mt-3">
                                                                            <button type="button" onClick={() => handleDoctorFavorite(item?.doctor?._id)} className="heart-btn"><i class="fa-solid fa-heart nw-red-heart"></i></button>
                                                                            <Link to={`/book-doctor-appointment/${item?.doctor?.name}/${item?.doctor?._id}`} className="nw-thm-btn">Book Appointment</Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="profile" role="tabpanel">
                                        <div className="all-profile-data-bx">
                                            <div className="row">
                                                {favIds?.length > 0 &&
                                                    favIds?.map((item, key) =>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                                            <div className="lab-technology-card">
                                                                <div className="doctor-mega-card">
                                                                    <div className="doctor-pic-bx">
                                                                        <img src={item?.hospital?.logoField ? `${base_url}/${item?.hospital?.logoField}`
                                                                            : "/hospital-pic.jpg"} alt="" />
                                                                    </div>
                                                                    <div className="doctor-details  flex-grow-1">
                                                                        <h4 className="innr-title fz-700">{item?.hospital?.hospitalName}</h4>
                                                                        <p><FontAwesomeIcon icon={faLocationDot} /> {item?.hospitalAddress?.fullAddress}</p>
                                                                        <div className="my-3 d-flex align-items-center justify-content-between">
                                                                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i> {item?.avgRating} </span>
                                                                            <p><FontAwesomeIcon icon={faRoute} />2.5 km</p>
                                                                        </div>

                                                                        <div className="  d-flex align-items-center justify-content-between">
                                                                            <div>
                                                                                <button type="button" onClick={() => handleHospitalFavorite(item?.hospital?._id)} className="heart-btn"><i class="fa-solid fa-heart nw-red-heart"></i></button>
                                                                            </div>
                                                                            <div>
                                                                                <Link to={`/hospital-details/${item?.hospital?.hospitalName}/${item?.hospital?._id}`} className="nw-thm-btn">View Details</Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="contact" role="tabpanel">
                                        <div className="all-profile-data-bx">
                                            <div className="row">
                                                {favIds?.length > 0 &&
                                                    favIds?.map((item, key) =>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                                            <div className="lab-technology-card">
                                                                <div className="doctor-mega-card">
                                                                    <div className="doctor-pic-bx">
                                                                        <img src={item?.labProfile?.logo ?
                                                                            `${base_url}/${item?.labProfile?.logo}` : "/lab-pic.png"} alt="" />
                                                                    </div>
                                                                    <div className="doctor-details  flex-grow-1">
                                                                        <h4 className="innr-title fz-700">{item?.lab?.name}</h4>
                                                                        <p><FontAwesomeIcon icon={faLocationDot} /> {item?.labAbout?.city}, {item?.labAbout?.state}</p>
                                                                        <div className="my-3">
                                                                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i> {item?.avgRating} </span>
                                                                        </div>
                                                                        <div className="  d-flex align-items-center justify-content-between">
                                                                            <div>
                                                                                <button type="button" onClick={() => handleFavorite(item?.lab._id)} className="heart-btn"><i class="fa-solid fa-heart nw-red-heart"></i></button>
                                                                            </div>
                                                                            <div>
                                                                                <Link to={`/lab-detail/${item?.lab?.name}/${item?.lab?._id}`} className="nw-thm-btn">View Details</Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="tab-pane fade" id="pharmacy" role="tabpanel">
                                        <div className="all-profile-data-bx">
                                            <div className="row">
                                                {favIds?.length > 0 &&
                                                    favIds?.map((item, key) =>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                                            <div className="lab-technology-card">
                                                                <div className="doctor-mega-card">
                                                                    <div className="doctor-pic-bx">
                                                                        <img src={item?.pharProfile?.logo ?
                                                                            `${base_url}/${item?.pharProfile?.logo}` : "/lab-pic.png"} alt="" />
                                                                    </div>
                                                                    <div className="doctor-details  flex-grow-1">
                                                                        <h4 className="innr-title fz-700">{item?.phar?.name}</h4>
                                                                        <p><FontAwesomeIcon icon={faLocationDot} /> {item?.pharAbout?.city}, {item?.pharAbout?.state}</p>
                                                                        <div className="my-3">
                                                                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i> {item?.avgRating} </span>
                                                                        </div>
                                                                        <div className="  d-flex align-items-center justify-content-between">
                                                                            <div>
                                                                                <button type="button" onClick={() => handlePharFavorite(item?.phar._id)} className="heart-btn"><i class="fa-solid fa-heart nw-red-heart"></i></button>
                                                                            </div>
                                                                            <div>
                                                                                <Link to={`/lab-detail/${item?.phar?.name}/${item?.phar?._id}`} className="nw-thm-btn">View Details</Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>




            </div>

            <div className="text-end mt-4">
                 <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
              </div>


        </>
    )
}

export default Favorite