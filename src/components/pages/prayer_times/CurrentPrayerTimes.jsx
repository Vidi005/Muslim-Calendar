import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"

const CurrentPrayerTimes = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="flex-1 flex flex-col items-center w-full md:w-1/2 px-3 md:px-5 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
        <h2 className="m-2 text-center text-green-900 dark:text-white duration-200">{t('prayer_times')}</h2>
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
            <table className="table-auto w-full align-middle text-sm md:lg lg:text-lg whitespace-nowrap">
              <tr>
                {en.prayer_times_headers.slice(0, 4).map((_, i) => (
                  <th key={i} className={`${i === 2 ? "bg-green-500/20 dark:bg-green-500" : ""} border-2 border-green-900 dark:border-white p-1.5 text-green-900 dark:text-white font-bold duration-200`}>{t(`prayer_times_headers.${i}`)}</th>
                ))}
              </tr>
              {en.prayer_names.map((_, i) => (
                <tr key={i}>
                  <td className="border border-green-900 dark:border-white p-1.5 text-green-900 dark:text-white font-bold">{t(`prayer_names.${i}`)}</td>
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
      </section>
    )}
  </HomePageConsumer>
)

export default CurrentPrayerTimes