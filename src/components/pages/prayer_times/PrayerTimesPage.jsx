import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const PrayerTimesPage = ({ t, isSidebarExpanded}) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <meta name="keyword" content="Prayer Times" />
    </Helmet>
    <HeaderContainer />
    <MainContainer t={t} isSidebarExpanded={isSidebarExpanded} />
  </div>
)

export default PrayerTimesPage