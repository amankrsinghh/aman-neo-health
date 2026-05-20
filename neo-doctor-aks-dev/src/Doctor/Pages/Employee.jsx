import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faGear,
    faPen,
    faSearch,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteApiData, getSecureApiData, securePostData } from "../../Services/api";
import base_url from "../../baseUrl";
;

function Employee() {
    const userId = localStorage.getItem('userId')
    const [employees, setEmployees] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [name, setName] = useState('')
    const [totalPage, setTotalPage] = useState(1)
    const fetchLabStaff = async () => {
        try {
            const response = await getSecureApiData(`api/staff/list?page=${currentPage}&name=${name}`);

            if (response.success) {
                setEmployees(response.staffData)
                setTotalPage(response.pagination.totalPages)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }
    useEffect(() => {
        fetchLabStaff()
    }, [userId, currentPage])
    const staffAction = async (e, id, status) => {
        e.preventDefault()
        const data = { empId: id, status }
        try {
            const response = await securePostData(`api/staff/status`, data);
            if (response.success) {
                toast.success('Status updated')
                fetchLabStaff()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }
    const deleteStaff = async (id) => {
        try {
            const response = await deleteApiData(`doctor/staff/${id}`);
            if (response.success) {
                toast.success('Staff deleted')
                fetchLabStaff()
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }
    useEffect(() => {
        setTimeout(() => {
            fetchLabStaff()
        }, 1000)
    }, [name])

    return (
        <>



            <div className="profile-right-card">
                <div className="profile-tp-header d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="heading-grad fz-24 mb-0">Employee List</h5>
                    </div>
                    <div className="add-nw-bx">
                        <NavLink
                            to="/employee-data"
                            className="add-nw-btn thm-btn"
                        >
                            <img src="/plus-icon.png" alt="" /> Add
                        </NavLink>
                    </div>
                </div>
                <div className="all-profile-data-bx">
                    <div>

                        <div className="row ">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="custom-frm-bx">
                                    <input type="text" className="form-control admin-table-search-frm  pe-5"
                                        value={name} onChange={(e) => setName(e.target.value)} placeholder="Search " />
                                    <div className="adm-search-bx">
                                        <button className="tp-search-btn text-secondary"><FontAwesomeIcon icon={faSearch} /></button>
                                    </div>
                                </div>
                                {totalPage > 1 && <div>
                                    <div className="page-selector d-flex align-items-center">
                                        <div className="custom-frm-bx">
                                            <select
                                                value={currentPage}
                                                onChange={(e) => setCurrentPage(e.target.value)}
                                                className="form-select custom-page-dropdown nw-custom-page ">
                                                {Array.from({ length: totalPage }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
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
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    {/* <th>Role</th> */}
                                                    <th>Permission</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees?.length > 0 &&
                                                    employees?.map((item, key) =>
                                                        <tr key={key}>
                                                            <td>{(currentPage - 1) * 10 + key + 1}.</td>
                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">
                                                                        <img src={item?.userId?.staffId?.profileImage
                                                                             ? `${base_url}/${item?.userId?.staffId.profileImage}` : "/user-icon.png"} alt="" />
                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.userId?.name}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{item?.userId?.email}</td>
                                                            {/* <td>{item?.contactInformation?.email}</td> */}
                                                            {/* <td>Staff</td> */}
                                                            <td>{item?.permissionId?.name}</td>
                                                            <td>
                                                                <div className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`toggle-${item._id}`} // unique id for each item
                                                                        checked={item.status === "active"} // checked if status is active
                                                                        onChange={(e) =>
                                                                            staffAction(e, item._id, e.target.checked ? "active" : "inactive")
                                                                        }
                                                                    />
                                                                    <label htmlFor={`toggle-${item._id}`}></label>
                                                                </div>

                                                            </td>
                                                            <td>
                                                                <NavLink
                                                                    href="#"
                                                                    className=" admin-sub-dropdown dropdown-toggle"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <FontAwesomeIcon icon={faGear} /> Action
                                                                </NavLink>

                                                                <div className="dropdown">
                                                                    <NavLink
                                                                        href="#"
                                                                        className="attendence-edit-btn"
                                                                        id="acticonMenu1"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                    >
                                                                        <i className="fas fa-pen"></i>
                                                                    </NavLink>
                                                                    <ul
                                                                        className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                                                                        aria-labelledby="acticonMenu1"
                                                                    >
                                                                        <li className="drop-item">
                                                                            <NavLink to={`/view-employee/${item?.userId?.name}/${item?.userId?.nh12}`} className="nw-dropdown-item" href="#">
                                                                                <FontAwesomeIcon icon={faEye} className="" />
                                                                                View
                                                                            </NavLink>
                                                                        </li>

                                                                        <li className="drop-item">
                                                                            <Link to={`/employee-data?id=${item?.userId?.nh12}`}
                                                                                className="nw-dropdown-item"

                                                                            >
                                                                                <FontAwesomeIcon icon={faPen} className="" />
                                                                                Edit
                                                                            </Link>
                                                                        </li>

                                                                        <li className="drop-item">
                                                                            <button className="nw-dropdown-item" type="button" onClick={() => deleteStaff(item?._id)}>
                                                                                <FontAwesomeIcon icon={faTrash} className="" />
                                                                                Delete
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                {/* <tr>
                      <td>02.</td>
                      <td>
                        <div className="admin-table-bx">
                          <div className="admin-table-sub-bx">
                            <img src="/user-icon.png" alt="" />
                            <div className="admin-table-sub-details">
                              <h6>Albert Flores</h6>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>+91-9876543210</td>
                      <td>debbie.baker@example.com</td>
                      <td>Staff</td>
                      <td>Full access</td>
                      <td>
                        <div className="switch">
                          <input type="checkbox" id="toggle6" />
                          <label for="toggle6"></label>
                        </div>
                      </td>
                      <td>
                        <a
                          href="javascript:void(0)"
                          className=" admin-sub-dropdown dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <FontAwesomeIcon icon={faGear} /> Action
                        </a>

                        <div className="dropdown">
                          <a
                            href="javascript:void(0)"
                            className="attendence-edit-btn"
                            id="acticonMenu1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fas fa-pen"></i>
                          </a>
                          <ul
                            className="dropdown-menu dropdown-menu-end user-dropdown tble-action-menu"
                            aria-labelledby="acticonMenu1"
                          >
                            <li className="drop-item">
                              <NavLink to="/view-employee" className="nw-dropdown-item" href="#">
                                <FontAwesomeIcon icon={faEye} className="" />
                                View
                              </NavLink>
                            </li>

                            <li className="drop-item">
                              <NavLink to="/employee-data"
                                className="nw-dropdown-item"

                              >
                                <FontAwesomeIcon icon={faPen} className="" />
                                Edit
                              </NavLink>
                            </li>

                            <li className="drop-item">
                              <a className="nw-dropdown-item" href="#">
                                <FontAwesomeIcon icon={faTrash} className="" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>




        </>
    );
}

export default Employee;
