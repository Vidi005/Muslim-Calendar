import React from "react"
import en from "../../../locales/en.json"

const GlobalSolarEclipseItem = ({ t, selectedLanguage, selectedTimeZone, globalSolarEclipse }) => {
  const solarEclipseKind = globalSolarEclipse?.kind?.charAt(0)?.toUpperCase() + globalSolarEclipse?.kind?.slice(1)
  const distance = `${globalSolarEclipse?.distance?.toFixed(6)} km`
  const latitude = `${globalSolarEclipse?.kind === 'partial' ? t(`global_solar_eclipse_infos.${en.global_solar_eclipse_infos.length - 1}`) : globalSolarEclipse?.latitude + '°'}`
  const longitude = `${globalSolarEclipse?.kind === 'partial' ? t(`global_solar_eclipse_infos.${en.global_solar_eclipse_infos.length - 1}`) : globalSolarEclipse?.longitude + '°'}`
  const solarEclipseObscuration = `${globalSolarEclipse?.kind === 'partial' ? t(`global_solar_eclipse_infos.${en.global_solar_eclipse_infos.length - 1}`) : (globalSolarEclipse?.obscuration * 100).toFixed(2) + '%'}`
  const solarEclipsePeakTime = `${globalSolarEclipse?.peak?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')}`
  const globalSolarEclipseArrayData = [
    solarEclipseKind,
    distance,
    latitude,
    longitude,
    solarEclipseObscuration,
    solarEclipsePeakTime
  ]
  return (
    <div className="w-full bg-green-50 dark:bg-black p-2 md:px-4 text-base md:text-sm lg:text-base rounded-md md:rounded-lg shadow lg:shadow-md dark:shadow-white/50 overflow-hidden duration-200">
      <h4 className="mb-1 text-center text-base md:text-sm lg:text-base text-green-900 dark:text-white font-bold">{`${globalSolarEclipse?.peak?.toLocaleDateString(selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at')}`}</h4>
      <table className="table-auto">
        {en.global_solar_eclipse_infos.slice(0, -1).map((_, index) => (
          <tr className="align-top text-black dark:text-gray-100" key={index}>
            <td className="whitespace-nowrap">{t(`global_solar_eclipse_infos.${index}`)}</td>
            <td>&nbsp;:&nbsp;</td>
            <td>{globalSolarEclipseArrayData[index]}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default GlobalSolarEclipseItem