import React from "react"
import InputForm from "../InputForm"
import PrayerTimesSettings from "./PrayerTimesSettings"
import CurrentPrayerTimes from "./CurrentPrayerTimes"
import PrayerTimesVisualization from "./PrayerTimesVisualization"
import QiblaDirection from "./QiblaDirection"
import PrayerTimesList from "./PrayerTimesList"
import FooterContainer from "../Footer"

const PrayerTimesContent = ({ t, parentState, state, selectCalculationMethod, selectAshrTime, selectConvention, onInputCustomFajrAngleChange, onInputCustomIshaAngleChange, selectZawal, selectIhtiyath, onChangePrecision, selectRoundingMethod, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, resetSettings, changeMonthType, selectGregorianMonth, selectHijriMonth, downloadFile }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <PrayerTimesSettings
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
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
      resetSettings={resetSettings}
    />
    <div className="flex flex-wrap md:items-stretch">
      <CurrentPrayerTimes/>
      <QiblaDirection t={t} heading={state.heading} qiblaDirection={state.qiblaDirection}/>
      <PrayerTimesVisualization
        t={t}
        selectedLanguage={parentState.selectedLanguage}
        inputDate={parentState.inputDate}
        inputTime={parentState.inputTime}
        formattedDateTime={parentState.formattedDateTime}
        timeZone={parentState.selectedTimeZone}
        isPreciseToSeconds={parentState.isPreciseToSeconds}
        sunAltitude={parentState.sunAltitude}
        selectedDhuhaMethod={parentState.selectedDhuhaMethod}
        dhuhaSunAltitude={parentState.inputSunAltitude}
        currentPrayerTimes={parentState.prayerTimes[1]}
        areSunInfosLoading={state.areSunInfosLoading}
        sunInfos={state.sunInfos}
      />
      <PrayerTimesList
        t={t}
        selectedLanguage={parentState.selectedLanguage}
        formattedDateTime={parentState.formattedDateTime}
        selectedLocation={parentState.selectedLocation}
        selectedCriteria={parentState.selectedCriteria}
        monthsInSetYear={parentState.monthsInSetYear}
        hijriStartDates={parentState.hijriStartDates}
        monthType={state.monthType}
        selectedGregorianMonth={state.selectedGregorianMonth}
        selectedHijriMonth={state.selectedHijriMonth}
        latitude={parentState.latitude}
        longitude={parentState.longitude}
        elevation={parentState.elevation}
        selectedConvention={parentState.selectedConvention}
        selectedAshrTime={parentState.selectedAshrTime}
        selectedIhtiyath={parentState.selectedIhtiyath}
        selectedTimeZone={parentState.selectedTimeZone}
        changeMonthType={changeMonthType}
        selectGregorianMonth={selectGregorianMonth}
        selectHijriMonth={selectHijriMonth}
        arePrayerTimesListLoading={state.arePrayerTimesListLoading}
        prayerTimesList={state.prayerTimesList}
        downloadFile={downloadFile}
      />
    </div>
    {innerWidth <= 1024 && <FooterContainer/>}
  </article>
)

export default PrayerTimesContent