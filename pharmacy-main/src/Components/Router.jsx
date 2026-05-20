import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./Pages/Dashboard";
import Supplier from "./Pages/Supplier";
import ChangePassword from "./Pages/ChangePassword";
import Notification from "./Pages/Notification";
import PermissionCheck from "./Pages/PermissionCheck";
import Permission from "./Pages/Permission";
import AddManually from "./Pages/AddManually";
import AddEmployee from "./Pages/AddEmployee";
import ViewEmployee from "./Pages/ViewEmployee";
import Chat from "./Pages/Chat";
import Analysis from "./Pages/Analysis";
import Sell from "./Pages/Sell";
import MedicineRequest from "./Pages/MedicineRequest";
import Returns from "./Pages/Returns";
import AddReturn from "./Pages/AddReturn";
import EditReturn from "./Pages/EditReturn";
import NewGeneratePo from "./Pages/NewGeneratePo";
import EditGeneratePo from "./Pages/EditGeneratePo";
import EditProfile from "./Pages/EditProfile";
import Error from "./Pages/Error";
import InventoryList from "./Pages/InventoryList";
import NewAnalysis from "./Pages/NewAnalysis";
import PrescriptionsBar from "./Pages/PrescriptionsBar";
import PrescriptionDetails from "./Pages/PrescriptionDetails";
import AddPrescriptionDetails from "./Pages/AddPrescriptionDetails";
import ScanPrescriptionDetails from "./Pages/ScanPrescriptionDetails";
import Employee from "./Pages/Employee";
import Profile from "./Pages/Profile";
import GenerateList from "./Pages/GenerateList";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import Otp from "./Auth/Otp";
import SetPassword from "./Auth/SetPassword";
import CreateAccount from "./Auth/CreateAccount";
import CreateAccountImage from "./Auth/CreateAccountImage";
import CreateAccountAddress from "./Auth/CreateAccountAddress";
import CreateAccountUpload from "./Auth/CreateAccountUpload";
import CreateAccountPerson from "./Auth/CreateAccountPerson";
import ApproveProfile from "./Pages/ApproveProfile";
import ProtectedRoute from "./ProtectedRoute";
import Wating from "./Auth/Waiting";
import H1Medicine from "./Pages/H1Medicine";
import XMedicine from "./Pages/XMedicine";
import HMedicine from "./Pages/HMedicine";
import OtherMedicine from "./Pages/OtherMedicine";
import NeoHealthPharmaLanding from "./Pages/LandingPage";
import NeoAi from "./Pages/NeoAi";
import LandingApp from "./Landing Layout/LandingApp";
import PrivacyPolicy from "./CMS/PrivacyPolicy";
import TermAndCondition from "./CMS/TermAndCondition";
import MedicalDisclaimer from "./CMS/MedicalDisclaimer";
import AddPatient from "./Pages/AddPatient";
import AuditLog from "./Pages/AuditLog";
import CustomerReturn from "./Pages/CustomerReturn";
import Auditlog from "./CMS/AudtLog";
import AccessControl from "./CMS/AccessControl";
import CmsDynamic from "./CMS/CmsDynamic";
import { useGlobalSocket } from "./Utils/useGlobalSocket";
import MyPermission from "./Pages/MyPermission";
import PharmacyInvoice from "./Templates/PharmacyInvoice";

function Router() {
  const { socket, startCall } = useGlobalSocket();
  const router = createBrowserRouter([

    {
      path: "/",
      element: <LandingApp />,
      children: [
        { index: true, element: <NeoHealthPharmaLanding /> },
        { path: "/", element: <NeoHealthPharmaLanding /> },
        {
          path: "/term-condition",
          element: <TermAndCondition />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/medical-disclaimer",
          element: <MedicalDisclaimer />,
        },
        {
          path: "/access-control",
          element: <AccessControl />,
        },
        {
          path: "/audit-log",
          element: <Auditlog />,
        },
        {
          path: "/page/:slug",
          element: <CmsDynamic />,
        },
        {
          path: "/invoice/:id",
          element: <PharmacyInvoice />,
        },

      ]
    },
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <Error />,
      children: [

        // -----------------------------
        // 🔓 PUBLIC ROUTES
        // -----------------------------
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/otp", element: <Otp /> },
        { path: "/set-password", element: <SetPassword /> },
        { path: "/create-account", element: <CreateAccount /> },

        // -----------------------------
        // 🔒 PROTECTED ROUTES (GROUPED)
        // -----------------------------
        {
          element: <ProtectedRoute />, // 👈 yaha ek baar lagaya
          children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/sell", element: <Sell /> },
            { path: "/add-patient", element: <AddPatient /> },
            { path: "/audit-log", element: <AuditLog /> },

            { path: "/prescriptions-bar/:id", element: <PrescriptionsBar /> },
            { path: "/prescriptions-detail/:id", element: <PrescriptionDetails /> },
            { path: "/add-prescriptions-detail", element: <AddPrescriptionDetails /> },
            { path: "/scan-prescriptions-detail/:id", element: <ScanPrescriptionDetails /> },

            { path: "/add-manually", element: <AddManually /> },
            { path: "/edit-sell/:id", element: <AddManually /> },
            { path: "/customer-return/:id", element: <CustomerReturn /> },

            { path: "/supplier", element: <Supplier /> },
            { path: "/neo-ai", element: <NeoAi /> },

            { path: "/generate-list", element: <GenerateList /> },
            { path: "/new-generate", element: <NewGeneratePo /> },
            { path: "/edit-generate", element: <EditGeneratePo /> },

            { path: "/returns", element: <Returns /> },
            { path: "/add-return", element: <AddReturn /> },
            { path: "/edit-return", element: <EditReturn /> },

            { path: "/analysis", element: <Analysis /> },
            { path: "/new-analysis", element: <NewAnalysis /> },

            { path: "/inventory", element: <InventoryList /> },
            { path: "/chat", element: <Chat socket={socket} startCall={startCall}/> },

            { path: "/profile", element: <Profile /> },
            { path: "/approve-profile", element: <ApproveProfile /> },
            { path: "/edit-profile", element: <EditProfile /> },

            { path: "/employee", element: <Employee /> },
            { path: "/add-employee", element: <AddEmployee /> },
            { path: "/employee-data", element: <AddEmployee /> },
            { path: "/view-employee/:name/:id", element: <ViewEmployee /> },
            { path: "/permission-check/:name/:id", element: <PermissionCheck /> },
            { path: "/permission", element: <Permission /> },
            { path: "/my-permission", element: <MyPermission /> },

            { path: "/change-password", element: <ChangePassword /> },
            { path: "/notification", element: <Notification /> },

            { path: "/medicine-request", element: <MedicineRequest /> },
            { path: "/wating-for-approval", element: <Wating /> },

            { path: "/medicine-list/:scheduleName/:id", element: <H1Medicine /> },

            { path: "/create-account-image", element: <CreateAccountImage /> },
            { path: "/create-account-address", element: <CreateAccountAddress /> },
            { path: "/create-account-person", element: <CreateAccountPerson /> },
            { path: "/create-account-upload", element: <CreateAccountUpload /> },
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
