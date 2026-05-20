import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { getApiData } from "../Services/api";
import { calculateAge } from "../Services/globalFunction";

// ── Google Fonts ─────────────────────────────────────────────────────────
const FontLink = () => (
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
    />
);


// ── Component ────────────────────────────────────────────────────────────
export default function MedicalPrescription({ presId, pdfLoading, endLoading }) {
    const { id } = useParams()
    const [ptData, setPtData] = useState()
    const [aptData, setAptData] = useState()
    const [prescription, setPrescription] = useState()
    async function fetchAptPayment() {
        try {
            const res = await getApiData(`api/comman/prescription/${presId || id}`)

            if (res.success) {
                setAptData(res.data)
                setPtData(res.ptData)
                setPrescription(res.prescription)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }
    useEffect(() => {
        fetchAptPayment()
    }, [presId])
    const invoiceRef = useRef()
    const handleDownload = () => {
        try {
            const element = invoiceRef.current;
            document.body.classList.add("hide-buttons");
            const opt = {
                margin: 0.5,
                filename: `Prescription-${prescription?.diagnosis}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                document.body.classList.remove("hide-buttons");
            });
        } catch (error) {
            console.log(error)
        } finally {
            if (pdfLoading) endLoading();
            setAptData({});
        }
    };
    useEffect(() => {
        if (ptData && aptData && pdfLoading) {
            const timer = setTimeout(() => {
                handleDownload();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [ptData, aptData, pdfLoading]);
    return (
        <div ref={invoiceRef}>
            <FontLink />
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <style>{`
        /* ---------- global ---------- */
        .rx * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        /* ---------- page bg ---------- */
        // .rx-page { background: #e2e2e2; min-height: 100vh; padding: 32px 16px; }

        /* ---------- card ---------- */
        .rx-card {
          background: #ffffff;
          border: 1px solid #c8c8c8;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 18px rgba(0,0,0,0.10);
          max-width: 880px;
          margin: 0 auto;
        }

        /* ---------- header ---------- */
        .rx-header { padding: 18px 24px 14px; border-bottom: 1px solid #e0e0e0; }

        .rx-logo {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          // background: linear-gradient(140deg, #1b90c8 0%, #1fcdd8 100%);
          display: flex; align-items: center; justify-content: center;
        }

        .rx-h-title  { font-size: 18.5px; font-weight: 700; color: #111; letter-spacing: -0.3px; line-height: 1; }
        .rx-h-name   { font-size: 12.5px; font-weight: 600; color: #222; margin-top: 2px; }
        .rx-h-addr   { font-size: 10px; color: #666; margin-top: 3px; line-height: 1.6; }

        .rx-badge {
          border: 1.5px solid #1dcdd8; color: #1dcdd8;
          border-radius: 30px; padding: 3px 10px;
          font-size: 9.5px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .rx-eco { font-size: 9.5px; color: #1aab5f; display: flex; align-items: center; gap: 4px; }
        .rx-eco::before { content: "●"; font-size: 6px; }
        .rx-h-contact { font-size: 10px; color: #555; margin-top: 2px; }

        /* ---------- meta strip ---------- */
        .rx-meta { background: #f7f7f7; border-bottom: 1px solid #e0e0e0; display: flex; }
        .rx-mc { padding: 9px 18px; border-right: 1px solid #e0e0e0; flex: 1; }
        .rx-mc:last-child { border-right: none; }
        .rx-ml { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: #aaa; margin-bottom: 3px; }
        .rx-mv { font-size: 11.5px; font-weight: 500; color: #111; }
        .rx-mv.rx-mono { font-family: 'Courier New', monospace; font-size: 11px; }

        /* ---------- patient ---------- */
        .rx-patient { padding: 15px 24px 16px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .rx-pt-sec-lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: #aaa; margin-bottom: 5px; }
        .rx-pt-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.4px; margin-bottom: 10px; line-height: 1; }
        .rx-pt-grid { display: grid; grid-template-columns: 128px 1fr 150px 1fr; row-gap: 5px; }
        .rx-pt-lbl { font-size: 10.5px; color: #777; }
        .rx-pt-val { font-size: 10.5px; color: #111; font-weight: 500; }
        .rx-pt-val.rx-mono { font-family: 'Courier New', monospace; font-size: 10px; }
        .rx-qr-wrap { border: 1px solid #ddd;width:150px;height:150px; border-radius: 4px; padding: 2px; background: #fff; flex-shrink: 0; }
        .rx-scan { font-size: 8.5px; color: #1dcdd8; text-align: right; margin-top: 5px; line-height: 1.6; }

        /* ---------- services ---------- */
        .rx-svc-wrap { padding: 0 24px; }
        .rx-svc-title {
          text-align: center; font-size: 8.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.8px; color: #888;
          padding: 10px 0 7px;
        }
        .rx-tbl { width: 100%; border-collapse: collapse; }
        .rx-tbl thead tr { background: #f2f2f2; }
        .rx-tbl th {
          font-size: 8px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: #666;
          padding: 8px 11px; text-align: left;
          border-bottom: 1.5px solid #ddd;
        }
        .rx-tbl tbody tr { border-bottom: 1px solid #efefef; }
        .rx-tbl tbody tr:last-child { border-bottom: none; }
        .rx-tbl td { font-size: 11.5px; color: #222; padding: 8px 11px; vertical-align: middle; }
        .rx-med   { font-size: 12px; font-weight: 500; color: #111; }
        .rx-msub  { font-size: 10.5px; color: #555; margin-top: 1px; }

        /* ---------- general instruction ---------- */
        .rx-gi {
          margin: 12px 24px 14px;
          border: 1px solid #e0e0e0; border-radius: 5px;
          padding: 11px 16px; background: #fafafa;
        }
        .rx-gi-title { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: #aaa; margin-bottom: 8px; }
        .rx-gi-ol { margin: 0; padding-left: 20px; }
        .rx-gi-ol li { font-size: 11.5px; color: #333; margin-bottom: 4px; }

        /* ---------- signatures ---------- */
        .rx-sig-row { display: flex; border-top: 1px solid #e0e0e0; margin: 0 24px; }
        .rx-sig-blk { flex: 1; padding: 14px 0; text-align: center; }
        .rx-sig-blk:first-child { border-right: 1px solid #e0e0e0; }
        .rx-sig-name { font-size: 12.5px; font-weight: 700; color: #111; }
        .rx-sig-role { font-size: 10px; color: #555; margin-top: 2px; }
        .rx-sig-id   { font-size: 9px; color: #1dcdd8; margin-top: 3px; font-family: 'Courier New', monospace; }

        /* ---------- footer bar ---------- */
        .rx-footer {
          background: #1ecece;
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 24px; margin-top: 14px;
        }
        .rx-footer span { font-size: 10px; color: #fff; }
        .rx-footer .rx-tagline { font-style: italic; }
      `}</style>

            <div className="rx rx-page">
                <div className="rx-card">

                    {/* ── HEADER ── */}
                    <div className="rx-header d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div className="rx-logo">
                                <img src="/logo.png" alt="" srcset="" />
                            </div>
                            <div>
                                <div className="rx-h-title">Medical Prescription</div>
                                <div className="rx-h-name">{aptData?.orgName}</div>
                                <div className="rx-h-addr">
                                    {aptData?.orgNh12}<br />
                                    {aptData?.orgAddress}
                                </div>
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="mb-1">
                                <span className="rx-badge">
                                    <svg width="9" height="9" viewBox="0 0 10 10" fill="#1dcdd8">
                                        <polygon points="5,0.5 6.2,3.5 9.5,3.8 7.2,6 7.9,9.5 5,7.8 2.1,9.5 2.8,6 0.5,3.8 3.8,3.5" />
                                    </svg>
                                    NeoHealthCard Network
                                </span>
                            </div>
                            <div className="d-flex gap-3 justify-content-end mb-1">
                                <span className="rx-eco">Fully Automated</span>
                                <span className="rx-eco">Ecosystem Connected</span>
                            </div>
                            <div className="rx-h-contact">{aptData?.orgEmail} · {aptData?.orgContactNumber}</div>
                        </div>
                    </div>

                    {/* ── META STRIP ── */}
                    <div className="rx-meta">
                        <div className="rx-mc">
                            <div className="rx-ml">Prescription ID</div>
                            <div className="rx-mv rx-mono">{prescription?.customId}</div>
                        </div>
                        <div className="rx-mc">
                            <div className="rx-ml">Date &amp; Time</div>
                            <div className="rx-mv">{new Date(prescription?.createdAt)?.toLocaleString('en-GB')}</div>
                        </div>
                        <div className="rx-mc">
                            <div className="rx-ml">Diagnosis</div>
                            <div className="rx-mv">{prescription?.diagnosis}</div>
                        </div>
                        {/* <div className="rx-mc">
              <div className="rx-ml">Valid For</div>
              <div className="rx-mv">30 Days</div>
            </div> */}
                    </div>

                    {/* ── PATIENT ── */}
                    <div className="rx-patient">
                        <div className="flex-fill">
                            <div className="rx-pt-sec-lbl">Patient</div>
                            <div className="rx-pt-name">{ptData?.name}</div>
                            <div className="rx-pt-grid">
                                <span className="rx-pt-lbl">Age / Sex</span>      <span className="rx-pt-val text-capitalize">{calculateAge(ptData?.dob)}/ {ptData?.gender}</span>
                                <span className="rx-pt-lbl">Email Address</span>   <span className="rx-pt-val">{ptData?.email}</span>

                                <span className="rx-pt-lbl">DOB</span>             <span className="rx-pt-val">{new Date(ptData?.dob)?.toLocaleDateString('en-GB')}</span>
                                <span className="rx-pt-lbl">Address</span>         <span className="rx-pt-val">{ptData?.address}</span>

                                <span className="rx-pt-lbl">Blood</span>           <span className="rx-pt-val">{ptData?.bloodGroup}</span>
                                <span className="rx-pt-lbl">Patient ID</span>      <span className="rx-pt-val rx-mono">{ptData?.nh12}</span>

                                <span className="rx-pt-lbl">Contact no</span>      <span className="rx-pt-val">+91 {ptData?.contactNumber}</span>
                                <span className="rx-pt-lbl">Dr Name</span>         <span className="rx-pt-val">Dr. {aptData?.doctorName}</span>

                                <span className="rx-pt-lbl"></span>                 <span className="rx-pt-val"></span>
                                <span className="rx-pt-lbl">Dr ID</span>           <span className="rx-pt-val rx-mono">{aptData?.doctorNh12}</span>
                            </div>
                        </div>
                        <div>
                            <div className="rx-qr-wrap">
                                <QRCodeCanvas
                                    value={`https://www.neohealthcard.com/prescription/${prescription?.customId}`}
                                    size={256}
                                    // className="qr-code"
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                />
                            </div>
                            <div className="rx-scan">Scan to verify<br />verify.neohealthcard.in</div>
                        </div>
                    </div>

                    {/* ── SERVICES TABLE ── */}
                    <div className="rx-svc-wrap">
                        <div className="rx-svc-title">Services &amp; Charges</div>
                        <table className="rx-tbl">
                            <thead>
                                <tr>
                                    {["Medication Name", "Refills", "Frequency", "Duration", "Instruction"].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {prescription?.medications.map((m, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="rx-med">{m.name}</div>
                                            {/* {m.sub && <div className="rx-msub">{m.sub}</div>} */}
                                        </td>
                                        <td>{m.refills}</td>
                                        <td>{m.frequency}</td>
                                        <td>{m.duration}</td>
                                        <td>{m.instructions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── GENERAL INSTRUCTION ── */}
                    <div className="rx-gi">
                        <div className="rx-gi-title">General Instruction</div>
                        <ol className="rx-gi-ol">
                            <li>{prescription?.notes}</li>
                            {/* {instructions.map(({ num, text }) => (
                <li key={num} value={num}>{text}</li>
              ))} */}
                        </ol>
                    </div>

                    {/* ── SIGNATURES ── */}
                    <div className="rx-sig-row">
                        <div className="rx-sig-blk">
                            <div className="rx-sig-name">Dr. {aptData?.doctorName}</div>
                            <div className="rx-sig-role">{aptData?.specialization}  · {aptData?.orgName}</div>
                            <div className="rx-sig-id">{aptData?.doctorNh12}</div>
                        </div>
                        <div className="rx-sig-blk">
                            <div className="rx-sig-name">{ptData?.name}</div>
                            <div className="rx-sig-role">Patient / Authorised Representative</div>
                            <div className="rx-sig-id">{ptData?.nh12}</div>
                        </div>
                    </div>

                    {/* ── FOOTER ── */}
                    <div className="rx-footer">
                        <span>{aptData?.orgName}, {aptData?.orgAddress} · {aptData?.orgEmail} · {aptData?.orgContactNumber}</span>
                        <span className="rx-tagline">Wishing you a speedy recovery</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
