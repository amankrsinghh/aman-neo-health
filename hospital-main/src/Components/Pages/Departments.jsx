import { TbGridDots } from "react-icons/tb";
import {
    faCircleXmark,
    faPen,
    faSearch,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import { Link, useNavigate } from "react-router-dom";
import { getSecureApiData, securePostData, updateApiData } from "../../Service/api";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate()


    const [form, setForm] = useState({
        departmentName: "",
        type: "OPD",
        headOfDepartment: null,
        employees: [],
        otherData: {
            floorId: null,
            roomId: null,
            floor:"",
            room:"",
        }
    });

    const [editId, setEditId] = useState(null);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await getSecureApiData(`api/department/list?page=${page}&search=${search}&type=${type}`)
            if (res.success) {
                setDepartments(res.data);
                setTotalPages(res.pagination.totalPages);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const fetchStaff = async () => {
        try {
            const res = await getSecureApiData(`api/hospital/staff-all/${userId}?status=active&limit=100`);
            if (res.success) {
                setEmployee(res.data);
            }
        } catch (err) {
            toast.error("Failed to load staff");
        }
    };
    const fetchFloors = async () => {
        try {
            const res = await getSecureApiData("api/bed/floor/list");
            setFloors(res.data);
        } catch {
            toast.error("Failed to load floors");
        }
    };
    const fetchRooms = async (floorId) => {
        if (!floorId) {
            setRooms([]);
            return;
        }

        try {
            const res = await getSecureApiData(`api/bed/room/${floorId}`);
            setRooms(res.data);
        } catch {
            toast.error("Failed to load rooms");
        }
    };
    useEffect(() => {
        fetchDepartments();
        fetchStaff();
    }, [page, limit, type]);
    useEffect(() => {
        fetchFloors()
    }, [])

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            const res = await securePostData("api/department/create", form);
            if (res.success) {

                fetchDepartments();
                document.getElementById("closeAdd").click();
                setForm({
                    departmentName: "",
                    type: "OPD",
                    headOfDepartment: null,
                    employees: [],
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openEditModal = (dept) => {
        setEditId(dept._id);

        setForm({
            departmentName: dept.departmentName,
            type: dept.type,
            headOfDepartment: dept.headOfDepartment?._id || null,
            otherData: {
                floorId: dept?.otherData?.floorId || null,
                roomId: dept?.otherData?.roomId || null,
                floor: dept?.otherData?.floor || null,
                room: dept?.otherData?.room || null,
            },
            employees: (dept.employees || []).map(emp => ({
                employeeId:
                    typeof emp.employeeId === "object"
                        ? emp.employeeId._id
                        : emp.employeeId,
                role: emp.role || ""
            }))
        });
        if (dept?.otherData?.floorId) {
            fetchRooms(dept?.otherData?.floorId)
        }
    };

    const handleUpdateDepartment = async (e) => {
        e.preventDefault();
        try {
            const res = await updateApiData(`api/department/update`, { ...form, departmentId: editId });
            if (res.success) {
                toast.success(res.message)
                document.getElementById("closeEdit").click();
                fetchDepartments();
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const deleteDepartment = async (id) => {
        if (!window.confirm("Delete this department?")) return;
        try {
            const res = await api.delete(`/hospital/departments/${id}`);
            if (res.data.success) {
                fetchDepartments();
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    };
    const closeModal = (id) => {
        const modal = document.getElementById(id);
        const backdrop = document.querySelector(".modal-backdrop");
        if (modal) {
            modal.classList.remove("show");
            modal.style.display = "none";
        }
        document.body.classList.remove("modal-open");
        if (backdrop) backdrop.remove();
    };
    useEffect(() => {
        if (localStorage.getItem('doctorId')) {
            navigate('/dashboard')
        }
    }, [])
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Departments</h3>
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
                                                Departments
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                            <div className="add-nw-bx">
                                <a href="javascript:void(0)"
                                    onClick={() =>
                                        setForm({
                                            departmentName: "",
                                            type: "OPD",
                                            headOfDepartment: null,
                                            employees: [],
                                            otherData: {
                                                floorId: null,
                                                roomId: null,
                                            }
                                        })
                                    }
                                    className="add-nw-btn nw-thm-btn" data-bs-toggle="modal" data-bs-target="#add-Department">
                                    <img src="/plus-icon.png" alt="" /> Add Department
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">
                                <div className="custom-frm-bx mb-0">
                                    <input
                                        type="text"
                                        className="form-control  search-table-frm pe-5"
                                        placeholder="Enter department name"
                                        value={search}
                                        onChange={(e) => {
                                            setPage(1);          // reset page
                                            setSearch(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key == "Enter") {
                                                fetchDepartments()
                                            }
                                        }}
                                    />
                                    <div className="adm-search-bx">
                                        <button className="text-secondary" onClick={() => fetchDepartments()}>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </button>
                                    </div>
                                </div>

                                {totalPages > 1 && <div className="page-selector">
                                    <div className="filters">
                                        <select className="form-select custom-page-dropdown nw-custom-page "
                                            value={page}
                                            onChange={(e) => setPage(e.target.value)}>
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
                                                    <th>#</th>
                                                    <th>IPD/OPD</th>
                                                    <th>Department Name</th>
                                                    <th>Head of Department</th>
                                                    <th>Employee</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {departments?.length > 0 ?
                                                    departments?.map((dept, index) => (
                                                        <tr key={dept._id}>
                                                            <td>{String(index + 1).padStart(2, "0")}.</td>
                                                            <td>{dept.type}</td>
                                                            <td>{dept.departmentName}</td>
                                                            <td>{dept.headOfDepartment?.name || "-"}</td>
                                                            <td>{dept.employees?.length || 0}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="text-success"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#edit-Department"
                                                                    onClick={() => openEditModal(dept)}
                                                                >
                                                                    <FontAwesomeIcon icon={faPen} />
                                                                </button>
                                                                {/* <button
                                                                type="button"
                                                                className="text-danger"
                                                                onClick={() => deleteDepartment(dept._id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button> */}
                                                            </td>
                                                        </tr>
                                                    )) :
                                                    <span className="text-black">No department found</span>}
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

            {/* <!-- add-Department Alert Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#add-Department" --> */}
            <div className="modal step-modal" id="add-Department" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Add Department</h6>
                            </div>
                            <div>
                                <button type="button" className="" id="closeAdd" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body  pb-5 px-4">
                            <div className="row ">
                                <div className="col-lg-12">

                                    <div className="add-deprtment-pic">
                                        <img src="/add-department.png" alt="" />
                                    </div>

                                    <form onSubmit={handleAddDepartment}>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Add Department</label>
                                            <input type="text" className="form-control custom-select"
                                                placeholder="Enter Department Name"
                                                value={form.departmentName}
                                                onChange={(e) =>
                                                    setForm({ ...form, departmentName: e.target.value })
                                                } />
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Head of Department </label>
                                            <div className="select-wrapper">
                                                <select
                                                    className="form-select custom-select"
                                                    value={form.headOfDepartment}

                                                    onChange={(e) =>
                                                        setForm({ ...form, headOfDepartment: e.target.value })
                                                    }
                                                >
                                                    <option value="">---Select Head of Department---</option>
                                                    {employee?.map((emp) => (
                                                        <option key={emp._id} value={emp.userId?._id}>
                                                            {emp?.userId?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>

                                        <div className="education-frm-bx mb-4 p-2">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <h5 className="mb-0 fz-16 fw-700">Add Employee</h5>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            employees: [...form.employees, { employeeId: "", role: "" }]
                                                        })
                                                    }
                                                >
                                                    <FaPlusCircle />
                                                </button>
                                            </div>

                                            {form.employees.map((emp, index) => (
                                                <div className="row align-items-end mb-2" key={index}>
                                                    {/* Employee */}
                                                    <div className="col-lg-12">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="custom-frm-bx flex-grow-1 ">
                                                                <label>Employee</label>
                                                                <select
                                                                    className="form-select custom-select"
                                                                    value={emp.employeeId}
                                                                    onChange={(e) => {
                                                                        const updated = [...form.employees];
                                                                        updated[index].employeeId = e.target.value;
                                                                        setForm({ ...form, employees: updated });
                                                                    }}
                                                                >
                                                                    <option value="">-Select Employee-</option>
                                                                    {employee?.filter((e) => {
                                                                        const selectedIds = form.employees
                                                                            .filter((_, i) => i !== index)
                                                                            .map((emp) => emp.employeeId);

                                                                        return !selectedIds.includes(e?.userId?._id);
                                                                    })?.map((e) => (
                                                                        <option key={e._id} value={e?.userId?._id}>
                                                                            {e?.userId?.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="">
                                                                <button
                                                                    type="button"
                                                                    className="text-danger"
                                                                    onClick={() => {
                                                                        const updated = form.employees.filter((_, i) => i !== index);
                                                                        setForm({ ...form, employees: updated });
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Role */}
                                                    {/* <div className="col-lg-5 col-md-5 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label>Role</label>
                                                            <input
                                                                type="text"
                                                                className="form-control custom-select"
                                                                placeholder="Enter Role"
                                                                value={emp.role}
                                                                onChange={(e) => {
                                                                    const updated = [...form.employees];
                                                                    updated[index].role = e.target.value;
                                                                    setForm({ ...form, employees: updated });
                                                                }}
                                                            />
                                                        </div>
                                                    </div> */}

                                                    {/* Trash */}
                                                    {/* <div className="col-lg-1 col-md-1 col-sm-12 text-center">
                                                        <button
                                                            type="button"
                                                            className="text-danger"
                                                            onClick={() => {
                                                                const updated = form.employees.filter((_, i) => i !== index);
                                                                setForm({ ...form, employees: updated });
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div> */}
                                                </div>
                                            ))}
                                        </div>



                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="custom-frm-bx ">
                                                <label htmlFor="">Type</label>

                                                <div className="custom-radio-group d-flex flex-wrap ">
                                                    <div className=" form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="OPD"
                                                            id="opdRadio"
                                                            checked={form.type === "OPD"}
                                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="opdRadio">
                                                            OPD
                                                        </label>
                                                    </div>

                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="IPD"
                                                            id="ipdRadio"
                                                            checked={form.type === "IPD"}
                                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="ipdRadio">
                                                            IPD
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="EMERGENCY"
                                                            id="emergencyRadio"
                                                            checked={form.type === "EMERGENCY"}
                                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="emergencyRadio">
                                                            EMERGENCY
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="LAB"
                                                            id="labRadio"
                                                            checked={form.type === "LAB"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="labRadio">
                                                            LAB
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="PHARMACY"
                                                            id="pharRadio"
                                                            checked={form.type === "PHARMACY"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="pharRadio">
                                                            PHARMACY
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>

                                            </div>
                                        </div>
                                        {form.type == "IPD" && <>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Select Floor </label>
                                                <div className="select-wrapper">
                                                    <select
                                                        className="form-select custom-select"
                                                        value={form?.otherData?.floorId}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            fetchRooms(value);

                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    floorId: value,
                                                                },
                                                            }));
                                                        }}
                                                    >
                                                        <option value="">---Select Floor---</option>
                                                        {floors.map((item) => (
                                                            <option key={item._id} value={item?._id}>
                                                                {item.floorName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {rooms?.length > 0 &&
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Select Room </label>
                                                    <div className="select-wrapper">
                                                        <select
                                                            className="form-select custom-select"
                                                            value={form?.otherData?.roomId}
                                                            onChange={(e) => {
                                                                const value = e.target.value;


                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    otherData: {
                                                                        ...prev.otherData,
                                                                        roomId: value,
                                                                    },
                                                                }));
                                                            }}
                                                        >
                                                            <option value="">---Select Room---</option>
                                                            {rooms.map((item) => (
                                                                <option key={item._id} value={item?._id}>
                                                                    {item.roomName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>}
                                        </>}
                                        {form.type == "OPD" && <>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Floor </label>
                                                    <input type="text"
                                                        className="form-control custom-select"
                                                        value={form?.otherData?.floor}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    floor: value,
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                       
                                            </div>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Room </label>
                                                    <input type="text"
                                                        className="form-control custom-select"
                                                        value={form?.otherData?.room}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    room: value,
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                       
                                            </div>
                                            
                                        </>}


                                        <div className="mt-3">
                                            <button type="submit" className="nw-thm-btn w-100"> Add Department</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- add-Department Popup End --> */}


            {/* <!-- add-Department Alert Popup Start --> */}
            {/* <!--  data-bs-toggle="modal" data-bs-target="#edit-Department" --> */}
            <div className="modal step-modal" id="edit-Department" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">Edit Department</h6>
                            </div>
                            <div>
                                <button type="button" className="" id="closeEdit" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body  pb-5 px-4">
                            <div className="row ">
                                <div className="col-lg-12">

                                    <div className="add-deprtment-pic">
                                        <img src="/add-department.png" alt="" />
                                    </div>

                                    <form onSubmit={handleUpdateDepartment}>
                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Add Department</label>
                                            <input type="text"
                                                className="form-control custom-select"
                                                placeholder="Enter Role Name"
                                                value={form.departmentName}
                                                onChange={(e) =>
                                                    setForm({ ...form, departmentName: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Head of Department </label>
                                            <div className="select-wrapper">
                                                <select
                                                    className="form-select custom-select"
                                                    value={form.headOfDepartment}

                                                    onChange={(e) =>
                                                        setForm({ ...form, headOfDepartment: e.target.value })
                                                    }
                                                >
                                                    <option value="">---Select Head of Department---</option>
                                                    {employee?.map((emp) => (
                                                        <option key={emp._id} value={emp?.userId?._id}>
                                                            {emp.userId?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>

                                        <div className="education-frm-bx mb-4 p-2">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <h5 className="mb-0 fz-16 fw-700">Add Employee</h5>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            employees: [...form.employees, { employeeId: "", role: "" }]
                                                        })
                                                    }
                                                >
                                                    <FaPlusCircle />
                                                </button>
                                            </div>

                                            {form.employees.map((emp, index) => (
                                                <div className="row align-items-end mb-2" key={index}>
                                                    {/* Employee */}
                                                    <div className="col-lg-12">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="custom-frm-bx flex-grow-1 ">
                                                                <label>Employee</label>
                                                                <select
                                                                    className="form-select custom-select"
                                                                    value={emp.employeeId}
                                                                    onChange={(e) => {
                                                                        const updated = [...form.employees];
                                                                        updated[index].employeeId = e.target.value;
                                                                        setForm({ ...form, employees: updated });
                                                                    }}
                                                                >
                                                                    <option value="">-Select Employee-</option>
                                                                    {employee?.filter((e) => {
                                                                        const selectedIds = form.employees
                                                                            .filter((_, i) => i !== index)
                                                                            .map((emp) => emp.employeeId);

                                                                        return !selectedIds.includes(e?.userId?._id);
                                                                    })?.map((e) => (
                                                                        <option key={e._id} value={e?.userId?._id}>
                                                                            {e?.userId?.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div >
                                                                <button
                                                                    type="button"
                                                                    className="text-danger"
                                                                    onClick={() => {
                                                                        const updated = form.employees.filter((_, i) => i !== index);
                                                                        setForm({ ...form, employees: updated });
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Role */}
                                                    {/* <div className="col-lg-5 col-md-5 col-sm-12">
                                                        <div className="custom-frm-bx">
                                                            <label>Role</label>
                                                            <input
                                                                type="text"
                                                                className="form-control custom-select"
                                                                placeholder="Enter Role"
                                                                value={emp.role}
                                                                onChange={(e) => {
                                                                    const updated = [...form.employees];
                                                                    updated[index].role = e.target.value;
                                                                    setForm({ ...form, employees: updated });
                                                                }}
                                                            />
                                                        </div>
                                                    </div> */}

                                                    {/* Trash */}
                                                    {/* <div className="col-lg-1 col-md-1 col-sm-12 text-center">
                                                        <button
                                                            type="button"
                                                            className="text-danger"
                                                            onClick={() => {
                                                                const updated = form.employees.filter((_, i) => i !== index);
                                                                setForm({ ...form, employees: updated });
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div> */}
                                                </div>
                                            ))}
                                        </div>



                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="custom-frm-bx ">
                                                <label htmlFor="">Type</label>

                                                <div className="custom-radio-group d-flex flex-wrap">
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="OPD"
                                                            id="opdRadio"
                                                            checked={form.type === "OPD"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        {/* <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="optionType"
                                                            id="textOption"
                                                            value="text"
                                                            defaultChecked
                                                        /> */}
                                                        <label className="form-check-label ms-1" htmlFor="opdRadio">
                                                            OPD
                                                        </label>
                                                    </div>

                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="IPD"
                                                            id="ipdRadio"
                                                            checked={form.type === "IPD"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="ipdRadio">
                                                            IPD
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="EMERGENCY"
                                                            id="emergencyRadio"
                                                            checked={form.type === "EMERGENCY"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="emergencyRadio">
                                                            EMERGENCY
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="LAB"
                                                            id="labRadio"
                                                            checked={form.type === "LAB"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="labRadio">
                                                            LAB
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value="PHARMACY"
                                                            id="pharRadio"
                                                            checked={form.type === "PHARMACY"}
                                                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                        />
                                                        <label className="form-check-label ms-1" htmlFor="pharRadio">
                                                            PHARMACY
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        {form.type == "IPD" && <>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Select Floor </label>
                                                <div className="select-wrapper">
                                                    <select
                                                        className="form-select custom-select"
                                                        value={form?.otherData?.floorId}
                                                        required
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            fetchRooms(value);

                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    floorId: value,
                                                                },
                                                            }));
                                                        }}
                                                    >
                                                        <option value="">---Select Floor---</option>
                                                        {floors.map((item) => (
                                                            <option key={item._id} value={item?._id}>
                                                                {item.floorName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {rooms?.length > 0 &&
                                                <div className="custom-frm-bx">
                                                    <label htmlFor="">Select Room </label>
                                                    <div className="select-wrapper">
                                                        <select
                                                            className="form-select custom-select"
                                                            value={form?.otherData?.roomId}
                                                            required
                                                            onChange={(e) => {
                                                                const value = e.target.value;


                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    otherData: {
                                                                        ...prev.otherData,
                                                                        roomId: value,
                                                                    },
                                                                }));
                                                            }}
                                                        >
                                                            <option value="">---Select Room---</option>
                                                            {rooms.map((item) => (
                                                                <option key={item._id} value={item?._id}>
                                                                    {item.roomName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>}
                                        </>}

 {form.type == "OPD" && <>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Floor </label>
                                                    <input type="text"
                                                        className="form-control custom-select"
                                                        value={form?.otherData?.floor}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    floor: value,
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                       
                                            </div>
                                            <div className="custom-frm-bx">
                                                <label htmlFor="">Room </label>
                                                    <input type="text"
                                                        className="form-control custom-select"
                                                        value={form?.otherData?.room}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                otherData: {
                                                                    ...prev.otherData,
                                                                    room: value,
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                       
                                            </div>
                                            
                                        </>}

                                        <div className="mt-3">
                                            <button type="submit" className="nw-thm-btn w-100" >Save</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- add-Department Popup End --> */}






        </>
    )
}

export default Departments