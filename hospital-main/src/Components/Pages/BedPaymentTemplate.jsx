import { useEffect, useRef, useState } from "react";
import { getApiData, getSecureApiData, securePostData } from "../../Service/api";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateAge } from "../../Service/globalFunction";
import base_url from "../../baseUrl";
import html2pdf from "html2pdf.js";

const BedPaymentTemplate = ({ allotmentId, pdfLoading, endLoading }) => {
    const [isReady, setIsReady] = useState(false);
    const [patientData, setPatientData] = useState()
    const [testData, setTestData] = useState([]);
    const [testId, setTestId] = useState([]);
    const [allComponentResults, setAllComponentResults] = useState({});
    const [allComments, setAllComments] = useState({});
    const [reportMeta, setReportMeta] = useState({});
    const [fullReportData, setFullReportData] = useState()
    const downloadInvoice = useRef(null);
    const [isRemark, setIsRemark] = useState(false)
    const { hospitalBasic, hospitalAddress, paymentInfo,
    } = useSelector(state => state.user)
    const [paymentData, setPaymentData] = useState()

    const [allotmentData, setAllotmentData] = useState({})
    const fetchAllotmentData = async () => {
        try {
            const response = await getSecureApiData(`api/bed/allotment/${allotmentId}`)
            if (response.success) {
                setAllotmentData(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function fetchAllotmentPayment() {
        try {
            const res = await getSecureApiData(`api/bed/allotment-payment/${allotmentId}`)

            if (res.success) {
                setPaymentData(res.data);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (allotmentId) {

            fetchAllotmentData()
            fetchAllotmentPayment()
        }
    }, [allotmentId])

    // Calculate subtotal, GST and total
    // const subtotal = allotmentData?.testId
    //     ?.reduce((acc, item) => acc + Number(item?.price || 0), 0) || 0;

    // const gst = subtotal * 0.05;
    // const total = subtotal + gst;

    async function fetchPatientData() {
        try {
            const res = await getApiData(`patient/${allotmentData?.patientId?._id}`)
            if (res.success) {
                setPatientData(res.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        if (allotmentData?.patientId?._id) {

            fetchPatientData()
        }
    }, [allotmentData])






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
                filename: `invoice-${paymentData?.customId}.pdf`,
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
        if (paymentData && pdfLoading) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [paymentData, pdfLoading]);

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
                NeoHealthCard print-ready A4 templates: modern lab result report + billing invoice. Hospital branding stays primary; NeoHealthCard appears as network ID layer and watermark.
            </div>

            {/* <div className="a4-page rounded-[28px] shadow-2xl">
                <div className="watermark"><span>NEOHEALTHCARD</span></div>
                <div className="content-layer flex h-full flex-col p-8 text-slate-900">
                    <header className="flex items-start justify-between border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-4">
                            
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">{hospitalBasic?.hospitalName}</h1>
                                <p className="mt-1 text-sm text-slate-600">{hospitalAddress?.fullAddress}</p>
                                <p className="text-sm text-slate-500">{hospitalBasic?.mobileNo} • {hospitalBasic?.email}</p>
                               
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
                                <Field label="Patient ID" value={allotmentData?.patientId?.nh12} mono />
                                {allotmentData?.primaryDoctorId && <>
                                    <Field label="Doctor" value={allotmentData?.primaryDoctorId?.name} />
                                    <Field label="Doctor ID" value={allotmentData?.primaryDoctorId?.nh12} mono />
                                </>}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Case & Sample Metadata</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Field label="Hospital ID" value={allotmentData?.labId?.nh12} mono />
                                <Field label="Allotment ID" value={allotmentData?.customId} mono />
                            </div>
                        </div>
                    </section>
                    <section className="mt-5 flex-1 space-y-5">

                        {testData.map((test) => (
                            <div
                                key={test._id}
                                className="overflow-hidden rounded-3xl border border-slate-200 mb-6"
                            >
                                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-slate-800">
                                        {test?.shortName}
                                    </h3>
                                    <div className="text-xs text-slate-500">Verified panel</div>
                                </div>

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
                                                        {cmp?.referenceRange}
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
                                    <p>{allotmentData?.labStaff?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Digital Signature</p>
                                    <p className="font-mono text-xs text-slate-500">{allotmentData?.labStaff?.name}</p>
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
                        </div>
                    </footer>
                </div>
            </div> */}

            <div className="a4-page rounded-[28px] shadow-2xl">
                <div className="watermark"><span>NEOHEALTHCARD</span></div>
                <div className="content-layer flex h-full flex-col p-8 text-slate-900">
                    <header className="flex items-start justify-between border-b border-slate-200 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-lg">
                                {/* {lab.logoText} */}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">{hospitalBasic?.hospitalName}</h1>
                                <p className="mt-1 text-sm text-slate-600">{hospitalAddress?.fullAddress}</p>
                                <p className="text-sm text-slate-500">{hospitalBasic?.mobileNo} • {hospitalBasic?.email}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                                Hospital Billing Invoice
                            </div>
                            <p className="mt-3 text-xs text-slate-500">Invoice generated by provider lab • NeoHealthCard watermark for network-origin traceability</p>
                        </div>
                    </header>

                    <section className="mt-5 grid grid-cols-3 gap-4">
                        <div className="col-span-2 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Bill To</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Field label="Patient Name" value={patientData?.name} />
                                <Field label="Patient ID" value={allotmentData?.patientId?.nh12} mono />
                                {allotmentData?.primaryDoctorId && <>
                                    <Field label="Doctor Name" value={allotmentData?.primaryDoctorId?.name} />
                                    <Field label="Doctor ID" value={allotmentData.primaryDoctorId?.nh12} mono />
                                </>}
                                <Field label="Hospital ID" value={allotmentData?.hospitalId?.nh12} mono />
                                <Field label="Accession No." value={allotmentData?.customId} mono />
                            </div>
                        </div>
                        {allotmentData?.invoiceId && <div className="rounded-3xl border border-slate-200 p-4">
                            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Invoice Meta</h2>
                            <div className="space-y-2 text-sm">
                                <InfoLine label="Invoice No." value={allotmentData?.invoiceId?.customId} mono />
                                <InfoLine label="Invoice Date"
                                    value={new Date(allotmentData?.invoiceId?.createdAt)?.toLocaleDateString('en-GB')} />
                                <InfoLine label="Payment Status" value={allotmentData?.paymentStatus} />
                                <InfoLine label="Method" value={allotmentData?.invoiceId?.paymentType} />
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
                                {paymentData?.ipdPayment?.map((item, index) => {
                                    return (
                                        <tr key={item?.code} className={index !== allotmentData?.ipdPayment?.length - 1 ? 'border-b border-slate-100' : ''}>
                                            {/* <td className="px-5 py-3 font-mono text-xs text-slate-600">{item?.code}</td> */}
                                            <td className="px-5 py-3 font-medium text-slate-800">{item?.role} {item?.userId?.name}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-900">${item?.fees.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                                {paymentData?.services?.map((item, index) => {
                                    return (
                                        <tr key={item?.code} className={index !== allotmentData?.services?.length - 1 ? 'border-b border-slate-100' : ''}>
                                            {/* <td className="px-5 py-3 font-mono text-xs text-slate-600">{item?.code}</td> */}
                                            <td className="px-5 py-3 font-medium text-slate-800">{item?.name}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-900">${item?.amount.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                                 {paymentData?.bedCharges?.map((item, index) => {
                                    return (
                                        <tr key={item?.code} className={index !== allotmentData?.bedCharges?.length - 1 ? 'border-b border-slate-100' : ''}>
                                            {/* <td className="px-5 py-3 font-mono text-xs text-slate-600">{item?.code}</td> */}
                                            <td className="px-5 py-3 font-medium text-slate-800">Bed {item?.bedId?.bedName}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-900">${item?.amount.toFixed(2)}</td>
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
                                <SummaryRow label="Subtotal" value={`$${paymentData?.totalAmount}`} />
                                <SummaryRow label="Discount" value={`-$${paymentData?.discountValue || '0'} ${paymentData?.discountType}`} />
                                <SummaryRow label="Taxes / VAT" value={`$${paymentData?.taxes || '0'}`} />
                                <div className="my-2 border-t border-dashed border-slate-200" />
                                <SummaryRow label="Grand Total" value={`$${paymentData?.finalAmount}`} strong />
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
                                Billing Officer / Hospital Administrator
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
export default BedPaymentTemplate

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
