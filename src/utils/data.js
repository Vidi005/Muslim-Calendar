import { AngleBetween, AngleFromSun, AstroTime, Body, EclipticGeoMoon, Elongation, Equator, EquatorFromVector, GeoVector, Horizon, Illumination, Libration, MakeTime, MoonPhase, Observer, RotateVector, Rotation_EQJ_EQD, SearchAltitude, SearchHourAngle, SearchMoonPhase, SearchRiseSet, SunPosition } from "astronomy-engine"

const isStorageExist = content => {
  if (!navigator.cookieEnabled) {
    alert(content)
    return false
  } else {
    return true
  }
}

const pages = () => [
  {
    path: '/home',
    icon: '/home-icon.svg'
  },
  {
    path: '/prayer-times',
    icon: '/prayer-times-icon.svg'
  },
  {
    path: '/moon-crescent-map',
    icon: '/map-icon.svg'
  },
  {
    path: '/eclipses',
    icon: '/eclipse-icon.svg'
  },
  {
    path: '/about',
    icon: '/about-icon.svg'
  }
]

const getTimezoneOffset = timezone => {
  const date = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset'
  })
  const offsetMatch = formatter.formatToParts(date).find(part => part.type === 'timeZoneName')
  let offset = offsetMatch.value.replace('GMT', '')
  if (offset.length > 0) {
    if (offset.includes(':')) {
      offset = offset.length < 6 ? `${offset.slice(0, 1)}0${offset.slice(1)}` : offset
    }
    else offset = offset.length < 3 ? `${offset.slice(0, 1)}0${offset.slice(1)}:00` : `${offset}:00`
  } else offset = "+00:00"
  return offset
}

const parseOffset = offset => {
  const sign = offset.charAt(0)
  const hours = offset.slice(1).split(':')[0]
  const minutes = offset.split(':')[1]
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes)
  return (sign === '+' ? 1 : -1) * totalMinutes
}

const getTimeZoneList = () => {
  const timeZoneList = Intl.supportedValuesOf('timeZone')
  const timeZonePairs = timeZoneList.map(timeZone => ({
    timeZone: timeZone,
    offset: getTimezoneOffset(timeZone)
  })).sort((a, b) => parseOffset(a.offset) - parseOffset(b.offset))
  return timeZonePairs
}

const getTimeZoneDiff = () => new Date().getTimezoneOffset() / 60

const meccaCoordinates = { latitude: 21.4224779, longitude: 39.8251832, elevation: 302 }
const sabangCoordinates = { latitude: 5.894, longitude: 95.316, elevation: 43.6 }

const observerFromEarth = (latitude, longitude, elevation) => new Observer(latitude, longitude, elevation)

const calculateNewMoon = (startDate, latitude, longitude, elevation, criteria, fajrAlt, formula) => {
  let observer = observerFromEarth(latitude, longitude, elevation)
  let date = startDate
  let newMoonDate
  let newMoon
  let moonElongation
  let dateInNewMoon
  let eastObserver
  let westObserver
  let fajr
  let sunset
  let moonEquator
  let moonHorizon
  if (criteria === 0) {
    // Global Hijri Calendar/KHGT
    while (true) {
      // Search for New Moon backward
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(`${newMoon.date.getFullYear()}-${addZeroPad(newMoon.date.getMonth() + 1)}-${addZeroPad(newMoon.date.getDate())}T00:00:00Z`)
      newMoonDate = new AstroTime(dateInNewMoon)
      eastObserver = observerFromEarth(0, 150, elevation)
      westObserver = observerFromEarth(0, -150, elevation)
      fajr = SearchAltitude(Body.Sun, eastObserver, +1, newMoonDate, 1, -fajrAlt)
      sunset = SearchRiseSet(Body.Sun, westObserver, -1, newMoonDate, 1, elevation)
      if (!sunset) {
        // If sunset is not found, search for sunset on the lower latitude by using lower latitude observer or Mecca observer (based selected formula)
        if (formula === 0) {
          if (latitude > 48) westObserver = observerFromEarth(45, longitude, elevation)
          else westObserver = observerFromEarth(-45, longitude, elevation)
        } else if (formula === 1) {
          westObserver = observerFromEarth(meccaCoordinates.latitude, meccaCoordinates.longitude, meccaCoordinates.elevation)
        } else {
          if (latitude > 48) westObserver = observerFromEarth(48, longitude, elevation)
          else westObserver = observerFromEarth(-48, longitude, elevation)
        }
        sunset = SearchRiseSet(Body.Sun, westObserver, -1, newMoonDate, 1, elevation)
      }
      moonElongation = Elongation(Body.Moon, sunset)
      moonEquator = Equator(Body.Moon, sunset, westObserver, true, true)
      moonHorizon = Horizon(sunset, westObserver, moonEquator.ra, moonEquator.dec, 'normal')
      if (moonElongation.elongation >= 8 && moonHorizon.altitude >= 5) {
        // Met the Global Hijri Calendar criteria
        return newMoonDate.AddDays(1)
      } else if (newMoonDate.date < fajr.date) {
        // Met the Global Hijri Calendar criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Global Hijri Calendar criteria
        return newMoonDate.AddDays(2)
      }
    }
  } else if (criteria === 1) {
    // MABIMS
    while (true) {
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(`${newMoon.date.getFullYear()}-${addZeroPad(newMoon.date.getMonth() + 1)}-${addZeroPad(newMoon.date.getDate())}T00:00:00Z`)
      newMoonDate = new AstroTime(dateInNewMoon)
      observer = observerFromEarth(sabangCoordinates.latitude, sabangCoordinates.longitude, sabangCoordinates.elevation)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      moonEquator = Equator(Body.Moon, sunset, observer, true, true)
      moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, 'normal')
      moonElongation = Elongation(Body.Moon, sunset)
      if (moonElongation.elongation >= 6.4 && moonHorizon.altitude >= 3) {
        // Met the MABIMS criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the MABIMS criteria
        return newMoonDate.AddDays(2)
      }
    }
  } else if (criteria === 2) {
    // Wujudul Hilal
    do {
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(`${newMoon.date.getFullYear()}-${addZeroPad(newMoon.date.getMonth() + 1)}-${addZeroPad(newMoon.date.getDate())}T00:00:00Z`)
      newMoonDate = new AstroTime(dateInNewMoon)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      if (!sunset) {
        if (formula === 0) {
          if (latitude > 48) observer = observerFromEarth(45, longitude, elevation)
          else observer = observerFromEarth(-45, longitude, elevation)
        } else if (formula === 1) {
          observer = observerFromEarth(meccaCoordinates.latitude, meccaCoordinates.longitude, meccaCoordinates.elevation)
        } else {
          if (latitude > 48) observer = observerFromEarth(48, longitude, elevation)
          else observer = observerFromEarth(-48, longitude, elevation)
        }
        sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      }
      if (newMoon.date < sunset.date) {
        // Met the Wujudul Hilal criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Wujudul Hilal criteria
        return newMoonDate.AddDays(2)
      }
    } while (true)
  } else {
    // Ummul Qura
    do {
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(`${newMoon.date.getFullYear()}-${addZeroPad(newMoon.date.getMonth() + 1)}-${addZeroPad(newMoon.date.getDate())}T00:00:00Z`)
      newMoonDate = new AstroTime(dateInNewMoon)
      observer = observerFromEarth(meccaCoordinates.latitude, meccaCoordinates.longitude, meccaCoordinates.elevation)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      if (newMoon.date < sunset.date) {
        // Met the Ummul Qura criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Ummul Qura criteria
        return newMoonDate.AddDays(2)
      }
    } while (true)      
  }
}

const getCalendarData = (gregorianDate, latitude, longitude, elevation, criteria, fajrAlt, formula, lang) => {
  const newMoonsFromLastYear = []
  const newMoonFromNextYear = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  const startGregorianDate = new Date(`${gregorianDate.getFullYear() + 1}-01-29T23:59:59`)
  let startDate = new AstroTime(startGregorianDate)
  let newMoonDate = gregorianFirstDate
  let currentMoonDate
  let nextMoonDate
  let currentYearDaysOffset = 0
  while (newMoonDate.getFullYear() >= gregorianFirstDate.getFullYear()) {
    // Search New Moon decremental from last gregorian day in current/configured year until first gregorian day or last gregorian day in the previous year
    newMoonDate = calculateNewMoon(startDate, latitude, longitude, elevation, criteria, fajrAlt, formula).date
    if (newMoonDate instanceof Date) {
      if (newMoonDate.getFullYear() <= gregorianFirstDate.getFullYear()) {
        newMoonsFromLastYear.push(newMoonDate)
      }
      newMoonFromNextYear.push(newMoonDate)
      startDate = new AstroTime(newMoonDate)
      startDate = startDate.AddDays(-29)
    }
  }
  const months = Array.from({ length: 12 }).map((_, monthIndex) => {
    // Create month array for gregorian calendar and fill Hijri calendar days default/offset values with zero pad
    const firstDayOfMonth = new Date(gregorianDate.getFullYear(), monthIndex, 1).getDay()
    const daysInMonth = new Date(gregorianDate.getFullYear(), monthIndex + 1, 0).getDate()
    const daysArray = Array.from({ length: firstDayOfMonth }).fill(null)
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({ gregorian: day, hijri: 0 })
    }
    return daysArray
  })
  newMoonsFromLastYear.reverse().forEach(moonDate => {
    let hijriDayCounter = 1
    let nextMoonIndex = 0
    months.forEach((month, monthIdx) => {
      month.forEach(dayObj => {
        if (dayObj !== null) {
          // Fill calculated Hijri calendar days into gregorian calendar
          currentMoonDate = newMoonsFromLastYear[nextMoonIndex]
          nextMoonDate = newMoonsFromLastYear[nextMoonIndex + 1]
          if (dayObj.gregorian === currentMoonDate.getDate() && monthIdx === currentMoonDate.getMonth()) hijriDayCounter = 1
          if (nextMoonDate && dayObj.gregorian === nextMoonDate.getDate() && monthIdx === nextMoonDate.getMonth()) {
            hijriDayCounter = 1
            dayObj.hijri = hijriDayCounter++
            nextMoonIndex++
          } else dayObj.hijri = hijriDayCounter++
        }
      })
    })
    if (moonDate.getFullYear() >= gregorianDate.getFullYear()) {
      // Fill the last Hijri calendar days if hijri date didn't start from 1 January
      hijriDayCounter = 33 - newMoonsFromLastYear[0].getDate()
      currentYearDaysOffset = newMoonsFromLastYear[1].getDate() + gregorianFirstDate.getDay() - 1
      months[0].forEach((dayObj, dayIdx) => {
        if (dayObj !== null && dayIdx < currentYearDaysOffset) {
          dayObj.hijri = hijriDayCounter++
        }
      })
      hijriDayCounter = 1
    }
  })
  const hijriEventDates = getHijriEventDates(gregorianDate, newMoonsFromLastYear, months, lang)
  const hijriStartDates = getHijriStartDates(newMoonFromNextYear.reverse(), lang)
  return { months, hijriEventDates, hijriStartDates }
}

const adjustedIslamicDate = (months, lang) => {
  const currentDate = new Date()
  const gregorian = currentDate.toLocaleDateString(lang || 'en', { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  const time = currentDate.toLocaleTimeString(lang || 'en', { hour: "2-digit", minute: "2-digit", second: "numeric", timeZoneName: "short" })
  const islamicDate = new Date(currentDate)
  const currentFirstMonthGregorianDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const islamicDayNumber = months[currentDate.getMonth()][currentDate.getDate() + currentFirstMonthGregorianDay - 1]?.hijri
  islamicDate.setDate(islamicDate.getDate() + 15 - islamicDayNumber)
  const islamicMonth = islamicDate.toLocaleDateString('en', { calendar: "islamic", month: "numeric" })
  const islamicYear = islamicDate.toLocaleDateString('en', { calendar: "islamic", year: "numeric" })
  return { currentDate, gregorian, islamicDayNumber, islamicMonth, islamicYear, time }
}

const getCitiesByName = (cityData, query) => cityData.filter(data => data.city.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.city.localeCompare(b.city))

const getCitiesDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle
  const earthRadius = 6378.14
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

const getNearestCity = (cityData, latitude, longitude) => {
  let nearestCity = null
  let smallestDistance = Infinity
  cityData.forEach(row => {
    const distance = getCitiesDistance(latitude, longitude, row.lat, row.lng)
    if (distance < smallestDistance) {
      smallestDistance = distance
      nearestCity = row
    }
  })
  return nearestCity
}

const muslimEvents = {
  "1-1": "1-1-event", // 1 Muharram
  "9-1": "9-1-event", // Tasu'a
  "10-1": "10-1-event", // Asyura
  "12-3": "12-3-event", // Maulid Nabi Muhammad
  "27-7": "27-7-event", // Isra Mi'raj
  "15-8": "15-8-event", // Nisfu Sha'ban
  "1-9": "1-9-event", // 1 Ramadan
  "17-9": "17-9-event", // Nuzulul Qur'an
  "1-10": "1-10-event", // Ied Fitr
  "9-12": "9-12-event", // Arafah
  "10-12": "10-12-event", // Ied Adha
}

const hijriStartDates = {
  "1-1": "1-1-date", // 1 Muharram
  "1-2": "1-2-date", // 1 Safar
  "1-3": "1-3-date", // 1 Rabi' I
  "1-4": "1-4-date", // 1 Rabi' II
  "1-5": "1-5-date", // 1 Jumada I
  "1-6": "1-6-date", // 1 Jumada II
  "1-7": "1-7-date", // 1 Rajab
  "1-8": "1-8-date", // 1 Sha'ban
  "1-9": "1-9-date", // 1 Ramadan
  "1-10": "1-10-date", // 1 Shawwal
  "1-11": "1-11-date", // 1 Dhul-Hijjah
  "1-12": "1-12-date", // 1 Dhul-Qa'dah
}

const getHijriEventDates = (gregorianDate, newMoons, months, lang) => {
  const hijriEvents = []
  const filteredUniqueEventDates = new Set()
  let date
  let hijriDateInDay15
  let eventHijriDay = 0
  let hijriMonth = 0
  let hijriYear
  let eventInGregorianDate
  let dateKey
  newMoons.forEach(newMoon => {
    date = new Date(newMoon.getFullYear(), newMoon.getMonth(), newMoon.getDate() + 14)
    hijriDateInDay15 = date.toLocaleDateString(lang || 'en', {
      calendar: "islamic",
      month: "numeric",
      year: "numeric"
    })
    hijriMonth = hijriDateInDay15.split('/')[0]
    hijriYear = hijriDateInDay15.split('/')[1]
    Object.entries(muslimEvents).forEach(([key, eventId]) => {
      const [eventDay, eventMonth] = key.split("-").map(Number)
      // Get Hijri Months from 15th day for each hijri months based built-in Javascript Islamic calendar format, because there are some difference of Hijri day offset for new moon for each Hijri Date criteria calculation
      eventHijriDay = 15 - (15 - eventDay)
      if (eventMonth === parseInt(hijriMonth)) {
        eventInGregorianDate = new Date(newMoon)
        eventInGregorianDate.setDate(newMoon.getDate() + (eventHijriDay - 1))
        months.forEach((month, monthIdx) => {
          month.forEach(dayObj => {
            if (dayObj !== null && dayObj.hijri === eventHijriDay && monthIdx === eventInGregorianDate.getMonth() && eventInGregorianDate.getFullYear() === gregorianDate.getFullYear()) {
              dateKey = eventInGregorianDate.toISOString().split('T')[0]
              // Make sure the Muslim Holiday event date in gregorian date is unique (Preventing pushed twice to event list)
              if (!filteredUniqueEventDates.has(dateKey)) {
                filteredUniqueEventDates.add(dateKey)
                hijriEvents.push({
                  eventId: eventId,
                  hijriDate: {day: eventHijriDay, month: eventMonth, year: hijriYear},
                  gregorianDate: eventInGregorianDate
                })
              }
            }
          })
        })
      }
    })
  })
  return hijriEvents
}

const getHijriStartDates = (newMoons, lang) => {
  const hijriStarts = []
  const filteredUniqueStartDates = new Set()
  let date
  let hijriDateInDay15
  let hijriStartDay = 0
  let hijriMonth = 0
  let hijriYear
  let hijriStartInGregorian
  let dateKey
  newMoons.forEach(newMoon => {
    date = new Date(newMoon.getFullYear(), newMoon.getMonth(), newMoon.getDate() + 14)
    hijriDateInDay15 = date.toLocaleDateString(lang || 'en', {
      calendar: "islamic",
      month: "numeric",
      year: "numeric"
    })
    hijriMonth = hijriDateInDay15.split('/')[0]
    hijriYear = hijriDateInDay15.split('/')[1]
    Object.entries(hijriStartDates).forEach(([key, dateId]) => {
      const [startDay, dateMonth] = key.split("-").map(Number)
      hijriStartDay = 15 - (15 - startDay)
      if (dateMonth === parseInt(hijriMonth)) {
        hijriStartInGregorian = new Date(newMoon)
        hijriStartInGregorian.setDate(newMoon.getDate() + (hijriStartDay - 1))
        dateKey = hijriStartInGregorian.toISOString().split('T')[0]
        if (!filteredUniqueStartDates.has(dateKey)) {
          filteredUniqueStartDates.add(dateKey)
          hijriStarts.push({
            dateId: dateId,
            hijriDate: {day: hijriStartDay, month: dateMonth, year: hijriYear},
            gregorianDate: hijriStartInGregorian
          })
        }
      }
    })
  })
  return hijriStarts
}

const getElementContent = innerHTML => {
  let hijriEvent = ''
  Object.values(muslimEvents).forEach(eventId => {
    if (innerHTML.includes(eventId)) {
      hijriEvent = eventId
    }
  })
  return hijriEvent
}

const getMoonInfos = (gregorianDate, timeZone, latitude, longitude, elevation, lang) => {
  const observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const startDate = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate(), 0, 0, 0)
  const startAstroTime = new AstroTime(startDate)
  const lastNewMoon = SearchMoonPhase(0, astroDate, -30)
  const moonAge = `${(astroDate.ut - lastNewMoon.ut).toFixed(2)} days`
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const phaseAngle = MoonPhase(astroDate).toFixed(2)
  const illuminationPercent = `${(moonIllumination.phase_fraction * 100).toFixed(2)}%`
  const moonEquatorJ2000 = Equator(Body.Moon, astroDate, observer, false, true)
  const moonEquatorOfDate = Equator(Body.Moon, astroDate, observer, true, false)
  const moonRightAscension = `${moonEquatorJ2000.ra.toFixed(2)}°`
  const moonDeclination = `${moonEquatorJ2000.dec.toFixed(2)}°`
  const moonHorizon = Horizon(astroDate, observer, moonEquatorOfDate.ra, moonEquatorOfDate.dec, 'normal')
  const moonAltitude = `${moonHorizon.altitude.toFixed(2)}°`
  const moonAzimuth = `${moonHorizon.azimuth.toFixed(2)}°`
  const geoDistanceAU = moonIllumination.geo_dist
  const distanceInKm = `${(geoDistanceAU * 14959787069098932 / 100000000).toFixed(2)} km`
  const moonEcliptic = EclipticGeoMoon(astroDate)
  const moonLatitude = `${moonEcliptic.lat.toFixed(2)}°`
  const moonLongitude = `${moonEcliptic.lon.toFixed(2)}°`
  const elongation = AngleFromSun(Body.Moon, astroDate)
  const moonElongation = `${elongation.toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, startAstroTime, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, startAstroTime, 1, elevation)
  const nextNewMoon = SearchMoonPhase(0, astroDate, +30)
  const lastNewMoonDateTime = `${lastNewMoon.date.toLocaleDateString(lang || 'en', { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${lastNewMoon.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const nextNewMoonDateTime = `${nextNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${nextNewMoon.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const sunEquator = Equator(Body.Sun, astroDate, observer, true, true)
  const moonIlluminationAngle = convertToDegrees(
    Math.atan2(
      Math.cos(moonEquatorJ2000.dec) * Math.sin(convertToRadians(moonEquatorJ2000.ra - sunEquator.ra)),
      Math.sin(moonEquatorJ2000.dec) * Math.cos(sunEquator.dec) - Math.cos(moonEquatorJ2000.dec) * Math.sin(sunEquator.dec) * Math.cos(convertToRadians(moonEquatorJ2000.ra - sunEquator.ra))
    )
  )
  const sunAltitude = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').altitude
  const sunAzimuth = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').azimuth
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, startAstroTime, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, startAstroTime, 1, elevation)
  return [
    moonAge,
    illuminationPercent,
    `${phaseAngle}°`,
    moonRightAscension,
    moonDeclination,
    moonAltitude,
    moonAzimuth,
    distanceInKm,
    moonLatitude,
    moonLongitude,
    moonElongation,
    moonrise?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    moonset?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    lastNewMoonDateTime,
    nextNewMoonDateTime,
    `${sunAltitude.toFixed(2)}°`,
    `${sunAzimuth.toFixed(2)}°`,
    sunrise?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    sunset?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    `${moonIlluminationAngle.toFixed(2)}°`
  ]
}

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5]

const addTime = (prayerTime, ihtiyath, correction) => {
  const additionalTime = new Date(prayerTime)
  additionalTime.setMinutes(additionalTime.getMinutes() + ihtiyath + correction)
  return additionalTime
}

const setTimeZone = (date, timeZone) => {
  const localeString = date.toLocaleString('en', {
    timeZone: timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  return new Date(Date.parse(localeString))
}

const calculateByAstronomyEngine = (astroDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
  const islamicDate = new Date(astroDate.date)
  let setHijriDay = 0
  const firstDayInGregorianYear = new Date(formattedDateTime.getFullYear(), 0, 1).getDay()
  const firstMonthGregorianDay = new Date(astroDate.date.getFullYear(), astroDate.date.getMonth(), 1).getDay()
  const lastMonthGregorianYear = new Date(formattedDateTime.getFullYear(), 11, 1).getDay()
  if (astroDate.date.getFullYear() < formattedDateTime.getFullYear()) {
    setHijriDay = setMonths[0][firstDayInGregorianYear + 1]?.hijri - (astroDate.date.getDate() - 30)
  } else if (astroDate.date.getFullYear() > formattedDateTime.getFullYear()) {
    setHijriDay = setMonths[11][30 + lastMonthGregorianYear]?.hijri + astroDate.date.getDate()
  } else setHijriDay = setMonths[astroDate.date.getMonth()][astroDate.date.getDate() + firstMonthGregorianDay - 1]?.hijri
  islamicDate.setDate(islamicDate.getDate() + 15 - setHijriDay)
  const islamicMonth = islamicDate.toLocaleDateString('en', { calendar: "islamic", month: "numeric" })
  let observer = observerFromEarth(latitude, longitude, elevation)
  let fajr = null
  let sunrise = null
  let dhuha = null
  let ashr = null
  let maghrib = null
  let isha = null
  let correctedAshrTime = ashr
  let correctedMaghribTime = maghrib
  let correctedIshaTime = isha
  let shadowFactor = 1
  // For Shafii, Maliki, and Hanbali school (Standard)
  if (mahzab === 0) shadowFactor = 1
  // For Hanafi school
  else shadowFactor = 2
  if (Math.abs(latitude) > 48) {
    let setLatitude = latitude
    if (latitude > 48) setLatitude = 48
    else setLatitude = -48
    if (formula === 0) {
      // Follow ±45 degrees latitude
      let higherLat = latitude
      if (latitude > 48) higherLat = 45
      else higherLat = -45
      observer = observerFromEarth(higherLat, longitude, elevation)
      fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
      }
      correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
      isha = new Date(correctedMaghribTime)
      correctedIshaTime = isha
      if (isNaN(sunAlt.isha)) {
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            // Set fixed Isha'a Time for Ummul Qura Convention in Ramadhan into 120 minutes from array position = 2 ["90 mins", "120 mins"]
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
      }
      const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      const cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(higherLat - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else if (formula === 1) {
      // Follow mecca coordinates
      observer = observerFromEarth(meccaCoordinates.latitude, meccaCoordinates.longitude, meccaCoordinates.elevation)
      fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
      }
      correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
      isha = new Date(correctedMaghribTime)
      correctedIshaTime = isha
      if (isNaN(sunAlt.isha)) {
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
      }
      const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      const cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(meccaCoordinates.latitude - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else if (formula === 2) {
      // Middle of the night
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
      if (!sunrise) {
        // If the Sun is not rising, we use lower latitude instead returning null values
        sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
        if (!maghrib) {
          // If Maghrib/the Sun never set, we use lower latitude instead returning null values
          maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
        }
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
        if (!maghrib) {
          maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
        }
      }
      const nightDuration = sunrise.AddDays(1).date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration / 2
      fajr = new AstroTime(new Date(fajrTime))
      correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        const ishaTime = maghrib.date.getTime() + nightDuration / 2
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        // If the Ashr sun altitude never happens, we use lower latitude instead returning null values
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else if (formula === 3) {
      // One-seventh of the night
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
      if (!sunrise) {
        sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
        if (!maghrib) {
          maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
        }
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
        if (!maghrib) {
          maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
        }
      }
      const nightDuration = sunrise.AddDays(1).date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration / 7
      fajr = new AstroTime(new Date(fajrTime))
      correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        const ishaTime = maghrib.date.getTime() + nightDuration / 7
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else {
      // Angle-based method
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
      if (!sunrise) {
        sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
        if (!maghrib) {
          maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
        }
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
        if (!maghrib) {
          maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
        }
      }
      const nightDuration = sunrise.AddDays(1).date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration * sunAlt.fajr / 60
      fajr = new AstroTime(new Date(fajrTime))
      correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        const ishaTime = maghrib.date.getTime() + nightDuration * sunAlt.isha / 60
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    }
  } else {
    fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
    sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
    if (isNaN(sunAlt?.maghrib)) {
      maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
    } else {
      maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
    }
    correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
    isha = new Date(correctedMaghribTime)
    correctedIshaTime = isha
    if (isNaN(sunAlt.isha)) {
      if (Array.isArray(sunAlt.isha)) {
        if (parseInt(islamicMonth) === 9) {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
          correctedIshaTime = isha
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
          correctedIshaTime = isha
        }
      } else {
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      }
    } else {
      isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
      correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
    }
    const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
    const cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
    const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
    const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
    ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
    correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  }
  if (dhuhaMethod === 0) {
    // Calculate Dhuha time based Sun altitude
    dhuha = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, inputSunAlt).date
  } else {
    // Calculate Dhuha Time based Sunrise time
    dhuha = addTime(sunrise.date, inputMins, 0)
  }
  const correctedFajrTime = setTimeZone(addTime(fajr.date, ihtiyath, corrections[1]), timeZone)
  const imsakTime = addTime(correctedFajrTime, -10, 0)
  const correctedSunrise = setTimeZone(addTime(sunrise.date, -ihtiyath, 0), timeZone)
  const correctedDhuhaTime = setTimeZone(addTime(dhuha, ihtiyath, 0), timeZone)
  const dhuhr = SearchHourAngle(Body.Sun, observer, 0, astroDate, 1).time
  const dhuhrDescendCorrection = 1
  const correctedDhuhrTime = setTimeZone(addTime(dhuhr.date, ihtiyath + dhuhrDescendCorrection, corrections[4]), timeZone)
  correctedAshrTime = setTimeZone(correctedAshrTime, timeZone)
  correctedMaghribTime = setTimeZone(correctedMaghribTime, timeZone)
  correctedIshaTime = setTimeZone(correctedIshaTime, timeZone)
  return [ imsakTime, correctedFajrTime, correctedSunrise, correctedDhuhaTime, correctedDhuhrTime, correctedAshrTime, correctedMaghribTime, correctedIshaTime ]
}

const convertToRadians = degrees => degrees * Math.PI / 180

const convertToDegrees = radians => radians * 180 / Math.PI

const parseDate = (gregorianDate, hours, minutes, seconds) => new Date(
  gregorianDate.getFullYear(),
  gregorianDate.getMonth(),
  gregorianDate.getDate(),
  hours,
  minutes,
  seconds
)

const kaabaCoordinates = { latitude: 21.42250833, longitude: 39.82616111 }

const getQiblaDirection = (latitude, longitude) => {
  const deltaLongitude = kaabaCoordinates.longitude - longitude
  const yAxis = Math.sin(convertToRadians(deltaLongitude))
  const xAxis = Math.cos(convertToRadians(latitude)) * Math.tan(convertToRadians(kaabaCoordinates.latitude)) - Math.sin(convertToRadians(latitude)) * Math.cos(convertToRadians(deltaLongitude))
  const qiblaAngle = Math.atan2(yAxis, xAxis)
  const qiblaDirection = convertToDegrees(qiblaAngle)
  return ((360 + qiblaDirection) % 360).toFixed(2)
}

const calculateManually = (gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
  const islamicDate = new Date(gregorianDate)
  let setHijriDay = 0
  const firstDayInGregorianYear = new Date(formattedDateTime.getFullYear(), 0, 1).getDay()
  const firstMonthGregorianDay = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), 1).getDay()
  const lastMonthGregorianYear = new Date(formattedDateTime.getFullYear(), 11, 1).getDay()
  if (gregorianDate.getFullYear() < formattedDateTime.getFullYear()) {
    setHijriDay = setMonths[0][firstDayInGregorianYear + 1]?.hijri - (gregorianDate.getDate() - 30)
  } else if (gregorianDate.getFullYear() > formattedDateTime.getFullYear()) {
    setHijriDay = setMonths[11][30 + lastMonthGregorianYear]?.hijri + gregorianDate.getDate()
  } else setHijriDay = setMonths[gregorianDate.getMonth()][gregorianDate.getDate() + firstMonthGregorianDay - 1]?.hijri
  islamicDate.setDate(islamicDate.getDate() + 15 - setHijriDay)
  const islamicMonth = islamicDate.toLocaleDateString('en', { calendar: "islamic", month: "numeric" })
  let fajrHourAngle = null
  let sunriseHourAngle = null
  let cotSunAltitudeAshr = null
  let ashrHourAngle = null
  let maghribHourAngle = null
  let ishaHourAngle = null
  let fajrTime = null
  let sunriseTime = null
  let ashrTime = null
  let maghribTime = null
  let ishaTime = null
  let fajr = null
  let sunrise = null
  let dhuha = null
  let ashr = null
  let maghrib = null
  let isha = null
  let correctedMaghribTime = maghrib
  let correctedIshaTime = isha
  let shadowFactor = 1
  if (mahzab === 0) shadowFactor = 1
  else shadowFactor = 2
  let year = gregorianDate.getFullYear()
  let month = gregorianDate.getMonth() + 1
  const day = gregorianDate.getDate()
  const hours = gregorianDate.getHours()
  const mins = gregorianDate.getMinutes()
  const secs = gregorianDate.getSeconds()
  if (month <= 2) {
    month += 12
    year -= 1
  }
  let b = 0
  if (year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day > 14)))) {
    const a = Math.floor(year / 100)
    b = 2 + Math.floor(a / 4) - a
  }
  const julianDay = 1720994.5 + Math.floor(365.25 * year) + Math.floor(30.6001 * (month + 1)) + b + day + ((hours * 3600 + mins * 60 + secs) / 86400)
  const dateAngle = 2 * Math.PI * (julianDay - 2451545) / 365.25
  const sunDeclination = 0.37877 + 23.264 * Math.sin(convertToRadians(57.297 * dateAngle - 79.547)) + 0.3812 * Math.sin(convertToRadians(2 * 57.297 * dateAngle - 82.682)) + 0.17132 * Math.sin(convertToRadians(3 * 57.297 * dateAngle - 59.722))
  const u = (julianDay - 2451545) / 36525
  const sunLongitude = 280.46607 + 36000.7698 * u
  const sunLongitudeInRad = convertToRadians(sunLongitude)
  const equationOfTime = (-(1789 + 237 * u) * Math.sin(sunLongitudeInRad) - (7146 - 62 * u) * Math.cos(sunLongitudeInRad) + (9934 - 14 * u) * Math.sin(2 * sunLongitudeInRad) - (29 + 5 * u) * Math.cos(2 * sunLongitudeInRad) + (74 + 10 * u) * Math.sin(3 * sunLongitudeInRad) + (320 - 4 * u) * Math.cos(3 * sunLongitudeInRad) - 212 * Math.sin(4 * sunLongitudeInRad)) / 1000
  const transitTime = 12 - getTimeZoneDiff() - longitude / 15 - equationOfTime / 60
  const sunriseAltitude = -5/6 - 0.0347 * Math.sqrt(elevation)
  if (Math.abs(latitude) > 48) {
    let setLatitude = latitude
    if (latitude > 48) setLatitude = 48
    else setLatitude = -48
    if (formula === 0) {
      let higherLat = latitude
      if (latitude > 48) higherLat = 45
      else higherLat = -45
      fajrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.fajr)) - Math.sin(convertToRadians(higherLat)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(higherLat)) * Math.cos(convertToRadians(sunDeclination)))))
      fajrTime = transitTime - fajrHourAngle / 15
      const fajrHours = parseInt(fajrTime)
      const fajrMinutes = (fajrTime - fajrHours) * 60
      const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
      fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
      sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(higherLat)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(higherLat)) * Math.cos(convertToRadians(sunDeclination)))))
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(higherLat - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(higherLat)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(higherLat)) * Math.cos(convertToRadians(sunDeclination)))))
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(higherLat)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(higherLat)) * Math.cos(convertToRadians(sunDeclination)))))
        maghribTime = transitTime + maghribHourAngle / 15
      }
      const maghribHours = parseInt(maghribTime)
      const maghribMinutes = (maghribTime - maghribHours) * 60
      const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
      maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
      correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        isha = new Date(correctedMaghribTime)
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        ishaHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.isha)) - Math.sin(convertToRadians(higherLat)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(higherLat)) * Math.cos(convertToRadians(sunDeclination)))))
        ishaTime = transitTime + ishaHourAngle / 15
        const ishaHours = parseInt(ishaTime)
        const ishaMinutes = (ishaTime - ishaHours) * 60
        const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
        isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 1) {
      fajrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.fajr)) - Math.sin(convertToRadians(meccaCoordinates.latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(meccaCoordinates.latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      fajrTime = transitTime - fajrHourAngle / 15
      const fajrHours = parseInt(fajrTime)
      const fajrMinutes = (fajrTime - fajrHours) * 60
      const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
      fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
      sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(meccaCoordinates.latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(meccaCoordinates.latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(meccaCoordinates.latitude - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(meccaCoordinates.latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(meccaCoordinates.latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(meccaCoordinates.latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(meccaCoordinates.latitude)) * Math.cos(convertToRadians(sunDeclination)))))
        maghribTime = transitTime + maghribHourAngle / 15
      }
      const maghribHours = parseInt(maghribTime)
      const maghribMinutes = (maghribTime - maghribHours) * 60
      const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
      maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
      correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        isha = new Date(correctedMaghribTime)
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        ishaHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.isha)) - Math.sin(convertToRadians(meccaCoordinates.latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(meccaCoordinates.latitude)) * Math.cos(convertToRadians(sunDeclination)))))
        ishaTime = transitTime + ishaHourAngle / 15
        const ishaHours = parseInt(ishaTime)
        const ishaMinutes = (ishaTime - ishaHours) * 60
        const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
        isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 2) {
      sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!sunriseHourAngle) {
        sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))
      }
      cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))        
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
        maghribTime = transitTime + maghribHourAngle / 15
      }
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      sunrise = sunrise.setDate(sunrise.getDate() + 1)
      const maghribHours = parseInt(maghribTime)
      const maghribMinutes = (maghribTime - maghribHours) * 60
      const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
      maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
      const sunriseDate = new Date(sunrise)
      sunriseDate.setDate(sunriseDate.getDate() + 1)
      const nightDuration = sunriseDate - maghrib
      const fajrTime = sunriseDate.getTime() - nightDuration / 2
      fajr = new Date(fajrTime)
      correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        isha = new Date(correctedMaghribTime)
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        const ishaTime = maghrib.getTime() + nightDuration / 2
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 3) {
      sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!sunriseHourAngle) {
        sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))
      }
      cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))        
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
        maghribTime = transitTime + maghribHourAngle / 15
      }
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      const maghribHours = parseInt(maghribTime)
      const maghribMinutes = (maghribTime - maghribHours) * 60
      const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
      maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
      const sunriseDate = new Date(sunrise)
      sunriseDate.setDate(sunriseDate.getDate() + 1)
      const nightDuration = sunriseDate - maghrib
      const fajrTime = sunriseDate.getTime() - nightDuration / 7
      fajr = new Date(fajrTime)
      correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        isha = new Date(correctedMaghribTime)
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        const ishaTime = maghrib.getTime() + nightDuration / 7
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else {
      sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!sunriseHourAngle) {
        sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))
      }
      cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
      ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(setLatitude - sunDeclination))) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
        ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(setLatitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(setLatitude)) * Math.cos(convertToRadians(sunDeclination)))))
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
        maghribTime = transitTime + maghribHourAngle / 15
      }
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      const maghribHours = parseInt(maghribTime)
      const maghribMinutes = (maghribTime - maghribHours) * 60
      const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
      maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
      const sunriseDate = new Date(sunrise)
      sunriseDate.setDate(sunriseDate.getDate() + 1)
      const nightDuration = sunriseDate - maghrib
      const fajrTime = sunriseDate.getTime() - nightDuration * sunAlt.fajr / 60
      fajr = new Date(fajrTime)
      correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
      if (isNaN(sunAlt.isha)) {
        isha = new Date(correctedMaghribTime)
        if (Array.isArray(sunAlt.isha)) {
          if (parseInt(islamicMonth) === 9) {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
            correctedIshaTime = isha
          } else {
            isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
            correctedIshaTime = isha
          }
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
          correctedIshaTime = isha
        }
      } else {
        const ishaTime = maghrib.getTime() + nightDuration * sunAlt.isha / 60
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }      
    }
  } else {
    fajrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.fajr)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
    fajrTime = transitTime - fajrHourAngle / 15
    const fajrHours = parseInt(fajrTime)
    const fajrMinutes = (fajrTime - fajrHours) * 60
    const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
    fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
    sunriseHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(sunriseAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
    sunriseTime = transitTime - sunriseHourAngle / 15
    const sunriseHours = parseInt(sunriseTime)
    const sunriseMinutes = (sunriseTime - sunriseHours) * 60
    const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
    sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
    cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunDeclination))) + shadowFactor
    const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
    const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
    ashrHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(ashrSunAltitude)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
    if (isNaN(sunAlt?.maghrib)) {
      maghribTime = transitTime + sunriseHourAngle / 15
    } else {
      maghribHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.maghrib)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      maghribTime = transitTime + maghribHourAngle / 15
    }
    const maghribHours = parseInt(maghribTime)
    const maghribMinutes = (maghribTime - maghribHours) * 60
    const maghribSeconds = (maghribMinutes - parseInt(maghribMinutes)) * 60
    maghrib = parseDate(gregorianDate, maghribHours, maghribMinutes, maghribSeconds)
    correctedMaghribTime = addTime(maghrib, ihtiyath, corrections[6])
    if (isNaN(sunAlt.isha)) {
      isha = new Date(correctedMaghribTime)
      if (Array.isArray(sunAlt.isha)) {
        if (parseInt(islamicMonth) === 9) {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[1]))
          correctedIshaTime = isha
        } else {
          isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha[0]))
          correctedIshaTime = isha
        }
      } else {
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      }
    } else {
      ishaHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(-sunAlt.isha)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
      ishaTime = transitTime + ishaHourAngle / 15
      const ishaHours = parseInt(ishaTime)
      const ishaMinutes = (ishaTime - ishaHours) * 60
      const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
      isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
      correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
    }
  }
  const dhuhrDescendCorrection = 1
  const dhuhrHours = parseInt(transitTime)
  const dhuhrMinutes = (transitTime - dhuhrHours) * 60
  const dhuhrSeconds = (dhuhrMinutes - parseInt(dhuhrMinutes)) * 60
  const dhuhrDate = parseDate(gregorianDate, dhuhrHours, dhuhrMinutes + dhuhrDescendCorrection, dhuhrSeconds)
  ashrTime = transitTime + ashrHourAngle / 15
  const ashrHours = parseInt(ashrTime)
  const ashrMinutes = (ashrTime - ashrHours) * 60
  const ashrSeconds = (ashrMinutes - parseInt(ashrMinutes)) * 60
  ashr = parseDate(gregorianDate, ashrHours, ashrMinutes, ashrSeconds)
  if (dhuhaMethod === 0) {
    const dhuhaHourAngle = convertToDegrees(Math.acos((Math.sin(convertToRadians(inputSunAlt)) - Math.sin(convertToRadians(latitude)) * Math.sin(convertToRadians(sunDeclination))) / (Math.cos(convertToRadians(latitude)) * Math.cos(convertToRadians(sunDeclination)))))
    const dhuhaTime = transitTime - dhuhaHourAngle / 15
    const dhuhaHours = parseInt(dhuhaTime)
    const dhuhaMinutes = (dhuhaTime - dhuhaHours) * 60
    const dhuhaSeconds = (dhuhaMinutes - parseInt(dhuhaMinutes)) * 60
    dhuha = parseDate(gregorianDate, dhuhaHours, dhuhaMinutes, dhuhaSeconds)
  } else dhuha = addTime(sunrise, inputMins, 0)
  const correctedFajrTime = setTimeZone(addTime(fajr, ihtiyath, corrections[1]), timeZone)
  const imsakTime = addTime(correctedFajrTime, -10, 0)
  const correctedSunrise = setTimeZone(addTime(sunrise, -ihtiyath, 0), timeZone)
  const correctedDhuhaTime = setTimeZone(addTime(dhuha, ihtiyath, 0), timeZone)
  const correctedDhuhrTime = setTimeZone(addTime(dhuhrDate, ihtiyath, corrections[4]), timeZone)
  const correctedAshrTime = setTimeZone(addTime(ashr, ihtiyath, corrections[5]), timeZone)
  correctedMaghribTime = setTimeZone(correctedMaghribTime, timeZone)
  correctedIshaTime = setTimeZone(correctedIshaTime, timeZone)
  return [ imsakTime, correctedFajrTime, correctedSunrise, correctedDhuhaTime, correctedDhuhrTime, correctedAshrTime, correctedMaghribTime, correctedIshaTime ]
}

const getPrayerTimes = (gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, calculationMethod, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
  const startDate = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate())
  let calculatedPrayerTimes = {}
  if (calculationMethod === 0) {
    const astroDate = new AstroTime(startDate)
    // Calculate Using Astronomy-Engine Library
    calculatedPrayerTimes = calculateByAstronomyEngine(astroDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  } else {
    // Calculate Manually by Prayer Times Equation
    calculatedPrayerTimes = calculateManually(gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  }
  return calculatedPrayerTimes
}

const getSunInfos = (gregorianDate, timeZone, latitude, longitude, elevation, mahzab, lang) => {
  let shadowFactor = 1
  if (mahzab === 0) shadowFactor = 1
  else shadowFactor = 2
  const observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const startDate = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate(), 0, 0, 0)
  const startAstroTime = new AstroTime(startDate)
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, startAstroTime, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, startAstroTime, 1, elevation)
  const sunEquator = Equator(Body.Sun, astroDate, observer, true, true)
  const sunAltitude = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').altitude
  const sunAzimuth = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').azimuth
  const sunRightAscension = `${sunEquator.ra.toFixed(2)}°`
  const sunDeclination = `${sunEquator.dec.toFixed(2)}°`
  const sunLatittude = SunPosition(astroDate).elat
  const sunLongitude = SunPosition(astroDate).elon
  const culmination = SearchHourAngle(Body.Sun, observer, 0, startAstroTime, 1).time
  const sunEquatorAtCulmination = Equator(Body.Sun, culmination, observer, true, true)
  const sunDeclinationAtCulmination = sunEquatorAtCulmination.dec
  const culminationSunAltitude = 90 - Math.abs(observer.latitude - sunDeclinationAtCulmination)
  const cotSunAltitudeAshr = Math.tan(convertToRadians(Math.abs(latitude - sunEquator.dec))) + shadowFactor
  const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  const ashrSunAltitude = convertToDegrees(Math.atan(tanSunAltitudeAshr))
  const midnight = SearchHourAngle(Body.Sun, observer, 12, startAstroTime, 2).time
  const sunEquatorAtMidnight = Equator(Body.Sun, midnight, observer, true, true)
  const sunDeclinationAtMidnight = sunEquatorAtMidnight.dec
  const midnightSunAltitude = -(90 - Math.abs(- observer.latitude - sunDeclinationAtMidnight))
  const moonPhase = MoonPhase(astroDate).toFixed(2)
  const moonStatus = moonPhase <= 90 ? 'Waxing Crescent' : moonPhase <= 180 ? 'Waxing Gibbous' : moonPhase <= 270 ? 'Waning Gibbous' : 'Waning Crescent'
  const moonEquatorJ2000 = Equator(Body.Moon, astroDate, observer, false, true)
  const moonDeclinationJ2000 = `${moonEquatorJ2000.dec.toFixed(2)}°`
  const moonEquatorOfDate = Equator(Body.Moon, astroDate, observer, true, false)
  const moonHorizon = Horizon(astroDate, observer, moonEquatorOfDate.ra, moonEquatorOfDate.dec, 'normal')
  const moonAltitude = `${moonHorizon.altitude.toFixed(2)}°`
  const moonAzimuth = `${moonHorizon.azimuth.toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, startAstroTime, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, startAstroTime, 1, elevation)
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const illuminationPercent = moonIllumination.phase_fraction * 100
  const moonIlluminationAngle = convertToDegrees(
    Math.atan2(
      Math.cos(moonEquatorJ2000.dec) * Math.sin(moonEquatorJ2000.ra - sunEquator.ra),
      Math.sin(moonEquatorJ2000.dec) * Math.cos(sunEquator.ra) - Math.cos(moonEquatorJ2000.dec) * Math.sin(sunEquator.dec) * Math.cos(moonEquatorJ2000.ra - sunEquator.ra)
    )
  )
  return [
    sunrise?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    sunset?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    `${sunAltitude.toFixed(2)}°`,
    `${sunAzimuth.toFixed(2)}°`,
    sunRightAscension,
    sunDeclination,
    `${sunLatittude}°`,
    `${sunLongitude.toFixed(2)}°`,
    `${culmination.date.toLocaleString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':')}`,
    `${midnight.date.toLocaleString(lang || 'en', { day: "2-digit", month: "long", year: "numeric", weekday: "long", hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./gm, ':')}`,
    `${moonPhase}° (${moonStatus})`,
    moonAltitude,
    moonAzimuth,
    moonDeclinationJ2000,
    moonrise?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    moonset?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    illuminationPercent,
    culmination.date,
    `${culminationSunAltitude.toFixed(2)}°`,
    `${ashrSunAltitude.toFixed(2)}°`,
    `${midnightSunAltitude.toFixed(2)}°`,
    `${moonIlluminationAngle.toFixed(2)}°`
  ]
}

const calculateVisibilityYallop = (arcv, w, lagTime, newMoon) => {
  const q = (arcv - (11.8371 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))) / 10
  let zone = 'F'
  let color = ''
  if (q > 0.216 && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (q > -0.014 && lagTime > 0) {
    zone = 'B'
    color = '#9EFF00'
  } else if (q > -0.160 && lagTime > 0) {
    zone = 'C'
    color = '#FF783C'
  } else if (q > -0.232 && lagTime > 0) {
    zone = 'D'
    color = '#FF0000'
  } else if (q > -0.293 && lagTime > 0) {
    zone = 'E'
    color = '#B50757'
  } else if (newMoon) {
    zone = 'H'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'G'
    color = '#808080'
  }
  return { q, zone, color }
}

const calculateVisibilityOdeh = (arcv, w, lagTime, newMoon) => {
  const visibilityValue = arcv - (7.1651 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))
  let zone = 'D'
  let color = ''
  if (visibilityValue >= 5.65 && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (visibilityValue >= 2.0 && lagTime > 0) {
    zone = 'B'
    color = '#9EFF00'
  } else if (visibilityValue >= -0.96 && lagTime > 0) {
    zone = 'C'
    color = '#FF783C'
  } else if (newMoon) {
    zone = 'F'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'E'
    color = '#808080'
  }
  return { visibilityValue, zone, color }
}

const calculateVisibilityQureshi = (arcv, w, lagTime, newMoon) => {
  const s = (arcv - 10.4341759 + 5.42264313 * w - 0.2222075057 * Math.pow(w, 2) + 0.3519637 * Math.pow(w, 3)) / 10
  let zone = 'F'
  let color = ''
  if (s >= 0.15 && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (s >= 0.05 && lagTime > 0) {
    zone = 'B'
    color = '#9EFF00'
  } else if (s >= -0.06 && lagTime > 0) {
    zone = 'C'
    color = '#FF783C'
  } else if (s >= -0.16 && lagTime > 0) {
    zone = 'D'
    color = '#FF0000'
  } else if (newMoon) {
    zone = 'H'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'G'
    color = '#808080'
  }
  return { s, zone, color }
}

const calculateVisibilityLAPAN = (isMeetCriteria, lagTime, newMoon) => {
  let zone = 'B'
  let color = ''
  if (isMeetCriteria && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (newMoon) {
    zone = 'D'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'C'
    color = '#808080'
  }
  return { isMeetCriteria, zone, color }
}

const calculateVisibilityShaukat = (arcv, areEqualsToValues, w, lagTime, newMoon) => {
  const q = (arcv - (11.8371 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))) / 10
  let zone = 'F'
  let color = ''
  if (q >= 0.122 && lagTime > 0 && !areEqualsToValues) {
    zone = 'A'
    color = '#00FF3E'
  } else if (q >= -0.15 && lagTime > 0 && !areEqualsToValues) {
    zone = 'B'
    color = '#9EFF00'
  } else if (q >= -0.32 && lagTime > 0 && !areEqualsToValues) {
    zone = 'C'
    color = '#FF783C'
  } else if (q >= -0.59 && lagTime > 0 && !areEqualsToValues) {
    zone = 'D'
    color = '#FF0000'
  } else if (q >= -0.59 && lagTime > 0 && areEqualsToValues && lagTime > 0) {
    zone = 'E'
    color = '#FAFF00'
  } else if (newMoon) {
    zone = 'H'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'G'
    color = '#808080'
  }
  return { q, zone, color }
}

const calculateVisibilityTurkey = (isMeetCriteria, lagTime, newMoon) => {
  let zone = 'B'
  let color = ''
  if (isMeetCriteria && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (newMoon) {
    zone = 'D'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'C'
    color = '#808080'
  }
  return { isMeetCriteria, zone, color }
}

const calculateVisibilityMABIMS = (isMeetCriteria, lagTime, newMoon) => {
  let zone = 'B'
  let color = ''
  if (isMeetCriteria && lagTime > 0) {
    zone = 'A'
    color = '#00FF3E'
  } else if (newMoon) {
    zone = 'D'
    color = '#000000'
  } else if (lagTime < 0) {
    zone = 'C'
    color = '#808080'
  }
  return { isMeetCriteria, zone, color }
}

const checkYallop = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const moonElongationEvent = Elongation(Body.Moon, bestTime).elongation
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(convertToRadians(moonHorizon.altitude)) * Math.sin(convertToRadians(lunarParallax / 60)))
  const arcl = convertToRadians(moonElongationEvent)
  const geomoon = GeoVector(Body.Moon, bestTime, true)
  const geosun = GeoVector(Body.Sun, bestTime, true)
  const rot = Rotation_EQJ_EQD(bestTime)
  const rotmoon = RotateVector(rot, geomoon)
  const rotsun = RotateVector(rot, geosun)
  const meq = EquatorFromVector(rotmoon)
  const seq = EquatorFromVector(rotsun)
  const mhor = Horizon(bestTime, observer, meq.ra, meq.dec, 'normal')
  const shor = Horizon(bestTime, observer, seq.ra, seq.dec, 'normal')
  const arcv = mhor.altitude - shor.altitude
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcl))
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityYallop(arcv, wTopocentric, lagTime, newMoon)
}

const checkOdeh = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, "normal")
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, "normal")
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(convertToRadians(moonHorizon.altitude)) * Math.sin(convertToRadians(lunarParallax / 60)))
  const arcl = convertToRadians(moonElongationTopocentric)
  const daz = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcl) / Math.cos(convertToRadians(daz))
  let arcv
  if (-1 <= cosARCV <= 1) {
    arcv = convertToDegrees(Math.acos(cosARCV))
  } else if (cosARCV < -1) {
    arcv = convertToDegrees(Math.acos(-1))
  } else {
    arcv = convertToDegrees(Math.acos(1))
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcl))
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityOdeh(arcv, wTopocentric, lagTime, newMoon)
}

const checkQureshi = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, "normal")
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(convertToRadians(moonHorizon.altitude)) * Math.sin(convertToRadians(lunarParallax / 60)))
  const arcl = convertToRadians(moonElongationTopocentric)
  const daz = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcl) / Math.cos(convertToRadians(daz))
  let arcv
  if (-1 <= cosARCV <= 1) {
    arcv = convertToDegrees(Math.acos(cosARCV))
  } else if (cosARCV < -1) {
    arcv = convertToDegrees(Math.acos(-1))
  } else {
    arcv = convertToDegrees(Math.acos(1))
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcl))
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityQureshi(arcv, wTopocentric, lagTime, newMoon)
}

const checkLAPAN = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, "normal")
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  const moonElongation = AngleBetween(sunEquator.vec, moonEquator.vec)
  let isMeetCriteria = false
  if (moonElongation > 6.4 && moonHorizon.altitude > 4) isMeetCriteria = true
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityLAPAN(isMeetCriteria, lagTime, newMoon)
}

const checkShaukat = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, "normal")
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, "normal")
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(convertToRadians(moonHorizon.altitude)) * Math.sin(convertToRadians(lunarParallax / 60)))
  const arcl = convertToRadians(moonElongationTopocentric)
  const daz = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcl) / Math.cos(convertToRadians(daz))
  let arcv
  if (-1 <= cosARCV <= 1) {
    arcv = convertToDegrees(Math.acos(cosARCV))
  } else if (cosARCV < -1) {
    arcv = convertToDegrees(Math.acos(-1))
  } else {
    arcv = convertToDegrees(Math.acos(1))
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcl))
  const moonElongationGeocentric = Elongation(Body.Moon, sunset).elongation
  let areEqualsToValues = false
  if (moonElongationGeocentric > 7.95 && moonElongationGeocentric < 8.05) areEqualsToValues = true
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityShaukat(arcv, areEqualsToValues, wTopocentric, lagTime, newMoon)
}

const checkTurkey = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, "normal")
  const moonElongation = Elongation(Body.Moon, sunset).elongation
  let isMeetCriteria = false
  if (moonElongation >= 8 && moonHorizon.altitude >= 5) isMeetCriteria = true
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityTurkey(isMeetCriteria, lagTime, newMoon)
}

const checkMABIMS = (astroDate, latitude, longitude) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, "normal")
  const moonElongation = Elongation(Body.Moon, sunset).elongation
  let isMeetCriteria = false
  if (moonElongation >= 6.4 && moonHorizon.altitude >= 3) isMeetCriteria = true
  const newMoon = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityMABIMS(isMeetCriteria, lagTime, newMoon)
}

const createZones = (criteria, astroDate, lat, lng, steps) => {
  let result
  if (criteria === 0) {
    result = checkYallop(astroDate, lat, lng, steps)
  } else if (criteria === 1) {
    result = checkOdeh(astroDate, lat, lng, steps)
  } else if (criteria === 2) {
    result = checkQureshi(astroDate, lat, lng, steps)
  } else if (criteria === 3) {
    result = checkLAPAN(astroDate, lat, lng, steps)
  } else if (criteria === 4) {
    result = checkShaukat(astroDate, lat, lng, steps)
  } else if (criteria === 5) {
    result = checkTurkey(astroDate, lat, lng, steps)
  } else {
    result = checkMABIMS(astroDate, lat, lng, steps)
  }
  const width = steps * 100 / 360
  const height = steps * 100 / 180
  const xPosition = 100 * (180 + lng) / 360
  const yPosition = 100 * (90 - lat) / 180
  if (result?.zone?.length > 0) {
    return {
      width,
      height,
      yPos: yPosition,
      xPos: xPosition,
      zone: result.zone,
      color: result.color
    }
  }
}

const gridSearchLongitude = (astroDate, criteria, steps) => {
  let results = []
  for (let lng = -180; lng < 180; lng += steps) {
    for (let lat = 60; lat >= -60; lat -= steps) {
      const result = createZones(criteria, astroDate, lat, lng, steps)
      if (result?.zone?.length > 0) {
        results.push(result)
      }
    }
  }
  return results
}

const addZeroPad = value => (value >= 0 && value < 10) ? `0${value}` : value

const getMoonCrescentVisibility = (ijtimaDate, criteria, steps) => {
  const startDate = new Date(`${ijtimaDate.getFullYear()}-${addZeroPad(ijtimaDate.getMonth() + 1)}-${addZeroPad(ijtimaDate.getDate())}T00:00:00Z`)
  const astroDate = MakeTime(startDate)
  const conjunctionDate = new Date(ijtimaDate.setDate(ijtimaDate.getDate() - 2))
  const conjunction = SearchMoonPhase(0, conjunctionDate, 5)
  return {
    zoneCoordinates: gridSearchLongitude(astroDate, criteria, steps),
    conjunction: conjunction?.date
  }
}

const coordinateScale = {
  latitudes: [60, 30, 0, -30, -60],
  longitudes: [150, 120, 90, 60, 30, 0, -30, -60, -90, -120, -150]
}

export { isStorageExist, pages, getTimeZoneList, getCalendarData, adjustedIslamicDate, getCitiesByName, getNearestCity, getElementContent, getMoonInfos, getQiblaDirection, prayerTimesCorrection, getPrayerTimes, getSunInfos, addZeroPad, getMoonCrescentVisibility, coordinateScale }