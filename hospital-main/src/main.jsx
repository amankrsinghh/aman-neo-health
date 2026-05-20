import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./assets/css/style.css"
import "./assets/css/responsive.css"
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { messaging } from './firebase.js'

if ("serviceWorker" in navigator) {
  console.log("in")
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>

    <App />
  </Provider>
  // </StrictMode>,
)
