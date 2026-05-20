function formatDateTime(dateValue) {
  const date = new Date(dateValue);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  return `${day} ${month} ${year}, at ${hours}:${minutes}${ampm}`;
}
const calculateAge = (dob, asOfDate = new Date()) => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const refDate = new Date(asOfDate);

  let age = refDate.getFullYear() - birthDate.getFullYear();

  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  const dayDiff = refDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
const languageOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Bengali", label: "Bengali" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Marathi", label: "Marathi" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Kannada", label: "Kannada" },
  { value: "Urdu", label: "Urdu" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" }
];
const specialtyOptions = [
  { value: "General Medicine", label: "General Medicine" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "ENT", label: "ENT" },
  { value: "Gynecology", label: "Gynecology" },
  { value: "Urology", label: "Urology" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Oncology", label: "Oncology" },
  { value: "Nephrology", label: "Nephrology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Rheumatology", label: "Rheumatology" },
  { value: "Physiotherapy", label: "Physiotherapy" },
  { value: "Dentistry", label: "Dentistry" }
];

const calculatePaymentDetails = (item) => {
  const pricePerDay = Number(item?.bedId?.pricePerDay || 0);

  const startDate = new Date(item?.allotmentDate);
  const endDate =
    item?.status === "Discharged" && item?.dischargeDate
      ? new Date(item.dischargeDate)
      : new Date(); // till today if active

  // calculate number of days (minimum 1)
  const diffTime = Math.abs(endDate - startDate);
  const days = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

  const totalAmount = days * pricePerDay;

  const paidAmount = item?.payments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

  const pendingAmount = Math.max(totalAmount - paidAmount, 0);

  return {
    days,
    totalAmount,
    paidAmount,
    pendingAmount,
    paymentStatus: pendingAmount === 0 ? "Payment Complete" : "Payment Pending",
  };
};
const saveFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const token = await getToken(messaging, {
      vapidKey: "BBhhJGO7sE7RgSoez4GqQoRlK04U-P-Mem9V6DHypsgNbCcIKWUrnL3nN9SzxUL0zxIsQ06LlVsrEYr8dHaqpVc"
    });

    if (token) {
      await API.post("/comman/save-fcm-token", { fcmToken: token });
      console.log("✅ FCM Token Saved");
    }
  } catch (err) {
    console.error("FCM error", err);
  }
};
const getDaysBetweenDates = (from, to) => {
  if (!from || !to) return 0;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diffTime = toDate - fromDate;

  // +1 because same day = 1 day
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 0;
};
const handleCloseModal = (name) => {
  console.log("click", name)
  const modal = document.getElementById(name);
  if (modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
  }

  // remove backdrop
  const backdrops = document.getElementsByClassName("modal-backdrop");
  while (backdrops.length > 0) {
    backdrops[0].parentNode.removeChild(backdrops[0]);
  }

  // remove body class
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};
const stripHtml = (html) => {
  if (!html) return "";

  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
export { handleCloseModal, formatDateTime, stripHtml, calculateAge, specialtyOptions, languageOptions, calculatePaymentDetails, saveFcmToken, getDaysBetweenDates }