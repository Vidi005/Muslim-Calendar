import { adjustedIslamicDate, getCalendarData, getElementContent, getMoonInfos, getPrayerTimes } from "./data"

self.onmessage = event => {
  const { type, months, gregorianDate, latitude, longitude, elevation, criteria, sunAltitude, formula, lang, innerHTML, timeZone, calculationMethod, ashrTime, ihtiyath, corrections, dhuhaMethod, inputSunAlt, inputMins } = event.data
  if (type === 'createAdjustedIslamicDate') {
    const result = adjustedIslamicDate(gregorianDate, months)
    self.postMessage({ type: 'createAdjustedIslamicDate', result })
  } else if (type === 'createCalendarData') {
    const result = getCalendarData(gregorianDate, latitude, longitude, elevation, criteria, sunAltitude.fajr, formula, lang)
    self.postMessage({ type: 'createCalendarData', result })
  } else if (type === 'createIncludedElement') {
    const result = getElementContent(innerHTML)
    self.postMessage({ type: 'createIncludedElement', result })
  } else if (type === 'createMoonInfos') {
    const result = getMoonInfos(gregorianDate, timeZone, latitude, longitude, elevation, lang)
    self.postMessage({ type: 'createMoonInfos', result })
  } else if (type === 'createPrayerTimes') {
    const result = getPrayerTimes(gregorianDate, latitude, longitude, elevation, timeZone, calculationMethod, ashrTime, sunAltitude, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
    self.postMessage({ type: 'createPrayerTimes', result })
  }
}