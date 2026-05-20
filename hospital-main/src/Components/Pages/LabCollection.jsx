import { faCircleXmark, faPrint } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSecureApiData, securePostData } from "../../Service/api";
import Barcode from "react-barcode";
import Loader from "../Common/Loader";
import { toast } from "react-toastify";
import LabSampleReceipt from "../../All Template file/Lab Sample Collection Receipt";

function LabCollection() {
    const params = useParams()
    const componentRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const appointmentId = params.id
    const [demoData, setDemoData] = useState()
    const [testId, setTestId] = useState([]);
    const [testData, setTestData] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [selectedSample, setSelectedSample] = useState()
    const [sampleForm, setSampleForm] = useState({ sampleContainer: '', condition: '', resultExpected: '', storageDetail: '' })
    const [pdfLoading, setPdfLoading] = useState(false)
    const [appointmentData, setAppointmentData] = useState({})
    const fetchAppointmentData = async () => {
        setIsLoading(true)
        try {
            const response = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
            if (response.success) {
                const subCatIds = response.data.tests.flatMap(item =>
                    item.subCat.map(s => s.subCatId)
                )
                setTestId(subCatIds)
                setAppointmentData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchAppointmentData()
    }, [appointmentId])
    const fetchTestReport = async (testId) => {
        try {
            const payload = { subCatId: testId, appointmentId };
            const response = await securePostData('lab/test-report-data', payload);

            if (response.success && response.data) {
                setReportMeta(prev => ({
                    ...prev,
                    [testId]: {
                        id: response.data._id,
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
            setIsLoading(true);

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
            setIsLoading(false);
            setTestData(allTests);
        };

        fetchTestsOneByOne();
    }, [testId]);

    async function addSample(e) {
        e.preventDefault()
        const data = { ...sampleForm, forTestId: selectedSample?._id, patientId: appointmentData?.patientId?._id, appointmentId: appointmentData?._id }

        try {
            const res = await securePostData(`appointment/lab/sample`, data)
            if (res.success) {
                const res = await getSecureApiData(`lab/appointment-data/${appointmentId}`)
                if (res.success) {
                    const subCatIds = res.data.tests.flatMap(item =>
                        item.subCat.map(s => s.subCatId)
                    )
                    setTestId(subCatIds)
                    setAppointmentData(res.data)
                } else {
                    toast.error(res.message)
                }
                toast.success(`${selectedSample?.subCategory} sample data saved`)
                document.getElementById('closeSample')?.click()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <>
            {isLoading ? <Loader />
                : <div className="main-content flex-grow-1 p-3 overflow-auto">
                    <div>
                        <div className="row mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h3 className="innr-title mb-2">Collection</h3>
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
                                                    Collection
                                                </li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div>
                                    <button className="nw-thm-btn" onClick={() => setPdfLoading(true)} disabled={pdfLoading}>{pdfLoading ? 'Downloading...' : 'Download'}</button>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="new-panel-card">
                        <div className="row">
                            <div ref={componentRef} className="row">
                                {testData?.map((item, key) =>
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3" key={key}>
                                        <div className="new-invoice-card" >
                                            <div>
                                                <h5 className="first_para fw-700 fz-20 text-capitalize">{item?.packageType} Plan</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3" >
                                                    <div className="laboratory-bill-bx">
                                                        <p><span className="laboratory-phne">Code :</span> {item?.code}</p>
                                                        <p><span className="laboratory-phne">Test :</span> {item?.shortName}</p>
                                                        <p><span className="laboratory-phne text-capitalize">Category :</span> {item?.category?.name}</p>
                                                        <p><span className="laboratory-phne">Special Approval :</span> {item?.specialApproval ? 'Yes' : 'No'}</p>
                                                        <p><span className="laboratory-phne text-capitalize">Fasting :</span> {item?.fastingRequired ? 'Yes' : 'No'}</p>
                                                    </div>
                                                    <h5>Sample</h5>
                                                    {item?.sample?.map((s, k) =>
                                                        <ul className="appointment-booking-list">
                                                            <li className="appoint-item"> Type : <span className="appoint-title">{s?.type}</span></li>
                                                            <li className="appoint-item"> Volume : <span className="appoint-title">{s?.volume}</span></li>

                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                            {appointmentData?.samples?.some(s => s?.toString() === item?._id?.toString()) ? <div className="mt-3" >
                                                <button disabled className="nw-thm-btn">Collected</button>
                                            </div> :
                                                <div className="mt-3" >
                                                    <button onClick={() => setSelectedSample(item)} data-bs-toggle="modal" data-bs-target="#collectSample" className="nw-thm-btn outline">Collect</button>
                                                </div>}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="text-end mt-5">
                        <Link to={-1} className="nw-thm-btn rounded-3 outline" >
                            Go Back
                        </Link>
                    </div>
                </div>}
            <div className="modal step-modal fade" id="collectSample" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content rounded-5">
                        <div className="d-flex align-items-center justify-content-between popup-nw-brd px-4 py-3">
                            <div>
                                <h6 className="lg_title mb-0">Sample for {selectedSample?.subCategory}</h6>
                            </div>
                            <div>
                                <button type="button" className="" id="closeSample" data-bs-dismiss="modal" aria-label="Close" style={{ color: "#00000040" }}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body px-4">
                            <div className="row ">
                                <form onSubmit={addSample} className="col-lg-12">
                                    <div className="text-center ">
                                        <div className="model-permission-bx">
                                            <img src="/admin-lab.png" alt="" />
                                        </div>
                                    </div>

                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Container</label>
                                        <input type="text" value={sampleForm?.sampleContainer}
                                            onChange={(e) => setSampleForm({
                                                ...sampleForm,
                                                sampleContainer: e.target.value
                                            })} className="form-control" placeholder="Purple Tube" />
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Condition</label>
                                        <input type="text" value={sampleForm?.condition}
                                            onChange={(e) => setSampleForm({
                                                ...sampleForm,
                                                condition: e.target.value
                                            })} className="form-control" placeholder="Good" />
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Storage Detail</label>
                                        <textarea rows={3} type="text" value={sampleForm?.storageDetail}
                                            onChange={(e) =>
                                                setSampleForm({
                                                    ...sampleForm,
                                                    storageDetail: e.target.value
                                                })} className="form-control" placeholder="4°C —Refrigerated" />
                                    </div>
                                    <div className="custom-frm-bx">
                                        <label htmlFor="">Result Expected</label>
                                        <input type="text" value={sampleForm?.resultExpected}
                                            onChange={(e) => setSampleForm({
                                                ...sampleForm,
                                                resultExpected: e.target.value
                                            })} className="form-control" placeholder="4 hours" />
                                    </div>


                                    <div>
                                        <button type="submit" className="nw-thm-btn w-100"> Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-none">
                <LabSampleReceipt appointmentId={appointmentId} pdfLoading={pdfLoading} endLoading={() => setPdfLoading(false)} />
            </div>
        </>
    )
}

export default LabCollection