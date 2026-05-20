import { useEffect, useState } from "react"
import { getSecureApiData } from "../../Services/api"
import { toast } from "react-toastify"
import { NavLink } from "react-router-dom"

function Analysis() {
    const userId=localStorage.getItem("userId")
    const [currentPage, setCurrentPage] = useState(1)
    const [schedule, setSchedule] = useState('all')
    const [name, setName] = useState('')
    const [list, setList] = useState([])
    const [totalPage, setTotalPage] = useState(1)
    const fetchInventory = async () => {
        try {
            const response = await getSecureApiData(`pharmacy/inventory/${userId}?page=${currentPage}&search=${name}&schedule=${schedule}`);
            if (response.success) {
                setList(response.data)
                setTotalPage(response.pagiantion.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        fetchInventory()
    }, [userId, currentPage])
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2 gradient-text">Analysis</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            Analysis
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='new-mega-card'>
                    <form action="">
                        <div className="row ">
                            <div className="col-lg-10 col-md-6 col-sm-12">
                                <div class="custom-frm-bx">
                                    <label>Select Medicine </label>
                                    <div class="select-wrapper">
                                        <select class="form-select custom-select">
                                            <option>Select Medicine </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-sm-12 d-flex align-items-center justify-content-end">
                                <div>
                                    <button className="nw-thm-btn sub-nw-brd-tbn ">Search</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Analysis