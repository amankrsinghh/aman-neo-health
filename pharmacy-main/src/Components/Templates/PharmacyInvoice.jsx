import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getApiData } from "../../Services/api";
import base_url from "../../baseUrl";
import { calculateAge } from "../../Services/globalFunction";
import './invoice.css'
const PharmacyInvoice = ({ sellId, pdfLoading, endLoading }) => {
  const { id } = useParams()
  const [ptData, setPtData] = useState()
  const [orgData, setOrgData] = useState()
  const [sellData, setSellData] = useState()
  const [vital, setVitals] = useState()
  async function fetchSellData() {
    if (!sellId && !id) {
      return
    }
    try {
      const res = await getApiData(`api/comman/pharmacy-invoice/${sellId || id}`)

      if (res.success) {
        setSellData(res.sellData)
        setOrgData(res?.orgData)
        setPtData(res.patientData)
      } else {
        toast.error(res.message)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchSellData()
  }, [sellId])
  const invoiceRef = useRef()
  const handleDownload = () => {
    try {

      const element = invoiceRef.current;
      document.body.classList.add("hide-buttons");
      const opt = {
        margin: 0.3,
        filename: `Pharmacy-invoicet-${sellData?.customId || sellData?._id?.slice(-6)}.pdf`,
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.classList.remove("hide-buttons");
      });
    } catch (error) {

    } finally {
      if (pdfLoading) endLoading();
      setSellData({});

    }
  };
  useEffect(() => {
    if (ptData && sellData && pdfLoading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ptData, sellData, pdfLoading]);
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  return (
    <div  className="invoice-wrapper d-flex justify-content-center py-5 bg-light" ref={invoiceRef}>
      <div className="invoice-card bg-white shadow" style={{width:'880px'}}>

        {/* HEADER */}
        <div className="d-flex justify-content-between p-4 border-bottom">
          <div className="d-flex gap-3">
                <div style={{width:'34px',height:'34px'}}>
                <img src={orgData?.logo ?
                  `${base_url}/${orgData?.logo}` : "/logo.png"} alt="" />
              </div>
            <div>
              <h5 className="fw-semibold mb-1">Pharmacy Invoice</h5>
              <div className="text-muted small">{orgData?.name}</div>
              <div className="text-muted small">
                {orgData?.address}
              </div>
            </div>
          </div>

          <div className="text-end">
            <span className="badge bg-teal text-white px-3 py-2">
              NeoHealthCard Network
            </span>
            <div className="small text-muted mt-2">
              {orgData?.email}
            </div>
            <div className="small text-muted">{orgData?.contactNumber}</div>
          </div>
        </div>

        {/* META */}
        <div className="row g-3 px-4 py-3 border-bottom small text-muted">
          <Meta title="Invoice ID" value={sellData?.customId || "123589"} />
          {sellData?.prescriptionId && <Meta title="Prescription Ref" value={sellData?.prescriptionId?.customId} />}
          <Meta title="Invoice Date" value={new Date(sellData?.createdAt)?.toLocaleDateString('en-GB')} />
          <Meta title="Pharmacist" value={orgData?.contactPerson} />
          <Meta title="Status" value={<span className="text-success">{sellData?.paymentStatus} · {sellData?.paymentMethod}</span>} />
        </div>

        {/* PATIENT */}
        <div className="px-4 py-3 border-bottom">
          <h6 className="fw-semibold mb-2">{sellData?.patientId?.name}</h6>
          <div className="row small text-muted">
            <div className="col">Age: {calculateAge(ptData?.dob, sellData?.createdAt) || '-'}</div>
            <div className="col">Sex: {ptData?.gender || '-'}</div>
            <div className="col">Blood:{ptData?.bloodGroup || '-'}</div>
            <div className="col">Contact: {ptData?.contactNumber}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-4">
          <table className="table table-borderless invoice-table">
            <thead className="text-muted small border-bottom">
              <tr>
                <th>Item</th>
                <th className="text-center">Batch</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Price</th>
                <th className="text-center">Discount</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {sellData?.products?.map((item, key) =>
                <Row key={key} item={item?.inventoryId?.medicineName} batch={item?.inventoryId?.batchNumber} qty={`${item?.quantity}`} price={`₹${item?.rate}`}
                  discount={`${item?.discountType == "Fixed" ? '₹' : '(%)'} ${item?.discountValue || 0}`} total={`₹${item?.totalAmount}`} />)}

            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="d-flex justify-content-end px-4 pb-4 border-top">
          <div className="totals-box">
            {/* <TotalRow label="Total" value={`"₹458.52"`} />
            <TotalRow label="GST" value="₹25.48" />
            <TotalRow label="Discount" value="-₹84.00" className="text-danger" /> */}
            <div className="d-flex gap-2 justify-content-between fw-bold fs-7 border-top pt-2 mt-2">
              <span>Grand Total </span>
              <span> ₹{sellData?.products?.reduce(
                (sum, s) => sum + Number(s.totalAmount || 0),
                0
              )}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="row border-top small text-muted">
          <div className="col p-3">
            <div className="text-secondary">Payment Mode</div>
            {sellData?.paymentMethod}
          </div>
          <div className="col p-3 border-start">
            <div className="text-secondary">Transaction ID</div>
            {sellData?.customId || sellData?._id?.slice(-6)}
          </div>
          <div className="col p-3 border-start">
            <div className="text-secondary">Status</div>
            <span className="text-success">{sellData?.paymentStatus}</span>
          </div>
        </div>

        <div className="footer-bar text-center text-white py-2">
          Wishing you a speedy recovery
        </div>

      </div>
    </div>
  );
};

const Meta = ({ title, value }) => (
  <div className="col">
    <div className="text-secondary">{title}</div>
    <div className="fw-medium text-dark">{value}</div>
  </div>
);

const Row = ({ item, batch, manufacturer, qty, price, gst, discount, total }) => (
  <tr className="border-bottom">
    <td>{item}</td>
    <td className="text-center">{batch}</td>
    <td className="text-center">x{qty}</td>
    <td className="text-center">{price}</td>
    <td className="text-center">{discount}</td>
    <td className="text-end">{total}</td>
  </tr>
);

const TotalRow = ({ label, value, className }) => (
  <div className={`d-flex justify-content-between ${className}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default PharmacyInvoice;