import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiData } from "../Service/api";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import { calculateAge } from "../Service/globalFunction";
import base_url from "../baseUrl";
import { QRCodeCanvas } from "qrcode.react";

const DoctorEmpanelmentCert = ({hospitalId,doctorId, pdfLoading, endLoading }) => {
  const { id } = useParams();
  // const hospitalId = "69ea09079f8fa274919f2d45"
  // const doctorId = "69eb577df76821d368f37ebc"
  const [certData, setCertData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [labData, setLabData] = useState(null);
  const [sampleList, setSampleList] = useState([]);

  const invoiceRef = useRef();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  async function fetchAllotmentDetail() {
    if (!doctorId && !hospitalId) {
      return
    }
    try {
      const res = await getApiData(
        `api/comman/doctor-empanelment/${doctorId}/${hospitalId}`
      );
      if (res.success) {
        setCertData(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    if (hospitalId && doctorId) fetchAllotmentDetail();
  }, [hospitalId, doctorId]);

  // ── PDF Download ───────────────────────────────────────────────────────────
  const handleDownload = () => {
    try {
      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `Doctor-Empanelment-Certificate-${certData?.doctorName}.pdf`,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => document.body.classList.remove("hide-buttons"));
    } catch (_) {
    } finally {
      if (pdfLoading) endLoading();
    }
  };

  useEffect(() => {
    if (certData && hospitalId && doctorId && pdfLoading) {
      const timer = setTimeout(handleDownload, 1500);
      return () => clearTimeout(timer);
    }
  }, [certData, hospitalId, doctorId, pdfLoading]);
  return (
    <div ref={invoiceRef} style={{ background: "#f4f6f8", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width:'100%', maxWidth: '794px', margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <div className="d-flex gap-3">
            <div style={{ width: '34px', height: '34px' }}>
              <img src={certData?.orgLogo ?
                `${base_url}/${certData?.orgLogo}` : "/logo.png"} alt="" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Doctor Empanelment Certificate</div>
              <div style={{ fontSize: 12 }}>{certData?.orgName}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {certData?.orgNh12}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                {certData?.address}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ border: "1px solid #0ea5a4", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "#0ea5a4" }}>
              NeoHealthCard Network
            </div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Fully Automated · Ecosystem Connected</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>
              {certData?.orgEmail} · {certData?.orgContactNumber}
            </div>
          </div>
        </div>

        {/* META */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: "1px solid #e5e7eb" }}>
          {[
            ["HOSPITAL NHC ID", certData?.orgNh12],
            ["DATE & TIME", new Date()?.toLocaleString()],
            ["DOCTOR NHC ID", certData?.doctorNh12],
            ["RELEASED TO", certData?.doctorName],
            ["STATUS", "Paid"]
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 14px", borderRight: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 10, color: "#6b7280" }}>{item[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: i === 4 ? "#0ea5a4" : "#111827" }}>
                {item[1]}
              </div>
            </div>
          ))}
        </div>

        {/* CERTIFICATE */}
        <div style={{ padding: 20 }}>
          <div
            style={{
              border: "2px solid #0ea5a4",
              borderRadius: 12,
              padding: "30px 40px",
              textAlign: "center",
              lineHeight: "1.6"
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0ea5a4" }}>
              Doctor Empanelment Certificate
            </div>

            <div style={{ fontSize: 12, marginTop: 6 }}>
              {certData?.orgName} · {certData?.orgNh12} · NeoHealthCard Network
            </div>

            <div style={{ marginTop: 18, fontSize: 13 }}>
              This is to certify that
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>
              {certData?.doctorName}
            </div>

            <div style={{ fontSize: 12 }}>{certData?.doctorRole} — {certData?.doctorSpecialty}</div>

            {/* <div style={{ fontSize: 12, marginTop: 4 }}>
              MMC Registration No.: MMC-2016-04821
            </div> */}

            <div style={{ fontSize: 12 }}>
              NHC Doctor ID: {certData?.doctorNh12}
            </div>

            <div style={{ marginTop: 16, fontSize: 12 }}>
              has been successfully verified, credentialed, and empanelled
              <br />
              as an authorised provider on the NeoHealthCard Network
            </div>

            <div style={{ marginTop: 14, fontSize: 12 }}>
              Empanelled at: {certData?.orgName} ({certData?.orgNh12})
              <br />
              Specialisation: General Medicine · OPD & IPD
            </div>

            <div style={{ marginTop: 14, fontSize: 12 }}>
              Valid From: {new Date(certData?.contractStart)?.toLocaleDateString('en-GB')} | Valid Until: {new Date(certData?.contractEnd)?.toLocaleDateString('en-GB')}
            </div>

            <div style={{ fontSize: 12, marginTop: 6 }}>
              This doctor is authorised to issue digitally signed prescriptions,
              lab orders, certificates and referrals on the NeoHealthCard ecosystem.
            </div>
          </div>
        </div>

        {/* SIGNATURE */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #e5e7eb", padding: "20px", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 13 }}>NHC Medical Board</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>NeoHealthCard Credentialing</div>
            <div style={{ fontSize: 10, color: "#0ea5a4" }}>admin@neohealthcard.in</div>
          </div>

          <div>
            <div style={{ fontSize: 13 }}>{certData?.doctorName}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Empanelled Doctor</div>
            <div style={{ fontSize: 10, color: "#0ea5a4" }}>
              {certData?.doctorNh12}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13 }}>{certData?.orgName}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Empanelled Hospital</div>
            <div style={{ fontSize: 10, color: "#0ea5a4" }}>
              {certData?.orgNh12}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ background: "#0ea5a4", color: "#fff", fontSize: 11, padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
          <span>
            {certData?.orgName}, {certData?.address} · {certData?.orgEmail} · {certData?.orgContactNumber}
          </span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
};

export default DoctorEmpanelmentCert;