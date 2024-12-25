import React from "react"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { pages } from "../../../utils/data"
import { Link } from "react-router-dom"

const MoonCrescentMapSection = () => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="moon-crescent-map-section flex flex-col items-center w-full md:w-1/2 px-3 md:px-5 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
        <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_crescent_map')}</h1>
        <h5 className="text-center text-green-700 dark:text-gray-200 duration-200">{t('islamic_month')} {t(`islamic_months.${state.formattedIslamicMonth - 1}`)} {parseInt(state.formattedIslamicYear)} {t('hijri_abbreviation')}, {t('moon_crescent_criteria')} {t(`visibility_criteria.${state.selectedMoonVisibilityCriteria}`)}</h5>
        <h5 className="mb-1 text-center text-green-700 dark:text-gray-200 duration-200">{t('conjunction')} {state.moonInfos[14]}</h5>
        {state.isMoonCrescentMapLoading
          ? (
            <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
              <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
              <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('moon_crescent_map_loading')}</span>
            </div>
          )
          : (
            <div className="relative w-full border sm:border-2 md:border-4 border-green-900 dark:border-white rounded overflow-hidden">
              {/* https://commons.wikimedia.org/wiki/File:Blue_Marble_2002.png */}
              <img className="w-full object-center" src={`${import.meta.env.BASE_URL}images/world-map-bg.png`} alt="World Map" />
              {state.moonCrescentVisibility.map((marker, index) => (
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
          )}
        <Link to={pages()[2].path} className="flex items-center justify-center border border-green-900 dark:border-green-500 bg-green-700 dark:bg-green-600 m-4 px-4 py-1.5 hover:bg-green-700/50 dark:hover:bg-green-500/25 text-white duration-200 rounded-lg shadow-md dark:shadow-white/50 overflow-hidden">
          <h4>{t('more')}</h4>
        </Link>
      </section>
    )}
  </HomePageConsumer>
)

export default MoonCrescentMapSection