import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { getApiData } from "../Services/api";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";

export default function ViewDeathCertificate() {
  const { id } = useParams()
  const pdfRef = useRef();
  const [certificateData, setCertificateData] = useState()
  async function fetchCertificateData(params) {
    try {
      const res = await getApiData(`api/certificate/death-data/${id}`)
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
              <h3 className="innr-title mb-2 gradient-text">Death Certificates</h3>
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
        <div ref={pdfRef} style={{ background: "#f5f6f7", padding: "30px", fontFamily: "Inter, Segoe UI, sans-serif" }}>
          <div
            style={{
              maxWidth: "980px",
              margin: "auto",
              background: "#fff",
              borderRadius: "6px",
              boxShadow: "0 0 0 1px #e5e7eb",
              overflow: "hidden"
            }}
          >

            {/* HEADER */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <div className="d-flex justify-content-between">

                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700 }}>Death Certificate</div>
                  <div style={{ fontSize: "13px", color: "#555" }}>{certificateData?.organization?.name}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {certificateData?.organization?.nh12} · Reg. {certificateData?.license}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {certificateData?.address?.fullAddress + ',' + certificateData?.address?.city?.name + ',' + certificateData?.address?.state?.name + ',' + certificateData?.address?.pinCode}
                  </div>
                </div>

                <div className="text-end">
                  <div
                    style={{
                      fontSize: "11px",
                      border: "1px solid #19b6b6",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      color: "#19b6b6",
                      display: "inline-block",
                      marginBottom: "4px"
                    }}
                  >
                    NeoHealthCard Network
                  </div>
                  <div style={{ fontSize: "11px", color: "#19b6b6" }}>
                    Fully Automated · Ecosystem Connected
                  </div>
                  <div style={{ fontSize: "11px", color: "#777" }}>
                    {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}
                  </div>
                </div>
              </div>

              {/* META */}
              <div className="row mt-3" style={{ fontSize: "11px", color: "#666" }}>
                <div className="col">
                  CERTIFICATE ID<br />
                  <span style={{ color: "#000", fontWeight: 500 }}>{certificateData?.customId}</span>
                </div>
                <div className="col">
                  ISSUE DATE<br />
                  <span style={{ color: "#000", fontWeight: 500 }}>{new Date(certificateData?.customId)?.toLocaleDateString('en-GB')}</span>
                </div>
                <div className="col">
                  REGISTRATION NO.<br />
                  <span style={{ color: "#000", fontWeight: 500 }}>{certificateData?.license}</span>
                </div>
                <div className="col">
                  STATUS<br />
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>Registered · Verified</span>
                </div>
              </div>
            </div>

            {/* CERTIFICATE BOX */}
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  border: "1.5px solid #19b6b6",
                  borderRadius: "10px",
                  padding: "30px 28px",
                  textAlign: "center",
                  position: "relative"
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: 600, color: "#19b6b6" }}>
                  Certificate of Death
                </div>

                <div style={{ fontSize: "12px", color: "#666", marginTop: "6px" }}>
                  {certificateData?.organization?.name} · {certificateData?.customId} · Govt. of {certificateData?.address?.state?.name}
                </div>

                <div style={{ fontSize: "12px", marginTop: "18px", color: "#444" }}>
                  This is to certify that the following person passed away at this hospital:
                </div>

                {/* DETAILS */}
                <div className="row text-start mt-4" style={{ fontSize: "12px" }}>
                  <div className="col-6 pe-4">
                    <div className="mb-2"><span style={{ color: "#888" }}>Full Name</span><br /><b>{certificateData?.fullName}</b></div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Gender</span><br />{certificateData?.gender}</div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Date of Death</span><br />{new Date(certificateData?.dateOfDeath)?.toLocaleDateString('en-GB')}</div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Place of Death</span><br />{certificateData?.placeOfDeath}</div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Contributing Cause</span><br />{certificateData?.contributingCause || '-'}</div>
                    <div><span style={{ color: "#888" }}>Certifying Doctor</span><br />Dr. {certificateData?.doctorId?.name}</div>
                  </div>

                  <div className="col-6 ps-4" style={{ borderLeft: "1px solid #e5e7eb" }}>
                    <div className="mb-2"><span style={{ color: "#888" }}>Age at Death</span><br />{certificateData?.ageAtDeath} Years</div>
                    {certificateData?.patientId && <div className="mb-2"><span style={{ color: "#888" }}>NHC-P ID</span><br />{certificateData?.patientId?.nh12}</div>}
                    <div className="mb-2"><span style={{ color: "#888" }}>Time of Death</span><br />{certificateData?.timeOfDeath}</div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Cause of Death</span><br />{certificateData?.causeOfDeath}</div>
                    <div className="mb-2"><span style={{ color: "#888" }}>Manner of Death</span><br />{certificateData?.mannerOfDeath || '-'}</div>
                    <div><span style={{ color: "#888" }}>Next of Kin</span><br />{certificateData?.nextOfKin?.name} ({certificateData?.nextOfKin?.relation})</div>
                  </div>
                </div>

                {/* QR */}
                <div style={{ marginTop: "28px" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    margin: "auto",
                  }}>
                    <QRCodeCanvas
                      value={`https://www.neohealthcard.com/certificate/${certificateData?.customId}`}
                      size={256}
                      className="qr-code"
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "6px" }}>Scan to verify</div>
                  <div style={{ fontSize: "11px", color: "#19b6b6" }}>verify.neohealthcard.in</div>
                </div>
              </div>
            </div>

            {/* SIGNATURE */}
            <div className="row text-center" style={{ borderTop: "1px solid #e5e7eb" }}>
              <div className="col" style={{ padding: "18px" }}>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>Dr. {certificateData?.doctorId?.name}</div>
                <div style={{ fontSize: "11px", color: "#777" }}>{certificateData?.specialty} specialist· · {certificateData?.organization?.name}</div>
                <div style={{ fontSize: "11px", color: "#19b6b6" }}>{certificateData?.doctorId?.nh12}</div>
              </div>

              <div className="col" style={{ padding: "18px", borderLeft: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>Registrar of Deaths</div>
                <div style={{ fontSize: "11px", color: "#777" }}>Govt. of {certificateData?.address?.state?.name} · BMC</div>
                <div style={{ fontSize: "11px", color: "#19b6b6" }}>Reg. No. {certificateData?.license}</div>
              </div>

              <div className="col" style={{ padding: "18px", borderLeft: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>{certificateData?.organization?.name}</div>
                <div style={{ fontSize: "11px", color: "#777" }}>Authorised Signatory</div>
                <div style={{ fontSize: "11px", color: "#19b6b6" }}>{certificateData?.organization?.nh12}</div>
              </div>
            </div>

            {/* FOOTER */}
            <div style={{
              background: "#0ea5a5",
              color: "#fff",
              fontSize: "11px",
              padding: "8px 16px",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div>{certificateData?.organization?.name}, {certificateData?.address?.city?.name} · {certificateData?.organization?.email} · {certificateData?.organization?.contactNumber}</div>
              <div>Wishing you a speedy recovery</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}