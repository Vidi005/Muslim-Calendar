import { AngleFromSun, AstroTime, Body, Elongation, Equator, Horizon, Illumination, Observer, SearchMoonPhase, SearchRiseSet } from "astronomy-engine"
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

const makkahCoordinates = { latitude: 21.4224779, longitude: 39.8251832, elevation: 302 }

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
    if (criteria === '0') {
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
          if (formula === '0') {
            if (latitude > 48) westObserver = observerFromEarth(45, longitude, elevation)
            else westObserver = observerFromEarth(-45, longitude, elevation)
          } else if (formula === '1') {
            westObserver = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
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
          return newMoonDate
        } else if (newMoonDate.date < fajr.date) {
          return newMoonDate
        } else {
          return newMoonDate.AddDays(1)
        }
      }
    } else if (criteria === '1') {
      while (true) {
        newMoon = SearchMoonPhase(0, date, -30)
        date = new AstroTime(newMoon.date)
        dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
        newMoonDate = new AstroTime(dateInNewMoon)
        sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
        if (!sunset) {
          if (formula === '0') {
            if (latitude > 48) observer = observerFromEarth(45, longitude, elevation)
            else observer = observerFromEarth(-45, longitude, elevation)
          } else if (formula === '1') {
            observer = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
          } else {
            if (latitude > 48) observer = observerFromEarth(48, longitude, elevation)
            else observer = observerFromEarth(-48, longitude, elevation)
          }
          sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
        }
        moonElongation = Elongation(Body.Moon, sunset)
        moonEquator = Equator(Body.Moon, sunset, observer, true, true)
        moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, 'normal')
        if (moonElongation.elongation >= 6.4 && moonHorizon.altitude >= 3) {
          return newMoonDate
        } else {
          return newMoonDate.AddDays(1)
        }
      }
    } else if (criteria === '2') {
      do {
        newMoon = SearchMoonPhase(0, date, -30)
        date = new AstroTime(newMoon.date)
        dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
        newMoonDate = new AstroTime(dateInNewMoon)
        sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
        if (!sunset) {
          if (formula === '0') {
            if (latitude > 48) observer = observerFromEarth(45, longitude, elevation)
            else observer = observerFromEarth(-45, longitude, elevation)
          } else if (formula === '1') {
            observer = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
          } else {
            if (latitude > 48) observer = observerFromEarth(48, longitude, elevation)
            else observer = observerFromEarth(-48, longitude, elevation)
          }
          sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
        }
        if (newMoon.date < sunset.date) {
          return newMoonDate
        } else {
          return newMoonDate.AddDays(1)
        }
      } while (true)
    } else {
      do {
        newMoon = SearchMoonPhase(0, date, -30)
        date = new AstroTime(newMoon.date)
        dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
        newMoonDate = new AstroTime(dateInNewMoon)
        observer = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
        sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
        if (newMoon.date < sunset.date) {
          return newMoonDate
        } else {
          return newMoonDate.AddDays(1)
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

const getCalendarData = (gregorianDate, latitude, longitude, elevation, criteria, formula, errMsg) => {
  const newMoons = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  const startGregorianDate = new Date(`${gregorianDate.getFullYear()}-12-31T23:59:59`)
  let startDate = new AstroTime(startGregorianDate)
  let newMoonDate = gregorianFirstDate
  while (newMoonDate.getFullYear() >= gregorianFirstDate.getFullYear()) {
    newMoonDate = new Date(calculateNewMoon(startDate, latitude, longitude, elevation, criteria, formula, errMsg).date)
    if (newMoonDate instanceof Date) {
      newMoons.push(newMoonDate)
      startDate = new AstroTime(newMoonDate)
      startDate = startDate.AddDays(-28)
    }
  }
  const months = Array.from({ length: 12 }).map((_, monthIndex) => {
    const firstDayOfMonth = new Date(gregorianDate.getFullYear(), monthIndex, 1).getDay()
    const daysInMonth = new Date(gregorianDate.getFullYear(), monthIndex + 1, 0).getDate()
    const daysArray = Array.from({ length: firstDayOfMonth }).fill(null)
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({
        gregorian: day,
        hijri: 0
      })
    }
    return daysArray
  })
  newMoons.reverse().forEach(moonDate => {
    let hijriDayCounter = 1
    let nextMoonIndex = 0
    months.forEach((month, monthIdx) => {
      month.forEach(dayObj => {
        if (dayObj !== null) {
          const currentMoonDate = newMoons[nextMoonIndex]
          const nextMoonDate = newMoons[nextMoonIndex + 1]
          if (dayObj.gregorian === currentMoonDate.getDate() && monthIdx === currentMoonDate.getMonth()) {
            hijriDayCounter = 1
          }
          dayObj.hijri = hijriDayCounter++
          if (nextMoonDate && dayObj.gregorian === nextMoonDate.getDate() && monthIdx === nextMoonDate.getMonth()) {
            hijriDayCounter = 1
            nextMoonIndex++
          }
        }
      })
    })
    if (moonDate.getFullYear() >= gregorianDate.getFullYear()) {
      const lastYearDaysOffset = (gregorianFirstDate - newMoons[0]) / 86400000
      hijriDayCounter = lastYearDaysOffset
      const currentYearDaysOffset = (newMoons[1] - gregorianFirstDate) / 86400000
      months[0].forEach((dayObj, dayIdx) => {
        if (dayObj !== null && dayIdx <= currentYearDaysOffset) {
          dayObj.hijri = hijriDayCounter++
        }
      })
      hijriDayCounter = 1
    }
  })
  return months
}

const adjustedIslamicDate = (currentDate, months) => {
  const islamicDate = new Date()
  const islamicDay = currentDate.getDate()
  const fixedDaysInMonth = currentDate.toLocaleDateString('en', { calendar: "islamic", day: "numeric" })
  const calculatedDaysInMonth = months[currentDate.getMonth()][currentDate.getDate() + 1].hijri
  if (fixedDaysInMonth !== calculatedDaysInMonth) {
    islamicDate.setDate(islamicDay + (calculatedDaysInMonth - fixedDaysInMonth))
  }
  return islamicDate
}

const getMoonInfos = (gregorianDate, latitude, longitude, elevation, formula, lang) => {
  let observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const lastNewMoon = SearchMoonPhase(0, astroDate, -30)
  const moonAge = `${(astroDate.ut - lastNewMoon.ut).toFixed(2)} days`
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const phaseAngle = `${moonIllumination.phase_angle.toFixed(2)}°`
  const illuminationPercent = `${(moonIllumination.phase_fraction * 100).toFixed(2)}%`
  const moonEquator = Equator(Body.Moon, astroDate, observer, true, true)
  const moonLatitude = `${moonEquator.dec.toFixed(2)}°`
  const moonLongitude = `${moonEquator.ra.toFixed(2)}°`
  const moonHorizon = Horizon(astroDate, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const moonAltitude = `${moonHorizon.altitude.toFixed(2)}°`
  const moonAzimuth = `${moonHorizon.azimuth.toFixed(2)}°`
  const geoDistanceAU = moonIllumination.geo_dist
  const distanceInKm = `${(geoDistanceAU * 149597870.7).toFixed(2)} km`
  const elongation = AngleFromSun(Body.Moon, astroDate)
  const moonElongation = `${elongation.toFixed(2)}°`
  let moonRise = SearchRiseSet(Body.Moon, observer, +1, astroDate, 1, elevation)
  let moonSet = SearchRiseSet(Body.Moon, observer, -1, astroDate, 1, elevation)
  const nextNewMoon = SearchMoonPhase(0, astroDate, +30)
  if (!moonRise) {
    if (formula === '0') {
      if (latitude > 48) observer = observerFromEarth(45, longitude, elevation)
      else observer = observerFromEarth(-45, longitude, elevation)
    } else if (formula === '1') {
      observer = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
    } else {
      if (latitude > 48) observer = observerFromEarth(48, longitude, elevation)
      else observer = observerFromEarth(-48, longitude, elevation)
    }
    moonRise = SearchRiseSet(Body.Moon, observer, +1, astroDate, 1, elevation)
  }
  if (!moonSet) {
    if (formula === '0') {
      if (latitude > 48) observer = observerFromEarth(45, longitude, elevation)
      else observer = observerFromEarth(-45, longitude, elevation)
    } else if (formula === '1') {
      observer = observerFromEarth(makkahCoordinates.latitude, makkahCoordinates.longitude, makkahCoordinates.elevation)
    } else {
      if (latitude > 48) observer = observerFromEarth(48, longitude, elevation)
      else observer = observerFromEarth(-48, longitude, elevation)
    }
    moonSet = SearchRiseSet(Body.Moon, observer, -1, astroDate, 1, elevation)
  }
  const lastNewMoonDateTime = `${lastNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric" })} ${lastNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric" })}`
  const nextNewMoonDateTime = `${nextNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "numeric", day: "numeric" })} ${nextNewMoon.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric" })}`
  return [
    moonAge,
    illuminationPercent,
    phaseAngle,
    moonLatitude,
    moonLongitude,
    moonAltitude,
    moonAzimuth,
    distanceInKm,
    moonElongation,
    moonRise.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short" }),
    moonSet.date.toLocaleTimeString(lang, { hour: "numeric", hourCycle: "h24", minute: "numeric", timeZoneName: "short" }),
    lastNewMoonDateTime,
    nextNewMoonDateTime
  ]
}

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

export { isStorageExist, pages, getCalendarData, adjustedIslamicDate, getMoonInfos, prayerTimesCorrection }