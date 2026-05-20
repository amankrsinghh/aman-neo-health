import {

    faCalendar,
    faChevronLeft,
    faHospital,
    faTrash,
    faUniversity,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiPlusSquare } from "react-icons/fi";
import { FaPlusCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getSecureApiData, postApiData, securePostData } from "../../Services/api";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";


function DoctorEducationWorkExperience() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const [errors, setErrors] = useState({})
    const [education, setEducation] = useState([
        {
            university: "",
            degree: "",
            startYear: "",
            endYear: "",
        },
    ]);

    const [experience, setExperience] = useState([
        {
            organization: "",
            totalYear: "",
            month: "",
            present: false,
        },
    ]);

    /* ================= EDUCATION ================= */

    const addEducation = () => {
        setEducation([
            ...education,
            { university: "", degree: "", startYear: "", endYear: "" },
        ]);
    };

    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    /* ================= EXPERIENCE ================= */

    const addExperience = () => {
        setExperience([
            ...experience,
            { organization: "", startYear: "", endYear: "", present: false },
        ]);
    };

    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    const handleExperienceChange = (index, field, value) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };
    const validate = () => {
        let temp = {
            education: [],
            experience: []
        };

        // Education validation
        education.forEach((item, index) => {
            let eduError = {};

            if (!item.university?.trim()) {
                eduError.university = "University is required";
            }

            if (!item.degree || item.degree === "--Select--") {
                eduError.degree = "Degree is required";
            }

            if (!item.startYear?.trim()) {
                eduError.startYear = "Start year is required";
            }

            if (!item.endYear?.trim()) {
                eduError.endYear = "End year is required";
            }

            temp.education[index] = eduError;
        });

        // Experience validation
        experience.forEach((item, index) => {
            let expError = {};

            if (!item.organization?.trim()) {
                expError.organization = "Organization name is required";
            }

            if (!item.totalYear) {
                expError.totalYear = "Total year is required";
            }

            if (!item.month) {
                expError.month = "Total month is required";
            }

            temp.experience[index] = expError;
        });

        setErrors(temp);

        const hasEducationError = temp.education.some(obj => Object.keys(obj).length > 0);
        const hasExperienceError = temp.experience.some(obj => Object.keys(obj).length > 0);

        return !(hasEducationError || hasExperienceError);
    };
    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        const data = { userId, education, work: experience }
        try {
            const response = await securePostData('doctor/education-work', data)
            if (response.success) {
                toast.success('Records saved')
                navigate('/medical-license')
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    };
    async function fetchEduWork() {
        setLoading(true)
        const result = await getSecureApiData(`doctor/education-work/${localStorage.getItem('userId')}`)
        if (result.success) {
            const data = result.data
            setEducation(data?.education)
            setExperience(data?.work)
        }
        setLoading(false)
    }
    useEffect(() => {
        if (userId) {
            fetchEduWork()
        }
    }, [userId])

    return (
        <>
            {loading ? <Loader />
                : <section className="admin-login-section nw-hero-section ">
                    <div className="container">
                        <div className="row ">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="admin-pisture-bx">
                                    <div className="position-relative">
                                        <Link to='/kyc' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                    </div>

                                    <img src="/doctor-pic.png" alt="" />
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12 col-sm-12 py-lg-3 py-sm-0 align-content-center">

                                <div className="nw-form-container">
                                    <div className="login-logo">
                                        <img src="/logo.png" alt="" />
                                    </div>

                                    <div className="admin-vndr-login my-3">
                                        <h3 className="heading-grad">Education & Work & Experience</h3>

                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <h5 className="mb-0 fz-20 fw-600">Education</h5>
                                            </div>

                                            <div>
                                                <button type="button" onClick={addEducation} className="fz-20" style={{ color: "#00B4B5" }}><FaPlusCircle /></button>
                                            </div>
                                        </div>
                                        {education.map((item, index) => (
                                            <div key={index} className="pres-report-bx d-flex align-items-center gap-4 mb-3">

                                                <div className="flex-grow-1">
                                                    <div className="custom-frm-bx">
                                                        <div className="custom-frm-bx mb-0">

                                                            <label htmlFor="">University / Institution</label>
                                                            <input type="text"
                                                                value={item.university}
                                                                onChange={(e) =>
                                                                    handleEducationChange(index, "university", e.target.value)
                                                                } className="form-control new-control-frm px-5" placeholder="Enter University / Institution" />
                                                            <div className="contact-add-icon">
                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUniversity} /> </span>
                                                            </div>
                                                        </div>
                                                        {errors?.education?.[index]?.university && (
                                                            <small className="text-danger">
                                                                {errors.education[index].university}
                                                            </small>
                                                        )}
                                                    </div>

                                                    <div className="custom-frm-bx">
                                                        <label>Degree / Qualification</label>
                                                        <div className="field custom-frm-bx mb-0 custom-select nw-custom-select admin-table-search-frm ">
                                                            <span className="nw-contact-icon"> <FontAwesomeIcon icon={faUniversity} /> </span>
                                                            <select className="nw-select"
                                                                value={item.degree}
                                                                onChange={(e) =>
                                                                    handleEducationChange(index, "degree", e.target.value)
                                                                }>
                                                                <option>--Select--</option>
                                                                <option value="High School">High School</option>
                                                                <option value="Intermediate">Intermediate / Higher Secondary</option>

                                                                {/* Diploma */}
                                                                <option value="Diploma">Diploma</option>
                                                                <option value="Medical Diploma">Medical Diploma</option>

                                                                {/* Undergraduate */}
                                                                <option value="BA">BA</option>
                                                                <option value="BSc">BSc</option>
                                                                <option value="BCom">BCom</option>
                                                                <option value="BBA">BBA</option>
                                                                <option value="BCA">BCA</option>
                                                                <option value="MBBS">MBBS</option>
                                                                <option value="BDS">BDS</option>
                                                                <option value="BAMS">BAMS</option>
                                                                <option value="BHMS">BHMS</option>
                                                                <option value="BPT">BPT</option>
                                                                <option value="BPharm">B.Pharm</option>
                                                                <option value="GNM">GNM</option>
                                                                <option value="BSc Nursing">B.Sc Nursing</option>

                                                                {/* Postgraduate */}
                                                                <option value="MA">MA</option>
                                                                <option value="MSc">MSc</option>
                                                                <option value="MCom">MCom</option>
                                                                <option value="MBA">MBA</option>
                                                                <option value="MCA">MCA</option>
                                                                <option value="MD">MD</option>
                                                                <option value="MS">MS</option>
                                                                <option value="MDS">MDS</option>
                                                                <option value="MPT">MPT</option>
                                                                <option value="MPharm">M.Pharm</option>
                                                                <option value="MSc Nursing">M.Sc Nursing</option>

                                                                {/* Doctorate */}
                                                                <option value="PhD">PhD</option>

                                                            </select>
                                                        </div>
                                                        {errors?.education?.[index]?.degree && (
                                                            <small className="text-danger">
                                                                {errors.education[index].degree}
                                                            </small>
                                                        )}
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">Year From</label>
                                                                    <input type="text"
                                                                        value={item.startYear}
                                                                        onChange={(e) =>
                                                                            handleEducationChange(index, "startYear", e.target.value)
                                                                        } className="form-control new-control-frm px-5" placeholder="Enter Year" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                    </div>
                                                                </div>
                                                                {errors?.education?.[index]?.startYear && (
                                                                    <small className="text-danger">
                                                                        {errors.education[index].startYear}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">Year to</label>
                                                                    <input type="text"
                                                                        value={item.endYear}
                                                                        onChange={(e) =>
                                                                            handleEducationChange(index, "endYear", e.target.value)
                                                                        } className="form-control new-control-frm px-5" placeholder="Enter Year" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                    </div>
                                                                </div>
                                                                {errors?.education?.[index]?.endYear && (
                                                                    <small className="text-danger">
                                                                        {errors.education[index].endYear}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>

                                                <div className=" nw-press-delete-bx">
                                                    <button disabled={education?.length == 1} className="text-danger" type="button" onClick={() => removeEducation(index)}><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>

                                            </div>
                                        ))}


                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div>
                                                <h5 className="mb-0 fz-20 fw-600">Work & Experience</h5>
                                            </div>

                                            <div>
                                                <button type="button" onClick={addExperience} className="fz-20" style={{ color: "#00B4B5" }}><FaPlusCircle /></button>
                                            </div>
                                        </div>
                                        {experience.map((item, index) => (
                                            <div key={index} className="pres-report-bx d-flex align-items-center gap-4 mb-3">
                                                <div className="flex-grow-1">
                                                    <div className="custom-frm-bx">
                                                        <div className="custom-frm-bx mb-0">

                                                            <label htmlFor="">Organization / Hospital Name</label>
                                                            <input type="text"
                                                                value={item.organization}
                                                                onChange={(e) =>
                                                                    handleExperienceChange(index, "organization", e.target.value)
                                                                } className="form-control new-control-frm px-5" placeholder="Enter Organization / Hospital Name" />
                                                            <div className="contact-add-icon">
                                                                <span className="nw-contact-icon"> <FontAwesomeIcon icon={faHospital} /> </span>
                                                            </div>
                                                        </div>
                                                        {errors?.experience?.[index]?.organization && (
                                                            <small className="text-danger">
                                                                {errors.experience[index].organization}
                                                            </small>
                                                        )}
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">

                                                                    <label htmlFor="">Total Year</label>
                                                                    <input type="number"
                                                                        value={item.totalYear}
                                                                        onChange={(e) =>
                                                                            handleExperienceChange(index, "totalYear", e.target.value)
                                                                        } className="form-control new-control-frm px-5" placeholder="Enter Year" />
                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                    </div>
                                                                </div>
                                                                {errors?.experience?.[index]?.totalYear && (
                                                                    <small className="text-danger">
                                                                        {errors.experience[index].totalYear}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="custom-frm-bx">
                                                                <div className="custom-frm-bx mb-0">
                                                                    <label htmlFor="">Total month</label>
                                                                    <input type="number"
                                                                        value={item.month}
                                                                        onChange={(e) =>
                                                                            handleExperienceChange(index, "month", e.target.value)
                                                                        } className="form-control new-control-frm px-5" placeholder="Enter Year" />

                                                                    <div className="contact-add-icon">
                                                                        <span className="nw-contact-icon"> <FontAwesomeIcon icon={faCalendar} /> </span>
                                                                    </div>
                                                                </div>
                                                                {errors?.experience?.[index]?.month && (
                                                                    <small className="text-danger">
                                                                        {errors.experience[index].month}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accordion-body-concet ">
                                                        <input className="form-check-input mt-0" type="checkbox"
                                                            checked={item.present}
                                                            onChange={(e) =>
                                                                handleExperienceChange(index, "present", e.target.checked)
                                                            } id="available" />
                                                        <label htmlFor="available">Present</label>
                                                    </div>
                                                </div>

                                                <div className=" nw-press-delete-bx">
                                                    <button type="button" onClick={() => removeExperience(index)} className="text-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>

                                            </div>
                                        ))}

                                        <div className="mt-4 text-center">
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

export default DoctorEducationWorkExperience