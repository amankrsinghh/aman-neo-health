import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { getApiData, getSecureApiData, securePostData } from "../Services/api";
import { useSelector } from "react-redux";
function FitnessForm() {
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
        purpose: "",
        condition: "",
        examinDate: null,
        effectiveDate: null,
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
        if (name === 'countryId' && value) {
            const data = countries?.filter(item => item?._id === value)
            fetchStates(data[0].isoCode);
        }
        if (name === 'stateId' && value) {
            const data = states?.filter(item => item?._id === value)
            fetchCities(data[0].isoCode);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        let data={...form,doctorId:user?.nh12}
        try {
            setLoading(true)

            const res = await securePostData("api/certificate/fitness", data);
            if (res.success) {
                toast.success("Fitness certificate generated successfully");
                navigate("/dashboard");
                setErrors({});
            } else {
                toast.error(res.message)
            }

        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false)
        }
    };





    const validate = () => {
        let newErrors = {};

        //   if (!form.patientId.trim())
        //     newErrors.patientId = "Patient ID is required";

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
        if (!form.purpose)
            newErrors.purpose = "Purpose is required";

        if (!form.gender)
            newErrors.gender = "Patient Gender is required";
        if (!form.examinDate)
            newErrors.examinDate = "Examin date is required";

        if (!form.effectiveDate)
            newErrors.effectiveDate = "Effective date is required";
        if (!form.condition)
            newErrors.condition = "Patient conditions is required";



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        if (!form.stateId) return;

        const fetchCities = async () => {
            try {
                const res = await api.get(`/location/cities/${form.stateId}`);
                setCities(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCities();
    }, [form.stateId]);

    return (
        <>

            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row ">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 className="innr-title mb-2">{isEdit ? "Edit Fitness Certificate" : "Generate Fitness Certificate"}</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/fitness-certificate" className="breadcrumb-link">Fitness Certificate</NavLink>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page" >
                                            {isEdit ? "Edit Fitness Certificate" : "Generate Fitness Certificate"}
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

                            {/* <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Patient ID</label>
                    <input
                      type="text"
                      name="patientId"
                      placeholder="Patient ID"
                      value={form.patientId}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control"
                    />
                  </div>
                </div> */}

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
                                    <label htmlFor="">Examin Date </label>
                                    <input
                                        type="date"
                                        name="examinDate"
                                        value={form.examinDate}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.examinDate && <small className="text-danger">{errors.examinDate}</small>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Effective Date </label>
                                    <input
                                        type="date"
                                        name="effectiveDate"
                                        value={form.effectiveDate}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.effectiveDate && <small className="text-danger">{errors.effectiveDate}</small>}
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
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Purpose </label>
                                    <input
                                        type="text"
                                        name="purpose"
                                        value={form.purpose}
                                        onChange={handleChange}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.purpose && <small className="text-danger">{errors.purpose}</small>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="">Conditions</label>
                                    <textarea
                                        type="text"
                                        name="condition"
                                        placeholder="conditions"
                                        value={form.condition}
                                        onChange={handleChange}
                                        disabled={fetchById}
                                        className="form-control nw-frm-select"
                                    />
                                    {errors.condition && <small className="text-danger">{errors.condition}</small>}
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

export default FitnessForm