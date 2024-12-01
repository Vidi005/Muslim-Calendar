import { adjustedIslamicDate, getCalendarData, getCitiesByName, getElementContent, getMoonInfos, getNearestCity, getPrayerTimes, getQiblaDirection, getSunInfos } from "./data"

const CACHE_NAME = 'app-cache-v1.1' // Update the version when deploying new builds
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

self.onmessage = event => {
  const { type, months, setMonths, gregorianDate, formattedDateTime, cityData, query, latitude, longitude, elevation, criteria, sunAltitude, formula, lang, innerHTML, timeZone, calculationMethod, ashrTime, ihtiyath, corrections, dhuhaMethod, inputSunAlt, inputMins } = event.data
  if (type === 'createAdjustedIslamicDate') {
    const result = adjustedIslamicDate(months, lang)
    self.postMessage({ type: 'createAdjustedIslamicDate', result })
  } else if (type === 'createCityData') {
    const result = getCitiesByName(cityData, query)
    self.postMessage({ type: 'createCityData', result })
  } else if (type === 'createHaversineDistance') {
    const result = getNearestCity(cityData, latitude, longitude)
    self.postMessage({ type: 'createHaversineDistance', result })
  } else if (type === 'createCalendarData') {
    const result = getCalendarData(gregorianDate, latitude, longitude, elevation, criteria, sunAltitude.fajr, formula, lang)
    self.postMessage({ type: 'createCalendarData', result })
  } else if (type === 'createIncludedElement') {
    const result = getElementContent(innerHTML)
    self.postMessage({ type: 'createIncludedElement', result })
  } else if (type === 'createMoonInfos') {
    const result = getMoonInfos(gregorianDate, timeZone, latitude, longitude, elevation, lang)
    self.postMessage({ type: 'createMoonInfos', result })
  } else if (type === 'createQiblaDirection') {
    const result = getQiblaDirection(latitude, longitude)
    self.postMessage({ type: 'createQiblaDirection', result })
  } else if (type === 'createPrayerTimes') {
    const result = getPrayerTimes(gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, calculationMethod, ashrTime, sunAltitude, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
    self.postMessage({ type: 'createPrayerTimes', result })
  } else if (type === 'createSunInfos') {
    const result = getSunInfos(gregorianDate, timeZone, latitude, longitude, elevation, ashrTime, lang)
    self.postMessage({ type: 'createSunInfos', result })
  }
}