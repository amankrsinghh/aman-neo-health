import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faDownload, faShareNodes } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { getSecureApiData, securePostData } from "../../Services/api"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import html2canvas from "html2canvas"
import html2pdf from "html2pdf.js"
import Barcode from "react-barcode"
import base_url from "../../baseUrl"

function DoctorReportView() {
    const reportRef = useRef()
    const params = useParams()
    const appointmentId = params.id
    const currentTest = params.currentTest
    const [demoData, setDemoData] = useState()
    const [downReport, setDownReport] = useState('')
    const [testId, setTestId] = useState([]);
    const [loading, setLoading] = useState(true)
    const [testData, setTestData] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [demographic, setDemographic] = useState()
    const [appointmentData, setAppointmentData] = useState({})
    const fetchAppointmentData = async () => {
        try {
            const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
            if (response.success) {
                setTestId(response.data.testId)
                setAppointmentData(response.data)
                setDemographic(response.demographic)
                setLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchAppointmentData()
    }, [appointmentId])
    const fetchTestReport = async (testId) => {
        try {
            const payload = { testId, appointmentId };
            const response = await securePostData('lab/test-report-data', payload);

            if (response.success && response.data) {
                setReportMeta(prev => ({
                    ...prev,
                    [testId]: {
                        id: response.data?._id,
                        createdAt: response.data.createdAt
                    }
                }));
                setDownReport(response.data.upload.report)
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            console.error(`Error fetching report for test ${testId}:`, err);
            return null;
        }
    };
    useEffect(() => {
        if (!currentTest) return;

        const fetchCurrentTest = async () => {
            try {
                const response = await getSecureApiData(`lab/test-data/${currentTest}`);
                if (!response.success) {
                    toast.error(response.message);
                    return;
                }

                const test = response.data;

                // Fetch report
                const report = await fetchTestReport(test._id);

                let mergedResults = {};
                if (report) {
                    test.component.forEach((c, i) => {
                        const comp = report.component.find(rc => rc.cmpId === c._id);
                        mergedResults[i] = {
                            result: comp?.result || "",
                            status: comp?.status || ""
                        };
                    });
                    setAllComments({ [test._id]: report.comment || "" });
                } else {
                    mergedResults = {};
                    setAllComments({ [test._id]: "" });
                }

                setAllComponentResults({ [test._id]: mergedResults });
                setTestData(test);

            } catch (err) {
                console.error(err);
            }
        };

        fetchCurrentTest();
    }, [currentTest]);

    const handleDownload = async () => {
        const element = reportRef.current;
        document.body.classList.add("hide-buttons");
        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: "report.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        try {

            await html2pdf().from(element).set(opt).save().then(() => { document.body.classList.remove("hide-buttons"); });
        } catch (error) {

        } finally {


        }

    };
    return (
        <>


            <div className="profile-right-card">
                <div className="profile-tp-header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h5 className="heading-grad fz-24 mb-0">Report view</h5>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="text-black fz-18"> <FontAwesomeIcon icon={faShareNodes} /> </button>
                            <button className="text-black fz-18"> <FontAwesomeIcon icon={faDownload} /> </button>
                        </div>
                    </div>

                </div>
                <div className="all-profile-data-bx">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center">
                                {downReport?.toLowerCase().endsWith('.pdf') ? (

                                    <iframe
                                        src={`${base_url}/${downReport}`}

                                        title="Test Report"
                                    />
                                ) : (

                                    <img
                                        // src={`${base_url}/${downReport}`}
                                        src="/report-pic.png"

                                        alt="Test"
                                        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                )}
                            </div>

                        </div>

                    </div>

                </div>
            </div>






        </>
    )
}

export default DoctorReportView