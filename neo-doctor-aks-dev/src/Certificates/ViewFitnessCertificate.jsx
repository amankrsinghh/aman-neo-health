import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiData } from "../Services/api";
import { QRCodeCanvas } from "qrcode.react"
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
export default function ViewFitnessCertificate() {
  const { id } = useParams()
  const pdfRef = useRef();
  const [certificateData, setCertificateData] = useState()
  async function fetchCertificateData(params) {
    try {
      const res = await getApiData(`api/certificate/fitness-data/${id}`)
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

        <div style={styles.page} ref={pdfRef}>
          <div style={styles.card}>

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex">
                <div style={styles.logo}>
                  <img src="/logo.png" alt="" />
                </div>
                <div className="ms-2">
                  <div style={styles.title}>Fitness Certificate</div>
                  <div style={styles.subtitle}>{certificateData?.organization?.name}</div>
                  <div style={styles.meta}>
                    {certificateData?.nh12}<br />
                    {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                  </div>
                </div>
              </div>

              <div className="text-end">
                <div style={styles.badge}>NeoHealthCard Network</div>
                <div style={styles.metaRight}>
                  Fully Automated · Ecosystem Connected<br />
                  {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
                </div>
              </div>
            </div>

            {/* INFO ROW */}
            <div className="row text-muted mb-3" style={{ fontSize: 12 }}>
              <div className="col">CERTIFICATE ID<br /><b>{certificateData?.customId}</b></div>
              <div className="col">ISSUE DATE<br /><b>{new Date(certificateData?.examinDate)?.toLocaleDateString('en-GB')}</b></div>
              <div className="col">PURPOSE<br /><b>{certificateData?.purpose}</b></div>
              <div className="col">VALID UNTIL<br /><b>{new Date(certificateData?.effectiveDate)?.toLocaleDateString('en-GB')}</b></div>
              <div className="col">STATUS<br /><span style={{ color: "#00a6a6", fontWeight: 600 }} className="text-capitalize">Verified · {certificateData?.status}</span></div>
            </div>

            {/* MAIN CERTIFICATE BOX */}
            <div style={styles.box}>
              <div style={styles.boxTitle}>Certificate of Fitness</div>
              <div style={styles.boxSub}>{certificateData?.organization?.name} · {certificateData?.organization?.nh12}</div>

              <div style={styles.centerText}>
                This is to certify that
              </div>

              <div style={styles.name}>{certificateData?.patientId?.name}</div>

              <div style={styles.desc}>
                Age: {certificateData?.age} Years · Gender: {certificateData?.gender} · {certificateData?.patientId?.nh12}<br />
                was examined by the undersigned on <b>{new Date(certificateData?.examinDate)?.toLocaleDateString('en-GB')}</b> and is found to be medically FIT to resume<br />
                work / school / normal duties effective <b>{new Date(certificateData?.effectiveDate)?.toLocaleDateString('en-GB')}</b>, subject to the following conditions:
              </div>

              {certificateData?.condition && <div style={styles.desc}>
                Conditions: {certificateData?.condition}
              </div>}

              {/* WATERMARK */}
              <div style={styles.watermark}></div>

              {/* QR */}
              <div className="text-center mt-4">
                <div style={styles.qr}>
                  <QRCodeCanvas
                     value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                    size={256}
                    className="qr-code"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <div style={styles.qrText}>Scan to verify</div>
                <div style={styles.link}>verify.neohealthcard.in</div>
              </div>
            </div>

            {/* FOOTER SIGN */}
            <div className="row mt-5 text-center">
              <div className="col">
                <div style={styles.signName}>Dr. {certificateData?.doctorId?.name}</div>
                <div style={styles.signMeta}>{certificateData?.specialty} specialist· {certificateData?.organization?.name}</div>
                <div style={styles.linkSmall}>{certificateData?.doctorId?.nh12} </div>
              </div>
              <div className="col">
                <div style={styles.signName}>Hospital Seal & Stamp</div>
                <div style={styles.signMeta}>{certificateData?.organization?.name}</div>
                <div style={styles.linkSmall}>{certificateData?.organization?.nh12}</div>
              </div>
            </div>

            <div style={styles.footerBar} className="mt-3">
              {certificateData?.organization?.name}, {certificateData?.address?.city?.name} · {certificateData?.organization?.name} · {certificateData?.organization?.contactNumber}
              <span style={{ float: "right" }}>Wishing you a speedy recovery</span>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f4f6f7",
    padding: 20,
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 0 0 1px #e6e6e6",
    maxWidth: 900,
    margin: "auto",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    // background: "linear-gradient(135deg, #00a6a6, #003c46)",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
  },
  meta: {
    fontSize: 11,
    color: "#777",
    lineHeight: "16px",
  },
  metaRight: {
    fontSize: 11,
    color: "#777",
  },
  badge: {
    background: "#e6f7f7",
    color: "#00a6a6",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    display: "inline-block",
    marginBottom: 5,
  },

  box: {
    border: "2px solid #00a6a6",
    borderRadius: 12,
    padding: 30,
    textAlign: "center",
    position: "relative",
  },
  boxTitle: {
    color: "#00a6a6",
    fontSize: 22,
    fontWeight: 600,
  },
  boxSub: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  centerText: {
    fontSize: 13,
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 15,
  },
  desc: {
    fontSize: 13,
    color: "#444",
    lineHeight: "20px",
    marginBottom: 12,
  },

  watermark: {
    position: "absolute",
    width: 220,
    height: 220,
    background: "#00a6a6",
    opacity: 0.05,
    borderRadius: "50%",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  qr: {
    width: 90,
    height: 90,
    margin: "auto",
    background: "#000",
    borderRadius: 6,
  },
  qrText: {
    fontSize: 11,
    color: "#888",
  },
  link: {
    fontSize: 12,
    color: "#00a6a6",
    fontWeight: 500,
  },

  signName: {
    fontSize: 14,
    fontWeight: 600,
  },
  signMeta: {
    fontSize: 11,
    color: "#777",
  },
  linkSmall: {
    fontSize: 11,
    color: "#00a6a6",
  },

  footerBar: {
    background: "#00a6a6",
    color: "#fff",
    padding: "8px 20px",
    fontSize: 12,
    marginTop: 10,
  },
};