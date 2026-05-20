import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteApiData, getApiData, securePostData, updateApiData } from "../../Services/api";
import base_url from "../../Services/baseUrl";
import { Link, useParams } from "react-router-dom";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
function SubTestCategory() {
    const { id } = useParams()
    const [view, setView] = useState("table");
    const [saving, setSaving] = useState(false);
    const [subCatData, setSubCatData] = useState([])
    const [editingId, setEditingId] = useState()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [catData, setCatData] = useState([])
    const [form, setForm] = useState({
        name: "",
    });




    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            let data = { name: form.name };

            // ✅ EDIT CASE
            if (editingId) {
                data.subCatId = editingId;
            }

            const res = editingId ? await updateApiData('admin/sub-test-category', data) : await securePostData(
                "admin/sub-test-category",
                data
            );
            if (res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message);
            }

            setView("table");
            fetchData();

        } catch (err) {
            console.log(err);
            toast.error("Failed");
        } finally {
            setSaving(false);
        }
    };

    // ✅ get data
    const fetchData = async () => {
        try {
            const res = await getApiData(`api/comman/sub-test-category/${id}`);
            if (res.success) {
                setSubCatData(res.data)
                setTotalPages(res.totalPages || 1);
                setPage(res.currentPage || 1);
            }



        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (id) {
            setTestData({ ...testData, category: id })
            fetchData();
        }
    }, [id]);
    const handleAdd = () => {
        setEditingId(null);
        setForm({
            icon: null,
            preview: "",
            name: "",
        });
        setView("form");
    };
    const handleEdit = (item) => {
        setEditingId(item._id);

        setTestData({
            ...testData, ...item, specialApproval: item.specialApproval, category: item.category,
            subCategory: item.subCategory
        })
        const data = item.component
        setComponents(data)
        const sdata = item.sample
        setSampleData(sdata)

        setView("form");
    };
    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const [testData, setTestData] = useState({
        name: "",
        category: null,
        subCategory: null,
        code: "",

        fastingRequired: null,
        specialApproval: null,
    });
    const [sampleData, setSampleData] = useState([
        {
            type: "",
            volume: ""
        }
    ])
    const [components, setComponents] = useState([
        {
            name: "",
            unit: "",
            title: '',
            optionType: "text",
            minRange: "",
            maxRange: "",
            status: false,
        },
    ]);

    const [componentErrors, setComponentErrors] = useState([]);
    const validateComponents = () => {
        let newErrors = [];

        components.forEach((comp, index) => {
            let error = {};

            if (!comp.name?.trim()) {
                error.name = "Component name is required";
            }

            if (!comp.unit?.trim()) {
                error.unit = "Component unit is required";
            }

            if (!comp.optionType) {
                error.optionType = "Select type is required";
            }


            if (comp.optionType=="text" && !comp.minRange) {
                error.minRange = "Min range is required";
            }
            if (comp.optionType=="text" && !comp.maxRange) {
                error.maxRange = "Max range is required";
            }

            newErrors[index] = error;
        });

        setComponentErrors(newErrors);

        return {
            isValid: newErrors.every(err => Object.keys(err).length === 0),
            errors: newErrors
        };
    };
    const [testErrors, setTestErrors] = useState({});
    const [deptOption, setDeptOption] = useState([])
    const validateTestData = () => {
        let errors = {};

        if (!testData.shortName?.trim()) {
            errors.name = "Test name is required";
        }

        if (!testData.category) {
            errors.category = "Category is required";
        }
        if (!testData.subCategory) {
            errors.subCategory = "Sub Category is required";
        }

        if (!testData.code?.trim()) {
            errors.code = "Test code is required";
        }

        // if (!testData.packageType) {
        //     errors.packageType = "Package type is required";
        // }

        // if (!testData.testProcessing) {
        //     errors.testProcessing = "Processing time is required";
        // }

        if (testData.fastingRequired === null) {
            errors.fastingRequired = "Please select fasting requirement";
        }

        // if (testData.testType === null) {
        //     errors.testType = "Please select test type";
        // }

        if (testData.specialApproval === null) {
            errors.specialApproval = "Please select approval requirement";
        }
        setTestErrors(errors);

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const handleComponentChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updated = [...components];

        // ✅ optionType-0, optionType-1 → optionType pe map karo
        const fieldName = name.startsWith('optionType') ? 'optionType' : name

        // checkbox handling
        updated[index][fieldName] = type === "checkbox" ? checked : value;


        setComponents(updated);
    };
    // -------------------- Add Component --------------------
    const addComponent = () => {
        setComponents([
            ...components,
            { name: "", unit: "", optionType: "text", minRange: "", maxRange: "", status: false },
        ]);
    };

    // -------------------- Remove Component --------------------
    const removeComponent = (index) => {
        const updatedComponents = components.filter((_, i) => i !== index);
        setComponents(updatedComponents);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "category" && { subCategory: "" }) // reset subCategory
        }));
    };

    const testSubmit = async (e) => {
        e.preventDefault()
        const sampleValidation = validateSamples();
        const componentValidation = validateComponents();
        const testValidation = validateTestData();
        if (
            !sampleValidation.isValid ||
            !componentValidation.isValid ||
            !testValidation.isValid
        ) {
            return;
        }
        // if (!isOwner && !permissions.addTest) {
        //   toast.error('You do not have permission to add test ')
        //   return
        // }
        const data = { ...testData, component: components, sample: sampleData }
        if (editingId) {
            data.subCatId = editingId
        }
        try {
            const response = editingId ? await updateApiData('admin/sub-test-category', data) : await securePostData(
                "admin/sub-test-category",
                data
            );
            if (response.success) {
                toast.success('Test data saved successfully')
                fetchData()
                setView("table")
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error)
        }
    }
    // -------------------- Add Sample --------------------
    const addSample = () => {
        setSampleData([
            ...sampleData,
            { type: "", volume: "" },
        ]);
    };

    // -------------------- Remove Component --------------------
    const removeSample = (index) => {
        const updatedComponents = sampleData.filter((_, i) => i !== index);
        setSampleData(updatedComponents);
    };
    const handleSampleChange = (index, e) => {
        const { name, value } = e.target;

        const updatedSamples = [...sampleData];
        updatedSamples[index][name] = value;

        setSampleData(updatedSamples);

        // clear error for that field
        const updatedErrors = [...sampleErrors];
        if (updatedErrors[index]) {
            delete updatedErrors[index][name];
        }
        setSampleErrors(updatedErrors);
    };
    const [sampleErrors, setSampleErrors] = useState([]);
    const validateSamples = () => {
        let newErrors = [];

        sampleData.forEach((sample, index) => {
            let error = {};

            if (!sample.type.trim()) {
                error.type = "Sample type is required";
            }

            if (!sample.volume.trim()) {
                error.volume = "Volume is required";
            }

            newErrors[index] = error;
        });

        setSampleErrors(newErrors);

        return {
            isValid: newErrors.every(err => Object.keys(err).length === 0),
            errors: newErrors
        };
    };
    useEffect(() => {
        fetchTestCategory()
    }, [])
    async function fetchTestCategory() {
        try {
            const res = await getApiData('api/comman/test-category')
            if (res.success) {
                setCatData(res.data)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="main-content flex-grow-1 p-3 overflow-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="gradient-text">Sub Test Categories</h3>

                {view === "table" && (
                    <button className="thm-btn" onClick={handleAdd}>
                        + Add
                    </button>
                )}
            </div>
            {view === "table" && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="table-section admin-mega-section">
                            <div className="table table-responsive mb-0">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sub Category</th>
                                            <th>Test</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subCatData?.length > 0 ? subCatData?.map((item, key) => (
                                            <tr>


                                                <td >{key + 1}</td>
                                                <td >{item.subCategory}</td>
                                                <td >{item.shortName}</td>

                                                <td >
                                                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEdit(item)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>

                                                    {/* <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button> */}
                                                </td>

                                            </tr>
                                        )) :
                                            <div className="col-12 text-start">No sub category found</div>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
                    </div>

                </div>
            )}
            {view === "form" && (
                <form onSubmit={testSubmit} className="patient-bio-tab">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Select Category</label>
                                <select name="category" value={testData.category} onChange={handleChange} id="" className="form-control nw-select-frm">
                                    <option value="">---Select---</option>
                                    {catData?.map((item, key) =>
                                        <option value={item?._id} key={item?._id}>{item?.name}</option>)}
                                </select>
                                {testErrors?.category && <span className="text-danger">{testErrors?.category}</span>}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor=""> Sub Category</label>
                                <input type="text" className="form-control nw-select-frm" name="subCategory" value={testData.subCategory} onChange={handleChange} />

                                {testErrors?.subCategory && <span className="text-danger">{testErrors?.subCategory}</span>}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Name</label>
                                <input type="text" className="form-control nw-select-frm" name="shortName" value={testData.shortName} onChange={handleChange} />
                                {testErrors?.name && <span className="text-danger">{testErrors?.name}</span>}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Code</label>
                                <input type="text" className="form-control nw-select-frm" name="code" value={testData.code} onChange={handleChange} />
                                {testErrors?.code && <span className="text-danger">{testErrors?.code}</span>}
                            </div>
                        </div>

                        {/* <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="custom-frm-bx">
                        <label htmlFor="">Package Type</label>
                        <select name="packageType" value={testData.packageType} onChange={handleChange} id="" 
                        className="form-select nw-select-frm">
                          <option value="">---Select Categories---</option>
                          <option value="single">Single</option>
                          <option value="profile">Profile</option>
                          <option value="package">Package</option>
                        </select>
                        {testErrors?.packageType && <span className="text-danger">{testErrors?.packageType}</span>}
                      </div>
                    </div> */}
                        {/* <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="custom-frm-bx">
                        <label htmlFor="">Test Type</label>
                        <select name="testType" value={testData.testType} onChange={handleChange} id="" 
                        className="form-control nw-select-frm">
                          <option value="">---Select---</option>
                          <option value="Single">Routine</option>
                          <option value="Profile">Urgent</option>
                        </select>
                        {testErrors?.testType && <span className="text-danger">{testErrors?.testType}</span>}
                      </div>
                    </div> */}
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Fasting Requried</label>
                                <select name="fastingRequired" value={testData.fastingRequired} onChange={handleChange} id="" className="form-control nw-select-frm">
                                    <option value="">---Select---</option>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                                {testErrors?.fastingRequired && <span className="text-danger">{testErrors?.fastingRequired}</span>}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <div className="custom-frm-bx">
                                <label htmlFor="">Special Approval Required</label>
                                <select name="specialApproval" value={testData.specialApproval} onChange={handleChange} id="" className="form-control nw-select-frm">
                                    <option value="">---Select---</option>
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                                {testErrors?.specialApproval && <span className="text-danger">{testErrors?.specialApproval}</span>}
                            </div>
                        </div>
                        {/* <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="custom-frm-bx">
                        <label htmlFor="">Test Processing</label>
                        <select name="testProcessing" value={testData.testProcessing} onChange={handleChange} id="" className="form-control nw-select-frm">
                          <option value="">---Select---</option>
                          <option value={"Machine"}>Machine</option>
                          <option value={"Manual"}>Manual</option>
                          <option value={"Batch"}>Batch</option>
                        </select>
                        {testErrors?.testProcessing && <span className="text-danger">{testErrors?.testProcessing}</span>}
                      </div>
                    </div> */}



                    </div>

                    <div className="lab-chart-crd reporting-crd-bx mb-5">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="lab-tp-title patient-bio-tab report-bio-tp d-flex align-items-center justify-content-between py-3 sub-header-bx gap-2">
                                    <div>
                                        <h6 className="mb-0 text-black">Sample Collection</h6>
                                    </div>

                                    <div className="add-nw-bx d-flex gap-2">

                                        <button type="button" onClick={addSample} className="add-nw-btn thm-btn">
                                            <img src="/plus-icon.png" alt="" /> Sample
                                        </button>

                                    </div>

                                </div>

                                <div className="patient-bio-tab">
                                    <div className="table-section mega-table-section reporting-table-section">
                                        <div className="table table-responsive mb-0">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Sample Amount</th>
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {sampleData.map((s, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr >
                                                                <td className="h-auto w-auto">
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="text"
                                                                            name="type"
                                                                            className="form-control nw-select-frm"
                                                                            placeholder="Blood"
                                                                            value={s.type}
                                                                            onChange={(e) => handleSampleChange(index, e)}
                                                                        />
                                                                        {sampleErrors[index]?.type && (
                                                                            <span className="text-danger">{sampleErrors[index].type}</span>
                                                                        )}
                                                                    </div>

                                                                </td>
                                                                <td className="h-auto w-auto">
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="text"
                                                                            name="volume"
                                                                            className="form-control nw-select-frm"
                                                                            placeholder="0.5mm/dl"
                                                                            value={s.volume}
                                                                            onChange={(e) => handleSampleChange(index, e)}
                                                                        />
                                                                        {sampleErrors[index]?.volume && (
                                                                            <span className="text-danger">{sampleErrors[index].volume}</span>
                                                                        )}
                                                                    </div>

                                                                </td>
                                                                <td className="h-auto w-auto">
                                                                    <button
                                                                        type="button"
                                                                        disabled={sampleData?.length == 1}
                                                                        className="text-black"
                                                                        onClick={() => removeSample(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))}

                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lab-chart-crd reporting-crd-bx">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="lab-tp-title patient-bio-tab report-bio-tp d-flex align-items-center justify-content-between py-3 sub-header-bx gap-2">
                                    <div>
                                        <h6 className="mb-0 text-black">Test Components</h6>
                                    </div>

                                    <div className="add-nw-bx d-flex gap-2">
                                        {/* <button type="button" onClick={addTitle} className="add-nw-btn thm-btn">
                            <img src="/plus-icon.png" alt="" /> Title
                          </button> */}

                                        <button type="button" onClick={addComponent} className="add-nw-btn thm-btn">
                                            <img src="/plus-icon.png" alt="" /> Component
                                        </button>

                                    </div>

                                </div>

                                <div className="patient-bio-tab">
                                    <div className="table-section mega-table-section reporting-table-section">
                                        <div className="table table-responsive mb-0">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Unit</th>
                                                        <th>Result</th>
                                                        <th>Min Range</th>
                                                        <th>Max Range</th>
                                                        {/* <th>Status</th> */}
                                                        <th>Action</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {components.map((component, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr>
                                                                <td>
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="text"
                                                                            name="name"
                                                                            className="form-control nw-select-frm"
                                                                            placeholder="Lymphocyte"
                                                                            value={component.name}
                                                                            onChange={(e) => handleComponentChange(index, e)}
                                                                        />
                                                                        {componentErrors[index]?.name && (
                                                                            <span className="text-danger">
                                                                                {componentErrors[index].name}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="text"
                                                                            name="unit"
                                                                            className="form-control nw-select-frm"
                                                                            placeholder="mm/dl"
                                                                            value={component.unit}
                                                                            onChange={(e) => handleComponentChange(index, e)}
                                                                        />
                                                                        {componentErrors[index]?.unit && (
                                                                            <span className="text-danger">
                                                                                {componentErrors[index].unit}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="custom-radio-group">

                                                                        {/* RADIO */}
                                                                        <div className="form-check form-check-inline">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name={`optionType-${index}`}
                                                                                value="text"
                                                                                checked={component.optionType == "text"}
                                                                                onChange={(e) => handleComponentChange(index, e)}
                                                                            />
                                                                            <label className="form-check-label">Text</label>
                                                                        </div>

                                                                        <div className="form-check form-check-inline mb-2">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name={`optionType-${index}`}
                                                                                value="select"
                                                                                checked={component.optionType == "select"}
                                                                                onChange={(e) => handleComponentChange(index, e)}
                                                                            />
                                                                            <label className="form-check-label">Select</label>
                                                                        </div>

                                                                        {componentErrors[index]?.optionType && (
                                                                            <sapn className="text-danger d-block">
                                                                                {componentErrors[index].optionType}
                                                                            </sapn>
                                                                        )}


                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="number"
                                                                            name="minRange"
                                                                            className="form-control nw-select-frm"
                                                                            value={component.minRange}
                                                                            onChange={(e) => handleComponentChange(index, e)}
                                                                            placeholder="Min"
                                                                        />
                                                                        {componentErrors[index]?.minRange && (
                                                                            <span className="text-danger">
                                                                                {componentErrors[index].minRange}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="custom-frm-bx">
                                                                        <input
                                                                            type="number"
                                                                            name="maxRange"
                                                                            className="form-control nw-select-frm"
                                                                            value={component.maxRange}
                                                                            onChange={(e) => handleComponentChange(index, e)}
                                                                            placeholder="Max"
                                                                        />
                                                                        {componentErrors[index]?.maxRange && (
                                                                            <span className="text-danger">
                                                                                {componentErrors[index].maxRange}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* <td>
                                        <div className="custom-frm-bx form-check custom-check pt-0">
                                          <input
                                            type="checkbox"
                                            name="status"
                                            checked={component.status}
                                            onChange={(e) => handleComponentChange(index, e)}
                                            className="form-check-input"
                                          />
                                        </div>
                                      </td> */}

                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        disabled={components?.length === 1}
                                                                        className="text-black"
                                                                        onClick={() => removeComponent(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td colSpan={7} className="h-auto">
                                                                    <div className="custom-frm-bx mb-0">
                                                                        <input
                                                                            type="text"
                                                                            name="title"
                                                                            value={component.title}
                                                                            onChange={(e) => handleComponentChange(index, e)}
                                                                            className="form-control nw-select-frm"
                                                                            placeholder="Blood details"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                        </React.Fragment>
                                                    ))}

                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button onClick={() => setView("table")} className="nw-thm-btn rounded-3 outline" >
                            Go Back
                        </button>
                        <button to="submit" className="nw-thm-btn sub-nw-brd-tbn">Save</button>
                    </div>
                </form>
            )}

        </div>
    );
}

export default SubTestCategory;