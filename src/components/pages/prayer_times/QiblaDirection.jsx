import React from "react"

const QiblaDirection = ({ t, qiblaDirection }) => {
  let heading = null
  if (DeviceOrientationEvent) {
    addEventListener('deviceorientation', ({ alpha }) => heading = alpha)
  }
  return (
    <section className="flex-1 w-full md:w-1/2 p-2 md:px-4 2xl:px-8 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInRight">
      <h2 className="text-center text-green-900 dark:text-white duration-200 whitespace-nowrap">{t('qibla_direction')}</h2>
      <div className="qibla-container grid justify-center w-full p-4 overflow-hidden">
        <div className="compass relative w-full max-w-xs md:max-w-sm rounded-full duration-300 overflow-hidden" style={{ transform: `rotate(${heading === null ? 0 : heading}deg)` }}>
          <img className="w-full object-contain object-center dark:invert duration-200" src={`${import.meta.env.BASE_URL}images/compass-bg.png`} alt="Compass" />
          <div className="absolute origin-bottom top-0 h-1/2 w-full duration-500" style={{ transform: `rotate(${qiblaDirection}deg)` }}>
            <h4 className="font-serif text-base sm:text-lg md:text-xl text-center text-red-500 drop-shadow-md"><strong>{t('qibla')}</strong></h4>
            <img className="h-full w-full object-contain object-center drop-shadow-md" src={`${import.meta.env.BASE_URL}images/direction-icon.svg`} alt="Qibla Direction" />
          </div>
        </div>
      </div>
      <p className="text-base sm:text-lg md:text-xl text-center">{t('qibla_directions.0')}{qiblaDirection}°{t('qibla_directions.1')}</p>
    </section>
  )
}

export default QiblaDirection