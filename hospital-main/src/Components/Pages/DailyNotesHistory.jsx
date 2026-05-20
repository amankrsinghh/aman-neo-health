import { TbGridDots } from "react-icons/tb";
import { faCircleXmark, faDownload, faFilter, faSearch, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data, Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import base_url from "../../baseUrl";
import Loader from "../Common/Loader";
import { useSelector } from "react-redux";
import { getSecureApiData } from "../../Service/api";

function DailyNotesHistory() {
    const [searchParams] = useSearchParams()
    const allotmentId = searchParams.get('allotment')
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0)
    const [activeHistory, setActiveHistory] = useState()
    const [loading, setLoading] = useState(false)
    const [general, setGeneral] = useState({})
    const [subjective, setSubjective] = useState({})
    const [objective, setObjective] = useState({})
    const [labImaging, setLabImaging] = useState({})
    const [assessment, setAssessment] = useState({})
    const [todayPlan, setTodayPlan] = useState({})
    const [signOff, setSignOff] = useState({})
    const navigate = useNavigate()

    const fetchHistory = async () => {
        if(!allotmentId){
            return
        }
        try {
            setLoading(true)
            const res = await getSecureApiData(`api/ipd-note/history/${allotmentId}?page=${page}`);
            if (res.success) {
                setHistory(res.data)
                setTotalPages(res.pagination.totalPages)
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setLoading(false)
        }
    };
    const fetchHeaderData = async () => {
        try {
            setLoading(true)
            const res = await await getSecureApiData(`api/ipd-note/header-data/${activeHistory}`);
            if (res.success) {
                const data = res.data
                setGeneral(data?.header)
                setSubjective(data?.subjective)
                setObjective(data?.objective)
                setLabImaging(data?.labImaging)
                setAssessment(data?.assessment)
                setTodayPlan(data?.todayPlan)
                setSignOff(data?.signOff)
            } else {
                toast.error(res?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchHistory();
    }, [page, allotmentId]);
    useEffect(() => {
        if (activeHistory) {
            fetchHeaderData()
        }
    }, [activeHistory])
    const openTab = (tabId) => {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;

        const tab = new window.bootstrap.Tab(tabEl);
        tab.show();
    };
    // useEffect(() => {
    //     if (!allotmentId) {
    //         navigate('/bed-allotment-history')
    //     }
    // }, [allotmentId])
    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row ">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2 gradient-text">Daily Notes History</h3>
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
                                                Daily Notes History
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            {totalPages > 1 && <div className="row">
                                <div className="d-flex align-items-center justify-content-between mb-3 gap-2 nw-box ">

                                    {<div className="page-selector">
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
                            </div>}

                        </div>
                    </div>

                    <div className='new-panel-card'>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="table-section">
                                    <div className="table table-responsive mb-0">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Patient Name</th>
                                                    <th>Staff</th>
                                                    <th>Doctor</th>
                                                    {/* <th>Experience</th> */}
                                                    <th>Date & Time</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            No history found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    history?.map((item, index) => (
                                                        <tr key={item._id}>
                                                            <td>{(page - 1) * limit + index + 1}.</td>

                                                            <td>
                                                                <div className="admin-table-bx">
                                                                    <div className="admin-table-sub-bx">

                                                                        <div className="admin-table-sub-details">
                                                                            <h6>{item?.patientId?.name}</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>{item?.authorId?.name || "-"}</td>
                                                            <td>{item?.doctorId?.name || "-"}</td>
                                                            {/* <td>{item?.professionalInfo?.experience ? `${item?.professionalInfo?.experience} years` : "-"}</td> */}

                                                            <td>{item?.time + "  " + item?.date}
                                                            </td>
                                                            <td>
                                                                <a href="#" data-bs-toggle="modal" data-bs-target="#viewNotes" onClick={() => setActiveHistory(item?._id)} className="nw-thm-btn">View</a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end mt-3">
                        <Link to={-1} className="nw-thm-btn outline" >
                            Go Back
                        </Link>
                    </div>
                </div>}
            <div className="modal step-modal fade" id="viewNotes" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content rounded-0">
                        <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                            <div>
                                <h6 className="lg_title mb-0">IPD Daily Notes</h6>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className=""
                                    id="closeIPD"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    style={{ color: "#00000040" }}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body pb-5 px-4 pb-5">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="employee-tabs mb-4">
                                        <ul className="nav nav-tabs gap-3 ps-2" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link active"
                                                    id="home-tab"
                                                    data-bs-toggle="tab"
                                                    href="#home"
                                                    role="tab"
                                                >
                                                    General
                                                </a>
                                            </li>

                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="subjective-tab"
                                                    data-bs-toggle="tab"
                                                    href="#subjective"
                                                    role="tab"
                                                    disabled={!activeHistory}
                                                >
                                                    Subjective
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="objective-tab"
                                                    data-bs-toggle="tab"
                                                    href="#objective"
                                                    role="tab"
                                                    disabled={!activeHistory}
                                                >
                                                    Objective
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="lab-tab"
                                                    data-bs-toggle="tab"
                                                    href="#lab"
                                                    disabled={!activeHistory}
                                                    role="tab"
                                                >
                                                    Lab & Imaging
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="assessment-tab"
                                                    data-bs-toggle="tab"
                                                    href="#assessment"
                                                    role="tab"
                                                    disabled={!activeHistory}
                                                >
                                                    Assessment
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="plan-tab"
                                                    data-bs-toggle="tab"
                                                    href="#plan"
                                                    role="tab"
                                                    disabled={!activeHistory}
                                                >
                                                    Today Plan
                                                </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a
                                                    className="nav-link"
                                                    id="signOff-tab"
                                                    data-bs-toggle="tab"
                                                    href="#signOff"
                                                    role="tab"
                                                    disabled={!activeHistory}
                                                >
                                                    Sign Off
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="new-panel-card">
                                        <div className="">
                                            <div className="tab-content" id="myTabContent">
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="home"
                                                    role="tabpanel"
                                                >
                                                    <form >
                                                        <div className="row">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <h4 className="lg_title text-black fw-700 mb-3">General Information</h4>

                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Patient Id</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.patientId?.nh12}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Patient Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.patientId?.name}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* <div className="row">

                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Bed</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.bed}

                                                                />
                                                            </div>
                                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                                <label htmlFor="">Room</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    name="name"
                                                                    readOnly
                                                                    value={general?.room}

                                                                />
                                                            </div>
                                                        </div> */}
                                                        <div className="row">
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Author id</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    name="authorNh12"
                                                                    value={general?.authorId?.nh12}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Author Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    name="authorNh12"
                                                                    value={general?.authorId?.name}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">

                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Attending Doctor</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    name="doctorNh12"
                                                                    value={general?.doctorId?.nh12}

                                                                />
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                                <label htmlFor="">Attending Doctor Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control "
                                                                    placeholder=""
                                                                    value={general?.doctorId?.name}
                                                                />
                                                            </div>
                                                            <div className="text-end mt-4">
                                                                <button type="button" disabled={loading}
                                                                    onClick={() => openTab('subjective-tab')}
                                                                    className="nw-thm-btn">Next</button>
                                                            </div>

                                                        </div>
                                                    </form>
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="subjective"
                                                    role="tabpanel"
                                                >
                                                    <form >
                                                        <div className="row">
                                                            <h4 className="lg_title text-black fw-700 mb-3">
                                                                Subjective Information
                                                            </h4>
                                                            <div className="col-lg-4">
                                                                <label>Pain Status</label>
                                                                <select
                                                                    name="pain.status"
                                                                    className="form-control"
                                                                    value={subjective?.pain?.status}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="better">Better</option>
                                                                    <option value="same">Same</option>
                                                                    <option value="worse">Worse</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <label>Pain Location</label>
                                                                <input
                                                                    type="text"
                                                                    name="pain.location"
                                                                    className="form-control"
                                                                    value={subjective?.pain?.location}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <label>Pain Score (0-10)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="10"
                                                                    name="pain.score"
                                                                    className="form-control"
                                                                    value={subjective?.pain?.score}
                                                                />
                                                            </div>
                                                            <div className="col-lg-3 mt-3">
                                                                <div className="form-check custom-check">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="fever"
                                                                        id="fever"
                                                                        className="form-check-input"
                                                                        checked={subjective?.fever}
                                                                    />
                                                                    <label htmlFor="fever" className="form-check-label">
                                                                        Fever
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 mt-3">
                                                                <div className="form-check custom-check">
                                                                    <input
                                                                        id="breathlessness"
                                                                        type="checkbox"
                                                                        name="breathlessness"
                                                                        className="form-check-input"
                                                                        checked={subjective?.breathlessness}
                                                                    />
                                                                    <label htmlFor="breathlessness" className="form-check-label">
                                                                        Breathlessness
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 mt-3">
                                                                <label>Appetite</label>
                                                                <select
                                                                    name="appetite"
                                                                    className="form-control"
                                                                    value={subjective.appetite}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="good">Good</option>
                                                                    <option value="poor">Poor</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-4 mt-3">
                                                                <label>Sleep</label>
                                                                <select
                                                                    name="sleep"
                                                                    className="form-control"
                                                                    value={subjective?.sleep}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="ok">OK</option>
                                                                    <option value="disturbed">Disturbed</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-12 mt-3">
                                                                <label>Other Symptoms</label>
                                                                <textarea
                                                                    name="otherSymptoms"
                                                                    className="form-control"
                                                                    value={subjective?.otherSymptoms}
                                                                />
                                                            </div>
                                                            <h5 className="mt-4">Overnight Events</h5>
                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="stable">
                                                                        Stable
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="stable"
                                                                        name="overnightEvents.stable"
                                                                        checked={subjective?.overnightEvents?.stable}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="hypotension">
                                                                        Hypotension
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="hypotension"
                                                                        name="overnightEvents.hypotension"
                                                                        checked={subjective?.overnightEvents?.hypotension}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="desaturation">
                                                                        Desaturation
                                                                    </label>
                                                                    <input
                                                                        id="desaturation"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="overnightEvents.desaturation"
                                                                        checked={subjective?.overnightEvents?.desaturation}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">

                                                                    <label className="form-check-label" htmlFor="chestPain">
                                                                        Chest Pain
                                                                    </label>
                                                                    <input
                                                                        id="chestPain"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="overnightEvents.chestPain"
                                                                        checked={subjective?.overnightEvents?.chestPain}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="seizure">
                                                                        Seizure
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="overnightEvents.seizure"
                                                                        checked={subjective?.overnightEvents?.seizure}

                                                                    />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-12 mt-3">
                                                                <label>Notes</label>
                                                                <textarea
                                                                    name="notes"
                                                                    className="form-control"
                                                                    value={subjective?.notes}

                                                                />
                                                            </div>


                                                            <div className="d-flex justify-content-between mt-4">
                                                                <button type="button" disabled={loading}
                                                                    onClick={() => openTab('home-tab')}
                                                                    className="nw-thm-btn outline">Back</button>
                                                                <button type="button" disabled={loading}
                                                                    onClick={() => openTab('objective-tab')}
                                                                    className="nw-thm-btn">
                                                                    Next
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </form>
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="objective"
                                                    role="tabpanel"
                                                >

                                                    <form >

                                                        <h4 className="mb-3">Vitals</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Temperature</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.temperature"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.temperature}

                                                                />

                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Pulse</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.pulse"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.pulse}

                                                                />

                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>BP Systolic</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.bpSystolic"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.bpSystolic}

                                                                />

                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>BP Diastolic</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.bpDiastolic"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.bpDiastolic}

                                                                />

                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>SpO2</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.spo2"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.spo2}

                                                                />

                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Respiratory Rate</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.respiratoryRate"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.respiratoryRate}

                                                                />
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Oxygen Type</label>
                                                                <select
                                                                    name="vitals.oxygenSupport.type"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.oxygenSupport?.type}

                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="RA">Room Air</option>
                                                                    <option value="O2">Oxygen</option>
                                                                </select>
                                                            </div>


                                                            <div className="col-md-3 mt-3">
                                                                <label>Liters / Min</label>
                                                                <input
                                                                    type="number"
                                                                    name="vitals.oxygenSupport.litersPerMin"
                                                                    className="form-control"
                                                                    value={objective?.vitals?.oxygenSupport?.litersPerMin}

                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Intake / Output</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Intake (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.intakeMl"
                                                                    className="form-control"
                                                                    value={objective?.intakeOutput?.intakeMl}

                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Output (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.outputMl"
                                                                    className="form-control"
                                                                    value={objective?.intakeOutput?.outputMl}

                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Urine (ml)</label>
                                                                <input
                                                                    type="number"
                                                                    name="intakeOutput.urineMl"
                                                                    className="form-control"
                                                                    value={objective?.intakeOutput?.urineMl}

                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Drains</label>
                                                                <input
                                                                    type="text"
                                                                    name="intakeOutput.drains"
                                                                    className="form-control"
                                                                    value={objective?.intakeOutput?.drains}

                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">General Exam</h4>

                                                        <div className="row">

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="comfortable">
                                                                        Comfortable
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        id="comfortable"
                                                                        className="form-check-input"
                                                                        name="physicalExam.general.comfortable"
                                                                        checked={objective?.physicalExam?.general?.comfortable}

                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="distressed">
                                                                        Distressed
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="distressed"
                                                                        name="physicalExam.general.distressed"
                                                                        checked={objective?.physicalExam?.general?.distressed}

                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" htmlFor="pallor">
                                                                        Pallor
                                                                    </label>
                                                                    <input
                                                                        id="pallor"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="physicalExam.general.pallor"
                                                                        checked={objective?.physicalExam?.general?.pallor}

                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div className="col-md-12 mt-3">
                                                            <label>CVS</label>
                                                            <textarea
                                                                name="physicalExam.cvs"
                                                                className="form-control"
                                                                value={objective?.physicalExam?.cvs}

                                                            />
                                                        </div>

                                                        <div className="col-md-12 mt-3">
                                                            <label>RS</label>
                                                            <textarea
                                                                name="physicalExam.rs"
                                                                className="form-control"
                                                                value={objective?.physicalExam?.rs}

                                                            />
                                                        </div>


                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" disabled={loading}
                                                                onClick={() => openTab('subjective-tab')}
                                                                className="nw-thm-btn outline">Back</button>
                                                            <button className="nw-thm-btn" type="button" disabled={loading}
                                                                onClick={() => openTab('lab-tab')}
                                                            >
                                                                Next
                                                            </button>
                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="lab"
                                                    role="tabpanel"
                                                >

                                                    <form >

                                                        <h4 className="mb-3">CBC</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>HB</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.hb"
                                                                    className="form-control"
                                                                    value={labImaging?.cbc?.hb}

                                                                />

                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>WBC</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.wbc"
                                                                    className="form-control"
                                                                    value={labImaging?.cbc?.wbc}

                                                                />

                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Platelets</label>
                                                                <input
                                                                    type="number"
                                                                    name="cbc.platelets"
                                                                    className="form-control"
                                                                    value={labImaging?.cbc?.platelets}

                                                                />
                                                            </div>


                                                            <div className="col-md-3">
                                                                <label>Abnormal</label>
                                                                <input
                                                                    type="text"
                                                                    name="cbc.abnormal"
                                                                    className="form-control"
                                                                    value={labImaging?.cbc?.abnormal}

                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">RFT</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Urea</label>
                                                                <input
                                                                    type="number"
                                                                    name="rft.urea"
                                                                    className="form-control"
                                                                    value={labImaging?.rft?.urea}

                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Creatinine</label>
                                                                <input
                                                                    type="number"
                                                                    name="rft.creatinine"
                                                                    className="form-control"
                                                                    value={labImaging?.rft?.creatinine}

                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">LFT</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Bilirubin</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.bilirubin"
                                                                    className="form-control"
                                                                    value={labImaging?.lft?.bilirubin}

                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>AST</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.ast"
                                                                    className="form-control"
                                                                    value={labImaging?.lft?.ast}

                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>ALT</label>
                                                                <input
                                                                    type="number"
                                                                    name="lft.alt"
                                                                    className="form-control"
                                                                    value={labImaging?.lft?.alt}

                                                                />
                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Electrolytes</h4>

                                                        <div className="row">

                                                            <div className="col-md-3">
                                                                <label>Sodium</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.sodium"
                                                                    className="form-control"
                                                                    value={labImaging?.electrolytes?.sodium}

                                                                />

                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Potassium</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.potassium"
                                                                    className="form-control"
                                                                    value={labImaging?.electrolytes?.potassium}

                                                                />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label>Chloride</label>
                                                                <input
                                                                    type="number"
                                                                    name="electrolytes.chloride"
                                                                    className="form-control"
                                                                    value={labImaging?.electrolytes?.chloride}

                                                                />
                                                            </div>

                                                        </div>


                                                        <div className="mt-4">
                                                            <label>Other Tests</label>
                                                            <textarea
                                                                name="otherTests"
                                                                className="form-control"
                                                                value={labImaging?.otherTests}

                                                            />
                                                        </div>


                                                        <div className="mt-4">
                                                            <label>Imaging</label>
                                                            <input
                                                                type="text"
                                                                name="imaging"
                                                                className="form-control"
                                                                value={labImaging?.imaging}

                                                            />
                                                        </div>


                                                        <h4 className="mt-4">Critical Alert</h4>

                                                        <div className="form-check custom-check">


                                                            <input
                                                                type="checkbox"
                                                                name="criticalAlert.exists"
                                                                className="form-check-input"
                                                                checked={labImaging?.criticalAlert?.exists}

                                                            />

                                                            <label className="form-check-label">
                                                                Critical Alert Exists
                                                            </label>
                                                        </div>



                                                        <div className="mt-2">

                                                            <textarea
                                                                name="criticalAlert.details"
                                                                className="form-control"
                                                                placeholder="Alert Details"
                                                                value={labImaging?.criticalAlert?.details}

                                                            />

                                                        </div>


                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" disabled={loading}
                                                                onClick={() => openTab('objective-tab')}
                                                                className="nw-thm-btn outline">Back</button>
                                                            <button className="nw-thm-btn" type="button" disabled={loading}
                                                                onClick={() => openTab('assessment-tab')}
                                                            >
                                                                Next
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="assessment"
                                                    role="tabpanel"
                                                >

                                                    <form >

                                                        <h4 className="mb-3">Diagnosis</h4>

                                                        <div className="row">

                                                            <div className="col-md-6">

                                                                <label>Primary Diagnosis</label>

                                                                <input
                                                                    type="text"
                                                                    name="primaryDiagnosis"
                                                                    className="form-control"
                                                                    value={assessment?.primaryDiagnosis}

                                                                />



                                                            </div>


                                                            <div className="col-md-6">

                                                                <label>Comorbidities (comma separated)</label>

                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Diabetes, Hypertension"
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Active Problems</h4>

                                                        <div className="row">

                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label" id="infection">
                                                                        Infection
                                                                    </label>
                                                                    <input
                                                                        id="activeProblems.infection"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.infection"
                                                                        checked={assessment?.activeProblems?.infection}

                                                                    />
                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">

                                                                    <label className="form-check-label">
                                                                        Pain
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.pain"
                                                                        checked={assessment?.activeProblems?.pain}

                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Hypoxia
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.hypoxia"
                                                                        checked={assessment?.activeProblems?.hypoxia}

                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Electrolyte Imbalance
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.electrolyteImbalance"
                                                                        checked={assessment?.activeProblems?.electrolyteImbalance}

                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Anemia
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.anemia"
                                                                        checked={assessment?.activeProblems?.anemia}

                                                                    />
                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        AKI
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        name="activeProblems.aki"
                                                                        checked={assessment?.activeProblems?.aki}

                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-2">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Bleeding
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="activeProblems.bleeding"
                                                                        checked={assessment?.activeProblems?.bleeding}

                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-4 mt-3">

                                                                <label>Other Problems</label>

                                                                <input
                                                                    type="text"
                                                                    name="activeProblems.others"
                                                                    className="form-control"
                                                                    value={assessment?.activeProblems?.others}

                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Clinical Status</h4>

                                                        <div className="col-md-4">

                                                            <select
                                                                name="clinicalStatus"
                                                                className="form-control"
                                                                value={assessment.clinicalStatus}

                                                            >

                                                                <option value="">Select Status</option>
                                                                <option value="improving">Improving</option>
                                                                <option value="stable">Stable</option>
                                                                <option value="deteriorating">Deteriorating</option>

                                                            </select>


                                                        </div>


                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" disabled={loading}
                                                                onClick={() => openTab('lab-tab')}
                                                                className="nw-thm-btn outline">Back</button>
                                                            <button className="nw-thm-btn" type="button" disabled={loading}
                                                                onClick={() => openTab('plan-tab')}
                                                            >
                                                                Next
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="plan"
                                                    role="tabpanel"
                                                >

                                                    <form >

                                                        <h4 className="mb-3">Medications</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Continue Medications</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.continue"
                                                                    className="form-control"
                                                                    placeholder="Paracetamol, Aspirin"
                                                                    value={todayPlan?.medications?.continue}

                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Start Medications</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.start"
                                                                    className="form-control"
                                                                    value={todayPlan?.medications?.start}

                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Stop / Hold</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.stopOrHold"
                                                                    className="form-control"
                                                                    value={todayPlan?.medications?.stopOrHold}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Antibiotics</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Name</label>

                                                                <input
                                                                    type="text"
                                                                    name="medications.antibiotics.name"
                                                                    className="form-control"
                                                                    value={todayPlan?.medications?.antibiotics?.name}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Day</label>

                                                                <input
                                                                    type="number"
                                                                    name="medications.antibiotics.day"
                                                                    className="form-control"
                                                                    value={todayPlan?.medications?.antibiotics?.day}
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Total Days</label>

                                                                <input
                                                                    type="number"
                                                                    name="medications.antibiotics.totalDays"
                                                                    className="form-control"
                                                                    value={todayPlan?.medications?.antibiotics?.totalDays}
                                                                />

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Monitoring</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Vitals Frequency</label>

                                                                <select
                                                                    name="monitoring.vitalsFrequency"
                                                                    className="form-control"
                                                                    value={todayPlan?.monitoring?.vitalsFrequency}
                                                                >

                                                                    <option value="">Select</option>
                                                                    <option value="q4h">q4h</option>
                                                                    <option value="q6h">q6h</option>
                                                                    <option value="q8h">q8h</option>
                                                                    <option value="continuous">Continuous</option>

                                                                </select>


                                                            </div>


                                                            <div className="align-items-center col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        IO Chart
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="monitoring.ioChart"
                                                                        checked={todayPlan?.monitoring?.ioChart}
                                                                    />

                                                                </div>

                                                            </div>


                                                            <div className="col-md-3">
                                                                <div className="form-check custom-check">
                                                                    <label className="form-check-label">
                                                                        Glucose Monitoring
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name="monitoring.glucoseMonitoring"
                                                                        checked={todayPlan?.monitoring?.glucoseMonitoring}
                                                                    />

                                                                </div>

                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Diet</h4>

                                                        <div className="col-md-4">

                                                            <select
                                                                name="dietNursing.diet"
                                                                className="form-control"
                                                                value={todayPlan?.dietNursing?.diet}
                                                            >

                                                                <option value="">Select Diet</option>
                                                                <option value="NPO">NPO</option>
                                                                <option value="liquid">Liquid</option>
                                                                <option value="soft">Soft</option>
                                                                <option value="normal">Normal</option>

                                                            </select>


                                                        </div>


                                                        <h4 className="mt-4">Discharge Plan</h4>

                                                        <div className="col-md-4">

                                                            <select
                                                                name="discharge.expected"
                                                                className="form-control"
                                                                value={todayPlan?.discharge?.expected}
                                                            >

                                                                <option value="">Select</option>
                                                                <option value="today">Today</option>
                                                                <option value="24-48h">24-48 Hours</option>
                                                                <option value="later">Later</option>

                                                            </select>



                                                        </div>


                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" disabled={loading}
                                                                onClick={() => openTab('assessment-tab')}
                                                                className="nw-thm-btn outline">Back</button>
                                                            <button className="nw-thm-btn" type="button"
                                                                onClick={() => openTab('signOff-tab')}
                                                            >
                                                                Next
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="signOff"
                                                    role="tabpanel"
                                                >

                                                    <form >

                                                        <h4 className="mb-3">Author Details</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <label>Author Staff ID</label>

                                                                <input
                                                                    type="text"
                                                                    name="authorActorNh12"
                                                                    className="form-control"
                                                                    value={signOff?.authorActorId?.nh12}
                                                                />


                                                            </div>


                                                            <div className="col-md-4">

                                                                <label>Author Signature</label>

                                                                <input
                                                                    type="text"
                                                                    name="authorSignature"
                                                                    className="form-control"
                                                                    value={signOff?.authorSignature}
                                                                />


                                                            </div>

                                                        </div>


                                                        <h4 className="mt-4">Reviewer</h4>

                                                        <div className="row">


                                                            <div className="col-md-4">

                                                                <label>Reviewed By</label>

                                                                <input
                                                                    type="text"
                                                                    name="reviewedBy"
                                                                    className="form-control"
                                                                    value={signOff?.reviewedBy?.nh12}
                                                                />
                                                            </div>




                                                        </div>


                                                        <h4 className="mt-4">Note Version</h4>

                                                        <div className="row">

                                                            <div className="col-md-4">

                                                                <select
                                                                    name="noteVersion"
                                                                    className="form-control"
                                                                    value={signOff?.noteVersion}
                                                                >

                                                                    <option value="v1">Version 1</option>
                                                                    <option value="v2">Version 2</option>
                                                                    <option value="Addendum">Addendum</option>

                                                                </select>

                                                            </div>

                                                        </div>


                                                        {signOff?.noteVersion === "Addendum" && (

                                                            <div className="mt-3">

                                                                <label>Amendment Reason</label>

                                                                <textarea
                                                                    name="amendmentReason"
                                                                    className="form-control"
                                                                    value={signOff?.amendmentReason}
                                                                />



                                                            </div>

                                                        )}


                                                        <div className="d-flex justify-content-between mt-4">
                                                            <button type="button" disabled={loading}
                                                                onClick={() => openTab('plan-tab')}
                                                                className="nw-thm-btn outline">Back</button>
                                                            <button data-bs-dismiss="modal" type="button" disabled={loading} className="nw-thm-btn">
                                                                Close
                                                            </button>

                                                        </div>

                                                    </form>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DailyNotesHistory