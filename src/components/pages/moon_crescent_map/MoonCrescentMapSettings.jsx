import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"

const MoonCrescentMapSettings = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('moon_crescent_map_config')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center">
            <label htmlFor="islamic-month">{t('islamic_month')}</label>
            <select className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" required>
              {en.islamic_months.map((type, index) => <option key={type} value={index}>{t(`islamic_months.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="islamic-year">{t('islamic_year')}</label>
            <input
              type="number"
              className="input-year w-fit mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              required
              />
              <span>{t('hijri_abbreviation')}</span>
          </span>
          <span className="flex items-center">
            <label htmlFor="moon-crescent-criteria">{t('moon_crescent_criteria')}</label>
            <select className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200" defaultValue={1} required>
              {en.visibility_criteria.map((type, index) => <option key={type} value={index}>{t(`visibility_criteria.${index}`)}</option>)}
            </select>
          </span>
          <button className="flex items-center p-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-md duration-200 shadow">
            <span className="ml-1 text-white text-sm whitespace-nowrap">{t('create_map')}</span>
          </button>
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default MoonCrescentMapSettings