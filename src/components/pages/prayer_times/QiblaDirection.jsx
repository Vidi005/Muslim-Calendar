import React from "react"

const QiblaDirection = ({ t, heading, qiblaDirection }) => (
  <section className="flex-1 w-full md:w-1/2 p-2 md:px-4 2xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInRight">
    <h2 className="text-center text-green-900 dark:text-white duration-200">{t('qibla_direction')}</h2>
    <div className="qibla-container grid justify-center w-full p-4">
      <div className="compass relative w-full max-w-xs md:max-w-sm rounded-full overflow-hidden duration-500" style={{ transform: `rotate(${heading === null ? 0 : heading}deg)` }}>
        <img className="w-full object-contain object-center dark:invert" src={`${import.meta.env.BASE_URL}images/compass-bg.png`} alt="Compass" />
        <img className="absolute origin-bottom top-0 h-1/2 w-full object-contain object-center duration-500" style={{ transform: `rotate(${qiblaDirection}deg)` }} src={`${import.meta.env.BASE_URL}images/direction-icon.svg`} alt="Direction" />
      </div>
    </div>
    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center">{t('qibla_directions.0')}{qiblaDirection}°{t('qibla_directions.1')}</p>
  </section>
)

export default QiblaDirection