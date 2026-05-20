import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Invoice = () => {
  return (
    <div style={{ background: "#f3f4f6", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 1150, margin: "0 auto", background: "#fff", border: "1px solid #e5e7eb" }}>

        {/* HEADER */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <Row>
            <Col>
              <div style={{ fontSize: 22, fontWeight: 600 }}>Doctor Consultation Invoice</div>
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
          <Col>INVOICE ID<br /><b>NHC-AMB-DISP-2026-0412-00001</b></Col>
          <Col>DATE & TIME<br /><b>12/04/2026 12:05</b></Col>
          <Col>VISIT TYPE<br /><b>OPD</b></Col>
          <Col>OPD REF<br /><b>NHC-OPD-2026-0412-00022</b></Col>
          <Col>STATUS<br /><b style={{ color: "#0ea5a4" }}>Paid</b></Col>
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
                <Col>Referred By: Self – Walk-in</Col>
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

        {/* CONSULTATION DETAILS */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", fontSize: 12 }}>
          <Row>
            <Col md={6}>
              <div><b>Doctor</b> Dr. Amit Mishra</div>
              <div><b>Qualification</b> MD, General Physician</div>
              <div><b>NHC-ID</b> NHC-D-2024-MH-004512</div>
              <div><b>MMC Reg</b> MMC-2016-04821</div>
              <div><b>Clinic / Room</b> OPD Room 3</div>
            </Col>
            <Col md={6}>
              <div><b>Consultation Type</b> New Patient · In-Person</div>
              <div><b>Appointment</b> 12/04/2026 10:30 AM</div>
              <div><b>Consultation Duration</b> 25 minutes</div>
              <div><b>Chief Complaint</b> Fever · Fatigue</div>
              <div><b>Diagnosis</b> Acute Viral Fever</div>
            </Col>
          </Row>
        </div>

        {/* TABLE */}
        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: 11, marginBottom: 6 }}>INVOICE BREAKDOWN</div>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>SERVICE</th>
                <th>SAC CODE</th>
                <th>GST%</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New Patient Consultation Fee – Dr. Amit Mishra</td>
                <td>999319</td>
                <td>0%</td>
                <td>Rs.500.00</td>
              </tr>
              <tr>
                <td>Medical History Review & Documentation</td>
                <td>999319</td>
                <td>0%</td>
                <td>Rs.200.00</td>
              </tr>
              <tr>
                <td>Clinical Examination – Full Physical Assessment</td>
                <td>999319</td>
                <td>0%</td>
                <td>Rs.150.00</td>
              </tr>
              <tr>
                <td>Prescription Writing & Medication Plan</td>
                <td>999319</td>
                <td>0%</td>
                <td>Rs.100.00</td>
              </tr>
            </tbody>
          </Table>

          <div style={{ textAlign: "right", fontSize: 12 }}>
            <div>Total Consultation Fee Rs.1,000.00</div>
            <div>GST (0% – Healthcare) Rs.0.00</div>
            <div style={{ fontWeight: 600 }}>Grand Total Rs.1,000.00</div>
          </div>
        </div>

        {/* PAYMENT */}
        <Row style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", fontSize: 12 }}>
          <Col>Payment Mode<br />UPI</Col>
          <Col>Transaction ID<br />TXN-2026041200083</Col>
          <Col>Status<br />Paid</Col>
        </Row>

        {/* NOTES */}
        <div style={{ padding: "14px 20px", fontSize: 11 }}>
          <div><b>NOTES</b></div>
          <ol>
            <li>Consultation fee covers initial assessment, diagnosis, prescription and follow-up plan.</li>
            <li>Follow-up visits within 7 days are charged at reduced rate Rs.300.</li>
            <li>Lab tests and medicine charges billed separately.</li>
            <li>This invoice is for professional services only.</li>
          </ol>
        </div>

        {/* SIGN */}
        <Row style={{ textAlign: "center", padding: "20px" }}>
          <Col>
            <div>Dr. Amit Mishra</div>
            <div style={{ fontSize: 11 }}>MD, General Physician · Apollo</div>
          </Col>
          <Col>
            <div>Vijay Kumar</div>
            <div style={{ fontSize: 11 }}>Patient</div>
          </Col>
        </Row>

        {/* FOOTER */}
        <div style={{ background: "#0ea5a4", color: "#fff", fontSize: 11, padding: "6px 12px", display: "flex", justifyContent: "space-between" }}>
          <span>Apollo General Hospital, Mumbai · hospital@apollogeneral.com · +91 98765 43210</span>
          <span>Wishing you a speedy recovery</span>
        </div>

      </div>
    </div>
  );
};

export default Invoice;