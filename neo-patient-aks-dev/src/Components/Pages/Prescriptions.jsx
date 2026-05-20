import { faCircleXmark, faDownload, faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfileSidebar from "./ProfileSidebar"
import { useEffect, useRef, useState } from "react"
import { getSecureApiData } from "../../Services/api"
import base_url from "../../baseUrl"
import html2canvas from "html2canvas"
import html2pdf from "html2pdf.js"
import { BsCapsule } from "react-icons/bs"
import { Link } from "react-router-dom"
import MedicalPrescription from "../../Template/PrescriptionDownload"

function Prescriptions() {
    const userId = localStorage.getItem('userId')
    const [loading, setLoading] = useState(false)
    const [allPrescriptions, setAllPrescriptions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [prescriptionData, setPrescriptionData] = useState()
    const [activePres, setActivePres] = useState()
    const [pdfLoading, setPdfLoading] = useState(null)
    async function fetchPrescriptions() {
        setLoading(true)
        try {
            const result = await getSecureApiData(`patient/prescriptions/${userId}?page=${currentPage}`)
            if (result.success) {
                setAllPrescriptions(result?.data)
                setTotalPages(result?.pagination?.totalPages)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrescriptions()
    }, [userId, currentPage])

    const prescriptionRef = useRef()
    const handleDownload = async (item) => {
        setPrescriptionData(item)
        const element = prescriptionRef.current;
        document.body.classList.add("hide-buttons");
        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: "prescriptions.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        try {
            await html2pdf().from(element).set(opt).save().then(() => { document.body.classList.remove("hide-buttons"); });
        } catch (error) {

        }

    };
    return (
        <>

            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <h5 className="heading-grad fz-24 mb-0">Prescriptions</h5>
                </div>
                <div className="all-profile-data-bx">
                    <div className="row ">
                        <div className="col-lg-12">
                            <div className="table-section">
                                <div className="table table-responsive mb-0">
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>Id</th>
                                                <th>Diganosis</th>
                                                <th>Date</th>
                                                <th><span className="text-black">Doctor</span></th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allPrescriptions?.length > 0 ?
                                                allPrescriptions?.map((item, key) =>
                                                    <tr key={key}>
                                                        <td>{key + 1}.</td>
                                                        <td>{item?.prescription?.customId}</td>
                                                        <td>{item?.prescription?.diagnosis}</td>
                                                        <td>{new Date(item?.prescription?.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })
                                                        } </td>
                                                        <td>
                                                            <div className="admin-table-bx new-all-table-box">
                                                                <div className="admin-table-sub-details d-flex align-items-center gap-2">
                                                                    <img src={item?.doctor?.profileImage ? `${base_url}/${item?.doctor?.profileImage}`
                                                                        : "/doctor-timing.png"} alt="" />
                                                                    <div>
                                                                        <h6 className="">Dr. {item?.doctor?.name} </h6>
                                                                        <p>{item?.doctorAbout?.specialty?.name}  {item?.doctorAbout?.hospitalName ? `| ${item?.doctorAbout?.hospitalName}` : ''}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <button onClick={() => {
                                                                    setActivePres(item?.prescription)
                                                                    setPdfLoading(true)
                                                                }} className="thm-btn thm-outline-btn"> <FontAwesomeIcon icon={faFilePdf} style={{ color: "#EF5350" }} /> 
                                                                {(pdfLoading && item?.prescription?.customId == activePres?.customId)?"Downloading...":"Download"} </button>
                                                            </div>

                                                        </td>
                                                    </tr>) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-4 fw-600">
                                                            No prescription found
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {totalPages > 1 && <div className="d-flex text-end gap-2 justify-content-end">
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage == 1} className="nw-thm-btn">Prev</button>
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage == totalPages} className="nw-thm-btn">Next</button>
                    </div>}
                </div>
            </div>

            <div className="d-none">
                {activePres && <MedicalPrescription presId={activePres?._id}
                    endLoading={() => setPdfLoading(false)}
                    pdfLoading={pdfLoading} />}
            </div>

            <div className="text-end mt-4">
                <Link to={-1} className="nw-thm-btn outline">Go Back</Link>
            </div>
        </>
    )
}

export default Prescriptions
