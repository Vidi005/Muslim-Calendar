import React from "react"
import InputForm from "../InputForm"
import PrayerTimesSettings from "./PrayerTimesSettings"
import CurrentPrayerTimes from "./CurrentPrayerTimes"
import PrayerTimesVisualization from "./PrayerTimesVisualization"
import QiblaDirection from "./QiblaDirection"
import PrayerTimesList from "./PrayerTimesList"

const PrayerTimesContent = ({ t, parentState, state, selectCalculationMethod, selectAshrTime, selectConvention, selectIhtiyath, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, resetSettings, changeMonthType, selectGregorianMonth, selectHijriMonth, downloadFile }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <PrayerTimesSettings
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
      selectConvention={selectConvention}
      selectIhtiyath={selectIhtiyath}
      selectCorrections={selectCorrections}
      selectDhuhaMethod={selectDhuhaMethod}
      onInputSunAltitudeChange={onInputSunAltitudeChange}
      onInputMinutesChange={onInputMinutesChange}
      selectFormula={selectFormula}
      resetSettings={resetSettings}
    />
    <div className="current-prayer-times flex flex-wrap md:items-stretch">
      <CurrentPrayerTimes/>
      <QiblaDirection t={t} heading={state.heading} qiblaDirection={state.qiblaDirection}/>
      <PrayerTimesVisualization
        t={t}
        selectedLanguage={parentState.selectedLanguage}
        inputDate={parentState.inputDate}
        inputTime={parentState.inputTime}
        formattedDateTime={parentState.formattedDateTime}
        timeZone={parentState.selectedTimezone}
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
        selectedTimezone={parentState.selectedTimezone}
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
  </article>
)

export default PrayerTimesContent