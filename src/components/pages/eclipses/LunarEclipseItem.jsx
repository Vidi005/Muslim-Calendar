import React from "react"
import en from "./../../../locales/en.json"
import { convertMinutesToTime } from "../../../utils/data"

const LunarEclipseItem = ({ t, selectedLanguage, selectedTimeZone, lunarEclipse }) => {
  const lunarEclipseKind = lunarEclipse?.kind?.charAt(0)?.toUpperCase() + lunarEclipse?.kind?.slice(1)
  const lunarEclipseObscuration = `${lunarEclipse?.obscuration?.toFixed(2) * 100}%`
  const lunarEclipsePeakTime = lunarEclipse?.peak?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')
  const semiDurationPenum = convertMinutesToTime(lunarEclipse?.sdPenum, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
  const semiDurationPartial = lunarEclipse?.kind === 'penumbral' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(lunarEclipse?.sdPartial, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
  const semiDurationTotal = lunarEclipse?.kind !== 'total' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(lunarEclipse?.sdTotal, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
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
    <div className="w-full bg-green-50 dark:bg-black p-2 md:px-4 text-base md:text-sm lg:text-base rounded-md md:rounded-lg shadow lg:shadow-md dark:shadow-white overflow-hidden duration-200">
      <h4 className="mb-1 text-center text-base md:text-sm lg:text-base text-green-900 dark:text-white font-bold">{`${lunarEclipse?.peak?.toLocaleDateString(selectedLanguage || 'en', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}</h4>
      <table className="table-auto">
        {en.lunar_eclipse_infos.slice(0, -1).map((_, index) => (
          <tr className="align-top text-black dark:text-gray-100" key={index}>
            <td className="whitespace-nowrap">{t(`lunar_eclipse_infos.${index}`)}</td>
            <td>&nbsp;:&nbsp;</td>
            <td>{lunarEclipseArrayData[index]}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default LunarEclipseItem