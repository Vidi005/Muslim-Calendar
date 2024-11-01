import { adjustedIslamicDate, getCalendarData, getMoonInfos } from "./data"

self.onmessage = event => {
  const { type, months, gregorianDate, latitude, longitude, elevation, criteria, formula, lang, errMsg, timeZone } = event.data
  if (type === 'createAdjustedIslamicDate') {
    const result = adjustedIslamicDate(gregorianDate, months)
    self.postMessage({ type: 'createAdjustedIslamicDate', result })
  } else if (type === 'createCalendarData') {
    const result = getCalendarData(gregorianDate, latitude, longitude, elevation, criteria, formula, lang, errMsg)
    self.postMessage({ type: 'createCalendarData', result })
  } else if (type === 'createMoonInfos') {
    const result = getMoonInfos(gregorianDate, timeZone, latitude, longitude, elevation, lang)
    self.postMessage({ type: 'createMoonInfos', result })
  }
}