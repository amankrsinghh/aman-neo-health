import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import html2canvas from "html2canvas"
import html2pdf from "html2pdf.js"
import { toast } from "react-toastify"
import { getSecureApiData, securePostData } from "../../Service/api"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Barcode from "react-barcode"
import API from "../../api/api"
import LabReportPdf from "../../All Template file/Lab report file/Lab report"

function ReportView() {
    const params = useParams()
    const reportRef = useRef()
    const navigate = useNavigate()
    const appointmentId = params.id
    const [demoData, setDemoData] = useState()
    const [testId, setTestId] = useState([]);
    const [loading, setLoading] = useState(true)
    const [testData, setTestData] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [fullReportData, setFullReportData] = useState()
    const [hospitalBasic, setHospitalBasic] = useState()
    const [pdfLoading,setPdfLoading]=useState(false)
    const [appointmentData, setAppointmentData] = useState({})
    const fetchAppointmentData = async () => {
        try {
            const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
            if (response.success) {
                const subCatIds = response.data.tests.flatMap(item =>
                        item.subCat.map(s => s.subCatId)
                    )
                setTestId(subCatIds)
                setAppointmentData(response.data)
                setLoading(false)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const fetchPtData = async () => {
        if (!appointmentData?.patientId?._id) {
            return
        }
        try {
            const response = await getSecureApiData(`patient/demographic/${appointmentData?.patientId?._id}`)
            if (response.success) {
                setDemoData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchAppointmentData()
        loadProfile()
    }, [appointmentId])
    useEffect(() => {
        fetchPtData()
    }, [appointmentData])
    const fetchTestReport = async (testId) => {
        try {
            const payload = { subCatId: testId, appointmentId };
            const response = await securePostData('lab/test-report-data', payload);

            if (response.success && response.data) {
                setFullReportData(response.data)
                setReportMeta(prev => ({
                    ...prev,
                    [testId]: {
                        id: response.data?._id,
                        createdAt: response.data.createdAt
                    }
                }));
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
        const fetchTestsOneByOne = async () => {
            if (testId.length === 0) return;
            const allTests = [];

            for (const id of testId) {
                try {
                    const response = await getSecureApiData(`api/comman/sub-test-category-data/${id._id}`);
                    if (response.success) {
                        const test = response.data;

                        // Fetch report for this test
                        const report = await fetchTestReport(test._id);

                        if (report) {
                            const mergedResults = {};
                            test.component.forEach((c, i) => {
                                const comp = report.component.find(rc => rc.cmpId === c._id);
                                mergedResults[i] = {
                                    result: comp?.result || "",
                                    textResult: comp?.textResult || '',
                                    status: comp?.status || "",
                                };
                            });
                            // Set results and comments keyed by test._id
                            setAllComponentResults(prev => ({ ...prev, [test._id]: mergedResults }));
                            setAllComments(prev => ({ ...prev, [test._id]: report.upload.comment || "" }));


                        } else {
                            // If no report found, initialize empty for this test
                            setAllComponentResults(prev => ({ ...prev, [test._id]: {} }));
                            setAllComments(prev => ({ ...prev, [test._id]: "" }));
                        }

                        allTests.push(test);
                    } else {
                        toast.error(response.message);
                    }
                } catch (err) {
                    console.error(`Error fetching test ${id}:`, err);
                }
            }

            setTestData(allTests);
        };

        fetchTestsOneByOne();
    }, [testId]);
    const handleDownload = () => {
        const element = reportRef.current;

        document.body.classList.add("hide-buttons");

        const opt = {
            margin: [0.2, 0.2, 0.2, 0.2],
            filename: "report.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        };

        html2pdf()
            .from(element)
            .set(opt)
            .save()
            .then(() => {
                document.body.classList.remove("hide-buttons");
            });
    };
    async function loadProfile() {
        try {
            const res = await API.get("/hospital/get-hospital-profile");
            setHospitalBasic(res.data.profile?.basic);
        } catch (err) {
            console.log("Profile Load Error:", err);
        }
    }
    return (
        <>
            <div className="main-content flex-grow-1 p-3 overflow-auto">
                <form action="">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title mb-2">Report view</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol class="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    Test  Request
                                                </a>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Report view
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>


                <div className="submega-main-bx">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                            <div className="new-invoice-card h-100">
                                <div className="">
                                    <ul className="appointment-booking-list">
                                        <li className="appoint-item"> Appointment Book Date : <span className="appoint-title">{new Date(appointmentData?.createdAt)?.toLocaleDateString(('en-GB'))}</span></li>
                                        <li className="appoint-item"> Visited  date : <span className="appoint-title">{new Date(appointmentData?.date)?.toLocaleDateString(('en-GB'))}</span></li>
                                        <li className="appoint-item"> Appointment Completed date : <span className="appoint-title">{appointmentData?.status == 'deliver-report' ?
                                            new Date(appointmentData?.updatedAt)?.toLocaleDateString(('en-GB')) : '-'}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3" ref={reportRef}>
                            <div className="new-invoice-card">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <h5 className="first_para fw-700 fz-20 mb-0">Final Diagnostic Report</h5>
                                    </div>
                                    <div>
                                        <button className="print-btn" disabled={pdfLoading} onClick={()=>setPdfLoading(true)}> 
                                            <FontAwesomeIcon icon={faDownload} /> {pdfLoading?'Downloading...':'Download'} PDF</button>
                                    </div>
                                </div>
                                <div className="laboratory-header mb-4">
                                    <div className="laboratory-name">
                                        <h5>{hospitalBasic?.hospitalName}</h5>
                                        <p><span className="laboratory-title">GSTIN :</span> {hospitalBasic?.gstNumber}</p>
                                    </div>
                                    <div className="invoice-details">
                                        <p><span className="laboratory-invoice">Invoice :</span> {appointmentData?.customId}</p>
                                        <p><span className="laboratory-invoice">Date :</span> {new Date()?.toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <div className="nw-laboratory-bill-bx laboratory-nw-box">
                                            <h6>Patient </h6>
                                            <h4>{appointmentData?.patientId?.name}</h4>
                                            <p><span className="laboratory-phne">ID :</span> {appointmentData?.patientId?.nh12}</p>
                                            <p><span className="laboratory-phne">DOB:</span> {new Date(demoData?.dob)?.toLocaleDateString()}</p>
                                            <p><span className="laboratory-phne">Gender:</span> {appointmentData?.patientId?.patientId?.gender?.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="nw-laboratory-bill-bx laboratory-sub-bx mb-2">
                                            <h6 className="no-print">Order </h6>
                                            <p><span className="laboratory-phne">Appointment ID :</span> {appointmentData?.customId}  </p>
                                        </div>

                                        {appointmentData?.doctorId && <div className="nw-laboratory-bill-bx laboratory-sub-bx">
                                            <h6 className="my-0">Lab tests prescribed by the doctor</h6>
                                            <h4 >{appointmentData?.doctorId?.name}</h4>
                                            <p><span className="laboratory-phne">ID :</span> {appointmentData?.doctorId?.nh12}  </p>
                                        </div>}
                                    </div>
                                </div>
                                <div className="nw-laboratory-report-table mt-3">
                                    <div className="table table-responsive mb-0 reprt-table">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Test</th>
                                                    <th>Unit</th>
                                                    <th>Reference</th>
                                                    <th>Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testData.map((test) =>
                                                    test.component.map((cmp, index) => {
                                                        const resultObj = allComponentResults[test._id]?.[index] || {};


                                                        return (
                                                            <React.Fragment key={test._id + index}>
                                                                {/* MAIN ROW */}
                                                                <tr>
                                                                    <td>{test.shortName} - {cmp.name}</td>
                                                                    <td>{cmp.unit || "-"}</td>
                                                                    <td>{cmp?.optionType === 'text' ? `${cmp?.minRange} - ${cmp?.maxRange}` : 'Positive-Negative'}</td>
                                                                    <td>
                                                                        {resultObj.result}
                                                                    </td>
                                                                </tr>

                                                                {/* NOTE FULL ROW */}
                                                               
                                                            </React.Fragment>
                                                        );
                                                    })
                                                )}
                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                                <div className="report-remark mt-3">
                                    <h6>Remark</h6>
                                    {fullReportData?.remark}
                                </div>
                                <div className="page-break"></div>
                                <div className="reprt-barcd flex-wrap mt-3">
                                    {testData?.map((item, key) =>
                                        <div className=" barcd-scannr" key={key}>
                                            <div className="barcd-content">
                                                <h4 className="my-3">{item?._id?.slice(-5)}</h4>
                                                <ul className="qrcode-list">
                                                    <li className="qrcode-item">Test  <span className="qrcode-title">: {item?.shortName}</span></li>
                                                    <li className="qrcode-item">Draw  <span className="qrcode-title"> : {new Date(reportMeta[item._id]?.createdAt)?.toLocaleDateString()}</span> </li>
                                                </ul>

                                                {/* <img src="/barcode.png" alt="" /> */}
                                                {/* {console.log(reportMeta[item._id]?.id)} */}
                                                <Barcode value={reportMeta[item._id]?.id} width={1} displayValue={false}
                                                    height={60} />

                                            </div>
                                        </div>)}
                                </div>
                                <div className="reprt-signature mt-5">
                                    <h6>Signature:</h6>
                                    <span className="reprt-mark"></span>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                <div className="text-end mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="nw-thm-btn outline"
                    >
                        Go Back
                    </button>
                </div>
                <div className="d-none">
                    <LabReportPdf appointmentId={appointmentId} pdfLoading={pdfLoading} endLoading={()=>setPdfLoading(false)}/>
                </div>

            </div>
        </>
    )
}

export default ReportView