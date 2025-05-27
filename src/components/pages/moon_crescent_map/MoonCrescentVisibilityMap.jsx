import React from "react"
import { coordinateScale } from "../../../utils/data"
import en from "../../../locales/en.json"

const MoonCrescentVisibilityMap = ({ t, selectedLanguage, selectedMoonVisibilityCriteria, observationDate, visibility }) => (
  <div className="moon-crescent-map flex flex-col items-center w-full px-3 md:px-5 xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
    <h4 className="m-1 md:m-2 text-sm sm:text-base md:text-lg text-center text-green-700 dark:text-gray-200 duration-200">{(t('observation_date'))} {observationDate.toLocaleDateString(selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at')} {t(`moon_visibility_criteria.${selectedMoonVisibilityCriteria}.observation_time`)}</h4>
    <div className="relative w-full border sm:border-2 md:border-4 border-green-900 dark:border-white rounded duration-200 overflow-hidden">
      <img className="w-full object-center" src={`${import.meta.env.BASE_URL}images/world-map-bg.png`} alt="World Map" />
      <span className="absolute w-full h-1/6 top-0 inset-x-0 backdrop-blur-sm bg-black/5"></span>
      <span className="absolute w-full h-1/6 bottom-0 inset-x-0 backdrop-blur-sm bg-black/5"></span>
      {coordinateScale.latitudes.map((degree, index) => (
        <>
          <span key={index} className="absolute w-full opacity-50 border border-dashed border-green-700" style={{ top: `${((90 - degree) / 90) * 50}%` }}></span>
          <span key={degree} className="absolute w-full px-1 text-xs text-green-700" style={{ top: `${((90 - degree) / 90) * 50}%` }}>{degree}°</span>
        </>
      ))}
      {coordinateScale.longitudes.map((degree, index) => (
        <>
          <span key={index} className="absolute h-full opacity-50 border border-dashed border-green-700" style={{ top: 0, left: `${((180 - degree) / 180) * 50}%` }}></span>
          <span key={degree} className="absolute h-full px-1 text-xs text-green-700" style={{ top: 0, right: `${((180 - degree) / 180) * 50}%` }}>{degree}°</span>
        </>
      ))}
      {visibility.map((marker, index) => (
        <span key={index} className="absolute opacity-50 -translate-y-1/2" style={{
          width: `${marker.width}%`,
          height: `${marker.height}%`,
          backgroundColor: marker.color,
          top: `${marker.yPos}%`,
          left: `${marker.xPos}%`
        }}></span>
      ))}
    </div>
    <div className={`grid w-full p-1 md:p-2 gap-1 md:gap-2 items-stretch ${en.moon_visibility_criteria[selectedMoonVisibilityCriteria]?.zones?.length > 2 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5" : "grid-cols-2"}`}>
      {en.moon_visibility_criteria[selectedMoonVisibilityCriteria]?.zones?.map((zone, index) => (
        <div key={index} className="flex flex-nowrap items-baseline space-x-1 md:space-x-1.5 text-xs md:text-sm xl:text-base">
          <span className="flex-none border border-black dark:border-white w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4" style={{ backgroundColor: zone.color }}></span>
          <span className="text-black dark:text-white">{t(`moon_visibility_criteria.${selectedMoonVisibilityCriteria}.zones.${index}.visibility`)}</span>
        </div>
      ))}
    </div>
  </div>
)

export default MoonCrescentVisibilityMap