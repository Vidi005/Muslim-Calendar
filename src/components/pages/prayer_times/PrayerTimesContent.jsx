import React from "react"
import InputForm from "../InputForm"
import PrayerTimesSettings from "./PrayerTimesSettings"

const PrayerTimesContent = ({ selectCalculationMethod, selectAshrTime, selectConvention, selectIhtiyath, selectCorrections, selectFormula, resetSettings }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <PrayerTimesSettings
      selectCalculationMethod={selectCalculationMethod}
      selectAshrTime={selectAshrTime}
      selectConvention={selectConvention}
      selectIhtiyath={selectIhtiyath}
      selectCorrections={selectCorrections}
      selectFormula={selectFormula}
      resetSettings={resetSettings}
    />
  </article>
)

export default PrayerTimesContent