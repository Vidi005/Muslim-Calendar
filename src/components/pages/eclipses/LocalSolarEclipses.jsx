import React from "react"
import LocalSolarEclipseItem from "./LocalSolarEclipseItem"

const LocalSolarEclipses = ({ t, selectedLanguage, selectedTimeZone, areLocalSolarEclipseListLoading, localSolarEclipseList }) => (
  <section className="w-full p-2 md:px-4 xl:px-8 animate__animated animate__fadeInUp">
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('local_solar_eclipse')}</h2>
    {areLocalSolarEclipseListLoading
      ? (
        <div className="flex items-center justify-center w-full mx-auto space-x-2 overflow-hidden">
          <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
          <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('local_solar_eclipses_loading')}</span>
        </div>
        )
      : (
        <div className="grid grid-flow-row md:grid-cols-2 w-full gap-2 md:gap-4 xl:gap-8">
          {
            localSolarEclipseList?.map((item, index) => <LocalSolarEclipseItem
              t={t}
              key={index}
              selectedLanguage={selectedLanguage}
              selectedTimeZone={selectedTimeZone}
              localSolarEclipse={item}
            />)
          }
        </div>
        )
    }
  </section>
)

export default LocalSolarEclipses