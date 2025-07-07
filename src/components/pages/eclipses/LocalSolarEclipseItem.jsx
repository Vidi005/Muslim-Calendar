import React from "react"
import en from "./../../../locales/en.json"

const LocalSolarEclipseItem = ({ t, selectedLanguage, selectedTimeZone, localSolarEclipse }) => {
  const solarEclipseKind = localSolarEclipse?.kind?.charAt(0)?.toUpperCase() + localSolarEclipse?.kind?.slice(1)
  const solarEclipseObscuration = `${(localSolarEclipse?.obscuration * 100).toFixed(2)}%`
  const partialBeginAltitude = `${localSolarEclipse?.partialBeginAltitude?.toFixed(2)}°`
  const partialBeginTime = localSolarEclipse?.partialBeginTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')
  const partialEndAltitude = `${localSolarEclipse?.partialEndAltitude?.toFixed(2)}°`
  const partialEndTime = `${localSolarEclipse?.partialEndTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
  const peakAltitude = `${localSolarEclipse?.peakAltitude?.toFixed(2)}°`
  const solarEclipsePeakTime = `${localSolarEclipse?.peakTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
  const totalBeginAltitude = `${localSolarEclipse?.totalBeginAltitude <= 0 ? t('local_solar_eclipse_infos.12') : localSolarEclipse?.totalBeginAltitude?.toFixed(2) + '°'}`
  const totalBeginTime = `${localSolarEclipse?.totalBeginTime <= 0 ? t('local_solar_eclipse_infos.12') : localSolarEclipse?.totalBeginTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
  const totalEndAltitude = `${localSolarEclipse?.totalEndAltitude <= 0 ? t('local_solar_eclipse_infos.12') : localSolarEclipse?.totalEndAltitude?.toFixed(2) + '°'}`
  const totalEndTime = `${localSolarEclipse?.totalEndTime <= 0 ? t('local_solar_eclipse_infos.12') : localSolarEclipse?.totalEndTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
  const localSolarEclipseArrayData = [
    solarEclipseKind,
    solarEclipseObscuration,
    partialBeginAltitude,
    partialBeginTime,
    totalBeginAltitude,
    totalBeginTime,
    peakAltitude,
    solarEclipsePeakTime,
    totalEndAltitude,
    totalEndTime,
    partialEndAltitude,
    partialEndTime
  ]
  return (
    <div className="w-full bg-green-50 dark:bg-black p-2 md:px-4 text-base md:text-sm lg:text-base rounded-md md:rounded-lg shadow lg:shadow-md dark:shadow-white/50 overflow-hidden duration-200">
      <h4 className="mb-1 text-center text-base md:text-sm lg:text-base text-green-900 dark:text-white font-bold">{`${localSolarEclipse?.partialBeginTime?.toLocaleDateString(selectedLanguage || 'en', { calendar: 'gregory', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: selectedTimeZone }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at')}`}</h4>
      <table className="table-auto">
        {en.local_solar_eclipse_infos.slice(0, -1).map((_, index) => (
          <tr className="align-top text-black dark:text-gray-100" key={index}>
            <td className="whitespace-nowrap">{t(`local_solar_eclipse_infos.${index}`)}</td>
            <td>&nbsp;:&nbsp;</td>
            <td>{localSolarEclipseArrayData[index]}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default LocalSolarEclipseItem