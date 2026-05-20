import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './features/patient'
import doctorReducer from './features/doctor'
export const store = configureStore({
  reducer: {
    patient: patientReducer,
    doctor: doctorReducer

  },
})