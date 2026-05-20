// App.js
import Router from "./Components/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GlobalSocketProvider } from "./Components/Utils/useGlobalSocket"; // ✅ Provider import
import GlobalCallUI from "./Components/Utils/GlobalCallUi";

function App() {
  return (
    // ✅ Poori app ko Provider se wrap karo — sirf ek instance
    <GlobalSocketProvider>
      <GlobalCallUI />
      <Router />
      <ToastContainer position="top-right" autoClose={2000} />
    </GlobalSocketProvider>
  );
}

export default App;