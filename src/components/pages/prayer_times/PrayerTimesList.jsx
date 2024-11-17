import { Radio, RadioGroup } from "@headlessui/react"
import React from "react"

const PrayerTimesList = ({ t, selectedLanguage, formattedDateTime, monthsInSetYear, hijriStartDates, monthType, selectedMonth, changeMonthType, selectMonth }) => (
  <section className="w-full p-2 animate__animated animate__fadeInUp">
    <h2 className="text-center text-green-900 dark:text-white duration-200">{t('imsakiyah_schedule')}</h2>
    <h5 className={"px-3 py-1 text-center text-green-700 dark:text-gray-200"}>{t("month_type")}</h5>
    <RadioGroup value={monthType} onChange={changeMonthType} className={"flex items-center justify-center space-x-1 md:space-x-2 mx-2 md:mx-3 py-1 md:py-2 text-sm md:text-base animate__animated animate__fadeInUp"}>
      <Radio value={0} className={({ active, checked }) => `${active ? 'ring-2 ring-green-300 rounded-lg' : ''} ${checked ? 'border border-green-700 dark:border-green-500 text-white rounded-lg' : 'border bg-green-200/50 dark:bg-gray-700 rounded-lg'} border-green-700 dark:border-green-500 text-green-900 dark:text-white shadow-md dark:shadow-white/50 cursor-pointer duration-200`}>
        {({ checked }) => (
          checked ? (
            <div className="flex items-center flex-nowrap bg-green-700 dark:bg-green-500 p-2 cursor-pointer rounded-lg duration-300">
              <input
                type="radio"
                className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                checked
              />
              <label className="cursor-pointer">{t("month_types.0")}</label>
            </div>
          ) : (
            <div className="flex items-center flex-nowrap p-2 cursor-pointer rounded-lg duration-300">
              <input
                type="radio"
                className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                checked={false}
              />
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
                checked
              />
              <label className="cursor-pointer">{t("month_types.1")}</label>
            </div>
          ) : (
            <div className="flex items-center flex-nowrap p-2 cursor-pointer rounded-lg duration-300">
              <input
                type="radio"
                className="accent-green-700 dark:accent-green-500 h-5 w-5 mr-2 cursor-pointer duration-300"
                checked={false}
              />
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
            defaultValue={formattedDateTime.getMonth()}
            value={selectedMonth}
            onChange={event => selectMonth(event.target.value)}
            required
          >
            {monthsInSetYear?.map((_, monthIndex) => <option key={monthIndex} value={monthIndex}>{new Date(formattedDateTime.getFullYear(), monthIndex, 1).toLocaleString(selectedLanguage || 'en', {month: 'long' })}</option>)}
          </select>
        </span>
        )
      : (
        <span className="flex items-center justify-center m-2">
          <label className="text-green-900 dark:text-white duration-200">{t('select_month')}</label>
          <select
            className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
            defaultValue={formattedDateTime.getMonth()}
            value={selectedMonth}
            onChange={event => selectMonth(event.target.value)}
            required
          >
            {hijriStartDates?.map((item, monthIndex) => <option key={monthIndex} value={item.hijriDate.month}>{t(`islamic_months.${item.hijriDate.month - 1}`)} {item.hijriDate.year}</option>)}
          </select>
        </span>
        )
    }
  </section>
)

export default PrayerTimesList