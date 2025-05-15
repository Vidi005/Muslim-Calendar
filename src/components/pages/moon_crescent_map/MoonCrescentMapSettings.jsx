import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"

const MoonCrescentMapSettings = ({ selectedHijriMonth, selectHijriMonth, areMoonVisibilityCriteriaMapsLoading, restoreToDefault }) => (
  <HomePageConsumer>
    {({ t, state, selectMoonVisibilityCriteria, selectCoordinateSteps }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('moon_crescent_map_config')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center justify-center">
            <label htmlFor="islamic_month">{t('islamic_month')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={selectedHijriMonth}
              value={selectedHijriMonth}
              onChange={event => selectHijriMonth(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {state.hijriStartDates?.map((item, monthIndex) => {
                if (item.gregorianDate.getFullYear() >= state.formattedDateTime.getFullYear()) {
                  return <option key={monthIndex} value={monthIndex}>{t(`islamic_months.${item.hijriDate.month - 1}`)} {parseInt(item.hijriDate.year)} {t('hijri_abbreviation')}</option>
                } else {
                  return null
                }
              })}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="moon-crescent-criteria">{t('hijri_date_criteria')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={1}
              value={state.selectedMoonVisibilityCriteria}
              onChange={event => selectMoonVisibilityCriteria(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {en.visibility_criteria.map((type, index) => <option key={type} value={index}>{t(`visibility_criteria.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="coordinate-steps">{t('sampling')}</label>
            <select
              className="mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={3}
              value={state.selectedCoordinateSteps}
              onChange={event => selectCoordinateSteps(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {en.coordinate_steps.map((type, index) => <option key={type} value={index + 1}>{t(`coordinate_steps.${index}`)}</option>)}
            </select>
            <label htmlFor="coordinate-steps">{t('degrees')}</label>
          </span>
          <button className="flex items-center ml-auto md:m-0 p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow" onClick={() => {
            selectCoordinateSteps(3)
            selectMoonVisibilityCriteria(1)
            restoreToDefault()
          }} disabled={areMoonVisibilityCriteriaMapsLoading}>
            <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Restore to Default" />
            <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_to_default')}</span>
          </button>
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default MoonCrescentMapSettings