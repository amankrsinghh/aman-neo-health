import {

    faChevronLeft,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { getSecureApiData, securePostData } from "../../Services/api";

function FamilyMedicalHistory() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const patientId = localStorage.getItem('patientId')
    const userId = localStorage.getItem('userId')
    const [familyHistory, setFamilyHistory] = useState({ chronicHistory: "", diseasesInFamiy: "" })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFamilyHistory((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [errors, setErrors] = useState({});
    const validate = () => {
        let temp = {};        
        if (!familyHistory?.chronicHistory?.trim())
            temp.chronicHistory = "Chronic history is required";
        if (!familyHistory?.diseasesInFamily?.trim())
            temp.diseasesInFamily = "Disease in family is required";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validate()) return;
        setLoading(true)
        const data = { userId, familyHistory }
        try {
            const response = await securePostData('patient/family-medical-history', data)
            if (response.success) {
                toast.success("Medical records sent")
                navigate('/prescriptions-reports')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };
    async function fetchFamilyHistory() {
        const result = await getSecureApiData(`patient/medical-history/${localStorage.getItem('userId')}`)

        if (result.success) {
            const data = result.data.familyHistory
            if (data) {

                setFamilyHistory(data)
            }
        }
    }
    useEffect(() => {
        if (userId) {
            fetchFamilyHistory()
        }
    }, [userId])
    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12 ">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to='/medical-history' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="new-login-bnnr.png" alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-3">
                                        <h3 className="heading-grad">Family Medical History</h3>
                                    </div>

                                    <form onSubmit={handleSubmit}>

                                        <div className="custom-frm-bx">
                                            <label>Any family history of chronic disease?</label>
                                            <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faPerson} /> </span>
                                                <select
                                                    name="chronicHistory"
                                                    value={familyHistory.chronicHistory}
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
                                            {errors.chronicHistory && <small className="text-danger">{errors.chronicHistory}</small>}
                                        </div>

                                        <div className="custom-frm-bx">
                                            <label htmlFor="">Chronic Diseases in Family</label>
                                            <textarea name="diseasesInFamily" value={familyHistory.diseasesInFamily}
                                                onChange={handleChange} id="" className="form-control new-control-frm"></textarea>
                                            {errors.diseasesInFamily && <small className="text-danger">{errors.diseasesInFamily}</small>}

                                        </div>

                                        <div className="mt-5 text-center">
                                            <button type="submit" className="nw-thm-btn w-100">Submit & Next</button>
                                        </div>



                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>}
        </>
    )
}

export default FamilyMedicalHistory