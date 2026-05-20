import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { BsCapsule } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { getSecureApiData } from "../../Service/api";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
function View() {
    const params = useParams()
    const prescriptionId = params.id
    const prescriptionRef = useRef()
    const [presData, setPresData] = useState()
    async function fetchPresData() {
        try {
            const result = await getSecureApiData(`appointment/prescription-data/${prescriptionId}`)
            if (result.success) {
                setPresData(result.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        if (prescriptionId) {
            fetchPresData()
        }
    }, [prescriptionId])
    const handleDownload = async () => {
        const element = prescriptionRef.current;
        document.body.classList.add("hide-buttons");
        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: "prescription.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        try {

            await html2pdf().from(element).set(opt).save().then(() => { document.body.classList.remove("hide-buttons"); });
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <div className="row mb-3">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h3 className="innr-title mb-2">View</h3>
                            <div className="admin-breadcrumb">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb custom-breadcrumb">
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Dashboard
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Appointments
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="#" className="breadcrumb-link">
                                                Appointment Details
                                            </a>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            View  Prescriptions
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="exprt-bx d-flex align-items-center gap-2">
                            <button className="nw-exprt-btn"><FontAwesomeIcon icon={faPrint} /> Print </button>
                            <button className="nw-exprt-btn" onClick={handleDownload}><FontAwesomeIcon icon={faFileExport} /> Export </button>
                        </div>

                    </div>
                </div>
                <div className="new-panel-card" ref={prescriptionRef}>
                    <div className="row justify-content-center my-lg-4">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="view-report-card">
                                <div className="view-report-header">
                                    <h5>{presData?.customId}</h5>
                                    <h6>Date:{new Date(presData?.createdAt)?.toLocaleDateString()}</h6>
                                </div>

                                <div className="view-report-content">
                                    <div className="sub-content-title">
                                        <h4>RX.</h4>
                                        <h3><BsCapsule style={{ color: "#00B4B5" }} /> Medications</h3>
                                    </div>

                                    {presData?.medications?.map((item, key) =>
                                        <div className="view-medications-bx mb-3" key={key}>
                                            <h5>{key + 1}. {item?.name}</h5>
                                            <ul className="viwe-medication-list">
                                                <li className="viwe-medication-item">Refills: {item?.refills} </li>
                                                <li className="viwe-medication-item">Frequency: {item?.frequency} </li>
                                                <li className="viwe-medication-item">Duration: {item?.duration}</li>
                                                <li className="viwe-medication-item">Instructions: {item?.instructions}</li>

                                            </ul>
                                        </div>)}


                                    <div className="diagnosis-bx mb-3">
                                        <h5>Diagnosis</h5>
                                        <p>{presData?.diagnosis}</p>
                                    </div>

                                    <div className="diagnosis-bx mb-3">
                                        <h5>Notes</h5>
                                        <p>{presData?.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default View