import React from "react"

const PrayerTimesVisualization = ({ t }) => (
  <section className="w-full p-2 md:px-4 2xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
    <h2 className="text-center text-green-900 dark:text-white duration-200">{t('visualization')}</h2>
  </section>
)

export default PrayerTimesVisualization