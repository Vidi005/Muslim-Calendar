import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const MoonCrescentMapPage = ({ t, isSidebarExpanded, selectedLanguage, formattedDateTime, hijriStartDates, moonInfos, selectedMoonVisibilityCriteria, selectedCoordinateSteps, generateMoonCrescentVisibility }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('pages.2')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      isSidebarExpanded={isSidebarExpanded}
      selectedLanguage={selectedLanguage}
      formattedDateTime={formattedDateTime}
      hijriStartDates={hijriStartDates}
      moonInfos={moonInfos}
      selectedMoonVisibilityCriteria={selectedMoonVisibilityCriteria}
      selectedCoordinateSteps={selectedCoordinateSteps}
      generateMoonCrescentVisibility={generateMoonCrescentVisibility}
    />
  </div>
)

export default MoonCrescentMapPage