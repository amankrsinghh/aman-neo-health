import React, { useEffect, useRef, useState } from 'react'
import { getSecureApiData, securePostData } from '../../Services/api'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { faDownload, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import Barcode from "react-barcode";
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import base_url from '../../baseUrl'
function ReportDownload({ appointmentId, currentTest, endLoading, pdfLoading }) {
    const reportRef = useRef()
    const [demoData, setDemoData] = useState()
    const [downReport, setDownReport] = useState('')
    const [testId, setTestId] = useState([]);
    const [loading, setLoading] = useState(true)
    const [testData, setTestData] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});

    const { profiles, demographic } = useSelector(state => state.patient)
    const [appointmentData, setAppointmentData] = useState({})
    const fetchAppointmentData = async () => {
        try {
            console.log(appointmentId)
            const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
            if (response.success) {
                setTestId(response.data.testId)
                setAppointmentData(response.data)
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

    // const handleDownload = async () => {
    //     const element = reportRef.current;
    //     document.body.classList.add("hide-buttons");
    //     const opt = {
    //         margin: [0.2, 0.2, 0.2, 0.2],
    //         filename: "report.pdf",
    //         image: { type: "jpeg", quality: 1 },
    //         html2canvas: { scale: 3, useCORS: true },
    //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    //     };
    //     try {

    //         await html2pdf().from(element).set(opt).save().then(() => { document.body.classList.remove("hide-buttons"); });
    //     } catch (error) {

    //     } finally {
    //         if (pdfLoading) {
    //             endLoading()
    //         }
    //         setReportMeta({})

    //     }

    // };
    const handleDownload = () => {
        try {
            const fileUrl = `${base_url}/${downReport?.replace(/\\/g, '/')}`;
            const fileName = fileUrl.split('/').pop();

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName; // this forces download
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            if (pdfLoading) endLoading();
            setReportMeta({});
        }
    };

    useEffect(() => {
        if (Object.keys(reportMeta).length > 0 && testData) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [reportMeta, testData]);

    return (
        <div className='row'>
            <div className="col-lg-12 col-md-12 col-sm-12 m-3" ref={reportRef}>
                <div className="new-invoice-card">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 className="first_para fw-700 fz-20 mb-0">Final Diagnostic Report</h5>
                        </div>
                        <div>
                            <button className="print-btn" onClick={handleDownload}> <FontAwesomeIcon icon={faDownload} /> Download PDF</button>
                        </div>
                    </div>

                    <div className="laboratory-header mb-4">
                        <div className="laboratory-name">
                            <h5>{appointmentData?.labId?.labId?.name || 'Advance Lab Tech'}</h5>
                            <p><span className="laboratory-title">GSTIN :</span> {appointmentData?.labId?.labId?.gstNumber || '09897886454'}</p>
                            {appointmentData?.labStaff &&<p><span className="laboratory-title text-capitalize">Lab Doctor :</span> {appointmentData?.labStaff?.name}</p>}
                        </div>
                        <div className="invoice-details">
                            <p><span className="laboratory-invoice">Invoice :</span> {appointmentData?.customId}</p>
                            <p><span className="laboratory-invoice">Date :</span> {new Date()?.toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 mb-3">
                            <div className="laboratory-bill-bx laboratory-nw-box">
                                <h6>Patient </h6>
                                <h4>{appointmentData?.patientId?.name}</h4>
                                <p><span className="laboratory-phne">ID :</span> {appointmentData?.patientId?.nh12}</p>
                                <p><span className="laboratory-phne">DOB:</span> {new Date(demographic?.dob)?.toLocaleDateString()}</p>
                                <p><span className="laboratory-phne">Gender:</span> {profiles?.gender?.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="laboratory-bill-bx laboratory-sub-bx mb-2">
                                <h6>Order </h6>
                                <p><span className="laboratory-phne">Appointment ID :</span> OID-{appointmentData?.customId}  </p>
                            </div>

                            {appointmentData?.doctorId && <div className="laboratory-bill-bx laboratory-sub-bx">
                                <h6 className="my-0">Doctor</h6>
                                <h4 >{appointmentData?.doctorId?.name}</h4>
                                <p><span className="laboratory-phne">ID :</span> {appointmentData?.doctorId?.nh12}  </p>
                            </div>}                          
                        </div>
                    </div>
                    <div className="laboratory-report-table mt-3">
                        <div className="table table-responsive mb-0 reprt-table">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>Test</th>
                                        <th>Unit</th>
                                        <th>Reference</th>
                                        <th>Result</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testData?.component?.map((cmp, index) => {
                                        const resultObj = allComponentResults[testData._id]?.[index] || {};
                                        return (
                                            <tr key={testData._id + index}>
                                                <td>{testData.shortName} - {cmp.name}</td>
                                                <td>{cmp.unit || "-"}</td>
                                                <td>{cmp.referenceRange || "-"}</td>
                                                <td>{resultObj.result || "-"}</td>
                                                <td className="text-capitalize">{resultObj.status || "-"}</td>
                                            </tr>
                                        );
                                    }
                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="report-remark mt-3">
                        <h6>Remark</h6>
                        <p key={testData._id}>{allComments[testData._id] || "-"}</p>

                    </div>
                    <div className="page-break"></div>
                    <div className="reprt-barcd flex-wrap mt-3">
                        <div className=" barcd-scannr" >
                            <div className="barcd-content">
                                <h4 className="my-3">SP-{testData?._id?.slice(-5)}</h4>
                                <ul className="qrcode-list">
                                    <li className="qrcode-item">Test  <span className="qrcode-title">: {testData?.shortName}</span></li>
                                    <li className="qrcode-item">Draw  <span className="qrcode-title"> : {new Date(reportMeta[testData._id]?.createdAt)?.toLocaleDateString()}</span> </li>
                                </ul>

                                {/* <img src="/barcode.png" alt="" /> */}
                                {/* {console.log(reportMeta[item._id]?.id)} */}
                                <Barcode value={reportMeta[testData._id]?.id} width={1} displayValue={false}
                                    height={60} />

                            </div>
                        </div>
                    </div>
                    <div className="reprt-signature mt-5">
                        <h6>Signature:</h6>
                        <span className="reprt-mark"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportDownload
