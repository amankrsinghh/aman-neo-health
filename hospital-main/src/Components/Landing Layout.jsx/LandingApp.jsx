import React from 'react'
import ScrollToHash from './ScrollToHash'
import LandingHeader from './LandingHeader'
import { Outlet } from 'react-router-dom'
import LandingFooter from './LandingFooter'

function LandingApp() {
  return (
    <>
    <ScrollToHash/>
    <LandingHeader/>
    <Outlet/>
    <LandingFooter/>
      
    </>
  )
}

export default LandingApp
