import React from "react"
import GlobalSolarEclipseItem from "./GlobalSolarEclipseItem"
import GlobalSolarEclipseMap from "./GlobalSolarEclipseMap"

const GlobalSolarEclipses = ({ t, selectedLanguage, selectedTimeZone, isUpcomingSolarEclipseMapLoading, upcomingSolarEclipseMap, areGlobalSolarEclipseListLoading, globalSolarEclipseList }) => (
  <section className="w-full p-2 md:px-4 xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('global_solar_eclipse')}</h2>
    {areGlobalSolarEclipseListLoading
      ? (
        <div className="flex items-center justify-center w-full mx-auto space-x-2 overflow-hidden">
          <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
          <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('global_solar_eclipses_loading')}</span>
        </div>
        )
      : (
        <React.Fragment>
          <h3 className="m-2 text-center text-green-800 dark:text-gray-50">
            {t('upcoming_global_solar_eclipse_map')}
            {upcomingSolarEclipseMap?.peakTime
              ? ` (${upcomingSolarEclipseMap?.peakTime?.toLocaleDateString(selectedLanguage || 'en', { calendar: 'gregory', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: selectedTimeZone }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, "Jum'at")})`
              : ''}
          </h3>
          <GlobalSolarEclipseMap
            t={t}
            selectedLanguage={selectedLanguage}
            selectedTimeZone={selectedTimeZone}
            globalSolarEclipseData={globalSolarEclipseList?.[0]}
            isUpcomingSolarEclipseMapLoading={isUpcomingSolarEclipseMapLoading}
            upcomingSolarEclipseResult={upcomingSolarEclipseMap.result}
          />
          <h3 className="m-2 text-center text-green-800 dark:text-gray-50">{t('upcoming_global_solar_eclipses')}</h3>
          <div className="grid grid-flow-row md:grid-cols-2 w-full gap-2 md:gap-4 xl:gap-8">
            {
              globalSolarEclipseList?.slice(1)?.map((item, index) => <GlobalSolarEclipseItem
                t={t}
                key={index}
                selectedLanguage={selectedLanguage}
                selectedTimeZone={selectedTimeZone}
                globalSolarEclipse={item}
              />)
            }
          </div>
        </React.Fragment>
        )
    }
  </section>
)

export default GlobalSolarEclipses