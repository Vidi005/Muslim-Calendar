import React from "react"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { coordinateScale, pages } from "../../../utils/data"
import { Link } from "react-router-dom"
import en from "../../../locales/en.json"

const MoonCrescentMapSection = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="moon-crescent-map-section flex flex-col items-center w-full md:w-1/2 px-3 md:px-5 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
        <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_crescent_map')}</h1>
        {state.isMoonCrescentMapLoading
          ? (
            <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
              <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
              <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('moon_crescent_map_loading')}</span>
            </div>
          )
          : (
            <React.Fragment>
              <h5 className="text-center text-green-700 dark:text-gray-200 duration-200">{t('islamic_month')} {t(`islamic_months.${state.formattedIslamicMonth - 1}`)} {parseInt(state.formattedIslamicYear)} {t('hijri_abbreviation')}, {t('hijri_date_criteria')} {t(`moon_visibility_criteria.${state.selectedMoonVisibilityCriteria}.name`)}</h5>
              <h5 className="mb-1 text-center text-green-700 dark:text-gray-200 duration-200"><i>{t('conjunction')}</i>: {state.moonCrescentVisibility.conjunction?.toLocaleString(state.selectedLanguage || "en", { day: "2-digit", month: "2-digit", year: "numeric", hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "short", timeZone: state.selectedTimeZone }).replace(/\./g, ':')}</h5>
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
                {state.moonCrescentVisibility.zoneCoordinates?.map((marker, index) => (
                  <span key={index} className="absolute opacity-50" style={{
                    width: `${marker.width}%`,
                    height: `${marker.height}%`,
                    backgroundColor: marker.color,
                    top: `${marker.yPos}%`,
                    left: `${marker.xPos}%`,
                    transform: "translate(-50%, -50%)"
                  }}></span>
                ))}
              </div>
              <div className={`grid w-full p-1 md:p-1.5 gap-1 md:gap-2 items-stretch ${en.moon_visibility_criteria[state.selectedMoonVisibilityCriteria].zones.length > 2 ? "grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" : "grid-cols-2"}`}>
                {en.moon_visibility_criteria[state.selectedMoonVisibilityCriteria].zones.map((zone, index) => (
                  <div key={index} className="flex flex-nowrap items-baseline space-x-1 md:space-x-1.5 text-xs 2xl:text-sm">
                    <span className="flex-none border border-black dark:border-white w-2 h-2 md:w-3 md:h-3" style={{ backgroundColor: zone.color }}></span>
                    <span className="text-black dark:text-white">{t(`moon_visibility_criteria.${state.selectedMoonVisibilityCriteria}.zones.${index}.visibility`)}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        <Link to={pages()[2].path} className="flex items-center justify-center border border-green-900 dark:border-green-500 bg-green-700 dark:bg-green-600 m-4 px-4 py-1.5 hover:bg-green-700/50 dark:hover:bg-green-500/25 text-white duration-200 rounded-lg shadow-md dark:shadow-white/50 overflow-hidden">
          <h4>{t('more')}</h4>
        </Link>
      </section>
    )}
  </HomePageConsumer>
)

export default MoonCrescentMapSection