import React from "react"

const PrayerTimesVisualization = ({ t }) => (
  <section className="flex-1 w-full md:w-1/2 p-2 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
    <h2 className="text-center text-green-900 dark:text-white duration-200">{t('visualization')}</h2>
  </section>
)

export default PrayerTimesVisualization