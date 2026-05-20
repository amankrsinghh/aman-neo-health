import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useParams, useNavigate, NavLink, useSearchParams, Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { getApiData, getSecureApiData, securePostData } from "../../Service/api";
function AddPatient() {
  const { id } = useParams();   // id aaye to edit mode
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [patientData, setPatientData] = useState()

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
    dob: "",
    gender: "",
    contactNumber: "",
    email: "",
    contact: {
      emergencyContactName: "",
      emergencyContactNumber: "",
    },
    department: "",
    address: "",
    countryId: null,
    stateId: "",
    cityId: "",
    pinCode: "",
    status: "Active"
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
    try {
      if (isEdit) {
        const data = { ...form, patientId: id }
        const res = await api.put(`/patients/${id}`, data);
        if (res.data.success) {
          toast.success("Patient updated successfully");
        } else {
          toast.error(res.message)
        }
      } else {
        if (fetchById) {
          const data = { ...form, patientId }
          const res = await securePostData(`api/patients/admit`, { patientId, departmentId: form.department });
          if (res.success) {
            toast.success("Patient added successfully");

            if (searchParams.get('type') == "IPD") {
              navigate(`/bed-management?patientId=${patientId}`)
            } else if (searchParams.get('type') == "OPD") {
              navigate('/patient-opd')
            } else if (searchParams.get('type') == "EMERGENCY") {
              navigate('/patient-emergency')
            } else {
              navigate('/dashboard')
            }
          } else {
            toast.error(res.message)
          }
        } else {
          const res = await api.post("/patients/add", form);
          if (res.data.success) {
            const dept = department?.find(item => item?._id == form?.department)
            toast.success("Patient added successfully");
            if (dept?.type == "IPD") {
              navigate(`/bed-management?patientId=${patientId}`)
            } else if (dept?.type == "OPD") {
              navigate('/patient-opd')
            } else if (dept?.type == "EMERGENCY") {
              navigate('/patient-emergency')
            } else {
              navigate('/dashboard')
            }
          } else {
            toast.error(res.data.message)
          }
        }
      }
      setErrors({});
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  const fetchDepartments = async () => {
    try {
      const res = await getSecureApiData(`api/department/list?limit=100&type=${searchParams.get('type') || ""}`);
      if (res.success) {
        if (res.data?.length == 1) {
          setForm({ ...form, department: res.data[0]?._id })
        }
        setDepartment(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPatient = async () => {
    const ptId = patientId || id
    try {
      const result = await getSecureApiData(`api/patients/by-patient-id/${ptId}`)

      if (result.success) {
        const general = result.user
        const demographic = result.demographic
        setForm({
          patientId,
          name: general.name,
          gender: general?.gender,
          contactNumber: general?.contactNumber,
          email: general?.email,
          address: demographic?.address,
          department: result?.department?.departmentId || form.department,
          contact: {
            emergencyContactName: demographic?.contact?.emergencyContactName,
            emergencyContactNumber: demographic?.contact?.emergencyContactNumber,
          },
          countryId: demographic?.countryId?._id,
          stateId: demographic?.stateId?._id,
          cityId: demographic?.cityId?._id,
          pinCode: demographic?.pinCode,

          // ✅ format DOB for date input
          dob: demographic?.dob
            ? new Date(demographic.dob).toISOString().split("T")[0]
            : ""
        })
        setFetchById(true)
        setById(false)
        fetchStates(demographic?.countryId?.isoCode)
        fetchCities(demographic?.stateId?.isoCode)
      }
    } catch {
      toast.error("Failed to load patient");
    }
  };

  useEffect(() => {
    api.get("/location/countries")
      .then(res => {
        const data = res.find(item => item?.name == "India")
        setForm({ ...form, countryId: data?._id })
        fetchStates(data?.isoCode)
        setCountries(res.data)
      })
      .catch(err => console.error(err));
    fetchDepartments();
    if (isEdit) {
      fetchPatient();
      setById(false)
    }
  }, [id]);

  async function fetchStates(value) {
    try {
      const response = await getApiData(`api/location/states/${value}`)
      const data = await response
      setStates(data)
    } catch (error) {

    }
  }
  async function fetchCities(value) {
    try {
      const response = await getApiData(`api/location/cities/${value}`)
      const data = await response
      setCities(data)
    } catch (error) {

    }
  }
  const handlePatientIdBlur = async () => {
    if (!form.patientId) return;

    try {
      const res = await api.get(
        `/patients/by-patient-id/${form.patientId}`
      );
      //PURE FORM AUTO-FILL
      setForm(prev => ({
        ...prev,
        ...res.data.data
      }));

      if (res.data.success == false) {
        toast.error(res.data.message);
      } else {
        toast.success("Patient details loaded");
      }
    } catch (err) {
      toast.error("Patient not found");
    }
  };

  const validate = () => {
    let newErrors = {};

    //   if (!form.patientId.trim())
    //     newErrors.patientId = "Patient ID is required";

    if (!form.name.trim())
      newErrors.name = "Patient name is required";

    if (!form.dob)
      newErrors.dob = "Date of birth is required";

    if (!form.gender)
      newErrors.gender = "Gender is required";
    if (!form.address)
      newErrors.address = "Address is required";

    if (!form.contactNumber)
      newErrors.contactNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.contactNumber))
      newErrors.contactNumber = "Mobile number must be 10 digits";

    if (!form.email)
      newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email address";

    // if (!form.contact.emergencyContactName)
    //   newErrors.emergencyContactName = "Emergency contact name is required";

    // if (!form.contact.emergencyContactNumber)
    //   newErrors.emergencyContactNumber = "Emergency contact number is required";
    // else if (!/^\d{10}$/.test(form.contact.emergencyContactNumber))
    //   newErrors.emergencyContactNumber = "Emergency contact number must be 10 digits";

    if (!form.department)
      newErrors.department = "Department is required";

    if (!form.countryId && !id)
      newErrors.countryId = "State is required";

    if (!form.stateId && !id)
      newErrors.stateId = "State is required";

    if (!form.cityId && !id)
      newErrors.cityId = "City is required";
    // if (!form.pinCode)
    //   newErrors.pinCode = "Pincode is required";
    // else if (!/^\d{6}$/.test(form.pinCode))
    //   newErrors.pinCode = "Pincode must be 6 digits";

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
  async function handleAddPatient() {
    try {
      const result = await getSecureApiData(`api/patients/by-patient-id/${patientId}`)

      if (result.success) {
        const general = result.user
        const demographic = result.demographic
        setPatientId(general?.userId)
        setForm({
          ...form,
          patientId,
          name: general.name,
          gender: general?.gender,
          contactNumber: general?.contactNumber,
          email: general?.email,
          address: demographic?.address,
          // department: result?.department?.departmentId || form.department,
          contact: {
            emergencyContactName: demographic?.contact?.emergencyContactName,
            emergencyContactNumber: demographic?.contact?.emergencyContactNumber,
          },
          countryId: demographic?.countryId?._id,
          stateId: demographic?.stateId?._id,
          cityId: demographic?.cityId?._id,
          pinCode: demographic?.pinCode,

          // ✅ format DOB for date input
          dob: demographic?.dob
            ? new Date(demographic.dob).toISOString().split("T")[0]
            : ""
        })
        setById(false)
        setFetchById(general.gender ? true : false)
        fetchStates(demographic?.countryId?.isoCode)
        fetchCities(demographic?.stateId?.isoCode)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      // fetchDepartments()
    }
  }
  return (
    <>
      {byId ?
        <div className="main-content flex-grow-1 p-3 overflow-auto">
          <h3 className="innr-title mb-2 gradient-text">Add Patient</h3>

          <div className="new-panel-card col-lg-8">
            <div className="hospital-add-doctor mb-2">
              <div>
                <h4 className="fz-18 text-black fw-700 mb-0">Add Patient</h4>
                <p className="mb-0">Please enter patient ID </p>
              </div>

              <div>
                <button onClick={() => setById(false)} className="nw-exprt-btn">
                  <FaPlusCircle /> Add Patient Manually
                </button>
              </div>
            </div>

            {/* Doctor ID Input */}
            <div className="custom-frm-bx">
              <label>Patient ID</label>
              <input
                type="text"
                className="form-control nw-frm-select"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />

              {loading && <small className="text-info">Checking...</small>}

            </div>

            {/* 🔘 Button Logic */}
            <div className="text-center mt-4">
              <button
                className="nw-thm-btn w-75"
                // disabled={!patientData}
                onClick={handleAddPatient}
              >
                {patientData ? "Add" : "Submit"}
              </button>
            </div>
          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline" >
              Go Back
            </Link>
          </div>
        </div> :
        <div className="main-content flex-grow-1 p-3 overflow-auto">
          <div className="row ">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="innr-title mb-2">{isEdit ? "Edit Patient" : "Add Patient"}</h3>
                <div className="admin-breadcrumb">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb custom-breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/dashboard" className="breadcrumb-link">Dashboard</NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/patient" className="breadcrumb-link">Patients</NavLink>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page" >
                        {isEdit ? "Edit Patient" : "Add Patient"}
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
                    <h5 className="add-contact-title">Patient Details</h5>
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
                    <label htmlFor="">Patient Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Date of Birth </label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.dob && <small className="text-danger">{errors.dob}</small>}
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
                    <label htmlFor="">Mobile Number</label>
                    <input
                      type="number"
                      name="contactNumber"
                      placeholder="Mobile Number"
                      value={form.contactNumber}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.email && <small className="text-danger">{errors.email}</small>}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="contact.emergencyContactName"
                      placeholder="Emergency Contact Name"
                      value={form.emergencyContactName}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.emergencyContactName && <small className="text-danger">{errors.emergencyContactName}</small>}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Emergency Contact Phone</label>
                    <input
                      type="number"
                      name="contact.emergencyContactNumber"
                      placeholder="Emergency Contact Phone"
                      value={form?.contact?.emergencyContactNumber}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select"
                    />
                    {errors.emergencyContactNumber && <small className="text-danger">{errors.emergencyContactNumber}</small>}
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label>Department</label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="form-select nw-frm-select"
                    >
                      <option value="">---Select Department---</option>
                      {department.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.departmentName}
                        </option>
                      ))}
                    </select>
                    {errors.department && <small className="text-danger">{errors.department}</small>}
                  </div>
                </div>



                <div className="col-lg-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Address</label>
                    <textarea name="address"
                      value={form.address}
                      onChange={handleChange}
                      disabled={fetchById}
                      placeholder="Address"
                      className="form-control nw-frm-select">
                    </textarea>
                    {errors.address && <small className="text-danger">{errors.address}</small>}
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Counrty</label>
                    <select
                      className="form-select nw-frm-select"
                      value={form.countryId}
                      name="countryId"
                      onChange={handleChange}
                      disabled={fetchById}
                    >
                      <option value="">---Select Country---</option>
                      {countries.map((s) => (
                        <option key={s._id} value={s._id} >
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.countryId && <small className="text-danger">{errors.countryId}</small>}

                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">State</label>
                    <select
                      className="form-select nw-frm-select"
                      value={form.stateId}
                      name="stateId"
                      disabled={!form.countryId || fetchById}
                      onChange={handleChange}
                    >
                      <option value="">---Select State---</option>
                      {states.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.stateId && <small className="text-danger">{errors.stateId}</small>}

                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">City</label>
                    <select
                      className="form-select nw-frm-select"
                      value={form.cityId}
                      name="cityId"
                      onChange={handleChange}
                      disabled={!form.stateId || fetchById}
                    >
                      <option value="">---Select City---</option>
                      {cities.map((c, index) => (
                        <option key={index} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityId && <small className="text-danger">{errors.cityId}</small>}
                  </div>
                </div>


                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Pincode</label>
                    <input
                      type="number"
                      name="pinCode"
                      placeholder="Pincode"
                      value={form.pinCode}
                      onChange={handleChange}
                      disabled={fetchById}
                      className="form-control nw-frm-select" />
                    {errors.pinCode && <small className="text-danger">{errors.pinCode}</small>}
                  </div>
                </div>




                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="custom-frm-bx">
                    <label htmlFor="">Status</label>
                    <select name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="form-select nw-frm-select">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    {errors.status && <small className="text-danger">{errors.status}</small>}

                  </div>
                </div>


              </div>


              <div className="mt-5 d-flex align-items-center justify-content-end gap-3">
                <button type="submit" className="nw-thm-btn rounded-3" >{isEdit ? "Update Patient" : "Submit"}</button>
              </div>

            </form>

          </div>
          <div className="text-end mt-3">
            <Link to={-1} className="nw-thm-btn outline" >
              Go Back
            </Link>
          </div>






        </div>}
    </>
  )
}

export default AddPatient