import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiData } from "../Service/api";
import { calculateAge, stripHtml } from "../Service/globalFunction";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { QRCodeCanvas } from "qrcode.react";
import base_url from "../baseUrl";
const s = {
  // Layout
  page: {
    backgroundColor: "#f4f6f7",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "sans-serif",
  },
  logo: {
    width: 34,
    height: 34,
  },
  invoice: {
    width: "880px",
    backgroundColor: "#ffffff",
    color: "#1C1C1C",
    fontSize: "12px",
    position: "relative",
    overflow: "hidden",
  },

  // Watermark
  watermarkWrapper: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    transform: "translateY(40px)",
  },
  watermarkCircle: {
    width: "420px",
    height: "420px",
    backgroundColor: "#14b8a6",
    opacity: 0.04,
    borderRadius: "50%",
  },

  // Header
  header: {
    padding: "24px 24px 16px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
    justifyContent: "space-between",
  },
  headerLeft: {},
  headerTitle: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "24px",
    margin: 0,
  },
  headerHospital: {
    fontSize: "12px",
    color: "#4A4A4A",
    marginTop: "2px",
  },
  headerMeta: {
    fontSize: "10px",
    color: "#868686",
    marginTop: "2px",
  },
  headerRight: {
    textAlign: "right",
  },
  networkBadge: {
    border: "1px solid #14b8a6",
    color: "#14b8a6",
    fontSize: "10px",
    padding: "2px 12px",
    borderRadius: "9999px",
    display: "inline-block",
  },
  headerRightMeta: {
    fontSize: "10px",
    color: "#868686",
    marginTop: "2px",
  },

  // Meta strip
  metaStrip: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  // Patient
  patientSection: {
    padding: "20px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "flex",
  },
  patientLeft: {
    flex: 1,
  },
  patientName: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "20px",
    margin: 0,
  },
  patientGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    columnGap: "20px",
    rowGap: "8px",
    marginTop: "12px",
  },
  qrContainer: {
    width: "100px",
    borderLeft: "1px solid #E6E6E6",
    paddingLeft: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  qrBox: {
    width: "72px",
    height: "72px",
    backgroundColor: "#E6E6E6",
  },
  qrLabel: {
    fontSize: "10px",
    color: "#868686",
    marginTop: "8px",
  },
  qrLink: {
    fontSize: "10px",
    color: "#14b8a6",
  },

  // Admission + Clinical
  admissionClinical: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    fontSize: "11px",
  },
  sectionGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sectionLabel: {
    fontSize: "10px",
    color: "#868686",
    letterSpacing: "0.05em",
    marginBottom: "2px",
  },

  // Table
  tableSection: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
  },
  tableTitle: {
    textAlign: "center",
    fontSize: "10px",
    color: "#868686",
    marginBottom: "8px",
    letterSpacing: "0.05em",
  },
  table: {
    width: "100%",
    fontSize: "11px",
    border: "1px solid #E6E6E6",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: "#FAFAFA",
    color: "#868686",
  },
  thLeft: {
    textAlign: "left",
    padding: "6px 12px",
    fontWeight: 500,
  },
  thCenter: {
    textAlign: "center",
    padding: "6px 12px",
    fontWeight: 500,
  },
  thRight: {
    textAlign: "right",
    padding: "6px 12px",
    fontWeight: 500,
  },
  tdBorderTop: {
    borderTop: "1px solid #E6E6E6",
  },
  tdLeft: {
    padding: "6px 12px",
    textAlign: "left",
  },
  tdCenter: {
    padding: "6px 12px",
    textAlign: "center",
  },
  tdRight: {
    padding: "6px 12px",
    textAlign: "right",
  },
  tdSubText: {
    fontSize: "10px",
    color: "#868686",
    marginTop: "2px",
  },

  // Payment
  paymentRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    borderBottom: "1px solid #E6E6E6",
    fontSize: "11px",
  },
  paymentCell: {
    padding: "12px 24px",
  },
  paymentCellBordered: {
    padding: "12px 24px",
    borderLeft: "1px solid #E6E6E6",
  },

  // Notes
  notesSection: {
    padding: "16px 24px",
    borderBottom: "1px solid #E6E6E6",
  },
  notesTitle: {
    fontSize: "10px",
    color: "#868686",
    marginBottom: "8px",
    letterSpacing: "0.05em",
  },
  notesList: {
    fontSize: "10px",
    color: "#868686",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingLeft: "16px",
  },

  // Footer
  footer: {
    backgroundColor: "#0ea5a4",
    color: "#ffffff",
    fontSize: "10px",
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 24px",
  },

  // Typography helpers
  label: {
    fontSize: "10px",
    color: "#868686",
    lineHeight: "12px",
    marginBottom: "2px",
    letterSpacing: "0.02em",
  },
  value: {
    fontSize: "11px",
    color: "#1C1C1C",
    fontWeight: 500,
    lineHeight: "13px",
  },
  metaBlock: {
    lineHeight: "1.2",
  },
};

const Label = ({ children }) => <p style={s.label}>{children}</p>;
const Value = ({ children }) => <p style={s.value}>{children}</p>;

const Meta = ({ l, v }) => (
  <div style={s.metaBlock}>
    <Label>{l}</Label>
    <Value>{v}</Value>
  </div>
);

const KV = ({ k, v }) => (
  <div style={s.metaBlock}>
    <Label>{k}</Label>
    <Value>{v}</Value>
  </div>
);

export default function BedInvoice({ allotmentId, pdfLoading, endLoading }) {

  const { id } = useParams()
  const [allotmentData, setAllotmentData] = useState()
  const [patientData, setPatientData] = useState()
  const [hospitalData, setHospitalData] = useState()
  const [dischargeData, setDischargeData] = useState()
  const [paymentData, setPaymentData] = useState()
  async function fetchAllotmentDetail() {
    if (!allotmentData && !id) {
      return
    }
    try {
      const res = await getApiData(`api/comman/bed-invoice/${allotmentId || id}`)
      if (res.success) {
        setAllotmentData(res.allotmentData)
        setPatientData(res.patientData)
        setHospitalData(res.hospitalData)
        setPaymentData(res.paymentData)
        setDischargeData(res.dischargeData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    if (id || allotmentId) {

      fetchAllotmentDetail()
    }
  }, [id, allotmentId])
  const getDays = (start, end) => {
    if (!start || !end) return 0;

    const d1 = new Date(start);
    const d2 = new Date(end);

    const diffTime = d2 - d1; // ms difference
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };
  const totalStay = getDays(allotmentData?.allotmentDate, dischargeData?.createdAt || new Date())
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `BedInvoice-${allotmentData?.customId}.pdf`,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.classList.remove("hide-buttons");
      });
    } catch (error) {

    } finally {
      if (pdfLoading) endLoading();
      setAllotmentData({});
    }
  };
  const handlePrint = () => {
    document.body.classList.add("hide-buttons");

    setTimeout(() => {
      window.print();
      document.body.classList.remove("hide-buttons");

      if (pdfLoading) endLoading();
      setAllotmentData({});
    }, 500);
  };
  useEffect(() => {
    if (allotmentData && patientData && hospitalData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();

      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allotmentData, patientData, hospitalData, pdfLoading]);
  return (
    <>
      <div style={s.page} ref={invoiceRef}>
        <div style={s.invoice}>

          {/* WATERMARK */}
          <div style={s.watermarkWrapper}>
            <div style={s.watermarkCircle} />
          </div>

          {/* HEADER */}
          <div style={s.header}>
            <div className="d-flex">
              <div style={s.logo}>
                <img src={hospitalData?.logoFileId ?
                  `${base_url}/api/file/${hospitalData?.logoFileId}` : "/logo.png"} alt="" />
              </div>
              <div style={s.headerLeft}>
                <h1 style={s.headerTitle}>IPD / Bed Invoice</h1>
                <p style={s.headerHospital} className="mb-0 lh-sm">{hospitalData?.name}</p>
                <p style={s.headerMeta} className="mb-0 lh-sm">
                  {hospitalData?.nh12}
                </p>
                <p style={s.headerMeta} className="mb-0 lh-sm">
                  {hospitalData?.fullAddress}, {hospitalData?.city?.name} ,{hospitalData?.pinCode}
                </p>
              </div>
            </div>

            <div style={s.headerRight}>
              <div style={s.networkBadge}>NeoHealthCard Network</div>
              <p style={s.headerRightMeta} className="mb-0 lh-sm">Fully Automated · Ecosystem Connected</p>
              <p style={s.headerRightMeta} className="mb-0 lh-sm">
                {hospitalData?.email} · {hospitalData?.contactNumber}
              </p>
            </div>
          </div>

          {/* META */}
          <div style={s.metaStrip}>
            {paymentData && <Meta l="IPD INVOICE ID" v={paymentData?.customId} />}
            {dischargeData && <Meta l="DISCHARGE REF" v={dischargeData?.customId} />}
            {paymentData?.payments?.length > 0 && (
              <Meta
                l="BILL DATE"
                v={new Date(
                  Math.max(
                    ...paymentData.payments.map(p => new Date(p.date))
                  )
                ).toLocaleDateString('en-GB')}
              />
            )}
            <Meta l="TOTAL STAY" v={`${new Date(allotmentData?.allotmentDate)?.toLocaleDateString('en-GB')} – ${dischargeData ? new Date(dischargeData?.createdAt)?.toLocaleDateString('en-GB') : 'Present'} · ${totalStay} Days`} />
          </div>

          {/* PATIENT */}
          <div style={s.patientSection}>
            <div style={s.patientLeft}>
              <h2 style={s.patientName}>{patientData?.name}</h2>
              <div style={s.patientGrid}>
                <KV k="Age / Sex" v={`${calculateAge(patientData?.dob, allotmentData?.createdAt)} / ${patientData?.gender || '-'}`} />
                <KV k="Email Address" v={patientData?.email} />
                <KV k="Patient ID" v={patientData?.nh12} />

                <KV k="DOB" v={new Date(patientData?.dob)?.toLocaleDateString('en-GB')} />
                <KV k="Address" v={`${patientData?.fullAddress || ''} ${patientData?.cityId?.name}`} />
                <KV k="Dr Name" v={allotmentData?.primaryDoctorId?.name} />

                <KV k="Blood" v={patientData?.bloodGroup || '-'} />
                <KV k="Contact no" v={patientData?.contactNumber} />
                <KV k="Dr ID" v={allotmentData?.primaryDoctorId?.nh12} />
              </div>
            </div>

            {/* QR */}
            <div style={s.qrContainer}>
              <div style={s.qrBox} >
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/ipd-invoice/${allotmentData?.customId}`}
                  size={256}
                  // className="qr-code"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p style={s.qrLabel}>Scan to verify</p>
              <p style={s.qrLink}>verify.neohealthcard.in</p>
            </div>
          </div>

          {/* ADMISSION + CLINICAL */}
          <div style={s.admissionClinical}>
            <div style={s.sectionGroup}>
              <p style={s.sectionLabel}>ADMISSION DETAILS</p>
              {/* <KV k="Ward Type" v="General Ward" /> */}
              <KV k="Bed / Room" v={`${allotmentData?.bedId?.bedName} / ${allotmentData?.bedId?.roomId?.roomName}`} />
              <KV k="Admission" v={new Date(allotmentData?.allotmentDate)?.toLocaleDateString('en-GB')} />
              {dischargeData && <KV k="Discharge" v={new Date(dischargeData?.createdAt)?.toLocaleString('en-GB')} />}
              <KV k="Total Stay" v={`${totalStay} Days`} />
            </div>

            <div style={s.sectionGroup}>
              <p style={s.sectionLabel}>CLINICAL REFERENCE</p>
              <KV k="Diagnosis" v={allotmentData?.admissionReason} />
              {dischargeData && <KV k="Discharge Type" v={dischargeData?.dischargeType} />}
              {dischargeData && <KV k="Condition" v={stripHtml(dischargeData?.conditionOfDischarge)} />}
              <KV k="Attending Doctor" v={allotmentData?.primaryDoctorId?.name} />
              <KV k="Department" v={allotmentData?.departmentId?.departmentName} />
            </div>
          </div>

          {/* TABLE */}
          <div style={s.tableSection}>
            <p style={s.tableTitle}>SERVICES & CHARGES</p>

            <table style={s.table}>
              <thead style={s.thead}>
                <tr>
                  <th style={s.thLeft}>SERVICE / DESCRIPTION</th>
                  {/* <th style={s.thCenter}>SAC CODE</th> */}
                  {/* <th style={s.thRight}>UNIT PRICE</th>
                <th style={s.thCenter}>QTY</th>
                <th style={s.thCenter}>GST%</th> */}
                  <th style={s.thRight}>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {paymentData?.bedCharges?.length > 0 &&
                  <tr style={s.tdBorderTop}>
                    <td style={s.tdLeft}><div>Bed Charges </div>
                      <div style={s.tdSubText}>{totalStay} Days</div>
                    </td>
                    <td style={s.tdRight}> ₹ {paymentData?.bedCharges?.reduce(
                      (sum, s) => sum + Number(s.amount || 0),
                      0
                    )}</td>
                  </tr>}
                {paymentData?.ipdPayment?.length > 0 &&
                  <tr style={s.tdBorderTop}>
                    <td style={s.tdLeft}><div>Nursing Charges </div>
                      <div style={s.tdSubText}>Post-operative nursing & patient care</div>
                    </td>
                    <td style={s.tdRight}> ₹ {paymentData?.ipdPayment?.reduce(
                      (sum, s) => sum + Number(s.fees || 0),
                      0
                    )}</td>
                  </tr>}
                {/* {paymentData?.services?.length > 0 &&
                  <tr style={s.tdBorderTop}>
                    <td style={s.tdLeft}><div>Services </div>
                      <div style={s.tdSubText}>{paymentData?.services?.map(item => item?.name)?.join(',')}</div>
                    </td>
                    <td style={s.tdRight}>₹ {paymentData?.services?.reduce(
                      (sum, s) => sum + Number(s.amount || 0),
                      0
                    )}</td>
                  </tr>} */}
              </tbody>
            </table>
          </div>

          {/* PAYMENT */}
          {/*<div style={s.tableSection}>
            <p style={s.tableTitle}>Payments</p>

            <table style={s.table}>
              <thead style={s.thead}>
                <tr>
                  <th style={s.thLeft}>Payment Date </th>
                  <th style={s.thCenter}>Payment Type</th>
                  <th style={s.thRight}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {paymentData?.payments?.length > 0 &&
                  paymentData?.payments?.map((item, key) => <tr style={s.tdBorderTop} key={key}>
                    <td style={s.tdLeft}><div>{new Date(item?.date)?.toLocaleDateString('en-GB')} </div>
                    </td>
                    <td style={s.tdCenter}>{item?.type}</td>
                    <td style={s.tdRight}> ₹ {item?.amount}</td>
                  </tr>)}
                <tr style={s.tdBorderTop}>
                  <td></td>
                  <td></td>
                  <td style={s.tdRight}>Total Amount ₹ {paymentData?.totalAmount}</td>
                </tr>
                {paymentData?.discountValue > 0 &&
                  <tr style={s.tdBorderTop}>
                    <td></td>
                    <td></td>
                    <td style={s.tdRight}>Discount {`${paymentData?.discountType == "Percentage" ? '(%)' : '₹'}`} {paymentData?.discountValue}</td>
                  </tr>}
                <tr style={s.tdBorderTop}>
                  <td></td>
                  <td></td>
                  <td style={s.tdRight}>Final Amount ₹ {paymentData?.finalAmount}</td>
                </tr>

              </tbody>
            </table>
          </div>*/}

          <div style={s.paymentRow}>
            {/* <div style={s.paymentCell}>
            <Label>Payment Mode</Label>
            <Value>Cash</Value>
          </div> */}
            {paymentData && <div style={s.paymentCellBordered}>
              <Label>Transaction ID</Label>
              <Value>{paymentData?.customId}</Value>
            </div>}
            <div style={s.paymentCellBordered}>
              <Label>Status</Label>
              <Value>{paymentData?.status || ''}</Value>
            </div>
          </div>

          {/* NOTES */}
          <div style={s.notesSection}>
            <p style={s.notesTitle}>IMPORTANT NOTES</p>
            <ol style={s.notesList}>
              <li>Bed charges calculated on daily basis from admission time.</li>
              <li>Partial day is billed as full day for IPD purposes.</li>
              <li>Charges vary by ward category and level of care required.</li>
              <li>This invoice is linked to Discharge Summary.</li>
            </ol>
          </div>

          {/* FOOTER */}
          <div style={s.footer}>
            <span>
              {hospitalData?.name}, Mumbai · {hospitalData?.email} · {hospitalData?.contactNumber}
            </span>
            <span>Wishing you a speedy recovery</span>
          </div>

        </div>
      </div>
    </>
  );
}