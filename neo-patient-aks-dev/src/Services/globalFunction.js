import { messaging } from "../firebase";

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
const calculateAge = (dob) => {
  if (!dob) return "";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--; // haven't had birthday yet this year
  }
  return age;
}

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};;

const saveFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const token = await getToken(messaging, {
      vapidKey: "BE3q7ncn4UgC6EPT2Ehc8ozFDuu7tjRPV35MgbwCRV_QizDXeAH7nGtVxcStGmloWt0HQ9NfGIToPZ9EalL4Qe0"
    });

    if (token) {
      await securePostData("api/comman/save-fcm-token", { fcmToken: token });
      console.log("✅ FCM Token Saved");
    }
  } catch (err) {
    console.error("FCM error", err);
  }
};
export { formatDateTime, languageOptions,saveFcmToken, specialtyOptions, calculateAge, getDistanceInKm }