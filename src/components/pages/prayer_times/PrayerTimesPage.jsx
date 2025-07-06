import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"
import FooterContainer from "../Footer"

const PrayerTimesPage = ({ t, parentState, selectCalculationMethod, selectAshrTime, getCurrentConvention, selectConvention, onInputCustomFajrAngleChange, onInputCustomIshaAngleChange, selectZawal, selectIhtiyath, onChangePrecision, selectRoundingMethod, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, generatePrayerTimes }) => (
  <div className="prayer-times-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('app_name') + ' | ' + t('pages.1')}</title>
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      parentState={parentState}
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
      getCurrentConvention={getCurrentConvention}
      selectConvention={selectConvention}
      onInputCustomFajrAngleChange={onInputCustomFajrAngleChange}
      onInputCustomIshaAngleChange={onInputCustomIshaAngleChange}
      selectZawal={selectZawal}
      selectIhtiyath={selectIhtiyath}
      onChangePrecision={onChangePrecision}
      selectRoundingMethod={selectRoundingMethod}
      selectCorrections={selectCorrections}
      selectDhuhaMethod={selectDhuhaMethod}
      onInputSunAltitudeChange={onInputSunAltitudeChange}
      onInputMinutesChange={onInputMinutesChange}
      selectFormula={selectFormula}
      generatePrayerTimes={generatePrayerTimes}
    />
    {innerWidth >= 1280 && <FooterContainer/>}
  </div>
)

export default PrayerTimesPage