import { AngleFromSun, AstroTime, Body, EclipticGeoMoon, Elongation, Equator, Horizon, Illumination, MoonPhase, Observer, SearchAltitude, SearchHourAngle, SearchMoonPhase, SearchRiseSet } from "astronomy-engine"

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
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      eastObserver = observerFromEarth(0, 135, elevation)
      westObserver = observerFromEarth(0, -120, elevation)
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
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      observer = observerFromEarth(sabangCoordinates.latitude, sabangCoordinates.longitude, sabangCoordinates.elevation)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      moonElongation = Elongation(Body.Moon, sunset)
      moonEquator = Equator(Body.Moon, sunset, observer, true, true)
      moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, 'normal')
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
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
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
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
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
  const newMoons = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  const startGregorianDate = new Date(`${gregorianDate.getFullYear()}-12-31T23:59:59`)
  let startDate = new AstroTime(startGregorianDate)
  let newMoonDate = gregorianFirstDate
  let currentMoonDate
  let nextMoonDate
  let currentYearDaysOffset = 0
  while (newMoonDate.getFullYear() >= gregorianFirstDate.getFullYear()) {
    // Search New Moon decremental from last gregorian day in current/configured year until first gregorian day or last gregorian day in the previous year
    newMoonDate = calculateNewMoon(startDate, latitude, longitude, elevation, criteria, fajrAlt, formula).date
    if (newMoonDate instanceof Date) {
      newMoons.push(newMoonDate)
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
  newMoons.reverse().forEach(moonDate => {
    let hijriDayCounter = 1
    let nextMoonIndex = 0
    months.forEach((month, monthIdx) => {
      month.forEach(dayObj => {
        if (dayObj !== null) {
          // Fill calculated Hijri calendar days into gregorian calendar
          currentMoonDate = newMoons[nextMoonIndex]
          nextMoonDate = newMoons[nextMoonIndex + 1]
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
      hijriDayCounter = 33 - newMoons[0].getDate()
      currentYearDaysOffset = newMoons[1].getDate() + gregorianFirstDate.getDay() - 1
      months[0].forEach((dayObj, dayIdx) => {
        if (dayObj !== null && dayIdx < currentYearDaysOffset) {
          dayObj.hijri = hijriDayCounter++
        }
      })
      hijriDayCounter = 1
    }
  })
  const hijriEventDates = getHijriEventDates(gregorianDate, newMoons, months, lang)
  return { months, hijriEventDates }
}

const adjustedIslamicDate = (currentDate, months) => {
  const islamicDate = new Date()
  const islamicDay = currentDate.getDate()
  const fixedDaysInMonth = currentDate.toLocaleDateString('en', { calendar: "islamic", day: "numeric" })
  const calculatedDaysInMonth = months[currentDate.getMonth() + 1][currentDate.getDate() - 1]?.hijri
  if (fixedDaysInMonth !== calculatedDaysInMonth) {
    islamicDate.setDate(islamicDay + (calculatedDaysInMonth - fixedDaysInMonth))
  }
  return islamicDate
}

const getCitiesByName = (cityData, query) => cityData.filter(data => data.city.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.city.localeCompare(b.city))

const getCitiesDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
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
    hijriDateInDay15 = date.toLocaleDateString(lang, {
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
  const distanceInKm = `${(geoDistanceAU * 1495978707 / 10).toFixed(2)} km`
  const moonEcliptic = EclipticGeoMoon(astroDate)
  const moonLatitude = `${moonEcliptic.lat.toFixed(2)}°`
  const moonLongitude = `${moonEcliptic.lon.toFixed(2)}°`
  const elongation = AngleFromSun(Body.Moon, astroDate)
  const moonElongation = `${elongation.toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, astroDate, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, astroDate, 1, elevation)
  const nextNewMoon = SearchMoonPhase(0, astroDate, +30)
  const lastNewMoonDateTime = `${lastNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${lastNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZone: timeZone })}`
  const nextNewMoonDateTime = `${nextNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${nextNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZone: timeZone })}`
  const sunEquator = Equator(Body.Sun, astroDate, observer, true, true)
  const sunAltitude = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').altitude
  const sunAzimuth = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').azimuth
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
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
    moonrise?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    moonset?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    lastNewMoonDateTime,
    nextNewMoonDateTime,
    `${sunAltitude.toFixed(2)}°`,
    `${sunAzimuth.toFixed(2)}°`,
    sunrise?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    sunset?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--'
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

const calculateByAstronomyEngine = (astroDate, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
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
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
      }
      const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      const cotSunAltitudeAshr = Math.tan(Math.abs(higherLat - sunDeclination) * Math.PI / 180) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
      }
      const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      const cotSunAltitudeAshr = Math.tan(Math.abs(meccaCoordinates.latitude - sunDeclination) * Math.PI / 180) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      } else {
        const ishaTime = maghrib.date.getTime() + nightDuration / 2
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        // If the Ashr sun altitude never happens, we use lower latitude instead returning null values
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      } else {
        const ishaTime = maghrib.date.getTime() + nightDuration / 7
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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
        isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
        correctedIshaTime = isha
      } else {
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
        const ishaTime = maghrib.date.getTime() + nightDuration * sunAlt.isha / 60
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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
      isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
      correctedIshaTime = isha
    } else {
      isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
      correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
    }
    const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
    const cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
    const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
    const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
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

const calculateManually = (gregorianDate, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
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
  const sunDeclination = 0.37877 + 23.264 * Math.sin(57.297 * dateAngle - 79.547) + 0.3812 * Math.sin(2 * 57.297 * dateAngle - 82.682) + 0.17132 * Math.sin(3 * 57.297 * dateAngle - 59.722)
  const u = (julianDay - 2451545) / 36525
  const sunLongitude = 280.46607 + 36000.7698 * u
  const equationOfTime = (-(1789 + 237 * u) * Math.sin(sunLongitude) - (7146 - 62 * u) * Math.cos(sunLongitude) + (9934 - 14 * u) * Math.sin(2 * sunLongitude) - (29 + 5 * u) * Math.cos(2 * sunLongitude) + (74 + 10 * u) * Math.sin(3 * sunLongitude) + (320 - 4 * u) * Math.cos(3 * sunLongitude) - 212 * Math.sin(4 * sunLongitude)) / 1000
  const transiTime = 24 - longitude / 15 - equationOfTime / 15
  const sunriseAltitude = -(5/6) - 0.0347 * Math.sqrt(elevation)
  const fajrHourAngle = Math.acos(Math.sin(-sunAlt.fajr) - Math.sin(latitude) * Math.sin(sunDeclination)) / (Math.cos(latitude) * Math.cos(sunDeclination))
  const sunriseHourAngle = Math.acos(Math.sin(sunriseAltitude) - Math.sin(latitude) * Math.sin(sunDeclination)) / (Math.cos(latitude) * Math.cos(sunDeclination))
  const cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
  const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  const ashrHourAngle = Math.acos(Math.sin(ashrSunAltitude) - Math.sin(latitude) * Math.sin(sunDeclination)) / (Math.cos(latitude) * Math.cos(sunDeclination))
  const ishaHourAngle = Math.acos(Math.sin(-sunAlt.isha) - Math.sin(latitude) * Math.sin(sunDeclination)) / (Math.cos(latitude) * Math.cos(sunDeclination))
  fajr = transiTime - fajrHourAngle / 15
  const fajrHours = Math.floor(fajr / 60)
  const fajrMinutes = Math.floor(fajr % 60)
  const fajrSeconds = Math.round((fajr % 1) * 60)
  const fajrDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    fajrHours,
    fajrMinutes,
    fajrSeconds
  )
  sunrise = transiTime - sunriseHourAngle / 15
  const sunriseHours = Math.floor(sunrise / 60)
  const sunriseMinutes = Math.floor(sunrise % 60)
  const sunriseSeconds = Math.round((sunrise % 1) * 60)
  const sunriseDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    sunriseHours,
    sunriseMinutes,
    sunriseSeconds
  )
  const dhuhrDescendCorrection = 1
  const dhuhr = transiTime + dhuhrDescendCorrection
  const dhuhrHours = Math.floor(dhuhr / 60)
  const dhuhrMinutes = Math.floor(dhuhr % 60)
  const dhuhrSeconds = Math.round((dhuhr % 1) * 60)
  const dhuhrDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    dhuhrHours,
    dhuhrMinutes,
    dhuhrSeconds
  )
  ashr = transiTime + ashrHourAngle / 15
  const ashrHours = Math.floor(ashr / 60)
  const ashrMinutes = Math.floor(ashr % 60)
  const ashrSeconds = Math.round((ashr % 1) * 60)
  const ashrDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    ashrHours,
    ashrMinutes,
    ashrSeconds
  )
  maghrib = transiTime + sunriseHourAngle / 15
  const maghribHours = Math.floor(maghrib / 60)
  const maghribMinutes = Math.floor(maghrib % 60)
  const maghribSeconds = Math.round((maghrib % 1) * 60)
  const maghribDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    maghribHours,
    maghribMinutes,
    maghribSeconds
  )
  isha = transiTime + ishaHourAngle / 15
  const ishaHours = Math.floor(isha / 60)
  const ishaMinutes = Math.floor(isha % 60)
  const ishaSeconds = Math.round((isha % 1) * 60)
  const ishaDate = new Date(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth(),
    gregorianDate.getDate(),
    ishaHours,
    ishaMinutes,
    ishaSeconds
  )
  // if (Math.abs(latitude) > 48) {
  //   let setLatitude = latitude
  //   if (latitude > 48) setLatitude = 48
  //   else setLatitude = -48
  //   if (formula === 0) {
  //     // Follow ±45 degrees latitude
  //     let higherLat = latitude
  //     if (latitude > 48) higherLat = 45
  //     else higherLat = -45
  //     observer = observerFromEarth(higherLat, longitude, elevation)
  //     fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
  //     sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //     if (isNaN(sunAlt?.maghrib)) {
  //       maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //     } else {
  //       maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //     }
  //     correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //     isha = new Date(correctedMaghribTime)
  //     correctedIshaTime = isha
  //     if (isNaN(sunAlt.isha)) {
  //       isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //       correctedIshaTime = isha
  //     } else {
  //       isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
  //       correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
  //     }
  //     const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //     const cotSunAltitudeAshr = Math.tan(Math.abs(higherLat - sunDeclination) * Math.PI / 180) + shadowFactor
  //     const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //     const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //     ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //     correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  //   } else if (formula === 1) {
  //     // Follow mecca coordinates
  //     observer = observerFromEarth(meccaCoordinates.latitude, meccaCoordinates.longitude, meccaCoordinates.elevation)
  //     fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
  //     sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //     if (isNaN(sunAlt?.maghrib)) {
  //       maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //     } else {
  //       maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //     }
  //     correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //     isha = new Date(correctedMaghribTime)
  //     correctedIshaTime = isha
  //     if (isNaN(sunAlt.isha)) {
  //       isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //       correctedIshaTime = isha
  //     } else {
  //       isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
  //       correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
  //     }
  //     const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //     const cotSunAltitudeAshr = Math.tan(Math.abs(meccaCoordinates.latitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //     const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //     const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //     ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //     correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  //   } else if (formula === 2) {
  //     // Middle of the night
  //     sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //     if (!sunrise) {
  //       // If the Sun is not rising, we use lower latitude instead returning null values
  //       sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
  //     }
  //     if (isNaN(sunAlt?.maghrib)) {
  //       maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //       if (!maghrib) {
  //         // If Maghrib/the Sun never set, we use lower latitude instead returning null values
  //         maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
  //       }
  //     } else {
  //       maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //       if (!maghrib) {
  //         maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
  //       }
  //     }
  //     const nightDuration = sunrise.AddDays(1).date - maghrib.date
  //     const fajrTime = sunrise.date.getTime() - nightDuration / 2
  //     fajr = new AstroTime(new Date(fajrTime))
  //     correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //     if (isNaN(sunAlt.isha)) {
  //       isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //       correctedIshaTime = isha
  //     } else {
  //       const ishaTime = maghrib.date.getTime() + nightDuration / 2
  //       isha = new Date(ishaTime)
  //       correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
  //     }
  //     let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //     let cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //     let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //     let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //     ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //     if (!ashr) {
  //       // If the Ashr sun altitude never happens, we use lower latitude instead returning null values
  //       sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
  //       cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //       tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //       ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //       ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
  //     }
  //     correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  //   } else if (formula === 3) {
  //     // One-seventh of the night
  //     sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //     if (!sunrise) {
  //       sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
  //     }
  //     if (isNaN(sunAlt?.maghrib)) {
  //       maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //       if (!maghrib) {
  //         maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
  //       }
  //     } else {
  //       maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //       if (!maghrib) {
  //         maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
  //       }
  //     }
  //     const nightDuration = sunrise.AddDays(1).date - maghrib.date
  //     const fajrTime = sunrise.date.getTime() - nightDuration / 7
  //     fajr = new AstroTime(new Date(fajrTime))
  //     correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //     if (isNaN(sunAlt.isha)) {
  //       isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //       correctedIshaTime = isha
  //     } else {
  //       const ishaTime = maghrib.date.getTime() + nightDuration / 7
  //       isha = new Date(ishaTime)
  //       correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
  //     }
  //     let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //     let cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //     let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //     let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //     ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //     if (!ashr) {
  //       sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
  //       cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //       tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //       ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //       ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
  //     }
  //     correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  //   } else {
  //     // Angle-based method
  //     sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //     if (!sunrise) {
  //       sunrise = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), +1, astroDate, 1, elevation)
  //     }
  //     if (isNaN(sunAlt?.maghrib)) {
  //       maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //       if (!maghrib) {
  //         maghrib = SearchRiseSet(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, elevation)
  //       }
  //     } else {
  //       maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //       if (!maghrib) {
  //         maghrib = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, -sunAlt.maghrib)
  //       }
  //     }
  //     const nightDuration = sunrise.AddDays(1).date - maghrib.date
  //     const fajrTime = sunrise.date.getTime() - nightDuration * sunAlt.fajr / 60
  //     fajr = new AstroTime(new Date(fajrTime))
  //     correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //     if (isNaN(sunAlt.isha)) {
  //       isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //       correctedIshaTime = isha
  //     } else {
  //       isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
  //       const ishaTime = maghrib.date.getTime() + nightDuration * sunAlt.isha / 60
  //       isha = new Date(ishaTime)
  //       correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
  //     }
  //     let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //     let cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //     let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //     let ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //     ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //     if (!ashr) {
  //       sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
  //       cotSunAltitudeAshr = Math.tan(Math.abs(setLatitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //       tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //       ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //       ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
  //     }
  //     correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  //   }
  // } else {
  //   fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr)
  //   sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  //   if (isNaN(sunAlt?.maghrib)) {
  //     maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  //   } else {
  //     maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib)
  //   }
  //   correctedMaghribTime = addTime(maghrib.date, ihtiyath, corrections[6])
  //   isha = new Date(correctedMaghribTime)
  //   correctedIshaTime = isha
  //   if (isNaN(sunAlt.isha)) {
  //     isha.setMinutes(correctedMaghribTime.getMinutes() + parseInt(sunAlt.isha))
  //     correctedIshaTime = isha
  //   } else {
  //     isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha)
  //     correctedIshaTime = addTime(isha.date, ihtiyath, corrections[7])
  //   }
  //   const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
  //   const cotSunAltitudeAshr = Math.tan(Math.abs(latitude - sunDeclination) * Math.PI / 180) + shadowFactor
  //   const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  //   const ashrSunAltitude = Math.atan(tanSunAltitudeAshr) * 180 / Math.PI
  //   ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
  //   correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
  // }
  // if (dhuhaMethod === 0) {
  //   // Calculate Dhuha time based Sun altitude
  //   dhuha = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, inputSunAlt).date
  // } else {
  //   // Calculate Dhuha Time based Sunrise time
  //   dhuha = addTime(sunrise.date, inputMins, 0)
  // }
  // const correctedFajrTime = setTimeZone(addTime(fajr.date, ihtiyath, corrections[1]), timeZone)
  // const imsakTime = addTime(correctedFajrTime, -10, 0)
  // const correctedSunrise = setTimeZone(addTime(sunrise.date, -ihtiyath, 0), timeZone)
  // const correctedDhuhaTime = setTimeZone(addTime(dhuha, ihtiyath, 0), timeZone)
  // const dhuhr = SearchHourAngle(Body.Sun, observer, 0, astroDate, 1).time
  // const dhuhrDescendCorrection = 1
  // const correctedDhuhrTime = setTimeZone(addTime(dhuhr.date, ihtiyath + dhuhrDescendCorrection, corrections[4]), timeZone)
  // correctedAshrTime = setTimeZone(correctedAshrTime, timeZone)
  // correctedMaghribTime = setTimeZone(correctedMaghribTime, timeZone)
  // correctedIshaTime = setTimeZone(correctedIshaTime, timeZone)
  // return [ imsakTime, correctedFajrTime, correctedSunrise, correctedDhuhaTime, correctedDhuhrTime, correctedAshrTime, correctedMaghribTime, correctedIshaTime ]
  // return [ fajrDate.setMinutes(fajrDate.getMinutes() - 10), fajrDate, sunriseDate, sunriseDate.setMinutes(sunriseDate.getMinutes() + 18), dhuhrDate, ashrDate, maghribDate, ishaDate ]
  return []
}

const getPrayerTimes = (gregorianDate, latitude, longitude, elevation, timeZone, calculationMethod, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
  const startDate = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate())
  let calculatedPrayerTimes = {}
  if (calculationMethod === 0) {
    const astroDate = new AstroTime(startDate)
    // Calculate Using Astronomy-Engine Library
    calculatedPrayerTimes = calculateByAstronomyEngine(astroDate, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  } else {
    // Calculate Manually by Prayer Times Equation
    calculatedPrayerTimes = calculateManually(gregorianDate, latitude, longitude, elevation, timeZone, mahzab, sunAlt, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  }
  return calculatedPrayerTimes
}

export { isStorageExist, pages, getTimeZoneList, getCalendarData, adjustedIslamicDate, getCitiesByName, getNearestCity, getElementContent, getMoonInfos, prayerTimesCorrection, getPrayerTimes }