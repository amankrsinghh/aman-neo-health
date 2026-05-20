import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { getApiData, getSecureApiData, securePostData } from "../Services/api";
import { useSelector } from "react-redux";
function MedicalForm() {
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
    const [patientId, setPatientId] = useState()
    const [department, setDepartment] = useState([]);
    const [byId, setById] = useState(true)
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        patientId: "",
        name: "",
        age: "",
        gender: "",
        diagnosis: "",
        admitDate: null,
        rest: {
            from: null,
            to: null,
        },
        dischargeDate: null,
        type: "doctor"
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
            const res = await securePostData("api/certificate/medical", data);
            if (res.success) {
                navigate("/medical-certificate");
                toast.success("Medical certificate generated successfully");
            } else {
                toast.error(res.message)
            }

            setErrors({});
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally{
            setLoading(false)
        }
    };





    const validate = () => {
        let newErrors = {};


        if (!form.patientId)
            newErrors.patientId = "Patient id is required";
        else if (form?.patientId?.length < 12)
            newErrors.patientId = "Please enter a valid patient id"
        // if (!form.doctorId)
        //     newErrors.doctorId = "Doctor id is required";
        // else if (form?.doctorId?.length < 12)
        //     newErrors.doctorId = "Please enter a valid doctor id"

        if (!form.age)
            newErrors.age = "Patient age is required";
        if (!form.diagnosis)
            newErrors.diagnosis = "Diagnosis is required";

        if (!form.gender)
            newErrors.gender = "Patient Gender is required";
        if (!form.admitDate)
            newErrors.admitDate = "Admit date is required";

        if (!form.dischargeDate)
            newErrors.dischargeDate = "Discharge date is required";
        if (!form.diagnosis)
            newErrors.diagnosis = "Patient diagnosiss is required";
        if (form.rest.from && form.rest.to) {
            if (Number(form.rest.to) < Number(form.rest.from)) {
                newErrors.rest = "Rest To must be greater than Rest From";
            }
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    return (
        <>

            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">{isEdit ? "Edit Medical Certificate" : "Generate Medical Certificate"}</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/medical-certificate" className="breadcrumb-link">Medical Certificate</NavLink>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page" >
                                            {isEdit ? "Edit Medical Certificate" : "Generate Medical Certificate"}
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
                                    <label htmlFor="">Patient (NHC Id)</label>
                                    <input
                                        type="text"
                                        name="patientId"
                                        placeholder="NHC Id"
                                        value={form.patientId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.patientId && <small className="text-danger">{errors.patientId}</small>}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Admit Date </label>
                                    <input
                                        type="date"
                                        name="admitDate"
                                        value={form.admitDate}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.admitDate && <small className="text-danger">{errors.admitDate}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Discharge Date </label>
                                    <input
                                        type="date"
                                        name="dischargeDate"
                                        min={form.admitDate || ""} 
                                        value={form.dischargeDate}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.dischargeDate && <small className="text-danger">{errors.dischargeDate}</small>}
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
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        min={0}
                                        name="age"
                                        value={form.age}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.age && <small className="text-danger">{errors.age}</small>}
                                </div>
                            </div>
                            {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Doctor (NHC Id) </label>
                                    <input
                                        type="number"
                                        name="doctorId"
                                        value={form.doctorId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.doctorId && <small className="text-danger">{errors.doctorId}</small>}
                                </div>
                            </div> */}
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Diagnosis </label>
                                    <input
                                        type="text"
                                        name="diagnosis"
                                        value={form.diagnosis}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.diagnosis && <small className="text-danger">{errors.diagnosis}</small>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label >Rest From  </label>
                                    <input
                                        type="date"
                                        name="rest.from"
                                        min={form.dischargeDate || ""} 
                                        value={form.rest.from || ""}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.restFrom && <small className="text-danger">{errors.restFrom}</small>}
                                </div>
                                <div className="col-6">
                                    <label >Rest To  </label>
                                    <input
                                        type="date"
                                        name="rest.to"
                                        value={form.rest.to || ""}
                                        min={form.rest.from || ""}   // 👈 important
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.restTo && <small className="text-danger">{errors.restTo}</small>}
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

export default MedicalForm