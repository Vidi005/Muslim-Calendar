import React from "react"

const GlobalSolarEclipses = ({ t }) => (
  <section className="flex-1 w-full md:w-1/2 p-2 md:px-4 2xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInLeft">
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('global_solar_eclipse')}</h2>
  </section>
)

export default GlobalSolarEclipses