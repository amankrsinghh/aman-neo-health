import {
    faChevronLeft,
    faFile,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiPlusSquare } from "react-icons/fi";
import { toast } from "react-toastify";
import { securePostData } from "../../Services/api";
import { useState } from "react";
import { useSelector } from "react-redux";



function PrescriptionsReports() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const userId = localStorage.getItem('userId')
    const {medicalHistory} =useSelector(state=>state.patient)
    const [reports, setReports] = useState([{ name: "", fileUrl: null, preview: null }])
    const handleNameChange = (index, e) => {
        const newReports = [...reports];
        newReports[index].name = e.target.value;
        setReports(newReports);
    };

    // Handle file select / drag & drop
    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newReports = [...reports];
        newReports[index].fileUrl = file;
        newReports[index].preview = URL.createObjectURL(file);
        setReports(newReports);
    };

    // Add new report
    const handleAddReport = () => {
        setReports([...reports, { name: "", file: null, preview: null }]);
    };

    // Delete a report
    const handleDeleteReport = (index) => {
        if (reports.length === 1) return; // always keep at least 1
        const newReports = reports.filter((_, i) => i !== index);
        setReports(newReports);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('prescriptions', JSON.stringify(
            reports.map(report => ({
                name: report.name,
            }))
        ));

        reports.forEach(report => {
            formData.append('fileUrl', report.fileUrl);
        });

        try {
            const response = await securePostData('patient/prescription',formData);
            if (response.success) {
                toast.success('Prescriptions submitted successfully!');
                navigate('/near-by-doctor')
            } else {
                toast.error('Submission failed: ' + data.message);
            }
        } catch (error) {
            toast.error(err?.response?.data?.message)
        } finally{
            setLoading(false)
        }
    };


    return (
        <>
            <section className="admin-login-section nw-hero-section ">
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="admin-pisture-bx">
                                <div className="position-relative">
                                    <Link to='/family-medical-history' className="login-back-btn"> <FontAwesomeIcon icon={faChevronLeft} /> </Link>
                                </div>

                                <img src="new-login-bnnr.png" alt="" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 py-lg-3 py-sm-0 align-content-center">

                            <div className="nw-form-container">
                                <div className="login-logo">
                                    <img src="/logo.png" alt="" />
                                </div>

                                <div className="admin-vndr-login my-3">
                                    <h3 className="heading-grad">Prescriptions and Reports</h3>

                                </div>

                                <form onSubmit={handleSubmit}>
                                    {reports.map((report, index) => (
                                        <div className="pres-report-bx d-flex align-items-center gap-4 mb-3" key={index}>
                                            <div className="flex-grow-1">
                                                <div className="custom-frm-bx">
                                                    <label>Prescriptions and Reports Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control new-control-frm px-5"
                                                        placeholder="Enter Prescriptions and Reports Name"
                                                        value={report.name}
                                                        onChange={(e) => handleNameChange(index, e)}
                                                    />
                                                    <div className="contact-add-icon">
                                                        <span className="nw-contact-icon">
                                                            <FontAwesomeIcon icon={faFile} />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className="custom-frm-bx"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const file = e.dataTransfer.files[0];
                                                        if (!file) return;
                                                        const newReports = [...reports];
                                                        newReports[index].fileUrl = file;
                                                        newReports[index].preview = URL.createObjectURL(file);
                                                        setReports(newReports);
                                                    }}
                                                >
                                                    <div className="upload-box nw-upload-bx p-3 text-center">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="upload-icon">
                                                                    <IoCloudUploadOutline />
                                                                </div>
                                                                <div className="text-start">
                                                                    <p className="fw-semibold mb-0">
                                                                        <label
                                                                            htmlFor={`fileInput${index}`}
                                                                            className=" file-select-label fw-600 fz-16 mb-0"
                                                                        >
                                                                            Drop a file here
                                                                        </label>
                                                                    </p>
                                                                    <small className="format-title">File Support JPEG, PDF</small>
                                                                </div>
                                                            </div>

                                                            <div className="mt-2">
                                                                <label
                                                                    htmlFor={`fileInput${index}`}
                                                                    className="browse-btn"
                                                                >
                                                                    Browse
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            id={`fileInput${index}`}
                                                            accept=".png,.jpg,.jpeg,.pdf"
                                                            onChange={(e) => handleFileChange(index, e)}
                                                        />

                                                        {report.preview && (
                                                            <div className="mt-3">
                                                                <img
                                                                    src={report.preview}
                                                                    alt="Preview"
                                                                    className="clinic-pic"
                                                                    
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="nw-press-delete-bx">
                                                <button
                                                    type="button"
                                                    className="text-danger"
                                                    onClick={() => handleDeleteReport(index)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="add-more-bx mb-3">
                                        <button
                                            type="button"
                                            className="nw-thm-btn outline w-100 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                            onClick={handleAddReport}
                                        >
                                            <FiPlusSquare /> Add More
                                        </button>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <button type="submit" className="nw-thm-btn w-100">
                                            Submit & Next
                                        </button>
                                    </div>
                                        <Link
                                            type="button"
                                            className="nw-thm-btn outline mt-3 w-100 d-flex align-items-center justify-content-center gap-2 border-dashed"
                                            to={'/near-by-doctor'}
                                        >
                                             Skip
                                        </Link>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PrescriptionsReports