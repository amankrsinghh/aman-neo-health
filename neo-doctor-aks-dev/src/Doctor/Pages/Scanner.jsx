import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library";

export default function Scanner({ onDetected }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const hints = new Map();
    const formats = [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.ITF,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    codeReader.current = new BrowserMultiFormatReader(hints);

    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    setError("");
    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!devices.length) {
        setError("No camera found.");
        return;
      }

      const selectedDeviceId = devices[0].deviceId;
      setScanning(true);

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (res, err) => {
          if (res) {
            const text = res.getText();
            setResult(text);
            onDetected?.(text);
          }
          if (err && !(err.name === "NotFoundException")) {
            console.warn("Scan error:", err);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError("Camera access failed.");
    }
  };

  const stopScanner = () => {
    try {
      codeReader.current?.reset();
      setScanning(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = URL.createObjectURL(file);
      const result = await codeReader.current.decodeFromImageUrl(img);
      if (result) {
        const text = result.getText();
        setResult(text);
        onDetected?.(text);
      } else setError("No barcode found in image.");
    } catch (error) {
      setError("Failed to scan image.");
    }
    e.target.value = "";
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >

      <div
        style={{
          position: "relative",
          border: "2px solid transparent",
          borderRadius: "12px",
          overflow: "hidden",
          margin: "10px 0",
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
          }}
        />


        <div className="scanner-frame"></div>
        <div className="scan-line"></div>
      </div>

      {/* <div style={{ marginTop: "10px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileScan}
            style={{ marginLeft: "8px" }}
          />
      </div> */}

      {result && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          ✅ Barcode: {result}
        </p>
      )}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>⚠ {error}</p>
      )}

    </div>
  );
}
