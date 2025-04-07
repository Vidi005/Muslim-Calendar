import React from "react"
import en from "../../../locales/en.json"

const PrayerTimesVisualization = ({ t, selectedLanguage, inputDate, inputTime, formattedDateTime, timeZone, isPreciseToSeconds, seletedDhuhaMethod, dhuhaSunAltitude, sunAltitude, currentPrayerTimes, areSunInfosLoading, sunInfos }) => {
  const sunAzimuthPosition = parseFloat(sunInfos[3]) <= 180
    ? (parseFloat(sunInfos[3]) / 180) * 100
    : ((parseFloat(sunInfos[3]) - 180) / 180) * 100
  const [ySunPosition, xSunPosition] = [((parseFloat(sunInfos[2]) + 90) / 180) * 100, sunAzimuthPosition]
  const fajrPosition = ((90 - sunAltitude.fajr) / 90) * 50
  const dhuhaPosition = seletedDhuhaMethod === 1 ? 0 :((90 - dhuhaSunAltitude) / 90) * 50
  const duhrPosition = ((90 - parseFloat(sunInfos[sunInfos.length - 4])) / 90) * 50
  const ashrPosition = ((90 - parseFloat(sunInfos[sunInfos.length - 3])) / 90) * 50
  const ishaPosition = isNaN(sunAltitude.isha) ? 0 :((90 - sunAltitude.isha) / 90) * 50
  const midnightPosition = ((90 - parseFloat(sunInfos[sunInfos.length - 2])) / 90) * 50
  const isWaxing = parseFloat(sunInfos[10]) <= 180
  const isCrescent = parseFloat(sunInfos[16]) <= 50
  const moonAzimuthPosition = parseFloat(sunInfos[3]) <= 180
    ? (parseFloat(sunInfos[12]) / 180) * 100
    : ((parseFloat(sunInfos[12]) - 180) / 180) * 100
  const [yMoonPosition, xMoonPosition] = [((parseFloat(sunInfos[11]) + 90) / 180) * 100, moonAzimuthPosition]
  const ellipse1 = isCrescent
    ? `ellipse(${50 - parseFloat(sunInfos[sunInfos.length - 7])}% 50% at 0% 50%)`
    : `ellipse(0% 50% at 0% 50%)`
  const ellipse2 = !isCrescent
    ? `ellipse(${parseFloat(sunInfos[sunInfos.length - 7]) - 50}% 50% at 100% 50%)`
    : `ellipse(0% 50% at 100% 50%)`
  return (
    <section className="w-full p-2 md:p-4 2xl:p-8 text-center text-green-900 dark:text-white duration-200 animate__animated animate__fadeInUp">
      <h2>{t('visualization')}</h2>
      <div className="flex flex-wrap justify-center w-full">
        <div className="w-full md:w-1/2">
        <p className="text-sm md:text-base xl:text-lg">{t('zenith')} (+90°)</p>
          <div className="relative flex-auto flex flex-col items-center justify-center border border-green-900 dark:border-white w-full h-max text-xs lg:text-sm 2xl:text-base duration-300 overflow-hidden">
            <img className="w-full object-center" src={`${import.meta.env.BASE_URL}images/rectangle-bg.png`} alt="Visualization Container" />
            <span className="absolute w-[1.25%] border border-yellow-500 bg-yellow-400 rounded-full -translate-x-1/2 translate-y-1/2 duration-300" style={{ bottom: `${ySunPosition}%`, left: `${xSunPosition}%` }}>
              <img className="w-full object-contain object-center" src={`${import.meta.env.BASE_URL}images/circle-icon.png`} alt="Sun" />
            </span>
            <span className={`${parseFloat(sunInfos[3]) > 90 && parseFloat(sunInfos[3]) <= 180 || (parseFloat(sunInfos[3]) > 270 && parseFloat(sunInfos[3]) <= 360) ? "-translate-x-full" : "translate-x-1/4"} absolute translate-y-1/2 -ml-4 text-xs md:text-sm xl:text-base text-center text-yellow-600 dark:text-yellow-300 whitespace-nowrap duration-300`} style={{ bottom: `${ySunPosition}%`, left: `${xSunPosition}%` }}>{t('objects.0')} ({parseFloat(sunInfos[3])}°, {parseFloat(sunInfos[2])}°)</span>
            <div className="moon absolute w-[1.25%] -translate-x-1/2 translate-y-1/2 duration-300" style={{ bottom: `${yMoonPosition}%`, left: `${xMoonPosition}%` }}>
              <div className="relative w-full rounded-full overflow-hidden duration-500" style={{ transform: `rotate(${parseFloat(sunInfos[sunInfos.length - 1])}deg)` }}>
                <img className="w-full object-contain object-center" src={`${import.meta.env.BASE_URL}images/moon.png`} alt="Moon" />
                <div className={`${isWaxing ? "rotate-0" : "rotate-180"} absolute inset-0`}>
                  <span className="absolute top-0 left-0 w-1/2 h-full border-none border-transparent border-spacing-0 bg-black/50"></span>
                  <span
                    className="absolute inset-0 translate-x-1/2 bg-black/50 border-none border-transparent border-spacing-0 duration-500"
                    style={{ clipPath: ellipse1 }}
                  ></span>
                  <span
                    className="absolute inset-0 -translate-x-1/2 border-none border-transparent border-spacing-0 duration-500"
                    style={{ clipPath: ellipse2 }}
                  >
                    <img
                      className={`${isWaxing ? "rotate-0" : "rotate-180"} border-none border-transparent border-spacing-0 w-full translate-x-1/2 object-contain object-center brightness-125`}
                      src={`${import.meta.env.BASE_URL}images/moon.png`}
                      alt="Half Phase"
                    />
                  </span>
                </div>
              </div>
            </div>
            <span className={`${parseFloat(sunInfos[12]) > 90 && parseFloat(sunInfos[12]) <= 180 || (parseFloat(sunInfos[12]) > 270 && parseFloat(sunInfos[12]) <= 360) ? "-translate-x-full" : "translate-x-1/4"} absolute translate-y-1/2 -ml-4 text-xs md:text-sm xl:text-base text-center text-amber-500 dark:text-amber-200 whitespace-nowrap duration-300`} style={{ bottom: `${yMoonPosition}%`, left: `${xMoonPosition}%` }}>{t('objects.1')} ({parseFloat(sunInfos[12])}°, {parseFloat(sunInfos[11])}°)</span>
            <span className="absolute w-full h-1/2 bottom-0 bg-green-900/20 dark:bg-white/25"></span>
            <span className="civil-twilight absolute w-full px-1 md:px-2 bottom-[46.67%] text-right text-green-600 dark:text-gray-300">{formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? t('civil_twilight.1') : t('civil_twilight.0')} (-6°)</span>
            <span className="civil-twilight absolute bottom-[46.67%] border border-dotted border-green-500 dark:border-gray-300 w-full"></span>
            <span className="nautical-twilight absolute bottom-[43.33%] border border-dashed border-green-500 dark:border-gray-300 w-full"></span>
            <span className="absolute w-full px-1 md:px-2 bottom-[43.33%] text-right text-green-600 dark:text-gray-300">{formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? t('nautical_twilight.1') : t('nautical_twilight.0')} (-12°)</span>
            <span className="astronomical-twilight absolute bottom-[40%] border border-double border-green-500 dark:border-gray-300 w-full"></span>
            <span className="absolute w-full px-1 md:px-2 bottom-[40%] text-right text-green-600 dark:text-gray-300">{formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? t('astronomical_twilight.1') : t('astronomical_twilight.0')} (-18°)</span>
            <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ top: `${duhrPosition}%` }}></span>
            <span className={`${formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? "mt-1" : "-mt-5"} absolute w-full text-center duration-200`} style={{ top: `${duhrPosition}%` }}>
              <b>
                {t('prayer_names.4')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(4)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(4)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''}
              </b>
            </span>
            <span className={`${formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? "-mt-5" : "mt-1"} absolute w-full text-center duration-200`} style={{ top: `${duhrPosition}%` }}><b>{t('sun_infos.8')} (+{sunInfos[sunInfos.length - 4]})</b></span>
            {(formattedDateTime <= sunInfos[sunInfos.length - 6] || formattedDateTime >= sunInfos[sunInfos.length - 5]) && dhuhaPosition > 0 && (
              <React.Fragment>
                <span className="absolute -mt-6 w-full duration-200" style={{ top: `${dhuhaPosition}%` }}>
                  <b>
                    {t('prayer_names.3')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(3)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(3)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''} (+{dhuhaSunAltitude}°)
                  </b>
                </span>
                <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ top: `${dhuhaPosition}%` }}></span>
              </React.Fragment>
            )}
            {(formattedDateTime <= sunInfos[sunInfos.length - 6] || formattedDateTime >= sunInfos[sunInfos.length - 5]) && (
              <React.Fragment>
                <span className="absolute mb-0.5 w-full duration-200" style={{ bottom: `${fajrPosition}%` }}>
                  <b>
                    {t('prayer_names.1')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(1)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(1)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''} (-{sunAltitude.fajr}°)
                  </b>
                </span>
                <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ bottom: `${fajrPosition}%` }}></span>
              </React.Fragment>
            )}
            {formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] && (
              <React.Fragment>
                <span className="absolute m-0.5 w-full duration-200" style={{ top: `${ashrPosition}%` }}>
                  <b>
                    {t('prayer_names.5')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(5)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(5)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''} (+{sunInfos[sunInfos.length - 3]})
                  </b>
                </span>
                <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ top: `${ashrPosition}%` }}></span>
              </React.Fragment>
            )}
            {formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] && ishaPosition > 0 && (
              <React.Fragment>
                <span className="absolute -mb-4 w-full duration-200" style={{ bottom: `${ishaPosition}%` }}>
                  <b>
                    {t('prayer_names.7')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(7)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(7)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''} (-{sunAltitude.isha}°)
                  </b>
                </span>
                <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ bottom: `${ishaPosition}%` }}></span>
              </React.Fragment>
            )}
            <span className="absolute horizon border-t-2 md:border-2 border-solid border-t-green-900 dark:border-t-white w-full bg-green-900 dark:bg-white"></span>
            <span className="absolute w-full mb-0.5 bottom-1/2 text-center text-green-500 dark:text-gray-300">{formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5] ? t('horizons.1') : t('horizons.0')}</span>
            {formattedDateTime > sunInfos[sunInfos.length - 6] && formattedDateTime < sunInfos[sunInfos.length - 5]
              ? <span className="absolute w-full bottom-[46.67%] text-center text-green-900 dark:text-white">
                  <b>
                    {t('prayer_names.6')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(6)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(6)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''}
                  </b>
                </span>
              : <span className="absolute w-full bottom-[46.67%] text-center text-green-900 dark:text-white">
                  <b>
                    {t('prayer_names.2')} {t('at')} {isPreciseToSeconds ? currentPrayerTimes?.at(2)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') : currentPrayerTimes?.at(2)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h23",  hour: '2-digit', minute: '2-digit', timeZone: timeZone }).replace(/\./gm, ':') || ''}
                  </b>
                </span>
            }
            <span className="absolute border md:border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white duration-200" style={{ top: `${midnightPosition}%` }}></span>
            <span className={`${parseFloat(sunInfos[sunInfos.length - 2]) < -80 ? "-mt-6" : "mt-1"} absolute w-full text-center duration-200`} style={{ top: `${midnightPosition}%` }}><b>{t('sun_infos.9')} ({sunInfos[sunInfos.length - 2]})</b></span>
          </div>
          <p className="text-sm md:text-base xl:text-lg">{t('nadir')} (-90°)</p>
        </div>
        <div className="w-full md:w-1/2 px-2">
          <h3 className="m-0 md:m-2">{t('sun_info')}</h3>
          {inputDate !== '' && inputTime !== ''
            ? formattedDateTime instanceof Date
              ? <h5 className="text-center text-green-700 dark:text-gray-200 duration-200">{t('set_sun_info')} {formattedDateTime.toLocaleDateString(selectedLanguage || 'en', { weekday: "long", day: 'numeric', month: 'long', year: 'numeric' })}</h5>
              : null
            : null}
          <table className="table-auto mx-auto text-justify text-base md:text-sm lg:text-base">
            {en.sun_infos.map((_, index) => (
              <tr key={index} className="align-top">
                <td className="whitespace-nowrap">{t(`sun_infos.${index}`)}</td>
                <td>&nbsp;:&nbsp;</td>
                <td>{areSunInfosLoading ? t("loading") : sunInfos[index]}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </section>
  )
}

export default PrayerTimesVisualization