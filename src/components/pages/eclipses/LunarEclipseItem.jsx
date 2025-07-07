import React from "react"
import en from "./../../../locales/en.json"
import { convertMinutesToTime } from "../../../utils/data"

const LunarEclipseItem = ({ t, selectedLanguage, selectedTimeZone, lunarEclipse }) => {
  const lunarEclipseKind = lunarEclipse?.kind?.charAt(0)?.toUpperCase() + lunarEclipse?.kind?.slice(1)
  const lunarEclipseObscuration = `${lunarEclipse?.obscuration?.toFixed(2) * 100}%`
  const penumbralBeginTime = `${lunarEclipse?.penumbralBeginTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isPenumbralBeginVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const lunarPartialBeginTime = lunarEclipse?.kind === 'penumbral' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : `${lunarEclipse?.partialBeginTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isPartialBeginVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const lunarTotalBeginTime = lunarEclipse?.kind !== 'total' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : `${lunarEclipse?.totalBeginTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isTotalBeginVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const lunarEclipsePeakTime = `${lunarEclipse?.peak?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isPeakTimeVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const lunarTotalEndTime = lunarEclipse?.kind !== 'total' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : `${lunarEclipse?.totalEndTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isTotalEndVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const lunarPartialEndTime = lunarEclipse?.kind === 'penumbral' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : `${lunarEclipse?.partialEndTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isPartialEndVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const penumbralEndTime = `${lunarEclipse?.penumbralEndTime?.toLocaleTimeString(selectedLanguage || 'en', { timeZone: selectedTimeZone, timeZoneName: 'short', hour12: false, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} (${lunarEclipse?.isPenumbralEndVisible ? t('eclipse_visibilities.0') : t('eclipse_visibilities.1')})`
  const penumbralDuration = convertMinutesToTime(lunarEclipse?.penumbralDuration, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
  const partialDuration = lunarEclipse?.kind === 'penumbral' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(lunarEclipse?.partialDuration, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
  const totalDuration = lunarEclipse?.kind !== 'total' ? t(`lunar_eclipse_infos.${en.lunar_eclipse_infos.length - 1}`) : convertMinutesToTime(lunarEclipse?.totalDuration, t('time_suffixes.0'), t('time_suffixes.1'), t('time_suffixes.2'))
  const lunarEclipseArrayData = [
    lunarEclipseKind,
    lunarEclipseObscuration,
    penumbralBeginTime,
    lunarPartialBeginTime,
    lunarTotalBeginTime,
    lunarEclipsePeakTime,
    lunarTotalEndTime,
    lunarPartialEndTime,
    penumbralEndTime,
    penumbralDuration,
    partialDuration,
    totalDuration
  ]
  return (
    <div className="w-full bg-green-50 dark:bg-black p-2 md:px-4 text-base md:text-sm lg:text-base rounded-md md:rounded-lg shadow lg:shadow-md dark:shadow-white/50 overflow-hidden duration-200">
      <h4 className="mb-1 text-center text-base md:text-sm lg:text-base text-green-900 dark:text-white font-bold">{`${lunarEclipse?.penumbralBeginTime?.toLocaleDateString(selectedLanguage || 'en', { calendar: 'gregory', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: selectedTimeZone }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at')}`}</h4>
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