import { AngleFromSun, AstroTime, Body, Elongation, Equator, Horizon, MakeTime, MoonPhase, Observer, SearchMoonPhase, SearchRiseSet } from "astronomy-engine"

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

const isMabimbsCompliant = (latitude, longitude, elevation, newMoonDate) => {
  const observer = new Observer(latitude, longitude, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 30, elevation)
  const newMoonTime = new AstroTime(newMoonDate)
  const sunsetTime = new AstroTime(sunset.date)
  const moonEquator = Equator(Body.Moon, newMoonTime, observer, true, true)
  const moonHorizon = Horizon(sunsetTime, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const elongation = AngleFromSun(Body.Moon, newMoonTime)
  return moonHorizon.altitude > 3 && elongation < 6.4
}

const isKHGTCompliant = (latitude, longitude, elevation, newMoonDate) => {
  const observer = new Observer(latitude, longitude, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 30, elevation)
  const newMoonTime = new AstroTime(newMoonDate)
  return newMoonTime.tt < sunset.tt
}

const getHijriYear = newMoonDate => new Date(newMoonDate).getFullYear() - 622

const getHijriMonth = daysSinceNewMoon => daysSinceNewMoon < 29 ? 1 : 2

const calculateNextHijriDate = (newMoonDate, latitude, longitude, elevation, criteria) => {
  const newMoonTime = new AstroTime(newMoonDate)
  const nextNewMoon = SearchMoonPhase(0, newMoonTime, 30)
  const nextNewMoonDate = new Date(nextNewMoon.tt * 86400000)
  return calculateHijriDate(nextNewMoonDate, latitude, longitude, elevation, criteria)
}

const calculateHijriDate = (gregorianDate, latitude, longitude, elevation, criteria) => {
  const astroTime = new AstroTime(gregorianDate)
  const newMoonEvent = SearchMoonPhase(0, astroTime, -30)
  const newMoonDate = new Date(newMoonEvent.tt * 86400000 - 68.184 * 3600000)
  if (criteria === '0') {
    if (!isMabimbsCompliant(latitude, longitude, elevation, newMoonDate)) {
      return calculateNextHijriDate(newMoonDate, latitude, longitude, elevation, criteria)
    }
  } else {
    if (!isKHGTCompliant(latitude, longitude, elevation, newMoonDate)) {
      return calculateNextHijriDate(newMoonDate, latitude, longitude, elevation, criteria)
    }
  }
  const daysSinceNewMoon = Math.floor((gregorianDate - newMoonDate) / 86400000)
  const hijriYear = getHijriYear(newMoonDate)
  const hijriMonth = getHijriMonth(daysSinceNewMoon)
  const hijriDay = daysSinceNewMoon + 1
  return { hijriYear, hijriMonth, hijriDay }
}

// function getHijriDate(gregorianDate, latitude, longitude, elevation, criteria) {
//   const moonPhase = MoonPhase(gregorianDate)
//   const elongationInfo = Elongation(Body.Moon, gregorianDate)
//   const elongationDeg = elongationInfo.elongation
//   const dateStart = new AstroTime(gregorianDate)
//   const newMoonEvent = SearchMoonPhase(0, dateStart, 30)
//   const newMoonTime = new AstroTime(newMoonEvent)
//   const newMoonDate = newMoonEvent.date
//   const observer = new Observer(latitude, longitude, elevation)
//   const sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 30, elevation)
//   const sunsetTime = sunset.date
//   let hijriMonthStart = newMoonDate
//   if (criteria === '0') {
//       const moonPosition = Equator(Body.Moon, sunset, observer, true, true)
//       const horizonCoordinates = Horizon(sunsetTime, observer, moonPosition.ra, moonPosition.dec, 'normal')
//       const moonAltitude = horizonCoordinates.altitude
//       const moonElongation = Elongation(Body.Moon, sunsetTime)
//       // MABIMS criteria: altitude >= 3 degrees and elongation >= 6.4 degrees
//       if (moonAltitude < 3 && moonElongation < 6.4) {
//           hijriMonthStart.setDate(hijriMonthStart.getDate() + 1)
//       }
//   } else if (criteria === '1') {
//       // For KHGT, the new moon must occur before sunset on the same day
//       if (newMoonDate > sunsetTime) {
//           hijriMonthStart.setDate(hijriMonthStart.getDate() + 1)
//       }
//   }
//   const daysSinceHijriStart = Math.floor((gregorianDate - hijriMonthStart))
//   const hijriDay = daysSinceHijriStart + 1
//   return { hijriMonthStart, hijriDay }
// }

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

export { isStorageExist, pages, calculateHijriDate, prayerTimesCorrection }