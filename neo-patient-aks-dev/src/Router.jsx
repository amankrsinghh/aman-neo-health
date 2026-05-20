import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayouts from "./Components/Layouts/AppLayouts";
import Error from "./Components/Pages/Error";
import Home from "./Components/Pages/Home";
import DoctorListing from "./Components/Pages/DoctorListing";
import DateTime from "./Components/Pages/DateTime";
import DoctorDetails from "./Components/Pages/DoctorDetails";
import NewDoctorListing from "./Components/Pages/NewDoctorListing";
import FindLabs from "./Components/Pages/FindLabs";
import LabDetails from "./Components/Pages/LabDetails";
import TestDetails from "./Components/Pages/TestDetails";
import LabDoctorListing from "./Components/Pages/LabDoctorListing";
import FindHospital from "./Components/Pages/FindHospital";
import VideoCall from "./Components/Pages/VideoCall";
import AboutUs from "./Components/Pages/AboutUs";
import Faq from "./Components/Pages/Faq";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy.JSX";
import TermAndCondition from "./Components/Pages/TermAndCondition";
import Blogs from "./Components/Pages/Blogs";
import BlogDetails from "./Components/Pages/BlogDetails";
import Notification from "./Components/Pages/Notification";
import Contact from "./Components/Pages/Contact";
import HospitalDetails from "./Components/Pages/HospitalDetails";
import ChangePassword from "./Components/Pages/ChangePassword";
import EditProfile from "./Components/Pages/EditProfile";
import LabReport from "./Components/Pages/LabReport";
import Favorite from "./Components/Pages/Favorite";
import Chat from "./Components/Pages/Chat";
import Profile from "./Components/Pages/Profile";
import HealthCardDetails from "./Components/Pages/HealthCardDetails";
import ApproveHealthCard from "./Components/Pages/ApproveHealthCard";
import ShareHealthCard from "./Components/Pages/ShareHealthCard";
import Prescriptions from "./Components/Pages/Prescriptions";
import Search from "./Components/Pages/Search";
import Congratulations from "./Components/Pages/Congratulations";
import MyAppointment from "./Components/Pages/MyAppointment";
import AppointmentDetailsUpcoming from "./Components/Pages/AppointmentDetailsUpcoming";
import AppointmentDetailsCompleted from "./Components/Pages/AppointmentDetailsCompleted";
import AppointmentDetailsCompletedTwo from "./Components/Pages/AppointmentDetailsCompletedTwo";
import AppointmentDetailsCancel from "./Components/Pages/AppointmentDetailsCancel";
import LabTestDetailsUpcoming from "./Components/Pages/LabTestDetailsUpcoming";
import LabTestDetailsVisited from "./Components/Pages/LabTestDetailsVisited";
import LabTestDetailsPending from "./Components/Pages/LabTestDetailsPending";
import LabTestDetailsCompleted from "./Components/Pages/LabTestDetailsCompleted";
import LabTestDetailsCancel from "./Components/Pages/LabTestDetailsCancel";
import SelectNearByDoctor from "./Components/Pages/SelectNearByDoctor";
import BookAppointment from "./Components/Pages/BookAppointment";
import Login from "./Components/Auth/Login";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import Otp from "./Components/Auth/Otp";
import SetPassword from "./Components/Auth/SetPassword";
import CreateAccount from "./Components/Auth/CreateAccount";
import KycVerfication from "./Components/Auth/KycVerfication";
import PersonalInfo from "./Components/Auth/PersonalInfo";
import MedicalHistory from "./Components/Auth/MedicalHistory";
import FamilyMedicalHistory from "./Components/Auth/FamilyMedicalHistory";
import SelectAccountType from "./Components/Auth/SelectAccountType";
import PrescriptionsReports from "./Components/Auth/PrescriptionsReports";
import DoctorPending from "./Components/Pages/DoctorPending";
import HeaderSecond from "./Components/Layouts/HeaderSecond";
import AmbulanceBookingHistory from "./Components/Pages/AmbulanceBookingHistory";
import AmbulanceOngoing from "./Components/Pages/AmbulanceOngoing";
import AmbulanceDropSuccess from "./Components/Pages/AmbulanceDropSuccess";
import AmbulanceCancel from "./Components/Pages/AmbulanceCancel";
import BookAmbulanceMap from "./Components/Pages/BookAmbulanceMap";
import AmbulancePickup from "./Components/Pages/AmbulancePickup";
import AmbulanceDriverInfo from "./Components/Pages/AmbulanceDriverInfo";
import AmbulanceFinding from "./Components/Pages/AmbulanceFinding";
import AmbulancePatientPickup from "./Components/Pages/AmbulancePatientPickup";
import AmbulancePatientDrop from "./Components/Pages/AmbulancePatientDrop";
import AmbulanceBookingCancel from "./Components/Pages/AmbulanceBookingCancel";
import VaccinationCertificate from "./Components/Pages/VaccinationCertificate";
import VaccineCertificateType from "./Components/Pages/VaccineCertificateType.JSX";
import VaccinationSelectSim from "./Components/Pages/VaccinationSelectSim";
import VaccinationMobileNumber from "./Components/Pages/VaccinationMobileNumber";
import VaccinationOtp from "./Components/Pages/VaccinationOtp";
import VaccineCertificate from "./Components/Pages/VaccineCertificate";
import ProtectedRoute from "./ProtectedRoute";


import VaccineCertificateUip from "./Components/Pages/VaccineCertificateUip";
import VaccineImportedCertificate from "./Components/Pages/VaccineImportedCertificate";
import ChildProfile from "./Components/Pages/ChildProfile";
import FindPharmacy from "./Components/Pages/FindPharmacy";
import PharDetails from "./Components/Pages/PharDetails";
import NeoAi from "./Components/Pages/NeoAi";
import DeleteAccount from "./Components/Pages/DeleteAccount";
import Landing from "./Landing/Landing";
import ClinicalSafetyStatement from "./Components/Pages/ClinicalSafetyStatement";
import MedicalDisclaimer from "./Components/Pages/MedicalDisclaimer";
import AccessModel from "./Components/Pages/AccessModel";
import AbdmReady from "./Components/Pages/AbdmReady";
import DigitalHealthPrinciples from "./Components/Pages/DigitalHealthPrinciples";
import DicomPosture from "./Components/Pages/DicomPosture";
import SecurityRoadmap from "./Components/Pages/SecurityRoadmap";
import GovermentHealth from "./Components/Pages/GovernmentHealth";
import InsuranceProgram from "./Components/Pages/InsuranceProgram";
import LabPharmacies from "./Components/Pages/LabPharmacies";
import HospitalHealth from "./Components/Pages/HospitalHealthSystem";
import Modules from "./Components/Pages/Modules";
import Secaurity from "./Components/Pages/Secaurity";
import HowItWorks from "./Components/Pages/HowItWorks";
import CatDoctors from "./Components/Pages/CatDoctors";
import CatHospital from "./Components/Pages/CatHospital";
import CatPharmacy from "./Components/Pages/CatPharmacy";
import CatLabs from "./Components/Pages/CatLabs";
import CmsDynamic from "./Components/Pages/CMSDynamic";
import { useGlobalSocket } from "./Utils/useGlobalSocket";




function Router() {
   const { socket, startCall } = useGlobalSocket();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayouts />,
      errorElement: <Error />,

      children: [
        // {
        //   index: true,
        //   element: <Home />,
        // },
        // {
        //   path: "/",
        //   element: <Home />,
        // },


        {
          index: true,
          element: <Home />,
        },
        {
          path: "/",
          element: <Home />,
        },

        {
          path: "/doctor-listing",
          element: <DoctorListing />,
        },

        {
          path: "/book-doctor-appointment/:name/:id", //d
          element: <DateTime />,
        },

        {
          path: "/doctor-details/:name/:id",
          element: <DoctorDetails />,
        },

        {
          path: "/new-doctor-details", //nw d
          element: <NewDoctorListing />,
        },
        {
          path: "/doctor/:name/:id", 
          element: <CatDoctors />,
        },
        {
          path: "/page/:slug",
          element: <CmsDynamic />,
        },



        {
          path: "/find-labs", //d
          element: <FindLabs />,
        },
        {
          path: "/labs/:name/:id", //d
          element: <CatLabs />,
        },

        {
          path: "/lab-detail/:name/:id", //nw
          element: <LabDetails />,
        },
        {
          path: "/find-pharmacy", //d
          element: <FindPharmacy />,
        },
        {
          path: "/pharmacy/:name/:id", //d
          element: <CatPharmacy />,
        },
        {
          path: "/pharmacy-detail/:name/:id",
          element: <PharDetails />,
        },

        {
          path: "/test-detail/:name/:id", //nw
          element: <TestDetails />,
        },

        {
          path: "/lab-doctor-listing",
          element: <LabDoctorListing />,
        },

        {
          path: "/find-hospital", //d
          element: <FindHospital />,
        },
        {
          path: "/hospital/:name/:id", //d
          element: <CatHospital />,
        },

        {
          path: "/video-call",
          element: <VideoCall />,
        },

        {
          path: "/about-us",
          element: <AboutUs />,
        },

        {
          path: "/faq",
          element: <Faq />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/how-it-work",
          element: <HowItWorks />,
        },
        {
          path: "/government-public-health",
          element: <GovermentHealth />,
        },
        {
          path: "/insurance-programs",
          element: <InsuranceProgram />,
        },
        {
          path: "/labs-pharmacies",
          element: <LabPharmacies />,
        },
        {
          path: "/hospital-health-system",
          element: <HospitalHealth />,
        },
         {
          path: "/module",
          element: <Modules />,
        },
         {
          path: "/security",
          element: <Secaurity />,
        },
        {
          path: "/delete-account",
          element: <DeleteAccount />,
        },
        {
          path: "/term-condition",
          element: <TermAndCondition />,
        },
        // {
        //   path: "/blogs",
        //   element: <Blogs />,
        // },

        // {
        //   path: "/blogs-detail/:id",
        //   element: <BlogDetails />,
        // },



        {
          path: "/hospital-details/:name/:id",
          element: <HospitalDetails />,
        },

        {
          path: "/contact-us",
          element: <Contact />,
        },

        {
          path: "/change-password",
          element: <ChangePassword />,
        },

        {
          path: "/edit-profile",
          element: <EditProfile />,
        },

        {
          path: "/lab-report", //nw d
          element: <LabReport />,
        },

        {
          path: "/favorite",
          element: <Favorite />,
        },
        {
          path: "/search",
          element: <Search />,
        },



        // {
        //   path: "/my-appointment",
        //   element: <MyAppointment />,
        // },


        {
          path: "/appointment-upcoming",
          element: <AppointmentDetailsUpcoming />,
        },

        {
          path: "/appointment-detail/:name/:id", //nw
          element: <AppointmentDetailsCompleted />,
        },

        {
          path: "/appointment-complete-two",
          element: <AppointmentDetailsCompletedTwo />,
        },

        {
          path: "/appointment-cancel",
          element: <AppointmentDetailsCancel />,
        },

        {
          path: "/lab-appointment-details/:name/:id", //nw
          element: <LabTestDetailsUpcoming />,
        },

        {
          path: "/lab-visited",
          element: <LabTestDetailsVisited />,
        },

        {
          path: "/lab-pending",
          element: <LabTestDetailsPending />,
        },

        {
          path: "/lab-complete",
          element: <LabTestDetailsCompleted />,
        },

        {
          path: "/lab-cancel",
          element: <LabTestDetailsCancel />,
        },



        {
          path: "/login", //d
          element: <Login />,
        },


        {
          path: "/landing",
          element: <Landing />,
        },


        {
          path: "/forgot-password", //d
          element: <ForgotPassword />,
        },

        {
          path: "/otp", //d
          element: <Otp />,
        },

        {
          path: "/set-password", //d
          element: <SetPassword />,
        },

        {
          path: "/create-account", //d
          element: <CreateAccount />,
        },

        {
          path: "/kyc", //d
          element: <KycVerfication />,
        },
        {
          path: "/personal-info", //d
          element: <PersonalInfo />,
        },

        {
          path: "/medical-history", //d
          element: <MedicalHistory />,
        },

        {
          path: "/family-medical-history", //d
          element: <FamilyMedicalHistory />,
        },

        {
          path: "/select-account-type",  //d
          element: <SelectAccountType />,
        },
        

        {
          path: "/prescriptions-reports", //d
          element: <PrescriptionsReports />,
        },

        {
          path: "/doctor-pending", //d
          element: <DoctorPending />,
        },

        //  {
        //   path: "/header-second",
        //   element: <HeaderSecond />,
        // },

        {
          path: "/ambulance-booking-histroy",
          element: <AmbulanceBookingHistory />,
        },

        {
          path: "/ambulance-ongoing",
          element: <AmbulanceOngoing />,
        },

        {
          path: "/ambulance-drop-success",
          element: <AmbulanceDropSuccess />,
        },

        {
          path: "/ambulance-cancel",
          element: <AmbulanceCancel />,
        },

        {
          path: "/ambulance-book-map",
          element: <BookAmbulanceMap />,
        },

        {
          path: "/ambulance-pickup",
          element: <AmbulancePickup />,
        },

        {
          path: "/ambulance-driver-info",
          element: <AmbulanceDriverInfo />,
        },

        {
          path: "/ambulance-finding",
          element: <AmbulanceFinding />,
        },

        {
          path: "/ambulance-patient-pickup",
          element: <AmbulancePatientPickup />,
        },

        {
          path: "/ambulance-patient-drop",
          element: <AmbulancePatientDrop />,
        },

        {
          path: "/ambulance-booking-cancel",
          element: <AmbulanceBookingCancel />,
        },


        {
          path: "/vaccination-certificate",
          element: <VaccinationCertificate />,
        },



        {
          path: "/vaccine-select-sim",
          element: <VaccinationSelectSim />,
        },

        {
          path: "/vaccine-mobile",
          element: <VaccinationMobileNumber />,
        },

        {
          path: "/vaccine-otp",
          element: <VaccinationOtp />,
        },

        {
          path: "/vaccine-certificate-type",
          element: <VaccineCertificateType />,
        },

        {
          path: "/vaccine-certificate",
          element: <VaccineCertificate />,
        },
        {
          path: "/uip-vaccine-certificate",
          element: <VaccineCertificateUip />,
        },

        {
          path: "/vaccine-imported-certificate",
          element: <VaccineImportedCertificate />,
        },


        {
          path: "/child-profile",
          element: <ChildProfile />,
        },


        

        // 🔐 Protected routes wrapper
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/my-appointment", //nw
              element: <MyAppointment />,
            },
            {
              path: "/notification",
              element: <Notification />,
            },
            {
              path: "/chat",
              element: <Chat socket={socket} startCall={startCall}/>,
            },
            {
              path: "/neo-ai",
              element: <NeoAi />,
            },
            {
              path: "/congratulations",
              element: <Congratulations />,
            },
            {
              path: "/near-by-doctor",
              element: <SelectNearByDoctor />,
            },

            {
              path: "/book-appointment/:id",
              element: <BookAppointment />,
            },
            {
              path: "/share-health-card",
              element: <ShareHealthCard />,
            },
            {
              path: "/prescription",
              element: <Prescriptions />, //nw d
            },
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/approve-health-card",
              element: <ApproveHealthCard />,
            },
            {
              path: "/health-card-details",
              element: <HealthCardDetails />,
            },
            
          ]
        },


        {
          path: "/clinical-safety-statement",
          element: <ClinicalSafetyStatement />,
        },

        {
          path: "/medical-disclaimer",
          element: <MedicalDisclaimer />,
        },

        {
          path: "/access-modal",
          element: <AccessModel />,
        },


        {
          path: "/abdm-ready",
          element: <AbdmReady />,
        },


        {
          path: "/digital-health",
          element: <DigitalHealthPrinciples />,
        },

        {
          path: "/dicom-posture",
          element: <DicomPosture />,
        },

        {
          path: "/security-roadmap",
          element: <SecurityRoadmap />,
        },


        //7375046291




      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default Router