import { TbGridDots } from "react-icons/tb";
import { faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteApiData, getSecureApiData, securePostData } from "../../Service/api";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";

function Tests() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [allTest, setAllTest] = useState([])
    const fetchLabTest = async () => {
        setLoading(true)
        try {
            const response = await getSecureApiData(`api/hospital/test/${userId}?page=${currentPage}&name=${name}&type=hospital`);
            if (response.success) {
                // setCurrentPage(response.pagination.page)
                // setTotalPage(response.pagination.totalPages)
                setAllTest(response.data)
                setTotalPages(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    const testAction = async (e, id, status) => {
        e.preventDefault()
        const data = { testId: id, status }
        try {
            const response = await securePostData(`api/hospital/test-action`, data);
            if (response.success) {
                toast.success('Status updated')
                fetchLabTest()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }
    const deleteTest = async (id) => {
        try {
            setLoading(true)
            const response = await deleteApiData(`api/hospital/test/${id}`);
            if (response.success) {
                toast.success('Test deleted')
                fetchLabTest()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchLabTest()
    }, [userId, currentPage])

    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Tests</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Tests
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="add-nw-bx">
                                <Link to="/add-tests" className="add-nw-btn nw-thm-btn">
                                    <img src="/plus-icon.png" alt="" /> Add Test
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div>
                                    <div className="d-flex align-items-center gap-2 ">
                                        <div className="custom-frm-bx mb-0">
                                            <input
                                                type="text"
                                                className="form-control  search-table-frm pe-5"
                                                id="email"
                                                placeholder="Search"
                                                required
                                                value={name} onChange={(e) => setName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        fetchLabTest();
                                                    }
                                                }}
                                            />
                                            <div className="adm-search-bx">
                                                <button className="text-secondary" onClick={() => fetchLabTest()}>
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector d-flex align-items-center mb-2 mb-md-0 gap-2">
                                    <div>
                                        <select
                                            value={currentPage}
                                            onChange={(e) => setCurrentPage(e.target.value)}
                                            className="form-select custom-page-dropdown nw-custom-page ">
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}


                            </div>
                        </div>


                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th>Test Categories Name</th>
                                                    <th>Sub Category</th>
                                                    <th>Price</th>
                                                    {/* <th>Status</th> */}
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {allTest?.length > 0 ?
                                                    allTest?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{key + 1}.</td>
                                                            <td className="text-capitalize">{item?.category?.name}</td>
                                                            <td>{item?.subCatData?.filter(item => item?.status == "active")?.length} / {item?.subCatData?.length} Active</td>
                                                            {/* <td>{item?.packageType}</td> */}
                                                            <td>₹{item?.totalAmount}</td>


                                                            <td>
                                                                <Link className="prescription-nav" to={`/edit-tests/${item?._id}`} >
                                                                    View/Edit
                                                                </Link>
                                                            </td>
                                                        </tr>) :
                                                    <tr>No Data</tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="nw-thm-btn outline"
                        >
                            Go Back
                        </button>
                    </div>
                </div>}
        </>
    )
}

export default Tests