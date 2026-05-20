import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayouts from "./Components/Layouts/AppLayouts";
import Error from "./Components/Pages/Error";
import Home from "./Components/Pages/Home";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy.JSX";




import ProtectedRoute from "./ProtectedRoute";

import AddAppointment from "./Doctor/Pages/AddAppointment";
import AddPatient from "./Doctor/Pages/AddPatient";
import DoctorChangePassword from "./Doctor/Pages/DoctorChangePassword";
import DoctorEditProfile from "./Doctor/Pages/DoctorEditProfile";
import DoctorChat from "./Doctor/Pages/DoctorChat";
import DoctorVideoCall from "./Doctor/Pages/DoctorVideoCall";
import DoctorAddPrescriptions from "./Doctor/Pages/DoctorAddPrescriptions";
import DoctorEditPrescriptions from "./Doctor/Pages/DoctorEditPrescriptions";
import PatientHistory from "./Doctor/Pages/PatientHistory";
import DoctorDetailsView from "./Doctor/Pages/DoctorDetailsView";
import DoctorRequests from "./Doctor/Pages/DoctorRequests";
import DoctorAppointmentsList from "./Doctor/Pages/DoctorAppointmentsList";
import PatientProfileApprovalRequest from "./Doctor/Pages/PatientProfileApprovalRequest";
import DoctorProfileApproval from "./Doctor/Pages/DoctorProfileApproval";
import DoctorApprovedDetails from "./Doctor/Pages/DoctorApprovedDetails";
import DoctorRejectDetails from "./Doctor/Pages/DoctorRejectDetails";
import DoctorRequestsList from "./Doctor/Pages/DoctorRequestsList";
import DoctorReportView from "./Doctor/Pages/DoctorReportView";
import DoctorProfileEditRequest from "./Doctor/Pages/DoctorProfileEditRequest";
import DoctorProfileAcceptRequest from "./Doctor/Pages/DoctorProfileAcceptRequest";
import DoctorLogin from "./Doctor/Auth/DoctorLogin";
import DoctorForgotPassword from "./Doctor/Auth/DoctorForgotPassword";
import DoctorOtp from "./Doctor/Auth/DoctorOtp";
import DoctorSetPassword from "./Doctor/Auth/DoctorSetPassword";
import DoctorMedicalLicense from "./Doctor/Auth/DoctorMedicalLicense";
import DoctorCreateAccount from "./Doctor/Auth/DoctorCreateAccount";
import DoctorKyc from "./Doctor/Auth/DoctorKyc";
import DoctorAddressAbout from "./Doctor/Auth/DoctorAddressAbout";
import DoctorEducationWorkExperience from "./Doctor/Auth/DoctorEducationWorkExperience";
import DoctorSelectAccountType from "./Doctor/Auth/DoctorSelectAccountType";
import DoctorKycMessage from "./Doctor/Auth/DoctorKycMessage";
import AddEmployee from "./Doctor/Pages/AddEmployee";
import Employee from "./Doctor/Pages/Employee";
import PermissionCheck from "./Doctor/Pages/PermissionCheck";
import Permission from "./Doctor/Pages/Permission";
import ViewEmployee from "./Doctor/Pages/ViewEmployee";
import DoctorNeoAi from "./Doctor/Pages/DoctorNeoAi";


import ClinicalSafetyStatement from "./Components/Pages/ClinicalSafetyStatement";
import MedicalDisclaimer from "./Components/Pages/MedicalDisclaimer";
import AccessModel from "./Components/Pages/AccessModel";

import DoctorClinic from "./Doctor/Auth/DoctorClinic";
import DoctorDepartments from "./Doctor/Pages/DoctorDepartment";
import LandingApp from "./Components/Landing layout/LandingApp";
import Slots from "./Doctor/Pages/Slots";
import SecurityRoadmap from "./Components/Pages/SecurityRoadmap";
import DicomPosture from "./Components/Pages/DicomPosture";
import DigitalHealthPrinciples from "./Components/Pages/DigitalHealthPrinciples";
import AbdmReady from "./Components/Pages/AbdmReady";
import Secaurity from "./Components/Pages/Secaurity";
import TermAndCondition from "./Components/Pages/TermAndCondition";
import GovermentHealth from "./Components/Pages/GovernmentHealth";
import InsuranceProgram from "./Components/Pages/InsuranceProgram";
import LabPharmacies from "./Components/Pages/LabPharmacies";
import HospitalHealth from "./Components/Pages/HospitalHealthSystem";
import DoctorApp from "./Components/Pages/DoctorApp";
import VerificationOnboarding from "./Components/Pages/VerificationOnboarding";
import Telemedicine from "./Components/Pages/Telemedicine";
import ClinicTools from "./Components/Pages/ClinicTools";
import GlobalPractice from "./Components/Pages/GlobalPractive";
import NeoAi from "./Components/Pages/NeoAi";
import NeoEdge from "./Components/Pages/NeoEdge";
import NeoMiddleware from "./Components/Pages/NeoMiddleware";
import BlockChainSecurity from "./Components/Pages/BlockchainSecurity";
import EmergencyNetwork from "./Components/Pages/EmergencyNetwork";
import AuditReady from "./Components/Pages/AuditReady";
import ConsentFirst from "./Components/Pages/ConsentFirst";
import ClinicianOversight from "./Components/Pages/ClinicianOversight";
import PaymentInfo from "./Doctor/Pages/PaymentInfo";
import DoctorAppointmentBilling from "./Doctor/Pages/DoctorAppointmentBilling";
import CmsDynamic from "./Components/Pages/CmsDynamic";
import { useSelector } from "react-redux";
import MyPermission from "./Doctor/Pages/MyPermission";
import { useGlobalSocket } from "./Utils/useGlobalSocket";
import FitnessCertificate from "./Certificates/FitnessCertificate";
import FitnessForm from "./Certificates/FitnessForm";
import ViewFitnessCertificate from "./Certificates/ViewFitnessCertificate";
import MedicalCertificate from "./Certificates/MedicalCertificate";
import MedicalForm from "./Certificates/MedicalForm";
import ViewMedicalCertificate from "./Certificates/ViewMedicalCertificate";
import BirthCertificate from "./Certificates/BirthCertificate";
import BirthForm from "./Certificates/BirthForm";
import ViewBirthCertificate from "./Certificates/ViewBirthCertificate";
import DeathCertificate from "./Certificates/DeathCertificate";
import DeathForm from "./Certificates/DeathForm";
import ViewDeathCertificate from "./Certificates/ViewDeathCertificate";



function Router() {
  const { socket, startCall } = useGlobalSocket();
  const { profiles, isOwner } = useSelector(state => state.doctor)
  const router = createBrowserRouter([
    {
      path: "/",
      // element: <AppLayouts />,
      errorElement: <Error />,

      children: [
        {
          element: <LandingApp />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "/",
              element: <Home />,
            },

            {
              path: "/privacy-policy",
              element: <PrivacyPolicy />,
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
              path: "/security",
              element: <Secaurity />,
            },

            {
              path: "/abdm-ready",
              element: <AbdmReady />,
            },
            {
              path: "/term-condition",
              element: <TermAndCondition />,
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
            //      new
            {
              path: "/doctor-app",
              element: <DoctorApp />,
            },
            {
              path: "/doctor-billing/:id",
              element: <DoctorAppointmentBilling />,
            },
            {
              path: "/verification-onboarding",
              element: <VerificationOnboarding />,
            },
            {
              path: "/telemedicine",
              element: <Telemedicine />,
            },
            {
              path: "/clinic-tools",
              element: <ClinicTools />,
            },
            {
              path: "/global-practice",
              element: <GlobalPractice />,
            },
            {
              path: "/neoai",
              element: <NeoAi />,
            },
            {
              path: "/neo-edge",
              element: <NeoEdge />,
            },
            {
              path: "/page/:slug",
              element: <CmsDynamic />,
            },
            {
              path: "/neo-middleware",
              element: <NeoMiddleware />,
            },
            {
              path: "/blockchain-security",
              element: <BlockChainSecurity />,
            },
            {
              path: "/emergency-network",
              element: <EmergencyNetwork />,
            },
            {
              path: "/audit-ready",
              element: <AuditReady />,
            },
            {
              path: "/consent-first",
              element: <ConsentFirst />,
            },
            {
              path: "/clinician-oversight",
              element: <ClinicianOversight />,
            },

          ]
        },

        {
          path: "/login",
          element: <DoctorLogin />, //d
        },

        {
          path: "/forgot-password", //d
          element: <DoctorForgotPassword />,
        },

        {
          path: "/otp", //d
          element: <DoctorOtp />,
        },

        {
          path: "/set-password", //d
          element: <DoctorSetPassword />,
        },

        {
          path: "/medical-license", //d
          element: <DoctorMedicalLicense />,
        },

        {
          path: "/create-account", //d
          element: <DoctorCreateAccount />,
        },

        {
          path: "/kyc", //d
          element: <DoctorKyc />,
        },

        {
          path: "/address-about", //d
          element: <DoctorAddressAbout />,
        },
        {
          path: "/clinic", //d
          element: <DoctorClinic />,
        },

        {
          path: "/education-work", //d
          element: <DoctorEducationWorkExperience />,
        },

        {
          path: "/select-type", //d
          element: <DoctorSelectAccountType />,
        },

        {
          path: "/kyc-message", //d
          element: <DoctorKycMessage />,
        },



        // 🔐 Protected routes wrapper
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <AppLayouts />,
              children: [
                {
                  path: "/add-appointment",
                  element: <AddAppointment />, //d //b
                },

                {
                  path: "/add-patient",
                  element: <AddPatient />, //d //b
                },
                {
                  path: "/neo-ai",
                  element: <DoctorNeoAi />,
                },
                {
                  path: "/slots", //d
                  element: <Slots />,
                },
                {
                  path: "/employee-data", //b
                  element: <AddEmployee />, //d
                },
                {
                  path: "/employee", //d //b
                  element: <Employee />,
                },
                {
                  path: "/view-employee/:name/:id", //d
                  element: <ViewEmployee />,
                },
                {
                  path: "/permission-data/:name/:id",   //d
                  element: <PermissionCheck />,
                },
                {
                  path: "/permission",  //d //b
                  element: <Permission />,
                },

                {
                  path: "/change-password",
                  element: <DoctorChangePassword />, //d
                },
                {
                  path: "/payment-info",
                  element: <PaymentInfo />, //d
                },


                {
                  path: "/edit-profile",
                  element: <DoctorEditProfile />,
                },

                {
                  path: "/chat",
                  element: <DoctorChat socket={socket} startCall={startCall} />,
                },
                {
                  path: "/my-permission",
                  element: <MyPermission />,
                },

                {
                  path: "/video-call",
                  element: <DoctorVideoCall />,
                },


                {
                  path: "/add-prescriptions/:id",  //d //b
                  element: <DoctorAddPrescriptions />,
                },

                {
                  path: "/edit-prescriptions",
                  element: <DoctorEditPrescriptions />,
                },

                {
                  path: "/patient-history",
                  element: <PatientHistory />, //d //b
                },

                {
                  path: "/detail-view/:name/:id",
                  element: <DoctorDetailsView />,
                },
                {
                  path: "/requests",
                  element: <DoctorRequests />, //d //b
                },
                {
                  path: "/departments", //d //b
                  element: <DoctorDepartments />,
                },

                {
                  path: "/appointment-list", //d //b
                  element: <DoctorAppointmentsList />,
                },

                {
                  path: "/profile-approval-request",  //d //b
                  element: <PatientProfileApprovalRequest />,
                },

                {
                  path: "/profile-approval/:name/:id", //d
                  element: <DoctorProfileApproval />,
                },


                {
                  path: "/patient-details/:id", //d
                  element: <DoctorApprovedDetails />,
                },
                {
                  path: "/user/:id",
                  element: <DoctorDetailsView isPatientView={true} />,
                },

                {
                  path: "/reject-details",
                  element: <DoctorRejectDetails />,
                },

                {
                  path: "/request-list", //d
                  element: <DoctorRequestsList />,
                },

                {
                  path: "/report-view/:id/:currentTest", //d
                  element: <DoctorReportView />,
                },

                {
                  path: "/profile-edit-request", //d //b
                  element: <DoctorProfileEditRequest />,
                },

                {
                  path: "/profile-accept-request",
                  element: <DoctorProfileAcceptRequest />,
                },
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

              ]
            }


          ]
        },





      ],
    },
  ]);

  // 7375046291

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default Router