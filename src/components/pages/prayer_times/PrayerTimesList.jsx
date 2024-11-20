import { Radio, RadioGroup } from "@headlessui/react"
import React from "react"
import en from "../../../locales/en.json"

const PrayerTimesList = ({ t, selectedLanguage, formattedDateTime, monthsInSetYear, hijriStartDates, monthType, selectedGregorianMonth, selectedHijriMonth, prayerTimesList, arePrayerTimesListLoading, changeMonthType, selectGregorianMonth, selectHijriMonth }) => {
  const isRamadanSelected = hijriStartDates?.findIndex(item => item.dateId === '1-9-date') === selectedHijriMonth
  const prayerTimeHeaders = monthType === 0 ? en.prayer_times_headers.map((_, i) => t(`prayer_times_headers.${i}`)).slice(5) : en.prayer_times_headers.map((_, i) => t(`prayer_times_headers.${i}`)).slice(4)
  const prayerNames = monthType === 1 && isRamadanSelected
    ? en.prayer_names.map((_, i) => t(`prayer_names.${i}`))
    : en.prayer_names.map((_, i) => t(`prayer_names.${i}`)).slice(1)
  return (
    <section className="w-full p-2 animate__animated animate__fadeInUp">
      <h2 className="text-center text-green-900 dark:text-white duration-200">{isRamadanSelected ? t('imsakiyah_schedule') : t('prayer_schedule')}</h2>
      <h5 className={"px-3 py-1 text-center text-green-700 dark:text-gray-200"}>{t("month_type")}</h5>
      <RadioGroup value={monthType} onChange={changeMonthType} className={"flex items-center justify-center space-x-1 md:space-x-2 mx-2 md:mx-3 py-1 md:py-2 text-sm md:text-base animate__animated animate__fadeInUp"}>
        <Radio value={0} className={({ active, checked }) => `${active ? 'ring-2 ring-green-300 rounded-lg' : ''} ${checked ? 'border border-green-700 dark:border-green-500 text-white rounded-lg' : 'border bg-green-200/50 dark:bg-gray-700 rounded-lg'} border-green-700 dark:border-green-500 text-green-900 dark:text-white shadow-md dark:shadow-white/50 cursor-pointer duration-200`}>
          {({ checked }) => (
            checked ? (
              <div className="flex items-center flex-nowrap bg-green-700 dark:bg-green-500 p-2 cursor-pointer rounded-lg duration-300">
                <input
                  type="radio"
                  className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                  checked />
                <label className="cursor-pointer">{t("month_types.0")}</label>
              </div>
            ) : (
              <div className="flex items-center flex-nowrap p-2 cursor-pointer rounded-lg duration-300">
                <input
                  type="radio"
                  className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                  checked={false} />
                <label className="cursor-pointer">{t("month_types.0")}</label>
              </div>
            )
          )}
        </Radio>
        <Radio value={1} className={({ active, checked }) => `${active ? 'ring-2 ring-green-300 rounded-lg' : ''} ${checked ? 'border border-green-700 dark:border-green-500 text-white rounded-lg' : 'border bg-green-200/50 dark:bg-gray-700 rounded-lg'} border-green-700 dark:border-green-500 text-green-900 dark:text-white shadow-md dark:shadow-white/50 cursor-pointer duration-200`}>
          {({ checked }) => (
            checked ? (
              <div className="flex items-center flex-nowrap bg-green-700 dark:bg-green-500 p-2 cursor-pointer rounded-lg duration-300">
                <input
                  type="radio"
                  className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                  checked />
                <label className="cursor-pointer">{t("month_types.1")}</label>
              </div>
            ) : (
              <div className="flex items-center flex-nowrap p-2 cursor-pointer rounded-lg duration-300">
                <input
                  type="radio"
                  className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                  checked={false} />
                <label className="cursor-pointer">{t("month_types.1")}</label>
              </div>
            )
          )}
        </Radio>
      </RadioGroup>
      {monthType === 0
        ? (
          <span className="flex items-center justify-center m-2">
            <label className="text-green-900 dark:text-white duration-200">{t('select_month')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={selectedGregorianMonth}
              value={selectedGregorianMonth}
              onChange={event => selectGregorianMonth(event.target.value)}
              required
            >
              {monthsInSetYear?.map((_, monthIndex) => <option key={monthIndex} value={monthIndex}>{new Date(formattedDateTime.getFullYear(), monthIndex, 1).toLocaleString(selectedLanguage || 'en', { month: 'long' })}</option>)}
            </select>
          </span>
          )
        : (
          <span className="flex items-center justify-center m-2">
            <label className="text-green-900 dark:text-white duration-200">{t('select_month')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={selectedHijriMonth}
              value={selectedHijriMonth}
              onChange={event => selectHijriMonth(event.target.value)}
              required
            >
              {hijriStartDates?.map((item, monthIndex) => {
                if (item.gregorianDate.getFullYear() <= formattedDateTime.getFullYear()) {
                  return <option key={monthIndex} value={monthIndex}>{t(`islamic_months.${item.hijriDate.month - 1}`)} {parseInt(item.hijriDate.year)} {t('hijri_abbreviation')}</option>
                } else {
                  return null
                }
              })}
            </select>
          </span>
        )}
        <div className="flex items-center w-full md:px-2 2xl:px-6 overflow-x-auto">
          {arePrayerTimesListLoading
            ? (
              <div className="flex items-center justify-center w-full mx-auto space-x-2 overflow-hidden">
                <span className="w-4 h-4 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
                <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('prayer_times_loading')}</span>
              </div>
              )
            : (
              <table className="table-auto min-w-full align-middle text-sm md:lg lg:text-lg whitespace-nowrap">
                {monthType === 0
                  ? <>
                      <tr>
                        {[...prayerTimeHeaders, ...prayerNames].map(header => (
                          <th key={header} className="border-2 border-green-900 dark:border-white bg-green-700/20 dark:bg-gray-200/25 p-1.5 text-green-900 dark:text-white font-bold duration-200">{header}</th>
                        ))}
                      </tr>
                      {prayerTimesList.map((prayerTimes, i) => (
                        <tr key={prayerTimes} className={`${i % 2 !== 0 ? "bg-sky-900/20 dark:bg-sky-700/50" : ""} text-green-900 dark:text-white duration-200`}>
                          {prayerTimes.map((prayerTime, j) => (
                            <td key={i + j} className="border border-green-700 dark:border-gray-200 p-1.5 text-center">
                            {prayerTime}
                          </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  : <>
                      <tr>
                        {[...prayerTimeHeaders, ...prayerNames].map((header, i) => (
                          <th key={i} className={`${(i === 2 || i === 8) && isRamadanSelected ? "bg-green-500/20 dark:bg-green-600" : ""} border-2 border-green-900 dark:border-white bg-green-700/20 dark:bg-gray-200/25 p-1.5 text-green-900 dark:text-white font-bold duration-200`}>{header}</th>
                        ))}
                      </tr>
                      {prayerTimesList.map((prayerTimes, i) => (
                        <tr key={prayerTimes} className={`${i % 2 !== 0 ? "bg-sky-900/20 dark:bg-sky-700/50" : ""} text-green-900 dark:text-white duration-200`}>
                          {prayerTimes.map((prayerTime, j) => (
                            <td key={i + j} className={`${(j === 2 || j === 8) && isRamadanSelected ? "bg-green-500/20 dark:bg-green-600 font-bold duration-200" : ""} border border-green-700 dark:border-gray-200 p-1.5 text-center`}>
                            {prayerTime}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                }
              </table>
            )}
        </div>
    </section>
  )
}

export default PrayerTimesList