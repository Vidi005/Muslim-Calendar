import React from "react"
import en from "../../../locales/en.json"

const PrayerTimesVisualization = ({ t, selectedLanguage, inputDate, inputTime, formattedDateTime, timeZone, seletedDhuhaMethod, dhuhaSunAltitude, sunAltitude, currentPrayerTimes, areSunInfosLoading, sunInfos }) => {
  const [ySunPosition, xSunPosition] = [(parseFloat(sunInfos[2]) / 90) * 100, ((parseFloat(sunInfos[3]) % 180) / 180) * 100]
  const fajrPosition = ((90 - sunAltitude.fajr) / 90) * 50
  const dhuhaPosition = seletedDhuhaMethod === 1 ? 0 :((90 - dhuhaSunAltitude) / 90) * 50
  const ashrPosition = ((90 - parseFloat(sunInfos[sunInfos.length - 1])) / 90) * 50
  const ishaPosition = isNaN(sunAltitude.isha) ? 0 :((90 - sunAltitude.isha) / 90) * 50
  return (
    <section className="w-full p-2 md:p-4 2xl:p-8 text-center text-green-900 dark:text-white duration-200 animate__animated animate__fadeInUp">
      <h2>{t('visualization')}</h2>
      <div className="flex flex-wrap justify-center w-full">
        <div className="w-full md:w-1/2">
          {areSunInfosLoading
            ? (
              <div className="flex items-center justify-center w-full h-full space-x-2 p-2 md:p-4">
                <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
                <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('visualization_loading')}</span>
              </div>
            )
            : (
              <React.Fragment>
                <p className="text-sm md:text-base xl:text-lg">{t('zenith')}</p>
                <div className="relative flex-auto flex flex-col items-center justify-center aspect-square border border-green-900 dark:border-white w-full min-h-full text-xs md:text-sm xl:text-base duration-300 overflow-hidden">
                  <span className="absolute w-[6%] h-[6%] aspect-square border border-yellow-700 bg-yellow-400 rounded-full" style={{ top: `${ySunPosition}%`, left: `${parseFloat(sunInfos[3]) > 180 ? xSunPosition : 100 - xSunPosition}%` }}></span>
                  <span className={`${parseFloat(sunInfos[3]) > 90 ? "-translate-x-full" : "translate-x-full"} absolute p-1 text-xs md:text-sm xl:text-base text-center text-yellow-600 dark:text-yellow-300`} style={{ top: `${ySunPosition}%`, left: `${xSunPosition}%` }}>{t('objects.0')}</span>
                  {formattedDateTime > sunInfos[sunInfos.length - 2] && (
                    <React.Fragment>
                      <span className="absolute top-0 border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white"></span>
                      <span className="absolute top-1 w-full text-center"><b>{t('prayer_names.4')} {t('at')} {currentPrayerTimes?.at(4)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24", hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })}</b></span>
                    </React.Fragment>
                  )}
                  {formattedDateTime < sunInfos[sunInfos.length - 2] && dhuhaPosition > 0 && (
                    <React.Fragment>
                      <span className="absolute -m-2 w-full" style={{ top: `${dhuhaPosition}%` }}><b>{t('prayer_names.3')} {t('at')} {currentPrayerTimes?.at(3)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24",  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })} (+{dhuhaSunAltitude}°)</b></span>
                      <span className="absolute border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white" style={{ top: `${dhuhaPosition}%` }}></span>
                    </React.Fragment>
                  )}
                  {formattedDateTime < sunInfos[sunInfos.length - 2] && (
                    <React.Fragment>
                      <span className="absolute m-1 w-full" style={{ bottom: `${fajrPosition}%` }}><b>{t('prayer_names.1')} {t('at')} {currentPrayerTimes?.at(1)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24",  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })} (-{sunAltitude.fajr}°)</b></span>
                      <span className="absolute border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white" style={{ bottom: `${fajrPosition}%` }}></span>
                    </React.Fragment>
                  )}
                  {formattedDateTime > sunInfos[sunInfos.length - 2] && (
                    <React.Fragment>
                      <span className="absolute m-1 w-full" style={{ top: `${ashrPosition}%` }}><b>{t('prayer_names.5')} {t('at')} {currentPrayerTimes?.at(5)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24",  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })} (+{sunInfos[sunInfos.length - 1]}°)</b></span>
                      <span className="absolute border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white" style={{ top: `${ashrPosition}%` }}></span>
                    </React.Fragment>
                  )}
                  {formattedDateTime > sunInfos[sunInfos.length - 2] && ishaPosition > 0 && (
                    <React.Fragment>
                      <span className="absolute -m-4 w-full" style={{ bottom: `${ishaPosition}%` }}><b>{t('prayer_names.7')} {t('at')} {currentPrayerTimes?.at(7)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24",  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })} (-{sunAltitude.isha}°)</b></span>
                      <span className="absolute border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white" style={{ bottom: `${ishaPosition}%` }}></span>
                    </React.Fragment>
                  )}
                  <span className="horizon border-2 border-solid border-green-900 dark:border-white w-full bg-green-900 dark:bg-white"></span>
                  <span className="absolute w-full h-1/2 bottom-0 bg-green-900/20 dark:bg-white/25"></span>
                  <span className="absolute w-full bottom-1/2 text-center text-green-600 dark:text-gray-300">{formattedDateTime > sunInfos[sunInfos.length - 2] ? t('horizons.1') : t('horizons.0')}</span>
                  <span className="civil-twilight absolute bottom-[46.67%] border border-dotted border-green-600/50 dark:border-gray-300/50 w-full"></span>
                  {formattedDateTime > sunInfos[sunInfos.length - 2] && <span className="absolute w-full px-2 bottom-[46.67%] text-center text-green-900 dark:text-white">{t('prayer_names.6')} {currentPrayerTimes?.at(6)?.toLocaleTimeString(selectedLanguage || 'en', { hourCycle: "h24",  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone })}</span>}
                  <span className="absolute w-full px-2 bottom-[46.67%] text-right text-green-600/50 dark:text-gray-300/50">{formattedDateTime > sunInfos[sunInfos.length - 2] ? t('civil_twilight.1') : t('civil_twilight.0')} (-6°)</span>
                  <span className="nautical-twilight absolute bottom-[43.33%] border border-dashed border-green-600/50 dark:border-gray-300/50 w-full"></span>
                  <span className="absolute w-full px-2 bottom-[43.33%] text-right text-green-600/50 dark:text-gray-300/50">{formattedDateTime > sunInfos[sunInfos.length - 2] ? t('nautical_twilight.1') : t('nautical_twilight.0')} (-12°)</span>
                  <span className="astronomical-twilight absolute bottom-[40%] border border-double border-green-600/50 dark:border-gray-300/50 w-full"></span>
                  <span className="absolute w-full px-2 bottom-[40%] text-right text-green-600/50 dark:text-gray-300/50">{formattedDateTime > sunInfos[sunInfos.length - 2] ? t('astronomical_twilight.1') : t('astronomical_twilight.0')} (-18°)</span>
                </div>
                <p className="text-sm md:text-base xl:text-lg">{t('nadir')}</p>
              </React.Fragment>
            )}
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