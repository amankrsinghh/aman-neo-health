import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { securePostData } from "../Services/api";
import { useSelector } from "react-redux";

function DeathForm() {
    const { id } = useParams();   // id aaye to edit mode
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [patientData, setPatientData] = useState()
    const {user}=useSelector(state=>state.doctor)
    const isEdit = Boolean(id);
    const [fetchById, setFetchById] = useState(false)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [nextOfKin, setnextOfKin] = useState()
    const [department, setDepartment] = useState([]);
    const [byId, setById] = useState(true)
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        patientId:"",
        fullName:"",
        ageAtDeath: "",
        causeOfDeath: "",
        mannerOfDeath:"",
        contributingCause:"",
        placeOfDeath: "",
        dateOfDeath: null,
        timeOfDeath: null,
        type: "doctor",
        nextOfKin:{
            name:"",
            relation:""
        },
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");

            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {

            setForm(prev => ({ ...prev, [name]: value }));
        }
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        let data={...form,doctorId:user?.nh12}
        try {
            setLoading(true)
            const res = await securePostData("api/certificate/death", data);
            if (res.success) {
                navigate("/death-certificate");
                toast.success("Death certificate generated successfully");
            } else {
                toast.error(res.messageAtDeath)
            }

            setErrors({});
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.messageAtDeath || "Something went wrong");
        } finally{
            setLoading(false)
        }
    };





    const validate = () => {
        let newErrors = {};


        // if (!form.doctorId)
        //     newErrors.doctorId = "Doctor id is required";
        // else if (form?.doctorId?.length < 12)
        //     newErrors.doctorId = "Please enter a valid doctor id"
        if (!form.gender)
            newErrors.gender = "Gender is required";
        if (!form.ageAtDeath)
            newErrors.ageAtDeath = "Age at death is required";

        if (!form.causeOfDeath)
            newErrors.causeOfDeath = "Cause of death is required";
        if (!form.placeOfDeath)
            newErrors.placeOfDeath = "Place of death is required";

        if (!form.fullName)
            newErrors.fullName = "Full name is required";
        if (!form.dateOfDeath)
            newErrors.dateOfDeath = "Date of death is required";

        if (!form.timeOfDeath)
            newErrors.timeOfDeath = "Time of death is required";
        if (!form.nextOfKin?.name)
            newErrors.name = "Next of kin name is required";
        if (!form.nextOfKin?.relation)
            newErrors.relation = "Next of kin relation is required";
       



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    return (
        <>

            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">{isEdit ? "Edit Death Certificate" : "Generate Death Certificate"}</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/death-certificate" className="breadcrumb-link">Death Certificate</NavLink>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="pageAtDeath" >
                                            {isEdit ? "Edit Death Certificate" : "Generate Death Certificate"}
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="new-panel-card">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="">
                                    <h5 className="add-contact-title">Certificate Details</h5>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Aman Kumar"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Date of Death</label>
                                    <input
                                        type="date"
                                        name="dateOfDeath"
                                        max={new Date().toISOString().split("T")[0]}
                                        value={form.dateOfDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.dateOfDeath && <small className="text-danger">{errors.dateOfDeath}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Time of Death</label>
                                    <input
                                        type="time"
                                        name="timeOfDeath"
                                        value={form.timeOfDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.timeOfDeath && <small className="text-danger">{errors.timeOfDeath}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        disabled={fetchById}
                                        className="form-select nw-frm-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <small className="text-danger">{errors.gender}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Age at Death</label>
                                    <input
                                        type="number"
                                        min={0}
                                        name="ageAtDeath"
                                        value={form.ageAtDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.ageAtDeath && <small className="text-danger">{errors.ageAtDeath}</small>}
                                </div>
                            </div>



                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Death Person (NHC Id)</label>
                                    <input
                                        type="text"
                                        name="patientId"
                                        value={form.patientId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Manner of Death</label>
                                    <input
                                        type="text"
                                        name="mannerOfDeath"
                                        value={form.mannerOfDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.mannerOfDeath && <small className="text-danger">{errors.mannerOfDeath}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Cause of Death</label>
                                    <input
                                        type="text"
                                        name="causeOfDeath"
                                        value={form.causeOfDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.causeOfDeath && <small className="text-danger">{errors.causeOfDeath}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Place of Death</label>
                                    <input
                                        type="text"
                                        name="placeOfDeath"
                                        value={form.placeOfDeath}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.placeOfDeath && <small className="text-danger">{errors.placeOfDeath}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Contributing Cause</label>
                                    <input
                                        type="text"
                                        name="contributingCause"
                                        value={form.contributingCause}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.contributingCause && <small className="text-danger">{errors.contributingCause}</small>}
                                </div>
                            </div> 
                            <div className="row">
                                <h5>Next of Kin</h5>
                                <div className=" col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Name</label>
                                    <input
                                        type="text"
                                        name="nextOfKin.name"
                                        value={form.nextOfKin.name}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Relation</label>
                                    <input
                                        type="text"
                                        name="nextOfKin.relation"
                                        value={form.nextOfKin.relation}
                                        placeholder="son"
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.relation && <small className="text-danger">{errors.relation}</small>}
                                </div>
                            </div>
                            </div>
                            



                        </div>


                        <div className="mt-5 d-flex align-items-center justify-content-end gap-3">
                            <button type="submit" disabled={loading} className="nw-thm-btn rounded-3" >
                                {loading ? "Submitting..." : "Submit"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default DeathForm