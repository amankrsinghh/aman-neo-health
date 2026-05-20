
import { ToastContainer } from 'react-toastify'
import Router from './Components/Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GlobalSocketProvider } from './Components/Utils/useGlobalSocket';
import GlobalCallUI from './Components/Utils/GlobalCallUi';
function App() {
  return (
    <>
     <GlobalSocketProvider>
      <GlobalCallUI />
    <Router/>
    <ToastContainer/>
    </GlobalSocketProvider>
    </>
  )
}

export default App
