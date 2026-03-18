import React from "react"
import GlobalSolarEclipseItem from "./GlobalSolarEclipseItem"
import { coordinateScale } from "../../../utils/data"
import en from "../../../locales/en.json"

const GlobalSolarEclipseMap = ({ t, selectedLanguage, selectedTimeZone, globalSolarEclipseData, isUpcomingSolarEclipseMapLoading, upcomingSolarEclipseResult }) => (
  <div className="upcoming-solar-eclipse-container flex flex-wrap md:flex-nowrap items-center md:items-start w-full md:space-x-4 xl:space-x-8 animate__animated animate__fadeInUp">
    {isUpcomingSolarEclipseMapLoading
      ? (
        <div className="flex basis-full md:basis-2/3 items-center justify-center space-x-2 p-2 md:p-4">
          <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
          <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('upcoming_solar_eclipse_map_loading')}</span>
        </div>
      )
      : (
        <div className="flex flex-col basis-full md:basis-2/3 items-center justify-center space-x-2 animate__animated animate__fadeInLeft">
          <div className="relative w-full border sm:border-2 md:border-4 border-green-900 dark:border-white rounded duration-200 overflow-hidden">
            <img className="w-full object-center" src={`${import.meta.env.BASE_URL}images/world-map-bg.png`} alt="World Map" />
            {coordinateScale.latitudes.map((degree, index) => (
              <React.Fragment key={`lat-${index}`}>
                <span className="absolute w-full opacity-50 border border-dashed border-green-700" style={{ top: `${((90 - degree) / 90) * 50}%` }}></span>
                <span className="absolute w-full px-1 text-xs text-green-700" style={{ top: `${((90 - degree) / 90) * 50}%` }}>{degree}°</span>
              </React.Fragment>
            ))}
            {coordinateScale.longitudes.map((degree, index) => (
              <React.Fragment key={`lon-${index}`}>
                <span className="absolute h-full opacity-50 border border-dashed border-green-700" style={{ top: 0, left: `${((180 - degree) / 180) * 50}%` }}></span>
                <span className="absolute h-full px-1 text-xs text-green-700" style={{ top: 0, right: `${((180 - degree) / 180) * 50}%` }}>{degree}°</span>
              </React.Fragment>
            ))}
            {upcomingSolarEclipseResult?.map((marker, index) => (
              <span key={index} className="absolute opacity-50 -translate-y-1/2" style={{
                width: `${marker.width}%`,
                height: `${marker.height}%`,
                backgroundColor: marker.color,
                top: `${marker.yPos}%`,
                left: `${marker.xPos}%`
              }}></span>
            ))}
          </div>
          <div className={`grid w-full p-1 md:p-2 gap-1 md:gap-2 items-stretch ${en.eclipse_types[0]?.kinds?.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
            {en.eclipse_types[0]?.kinds?.map((kind, index) => (
              <div key={index} className="flex flex-nowrap items-baseline space-x-1 md:space-x-1.5 text-xs md:text-sm xl:text-base">
                <span className="flex-none border border-black dark:border-white w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4" style={{ backgroundColor: kind.color }}></span>
                <span className="text-black dark:text-white">{t(`eclipse_types.0.kinds.${index}.name`)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    <div className="flex basis-full md:basis-1/3 items-center justify-center space-x-2 animate__animated animate__fadeInRight">
      <GlobalSolarEclipseItem
        t={t}
        selectedLanguage={selectedLanguage}
        selectedTimeZone={selectedTimeZone}
        globalSolarEclipse={globalSolarEclipseData} />
    </div>
  </div>
)

export default GlobalSolarEclipseMap