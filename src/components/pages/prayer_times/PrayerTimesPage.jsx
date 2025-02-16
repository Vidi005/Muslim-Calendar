import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const PrayerTimesPage = ({ t, parentState, selectCalculationMethod, selectAshrTime, getCurrentConvention, selectConvention, selectIhtiyath, onChangePrecision, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, generatePrayerTimes }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('pages.1')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      parentState={parentState}
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
      getCurrentConvention={getCurrentConvention}
      selectConvention={selectConvention}
      selectIhtiyath={selectIhtiyath}
      onChangePrecision={onChangePrecision}
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