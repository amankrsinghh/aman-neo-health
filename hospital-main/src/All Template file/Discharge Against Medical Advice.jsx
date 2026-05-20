import React from "react";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PatientDAMAForm = () => {
  return (
    <div style={{ background: "#f3f4f6", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 1150, margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

        {/* HEADER */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <Row>
            <Col>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Discharge Against Medical Advice</div>
              <div style={{ fontSize: 12 }}>Apollo Ambulance Services</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                NHC-H-2022-MH-000009 · Reg. MH-HOSP-2010-00891 · NABH Accredited
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>
                Plot 22, Healthcare Ave, Andheri West, Mumbai – 400053
              </div>
            </Col>

            <Col style={{ textAlign: "right" }}>
              <div style={{ border: "1px solid #0ea5a4", color: "#0ea5a4", display: "inline-block", padding: "4px 10px", borderRadius: 20, fontSize: 11 }}>
                NeoHealthCard Network
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Fully Automated · Ecosystem Connected</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>hospital@apollogeneral.com · +91 98765 43210</div>
            </Col>
          </Row>
        </div>

        {/* META */}
        <Row style={{ padding: "10px 20px", fontSize: 11, borderBottom: "1px solid #e5e7eb" }}>
          <Col>DAMA ID<br /><b>NHC-INS-PA-2026-0410-00001</b></Col>
          <Col>DATE & TIME<br /><b>10/04/2026 09:30</b></Col>
          <Col>DISCHARGE REF<br /><b>NHC-ADM-2026-0410-00001</b></Col>
          <Col>DOCTOR<br /><b>Dr. Amit Mishra</b></Col>
          <Col>STATUS<br /><b style={{ color: "#0ea5a4" }}>DAMA – Signed</b></Col>
        </Row>

        {/* PATIENT */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <Row>
            <Col md={9}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>Vijay Kumar</div>
              <Row style={{ fontSize: 12 }}>
                <Col>Age / Sex: 24 / Male</Col>
                <Col>Email Address: V@gmail.com</Col>
                <Col>Patient ID: NHC-P-2026-MH-000123</Col>
              </Row>
              <Row style={{ fontSize: 12 }}>
                <Col>DOB: 15/03/2001</Col>
                <Col>Address: 32-A, Vashali Nagar, Jaipur</Col>
                <Col>Attending Doctor: DR. AMIT Mishra</Col>
              </Row>
              <Row style={{ fontSize: 12 }}>
                <Col>Blood: B+</Col>
                <Col>Contact no: +91 9658265898</Col>
                <Col>Hospital: Apollo General Hospital</Col>
              </Row>
            </Col>

            <Col md={3} style={{ textAlign: "center" }}>
              <div style={{ width: 90, height: 90, border: "1px solid #d1d5db", margin: "0 auto" }}></div>
              <div style={{ fontSize: 10 }}>Scan to verify</div>
              <div style={{ fontSize: 10, color: "#0ea5a4" }}>verify.neohealthcard.in</div>
            </Col>
          </Row>
        </div>

        {/* DAMA BOX */}
        <div style={{ margin: "16px 20px", border: "1.5px solid #0ea5a4", borderRadius: 10, background: "#f8fffe", padding: 18 }}>
          <div style={{ textAlign: "center", color: "#0ea5a4", fontWeight: 600, fontSize: 18 }}>
            Discharge Against Medical Advice (DAMA)
          </div>

          <div style={{ textAlign: "center", fontSize: 12, marginBottom: 10 }}>
            Apollo General Hospital · NHC-CONS-2026-0410-00001
          </div>

          <div style={{ fontSize: 12, textAlign: "center" }}>
            This is to certify that the patient:
            <br />
            Mr. Vijay Kumar | NHC-P: NHC-P-2026-MH-000123
            <br /><br />
            Is being discharged on personal request AGAINST MEDICAL ADVICE
            <br />
            on 12/04/2026 at 11:00 AM.
            <br /><br />
            Treating Doctor: Dr. Madhusudhan Singh
            <br />
            Diagnosis: Acute Viral Fever · Moderate Anemia
            <br />
            Condition at Discharge: Fever persisting (100.4F) · Anemia not resolved
            <br /><br />
            Risks explained to patient / guardian:
            <br />- Risk of fever worsening or returning
            <br />- Anemia may deteriorate without treatment
            <br />- Risk of complications including infection spread
            <br /><br />
            Patient / Guardian acknowledges above risks and accepts full responsibility.
            <br />Hospital is NOT liable for any complications arising post self-discharge.
          </div>
        </div>

        {/* SIGNATURES */}
        <Row style={{ marginTop: 60, textAlign: "center", padding: "0 20px" }}>
          <Col>
            <div>Dr. Amit Mishra</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Treating Physician - Apollo</div>
          </Col>
          <Col>
            <div>Vijay Kumar / Suresh Kumar</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Patient / Guardian (Accepting Risk)</div>
          </Col>
          <Col>
            <div>Nurse In-Charge</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Ward B-12 · Witness</div>
          </Col>
        </Row>

        {/* FOOTER */}
        <div style={{ background: "#0ea5a4", color: "#fff", fontSize: 11, padding: "6px 12px", display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <span>Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
};

export default PatientDAMAForm;
