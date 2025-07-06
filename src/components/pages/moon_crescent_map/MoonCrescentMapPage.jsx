import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"
import FooterContainer from "../Footer"

const MoonCrescentMapPage = ({ t, isSidebarExpanded, selectedLanguage, selectedTimeZone, formattedDateTime, hijriStartDates, selectedMoonVisibilityCriteria, selectedElongationType, selectedAltitudeType, selectedObservationTime, isUseNormalRefraction, isTooltipShown, selectedCoordinateSteps, generateMoonCrescentVisibility }) => (
  <div className="moon-crescent-map-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('app_name') + ' | ' + t('pages.2')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      isSidebarExpanded={isSidebarExpanded}
      selectedLanguage={selectedLanguage}
      selectedTimeZone={selectedTimeZone}
      formattedDateTime={formattedDateTime}
      hijriStartDates={hijriStartDates}
      selectedMoonVisibilityCriteria={selectedMoonVisibilityCriteria}
      selectedElongationType={selectedElongationType}
      selectedAltitudeType={selectedAltitudeType}
      selectedObservationTime={selectedObservationTime}
      isUseNormalRefraction={isUseNormalRefraction}
      isTooltipShown={isTooltipShown}
      selectedCoordinateSteps={selectedCoordinateSteps}
      generateMoonCrescentVisibility={generateMoonCrescentVisibility}
    />
    {innerWidth >= 1280 && <FooterContainer/>}
  </div>
)

export default MoonCrescentMapPage