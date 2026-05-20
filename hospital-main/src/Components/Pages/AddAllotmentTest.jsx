import React, { useEffect, useState } from 'react'
import API from '../../api/api';
import { getSecureApiData, securePostData } from '../../Service/api';
import { toast } from 'react-toastify';
import { faCircleXmark, faTrash, faChevronDown, faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '../Common/Loader';

function AddAllotmentTest({ allotmentId }) {
  const [loading, setLoading] = useState(false)
  const [allotmentDetail, setAllotmentDetail] = useState()
  const [isSaving, setIsSaving] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user.id

  const [labTests, setLabTests] = useState([])
  const [dropdownCatId, setDropdownCatId] = useState('')
  const [addedCategories, setAddedCategories] = useState([])
  const [selectedSubCats, setSelectedSubCats] = useState({})
  const [collapsed, setCollapsed] = useState({})

  // ─── Dono APIs ek saath chalao, phir pre-fill karo ───────────

  useEffect(() => {
    if (!allotmentId) return

    const init = async () => {
  setLoading(true)
  try {
    const [allotmentRes, labRes] = await Promise.all([
      API.get(`/bed/allotment/${allotmentId}`),
      getSecureApiData(`lab/test/${userId}?limit=1000&type=hospital`)
    ])

    const allotmentData = allotmentRes?.data?.data
    setAllotmentDetail(allotmentData)

    const allLabs = labRes?.success ? (labRes.data || []) : []
    setLabTests(allLabs)

    const savedTests = allotmentData?.labAppointment?.tests

    if (savedTests?.length > 0) {
      const categories = []
      const selections = {}
      const collapseState = {}

      savedTests.forEach(testEntry => {
        const catId = testEntry?.category?._id || testEntry?.category

        // ✅ Test doc — category ID se match
        const test = allLabs.find(
          t => t.category?._id?.toString() === catId?.toString()
            || t.category?.toString() === catId?.toString()
        )
        if (!test) return

        const activeSubCats = test.subCatData?.filter(s => s.status === 'active') || []

        categories.push({
          testId: test._id,
          categoryName: test.category?.name,
          subCatData: activeSubCats,
        })

        // ✅ populated subCatId se _id nikalo
        selections[test._id] = testEntry?.subCat?.map(
          s => s?.subCatId?._id || s?.subCatId
        ) || []

        collapseState[test._id] = false
      })

      setAddedCategories(categories)
      setSelectedSubCats(selections)
      setCollapsed(collapseState)
    }

  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}

    init()
  }, [allotmentId])

  // ─── Category add karo ────────────────────────────────────────

  const handleAddCategory = () => {
    if (!dropdownCatId) return
    if (addedCategories.find(c => c.testId === dropdownCatId)) {
      toast.warn('This category is already added')
      return
    }
    const test = labTests.find(t => t._id === dropdownCatId)
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

  const toggleCollapse = (testId) => {
    setCollapsed(prev => ({ ...prev, [testId]: !prev[testId] }))
  }

  const handleSelectAll = (testId, subCatData, checked) => {
    if (checked) {
      setSelectedSubCats(prev => ({ ...prev, [testId]: subCatData.map(s => s.subCat._id) }))
    } else {
      setSelectedSubCats(prev => ({ ...prev, [testId]: [] }))
    }
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

  async function addLabTests(e) {
    e.preventDefault()
    if (totalSelected === 0) {
      toast.error('Please select at least one test')
      return
    }

    // ✅ tests array — { category: category._id, subCat: [subCatId] }
    const tests = addedCategories
      .map(cat => ({
        category: cat.subCatData[0]?.subCat?.category || labTests.find(t => t._id === cat.testId)?.category?._id,
        subCat: selectedSubCats[cat.testId] || []
      }))
      .filter(item => item.subCat.length > 0)

    // ✅ testId — Test document _id array
    const testId = addedCategories
      .filter(cat => (selectedSubCats[cat.testId] || []).length > 0)
      .map(cat => cat.testId)

    setIsSaving(true)
    const data = { allotmentId, tests, testId }

    try {
      const res = await securePostData(`api/bed/add-tests`, data)
      if (res.success) {
        document.getElementById("closeTest")?.click()
        toast.success("Tests added successfully")
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setIsSaving(false)
    }
  }
  

  const handleCloseModal = () => {
    const modal = document.getElementById("add-LabTest")
    if (modal) {
      modal.classList.remove("show")
      modal.style.display = "none"
    }
    const backdrops = document.getElementsByClassName("modal-backdrop")
    while (backdrops.length > 0) backdrops[0].parentNode.removeChild(backdrops[0])
    document.body.classList.remove("modal-open")
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""
  }

  // ─── Render ───────────────────────────────────────────────────

  return (
    <>
      {loading ? <Loader /> :
        <div className="modal step-modal fade" id="add-LabTest" data-bs-backdrop="static"
          data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content rounded-0">

              <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
                <h6 className="lg_title mb-0">
                  {allotmentDetail?.labAppointment ? 'View' : 'Add'} Lab Test
                </h6>
                <button type="button" id="closeTest" onClick={handleCloseModal}
                  aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              </div>

              <div className="modal-body px-4 pb-5">
                <div className="row justify-content-center">
                  <div className="col-lg-10">
                    <div className="add-deprtment-pic">
                      <img src="/add-lab.png" alt="" />
                      <p className="pt-2">Please add lab tests to assign to patient</p>
                    </div>

                    <form onSubmit={addLabTests}>

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
                            {labTests
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
                                <div className="d-flex align-items-center justify-content-between px-3 py-2"
                                  style={{ background: 'var(--bs-light, #f8f9fa)' }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <input
                                      type="checkbox"
                                      className="form-check-input mt-0"
                                      checked={allSel}
                                      onChange={e => handleSelectAll(cat.testId, cat.subCatData, e.target.checked)}
                                      id={`selectAll-${cat.testId}`}
                                    />
                                    <label className="form-check-label fw-semibold mb-0"
                                      htmlFor={`selectAll-${cat.testId}`}>
                                      {cat.categoryName}
                                    </label>
                                    {selected.length > 0 && (
                                      <span className="badge bg-primary rounded-pill">
                                        {selected.length} selected
                                      </span>
                                    )}
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <button type="button" className="btn btn-sm btn-link p-0 text-secondary"
                                      onClick={() => toggleCollapse(cat.testId)}>
                                      <FontAwesomeIcon icon={isCollapsed ? faChevronDown : faChevronUp} />
                                    </button>
                                    <button type="button" className="btn btn-sm btn-link p-0 text-danger"
                                      onClick={() => handleRemoveCategory(cat.testId)}>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </div>
                                </div>

                                {!isCollapsed && (
                                  <div className="px-3 py-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {cat.subCatData.length > 0 ? cat.subCatData.map(s => (
                                      <div className="form-check custom-check mb-2" key={s.subCat._id}>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`sub-${s.subCat._id}`}
                                          checked={selected.includes(s.subCat._id)}
                                          onChange={() => handleCheckbox(cat.testId, s.subCat._id)}
                                        />
                                        <label className="form-check-label d-flex justify-content-between"
                                          htmlFor={`sub-${s.subCat._id}`}>
                                          <span>{s.subCat.subCategory}</span>
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
                        <p className="text-muted small mb-2">
                          {totalSelected} test(s) selected
                        </p>
                      )}

                      <div className="mt-3">
                        <button type="submit" className="nw-thm-btn w-100" disabled={isSaving}>
                          {isSaving ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      }
    </>
  )
}

export default AddAllotmentTest