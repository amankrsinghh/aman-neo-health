import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCopy,
    faDownload,
    faPaperPlane,
    faPen,
    faPlus,
    faPrint,

    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import Barcode from "react-barcode";
import Loader from "../Common/Loader";
import { getSecureApiData, securePostData } from "../../Service/api";
import API from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function GenerateReport() {
    const { id: appointmentId } = useParams()
    const [addManual, setAddManual] = useState(false);
    const invoiceRef = useRef();
    const [hasLRx, setHasLRx] = useState(false);
    const reportRef = useRef()
    const navigate = useNavigate()
    const compenentRef = useRef()
    const [loading, setLoading] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const [remark, setRemark] = useState('')
    const [isRemark, setIsRemark] = useState(false)
    const [appointmentData, setAppointmentData] = useState({})
    const [demoData, setDemoData] = useState()
    const [testId, setTestId] = useState([]);
    const [testData, setTestData] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [allNames, setAllNames] = useState({});
    const [allReports, setAllReports] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [allTest, setAllTest] = useState([])
    const [fullReportData, setFullReportData] = useState()
    const { hospitalBasic } = useSelector(state => state.user)
    const fetchAppointmentData = async () => {
        try {
            const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
            if (response.success) {

                if (response.data.status === 'deliver-report') {
                    toast.success("Report already delivered for this appointment")
                    return
                } else {
                    toast.success("Appointment Fetched successfully")
                    const subCatIds = response.data.tests.flatMap(item =>
                        item.subCat.map(s => s.subCatId)
                    )
                    setTestId(subCatIds)
                    setAppointmentData(response.data)
                }
                setDemoData(response.demographic)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    const fetchLabTest = async () => {
        try {
            const response = await getSecureApiData(`api/hospital/test/${userId}`);
            if (response.success) {
                setAllTest(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }
    useEffect(() => {
        if (userId) {
            fetchLabTest()
        }
        fetchAppointmentData()
    }, [userId])
    const subtotal = appointmentData?.testId
        ?.reduce((acc, item) => acc + Number(item?.price || 0), 0) || 0;

    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    const fetchTestReport = async (testId) => {
        try {
            const payload = { subCatId: testId, appointmentId: appointmentData?._id };
            const response = await securePostData('api/hospital/test-report', payload);

            if (response.success && response.data) {
                setFullReportData(response.data)
                if (response.data.remark) {
                    setIsRemark(true)
                    setRemark(response.data.remark)
                }
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
                    const response = await getSecureApiData(`api/comman/sub-test-category-data/${id?._id}`);
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
                                    status: comp?.status || "",
                                };
                            });
                            // Set results and comments keyed by test._id
                            setAllComponentResults(prev => ({ ...prev, [test._id]: mergedResults }));
                            setAllComments(prev => ({ ...prev, [test._id]: report?.upload?.comment || "" }));
                            setAllNames(prev => ({ ...prev, [test._id]: report.name || "" }));


                        } else {
                            // If no report found, initialize empty for this test
                            setAllComponentResults(prev => ({ ...prev, [test._id]: {} }));
                            setAllComments(prev => ({ ...prev, [test._id]: "" }));
                            setAllNames(prev => ({ ...prev, [test._id]: "" }));
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



    const reportDownload = () => {
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


    const handleSave = async (e) => {
        e.preventDefault();

        setLoading(true);
        // Loop through each test (key is testId)
        for (const testId in allComponentResults) {
            // Find the test details (component titles, units, etc.)
            const testItem = testData.find(t => t._id === testId);
            if (!testItem) continue;

            // Build components array for API
            const components = testItem.component.map((comp, index) => ({
                cmpId: comp._id,
                result: allComponentResults[testId]?.[index]?.result || ""
            }));
            // const payload = {
            //     labId: userId,
            //     patientId: appointmentData.patientId,
            //     testId,
            //     appointmentId: appointmentData._id,
            //     component: components,manual:{comment:allComments?.[testId],
            //         name:allNames?.[testId]
            //     },
            //     remark
            // };
            const formData = new FormData();
            formData.append('labId', userId)
            formData.append('patientId', appointmentData.patientId?._id)
            formData.append('subCatId', testId)
            formData.append('appointmentId', appointmentData._id)
            formData.append('remark', remark)
            formData.append('component', JSON.stringify(components))
            formData.append('manualComment', allComments?.[testId] || "")
            formData.append('manualName', allNames?.[testId] || "")
            formData.append('report', allReports?.[testId] || "")

            try {
                const response = await securePostData("api/hospital/test-report", formData);

                if (response.success) {
                    toast.success(`Report saved for test `);
                } else {
                    toast.error(response.message);
                }
            } catch (err) {
                console.error("Error saving report:", err);
                toast.error(err?.response?.data?.message);
            } finally {
                setLoading(false);
                navigate(`/view-report/${appointmentData?._id}`)
            }
        }
    };
    const sendReport = async (appointmentId, email, type) => {
        const data = { appointmentId, email, type }
        try {
            const response = await securePostData(`lab/send-report`, data);
            if (response.success) {
                toast.success("Report sent")
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");;
        }
    }





    return (
        <>
            {loading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div className="row mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="innr-title">Report</h3>
                                <div className="admin-breadcrumb">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb custom-breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="#" className="breadcrumb-link">
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li
                                                className="breadcrumb-item active"
                                                aria-current="page"
                                            >
                                                Reports
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="lab-chart-crd">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="lab-tp-title patient-bio-tab lab-profile-bio-tab">
                                    <div>
                                        <h6 className="mb-0">Report</h6>
                                    </div>
                                </div>
                                <div className="patient-bio-tab patient-edit-bio-tab employee-tabs">

                                    <form onSubmit={handleSave} >
                                        <div className="sub-tab-brd">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="new-invoice-card mb-3">
                                                        <div className="">
                                                            <ul className="appointment-booking-list">
                                                                <li className="appoint-item"> Appointment Book Date : <span className="appoint-title">{new Date(appointmentData?.createdAt)?.toLocaleDateString(('en-GB'))}</span></li>
                                                                <li className="appoint-item"> Visited  date : <span className="appoint-title">{new Date(appointmentData?.date)?.toLocaleDateString(('en-GB'))}</span></li>
                                                                <li className="appoint-item"> Appointment Completed date : <span className="appoint-title">{appointmentData?.status == 'deliver-report' ?
                                                                    new Date(appointmentData?.updatedAt)?.toLocaleDateString(('en-GB')) : '-'}</span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="new-invoice-card">
                                                        {testData?.map((item, key) =>
                                                            <div className="sub-tab-brd mb-3" key={key}>
                                                                <div className="custom-frm-bx">
                                                                    <label htmlFor="">{item?.shortName}</label>
                                                                    <input type="text" className="form-control" placeholder={item?.shortName}
                                                                        value={allNames[item?._id]}
                                                                        onChange={(e) =>
                                                                            setAllNames(prev => ({
                                                                                ...prev,
                                                                                [item?._id]: e.target.value
                                                                            }))
                                                                        } />
                                                                </div>
                                                                <div className="custom-frm-bx">
                                                                    <label htmlFor="">Upload report</label>
                                                                    <div className="upload-box p-3 nw-upload-bx   justify-content-center ">
                                                                        <div className="upload-icon mb-2">
                                                                            <IoCloudUploadOutline />
                                                                        </div>
                                                                        <div>
                                                                            <p className="fw-semibold mb-1">
                                                                                <label htmlFor={`fileInput-${item?._id}`} className="file-label file-select-label">
                                                                                    Choose a file or drag & drop here
                                                                                </label>
                                                                            </p>
                                                                            {/* <small className="format-title">JPEG Format</small> */}
                                                                            <div className="mt-3">
                                                                                <label htmlFor={`fileInput-${item?._id}`} className="browse-btn">
                                                                                    Browse File
                                                                                </label>
                                                                            </div>
                                                                            <input
                                                                                type="file"
                                                                                onChange={(e) =>
                                                                                    setAllReports(prev => ({
                                                                                        ...prev,
                                                                                        [item?._id]: e.target.files[0]
                                                                                    }))
                                                                                }
                                                                                className="d-none"
                                                                                id={`fileInput-${item?._id}`}
                                                                            // accept=".png,.jpg,.jpeg"
                                                                            />
                                                                            {allReports[item?._id] && (
                                                                                <p className="mt-2 text-success fw-semibold">
                                                                                    {allReports[item?._id].name}
                                                                                </p>
                                                                            )}
                                                                            <div id="filePreviewWrapper" className="d-none mt-3">
                                                                                <img src="" alt="Preview" className="img-thumbnail" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="custom-frm-bx">
                                                                    <label htmlFor="">  Note
                                                                    </label>
                                                                    <textarea value={allComments[item?._id]}
                                                                        onChange={(e) =>
                                                                            setAllComments(prev => ({
                                                                                ...prev,
                                                                                [item?._id]: e.target.value
                                                                            }))
                                                                        }
                                                                        name="comment" id="" className="form-control"></textarea>
                                                                </div>
                                                            </div>)}

                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                    <div className="new-invoice-card">
                                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                                            <div>
                                                                <h5 className="first_para fw-700 fz-20 mb-0">Final Diagnostic Report</h5>
                                                            </div>
                                                        </div>
                                                        <div className="laboratory-header mb-4">
                                                            <div className="laboratory-name">
                                                                <h5>{hospitalBasic?.hospitalName}</h5>
                                                                <p><span className="laboratory-title">GSTIN :</span> {hospitalBasic?.gstNumber}</p>
                                                                {appointmentData?.staff && <p><span className="laboratory-title">Lab Doctor :</span> {appointmentData?.staff?.name}</p>}
                                                            </div>
                                                            {/* <div className="invoice-details">
                                                                <p className="text-end"><span className="laboratory-invoice">Report ID :</span> RE-89767</p>
                                                                <p className="text-end"><span className="laboratory-invoice">Generated ID :</span> 25-11-03  08:07</p>
                                                            </div> */}
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-6 mb-3">
                                                                <div className="laboratory-bill-bx laboratory-nw-box">
                                                                    <h6>Patient </h6>
                                                                    <h4>{appointmentData?.patientId?.name}</h4>
                                                                    <p><span className="laboratory-phne">ID :</span> {appointmentData?.patientId?.nh12}</p>
                                                                    <p><span className="laboratory-phne">DOB:</span>{new Date(demoData?.dob)?.toLocaleDateString(('en-GB'))}</p>
                                                                    <p><span className="laboratory-phne">Gender:</span> {appointmentData?.patientId?.patientId?.gender}</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="laboratory-bill-bx laboratory-sub-bx mb-2">
                                                                    <h6>Order </h6>
                                                                    <p><span className="laboratory-phne">Appointment ID :</span> {appointmentData?.customId}  </p>
                                                                </div>

                                                                {appointmentData?.doctorId && <div className="laboratory-bill-bx laboratory-sub-bx">
                                                                    <h6 className="my-0">Doctor </h6>
                                                                    <h4>Dr. {appointmentData?.doctorId?.name}</h4>
                                                                    <p><span className="laboratory-phne"> ID :</span> {appointmentData?.doctorId?.nh12}  </p>
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
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {testData.map((item) =>
                                                                            item.component.map((c, i) => {
                                                                                const selectedResultValue = allComponentResults[item?._id]?.[i]?.result || "";
                                                                                // Find the option object for the selected value
                                                                                const selectedOption = c?.optionType == 'select' ? c.result?.find(r => r.value === selectedResultValue)?.note : c.textResult;

                                                                                return (
                                                                                    <>
                                                                                        <tr key={i}>
                                                                                            <td>{item?.shortName} - {c?.title}</td>
                                                                                            <td>{c?.unit}</td>
                                                                                            <td>{c?.optionType === 'text' ? `${c?.minRange}-${c?.maxRange}` : 'Positive-Negative'}</td>
                                                                                            <td>
                                                                                                <div className="custom-frm-bx mb-0">
                                                                                                    {c?.optionType === 'text' ? (
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            required
                                                                                                            className="form-control"
                                                                                                            value={allComponentResults[item?._id]?.[i]?.result || ""}
                                                                                                            onChange={(e) =>
                                                                                                                setAllComponentResults(prev => ({
                                                                                                                    ...prev,
                                                                                                                    [item?._id]: {
                                                                                                                        ...prev[item?._id],
                                                                                                                        [i]: {
                                                                                                                            ...prev[item?._id]?.[i],
                                                                                                                            result: e.target.value
                                                                                                                        }
                                                                                                                    }
                                                                                                                }))
                                                                                                            }
                                                                                                            placeholder="Enter"
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <select
                                                                                                            className="form-select"
                                                                                                            required
                                                                                                            value={selectedResultValue}
                                                                                                            onChange={(e) =>
                                                                                                                setAllComponentResults(prev => ({
                                                                                                                    ...prev,
                                                                                                                    [item?._id]: {
                                                                                                                        ...prev[item?._id],
                                                                                                                        [i]: {
                                                                                                                            ...prev[item?._id]?.[i],
                                                                                                                            result: e.target.value
                                                                                                                        }
                                                                                                                    }
                                                                                                                }))
                                                                                                            }
                                                                                                        >
                                                                                                            <option value="">---Select status---</option>
                                                                                                            <option value="Positive">Positive</option>
                                                                                                            <option value="Negative">Negative</option>
                                                                                                        </select>
                                                                                                    )}
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        {/* <tr>
                                                                                            <td colSpan="4">
                                                                                                <span className="fw-600">Note: </span>{selectedOption || "-"}
                                                                                            </td>
                                                                                        </tr> */}

                                                                                    </>
                                                                                );
                                                                            })
                                                                        )}

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="report-remark mt-3">
                                                            <h6>Remark {(!isRemark || remark) && <button type="button" onClick={() => setIsRemark(true)} className="edit-btn text-black"><FontAwesomeIcon icon={faPen} /></button>}</h6>
                                                            {isRemark && <textarea rows={5} className="w-100" value={remark}
                                                                onChange={(e) => setRemark(e.target.value)} />}
                                                            <p>-</p>
                                                        </div>

                                                        {appointmentData?.doctorId && <div className="laboratory-bill-bx">
                                                            <h6>Lab tests prescribed by the doctor</h6>
                                                            <h4>Dr.{appointmentData?.doctorId?.name}</h4>
                                                            <p><span className="laboratory-phne">ID :</span>{appointmentData?.doctorId?.nh12}</p>
                                                        </div>}

                                                        <div className="reprt-barcd mt-3">
                                                            {testData?.map((item, key) =>
                                                                <div className="barcd-scannr" key={key}>
                                                                    <div className="barcd-content">
                                                                        <h4 className="my-3">SP-{item?._id?.slice(-5)}</h4>
                                                                        <ul className="qrcode-list">
                                                                            <li className="qrcode-item">Test  <span className="qrcode-title">: {item?.shortName}</span></li>
                                                                            <li className="qrcode-item">Draw  <span className="qrcode-title"> : {new Date(appointmentData?.createdAt)?.toLocaleDateString(('en-GB'))}</span> </li>
                                                                        </ul>

                                                                        {/* <img src="/barcode.png" alt="" /> */}
                                                                        <Barcode value={`${appointmentData?.customId}?test=${testData?._id}`} width={1} displayValue={false}
                                                                            height={60} />
                                                                    </div>
                                                                    <div className="barcode-id-details">
                                                                        <div>
                                                                            <h6>Patient Id </h6>
                                                                            <p>PS-{appointmentData?.patientId?.nh12}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h6>Appointment ID </h6>
                                                                            <p>{appointmentData?.customId}</p>
                                                                        </div>
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

                                        <div className="d-flex justify-content-between mt-3" >
                                            <button type="button" onClick={() => navigate('/test-report-appointment')}
                                                className="nw-thm-btn outline rounded-4">Go Back</button>

                                            <button type="submit" className="nw-thm-btn rounded-4">Submit</button>
                                        </div>



                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>}



        </>
    )
}

export default GenerateReport