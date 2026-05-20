// Router.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";

// Layout
import AppLayout from "./Layouts/AppLayout";

// Auth Pages
import Login from "./Auth/Login";
import PasswordForgot from "./Auth/PasswordForgot";
import Otp from "./Auth/Otp";
import SetPassword from "./Auth/SetPassword";

import CreateAccount from "./Auth/CreateAccount";
import CreateAccountImage from "./Auth/CreateAccountImage";
import CreateAccountAddress from "./Auth/CreateAccountAddress";
import CreateAccountPerson from "./Auth/CreateAccountPerson";
import CreateAccountUpload from "./Auth/CreateAccountUpload";

// Main Pages
import Dashboard from "./Pages/Dashboard";
import Notification from "./Pages/Notification";
import Departments from "./Pages/Departments";
import Doctors from "./Pages/Doctors";
import NewDoctor from "./Pages/NewDoctor";
// import AddDoctors from "./doctor/NewDoctor";
import AddDoctors from "./Pages/AddDoctors";
import EditDoctors from "./doctor/EditDoctor";
import DoctorView from "./Pages/DoctorView";
import Patients from "./Pages/Patients";
import PatientsView from "./Pages/PatientsView";
import AddPatient from "./Pages/AddPatient";
import EditPatient from "./Pages/EditPatient";

import AddFloor from "./Pages/AddFloor";
import EditFloor from "./Pages/EditFloor";
import AddRoom from "./Pages/AddRoom";
import EditRoom from "./Pages/EditRoom";
import AddBed from "./Pages/AddBed";
import EditBed from "./Pages/EditBed";
import BedManagement from "./Pages/BedManagement";

import Allotment from "./Pages/Allotment";
import EditAllotment from "./Pages/EditAllotment";
import AllotmentDetails from "./Pages/AllotmentDetails";
import AllotmentDetailsSecond from "./Pages/AllotmentDetailsSecond";
import BedAllotmentHistory from "./Pages/BedAllotmentHistory";

import PatientsOPD from "./Pages/PatientsOPD";
import PatientsIPD from "./Pages/PatientsIPD";

import Appointments from "./Pages/Appointments";
import AppointmentRequest from "./Pages/AppointmentRequest";
import AddAppointment from "./Pages/AddAppointment";
import AppointmentCancelDetails from "./Pages/AppointmentCancelDetails";
import AppointmentSuccessDetails from "./Pages/AppointmentSuccessDetails";
import AppointmentPendingDetails from "./Pages/AppointmentPendingDetails";

import AddPrescriptions from "./Pages/AddPrescriptions";
import EditPrescriptions from "./Pages/EditPrescriptions";
import View from "./Pages/View";

import Tests from "./Pages/Tests";
import AddTest from "./Pages/AddTest";
import EditTests from "./Pages/EditTests";

import TestReport from "./Pages/TestReport";
import TestReportsAppointment from "./Pages/TestReportsAppointment";

import PatientDetails from "./Pages/PatientDetails";
import AppointmentDetails from "./Pages/AppointmentDetails";

import Labels from "./Pages/Labels";
import Invoice from "./Pages/Invoice";
import Inventory from "./Pharmacy/Inventory";

import AddPrescriptionDetails from "./Pages/AddPrescriptionDetails";
import ScanPrescriptionDetails from "./Pharmacy/ScanPrescriptionDetails";

import MedicineRequest from "./Pharmacy/MedicineRequest";
import Sell from "./Pharmacy/Sell";

import PrescriptionDetails from "./Pharmacy/PrescriptionDetails";

import Returns from "./Pharmacy/Returns";
import AddReturn from "./Pharmacy/AddReturn";
import EditReturn from "./Pharmacy/EditReturn";

import StaffManagement from "./Pages/StaffManagement";
import StaffInfoView from "./Pages/StaffInfoView";
import NewStaff from "./staff/NewStaff";
import EditStaff from "./staff/EditStaff";

import PermissionsType from "./Pages/PermissionsType";
import PermissionCheck from "./Pages/PermissionCheck";

import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import ApproveProfile from "./Pages/ApproveProfile";
import ChangePassword from "./Pages/ChangePassword";


import Error from "./Pages/ErrorPage";
import Supplier from "./Pharmacy/Supplier";
import AddManually from "./Pharmacy/AddManually";
import AppointmentPrescriptions from "./Pages/AppointmentPrescriptions";
import ReportView from "./Pages/ReportView";
import GenerateReport from "./Pages/GenerateReport";
import AddLabAppointment from "./Pages/AddLabAppointment";
import LandingPage from "./Pages/LandingPage";
import LandingApp from "./Landing Layout.jsx/LandingApp";
import TermAndCondition from "./CMS/TermAndCondition";
import GovermentHealth from "./CMS/GovernmentHealth";
import PrivacyPolicy from "./CMS/PrivacyPolicy";
import MedicalDisclaimer from "./CMS/MedicalDisclaimer";
import MyPermissions from "./Pages/MyPermissions";
import DoctorSlots from "./Pages/DoctorSlot";
import LabSlots from "./Pages/LabSlots";
import DailyIPDNotes from "./Pages/DailyIPDNotes";
import DailyNotesHistory from "./Pages/DailyNotesHistory";
import TransferHistory from "./Pages/TransferHistory";
import NewDischarge from "./Pages/NewDischarge";
import DischargeDownload from "./Utils/DischargeDownload";
import LabCollection from "./Pages/LabCollection";
import AuditLog from "./Pages/AuditLog";
import PatientsEmergency from "./Pages/PatientEmergency";
import HospitalService from "./Pages/Services";
import PrescriptionsBar from "./Pharmacy/PrescriptionBar";
import GenerateList from "./Pharmacy/GenerateList";
import NewGeneratePo from "./Pharmacy/NewGeneratePo";
import EditGeneratePo from "./Pharmacy/EditGeneratePo";
import DoctorAppointmentBilling from "./Pages/DoctorAppointmentBilling";
import CustomerReturn from "./Pharmacy/CustomerReturn";
import PharHome from "./Pharmacy/PharHome";
import InsuranceClaim from "./CMS/InsauranceClaim";
import OTScheduling from "./CMS/OTScheduling";
import InventoryAndStore from "./CMS/InventoryAndStore";
import PurchaseOrder from "./CMS/PurchaseOrders";
import CmsDynamic from "./CMS/CmsDynamic";
import { useGlobalSocket } from "./Utils/useGlobalSocket";
import StaffForm from "./Pages/StaffForm";
import FitnessCertificate from "./Certificates/FitnessCertificate";
import FitnessForm from "./Certificates/FitnessForm";
import ViewFitnessCertificate from "../All Template file/Fitness certificate";
import MedicalCertificate from "./Certificates/MedicalCertificate";
import MedicalForm from "./Certificates/MedicalForm";
import ViewMedicalCertificate from "../All Template file/Medical certificate";
import BirthCertificate from "./Certificates/BirthCertificate";
import BirthForm from "./Certificates/BirthForm";
import ViewBirthCertificate from "../All Template file/Birth Certificate";
import DeathCertificate from "./Certificates/DeathCertificate";
import DeathForm from "./Certificates/DeathForm";
import ViewDeathCertificate from "../All Template file/Death Certificate";
import DoctorAptBookingReceipt from "../All Template file/Booking receipt";
import MedicalPrescription from "../All Template file/Medical Prescription";
import PatientsHistory from "./Pages/PatientHistory";
import PatientTransferLetter from "../All Template file/Patient transfer";
import PatientsOptData from "./Pages/PatientOptData";
import PatientEmergencyData from "./Pages/PatientEmergencyData";
import BedInvoice from "../All Template file/Bed invoice";
import LabTestOrder from "../All Template file/Lab Test Order";
import LabReportPdf from "../All Template file/Lab report file/Lab report";
import HospitalBillPerfect from "../All Template file/Hospital bill";
import OPDReceipt from "../All Template file/opd receipt";
import PharmacyInvoice from "../All Template file/Pharmacy invoice";
import DischargeSummary from "../All Template file/Discharge summary";
import HospitalBill from "../All Template file/Hospital bill";
import PatientConsentForm from "../All Template file/patient_consent_form_react_component";
import LabInvoice from "../All Template file/Lab Invoice";
import PharmacyReturn from "../All Template file/Pharmacy Return";
import LabSampleReceipt from "../All Template file/Lab Sample Collection Receipt";
import FollowUpPrescription from "../All Template file/FollowUpPrescription/FollowUpPrescription";
import DoctorEmpanelmentCert from "../All Template file/Doctor Empanelment Certificate";

function Router() {
  const { socket, startCall } = useGlobalSocket();
  const router = createBrowserRouter([
    // ============================
    // PUBLIC ROUTES (NO LOGIN REQUIRED)
    // ============================
    {
      path: "/",
      element: <LandingApp />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "/", element: <LandingPage /> },
        {
          path: "/term-condition",
          element: <TermAndCondition />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/government-public-health",
          element: <GovermentHealth />,
        },
        {
          path: "/medical-disclaimer",
          element: <MedicalDisclaimer />,
        },
        {
          path: "/purchase-orders",
          element: <PurchaseOrder />
        },
        {
          path: "/inventory-and-store",
          element: <InventoryAndStore />
        },
        {
          path: "/ot-scheduling",
          element: <OTScheduling />
        },
        {
          path: "/insurance-claim",
          element: <InsuranceClaim />

        },
        {
          path: "/page/:slug",
          element: <CmsDynamic />

        },
        {
          path: "/template/:id",
          element: <DoctorAptBookingReceipt />
        },
        {
          path: "/prescription-template/:id",
          element: <MedicalPrescription />
        },
        {
          path: "/bed-invoice/:id",
          element: <DoctorEmpanelmentCert />
        }
      ]
    },


    { path: "/login", element: <Login /> },
    { path: "/download/discharge/:id", element: <DischargeDownload /> },
    { path: "/forgot-password", element: <PasswordForgot /> },
    { path: "/otp", element: <Otp /> },
    { path: "/set-password", element: <SetPassword /> },

    // ACCOUNT CREATION STEPS
    { path: "/create-account", element: <CreateAccount /> },
    { path: "/create-account-image", element: <CreateAccountImage /> },
    { path: "/create-account-address", element: <CreateAccountAddress /> },
    { path: "/create-account-person", element: <CreateAccountPerson /> },
    { path: "/create-account-upload", element: <CreateAccountUpload /> },

    // ============================
    // PROTECTED ROUTES (LOGIN REQUIRED)
    // ============================
    {
      // path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      errorElement: <Error />,

      children: [
        // { index: true, element: <Dashboard /> },
        { path: "/dashboard", element: <Dashboard /> }, //d
        { path: "/notifcation", element: <Notification /> }, //d
        // { path: "/daily-notes", element: <DailyIPDNotes /> },

        // Doctors
        { path: "/doctor", element: <Doctors /> },  //d
        { path: "/new-doctor", element: <NewDoctor /> },  //d
        // { path: "/add-doctor", element: <AddDoctors /> },
        { path: "/add-doctor", element: <AddDoctors /> },  //d
        { path: "/edit-doctor-data/:id", element: <AddDoctors /> },  //d
        { path: "/doctor-slots/:id", element: <DoctorSlots /> }, //d
        { path: "/doctor-view/:id", element: <DoctorView /> },  //d

        { path: "/edit-doctor/:id", element: <EditDoctors /> }, //n

        // Patients
        // { path: "/patient", element: <Patients /> },
        { path: "/add-patient", element: <AddPatient /> }, //d
        { path: "/patient-view/:id", element: <PatientsView /> }, //p
        { path: "/patients/edit/:id", element: <AddPatient /> },  //d
        // { path: "/edit-patient/:id", element: <EditPatient /> },

        // Floors / Rooms / Beds
        { path: "/add-floor", element: <AddFloor /> }, //d
        { path: "/edit-floor/:id", element: <AddFloor /> },  //d
        { path: "/add-room", element: <AddRoom /> }, //d
        { path: "/edit-room/:id", element: <AddRoom /> }, //d
        { path: "/add-bed", element: <AddBed /> }, //d
        { path: "/edit-bed/:id", element: <AddBed /> }, //d

        { path: "/bed-management", element: <BedManagement /> },
        { path: "/transfer-history/:id", element: <TransferHistory /> },
        { path: "/daily-ipd-history", element: <DailyNotesHistory /> },

        // Allotments
        { path: "/allotment/:id", element: <Allotment /> },
        { path: "/discharge/:id", element: <NewDischarge /> },
        { path: "/edit-allotment/:id", element: <Allotment /> },
        // { path: "/edit-allotment", element: <EditAllotment /> },
        { path: "/allotment-details/:id", element: <AllotmentDetails /> },
        { path: "/allotment-details-second", element: <AllotmentDetailsSecond /> },
        { path: "/bed-allotment-history", element: <BedAllotmentHistory /> },


        { path: "/patient-opd", element: <PatientsOPD /> }, //d
        { path: "/patient-opd-data", element: <PatientsOptData /> }, //d
        { path: "/patient-ipd", element: <PatientsIPD /> }, //d
        { path: "/patient-emergency", element: <PatientsEmergency /> }, //d
        { path: "/patient-emergency-data", element: <PatientEmergencyData /> }, //d
        { path: "/patient-history", element: <PatientsHistory /> },


        // Appointments
        { path: "/appointment", element: <Appointments /> },
        { path: "/add-appointment", element: <AddAppointment /> },
        { path: "/add-lab-appointment", element: <AddLabAppointment /> },
        { path: "/appointment-request", element: <AppointmentRequest /> },
        { path: "/appointment-cancel-details", element: <AppointmentCancelDetails /> },
        { path: "/doctor-appointment-details/:id", element: <AppointmentSuccessDetails /> },
        { path: "/appointment-pending-details", element: <AppointmentPendingDetails /> },
        { path: "/appointment-prescription/:id", element: <AppointmentPrescriptions /> },
        { path: "/doctor-appointment-billing/:id", element: <DoctorAppointmentBilling /> },

        // Prescriptions
        { path: "/allotment/prescription-data/:id", element: <AddPrescriptions /> },
        { path: "/edit-prescription/:id", element: <EditPrescriptions /> },
        { path: "/add-prescription-details", element: <AddPrescriptionDetails /> },
        { path: "/scan-prescription-detail/:id", element: <ScanPrescriptionDetails /> },
        { path: "/purchase-order", element: <GenerateList /> },
        { path: "/prescription-bar/:id", element: <PrescriptionsBar /> },
        { path: "/prescriptions-detail/:id", element: <PrescriptionDetails /> },
        { path: "/add-manually", element: <AddManually /> },
        { path: "/generate-purchase-order", element: <NewGeneratePo /> },
        { path: "/edit-purchase-order", element: <EditGeneratePo /> },
        { path: "/edit-sell/:id", element: <AddManually /> },
        { path: "/customer-return/:id", element: <CustomerReturn /> },

        // Tests
        { path: "/tests", element: <Tests /> },
        { path: "/lab-slots", element: <LabSlots /> },
        { path: "/add-tests", element: <AddTest /> },
        { path: "/edit-tests/:id", element: <EditTests /> },
        { path: "/test-report/:id", element: <TestReport /> },
        { path: "/test-report-appointment", element: <TestReportsAppointment /> },
        { path: "/view-report/:id", element: <ReportView /> },
        { path: "/generate-report/:id", element: <GenerateReport /> },

        // Pharmacy
        { path: "/medicine-request", element: <MedicineRequest /> },
        { path: "/pharmacy-home", element: <PharHome /> },
        { path: "/supplier", element: <Supplier /> },
        { path: "/sell", element: <Sell /> },
        { path: "/returns", element: <Returns /> },
        { path: "/add-returns", element: <AddReturn /> },
        { path: "/edit-returns", element: <EditReturn /> },

        // Patient / Appointment Details
        { path: "/patient-details/:id", element: <PatientDetails /> },
        { path: "/appointment-details/:id", element: <AppointmentDetails /> },

        // Extra Modules
        { path: "/view/:id", element: <View /> },
        { path: "/label/:id", element: <Labels /> },
        { path: "/sample/:id", element: <LabCollection /> },
        { path: "/invoice/:id", element: <Invoice /> },
        { path: "/inventory", element: <Inventory /> },
        { path: "/audit-log", element: <AuditLog /> },

        // Staff
        { path: "/staff-management", element: <StaffManagement /> },
        { path: "/staff-info-view/:id", element: <StaffInfoView /> },
        // { path: "/new-staff", element: <NewStaff /> },
        { path: "/new-staff", element: <StaffForm /> },
        { path: "/edit-staff", element: <StaffForm /> },


        { path: "/edit-staff/:id", element: <EditStaff /> },


        { path: "/department", element: <Departments /> },
        { path: "/fitness-certificate", element: <FitnessCertificate /> },
        { path: "/certificate/fitness/:id", element: <ViewFitnessCertificate /> },
        { path: "/fitness-form", element: <FitnessForm /> },
        { path: "/medical-certificate", element: <MedicalCertificate /> },
        { path: "/medical-form", element: <MedicalForm /> },
        { path: "/certificate/medical/:id", element: <ViewMedicalCertificate /> },
        { path: "/birth-certificate", element: <BirthCertificate /> },
        { path: "/birth-form", element: <BirthForm /> },
        { path: "/certificate/birth/:id", element: <ViewBirthCertificate /> },
        { path: "/death-certificate", element: <DeathCertificate /> },
        { path: "/death-form", element: <DeathForm /> },
        { path: "/certificate/death/:id", element: <ViewDeathCertificate /> },
        { path: "/patient-transfer/:id", element: <PatientTransferLetter /> },


        // Permissions
        { path: "/my-permission", element: <MyPermissions /> },
        { path: "/permission-type", element: <PermissionsType /> },
        { path: "/permission-check/:name/:permissionId", element: <PermissionCheck /> },

        // Others
        { path: "/chat", element: <Chat socket={socket} startCall={startCall} /> },

        { path: "/chat/:id", element: <Chat /> },
        { path: "/profile", element: <Profile /> },
        { path: "/edit-profile", element: <EditProfile /> },
        { path: "/services", element: <HospitalService /> },
        { path: "/approve-profile", element: <ApproveProfile /> },
        { path: "/change-password", element: <ChangePassword /> }, //d



      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;