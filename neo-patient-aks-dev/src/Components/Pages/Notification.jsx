import { faHome, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { FaCalendarAlt } from "react-icons/fa";
import { deleteApiData, getSecureApiData } from "../../Services/api";

function Notification() {
    const userId=localStorage.getItem('userId')
    const [ allData, setAllData] = useState()
    const [totalPages,setTotalPage]=useState(0)
    const [currentPage,setCurrentPage]=useState(0)
    async function fetchNotifications() {
        try {
            const result=await getSecureApiData(`api/comman/notification`)
            if(result.success){
                setAllData(result.data)
                setTotalPage(result.pagination.totalPages)
                setCurrentPage(result.pagination.page)
            }
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        if(userId){
            fetchNotifications()
        }
    },[userId])
     async function deleteNotifications() {
        try {
            const result=await deleteApiData(`api/comman/delete-all-notification`)
            if(result.success){
                fetchNotifications()
            }
        } catch (error) {
            
        }
    }
     async function deleteOneNotifications(id) {
        try {
            const result=await deleteApiData(`api/comman/delete-notification/${id}`)
            if(result.success){
                fetchNotifications()
            }
        } catch (error) {
            
        }
    }
    return (
        <>
            <section className="tp-breadcrum-section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="text-center mb-3">
                                <h4 className="lg_title">Notification</h4>
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
                                            Notification
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="notification-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {allData?.length>0 &&<div className="text-end mb-3">
                                <button className="nw-thm-btn" onClick={()=>deleteNotifications()}>All  Delete </button>
                            </div>}                    
                            

                            {allData?.length>0? allData?.map((item,key)=>
                            <div className="notification-card" key={key}>
                                <div className="notification-parent-card">
                                    <div className="notification-sub-card">
                                        <div>
                                            <span className="notifi-icon-bx"><FaCalendarAlt /></span>
                                        </div>
                                        <div className="notification-content">
                                            <h5>{item?.title}</h5>
                                            <p>{item?.message}</p>
                                        </div>
                                    </div>
                                    <div className="notification-timing">
                                        <h6 className="text-capitalize">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</h6>
                                        <span><button className="notifi-remv-btn" onClick={()=>deleteOneNotifications(item._id)}><FontAwesomeIcon icon={faTrash} /></button></span>
                                    </div>
                                </div>
                            </div>):
                            'No notifications found'}                            

                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Notification