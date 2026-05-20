import {

    faChevronLeft,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function MedicalHistory() {
    const patientId = localStorage.getItem('patientId')
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        chronicCondition: "",
        onMedication: false,
        medicationDetail: "",
        allergies: "",
        smoking: false,
        alcohol: false,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { userId, ...formData }
        try {
            const response = await securePostData('patient/medical-history', data)
            if (response.success) {
                toast.success("Medical records sent")
                navigate('/family-medical-history')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(err?.response?.data?.message)
            console.log(error)
        }
    };
    async function fetchUserProfile() {
        const result = await getSecureApiData(`patient/medical-history/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data
            setFormData(data)
        }
    }
    useEffect(() => {
        if (userId) {
            fetchUserProfile()
        }
    }, [userId])
    return (
        <>
            <section className="admin-login-section nw-hero-section ">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <div className="position-relative">
                                    <Link to='/personal-info' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>

                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-5 col-md-12 col-sm-12 d-flex flex-column justify-content-center pb-3">
                            <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>
                                <div className="admin-vndr-login my-3">
                                    <h3 className="heading-grad">Medical History</h3>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Chronic Condition */}
                                    <div className="custom-frm-bx">
                                        <label>Do you have any chronic conditions?</label>
                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm">
                                            <span className="nw-contact-icon">
                                                <FontAwesomeIcon icon={faPerson} />
                                            </span>
                                            <select
                                                name="chronicCondition"
                                                value={formData.chronicCondition}
                                                onChange={handleChange}
                                                className="nw-select"
                                            >
                                                <option value="">--Select--</option>
                                                <option value="diabetes">Diabetes</option>
                                                <option value="hypertension">Hypertension</option>
                                                <option value="asthma">Asthma</option>
                                                <option value="heart">Heart Disease</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* On Medication */}
                                    <div className="custom-frm-bx">
                                        <label>Are you currently on any medications?</label>
                                        <div className="custom-radio-group d-flex align-items-center gap-3">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="onMedication"
                                                    value={true}
                                                    checked={formData.onMedication}
                                                    onChange={handleChange}
                                                    id="medYes"
                                                />
                                                <label className="form-check-label" htmlFor="medYes">
                                                    Yes
                                                </label>
                                            </div>

                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="onMedication"
                                                    value={false}
                                                    checked={!formData.onMedication}
                                                    onChange={handleChange}
                                                    id="medNo"
                                                />
                                                <label className="form-check-label" htmlFor="medNo">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Medication Details */}
                                    <div className="custom-frm-bx">
                                        <label>Medication Details</label>
                                        <textarea
                                            name="medicationDetail"
                                            value={formData.medicationDetail}
                                            onChange={handleChange}
                                            className="form-control new-control-frm"
                                            disabled={formData.onMedication === "no"}
                                        />
                                    </div>

                                    {/* Allergies */}
                                    <div className="custom-frm-bx">
                                        <label>Allergies</label>
                                        <textarea
                                            name="allergies"
                                            value={formData.allergies}
                                            onChange={handleChange}
                                            className="form-control new-control-frm"
                                        />
                                    </div>

                                    {/* Smoking */}
                                    <div className="custom-frm-bx">
                                        <label>Smoking</label>
                                        <div className="custom-radio-group d-flex align-items-center gap-3">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="smoking"
                                                    value={true}
                                                    checked={formData.smoking}
                                                    onChange={handleChange}
                                                    id="smokeYes"
                                                />
                                                <label className="form-check-label" htmlFor="smokeYes">
                                                    Yes
                                                </label>
                                            </div>

                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="smoking"
                                                    value={false}
                                                    checked={!formData.smoking}
                                                    onChange={handleChange}
                                                    id="smokeNo"
                                                />
                                                <label className="form-check-label" htmlFor="smokeNo">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alcohol */}
                                    <div className="custom-frm-bx">
                                        <label>Alcohol</label>
                                        <div className="custom-radio-group d-flex align-items-center gap-3">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="alcohol"
                                                    value={true}
                                                    checked={formData.alcohol}
                                                    onChange={handleChange}
                                                    id="alcoholYes"
                                                />
                                                <label className="form-check-label" htmlFor="alcoholYes">
                                                    Yes
                                                </label>
                                            </div>

                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="alcohol"
                                                    value={false}
                                                    checked={!formData.alcohol}
                                                    onChange={handleChange}
                                                    id="alcoholNo"
                                                />
                                                <label className="form-check-label" htmlFor="alcoholNo">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="mt-5 text-center">
                                        <button type="submit" className="nw-thm-btn w-100">
                                            Submit & Next
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MedicalHistory