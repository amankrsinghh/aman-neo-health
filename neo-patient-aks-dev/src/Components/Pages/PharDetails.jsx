import { faHome, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import RatingSlider from "./RatingSlider"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import base_url, { client_url } from "../../baseUrl"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import { toast } from "react-toastify"
import Loader from "../../Loader/Loader"




function PharDetails() {
    const params = useParams()
    const navigate=useNavigate()
    const userId = localStorage.getItem('userId')
    const [isFull, setIsFull] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pharCertificate, setPharCertificate] = useState([])
    const [pharData, setPharData] = useState([])
    const [pharAddress, setPharAddress] = useState()
    const [pharImage, setPharImage] = useState()
    const [avgRating, setAvgRating] = useState(0)
    const [ratings, setRatings] = useState([])
    const [favIds, setFavIds] = useState([])
    const [pharTest, setPharTest] = useState([])
    const [selectedTest, setSelectedTest] = useState([])
    async function fetchLabData() {
        setLoading(true)
        try {
            const result = await getApiData(`pharmacy/data/${params.id}`)
            if (result.success) {
                setRatings(result.rating)
                setPharCertificate(result.pharLicense?.pharCert)
                setAvgRating(result.avgRating)
                setPharData(result.user)
                setPharImage(result.pharImg)
                setPharAddress(result.pharAddress)
                const data=result.pharTest?.filter(test=>test.status=='active')
                // setPharTest(data)
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
        fetchLabData()
    }, [params])
    useEffect(() => {
        fetchFavData()
    }, [userId])
    const handleFavorite = async () => {
        if(!userId){
            navigate('/login')
        }
        const data = { userId, pharId: params.id }
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
        const text = `${client_url}/phar-detail/${params?.name}/${params.id}`;
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
            {loading ? <Loader /> : <>
                <section className="tp-breadcrum-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="text-center mb-3">
                                    <h4 className="lg_title">Pharmacy Details</h4>
                                </div>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    <FontAwesomeIcon icon={faHome} />
                                                </a>
                                            </li>


                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Pharmacy Details
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lab-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                <div className="lab-view-details-card">
                                    <div className="">
                                        <div className="lab-pic-bx">
                                            <img src={pharImage?.thumbnail ?
                                                `${base_url}/${pharImage?.thumbnail}` : "/lab-pic.png"} alt="" />
                                        </div>
                                        <div className="doctor-details mt-3">
                                            <div className="d-flex align-items-start justify-content-between">
                                                <div>
                                                    <h4 className="innr-title fz-700">{pharData?.name}</h4>
                                                    <div className="my-3">
                                                        <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> {avgRating?.toFixed(0)} </span>
                                                    </div>
                                                    <p><FontAwesomeIcon icon={faLocationDot} /> {pharAddress?.fullAddress}</p>
                                                </div>
                                                <div className="d-flex gap-3">
                                                    <button className="heart-btn" onClick={handleFavorite}>
                                                        {favIds?.some(fav => fav?.pharId === params.id) ?
                                                            <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                            : <i className="fa-regular fa-heart"></i>}</button>
                                                    <button className="heart-btn" onClick={handleCopy}><i className="fas fa-share-alt"></i></button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="about-me">
                                            <h2>About Me</h2>
                                            <p className="new_para about-para">{pharData?.about} <br />
                                                {pharData?.about?.length > 150 && <button className="more-btn">{isFull ? 'Read Less' : 'Read More'}</button>} </p>
                                        </div>

                                        <div className="about-me specialty-bx my-3">
                                            <h2>Certificate</h2>
                                            <ul className="specialty-list">
                                                {pharCertificate?.map((item, key) =>
                                                    <li className="specialty-item" key={key}> <span className="specialty-title"> {item?.certName}</span></li>)}

                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="lab-view-details-card">
                                    <fieldset className="address-fieldset mb-3 nw-address-filedset">
                                        <legend className="float-none w-auto px-3 legend-title">
                                            Select Test
                                        </legend>

                                        <ul className="permision-check-list">
                                            {pharTest?.map((item, key) => (
                                                <li className="permission-item" key={key}>
                                                    <div className="accordion-body-concet nw-select-test-bx">
                                                        <input
                                                            className="form-check-input mt-0"
                                                            type="checkbox"
                                                            id={`available-${key}`} // ensure unique id
                                                            onChange={(e) => {
                                                                setSelectedTest((prev) => {
                                                                    if (e.target.checked) {
                                                                        return [...prev, item];
                                                                    } else {
                                                                        return prev.filter(i => i.id !== item.id);
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <label htmlFor={`available-${key}`}>{item?.shortName}</label>
                                                        <span className="price">${item?.price}</span>
                                                    </div>
                                                </li>
                                            ))}



                                        </ul>

                                        <div className="text-center pt-5 appoint-bx">
                                            <button 
                                            disabled={selectedTest.length==0}
                                            onClick={()=>{
                                                sessionStorage.setItem('preTest',JSON.stringify(selectedTest))
                                                navigate(`/test-detail/${params.name}/${params.id}`)
                                            }} className="nw-thm-btn">Book Appointment</button>
                                        </div>
                                    </fieldset>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </section>

                <RatingSlider ratings={ratings} />

            </>}
        </>
    )
}

export default PharDetails