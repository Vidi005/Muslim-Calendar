import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { prayerTimesCorrection } from "../../../utils/data"

const PrayerTimesSettings = ({ selectCalculationMethod, selectConvention, selectAshrTime, selectIhtiyath, selectCorrections, selectFormula, resetSettings }) => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('prayer_times_config')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center">
            <label htmlFor="calculation">{t('calculation')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedCalculationMethod}
              onChange={event => selectCalculationMethod(event.target.value)}
              required
            >
              {en.calculations.map((method, index) => <option key={method} value={index}>{t(`calculations.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="ashr-time">{t('ashr_time')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedAshrTime}
              onChange={event => selectAshrTime(event.target.value)}
              required
            >
              {en.mahzab.map((type, index) => <option key={type} value={index}>{t(`mahzab.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="convention">{t('convention')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedConvention}
              onChange={event => selectConvention(event.target.value)}
              required
            >
              {en.conventions.map((type, index) => <option key={type.method} value={index}>{t(`conventions.${index}.method`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="ihtiyath"><i>{t('ihtiyath')}</i></label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={1}
              value={state.selectedIhtiyath}
              onChange={event => selectIhtiyath(event.target.value)}
              required
            >
              {en.ihtiyath_times.map((type, index) => <option key={type} value={index}>{t(`ihtiyath_times.${index}`)}</option>)}
            </select>
          </span>
          {Math.abs(state.latitude) > 48 && (
            <span className="flex items-center">
              <label htmlFor="calculation_method">{t('calculation_method')}</label>
              <select
                className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                defaultValue={0}
                value={state.selectedFormula}
                onChange={event => selectFormula(event.target.value)} required>
                {en.formulas.map((type, index) => <option key={type} value={index}>{t(`formulas.${index}`)}</option>)}
              </select>
            </span>
          )}
          <button className="flex items-center ml-auto p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow" onClick={resetSettings}>
            <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
            <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_to_default')}</span>
          </button>
        </div>
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('time_correction')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          {en.prayer_names.map((name, index) => (
            (index !== 0 && index !== 2 && index !== 3) && (
              <span key={name} className="flex items-center">
                <label htmlFor="prayer-name">{t(`prayer_names.${index}`) + ' :'}</label>
                <select
                  className="mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                  defaultValue={0}
                  value={state.selectedCorrections[index]}
                  onChange={event => selectCorrections(index, event.target.value)}
                  required
                >
                  {prayerTimesCorrection().map(correction => <option key={correction} value={correction}>{correction}</option>)}
                </select>
                <span>{t('minutes')}</span>
              </span>
            )
          ))}
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default PrayerTimesSettings