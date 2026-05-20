import { useEffect, useRef, useState } from "react";
import { getApiData, getSecureApiData, securePostData } from "../../Service/api";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateAge } from "../../Service/globalFunction";
import base_url from "../../baseUrl";
import html2pdf from "html2pdf.js";

const NeoHealthCardLabTemplates = ({ appointmentId, pdfLoading, endLoading }) => {
    const [isReady, setIsReady] = useState(false);
    const [userData, setUserData] = useState()
    const [patientData, setPatientData] = useState()
    const [testReport, setTestReport] = useState()
    const [testData, setTestData] = useState([]);
    const [testId, setTestId] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [fullReportData, setFullReportData] = useState()
    const downloadInvoice = useRef(null);
    const [isRemark, setIsRemark] = useState(false)
    const { hospitalBasic,  hospitalAddress,  paymentInfo,
      } = useSelector(state => state.user)

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
            } else {
                toast.error(response.message)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchAppointmentData()
    }, [appointmentId])
    useEffect(() => {
        if (testData.length > 0 && patientData && appointmentData) {
            setIsReady(true);
        }
    }, [testData, patientData, appointmentData]);
    // Calculate subtotal, GST and total
    // const subtotal = appointmentData?.testId
    //     ?.reduce((acc, item) => acc + Number(item?.price || 0), 0) || 0;

    // const gst = subtotal * 0.05;
    // const total = subtotal + gst;

    async function fetchPatientData() {
        try {
            const res = await getApiData(`patient/${appointmentData?.patientId?._id}`)
            if (res.success) {
                setPatientData(res.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        if (appointmentData?.patientId?._id) {

            fetchPatientData()
        }
    }, [appointmentData])
    const fetchTestReport = async (testId) => {
        try {
            const payload = {subCatId: testId, appointmentId };
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
    const lab = {
        name: 'Nova Diagnostics Center',
        location: '221B King Street, London, UK',
        phone: '+44 20 5555 1122',
        email: 'support@novadiagnostics.com',
        accreditations: 'ISO 15189 • CAP Aligned • Digital Report Verified',
        logoText: 'ND',
    };

    const patient = {
        name: 'Sara Ahmed',
        age: '32 Years',
        sex: 'Female',
        patientId: 'NHC-P-2048-9931',
        doctorId: 'NHC-D-1182-4401',
        doctorName: 'Dr. Michael Rowan',
        labId: 'NHC-L-7702-AB19',
        accessionNo: 'ACC-2026-03-11872',
        sampleId: 'SMP-882741',
        referredBy: 'Dr. Michael Rowan',
        collectedAt: '18 Mar 2026, 09:20',
        reportedAt: '18 Mar 2026, 14:45',
        dob: '14 Jul 1993',
    };



    const billItems = [
        { code: 'CBC001', service: 'Complete Blood Count', qty: 1, rate: 28.0, discount: 0.0 },
        { code: 'BIO012', service: 'Fasting Glucose', qty: 1, rate: 12.0, discount: 0.0 },
        { code: 'BIO033', service: 'Creatinine', qty: 1, rate: 16.0, discount: 1.0 },
        { code: 'PKG105', service: 'Wellness Collection Fee', qty: 1, rate: 8.0, discount: 0.0 },
    ];

    const subtotal = billItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const totalDiscount = billItems.reduce((sum, item) => sum + item.discount, 0);
    const taxes = 4.86;
    const grandTotal = subtotal - totalDiscount + taxes;

    const badgeStyle = (flag) => {
        if (flag === 'high') return 'bg-rose-50 text-rose-700 border border-rose-200';
        if (flag === 'low') return 'bg-amber-50 text-amber-700 border border-amber-200';
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    };

    const valueStyle = (flag) => {
        if (flag === 'positive') return 'text-rose-700 font-semibold';
        if (flag === 'negative') return 'text-amber-700 font-semibold';
        return 'text-slate-900';
    };
    const handleDownload = async () => {
        try {
            const element = downloadInvoice.current;

            document.body.classList.add("hide-buttons");

            // wait for render
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const opt = {
                margin: 0,
                filename: `invoice-${appointmentData?.customId}.pdf`,
                html2canvas: {
                    scale: 3,
                    useCORS: true
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                }
            };

            await html2pdf().from(element).set(opt).save();

            document.body.classList.remove("hide-buttons");
        } catch (error) {
            console.log(error)
        } finally {
            if (pdfLoading) endLoading();
            setReportMeta({});
        }
    };


    useEffect(() => {
        if (Object.keys(reportMeta).length > 0 && testData && pdfLoading) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [reportMeta, testData, pdfLoading]);

    return (
        <div className="min-h-screen mx-5 bg-slate-100 p-6 print:bg-white print:p-0" style={{ overflow: "scroll" }} ref={downloadInvoice}>
            <style>{`
        @page { size: A4; margin: 12mm; }
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto 24px auto;
          background: white;
          position: relative;
          overflow: hidden;
        }
        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
        .watermark span {
          transform: rotate(-32deg);
          font-size: 68px;
          letter-spacing: 0.3em;
          color: rgba(15, 23, 42, 0.05);
          font-weight: 800;
          white-space: nowrap;
        }
        .content-layer { position: relative; z-index: 1; }
        @media print {
          .a4-page { box-shadow: none !important; margin: 0; break-after: page;padding-top: 16mm !important; }
          .no-print { display: none !important; }
        }
      `}</style>

            <div className="no-print mx-auto mb-4 max-w-[210mm] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                NeoHealthCard print-ready A4 templates: modern lab result report + billing invoice. Lab branding stays primary; NeoHealthCard appears as network ID layer and watermark.
            </div>

            <div className="a4-page rounded-[28px] shadow-2xl">
                <div className="watermark"><span>NEOHEALTHCARD</span></div>
                <div className="content-layer flex h-full flex-col p-8 text-slate-900">
                    <header className="flex items-start justify-between border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-lg">
                                {lab.logoText}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">{hospitalBasic?.hospitalName}</h1>
                                <p className="mt-1 text-sm text-slate-600">{hospitalAddress?.fullAddress}</p>
                                <p className="text-sm text-slate-500">{hospitalBasic?.mobileNo} • {hospitalBasic?.email}</p>
                                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-700">{lab.accreditations}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                                Laboratory Result Report
                            </div>
                            <p className="mt-3 text-xs text-slate-500">Powered by local lab systems with NeoHealthCard identity interoperability</p>
                        </div>
                    </header>

                    <section className="mt-5 grid grid-cols-2 gap-4">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Patient Information</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Field label="Patient Name" value={patientData?.name} />
                                <Field label="Age / Sex" value={`${calculateAge(patientData?.dob)} / ${patientData?.gender}`} />
                                <Field label="DOB" value={new Date(patientData?.dob).toLocaleDateString('en-GB')} />
                                <Field label="Patient ID" value={appointmentData?.patientId?.nh12} mono />
                                {appointmentData?.doctorId && <>
                                    <Field label="Doctor" value={appointmentData?.doctorId?.name} />
                                    <Field label="Doctor ID" value={appointmentData?.doctorId?.nh12} mono />
                                </>}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Case & Sample Metadata</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Field label="Lab ID" value={appointmentData?.labId?.nh12} mono />
                                {/* <Field label="Accession No." value={patient.accessionNo} mono /> */}
                                <Field label="Sample ID" value={appointmentData?.customId} mono />
                                {/* <Field label="Referred By" value={patient.referredBy} /> */}
                                <Field label="Collected At" value={patient.collectedAt} />
                                <Field label="Reported At" value={patient.reportedAt} />
                            </div>
                        </div>
                    </section>
                    <section className="mt-5 flex-1 space-y-5">

                        {testData.map((test) => (
                            <div
                                key={test._id}
                                className="overflow-hidden rounded-3xl border border-slate-200 mb-6"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-slate-800">
                                        {test?.shortName}
                                    </h3>
                                    <div className="text-xs text-slate-500">Verified panel</div>
                                </div>

                                {/* Table */}
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                                            <th className="px-5 py-3">Test</th>
                                            <th className="px-5 py-3">Result</th>
                                            <th className="px-5 py-3">Unit</th>
                                            <th className="px-5 py-3">Reference Range</th>
                                            <th className="px-5 py-3">Flag</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {test.component.map((cmp, index) => {
                                            const resultObj =
                                                allComponentResults[test._id]?.[index] || {};

                                            const selectedOption =
                                                cmp?.optionType === "select"
                                                    ? cmp.result?.find(
                                                        (r) => r.value === resultObj.result
                                                    )?.note
                                                    : cmp.textResult;

                                            return (
                                                <tr key={index}>
                                                    <td className="px-5 py-3 font-medium text-slate-800">
                                                        {cmp?.name}
                                                    </td>
                                                    <td className={`px-5 py-3 ${valueStyle(resultObj?.status)}`}>
                                                        {resultObj?.result || "-"}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600">
                                                        {cmp?.unit}
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600">
                                                        {cmp?.minRange}-{cmp?.maxRange}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${badgeStyle(
                                                                resultObj?.status
                                                            )}`}
                                                        >
                                                            {resultObj?.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </section>
                    <section className="mt-5 grid grid-cols-3 gap-4">
                        <div className="col-span-2 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Interpretation & Notes</h3>
                            <p className="text-sm leading-6 text-slate-700">
                                {fullReportData?.remark}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Authentication</h3>
                            <div className="space-y-3 text-sm text-slate-700">
                                <div>
                                    <p className="font-medium">Validated by</p>
                                    <p>{appointmentData?.labStaff?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Digital Signature</p>
                                    <p className="font-mono text-xs text-slate-500">{appointmentData?.labStaff?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Verification</p>
                                    <p>Scan QR / verify via lab portal or NeoHealthCard-linked patient record.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
                        <div className="flex items-center justify-between gap-6">
                            <p>
                                NeoHealthCard serves as an interoperable health network for identity, exchange, and verification. Laboratory brand,
                                accreditation, responsibility, and report issuance remain with the performing lab.
                            </p>
                            {/* <p className="whitespace-nowrap font-medium text-slate-700">Page 1 / 2</p> */}
                        </div>
                    </footer>
                </div>
            </div>

            <div className="a4-page rounded-[28px] shadow-2xl">
                <div className="watermark"><span>NEOHEALTHCARD</span></div>
                <div className="content-layer flex h-full flex-col p-8 text-slate-900">
                    <header className="flex items-start justify-between border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-lg">
                                {lab.logoText}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">{hospitalBasic?.hospitalName}</h1>
                                <p className="mt-1 text-sm text-slate-600">{hospitalAddress?.fullAddress}</p>
                                <p className="text-sm text-slate-500">{hospitalBasic?.mobileNo} • {hospitalBasic?.email}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                                Laboratory Billing Invoice
                            </div>
                            <p className="mt-3 text-xs text-slate-500">Invoice generated by provider lab • NeoHealthCard watermark for network-origin traceability</p>
                        </div>
                    </header>

                    <section className="mt-5 grid grid-cols-3 gap-4">
                        <div className="col-span-2 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Bill To</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Field label="Patient Name" value={patientData?.name} />
                                <Field label="Patient ID" value={appointmentData?.patientId?.nh12} mono />
                                {appointmentData?.doctorId && <>
                                    <Field label="Doctor Name" value={appointmentData?.doctorId?.name} />
                                    <Field label="Doctor ID" value={appointmentData.doctorId?.nh12} mono />
                                </>}
                                <Field label="Lab ID" value={appointmentData?.labId?.nh12} mono />
                                <Field label="Accession No." value={appointmentData?.customId} mono />
                            </div>
                        </div>
                        {appointmentData?.invoiceId && <div className="rounded-3xl border border-slate-200 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Invoice Meta</h2>
                            <div className="space-y-2 text-sm">
                                <InfoLine label="Invoice No." value={appointmentData?.invoiceId?.customId} mono />
                                <InfoLine label="Invoice Date"
                                    value={new Date(appointmentData?.invoiceId?.createdAt)?.toLocaleDateString('en-GB')} />
                                <InfoLine label="Payment Status" value={appointmentData?.paymentStatus} />
                                <InfoLine label="Method" value={appointmentData?.invoiceId?.paymentType} />
                            </div>
                        </div>}
                    </section>
                    <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                            <h3 className="text-sm font-semibold tracking-wide text-slate-800">Services & Charges</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                                    {/* <th className="px-5 py-3">Code</th> */}
                                    <th className="px-5 py-3">Service</th>
                                    <th className="px-5 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentData?.testData?.map((item, index) => {
                                    return (
                                        <tr key={item?.code} className={index !== appointmentData?.testData?.length - 1 ? 'border-b border-slate-100' : ''}>
                                            {/* <td className="px-5 py-3 font-mono text-xs text-slate-600">{item?.code}</td> */}
                                            <td className="px-5 py-3 font-medium text-slate-800">{item?.name}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-900">${item?.fees.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>

                    {/* <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
                        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                            <h3 className="text-sm font-semibold tracking-wide text-slate-800">Services & Charges</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                                    <th className="px-5 py-3">Code</th>
                                    <th className="px-5 py-3">Service</th>
                                    <th className="px-5 py-3">Qty</th>
                                    <th className="px-5 py-3">Rate</th>
                                    <th className="px-5 py-3">Discount</th>
                                    <th className="px-5 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billItems.map((item, index) => {
                                    const amount = item.qty * item.rate - item.discount;
                                    return (
                                        <tr key={item.code} className={index !== billItems.length - 1 ? 'border-b border-slate-100' : ''}>
                                            <td className="px-5 py-3 font-mono text-xs text-slate-600">{item.code}</td>
                                            <td className="px-5 py-3 font-medium text-slate-800">{item.service}</td>
                                            <td className="px-5 py-3 text-slate-600">{item.qty}</td>
                                            <td className="px-5 py-3 text-slate-600">${item.rate.toFixed(2)}</td>
                                            <td className="px-5 py-3 text-slate-600">${item.discount.toFixed(2)}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-900">${amount.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section> */}

                    <section className="mt-5 grid grid-cols-3 gap-4">
                        <div className="col-span-2 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Billing Notes</h3>
                            <ul className="space-y-2 text-sm leading-6 text-slate-700">
                                <li>• Charges belong to the performing laboratory, not to NeoHealthCard.</li>
                                <li>• NeoHealthCard watermark indicates the invoice originated within the connected health network.</li>
                                <li>• Local taxes, payer contracts, and country-specific compliance rules remain configurable per lab.</li>
                                <li>• This layout supports QR payment, insurance attachment, and patient app download workflows.</li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Summary</h3>
                            <div className="space-y-2 text-sm">
                                <SummaryRow label="Subtotal" value={`$${appointmentData?.invoiceId?.subTotal}`} />
                                <SummaryRow label="Discount" value={`-$${appointmentData?.invoiceId?.discount || '0'}`} />
                                <SummaryRow label="Taxes / VAT" value={`$${appointmentData?.invoiceId?.taxes || '0'}`} />
                                <div className="my-2 border-t border-dashed border-slate-200" />
                                <SummaryRow label="Grand Total" value={`$${appointmentData?.invoiceId?.total}`} strong />
                            </div>

                            <div className="d-flex flex-row-reverse mt-5 rounded-2xl border border-dashed border-slate-300 p-4 text-center">
                                <div className="d-flex  flex-column mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    <label className="form-label">Payment QR</label>
                                    <img src={`${base_url}/${paymentInfo?.qr}`} alt="" height={250} width={250} />
                                </div>
                                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    <div className="d-flex gap-3">
                                        <label className="form-label">Bank :-</label>
                                        <p>{paymentInfo?.bankName}</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <label className="form-label">Account Number :-</label>
                                        <p>{paymentInfo?.accountNumber}</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <label className="form-label">Account Holder Name :-</label>
                                        <p>{paymentInfo?.accountNumber}</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <label className="form-label">IFSC Code :-</label>
                                        <p>{paymentInfo?.ifscCode}</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <label className="form-label">Branch :-</label>
                                        <p>{paymentInfo?.branch}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5 grid grid-cols-2 gap-4">
                        <div className="rounded-3xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Provider Declaration</h3>
                            <p className="text-sm leading-6 text-slate-700">
                                We certify that the billed laboratory services were ordered, collected, processed, and reported by the issuing laboratory.
                                NeoHealthCard functions as a connected identity and exchange network only.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Authorized Signatory</h3>
                            <div className="mt-10 border-t border-slate-300 pt-2 text-sm text-slate-700">
                                Billing Officer / Lab Administrator
                            </div>
                        </div>
                    </section>

                    <footer className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-500">
                        <div className="flex items-center justify-between gap-6">
                            <p>
                                This invoice is lab-issued and can be localized for currency, tax structure, payer type, and national billing law. NHC IDs support
                                cross-provider identity linking without changing lab ownership of the document.
                            </p>
                            {/* <p className="whitespace-nowrap font-medium text-slate-700">Page 2 / 2</p> */}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
export default NeoHealthCardLabTemplates

function Field({ label, value, mono = false }) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className={`mt-1 text-sm ${mono ? 'font-mono text-[13px]' : ''}`}>{value}</p>
        </div>
    );
}

function InfoLine({ label, value, mono = false }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-slate-500">{label}</span>
            <span className={mono ? 'font-mono text-xs text-slate-800' : 'font-medium text-slate-800'}>{value}</span>
        </div>
    );
}

function SummaryRow({ label, value, strong = false }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className={strong ? 'font-semibold text-slate-900' : 'text-slate-500'}>{label}</span>
            <span className={strong ? 'text-lg font-semibold text-slate-900' : 'font-medium text-slate-800'}>{value}</span>
        </div>
    );
}
