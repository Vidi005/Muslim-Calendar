import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const PrayerTimesPage = ({ t, isSidebarExpanded, selectFormula }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('pages.1')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer t={t} isSidebarExpanded={isSidebarExpanded} selectFormula={selectFormula} />
  </div>
)

export default PrayerTimesPage