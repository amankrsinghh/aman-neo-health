import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { deleteApiData, getSecureApiData } from "../../Service/api"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from 'date-fns';
import Loader from "../Common/Loader";
import { Link, NavLink } from "react-router-dom";
function Notification() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [allData, setAllData] = useState()
    const [totalPages, setTotalPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    async function fetchNotifications() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`api/comman/notification`)
            if (result.success) {
                setAllData(result.data)
                setTotalPage(result.pagination.totalPages)
                setCurrentPage(result.pagination.page)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (userId) {
            fetchNotifications()
        }
    }, [userId])
    async function deleteNotifications() {
        try {
            const result = await deleteApiData(`api/comman/delete-all-notification`)
            if (result.success) {
                fetchNotifications()
            }
        } catch (error) {

        }
    }
    async function deleteOneNotifications(id) {
        try {
            const result = await deleteApiData(`api/comman/delete-notification/${id}`)
            if (result.success) {
                fetchNotifications()
            }
        } catch (error) {

        }
    }
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Notification</h3>
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
                                            > Notification
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            {allData?.length > 0 && <div>
                                <button type="button" onClick={() => deleteNotifications()} className="nw-thm-btn ">All  Delete </button>
                            </div>}

                        </div>
                    </div>

                    <div className='new-mega-card'>
                        <div className="row">
                            <div className="col-lg-12 col-dm-12 col-sm-12">
                                {allData?.length > 0 ?
                                    allData?.map((item, key) =>
                                        <div className="notification-card" key={key}>
                                            <div className="notification-parent-card">
                                                <div className="notification-sub-card">
                                                    <div>
                                                        <span className="notifi-icon-bx"><FontAwesomeIcon icon={faBell} /></span>
                                                    </div>
                                                    <div className="notification-content">
                                                        <h5>{item?.title}</h5>
                                                        <p>{item?.message}</p>
                                                    </div>
                                                </div>
                                                <div className="notification-timing">
                                                    <h6 className="text-capitalize">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</h6>
                                                    <span><button onClick={() => deleteOneNotifications(item?._id)} className="notifi-remv-btn"><FontAwesomeIcon icon={faTrash} /></button></span>
                                                </div>
                                            </div>
                                        </div>) : 'No notification '}

                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-3">
                        <Link to={-1} className="nw-thm-btn outline" >
                            Go Back
                        </Link>
                    </div>



                </div>}
        </>
    )
}

export default Notification