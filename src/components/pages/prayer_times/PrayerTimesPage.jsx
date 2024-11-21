import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const PrayerTimesPage = ({ t, isSidebarExpanded, selectedLanguage, formattedDateTime, selectedLocation, monthsInSetYear, hijriStartDates, selectCalculationMethod, selectAshrTime, getCurrentConvention, selectConvention, selectIhtiyath, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, generatePrayerTimes }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('pages.1')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      isSidebarExpanded={isSidebarExpanded}
      selectedLanguage={selectedLanguage}
      formattedDateTime={formattedDateTime}
      selectedLocation={selectedLocation}
      monthsInSetYear={monthsInSetYear}
      hijriStartDates={hijriStartDates}
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
      getCurrentConvention={getCurrentConvention}
      selectConvention={selectConvention}
      selectIhtiyath={selectIhtiyath}
      selectCorrections={selectCorrections}
      selectDhuhaMethod={selectDhuhaMethod}
      onInputSunAltitudeChange={onInputSunAltitudeChange}
      onInputMinutesChange={onInputMinutesChange}
      selectFormula={selectFormula}
      generatePrayerTimes={generatePrayerTimes}
    />
  </div>
)

export default PrayerTimesPage