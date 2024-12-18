import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const MoonCrescentMapPage = ({ t, isSidebarExpanded, formattedDateTime, hijriStartDates }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('pages.2')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      isSidebarExpanded={isSidebarExpanded}
      formattedDateTime={formattedDateTime}
      hijriStartDates={hijriStartDates}
    />
  </div>
)

export default MoonCrescentMapPage