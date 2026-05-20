  import { createBrowserRouter, RouterProvider } from "react-router-dom";
  import AppLayout from "./Layout/AppLayout";
  import Dashboard from "./Pages/Dashboard";
  import Patients from "./Pages/Patients";
  import DoctorRequest from "./Pages/DoctorRequest";
  import DoctorsList from "./Pages/DoctorsList";
  import LaboratoryList from "./Pages/LaboratoryList";
  import LaboratoryRequest from "./Pages/LaboratoryRequest";
  import PharmacyRequest from "./Pages/PharmacyRequest";
  import HospitalRequest from "./Pages/HospitalRequest";
  import PatientsPersonalInfo from "./Pages/PatientsPersonalInfo";
  import DoctorAppointmentDetails from "./Pages/DoctorAppointmentDetails";
  import DoctorAppointmentDetailsCancel from "./Pages/DoctorAppointmentDetailsCancel";
  import LaboratoryAppointmentDetails from "./Pages/LaboratoryAppointmentDetails";
  import AboutUs from "./Pages/AboutUs";
  import LaboratoryAppointments from "./Pages/LaboratoryAppointments";
  import DoctorAppointments from "./Pages/DoctorAppointments";
  import UserProfileRequest from "./Pages/UserProfileRequest";
  import UserProfileRequestEdit from "./Pages/UserProfileRequestEdit";
  import HospitalRequestNew from "./Pages/HospitalRequestNew";
  import ErrorPage from "./Pages/ErrorPage";
  import LaboratoryAppointmentDueDetails from "./Pages/LaboratoryAppointmentDueDetails";
  import LaboratoryAppointmentVisitDetails from "./Pages/LaboratoryAppointmentVisitDetails";
  import DoctorInfoDetails from "./Pages/DoctorInfoDetails";
  import DoctorAppointmentDetailsSucess from "./Pages/DoctorAppointmentDetailsSucess";
  import Notification from "./Pages/Notification";
  import LaboratoryInfoDetails from "./Pages/LaboratoryInfoDetails";
  import PharmacyInfoDetails from "./Pages/PharmacyInfoDetails";
  import HospitalInfoDetails from "./Pages/HospitalInfoDetails";
  import DoctorAppointmentPendingDetails from "./Pages/DoctorAppointmentPendingDetails";
  import DoctorAppointmentCanceledDetails from "./Pages/DoctorAppointmentCanceledDetails";
  import DoctorAppointmentSuccessDetails from "./Pages/DoctorAppointmentSuccessDetails";
  import View from "./Pages/View";
  import TermsConditions from "./Pages/TermsConditions";
  import Faq from "./Pages/Faq";
  import Blogs from "./Pages/Blogs";
  import PrivacyPolicy from "./Pages/PrivacyPolicy";
  import AddFaqs from "./Pages/AddFaqs";
  import EditFaqs from "./Pages/EditFaqs";
  import AddBlog from "./Pages/AddBlog";
  import EditBlog from "./Pages/EditBlog";
  import UserProfile from "./Pages/UserProfile";
  import EditProfile from "./Pages/EditProfile";
  import NeoCardGenerate from "./Pages/NeoCardGenerate";
  import PharmacyList from "./Pages/PharmacyList";
  import HospitalList from "./Pages/HospitalList";
  import Login from "./Pages/Login";
  import PharmacyDetails from "./Pages/PharmacyDetails";
  import PharmacyNewDetails from "./Pages/PharmacyNewDetails";
  import DoctorRequestApporoval from "./Pages/DoctorRequestApporoval";
  import DoctorDetailsReject from "./Pages/DoctorDetailsReject";
  import LaboratoryRequestApporoval from "./Pages/LaboratoryRequestApporoval";
  import LaboratoryRequestReject from "./Pages/LaboratoryRequestReject";
  import PharmacyRequestApporoval from "./Pages/PharmacyRequestApporoval";
  import PharmacyRequestReject from "./Pages/PharmacyRequestReject";
  import HospitalRequestApporoval from "./Pages/HospitalRequestApporoval";
  import HospitalDetailsReject from "./Pages/HospitalDetailsReject";
  import PatientEditRequest from "./Pages/PatientEditRequest";
  import DoctorEditRequest from "./Pages/DoctorEditRequest";
  import HospitalEditRequest from "./Pages/HospitalEditRequest";
  import LaboratoryEditRequest from "./Pages/LaboratoryEditRequest";
  import PharmacyEditRequest from "./Pages/PharmacyEditRequest";




  function Router() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <AppLayout />,
        errorElement: <ErrorPage />,

        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          
          {
            path: "/dashboard",
            element: <Dashboard />,
          },

        
          {
            path: "/doctor-request",
            element: <DoctorRequest />,
          },

          
          {
            path: "/doctor-approve-details",
            element: <DoctorRequestApporoval />,
          },

          
          {
            path: "/doctor-reject-details",
            element: <DoctorDetailsReject />,
          },


        
          {
            path: "/laboratory-request",
            element: <LaboratoryRequest />,
          },

        
          {
            path: "/lab-request-approve",
            element: <LaboratoryRequestApporoval />,
          },

        
          {
            path: "/lab-request-reject",
            element: <LaboratoryRequestReject />,
          },

        
            {
            path: "/pharmacy-request",
            element: <PharmacyRequest />,
          },

          
          {
            path: "/pharmacy-request-approve",
            element: <PharmacyRequestApporoval />,
          },
          
          {
            path: "/pharmacy-request-reject",
            element: <PharmacyRequestReject />,
          },


        
          {
            path: "/hospital-request",
            element: <HospitalRequest />,
          },

          
            {
            path: "/hospital-request-approve",
            element: <HospitalRequestApporoval />,
          },

            
          {
            path: "/hospital-request-reject",
            element: <HospitalDetailsReject />,
          },

        
          {
            path: "/patients",
            element: <Patients />,
          },

          
          {
            path: "/patients-info",
            element: <PatientsPersonalInfo />,
          },

          
            {
            path: "/doctor-details-cancel",
            element: <DoctorAppointmentDetailsCancel />,
          },

        
          {
            path: "/doctor-details-sucess",
            element: <DoctorAppointmentDetails />,
          },

        
          {
            path: "/lab-details",
            element: <LaboratoryAppointmentDetails />,
          },


        
          {
            path: "/lab-due-details",
            element: <LaboratoryAppointmentDueDetails />,
          },

        
          {
            path: "/lab-visit-details",
            element: <LaboratoryAppointmentVisitDetails />,
          },


        
          {
            path: "/doctor-list",
            element: <DoctorsList />,
          },

        
          {
            path: "/doctor-info-details",
            element: <DoctorInfoDetails />,
          },

        
          {
            path: "/laboratory-list",
            element: <LaboratoryList />,
          },

        
          {
            path: "/lab-info-details",
            element: <LaboratoryInfoDetails />,
          },


        
            {
            path: "/pharmacy-list",
            element: <PharmacyList />,
          },

        
            {
            path: "/pharmacy-info-details",
            element: <PharmacyInfoDetails />,
          },

        
          {
            path: "/pharmacy-detail",
            element: <PharmacyDetails/>,
          },

        
          {
            path: "/hospital-list",
            element: <HospitalList />,
          },

        

          {
            path: "/hospital-info-details",
            element: <HospitalInfoDetails />,
          },

        

          {
            path: "/doctor-appointment",
            element: <DoctorAppointments />,
          },

        
          {
            path: "/doctor-appointment-pending",
            element: <DoctorAppointmentPendingDetails />,
          },

        
            {
            path: "/doctor-appointment-cancel",
            element: <DoctorAppointmentCanceledDetails />,
          },

        
          {
            path: "/doctor-appointment-success",
            element: <DoctorAppointmentSuccessDetails />,
          },

        

          {
            path: "/view",
            element: <View />,
          },

            

          {
            path: "/lab-appointment",
            element: <LaboratoryAppointments />,
          },

        

          {
            path: "/neo-card",
            element: <NeoCardGenerate />,
          },

          {
            path: "/patient-edit-request",
            element: <PatientEditRequest />,
          },

          {
            path: "/doctor-edit-request",
            element: <DoctorEditRequest />,
          },

          {
            path: "/hospital-edit-request",
            element: <HospitalEditRequest />,
          },

          {
            path: "/laboratory-edit-request",
            element: <LaboratoryEditRequest />,
          },

          {
            path: "/pharmacy-edit-request",
            element: <PharmacyEditRequest />,
          },


            {
            path: "/user-profile",
            element: <UserProfile />,
          },

          
          {
            path: "/edit-profile",
            element: <EditProfile />,
          },

          
        
          {
            path: "/terms-condition",
            element: <TermsConditions />,
          },

          {
            path: "/privacy-policy",
            element: <PrivacyPolicy />,
          },

          
          {
            path: "/about-us",
            element: <AboutUs />,
          },

            {
            path: "/faqs",
            element: <Faq />,
          },

            
          {
            path: "/add-faqs",
            element: <AddFaqs />,
          },
          {
            path: "/edit-faqs",
            element: <EditFaqs />,
          },

          {
            path: "/blogs",
            element: <Blogs />,
          },
          {
            path: "/add-blog",
            element: <AddBlog />,
          },
          {
            path: "/edit-blog",
            element: <EditBlog />,
          },

          {
            path: "/notification",
            element: <Notification />,
          },

          {
            path: "/login",
            element: <Login/>,
          },



      
          {
            path: "/doctor-details-sucess",
            element: <DoctorAppointmentDetails />,
          },

          {
            path: "/doctor-details-cancel",
            element: <DoctorAppointmentDetailsCancel />,
          },

          
          {
            path: "/doctor-appointment-details",
            element: <DoctorAppointmentDetailsSucess />,
          },

          {
            path: "/user-request",
            element: <UserProfileRequest />,
          },

          {
            path: "/user-request-edit",
            element: <UserProfileRequestEdit />,
          },

          {
            path: "/new-hospital-request",
            element: <HospitalRequestNew />,
          },

      
          {
            path: "/pharmacy-new-detail",
            element: <PharmacyNewDetails/>,
          },




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