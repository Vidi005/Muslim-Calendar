import React from "react"
import LunarEclipseItem from "./LunarEclipseItem"
import LunarEclipseMap from "./LunarEclipseMap"

const LunarEclipses = ({ t, selectedLanguage, selectedTimeZone, isUpcomingLunarEclipseMapLoading, areLunarEclipseListLoading, upcomingLunarEclipseMap, lunarEclipseList }) => (
  <section className="w-full mb-2 md:mb-4 xl:mb-8 p-2 md:px-4 xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('lunar_eclipse')}</h2>
    {areLunarEclipseListLoading
      ? (
        <div className="flex items-center justify-center w-full mx-auto space-x-2 overflow-hidden">
          <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
          <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('lunar_eclipses_loading')}</span>
        </div>
        )
      : (
        <React.Fragment>
          <h3 className="m-2 text-center text-green-800 dark:text-gray-50">
            {t('upcoming_lunar_eclipse_map')}
            {upcomingLunarEclipseMap?.beginTime
              ? ` (${upcomingLunarEclipseMap?.beginTime?.toLocaleDateString(selectedLanguage || 'en', { calendar: 'gregory', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: selectedTimeZone }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, "Jum'at")})`
              : ''}
          </h3>
          <LunarEclipseMap
            t={t}
            selectedLanguage={selectedLanguage}
            selectedTimeZone={selectedTimeZone}
            lunarEclipseData={lunarEclipseList?.[0]}
            isUpcomingLunarEclipseMapLoading={isUpcomingLunarEclipseMapLoading}
            upcomingLunarEclipseResult={upcomingLunarEclipseMap.result}
          />
          <h3 className="m-2 text-center text-green-800 dark:text-gray-50">{t('upcoming_lunar_eclipses')}</h3>
          <div className="grid grid-flow-row md:grid-cols-2 w-full gap-2 md:gap-4 xl:gap-8">
            {
              lunarEclipseList?.slice(1)?.map((item, index) => <LunarEclipseItem
                t={t}
                key={index}
                selectedLanguage={selectedLanguage}
                selectedTimeZone={selectedTimeZone}
                lunarEclipse={item}
              />)
            }
          </div>
        </React.Fragment>
        )
    }
  </section>
)

export default LunarEclipses