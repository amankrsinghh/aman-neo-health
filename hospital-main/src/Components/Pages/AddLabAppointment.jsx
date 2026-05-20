import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getSecureApiData, securePostData } from '../../Service/api'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function AddLabAppointment() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id

    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [nh12, setNh12] = useState('')
    const [testOptions, setTestOptions] = useState([])

    // ─── Multi category states ────────────────────────────────────
    const [dropdownCatId, setDropdownCatId] = useState('')
    const [addedCategories, setAddedCategories] = useState([])
    const [selectedSubCats, setSelectedSubCats] = useState({})
    const [collapsed, setCollapsed] = useState({})

    // ─── Fetch tests ──────────────────────────────────────────────
    async function fetchTestData() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`lab/test/${userId}?limit=1000&type=hospital`)
            if (result.success) setTestOptions(result.data)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTestData() }, [])

    // ─── Fetch patient ────────────────────────────────────────────
    async function fetchPatient() {
        if (nh12?.length < 12) {
            toast.error("Please enter valid id")
            return
        }
        setLoading(true)
        try {
            const result = await getSecureApiData(`api/comman/user-data/${nh12}`)
            if (result.success) {
                if (result.data.role !== "patient")
                    return toast.error("The user is not registered as patient")
                setUserData(result.data)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // ─── Category handlers ────────────────────────────────────────
    const handleAddCategory = () => {
        if (!dropdownCatId) return
        if (addedCategories.find(c => c.testId === dropdownCatId)) {
            toast.warn('This category is already added')
            return
        }
        const test = testOptions.find(t => t._id === dropdownCatId)
        if (!test) return

        const activeSubCats = test.subCatData?.filter(s => s.status === 'active') || []
        setAddedCategories(prev => [...prev, {
            testId: test._id,
            categoryName: test.category?.name,
            subCatData: activeSubCats,
        }])
        setSelectedSubCats(prev => ({ ...prev, [test._id]: [] }))
        setCollapsed(prev => ({ ...prev, [test._id]: false }))
        setDropdownCatId('')
    }

    const handleRemoveCategory = (testId) => {
        setAddedCategories(prev => prev.filter(c => c.testId !== testId))
        setSelectedSubCats(prev => {
            const copy = { ...prev }
            delete copy[testId]
            return copy
        })
    }

    const handleSelectAll = (testId, subCatData, checked) => {
        setSelectedSubCats(prev => ({
            ...prev,
            [testId]: checked ? subCatData.map(s => s.subCat._id) : []
        }))
    }

    const handleCheckbox = (testId, subCatId) => {
        setSelectedSubCats(prev => {
            const current = prev[testId] || []
            return {
                ...prev,
                [testId]: current.includes(subCatId)
                    ? current.filter(id => id !== subCatId)
                    : [...current, subCatId]
            }
        })
    }

    const totalSelected = Object.values(selectedSubCats).flat().length

    // ─── Submit ───────────────────────────────────────────────────
    const handleBook = async (e) => {
        e.preventDefault()

        if (!userData?._id || !date || !time) {
            toast.error("Please fill all fields")
            return
        }
        if (totalSelected === 0) {
            toast.error('Please select at least one test')
            return
        }

        setLoading(true)

        const testId = addedCategories
            .filter(cat => (selectedSubCats[cat.testId] || []).length > 0)
            .map(cat => cat.testId)

        const tests = addedCategories
            .map(cat => ({
                category: testOptions.find(t => t._id === cat.testId)?.category?._id,
                subCat: selectedSubCats[cat.testId] || []
            }))
            .filter(item => item.subCat.length > 0)

        try {
            const appointmentDate = new Date(`${date}T${time}`)
            const data = {
                patientId: userData?._id,
                labId: userId,
                date: appointmentDate,
                testId,
                tests,
                manual: true,
            }

            const response = await securePostData("api/hospital/lab-appointment", data)
            if (response?.success) {
                toast.success("Appointment added successfully!")
                setDate("")
                setTime("")
                setNh12("")
                setUserData(null)
                setAddedCategories([])
                setSelectedSubCats({})
                setDropdownCatId('')
                navigate('/test-report-appointment')
            } else {
                toast.error(response?.message || "Booking failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleBook} className="main-content flex-grow-1 p-3 overflow-auto">
            <div className="row mb-3">
                <div>
                    <h3 className="innr-title mb-2 gradient-text">Add Appointment</h3>
                    <div className="admin-breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb custom-breadcrumb">
                                <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Dashboard</a></li>
                                <li className="breadcrumb-item"><a href="#" className="breadcrumb-link">Appointment</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Add Appointment</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <div className='new-panel-card'>

                {/* Date & Time */}
                <div className="new-panel-card mb-3">
                    <div className="row">
                        <div>
                            <h4 className="fz-18 fw-700 text-black">Appointment Details</h4>
                            <p className="fw-400 fz-16">Enter the details for the new appointment.</p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label>Appointment Date</label>
                                <input type="date" value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="form-control nw-frm-select" required />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label>Appointment Time</label>
                                <input type="time" value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="form-control nw-frm-select" required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Patient */}
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <div className="new-panel-card">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div>
                                    <h4 className="fz-18 fw-700 text-black">Select Patient</h4>
                                    <p className="fw-400 fz-16">Select a patient for this appointment.</p>
                                </div>
                                <NavLink to="/add-patient" className="nw-exprt-btn">
                                    <FaPlusCircle /> Add Patient
                                </NavLink>
                            </div>
                            <div className="custom-frm-bx">
                                <label>Patient Id</label>
                                <div className="d-flex gap-2">
                                    <input type="text" className="form-control" value={nh12}
                                        onChange={(e) => setNh12(e.target.value)} />
                                    <button className="thm-btn" type="button" onClick={fetchPatient}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lab Tests */}
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <div className="new-panel-card">
                            <div className="d-flex align-items-center justify-content-between flex-wrap">
                                <div>
                                    <h4 className="fz-18 fw-700 text-black">Select Test</h4>
                                    <p className="fw-400 fz-16">Choose test for this appointment.</p>
                                </div>
                                <NavLink to="/add-tests" className="nw-exprt-btn">
                                    <FaPlusCircle /> Add Test
                                </NavLink>
                            </div>

                            {/* Dropdown + Add button */}
                            <div className="custom-frm-bx mb-3">
                                <label htmlFor="catSelect">Select Category</label>
                                <div className="d-flex gap-2">
                                    <select
                                        id="catSelect"
                                        className="form-select nw-control-frm"
                                        value={dropdownCatId}
                                        onChange={e => setDropdownCatId(e.target.value)}
                                    >
                                        <option value="">--- Select Category ---</option>
                                        {testOptions
                                            .filter(t => !addedCategories.find(c => c.testId === t._id))
                                            .map(test => (
                                                <option key={test._id} value={test._id}>
                                                    {test.category?.name}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="nw-thm-btn px-3"
                                        onClick={handleAddCategory}
                                        disabled={!dropdownCatId}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>

                            {/* Added category cards */}
                            {addedCategories.length > 0 && (
                                <div className="d-flex flex-column gap-2 mb-3">
                                    {addedCategories.map(cat => {
                                        const selected = selectedSubCats[cat.testId] || []
                                        const allSel =
                                            cat.subCatData.length > 0 &&
                                            cat.subCatData.every(s => selected.includes(s.subCat._id))
                                        const isCollapsed = collapsed[cat.testId]

                                        return (
                                            <div key={cat.testId} className="border rounded">
                                                {/* Header */}
                                                <div
                                                    className="d-flex align-items-center justify-content-between px-3 py-2"
                                                    style={{ background: 'var(--bs-light, #f8f9fa)' }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="fw-semibold">{cat.categoryName}</span>
                                                        {selected.length > 0 && (
                                                            <span className="badge bg-primary rounded-pill">
                                                                {selected.length} selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="form-check custom-check mb-0">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={allSel}
                                                                onChange={e => handleSelectAll(cat.testId, cat.subCatData, e.target.checked)}
                                                                id={`selectAll-${cat.testId}`}
                                                            />
                                                            <label className="form-check-label small"
                                                                htmlFor={`selectAll-${cat.testId}`}>
                                                                Select all
                                                            </label>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link p-0 text-secondary"
                                                            onClick={() => setCollapsed(prev => ({ ...prev, [cat.testId]: !prev[cat.testId] }))}
                                                        >
                                                            <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link p-0 text-danger"
                                                            onClick={() => handleRemoveCategory(cat.testId)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* SubCat list */}
                                                {!isCollapsed && (
                                                    <div className="px-3 py-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {cat.subCatData.length > 0 ? cat.subCatData.map(s => (
                                                            <div className="form-check custom-check mb-2" key={s.subCat._id}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={`sub-${cat.testId}-${s.subCat._id}`}
                                                                    checked={selected.includes(s.subCat._id)}
                                                                    onChange={() => handleCheckbox(cat.testId, s.subCat._id)}
                                                                />
                                                                <label
                                                                    className="form-check-label d-flex justify-content-between"
                                                                    htmlFor={`sub-${cat.testId}-${s.subCat._id}`}
                                                                >
                                                                    <span>{s?.subCat?.subCategory}</span>
                                                                    <span>{s?.subCat?.code}</span>
                                                                    <span className="text-muted">₹{s.price}</span>
                                                                </label>
                                                            </div>
                                                        )) : (
                                                            <p className="text-muted text-center py-2 small">
                                                                No active tests in this category
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {totalSelected > 0 && (
                                <p className="text-muted small mb-2">{totalSelected} test(s) selected</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient data */}
                {userData && (
                    <div className="row">
                        <h3>Patient Data</h3>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="custom-frm-bx">
                                <label>Patient Name</label>
                                <input type="text" className="form-control" value={userData?.name} readOnly />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="custom-frm-bx">
                                <label>Patient Email</label>
                                <input type="text" className="form-control" value={userData?.email} readOnly />
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="custom-frm-bx">
                                <label>Patient Contact Number</label>
                                <input type="text" className="form-control" value={userData?.contactNumber} readOnly />
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between mt-3">
                    <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                    <button className="nw-thm-btn" type="submit">Submit</button>
                </div>
            </div>
        </form>
    )
}

export default AddLabAppointment