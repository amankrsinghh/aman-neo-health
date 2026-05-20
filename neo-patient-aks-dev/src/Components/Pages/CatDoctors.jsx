import { faHome, faLocationDot, faRoute, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import { useEffect, useState } from "react"
import base_url from "../../baseUrl"
import { Link, NavLink, useParams } from "react-router-dom"
import Loader from "../Layouts/Loader"
import { getDistanceInKm, specialtyOptions } from "../../Services/globalFunction"

function CatDoctors() {
    const { id, name } = useParams()
    const [favIds, setFavIds] = useState([])
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState()
    const [totalPages, setTotalPages] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [myLatLong, setMyLatLong] = useState({ lat: null, long: null })
    const [specialities, setSpecialities] = useState([])
    const [filters, setFilters] = useState({
        specialty: [],
        availability: [],
        pricing: [],
        rating: [],
        language: []
    });
    sessionStorage.removeItem('aptData')
    const [sideFilter, setSideFilter] = useState({ availability: "", rating: [""], pricing: [""], specialty: [""], language: [""] })
    const fetchDoctors = async () => {
        const query = buildQueryParams(); // ⬅️ get filters

        const result = await getApiData(
            `patient/category/top-users?catType=doctor&catId=${id}`
        );

        if (result.success) {
            setCurrentPage(result.pagination.page)
            setTotalPages(result.pagination.totalPages)
            setDoctors(result.data);
            setTotal(result.pagination.total);
        }
    };

    useEffect(() => {
        fetchDoctors()
    }, [])
    async function fetchFavData() {
        if (!userId) {
            return
        }
        const result = await getSecureApiData(`patient/favorite/${userId}?limit=1000000&type=doctor`)
        if (result.success) {
            setFavIds(result.data)
        }
    }
    async function fetchSpecialityData() {
        const result = await getApiData(`admin/speciality`)
        if (result.success) {
            setSpecialities(result.data)
        }
    }

    useEffect(() => {
        fetchFavData()
        fetchSpecialityData()
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
    const handleCheckboxChange = (type, value) => {
        setFilters(prev => {
            const exists = prev[type].includes(value);
            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(v => v !== value)
                    : [...prev[type], value]
            };
        });
    };
    const clearAllFilters = () => {
        setFilters({
            specialty: [],
            availability: [],
            pricing: [],
            rating: [],
            language: []
        });
    };
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 12);

        if (filters.specialty.length)
            params.append("specialty", filters.specialty.join(","));

        if (filters.language.length)
            params.append("language", filters.language.join(","));

        if (filters.rating.length)
            params.append("rating", Math.max(...filters.rating)); // min rating

        if (filters.pricing.length)
            params.append("fees", filters.pricing.join(","));


        return params.toString();
    };
    useEffect(() => {
        fetchDoctors()
    }, [filters]);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMyLatLong(prev => ({
                        ...prev,
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }));
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, []);
    return (
        <>
            {loading ? <Loader />
                : <>
                    <section className="tp-breadcrum-section">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="text-center">
                                        <h4 className="lg_title">Find {name} Doctors</h4>
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
                                                    Doctor
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="find-lab-section">
                        <div className="container">
                            <div className="row">

                                


                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="d-flex align-items-center justify-content-between mb-2 mobile-filter-box gap-2">
                                        {/* <div className="d-flex align-items-center gap-2">
                                            <div className="custom-frm-bx mb-0">
                                                <input
                                                    type="text"
                                                    className="form-control admin-table-search-frm search-table-frm pe-5"
                                                    id="name"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Search"
                                                    required
                                                />
                                                <div className="adm-search-bx">
                                                    <button className="tp-search-btn" onClick={() => fetchDoctors()}>
                                                        <FontAwesomeIcon icon={faSearch} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* <div className="filters">
                                            <div className="field custom-frm-bx mb-0 custom-select admin-table-search-frm ">
                                                <label className="label">Sort By</label>
                                                <select className="">
                                                    <option>Price (Low to High) </option>
                                                    <option>Test 1</option>
                                                    <option>Test 2</option>
                                                </select>
                                            </div>
                                        </div> */}

                                        {/* {totalPages > 1 && <div className="page-selector">
                      <div className="filters">
                        <select className="form-select custom-page-dropdown nw-custom-page "
                          value={currentPage}
                          onChange={(e) => setCurrentPage(e.target.value)}>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>} */}
                                    </div>

                                    {/* <div className="show-result-bx">
                                        <p className="show-pra my-2">Showing <span className="show-title">{total}</span> doctors For You</p>
                                    </div> */}

                                    <div className="row">
                                        {doctors?.length > 0 &&
                                            doctors?.map((item, key) =>
                                                <div className="col-lg-3 col-md-4 col-sm-12 mb-3" key={key}>
                                                    <div className="favorite-docotr-card position-relative">
                                                        <div className="favorite-doctor-picture text-center">
                                                            <img src={item?.doctorId?.profileImage ?
                                                                `${base_url}/${item?.doctorId?.profileImage}` : "/date-time-img.png"} alt="" />
                                                            <div className="favorite-doctor-details">
                                                                <h4 className="text-capitalize">Dr.{item?.userId?.name}</h4>
                                                                <div className="my-2">
                                                                    <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> {item?.rating?.avgRating?.toFixed(0)} </span>
                                                                </div>
                                                                <h6 className="nw-hospital-title">{item?.specialty?.name} <span className="slash-title" >|</span> {item?.hospitalName}</h6>
                                                                <div className="d-flex align-items-center justify-content-between flex-column my-2">
                                                                    <p className=""><FontAwesomeIcon icon={faRoute} /> {2.3} km</p>
                                                                    <p className=""><FontAwesomeIcon icon={faLocationDot} /> {item?.fullAddress}</p>
                                                                </div>
                                                                <div className="d-flex justify-content-between mt-3">

                                                                    <div className="text-start">
                                                                        <span className="fees-title">Fees :</span>
                                                                        <h5 className="ammount-title fw-700"> $ {item?.fees}</h5>
                                                                    </div>
                                                                    <Link to={`/doctor-details/${item?.userId?.name}/${item?.userId?._id}`} className="nw-thm-btn">Book Appointment</Link>
                                                                </div>

                                                                <div className="doctor-heart-bx">
                                                                    <button className="heart-btn" onClick={() => handleFavorite(item?.userId?._id)}>
                                                                        {favIds?.some(fav => fav?.doctorId === item?.userId?._id) ?
                                                                            <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                            : <i className="fa-regular fa-heart"></i>}</button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)}

                                        {/* <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="favorite-docotr-card position-relative">
                    <div className="favorite-doctor-picture text-center">
                      <img src="/date-time-img.png" alt="" />
                      <div className="favorite-doctor-details">
                        <h4 className="">Dr.James Harris</h4>
                        <div className="my-2">
                          <span className="lab-rating"> <i className="fa-solid fa-star rating-icon"></i> 5.0 </span>
                        </div>
                        <h6 className="nw-hospital-title">Psychologists <span className="slash-title" >|</span> Mercy Hospital</h6>
                        <div className="d-flex align-items-center justify-content-between flex-wrap my-2">
                          <p className=""><FontAwesomeIcon icon={faRoute} /> 2.5 km</p>
                          <p className=""><FontAwesomeIcon icon={faLocationDot} /> Malviya Nagar, Jaipur</p>
                        </div>
                        <div className="d-flex justify-content-between mt-3">

                          <div className="text-start">
                            <span className="fees-title">Fees :</span>
                            <h5 className="ammount-title fw-700"> $ 22.00</h5>
                          </div>
                          <a href="javascript:void(0)" className="nw-thm-btn">Book Appointment</a>
                        </div>

                        <div className="doctor-heart-bx">
                          <a href="javascript:void(0)" className="heart-btn"><i class="fa-regular fa-heart"></i></a>
                        </div>

                      </div>
                    </div>
                  </div>
                </div> */}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </section>
                </>}
        </>
    )
}

export default CatDoctors