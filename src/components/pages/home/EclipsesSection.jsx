import React from "react"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import en from "../../../locales/en.json"
import { Link } from "react-router-dom"
import { convertMinutesToTime, pages } from "../../../utils/data"

const EclipsesSection = () => (
  <HomePageConsumer>
    {({ t, state }) => {
      const solarEclipseKind = state.localSolarEclipseInfo?.kind?.charAt(0)?.toUpperCase() + state.localSolarEclipseInfo?.kind?.slice(1)
      const solarEclipseObscuration = `${(state.localSolarEclipseInfo?.obscuration * 100).toFixed(2)}%`
      const partialBeginAltitude = `${state.localSolarEclipseInfo?.partialBeginAltitude?.toFixed(2)}°`
      const partialBeginTime = state.localSolarEclipseInfo?.partialBeginTime?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')
      const partialEndAltitude = `${state.localSolarEclipseInfo?.partialEndAltitude?.toFixed(2)}°`
      const partialEndTime = `${state.localSolarEclipseInfo?.partialEndTime?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
      const peakAltitude = `${state.localSolarEclipseInfo?.peakAltitude?.toFixed(2)}°`
      const solarEclipsePeakTime = `${state.localSolarEclipseInfo?.peakTime?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
      const totalBeginAltitude = `${state.localSolarEclipseInfo?.totalBeginAltitude <= 0 ? t('local_solar_eclipse_infos.12') : state.localSolarEclipseInfo?.totalBeginAltitude?.toFixed(2) + '°'}`
      const totalBeginTime = `${state.localSolarEclipseInfo?.totalBeginTime <= 0 ? t('local_solar_eclipse_infos.12') : state.localSolarEclipseInfo?.totalBeginTime?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
      const totalEndAltitude = `${state.localSolarEclipseInfo?.totalEndAltitude <= 0 ? t('local_solar_eclipse_infos.12') : state.localSolarEclipseInfo?.totalEndAltitude?.toFixed(2) + '°'}`
      const totalEndTime = `${state.localSolarEclipseInfo?.totalEndTime <= 0 ? t('local_solar_eclipse_infos.12') : state.localSolarEclipseInfo?.totalEndTime?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
      const localSolarEclipseArrayData = [
        solarEclipseKind,
        solarEclipseObscuration,
        partialBeginAltitude,
        partialBeginTime,
        partialEndAltitude,
        partialEndTime,
        peakAltitude,
        solarEclipsePeakTime,
        totalBeginAltitude,
        totalBeginTime,
        totalEndAltitude,
        totalEndTime
      ]
      const lunarEclipseKind = state.lunarEclipseInfo?.kind?.charAt(0)?.toUpperCase() + state.lunarEclipseInfo?.kind?.slice(1)
      const lunarEclipseObscuration = `${state.lunarEclipseInfo?.obscuration?.toFixed(2) * 100}%`
      const lunarEclipsePeakTime = state.lunarEclipseInfo?.peak?.toLocaleString(state.selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: state.selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')
      const semiDurationPenum = convertMinutesToTime(state.lunarEclipseInfo?.sdPenum, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
      const semiDurationPartial = state.lunarEclipseInfo?.kind === 'penumbral' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(state.lunarEclipseInfo?.sdPartial, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
      const semiDurationTotal = state.lunarEclipseInfo?.kind !== 'total' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(state.lunarEclipseInfo?.sdTotal, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
      const lunarEclipseArrayData = [
        lunarEclipseKind,
        lunarEclipseObscuration,
        lunarEclipsePeakTime,
        semiDurationPenum,
        semiDurationPartial,
        semiDurationTotal,
        t('eclipse_visibilities.2')
      ]
      return (
        <section className="eclipses-section flex flex-col items-center w-full p-1 md:p-2 animate__animated animate__fadeInUp">
          <h1 className="m-2 text-center text-green-900 dark:text-white duration-200">{t('eclipses')}</h1>
          <div className="flex flex-wrap md:flex-nowrap w-full">
            <div className="local-solar-eclipse-container flex flex-col items-center w-full md:w-1/2 px-2 md:px-4 text-green-700 dark:text-gray-200 duration-200">
              <h2 className="m-2 text-center text-green-700 dark:text-gray-200 duration-200">{t('local_solar_eclipse')}</h2>
              <table className="table-auto text-base md:text-sm lg:text-base text-black dark:text-gray-200">
                {en.local_solar_eclipse_infos.slice(0, -1).map((_, index) => (
                  <tr className="align-top" key={index}>
                    <td className="whitespace-nowrap">{t(`local_solar_eclipse_infos.${index}`)}</td>
                    <td>&nbsp;:&nbsp;</td>
                    <td>{state.areEclipseInfosLoading ? t("loading") : localSolarEclipseArrayData[index]}</td>
                  </tr>
                ))}
              </table>
            </div>
            <div className="lunar-eclipse-container flex flex-col items-center w-full md:w-1/2 px-2 md:px-4 text-green-700 dark:text-gray-200 duration-200">
              <h2 className="m-2 text-center text-green-700 dark:text-gray-200 duration-200">{t('lunar_eclipse')}</h2>
              <table className="table-auto text-base md:text-sm lg:text-base text-black dark:text-gray-200">
                {en.lunar_eclipse_infos.slice(0, -1).map((_, index) => (
                  <tr className="align-top" key={index}>
                    <td className="whitespace-nowrap">{t(`lunar_eclipse_infos.${index}`)}</td>
                    <td>&nbsp;:&nbsp;</td>
                    <td>{state.areEclipseInfosLoading ? t("loading") : lunarEclipseArrayData[index]}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
          <Link to={pages()[3].path} className="flex items-center justify-center border border-green-900 dark:border-green-500 bg-green-700 dark:bg-green-600 m-4 px-4 py-1.5 hover:bg-green-700/50 dark:hover:bg-green-500/25 text-white duration-200 rounded-lg shadow-md dark:shadow-white/50 overflow-hidden">
            <h4>{t('more')}</h4>
          </Link>
        </section>
      )
    }}
  </HomePageConsumer>
)

export default EclipsesSection