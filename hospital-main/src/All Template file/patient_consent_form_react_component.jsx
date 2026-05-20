import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import { getApiData } from "../Service/api";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { calculateAge } from "../Service/globalFunction";
import { QRCodeCanvas } from "qrcode.react";
import base_url from "../baseUrl";

const styles = {
  page: {
    background: "#f3f4f6",
    padding: "24px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  wrapper: {
    maxWidth: "1150px",
    margin: "0 auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
  },
  header: {
    padding: "16px 20px 10px",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    width: 34,
    height: 34,
  },
  title: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#111827",
  },
  sub: { fontSize: "12px", color: "#6b7280" },
  small: { fontSize: "11px", color: "#6b7280" },
  metaRow: {
    padding: "10px 20px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "11px",
  },
  patientBlock: {
    padding: "14px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  patientName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  consentBox: {
    margin: "16px 20px",
    border: "1.5px solid #0ea5a4",
    borderRadius: "10px",
    background: "#f8fffe",
    padding: "18px",
  },
  consentTitle: {
    textAlign: "center",
    color: "#0ea5a4",
    fontWeight: 600,
    fontSize: "18px",
  },
  footerBar: {
    background: "#0ea5a4",
    color: "#fff",
    fontSize: "11px",
    padding: "6px 12px",
    display: "flex",
    justifyContent: "space-between",
  },
};

const PatientConsentForm = ({ insertId, pdfLoading, endLoading }) => {
  const { id } = useParams()
  const [hospitalData, setHospitalData] = useState(null);
  const [nh12, setNh12] = useState()
  const [patientData, setPatientData] = useState()
  const [consentData, setConsentData] = useState()
  const [isDownloaded, setIsDownloaded] = useState(false);

  const invoiceRef = useRef();

  const handleDownload = () => {
    try {
      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0,
        filename: `Consent-letter-${patientData?.nh12}.pdf`,
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

  async function fetchConsentData() {
    if (!insertId) {
      return
    }
    try {
      const res = await getApiData(`api/comman/consent-letter/${insertId || id}`);
      if (res.success) {
        setHospitalData(res.hospitalData);
        setNh12(res.customId)
        setConsentData(res.consent)
        setPatientData(res.ptData)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  // ✅ Fetch data when insert comes
  useEffect(() => {
    if (insertId || id) {
      fetchConsentData(); // FIXED
    }
  }, [insertId, id]);


  useEffect(() => {
    if (consentData && patientData && hospitalData && pdfLoading) {
      const timer = setTimeout(handleDownload, 1500);
      return () => clearTimeout(timer);
    }
  }, [consentData, patientData, hospitalData, pdfLoading]);
  return (
    <div style={styles.page} ref={invoiceRef}>
      <div style={styles.wrapper}>
        {/* HEADER */}
        <div style={styles.header}>
          <Row>
            <Col>
              <div className="d-flex gap-2">
                <div style={styles.logo}>
                  <img src={hospitalData?.logo ?
                    `${base_url}/api/file/${hospitalData?.logo}` : "/logo.png"} alt="" />
                </div>
                <div>
                  <div style={styles.title}>Patient Consent Form</div>
                  <div style={styles.sub}>{hospitalData?.name}</div>
                  <div style={styles.small}>
                    {hospitalData?.nh12}
                  </div>
                  <div style={styles.small}>
                    {hospitalData?.address}
                  </div>
                </div>
              </div>
            </Col>

            <Col style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  border: "1px solid #0ea5a4",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  color: "#0ea5a4",
                  marginBottom: "4px",
                }}
              >
                NeoHealthCard Network
              </div>
              <div style={styles.small}>
                Fully Automated · Ecosystem Connected
              </div>
              <div style={styles.small}>
                {hospitalData?.email} · {hospitalData?.contactNumber}
              </div>
            </Col>
          </Row>
        </div>

        {/* META */}
        <Row style={styles.metaRow}>
          {/* <Col>CONSENT ID<br /><b>NHC-INS-PA-2026-0410-00001</b></Col> */}
          <Col>DATE & TIME<br /><b>{new Date(consentData?.createdAt)?.toLocaleString('en-GB')}</b></Col>
          <Col>ADMISSION REF<br /><b>{consentData?.allotmentId?.customId}</b></Col>
          <Col>DOCTOR<br /><b>{consentData?.allotmentId?.primaryDoctorId?.name}</b></Col>
          <Col>STATUS<br /><b style={{ color: "#0ea5a4" }}>Signed</b></Col>
        </Row>

        {/* PATIENT */}
        <div style={styles.patientBlock}>
          <Row>
            <Col md={9}>
              <div style={styles.patientName}>{patientData?.name}</div>
              <Row style={{ fontSize: "12px" }}>
                <Col>Age / Sex: {calculateAge(patientData?.dob, consentData?.createdAt)} / {patientData?.gender}</Col>
                <Col>Email Address: {patientData?.email}</Col>
                <Col>Patient ID: {patientData?.nh12}</Col>
              </Row>
              <Row style={{ fontSize: "12px" }}>
                <Col>DOB: {new Date(patientData?.dob)?.toLocaleDateString('en-GB')}</Col>
                <Col>Address: {patientData?.address},{patientData?.cityId?.name} </Col>
                <Col>Guardian Name: {patientData?.contact?.emergencyContactName}</Col>
              </Row>
              <Row style={{ fontSize: "12px" }}>
                <Col>Blood: {patientData?.bloodGroup}</Col>
                <Col>Contact no: {patientData?.contactNumber}</Col>
                <Col>Guardian Contact: {patientData?.contact?.emergencyContactNumber}</Col>
              </Row>
            </Col>

            <Col md={3} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  border: "1px solid #d1d5db",
                  margin: "0 auto",
                }}
              >
                <QRCodeCanvas
                  value={`https://www.neohealthcard.com/patient-consent-letter/${insertId}`}
                  size={256}
                  className="qr-code"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <div style={{ fontSize: "10px", marginTop: "4px" }}>
                Scan to verify
              </div>
              <div style={{ fontSize: "10px", color: "#0ea5a4" }}>
                verify.neohealthcard.in
              </div>
            </Col>
          </Row>
        </div>

        {/* CONSENT */}
        <div style={styles.consentBox}>
          <div style={styles.consentTitle}>Informed Consent to Treatment</div>
          <div style={{ textAlign: "center", fontSize: "12px", marginBottom: 10 }}>
            {hospitalData?.name} · {hospitalData?.nh12}
          </div>

          <div style={{ fontSize: "12px", textAlign: "center" }}>
            I / We, the undersigned, hereby consent to the following
          </div>

          <ol style={{ fontSize: "12px", marginTop: 10, textAlign: 'center' }}>
            <li>Admission and treatment of {patientData?.name}</li>
            <li>Clinical investigations as deemed necessary</li>
            <li>Medications, IV fluids, and blood tests</li>
            <li>Minor procedures including IV insertion</li>
            <li>Photography for medical purposes</li>
          </ol>

          <div style={{ fontSize: "12px", marginTop: 10, textAlign: 'center' }}>
            <div style={{ textAlign: "center" }}>I understand that:</div>
            <div>- No guarantee of specific outcome</div>
            <div>- I may withdraw consent anytime</div>
            <div>- Medical info may be shared</div>
            <div>- Records stored digitally</div>
          </div>
        </div>

        {/* PROCEDURES */}
        <div style={{ padding: "0 20px", fontSize: "12px" }}>
          <div style={{ marginBottom: 6 }}>
            PROCEDURES CONSENTED (CHECK APPLICABLE)
          </div>
          <Row>
            <Col>[✔] IV Fluid Therapy</Col>
            <Col>[✔] Blood Transfusion</Col>
            <Col>[✔] Surgery</Col>
            <Col>[✔] Anesthesia</Col>
          </Row>
          <Row>
            <Col>[✔] CBC / Lab Tests</Col>
            <Col>[✔] X-Ray / Imaging</Col>
            <Col>[✔] ICU Admission</Col>
            <Col>[✔] Transfer to Another Hospital</Col>
          </Row>
        </div>

        {/* SIGNATURES */}
        <Row style={{ marginTop: 60, textAlign: "center", padding: "0 20px" }}>
          <Col>
            <div>{consentData?.allotmentId?.primaryDoctorId?.name}</div>
            <div style={styles.small}>Treating Physician - Apollo</div>
          </Col>
          <Col>
            <div>{patientData?.name} / {patientData?.contact?.emergencyContactName}</div>
            <div style={styles.small}>Patient / Guardian</div>
          </Col>
          <Col>
            <div>Witness</div>
            <div style={styles.small}>Hospital Staff – Front Desk</div>
          </Col>
        </Row>

        {/* FOOTER */}
        <div style={styles.footerBar}>
          <span>
            {hospitalData?.name}, {hospitalData?.address} · {hospitalData?.email} · {hospitalData?.contactNumber}
          </span>
          <span>Wishing you a speedy recovery</span>
        </div>
      </div>
    </div>
  );
};

export default PatientConsentForm;
