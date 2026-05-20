import { faHome, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import RatingSlider from "./RatingSlider"
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import base_url, { client_url } from "../../baseUrl"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import { toast } from "react-toastify"
import Loader from "../../Loader/Loader"
import { useSelector } from "react-redux"




function LabDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const userId = localStorage.getItem('userId')
    const [isFull, setIsFull] = useState(false)
    const [loading, setLoading] = useState(false)
    const [labCertificate, setLabCertificate] = useState([])
    const [labData, setLabData] = useState([])
    const [labAddress, setLabAddress] = useState()
    const [labImage, setLabImage] = useState()
    const [avgRating, setAvgRating] = useState(0)
    const [ratings, setRatings] = useState([])
    const [favIds, setFavIds] = useState([])
    const [labTest, setLabTest] = useState([])
    const [selectedTest, setSelectedTest] = useState([])
    async function fetchLabData() {
        setLoading(true)
        try {
            const result = await getApiData(`lab/data/${params.id}`)
            if (result.success) {
                setRatings(result.rating)
                setLabCertificate(result.labLicense?.labCert)
                setAvgRating(result.avgRating)
                setLabData(result.user)
                setLabImage(result.labImage)
                setLabAddress(result.labAddress)
                const data = result.labTest
                setLabTest(data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    async function fetchHospitalData() {
        setLoading(true)
        try {
            const result = await getApiData(`api/hospital/profile-detail/${params.id}`)
            if (result.success) {
                setRatings(result.rating)
                const cert = result.profile.certificates?.filter(c => c.certificateType == 'accreditation')
                setLabCertificate(cert)
                setAvgRating(result.avgRating)
                setLabData(result.profile.basic)
                setLabImage(result.profile.images.thumbnail[0])
                setLabAddress(result.profile.address)
                const data = result.labTest?.filter(test => test.status == 'active')
                setLabTest(data)
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
        const result = await getSecureApiData(`patient/favorite/${userId}?limit=1000000`)
        if (result.success) {
            setFavIds(result.data)
        }
    }

    useEffect(() => {
        if (searchParams.get('type') === 'hospital') {
            fetchHospitalData()
        } else {
            fetchLabData()
        }
    }, [params, searchParams])
    useEffect(() => {
        fetchFavData()
    }, [userId])
    const handleFavorite = async () => {
        const data = { userId }
        if (searchParams.get('type') == "hospital") {
            data.hospitalId = params.id
        } else {
            data.labId = params.id
        }
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
        const text = `${client_url}/lab-detail/${params?.name}/${params.id}`;
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
                                    <h4 className="lg_title">Lab Details</h4>
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
                                                Lab Details
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
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="lab-view-details-card">
                                    <div className="">
                                        <div className="lab-pic-bx">
                                            {searchParams.get('type') === "hospital" ?
                                                <img src={labImage?.fileUrl ? `${base_url}/${labImage?.fileUrl}`
                                                    : "/hospital-detail-pic.png"} alt="" />
                                                : <img src={labImage?.thumbnail ?
                                                    `${base_url}/${labImage?.thumbnail}` : "/lab-pic.png"} alt="" />}
                                        </div>
                                        <div className="doctor-details mt-3">
                                            <div className="d-flex align-items-start justify-content-between">
                                                <div>
                                                    <h4 className="innr-title fz-700">{labData?.name}</h4>
                                                    <div className="my-3">
                                                        <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> {avgRating?.toFixed(0)} </span>
                                                    </div>
                                                    <p><FontAwesomeIcon icon={faLocationDot} /> {labAddress?.fullAddress}</p>
                                                </div>
                                                <div className="d-flex gap-3">
                                                    {searchParams.get('type') === "hospital" ?
                                                        <button className="heart-btn" onClick={handleFavorite}>
                                                            {favIds?.some(fav => fav?.hospitalId === params.id) ?
                                                                <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                : <i className="fa-regular fa-heart"></i>}</button>
                                                        : <button className="heart-btn" onClick={handleFavorite}>
                                                            {favIds?.some(fav => fav?.labId === params.id) ?
                                                                <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                : <i className="fa-regular fa-heart"></i>}</button>}
                                                    <button className="heart-btn" onClick={handleCopy}><i className="fas fa-share-alt"></i></button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="about-me">
                                            <h2>About Me</h2>
                                            <p className="new_para about-para">{labData?.about} <br />
                                                {labData?.about?.length > 150 && <button className="more-btn">{isFull ? 'Read Less' : 'Read More'}</button>} </p>
                                        </div>

                                        <div className="about-me specialty-bx my-3">
                                            <h2>Certificate</h2>
                                            <ul className="specialty-list">
                                                {labCertificate?.map((item, key) =>
                                                    <li className="specialty-item" key={key}> <span className="specialty-title"> {item?.certName || item?.licenseNumber}</span></li>)}

                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="lab-view-details-card">
                                    <fieldset className="address-fieldset mb-3 nw-address-filedset">
                                        <legend className="float-none w-auto px-3 legend-title">
                                            Select Test
                                        </legend>

                                        <ul className="">
                                            {labTest?.length > 0 ? labTest?.map((item, key) => {
                                                const activeSubCats = item?.subCatData?.filter(s => s?.status === "active")

                                                // Category selected hai agar uski sabhi active subCats selectedTest mein hain
                                                const isCatSelected = activeSubCats?.length > 0 &&
                                                    activeSubCats.every(s => selectedTest.some(x => x.subCatId === s.subCat._id))

                                                const handleCatCheckbox = (checked) => {
                                                    if (checked) {
                                                        // Sabhi active subCats add karo (duplicate avoid karo)
                                                        const newItems = activeSubCats
                                                            .filter(s => !selectedTest.some(x => x.subCatId === s.subCat._id))
                                                            .map(s => ({
                                                                testId: item._id,
                                                                subCatId: s.subCat._id,
                                                                name: s.subCat.subCategory,
                                                                price: s.price,
                                                                category: item.category?.name,
                                                                catId:item?.category?._id
                                                            }))
                                                        setSelectedTest(prev => [...prev, ...newItems])
                                                    } else {
                                                        // Is category ki sabhi subCats remove karo
                                                        const ids = activeSubCats.map(s => s.subCat._id)
                                                        setSelectedTest(prev => prev.filter(x => !ids.includes(x.subCatId)))
                                                    }
                                                }

                                                return (
                                                    <>
                                                        <div className="row" key={key}>
                                                            <div className="col-6">{item?.category?.name}</div>
                                                            <div className="col-6 text-end">
                                                                <div className="custom-frm-bx">
                                                                    {/* ✅ Category checkbox */}
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`package-${key}`}
                                                                        className="form-check-input mt-0"
                                                                        checked={isCatSelected}
                                                                        onChange={(e) => handleCatCheckbox(e.target.checked)}
                                                                    />
                                                                   <label htmlFor={`package-${key}`}>₹ {item?.totalAmount}</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {activeSubCats?.map(s => (
                                                            <li className="permission-item" key={s.subCat._id}>
                                                                <div className="accordion-body-concet nw-select-test-bx">
                                                                    <input
                                                                        className="form-check-input mt-0"
                                                                        type="checkbox"
                                                                        id={`available-${s.subCat._id}`}
                                                                        checked={selectedTest.some(x => x.subCatId === s.subCat._id)}
                                                                        onChange={(e) => {
                                                                            setSelectedTest(prev => {
                                                                                if (e.target.checked) {
                                                                                    return [...prev, {
                                                                                        testId: item._id,
                                                                                        subCatId: s.subCat._id,
                                                                                        name: s.subCat.subCategory,
                                                                                        price: s.price,
                                                                                        category: item.category?.name,
                                                                                        catId:item?.category?._id
                                                                                    }]
                                                                                } else {
                                                                                    return prev.filter(x => x.subCatId !== s.subCat._id)
                                                                                }
                                                                            })
                                                                        }}
                                                                    />
                                                                    <label htmlFor={`available-${s.subCat._id}`}>{s?.subCat?.subCategory}</label>
                                                                    <span className="price">₹ {s?.price}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </>
                                                )
                                            }) : 'No test available now'}
                                        </ul>

                                        <div className="text-center pt-5 appoint-bx">
                                            <button
                                                disabled={selectedTest.length == 0}
                                                onClick={() => {
                                                    sessionStorage.setItem('preTest', JSON.stringify(selectedTest))
                                                    if (searchParams.get('type') == 'hospital') {
                                                        navigate(`/test-detail/${params.name}/${labData?.userId}`)
                                                    } else {
                                                        navigate(`/test-detail/${params.name}/${params.id}`)
                                                    }
                                                }} className="nw-thm-btn">Book Appointment</button>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <RatingSlider ratings={ratings} />

            </>}
        </>
    )
}

export default LabDetails