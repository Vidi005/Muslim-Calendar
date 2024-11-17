import React from "react"
import InputForm from "../InputForm"
import PrayerTimesSettings from "./PrayerTimesSettings"
import CurrentPrayerTimes from "./CurrentPrayerTimes"
import PrayerTimesVisualization from "./PrayerTimesVisualization"
import QiblaDirection from "./QiblaDirection"
import PrayerTimesList from "./PrayerTimesList"

const PrayerTimesContent = ({ t, state, selectedLanguage, formattedDateTime, monthsInSetYear, hijriStartDates, selectCalculationMethod, selectAshrTime, selectConvention, selectIhtiyath, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, resetSettings, changeMonthType, selectMonth }) => (
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
    <div className="current-prayer-times flex flex-wrap">
      <CurrentPrayerTimes/>
      <PrayerTimesVisualization t={t}/>
      <PrayerTimesList
        t={t}
        selectedLanguage={selectedLanguage}
        formattedDateTime={formattedDateTime}
        monthsInSetYear={monthsInSetYear}
        hijriStartDates={hijriStartDates}
        monthType={state.monthType}
        selectedMonth={state.selectedMonth}
        changeMonthType={changeMonthType}
        selectMonth={selectMonth}
      />
      <QiblaDirection/>
    </div>
  </article>
)

export default PrayerTimesContent