import React from "react"
import LunarEclipseItem from "./LunarEclipseItem"

const LunarEclipses = ({ t, selectedLanguage, selectedTimeZone, areLunarEclipseListLoading, lunarEclipseList }) => (
  <section className="w-full mb-2 md:mb-4 xl:mb-8 md:w-1/2 p-2 md:px-4 xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInRight">
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('lunar_eclipse')}</h2>
    {areLunarEclipseListLoading
      ? (
        <div className="flex items-center justify-center w-full mx-auto space-x-2 overflow-hidden">
          <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
          <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('lunar_eclipses_loading')}</span>
        </div>
        )
      : (
        <div className="grid grid-flow-row w-full gap-2 md:gap-4 xl:gap-8">
          {
            lunarEclipseList?.map((item, index) => <LunarEclipseItem
              t={t}
              key={index}
              selectedLanguage={selectedLanguage}
              selectedTimeZone={selectedTimeZone}
              lunarEclipse={item}
            />)
          }
        </div>
        )
    }
  </section>
)

export default LunarEclipses