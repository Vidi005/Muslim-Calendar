import React from "react"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import en from "../../../locales/en.json"
import { Link } from "react-router-dom"
import { pages } from "../../../utils/data"

const PrayerTimesSection = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="prayer-times-section flex flex-col items-center w-full md:w-1/2 px-3 md:px-5 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
        <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('prayer_times')}</h1>
        {state.inputDate !== '' && state.inputTime !=='' && state.formattedDateTime instanceof Date
          ? <h5 className="text-center text-green-700 dark:text-gray-200 duration-200">{t('set_prayer_times')} {state.formattedDateTime.toLocaleDateString(state.selectedLanguage || 'en', { weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}</h5>
          : null
        }
        <h5 className="mb-1 text-center text-green-700 dark:text-gray-200 duration-200">{t('convention')} {t(`conventions.${state.selectedConvention}.method`)}, {t('ashr_time')} {t(`mahzab.${state.selectedAshrTime}`)}</h5>
        {state.arePrayerTimesLoading
          ? (
            <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
              <span className="w-6 h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
              <span className="text-green-700 dark:text-gray-200 text-lg md:text-xl">{t('prayer_times_loading')}</span>
            </div>
            )
          : (
            <table className="table-auto w-full align-middle text-base md:lg lg:text-xl whitespace-nowrap">
              <tr>
                {en.prayer_times_headers.slice(0, 4).map((_, i) => (
                  <th key={i} className={`${i === 2 ? "bg-green-500/20 dark:bg-green-500" : ""} border-2 border-green-900 dark:border-white p-2 text-green-900 dark:text-white font-bold duration-200`}>{t(`prayer_times_headers.${i}`)}</th>
                ))}
              </tr>
              {en.prayer_names.map((_, i) => (
                <tr key={i}>
                  <td className="border border-green-900 dark:border-white p-2 text-green-900 dark:text-white font-bold">{t(`prayer_names.${i}`)}</td>
                  {state.prayerTimes.map((prayerTime, j) => (
                    <td key={i + j} className={`${j === 1 ? "bg-green-500/20 dark:bg-green-500 font-bold duration-200" : ""} border border-green-700 dark:border-gray-200 text-center`}>
                      {prayerTime[i]?.toLocaleTimeString('en-GB', { hour12: false })}
                    </td>
                  ))}
                </tr>
              ))}
            </table>
            )
        }
        <Link to={pages()[1].path} className="flex items-center justify-center border border-green-900 dark:border-green-500 bg-green-700 dark:bg-green-500 m-4 px-4 py-1.5 hover:bg-green-700/50 dark:hover:bg-green-500/25 text-white duration-200 rounded-lg shadow-md dark:shadow-white/50 overflow-hidden">
          <h4>{t('more')}</h4>
        </Link>
      </section>
    )}
  </HomePageConsumer>
)

export default PrayerTimesSection