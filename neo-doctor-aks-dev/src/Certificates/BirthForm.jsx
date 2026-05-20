import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { getApiData, getSecureApiData, securePostData } from "../Services/api";
import { useSelector } from "react-redux";
function BirthForm() {
    const { id } = useParams();   // id aaye to edit mode
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [patientData, setPatientData] = useState()
    const{user}=useSelector(state=>state.doctor)
    const isEdit = Boolean(id);
    const [fetchById, setFetchById] = useState(false)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [fatherId, setfatherId] = useState()
    const [department, setDepartment] = useState([]);
    const [byId, setById] = useState(true)
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        fatherId: "",
        motherId:"",
        childId:"",
        age: "",
        gender: "",
        fatherName:"",
        motherName:"",
        childName: "",
        dateOfBirth: null,
        timeOfBirth: null,
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
        let data={...form,doctorId:user.nh12}
        try {
            setLoading(true)
            const res = await securePostData("api/certificate/birth", data);
            if (res.success) {
                navigate("/birth-certificate");
                toast.success("Birth certificate generated successfully");
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


        // if (!form.doctorId)
        //     newErrors.doctorId = "Doctor id is required";
        // else if (form?.doctorId?.length < 12)
        //     newErrors.doctorId = "Please enter a valid doctor id"

        if (!form.weight)
            newErrors.weight = "Child weight is required";
        if (!form.childName)
            newErrors.childName = "childName is required";

        if (!form.gender)
            newErrors.gender = "Child Gender is required";
        if (!form.dateOfBirth)
            newErrors.dateOfBirth = "Date of birth is required";

        if (!form.timeOfBirth)
            newErrors.timeOfBirth = "Time of birth is required";
        if (!form.childName)
            newErrors.childName = "Child name is required";
       



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    return (
        <>

            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">{isEdit ? "Edit Birth Certificate" : "Generate Birth Certificate"}</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/birth-certificate" className="breadcrumb-link">Birth Certificate</NavLink>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page" >
                                            {isEdit ? "Edit Birth Certificate" : "Generate Birth Certificate"}
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
                                    <label htmlFor="">Child Name</label>
                                    <input
                                        type="text"
                                        name="childName"
                                        placeholder="Aman Kumar"
                                        value={form.childName}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.childName && <small className="text-danger">{errors.childName}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        max={new Date().toISOString().split("T")[0]}
                                        value={form.dateOfBirth}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Time of Birth</label>
                                    <input
                                        type="time"
                                        name="timeOfBirth"
                                        value={form.timeOfBirth}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.timeOfBirth && <small className="text-danger">{errors.timeOfBirth}</small>}
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
                                    <label>Weigth (in kg)</label>
                                    <input
                                        type="text"
                                        min={0}
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.weight && <small className="text-danger">{errors.weight}</small>}
                                </div>
                            </div>



                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Child (NHC Id)</label>
                                    <input
                                        type="text"
                                        name="childId"
                                        value={form.childId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.childId && <small className="text-danger">{errors.childId}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Father Name</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={form.fatherName}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.fatherName && <small className="text-danger">{errors.fatherName}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Father (NHC Id)</label>
                                    <input
                                        type="text"
                                        name="fatherId"
                                        value={form.fatherId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mother Name</label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        value={form.motherName}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.motherName && <small className="text-danger">{errors.motherName}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Mother (NHC Id)</label>
                                    <input
                                        type="text"
                                        name="motherId"
                                        value={form.motherId}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label>Delivery Type</label>
                                    <select
                                        name="deliveryType"
                                        value={form.deliveryType}
                                        onChange={handleChange}
                                        disabled={fetchById}
                                        className="form-select nw-frm-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Cesarean">Cesarean</option>
                                    </select>
                                    {errors.deliveryType && <small className="text-danger">{errors.deliveryType}</small>}
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

export default BirthForm