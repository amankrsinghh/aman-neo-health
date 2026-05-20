import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { getApiData } from "../Services/api";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";

export default function ViewBirthCertificate() {
  const { id } = useParams()
  const pdfRef = useRef();
  const [certificateData, setCertificateData] = useState()
  async function fetchCertificateData(params) {
    try {
      const res = await getApiData(`api/certificate/birth-data/${id}`)
      if (res.success) {
        setCertificateData(res.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchCertificateData()
  }, [id])
  const handleDownload = () => {
  const element = pdfRef.current;

  const opt = {
    margin: 0.3,
    filename: `${certificateData?.customId}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2, // better quality
      useCORS: true
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf().set(opt).from(element).save();
};
  return (
    <>
    <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row ">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2 gradient-text">Fitnes Certificates</h3>
              <div className="admin-breadcrumb">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb custom-breadcrumb">
                    <li className="breadcrumb-item">
                      <NavLink to="/dashboard" className="breadcrumb-link">
                        Dashboard
                      </NavLink>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      Certificates
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="">
              <button className="add-nw-btn nw-thm-btn" onClick={handleDownload}>Download</button>
            </div>
          </div>
        </div>
    <div style={s.page} ref={pdfRef}>
      <div style={s.container}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex">
            <div style={s.logo}>
              <img src="/logo.png" alt="" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <div style={s.title}>Birth Certificate</div>
              <div style={s.subtitle}>{certificateData?.organization?.name}</div>
              <div style={s.meta}>
                {certificateData?.organization?.nh12}<br/>
               {certificateData?.address?.fullAddress + ',' + certificateData?.address?.cityId?.name + ',' + certificateData?.address?.stateId?.name + ',' + certificateData?.address?.pinCode}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={s.badge}>NeoHealthCard Network</div>
            <div style={s.metaRight}>
              Fully Automated · Ecosystem Connected<br/>
              {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
            </div>
          </div>
        </div>

        {/* INFO STRIP */}
        <div className="row" style={s.infoRow}>
          <div className="col">
            <div style={s.infoLabel}>CERTIFICATE ID</div>
            <div style={s.infoValue}>{certificateData?.customId}</div>
          </div>
          <div className="col">
            <div style={s.infoLabel}>ISSUE DATE</div>
            <div style={s.infoValue}>{new Date (certificateData?.createdAt)?.toLocaleDateString('en-GB')}</div>
          </div>
          <div className="col">
            <div style={s.infoLabel}>REGISTRATION NO.</div>
            <div style={s.infoValue}>{certificateData?.license}</div>
          </div>
          <div className="col">
            <div style={s.infoLabel}>STATUS</div>
            <div style={{ ...s.infoValue, color: "#00a6a6" }}>
              Registered · Verified
            </div>
          </div>
        </div>

        {/* MAIN BOX */}
        <div style={s.box}>
          <div style={s.boxTitle}>Certificate of Birth</div>
          <div style={s.boxSub}>
            {certificateData?.organization?.name} · {certificateData?.customId} · Govt. of {certificateData?.address?.stateId?.name}
          </div>

          <div style={s.centerText}>
            This is to certify that a child was born at this hospital:
          </div>

          {/* DETAILS GRID */}
          <div className="row" style={s.details}>
            <div className="col-6">
              <Row label="Child's Name" value={certificateData?.childName} />
              <Row label="Time of Birth" value={certificateData?.timeOfBirth}/>
              <Row label="Birth Weight" value={`${certificateData?.weight} Kg`} />
              <Row label="Father's Name" value={certificateData?.fatherName} />
              {certificateData?.fatherId?.nh12 && <Row label="Father's NHC-ID" value={certificateData?.fatherId?.nh12} />}
              <Row label="Delivery Type" value={`${certificateData?.deliveryType} Delivery`} />
            </div>

            <div className="col-6" style={s.rightCol}>
              <Row label="Date of Birth" value={new Date(certificateData?.dateOfBirth)?.toLocaleDateString('en-GB')} />
              <Row label="Gender" value={certificateData?.gender} />
              {certificateData?.childId?.nh12 && <Row label="NHC-P ID (Child)" value={certificateData?.childId?.nh12} />}
              <Row label="Mother's Name" value={certificateData?.motherName} />
              {certificateData?.motherId?.nh12 &&<Row label="Mother's NHC-P ID" value={certificateData?.motherId?.nh12} />}
              <Row label="Attending Doctor" value={`Dr. ${certificateData?.doctorId?.name}`} />
            </div>
          </div>

          {/* WATERMARK */}
          <div style={s.watermark}></div>

          {/* QR */}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={s.qr}>
              <QRCodeCanvas
                     value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                    size={256}
                    className="qr-code"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
            </div>
            <div style={s.qrText}>Scan to verify</div>
            <div style={s.link}>verify.neohealthcard.in</div>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="row text-center" style={{ marginTop: 40 }}>
          <div className="col">
            <div style={s.signName}>Dr. {certificateData?.doctorId?.name}</div>
            <div style={s.signMeta}>{certificateData?.specialty} specialist· · {certificateData?.organization?.name}</div>
            <div style={s.linkSmall}>{certificateData?.doctorId?.nh12}</div>
          </div>
          <div className="col">
            <div style={s.signName}>Registrar of Births</div>
            <div style={s.signMeta}>Govt. of {certificateData?.address?.stateId?.name} · BMC</div>
            <div style={s.linkSmall}>Reg. No. {certificateData?.license}</div>
          </div>
          <div className="col">
            <div style={s.signName}>{certificateData?.organization?.name}</div>
            <div style={s.signMeta}>Authorised Signatory</div>
            <div style={s.linkSmall}>{certificateData?.organization?.nh12}</div>
          </div>
        </div>

      <div style={s.footer}>
        {certificateData?.organization?.name}, {certificateData?.address?.cityId?.name} · {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
        <span style={{ float: "right" }}>Wishing you a speedy recovery</span>
      </div>
      </div>

    </div>
    </div>
    </>
  );
}

/* ---------- SMALL ROW COMPONENT ---------- */
const Row = ({ label, value }) => (
  <div style={s.row}>
    <div style={s.rowLabel}>{label}</div>
    <div style={s.rowValue}>{value}</div>
  </div>
);

/* ---------- STYLES ---------- */
const s = {
  page: {
    background: "#f4f6f7",
    padding: 20,
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    background: "#fff",
    padding: 24,
    maxWidth: 900,
    margin: "auto",
    borderRadius: 6,
    boxShadow: "0 0 0 1px #e5e5e5",
  },

  logo: {
    width: 34,
    height: 34,
    // borderRadius: "50%",
    // background: "linear-gradient(135deg,#00a6a6,#003c46)",
  },

  title: { fontSize: 20, fontWeight: 600 },
  subtitle: { fontSize: 14, fontWeight: 500 },
  meta: { fontSize: 11, color: "#777", lineHeight: "16px" },
  metaRight: { fontSize: 11, color: "#777" },

  badge: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid #00a6a6",
    color: "#00a6a6",
    marginBottom: 4,
    display: "inline-block",
  },

  infoRow: {
    marginTop: 16,
    paddingTop: 10,
    borderTop: "1px solid #eee",
    fontSize: 11,
  },
  infoLabel: { color: "#888", fontSize: 10 },
  infoValue: { fontWeight: 500, fontSize: 12 },

  box: {
    border: "2px solid #00a6a6",
    borderRadius: 12,
    marginTop: 20,
    padding: 30,
    position: "relative",
  },

  boxTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 600,
    color: "#00a6a6",
  },

  boxSub: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },

  centerText: {
    textAlign: "center",
    fontSize: 13,
    marginBottom: 20,
  },

  details: {
    fontSize: 13,
    padding: "0 10px",
  },

  rightCol: {
    borderLeft: "1px solid #e6e6e6",
    paddingLeft: 20,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  rowLabel: {
    color: "#666",
  },

  rowValue: {
    fontWeight: 500,
    textAlign: "right",
  },

  watermark: {
    position: "absolute",
    width: 260,
    height: 260,
    background: "#00a6a6",
    opacity: 0.05,
    borderRadius: "50%",
    left: "50%",
    top: "55%",
    transform: "translate(-50%, -50%)",
  },

  qr: {
    width: 90,
    height: 90,
    background: "#000",
    margin: "auto",
    borderRadius: 6,
  },

  qrText: { fontSize: 11, color: "#888" },
  link: { fontSize: 12, color: "#00a6a6", fontWeight: 500 },

  signName: { fontSize: 14, fontWeight: 600 },
  signMeta: { fontSize: 11, color: "#777" },
  linkSmall: { fontSize: 11, color: "#00a6a6" },

  footer: {
    marginTop: 10,
    background: "#00a6a6",
    color: "#fff",
    padding: "8px 20px",
    fontSize: 12,
  },
};