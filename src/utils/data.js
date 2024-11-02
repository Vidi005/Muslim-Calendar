import { AngleFromSun, AstroTime, Body, EclipticGeoMoon, Elongation, Equator, Horizon, Illumination, MoonPhase, Observer, SearchMoonPhase, SearchRiseSet } from "astronomy-engine"
import Swal from "sweetalert2"

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
const sabangCoordinates = { latitude: 5.894, longitude: 95.316, elevation: 43 }

const observerFromEarth = (latitude, longitude, elevation) => new Observer(latitude, longitude, elevation)

const calculateNewMoon = (startDate, latitude, longitude, elevation, criteria, formula, errMsg) => {
  try {
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
        newMoon = SearchMoonPhase(0, date, -30)
        date = new AstroTime(newMoon.date)
        dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
        newMoonDate = new AstroTime(dateInNewMoon)
        eastObserver = observerFromEarth(0, 135, elevation)
        westObserver = observerFromEarth(0, -120, elevation)
        fajr = SearchRiseSet(Body.Sun, eastObserver, -13, newMoonDate, 1, elevation)
        sunset = SearchRiseSet(Body.Sun, westObserver, -1, newMoonDate, 1, elevation)
        if (!sunset) {
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
          return newMoonDate.AddDays(1)
        } else if (newMoonDate.date < fajr.date) {
          return newMoonDate.AddDays(1)
        } else {
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
          return newMoonDate.AddDays(1)
        } else {
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
          return newMoonDate.AddDays(1)
        } else {
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
          return newMoonDate.AddDays(1)
        } else {
          return newMoonDate.AddDays(2)
        }
      } while (true)      
    }
  } catch (error) {
    Swal.fire({
      title: errMsg.title,
      text: errMsg.text,
      icon: 'error',
      confirmButtonColor: 'blue'
    })
    return new AstroTime(new Date(0))
  }
}

const getCalendarData = (gregorianDate, latitude, longitude, elevation, criteria, formula, lang, errMsg) => {
  const newMoons = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  const startGregorianDate = new Date(`${gregorianDate.getFullYear()}-12-31T23:59:59`)
  let startDate = new AstroTime(startGregorianDate)
  let newMoonDate = gregorianFirstDate
  let currentMoonDate
  let nextMoonDate
  let currentYearDaysOffset = 0
  while (newMoonDate.getFullYear() >= gregorianFirstDate.getFullYear()) {
    newMoonDate = calculateNewMoon(startDate, latitude, longitude, elevation, criteria, formula, errMsg).date
    if (newMoonDate instanceof Date) {
      newMoons.push(newMoonDate)
      startDate = new AstroTime(newMoonDate)
      startDate = startDate.AddDays(-29)
    }
  }
  const months = Array.from({ length: 12 }).map((_, monthIndex) => {
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

const muslimEvents = {
  "1-1": "1-1-event", // 1 Muharram
  "9-1": "9-1-event", // Tasu'a
  "10-1": "10-1-event", // Asyura
  "12-3": "12-3-event", // Maulid
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
  let date
  let eventHijriDay = 0
  let hijriMonth = 0
  let hijriYear
  newMoons.forEach(newMoon => {
    date = new Date(newMoon.getFullYear(), newMoon.getMonth(), newMoon.getDate() + 14)
    const hijriDate = date.toLocaleDateString(lang, {
      calendar: "islamic",
      month: "numeric",
      year: "numeric"
    })
    Object.entries(muslimEvents).forEach(([key, eventId]) => {
      const [eventDay, eventMonth] = key.split("-").map(Number)
      eventHijriDay = 15 - (15 - eventDay)
      hijriMonth = hijriDate.split('/')[0]
      hijriYear = hijriDate.split('/')[1]
      if (eventMonth === parseInt(hijriMonth)) {
        months.forEach((month, monthIdx) => {
          month.forEach(dayObj => {
            if (dayObj !== null && dayObj.hijri === eventHijriDay && monthIdx === newMoon.getMonth() && newMoon.getFullYear() === gregorianDate.getFullYear()) {
              hijriEvents.push({
                eventId: eventId,
                hijriDate: {day: eventHijriDay, month: eventMonth, year: hijriYear},
                gregorianDate: new Date(`${gregorianDate.getFullYear()}-${newMoon.getMonth() + 1}-${dayObj.gregorian}`)
              })
            }
          })
        })
      }
    })
  })
  return hijriEvents
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

const getMoonInfos = (gregorianDate, timeZone, latitude, longitude, elevation, lang) => {
  const observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const lastNewMoon = SearchMoonPhase(0, astroDate, -30)
  const moonAge = `${(astroDate.ut - lastNewMoon.ut).toFixed(2)} days`
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const phaseAngle = MoonPhase(astroDate).toFixed(2)
  const illuminationPercent = `${(moonIllumination.phase_fraction * 100).toFixed(2)}%`
  const moonEquatorJ2000 = Equator(Body.Moon, astroDate, observer, false, true)
  const moonEquatorOfDate = Equator(Body.Moon, astroDate, observer, true, true)
  const moonDeclination = `${moonEquatorJ2000.dec.toFixed(2)}°`
  const moonRightAscension = `${moonEquatorJ2000.ra.toFixed(2)}°`
  const moonEcliptic = EclipticGeoMoon(astroDate)
  const moonLatitude = `${moonEcliptic.lat.toFixed(2)}°`
  const moonLongitude = `${moonEcliptic.lon.toFixed(2)}°`
  const moonHorizon = Horizon(astroDate, observer, moonEquatorOfDate.ra, moonEquatorOfDate.dec, 'normal')
  const moonAltitude = `${moonHorizon.altitude.toFixed(2)}°`
  const moonAzimuth = `${moonHorizon.azimuth.toFixed(2)}°`
  const geoDistanceAU = moonIllumination.geo_dist
  const distanceInKm = `${(geoDistanceAU * 1495978707 / 10).toFixed(2)} km`
  const elongation = AngleFromSun(Body.Moon, astroDate)
  const moonElongation = `${elongation.toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, astroDate, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, astroDate, 1, elevation)
  const nextNewMoon = SearchMoonPhase(0, astroDate, +30)
  const lastNewMoonDateTime = `${lastNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${lastNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZone: timeZone })}`
  const nextNewMoonDateTime = `${nextNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric", timeZone: timeZone })} ${nextNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZone: timeZone })}`
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation)
  return [
    moonAge,
    illuminationPercent,
    `${phaseAngle}°`,
    moonDeclination,
    moonRightAscension,
    moonLatitude,
    moonLongitude,
    moonAltitude,
    moonAzimuth,
    distanceInKm,
    moonElongation,
    moonrise?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    moonset?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    lastNewMoonDateTime,
    nextNewMoonDateTime,
    sunrise?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--',
    sunset?.date?.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short", timeZone: timeZone }) || '--:--'
  ]
}

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5]

export { isStorageExist, pages, getTimeZoneList, getCalendarData, adjustedIslamicDate, getMoonInfos, prayerTimesCorrection }