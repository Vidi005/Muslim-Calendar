import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { prayerTimesCorrection } from "../../../utils/data"

const PrayerTimesSettings = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('prayer_times_config')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center">
            <label htmlFor="ashr-time">{t('ashr_time')}</label>
            <select className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" defaultValue={0} required>
              {en.mahzab.map((type, index) => <option key={type} value={index}>{t(`mahzab.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="convention">{t('convention')}</label>
            <select className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" defaultValue={0} required>
              {en.conventions.map((type, index) => <option key={type} value={index}>{t(`conventions.${index}.method`)}</option>)}
            </select>
          </span>
          {Math.abs(state.latitude) > 48.5 && (
            <span className="flex items-center">
              <label htmlFor="calculation_method">{t('calculation_method')}</label>
              <select className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" defaultValue={0} required>
                {en.formulas.map((type, index) => <option key={type} value={index}>{t(`formulas.${index}`)}</option>)}
              </select>
            </span>
          )}
        </div>
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('time_correction')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          {en.prayer_names.map((name, index) => (
            <span key={name} className="flex items-center">
              <label htmlFor="prayer-name">{t(`prayer_names.${index}`) + ' :'}</label>
              <select className="mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" defaultValue={0} required>
                {prayerTimesCorrection().map(correction => <option key={correction} value={correction}>{correction}</option>)}
              </select>
              <span>{t('minutes')}</span>
            </span>
          ))}
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default PrayerTimesSettings