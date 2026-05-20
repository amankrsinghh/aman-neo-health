import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./Layout/AppLayout";
import AdminProtectedRoute from "../Routes/AdminProtectedRoute";
import ErrorPage from "./Pages/ErrorPage";
import Login from "./Pages/Login";

/* ===== PAGES ===== */
import Dashboard from "./Pages/Dashboard";
import DoctorRequest from "./Pages/DoctorRequest";
import DoctorsList from "./Doctor/DoctorsList";
import DoctorInfoDetails from "./Doctor/DoctorInfoDetails";
import LaboratoryList from "./Lab/LaboratoryList";
import PharmacyList from "./Pharmacy/PharmacyList";
import HospitalList from "./Hospital/HospitalList";

import Patients from "./Patients/Patients";
import PatientsPersonalInfo from "./Patients/PatientsPersonalInfo";

import DoctorAppointments from "./Pages/DoctorAppointments";
import DoctorAppointmentDetails from "./Pages/DoctorAppointmentDetails";
import PharmacyNewDetails from "./Pages/PharmacyNewDetails";
import PharmacyDetails from "./Pages/PharmacyDetails";
import LabAppointmentSucess from "./Pages/LabAppointmentSucess";
import LaboratoryAppointmentVisitDetails from "./Pages/LaboratoryAppointmentVisitDetails";
import LaboratoryAppointmentDueDetails from "./Pages/LaboratoryAppointmentDueDetails";
import DoctorAppointmentDetailsCancel from "./Pages/DoctorAppointmentDetailsCancel";
import DoctorAppointmentDetailsSucess from "./Pages/DoctorAppointmentDetailsSucess";
import DoctorAppointmentCanceledDetails from "./Pages/DoctorAppointmentCanceledDetails";
import DoctorAppointmentSuccessDetails from "./Pages/DoctorAppointmentSuccessDetails";
import DoctorAppointmentPendingDetails from "./Pages/DoctorAppointmentPendingDetails";
import LaboratoryAppointments from "./Pages/LaboratoryAppointments";
import LaboratoryInfoDetails from "./Lab/LaboratoryInfoDetails";
import LaboratoryAppointmentDetails from "./Lab/LaboratoryAppointmentDetails";
import View from "./Pages/View";
import Notification from "./Pages/Notification";
import UserProfile from "./Profile/UserProfile";
import EditProfile from "./Profile/EditProfile";
import NeoCardGenerate from "./Pages/NeoCardGenerate";
import AboutUs from "./Cms/AboutUs";
import CmsPageList from "./Cms/List";
import CmsPageEdit from "./Cms/Edit";
import CmsPageAdd from "./Cms/Add";
import TermsConditions from "./Cms/TermsConditions";
import PrivacyPolicy from "./Cms/PrivacyPolicy";
import Blogs from "./Pages/Blogs";
import Faq from "./Faq/Faq";
import AddFaqs from "./Faq/AddFaqs";
import EditFaqs from "./Faq/EditFaqs";
import AddBlog from "./Pages/AddBlog";
import EditBlog from "./Pages/EditBlog";

/* ===== REQUEST / DETAILS ===== */
import DoctorRequestApporoval from "./Pages/DoctorRequestApporoval";
import DoctorDetailsReject from "./Pages/DoctorDetailsReject";
import LaboratoryRequest from "./Pages/LaboratoryRequest";
import LaboratoryRequestApporoval from "./Pages/LaboratoryRequestApporoval";
import LaboratoryRequestReject from "./Pages/LaboratoryRequestReject";
import PharmacyRequest from "./Pages/PharmacyRequest";
import PharmacyRequestApporoval from "./Pages/PharmacyRequestApporoval";
import PharmacyRequestReject from "./Pages/PharmacyRequestReject";
import HospitalRequest from "./Pages/HospitalRequest";
import HospitalRequestApporoval from "./Pages/HospitalRequestApporoval";
import HospitalDetailsReject from "./Pages/HospitalDetailsReject";
import PatientEditRequest from "./Pages/PatientEditRequest";
import DoctorEditRequest from "./Pages/DoctorEditRequest";
import HospitalEditRequest from "./Pages/HospitalEditRequest";
import LaboratoryEditRequest from "./Pages/LaboratoryEditRequest";
import PharmacyEditRequest from "./Pages/PharmacyEditRequest";
import UserProfileRequest from "./Pages/UserProfileRequest";
import UserProfileRequestEdit from "./Pages/UserProfileRequestEdit";
import HospitalRequestNew from "./Pages/HospitalRequestNew";
import PharmacyInfoDetails from "./Pharmacy/PharmacyInfoDetails";
import HospitalInfoDetails from "./Hospital/HospitalInfoDetails";
import Social from "./Social/Index";


//Landing Page
import DoctorLandingAdmin from "./Landing/DoctorLandingAdmin";
import HospitalLandingAdmin from "./Landing/HospitalLandingAdmin";
import LabLandingAdmin from "./Landing/LabLandingAdmin";
import PharmacyLandingAdmin from "./Landing/PharmacyLandingAdmin";
// Location Management
import CountryList from "./Location/CountryList";
import StateList from "./Location/StateList";
import CityList from "./Location/CityList";
import EditRequestList from "./Request/EditRequestList";
import SupplierList from "./Suppliers/SupplierList";

import SupplierForm from "./Suppliers/SupplierForm";
import AddPatient from "./Patients/AddPatient";
import AddDoctor from "./Doctor/AddDoctor";
import AddLab from "./Lab/AddLab";
import AddPharmacy from "./Pharmacy/AddPharmacy";
import AddHospital from "./Hospital/AddHospital";
import MedicineRequest from "./Pages/MedicineRequest";
import FirstPharPage from "./PharmacyLanding/FirstPhar";
import SecondPharPage from "./PharmacyLanding/SecondPhar";
import ThirdPharPage from "./PharmacyLanding/ThirdPhar";
import FourthPharPage from "./PharmacyLanding/Fourth";
import FivethPharPage from "./PharmacyLanding/FivethPhar";
import FirstLabPage from "./Lab Landing/FirstLab";
import SecondLabPage from "./Lab Landing/SecondLab";
import ThirdLabPage from "./Lab Landing/ThirdLab";
import FourthLabPage from "./Lab Landing/FourthLab";
import FivethLabPage from "./Lab Landing/FivethLab";
import SixLabPage from "./Lab Landing/SixLab";
import SevenLabPage from "./Lab Landing/SevenLab";
import FirstDoctorPage from "./Doctor Landing/FirstDoctor";
import SecondDoctorPage from "./Doctor Landing/SecondDoctor";
import ThirdDoctorPage from "./Doctor Landing/ThirdDoctor";
import FourthDoctorPage from "./Doctor Landing/FourthPage";
import FivethDoctorPage from "./Doctor Landing/FivethDoctor";
import FirstPatientPage from "./Patient Landing/FirstPatient";
import TestimonialPage from "./Patient Landing/Testimonial";
import HowItWorkPage from "./Patient Landing/HowItWorks";
import PtServices from "./Patient Landing/Services";
import TestCategory from "./Patient Landing/TestCategory";
import PtSpeciality from "./Patient Landing/PtSpeciality";
import PtMobileBanner from "./Patient Landing/PtMobileBanner";
import FirstHospitalPage from "./Hospital Landing/FirstHospital";
import ThirdHospitalPage from "./Hospital Landing/ThirdHospital";
import FourthHospitalPage from "./Hospital Landing/Security";
import SecurityHospitalPage from "./Hospital Landing/Security";
import DeployementHospitalPage from "./Hospital Landing/Deployement";
import InteroperabilityHospitalPage from "./Hospital Landing/Interoperability";
import SecondHospitalPage from "./Hospital Landing/SecondHospital";
import HospitalLandingFull from "./Hospital Landing/HospitalLandingFull";
import PharLandingFull from "./Landing/PharmacyLandingAdmin";
import DoctorLandingFull from "./Landing/DoctorLandingAdmin";
import LabLandingFull from "./Landing/LabLandingAdmin";
import ReadLineMainPage from "./Main Landing/Readlines";
import MainLandingFull from "./Main Landing/WebsiteLanding";
import PharmacyCategory from "./Patient Landing/PharmacyCategory";
import HospitalCategory from "./Patient Landing/HospitalCategory";
import ScheduleMedicines from "./Pages/ScheduleMedicines";
import ContactQuery from "./Pages/ContactQuery";
import SubTestCategory from "./Patient Landing/SubTestCategory";

function Router() {
  const router = createBrowserRouter([
    /* ===== PUBLIC ROUTE ===== */
    {
      path: "/login",
      element: <Login />,
    },

    /* ===== ADMIN PROTECTED ROUTES ===== */
    {
      path: "/",
      element: <AdminProtectedRoute />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "social", element: <Social /> },
            { path: "patients", element: <Patients /> },
            { path: "add-patient", element: <AddPatient /> },
            { path: "patients-info/:id", element: <PatientsPersonalInfo /> },
            { path: "schedule-medicines", element: <ScheduleMedicines /> },
            { path: "contact-query", element: <ContactQuery /> },


            //Landing Page
            // { path: "landing/doctor", element: <DoctorLandingAdmin /> },
            // { path: "landing/hospital", element: <HospitalLandingAdmin /> },
            // { path: "landing/lab", element: <LabLandingAdmin /> },
            // { path: "landing/pharmacy", element: <PharmacyLandingAdmin /> },

            { path: "landing/first-pharmacy", element: <FirstPharPage /> },
            { path: "landing/second-pharmacy", element: <SecondPharPage /> },
            { path: "landing/third-pharmacy", element: <ThirdPharPage /> },
            { path: "landing/fourth-pharmacy", element: <FourthPharPage /> },
            { path: "landing/fiveth-pharmacy", element: <FivethPharPage /> },

            { path: "landing/first-lab", element: <FirstLabPage /> },
            { path: "landing/second-lab", element: <SecondLabPage /> },
            { path: "landing/third-lab", element: <ThirdLabPage /> },
            { path: "landing/fourth-lab", element: <FourthLabPage /> },
            { path: "landing/fiveth-lab", element: <FivethLabPage /> },
            { path: "landing/six-lab", element: <SixLabPage /> },
            { path: "landing/seven-lab", element: <SevenLabPage /> },

            { path: "landing/first-doctor", element: <FirstDoctorPage /> },
            { path: "landing/second-doctor", element: <SecondDoctorPage /> },
            { path: "landing/third-doctor", element: <ThirdDoctorPage /> },
            { path: "landing/fourth-doctor", element: <FourthDoctorPage /> },
            { path: "landing/fiveth-doctor", element: <FivethDoctorPage /> },

            { path: "landing/first-patient", element: <FirstPatientPage /> },
            { path: "landing/patient-speciality", element: <PtSpeciality /> },
            { path: "landing/patient-testimonial", element: <TestimonialPage /> },
            { path: "landing/patient-test-category", element: <TestCategory /> },
            { path: "landing/sub-test-category/:id", element: <SubTestCategory /> },
            { path: "landing/patient-hospital-category", element: <HospitalCategory /> },
            { path: "landing/patient-pharmacy-category", element: <PharmacyCategory /> },
            { path: "landing/patient-how-it-work", element: <HowItWorkPage /> },
            { path: "landing/patient-services", element: <PtServices /> },
            { path: "landing/patient-banner", element: <PtMobileBanner /> },

            // { path: "landing/first-hospital", element: <FirstHospitalPage /> },
            { path: "landing/hospital", element: <HospitalLandingFull /> },
            { path: "landing/pharmacy", element: <PharLandingFull /> },
            { path: "landing/doctor", element: <DoctorLandingFull /> },
            { path: "landing/laboratory", element: <LabLandingFull /> },
            { path: "landing/website", element: <MainLandingFull /> },
            // { path: "landing/second-hospital", element: <SecondHospitalPage /> },
            // { path: "landing/third-hospital", element: <ThirdHospitalPage /> },
            // { path: "landing/security-hospital", element: <SecurityHospitalPage /> },
            // { path: "landing/interoperability-hospital", element: <InteroperabilityHospitalPage /> },
            // { path: "landing/deployement-hospital", element: <DeployementHospitalPage /> },
            




            // ===== LOCATION MANAGEMENT =====
            { path: "location/countries", element: <CountryList /> },
            { path: "location/states", element: <StateList /> },
            { path: "location/cities", element: <CityList /> },

            { path: "doctor-request", element: <DoctorRequest /> },
            { path: "doctor-approve-details/:id", element: <DoctorRequestApporoval /> },
            { path: "doctor-reject-details/:id", element: <DoctorDetailsReject /> },

            { path: "laboratory-request", element: <LaboratoryRequest /> },
            { path: "lab-request-approve/:id", element: <LaboratoryRequestApporoval /> },
            { path: "lab-request-reject/:id", element: <LaboratoryRequestReject /> },

            { path: "pharmacy-request", element: <PharmacyRequest /> },
            { path: "pharmacy-request-approve/:id", element: <PharmacyRequestApporoval /> },
            { path: "pharmacy-request-reject/:id", element: <PharmacyRequestReject /> },
            { path: "hospital-request", element: <HospitalRequest /> },
            { path: "hospital-request-approve/:id", element: <HospitalRequestApporoval /> },
            { path: "hospital-request-reject/:id", element: <HospitalDetailsReject /> }, 
            { path: "edit-request", element: <EditRequestList /> },
            { path: "medicine-request", element: <MedicineRequest /> },

            { path: "doctor-list", element: <DoctorsList /> }, 
            { path: "add-doctor", element: <AddDoctor /> }, 
            { path: "doctor-info-details/:id", element: <DoctorInfoDetails /> },  
            { path: "laboratory-list", element: <LaboratoryList /> },
            { path: "laboratory", element: <LaboratoryList /> },
            { path: "pharmacy", element: <PharmacyList /> },
            { path: "hospital", element: <HospitalList /> },
            { path: "doctors", element: <DoctorsList /> },
            { path: "lab-appointment-details/:id", element: <LaboratoryAppointmentDetails /> },
            { path: "appointment-details/:id",     element: <LaboratoryAppointmentDetails /> },
            { path: "lab-report-view/:id", element: <LaboratoryAppointmentDetails /> },
            { path: "laboratory-appointments", element: <LaboratoryAppointments /> },
            { path: "pharmacy-detail/:id", element: <PharmacyInfoDetails /> },
            { path: "add-prescription", element: <PatientsPersonalInfo /> },
            { path: "add-lab", element: <AddLab /> },
            { path: "lab-info-details/:id",  element: <LaboratoryInfoDetails /> },            { path: "pharmacy-list", element: <PharmacyList /> },
            { path: "add-pharmacy", element: <AddPharmacy /> },
            { path: "hospital-list", element: <HospitalList /> },
            { path: "add-hospital", element: <AddHospital /> },
            { path: "hospital-info-details/:id", element: <HospitalInfoDetails /> },

            { path: "doctor-appointment", element: <DoctorAppointments /> },
            { path: "doctor-appointment-details/:id", element: <DoctorAppointmentDetails /> },
            { path: "doctor-appointment-pending/:id",  element: <DoctorAppointmentPendingDetails /> },
            { path: "doctor-appointment-success/:id",  element: <DoctorAppointmentSuccessDetails /> },
            { path: "doctor-appointment-canceled/:id", element: <DoctorAppointmentCanceledDetails /> },
            { path: "lab-appointment-due/:id",     element: <LaboratoryAppointmentDueDetails /> },
            { path: "lab-appointment-visit/:id",   element: <LaboratoryAppointmentVisitDetails /> },
            { path: "lab-appointment-success/:id", element: <LabAppointmentSucess /> },
            { path: "pharmacy-details/:id",        element: <PharmacyDetails /> },
            { path: "pharmacy-new-details/:id",    element: <PharmacyNewDetails /> },
            { path: "lab-appointment", element: <LaboratoryAppointments /> },

            { path: "view", element: <View /> },
            { path: "notification", element: <Notification /> },

            { path: "user-profile", element: <UserProfile /> },
            { path: "edit-profile", element: <EditProfile /> },

            { path: "neo-card", element: <NeoCardGenerate /> },

            { path: "user-request", element: <UserProfileRequest /> },
            { path: "user-request-edit", element: <UserProfileRequestEdit /> },
            { path: "new-hospital-request", element: <HospitalRequestNew /> },

            { path: "patient-edit-request", element: <PatientEditRequest /> },
            { path: "doctor-edit-request", element: <DoctorEditRequest /> },
            { path: "hospital-edit-request", element: <HospitalEditRequest /> },
            { path: "laboratory-edit-request", element: <LaboratoryEditRequest /> },
            { path: "pharmacy-edit-request", element: <PharmacyEditRequest /> },
            { path: "pharmacy-info-details/:id", element: <PharmacyInfoDetails /> },

            { path: "about-us", element: <AboutUs /> },
            { path: "cms-page-list", element: <CmsPageList /> }, 
            { path: "edit-cms/:slug/:panel", element: <CmsPageEdit /> }, 
            { path: "add-cms", element: <CmsPageAdd /> },
            { path: "terms-condition", element: <TermsConditions /> },
            { path: "privacy-policy", element: <PrivacyPolicy /> },
            { path: "faqs", element: <Faq /> },


            { path: "suppliers", element: <SupplierList /> },
            { path: "suppliers/add", element: <SupplierForm /> },
            { path: "suppliers/edit/:id", element: <SupplierForm /> },


            { path: "blogs", element: <Blogs /> },
            { path: "add-blog", element: <AddBlog /> },
            { path: "edit-blog", element: <EditBlog /> },
            { path: "add-faqs", element: <AddFaqs /> },
            { path: "edit-faqs", element: <EditFaqs /> },
            { path: "edit-faqs/:id", element: <EditFaqs /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
