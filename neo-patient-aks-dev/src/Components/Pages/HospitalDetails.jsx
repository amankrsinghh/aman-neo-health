import { faLocationDot, faRoute } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import RatingSlider from "./RatingSlider"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import base_url, { client_url } from "../../baseUrl";


function HospitalDetails() {

    const splideRef = useRef(null);

    const nextSlide = () => {
        splideRef.current.splide.go(">");
    };

    const prevSlide = () => {
        splideRef.current.splide.go("<");
    };
    const params = useParams()
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const [isFull, setIsFull] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hospitalCertificate, setHospitalCertificate] = useState([])
    const [hospitalData, setHospitalData] = useState()
    const [hospitalAddress, setHospitalAddress] = useState()
    const [hospitalImage, setHospitalImage] = useState()
    const [avgRating, setAvgRating] = useState(0)
    const [ratings, setRatings] = useState([])
    const [favIds, setFavIds] = useState([])
    const [hospitalDoctors, setHospitalDoctors] = useState([])
    const [selectedTest, setSelectedTest] = useState([])
    const [userData, setUserData] = useState()
    async function fetchHospitalData() {
        setLoading(true)
        try {
            const result = await getApiData(`api/hospital/profile-data/${params.id}`)
            if (result.success) {
                setRatings(result.rating)
                const cert = result.profile.certificates?.filter(c => c.certificateType == 'accreditation')
                setHospitalCertificate(cert)
                setAvgRating(result.avgRating)
                setHospitalData(result.profile.basic)
                setUserData(result?.profile?.user)
                setHospitalImage(result.profile.images.thumbnail[0])
                setHospitalAddress(result.profile.address)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchFavData() {
        if (!userId) {
            return
        }
        const result = await getSecureApiData(`patient/favorite/${userId}?limit=10000`)
        if (result.success) {
            setFavIds(result.data)
        }
    }
    async function fetchHospitalDoctors() {
        if(!userData?._id ){
            return
        }
        const result = await getApiData(`api/hospital/doctor/${userData?._id}?limit=20`)
        if (result.success) {
            setHospitalDoctors(result.data)
        }
    }

    useEffect(() => {
        fetchHospitalData()
    }, [params])
    useEffect(() => {
        fetchHospitalDoctors()
    }, [userData])
    useEffect(() => {
        fetchFavData()
    }, [userId])
    const handleFavorite = async (id) => {
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
    const hospitalFavorite = async () => {
        const data = { userId, hospitalId: params.id }
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
        const text = `${client_url}/hospital-details/${params?.name}/${params.id}`;
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
            <section className="hospital-section pt-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 px-0">
                            <div className="hospital-picture-bx">
                                <img src={hospitalImage?.fileUrl ? `${base_url}${hospitalImage?.fileUrl}`
                                    : "/hospital-detail-pic.png"} alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="pb-4">
                                <div className="doctor-details my-3">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div>
                                            <h4 className="heading-grad mb-0 fz-40">{hospitalData?.hospitalName}</h4>
                                            <div className="my-3">
                                                <span className="hospital-rating"> <i className="fa-solid fa-star rating-icon"></i> 5.0 </span>
                                            </div>
                                            <p className="mb-0"><FontAwesomeIcon icon={faLocationDot} /> {hospitalAddress?.fullAddress}</p>
                                        </div>
                                        <div className="d-flex gap-3">
                                            <button className="heart-btn" onClick={() => hospitalFavorite()}>
                                                {favIds?.some(fav => fav?.hospitalId === params?.id) ?
                                                    <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                    : <i className="fa-regular fa-heart"></i>}</button>
                                            <button className="heart-btn" onClick={handleCopy}><i className="fas fa-share-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-me">
                                    <h2>About Me</h2>
                                    <p className="new_para about-para">
                                        {hospitalData?.about?.length > 150
                                            ? isFull
                                                ? hospitalData.about
                                                : hospitalData.about.slice(0, 150)
                                            : hospitalData?.about}

                                        <br />

                                        {hospitalData?.about?.length > 150 && (
                                            <button
                                                className="more-btn"
                                                onClick={() => setIsFull(!isFull)}
                                            >
                                                {isFull ? 'Read Less' : 'Read More'}
                                            </button>
                                        )}
                                    </p>

                                </div>
                                <div className="about-me specialty-bx my-3">
                                    <h2>Specialty</h2>
                                    <ul className="specialty-list">
                                        {hospitalDoctors?.map((item, key) =>
                                            <li className="specialty-item" key={key}> <span className="specialty-title">  {item?.doctorAbout?.specialty?.name}</span></li>)}
                                    </ul>
                                </div>
                                <div className="about-me specialty-bx my-3">
                                    <h2>Treatment Areas</h2>
                                    <ul className="specialty-list">
                                        {hospitalDoctors?.map((item, key) =>
                                            item?.doctorAbout?.treatmentAreas?.map(t =>
                                                <li className="specialty-item" key={key}> <span className="specialty-title">  {t?.name}</span></li>))}

                                    </ul>
                                </div>

                                <div className="about-me specialty-bx my-3">
                                    <h2>Accreditation</h2>
                                    <ul className="specialty-list">
                                        {hospitalCertificate?.map((item, key) =>
                                            <li className="specialty-item" key={key}> <span className="specialty-title"> {item?.licenseNumber}</span></li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h4 className="title mb-2">Doctors</h4>

                                <div className="rating-arrows">
                                    <button onClick={prevSlide} className="rating-prev me-2">
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button onClick={nextSlide} className="rating-next">
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </div>
                            </div>


                            <Splide
                                ref={splideRef}
                                options={{
                                    type: "loop",
                                    perPage: 4,
                                    perMove: 1,
                                    autoplay: true,
                                    pagination: false,
                                    interval: 2500,
                                    speed: 800,
                                    arrows: false,
                                    gap: "20px",
                                    breakpoints: {
                                        992: { perPage: 2, gap: "15px" },
                                        576: { perPage: 1, gap: "10px" },
                                    },
                                }}
                            >

                                {hospitalDoctors?.map((item, key) =>
                                    <SplideSlide className="py-3" key={key}>
                                        <div className="favorite-docotr-card position-relative">
                                            <div className="favorite-doctor-picture text-center">
                                                <img src={item?.doctorId?.profileImage ? `${base_url}/${item?.doctorId?.profileImage}`
                                                    : "/date-time-img.png"} alt="" />
                                                <div className="favorite-doctor-details">
                                                    <h4 className="">{item?.name}</h4>
                                                    <div className="my-2">
                                                        <span className="hospital-rating"> <i className="fa-solid fa-star rating-icon"></i> {item?.avgRating} </span>
                                                    </div>
                                                    <h6 className="nw-hospital-title">{item?.doctorAbout?.specialty?.name} <span className="slash-title" >|</span> {params.name}</h6>
                                                    <div className="d-flex align-items-center justify-content-between flex-wrap my-2">
                                                        <p className=""><FontAwesomeIcon icon={faRoute} /> 2.5 km</p>
                                                        <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.doctorAbout?.fullAddress}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-3">

                                                        <div className="text-start">
                                                            <span className="fees-title">Fees :</span>
                                                            <h5 className="ammount-title fw-700"> ₹ {item?.fees}</h5>
                                                        </div>
                                                        <Link to={`/book-doctor-appointment/${item?.name}/${item?._id}?hospital=${params.id}`} className="nw-thm-btn">Book Appointment</Link>
                                                    </div>

                                                    <div className="doctor-heart-bx">
                                                        <button className="heart-btn" onClick={() => handleFavorite(item?._id)}>
                                                            {favIds?.some(fav => fav?.doctorId === item?._id) ?
                                                                <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                : <i className="fa-regular fa-heart"></i>}</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </SplideSlide>)}
                            </Splide>


                        </div>
                    </div>
                </div>
            </section>



            <RatingSlider />
        </>
    )
}

export default HospitalDetails