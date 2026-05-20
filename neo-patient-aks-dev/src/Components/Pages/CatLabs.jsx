import { faHome, faLocationDot, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import base_url from "../../baseUrl"
import { Link, NavLink, useParams } from "react-router-dom"
import { toast } from "react-toastify"

function CatLabs() {
    const { id, name } = useParams()
    const [favIds, setFavIds] = useState([])
    const [labs, setLabs] = useState([])
    const userId = localStorage.getItem('userId')
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const location = localStorage.getItem('location') || '';
    const [type, setType] = useState('lab')
    const [currentHospital, setCurrentHospital] = useState(1)
    const [hospitalPages, setHospitalPages] = useState()
    const [totalHospital, setTotalHospital] = useState(0)
    const [hospitals, setHospitals] = useState([])
    async function fetchLabs() {
        const result = await getApiData(`patient/category/top-users?catType=lab&catId=${id}`)
        if (result.success) {
            setLabs(result.data)
            setTotalPages(result.pagination.totalPage)
            setCurrentPage(result.pagination.currentPage)
            setTotal(result.pagination.total)
        }
    }
    useEffect(() => {
        fetchLabs()
    }, [currentPage, type])
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
        fetchFavData()
    }, [userId])
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
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Find {name} Labs</h4>
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
                                            Labs List
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
                        {/* <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                            <div className="Sidebar-Filter">
                                <div className="filltering-bx">
                                    <div>
                                        <h4 className="subtitle mb-0">Filter</h4>
                                    </div>
                                    <div>
                                        <a href="javascript:void(0)" className="filter-clear-btn">Clear All</a>
                                    </div>

                                </div>
                                <div className="sidebar-filter-checkbox">
                                    <div className="accordion-box accordion " id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne"
                                                >
                                                    Tests name
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseOne"
                                                className="accordion-collapse collapse show"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    <ul className="">
                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="now" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="now">CBC</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="hb" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="hb">Hb</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="wbc" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="wbc">WBC</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="rbc" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="rbc">RBC</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="plt" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="plt">PLT</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="fbs" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="fbs">FBS</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="rbbs" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="rbbs">RBS</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="alt" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="alt">ALT / SGPT</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="high" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="high">High-Density Lipoprotein</label>
                                                            </div>
                                                        </li>

                                                        <li><a href="javascript:void(0)" className="more-btn">View More</a></li>

                                                    </ul>


                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseTwo"
                                                    aria-expanded="false"
                                                    aria-controls="collapseTwo"
                                                >
                                                    Availability
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseTwo"
                                                className="accordion-collapse collapse"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    <ul className="">
                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="available" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="available">Available Now</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="not" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="not">No Available</label>
                                                            </div>
                                                        </li>

                                                    </ul>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseThree"
                                                    aria-expanded="false"
                                                    aria-controls="collapseThree"
                                                >
                                                    Ratting
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseThree"
                                                className="accordion-collapse collapse"
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    <ul className="">
                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="star1" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="star1">1 Star</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="star2" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="star2">2 Star</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="star3" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="star3">3 Star</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="star4" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="star4">4 Star</label>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="accordion-body-concet">
                                                                <input className="form-check-input mt-0" type="checkbox" id="star5" value="" aria-label="Checkbox for following text input" />
                                                                <label htmlFor="star5">5 Star</label>
                                                            </div>
                                                        </li>

                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                        

                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="d-flex align-items-center justify-content-between mb-2 gap-2 mobile-filter-box">
                                {/* <div className="custom-frm-bx mb-0">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control admin-table-search-frm search-table-frm pe-5"
                                        id="email"
                                        placeholder="Search"
                                        required
                                    />
                                    <div className="adm-search-bx">
                                        <button className="tp-search-btn" onClick={() => fetchLabs()}>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
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
                                <p className="show-pra my-2">Showing <span className="show-title">{total + totalHospital}</span> labs For You</p>
                            </div> */}

                            <div className="row">
                                {labs?.length > 0 ?
                                    labs?.map((item, key) =>
                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                            <div className="lab-technology-card">

                                                <div className="doctor-mega-card">
                                                    <div className="doctor-pic-bx">
                                                        <img src={item?.logo ?
                                                            `${base_url}/${item?.logo}` : "/lab-pic.png"} alt="" />
                                                    </div>
                                                    <div className="doctor-details  flex-grow-1">
                                                        <h4 className="innr-title fz-700">{item?.userId.name}</h4>
                                                        <p><FontAwesomeIcon icon={faLocationDot} /> {item?.about?.fullAddress}</p>
                                                        <div className="my-3">
                                                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i> {item?.rating?.avgRating.toFixed(0) || 0} </span>
                                                        </div>

                                                        <div className="  d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <Link to={`/lab-detail/${item?.userId?.name}/${item?.userId?._id}`} className="nw-thm-btn">View Details</Link>
                                                            </div>
                                                            <div>
                                                                <button className="heart-btn" onClick={() => handleFavorite(item?.userId?._id)}>
                                                                    {favIds?.some(fav => fav?.labId === item?.userId?._id) ?
                                                                        <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                        : <i className="fa-regular fa-heart"></i>}</button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    ) : 'No Lab found'}
                            </div>





                        </div>

                    </div>
                </div>

            </section>

        </>
    )
}

export default CatLabs