import { faHome, faLocationDot, faRoute, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import { getApiData, getSecureApiData, securePostData } from "../../Services/api"
import { useEffect, useState } from "react"
import base_url from "../../baseUrl"
import { Link, NavLink, useParams } from "react-router-dom"

function CatHospital() {
    const {name,id}=useParams()
    const [favIds, setFavIds] = useState([])
    const [hospitals, setHospitals] = useState([])
    const userId = localStorage.getItem('userId')
    const [total, setTotal] = useState(0)
    const [totalPages,setTotalPages] =useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [search,setSearch]=useState('')
    async function fetchHospitals() {
        const result = await getApiData(`patient/category/top-users?catType=hospital&catId=${id}`)
        if (result.success) {
            setTotal(result.pagination.total)
            setTotalPages(result.pagination.totalPages)
            setHospitals(result.data)
        }
    }
    useEffect(() => {
        fetchHospitals()
    }, [currentPage])
    async function fetchFavData() {
        if(!userId) return
        const result = await getSecureApiData(`patient/favorite/${userId}?limit=1000000`)
        if (result.success) {
            setFavIds(result.data)
        }
    }

    useEffect(() => {
        fetchFavData()
    }, [userId])
    const handleFavorite = async (id) => {
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
                            <div class="text-center">
                                <h4 className="lg_title">Find {name} Hospital</h4>
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
                                            Hospitals List
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
                            <div className="d-flex align-items-center justify-content-between mb-2 gap-2 mobile-filter-box">
                                 {/* <div className="custom-frm-bx mb-0">
                                        <input
                                            type="text"
                                            className="form-control admin-table-search-frm search-table-frm pe-5"
                                            id="email"
                                            value={search}
                                            onChange={(e)=>setSearch(e.target.value)}
                                            placeholder="Search"
                                            required
                                        />
                                        <div className="adm-search-bx">
                                            <button className="tp-search-btn" onClick={()=>fetchHospitals()}>
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
                                <p className="show-pra my-2">Showing <span className="show-title">{total}</span> hospitals For You</p>
                            </div> */}

                            <div className="row">
                                {hospitals?.length > 0 &&
                                    hospitals?.map((item, key) =>
                                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3" key={key}>
                                            <div className="lab-technology-card">
                                                <div className="doctor-mega-card">
                                                    <div className="doctor-pic-bx">
                                                        <img src={item?.logoFileId ?
                                                            `${base_url}/uploads/logo/${item?.logoFileId}` : "/hospital-pic.jpg"} alt="" />
                                                    </div>
                                                    <div className="doctor-details  flex-grow-1">
                                                        <h4 className="innr-title fz-700">{item?.userId?.name}</h4>
                                                        <p><FontAwesomeIcon icon={faLocationDot} /> {item?.about.fullAddress}</p>
                                                        <div className="my-3 d-flex align-items-center justify-content-between">
                                                            <span className="lab-rating"> <i class="fa-solid fa-star rating-icon"></i> {item?.avgRating} </span>
                                                            <p><FontAwesomeIcon icon={faRoute} />2.5 km</p>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <button className="heart-btn" onClick={() => handleFavorite(item?.userId?._id)}>
                                                                    {favIds?.some(fav => fav?.hospitalId === item?.userId?._id) ?
                                                                        <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                                                                        : <i className="fa-regular fa-heart"></i>}</button>
                                                            </div>
                                                            <div>
                                                                <Link to={`/hospital-details/${item?.userId?.name}/${item?._id}`} href="javascript:void(0)" className="nw-thm-btn">View Details</Link>
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

            </section>

        </>
    )
}

export default CatHospital