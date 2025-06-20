import { AngleBetween, AngleFromSun, AstroTime, Body, DEG2RAD, Elongation, Equator, EquatorFromVector, GeoVector, HOUR2RAD, Horizon, HourAngle, Illumination, KM_PER_AU, Libration, MakeTime, MoonPhase, Observer, RAD2DEG, RotateVector, Rotation_EQJ_EQD, SearchAltitude, SearchGlobalSolarEclipse, SearchHourAngle, SearchLocalSolarEclipse, SearchLunarEclipse, SearchMoonPhase, SearchRiseSet, SunPosition } from "astronomy-engine"

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

const anyMABIMSCitiesCoordinates = [
  // Tuas, Singapore
  { latitude: 1.225467, longitude: 103.606061, elevation: 1 },
  // Buloh Island, Singapore
  { latitude: 1.45044, longitude: 103.721647, elevation: 1 },
  // Kuala Belait, Brunei
  { latitude: 4.586509, longitude: 114.079195, elevation: 1 },
  // Serasa, Brunei
  { latitude: 5.045423, longitude: 115.057739, elevation: 1 },
  // Teraja, Brunei
  { latitude: 4.284362, longitude: 114.418717, elevation: 205 },
  // Padang Besar, Malaysia
  { latitude: 6.66299, longitude: 100.31967, elevation: 70 },
  // Perlis, Malaysia
  { latitude: 6.418958, longitude: 100.122036, elevation: 1 },
  // Teluk Bahang, Malaysia
  { latitude: 5.457475, longitude: 100.212129, elevation: 1 },
  // Perak, Malaysia
  { latitude: 4.212197, longitude: 100.612135, elevation: 1 },
  // Selangor, Malaysia
  { latitude: 2.884638, longitude: 101.28393, elevation: 1 },
  // Kukup, Malaysia
  { latitude: 1.324582, longitude: 103.441568, elevation: 1 },
  // Sabang, Indonesia
  { latitude: 5.894, longitude: 95.316, elevation: 43.6 },
  // Banda Aceh, Indonesia
  { latitude: 5.54829, longitude: 95.32375, elevation: 1 },
  // Lhoknga, Indonesia
  { latitude: 5.47833, longitude: 95.24417, elevation: 3 },
  // Meulaboh, Indonesia
  { latitude: 4.14167, longitude: 96.125, elevation: 3 },
  // Tapaktuan, Indonesia
  { latitude: 3.25, longitude: 97.16667, elevation: 5 },
  // Sibolga, Indonesia
  { latitude: 1.74606, longitude: 98.769111, elevation: 5 },
  // Pariaman, Indonesia
  { latitude: -0.6264, longitude: 100.1178, elevation: 5 },
  // Padang, Indonesia
  { latitude: -0.95, longitude: 100.3531, elevation: 10 },
  // Painan, Indonesia
  { latitude: -1.35172, longitude: 100.57383, elevation: 3 },
  // Bengkulu, Indonesia
  { latitude: -3.7956, longitude: 102.2592, elevation: 10 },
  // Krui, Indonesia
  { latitude: -5.19168, longitude: 103.9304, elevation: 3 },
  // Bandar Lampung, Indonesia
  { latitude: -5.45, longitude: 105.26667, elevation: 5 },
  // Pandeglang, Indonesia
  { latitude: -6.240263, longitude: 105.825405, elevation: 3 },
  // Pelabuhan Ratu, Indonesia
  { latitude: -6.91722, longitude: 106.32, elevation: 4 },
  // Cilacap, Indonesia
  { latitude: -7.71889, longitude: 109.01583, elevation: 6 },
  // Parangtritis, Indonesia
  { latitude: -8, longitude: 110.36667, elevation: 1 },
  // Pacitan, Indonesia
  { latitude: -8.235, longitude: 111.20611, elevation: 36 },
  // Jimbaran, Indonesia
  { latitude: -8.8, longitude: 115.16667, elevation: 1 },
  // Kuta, Lombok, Indonesia
  { latitude: -8.91, longitude: 116.239, elevation: 1 },
  // Sumbawa Besar, Indonesia
  { latitude: -8.485, longitude: 117.418, elevation: 1 },
  // Kupang, Indonesia
  { latitude: -10.17667, longitude: 123.58111, elevation: 1 }
]

const anyAmericaCitiesCoordinates = [
  // Platinum
  { latitude: 59.010952, longitude: -161.824012, elevation: 0 },
  // Sitka
  { latitude: 57.0531, longitude: -135.33, elevation: 0 },
  // King Cove
  { latitude: 55.059398, longitude: -162.314625, elevation: 0 },
  // Vancouver
  { latitude: 49.2827, longitude: -123.1207, elevation: 0 },
  // Seattle
  { latitude: 47.6062, longitude: -122.3321, elevation: 0 },
  // Portland
  { latitude: 45.5371, longitude: -122.65, elevation: 0 },
  // San Francisco
  { latitude: 37.7558, longitude: -122.4449, elevation: 0 },
  // Los Angeles
  { latitude: 34.0522, longitude: -118.2437, elevation: 0 },
  // San Diego
  { latitude: 32.7157, longitude: -117.1611, elevation: 0 },
  // Puerto Vallarta
  { latitude: 20.6767, longitude: -105.25, elevation: 0 },
  // Manzanillo
  { latitude: 19.1136, longitude: -104.3265, elevation: 0 },
  // Puntarenas
  { latitude: 9.976, longitude: -84.8383, elevation: 0 },
  // Mariato, Panama
  { latitude: 7.500532, longitude: -80.971786, elevation: 0 },
  // Manta
  { latitude: -0.95, longitude: -80.7162, elevation: 0 },
  // Chimbote
  { latitude: -9.074, longitude: -78.5933, elevation: 0 },
  // Lima
  { latitude: -12.0432, longitude: -77.0282, elevation: 0 },
  // Arica
  { latitude: -18.4783, longitude: -70.3126, elevation: 0 },
  // Antofagasta
  { latitude: -23.4433, longitude: -70.3997, elevation: 0 },
  // Coquimbo
  { latitude: -29.9536, longitude: -71.3434, elevation: 0 },
  // Valparaíso
  { latitude: -33.0472, longitude: -71.6127, elevation: 0 },
  // Talcahuano
  { latitude: -36.72375, longitude: -73.144618, elevation: 0 },
  // Puerto Montt
  { latitude: -41.4667, longitude: -72.9333, elevation: 0 },
  // Punta Arenas
  { latitude: -53.1638, longitude: -70.9171, elevation: 0 }
]

const observerFromEarth = (latitude, longitude, elevation) => new Observer(latitude, longitude, elevation)

const getIsoDateStrBasedTimeZone = (localDate, timeZone) => {
  const formattedDate = localDate.toLocaleDateString('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return `${addZeroPadForYear(formattedDate.split('-')[0])}-${formattedDate.split('-')[1]}-${formattedDate.split('-')[2]}`
}

const calculateNewMoon = (prevNewMoonDate, startDate, timeZone, latitude, longitude, elevation, criteria, elongationType, altitudeType, correctedRefraction, formula) => {
  let observer = observerFromEarth(latitude, longitude, elevation)
  let date = startDate
  let diffDays
  let localizedNewMoonDate
  let newMoonDate
  let newMoon
  let moonElongation
  let localizedDateInNewMoon
  let dateInNewMoon
  let sunset
  let moonset
  let sunEquator
  let moonEquator
  let moonHorizon
  let isMetCriteria = false
  if (criteria === 0) {
    // Global Hijri Calendar/KHGT
    let westObserver
    let observerFromNewZealand
    let fajrAtWellington
    let isConjunctionBeforeFajr = false
    while (true) {
      // Searching for New Moon forward
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getUTCFullYear(), newMoon.date.getUTCMonth(), newMoon.date.getUTCDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      isMetCriteria = anyAmericaCitiesCoordinates.some(city => {
        westObserver = observerFromEarth(city.latitude, city.longitude, city.elevation)
        sunset = SearchRiseSet(Body.Sun, westObserver, -1, localizedNewMoonDate.AddDays(-city.longitude / 360), 1, city.elevation)
        sunEquator = Equator(Body.Sun, sunset, westObserver, true, true)
        if (altitudeType === 0) {
          // Geocentric Moon Equatorial Coordinates
          moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
        } else {
          // Topocentric Moon Equatorial Coordinates
          moonEquator = Equator(Body.Moon, sunset, westObserver, true, true)
        }
        moonHorizon = Horizon(sunset, westObserver, moonEquator.ra, moonEquator.dec, correctedRefraction)
        // Elongation Type = 0 for Geocentric, 1 for Topocentric
        moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
        return (localizedNewMoonDate.AddDays(-city.longitude / 360).date.getUTCDate() <= newMoon.date.getUTCDate() && moonElongation >= 8 && moonHorizon.altitude >= 5)
      })
      observerFromNewZealand = observerFromEarth(-41.2889, 174.7772, 0)
      fajrAtWellington = SearchAltitude(Body.Sun, observerFromNewZealand, +1, newMoon, 2, -18)
      isConjunctionBeforeFajr = (fajrAtWellington.date.getUTCDate() === newMoon.date.getUTCDate() && fajrAtWellington.date > newMoon.date)
      if (newMoon.date.getUTCHours() < 12) {
        // Met the Global Hijri Calendar criteria (Conjunction before 12:00 UTC)
        return newMoonDate.AddDays(1)
      } else if (isMetCriteria && isConjunctionBeforeFajr) {
        // Met the Global Hijri Calendar criteria (Meet the Visibility Criteria for Conjunction after 12:00 UTC in America continents plains and Conjunction before Fajr in New Zealand on Ijtima' Day)
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Global Hijri Calendar criteria
        return newMoonDate.AddDays(2)
      }
    }
  } else if (criteria === 1 || criteria === 2 || criteria === 3 || criteria === 4 || criteria === 5) {
    // Neo MABIMS:
    let slicedMABIMSCitiesCoordinates = []
    if (criteria === 1) {
      // Mathla': Singapore
      slicedMABIMSCitiesCoordinates = anyMABIMSCitiesCoordinates.slice(0, 2)
    } else if (criteria === 2) {
      // Mathla': Brunei
      slicedMABIMSCitiesCoordinates = anyMABIMSCitiesCoordinates.slice(2, 5)
    } else if (criteria === 3) {
      // Mathla': Malaysia
      slicedMABIMSCitiesCoordinates = anyMABIMSCitiesCoordinates.slice(5, 11)
    } else if (criteria === 4) {
      // Mathla': Indonesia
      slicedMABIMSCitiesCoordinates = anyMABIMSCitiesCoordinates.slice(11)
    } else {
      // Mathla': Brunei, Indonesia, Malaysia, Singapore
      slicedMABIMSCitiesCoordinates = anyMABIMSCitiesCoordinates.slice(5)
    }
    while (true) {
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      isMetCriteria = slicedMABIMSCitiesCoordinates.some(city => {
        observer = observerFromEarth(city.latitude, city.longitude, city.elevation)
        sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, city.elevation)
        sunEquator = Equator(Body.Sun, sunset, observer, true, true)
        if (altitudeType === 0) {
          moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
        } else {
          moonEquator = Equator(Body.Moon, sunset, observer, true, true)
        }
        moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
        moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
        return moonElongation >= 6.4 && moonHorizon.altitude >= 3
      })
      if (isMetCriteria) {
        // Met the MABIMS criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the MABIMS criteria
        return newMoonDate.AddDays(2)
      }
    }
  } else if (criteria === 6) {
    // MABIMS (Markaz: Local)
    while (true) {
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      observer = observerFromEarth(latitude, longitude, elevation)
      sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, elevation)
      if (Math.abs(latitude) > 48) {
        if (formula === 1) {
          if (latitude > 45) observer = observerFromEarth(45, longitude, elevation)
          else observer = observerFromEarth(-45, longitude, elevation)
        } else if (formula === 2) {
          observer = observerFromEarth(kaabaCoordinates.latitude, kaabaCoordinates.longitude, kaabaCoordinates.elevation)
        } else {
          if (latitude > 60) observer = observerFromEarth(60, longitude, elevation)
          else observer = observerFromEarth(-60, longitude, elevation)
        }
        sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, elevation)
      }
      sunEquator = Equator(Body.Sun, sunset, observer, true, true)
      if (altitudeType === 0) {
        moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
      } else {
        moonEquator = Equator(Body.Moon, sunset, observer, true, true)
      }
      moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
      moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
      if (moonElongation >= 6.4 && moonHorizon.altitude >= 3) {
        diffDays = Math.abs(newMoonDate.AddDays(1).date - prevNewMoonDate) / 86400000
        if (diffDays > 30) {
          // Preventing exceeded 31 days for Hijri days on several months in higher latitude
          return newMoonDate
        } else if (diffDays < 29) {
          // Preventing less than 29 days for Hijri days on several months in higher latitude
          return newMoonDate.AddDays(2)
        } else {
          // Met the MABIMS criteria
          return newMoonDate.AddDays(1)
        }
      } else {
        diffDays = Math.abs(newMoonDate.AddDays(2).date - prevNewMoonDate) / 86400000
        if (diffDays > 30) {
          return newMoonDate.AddDays(1)
        } else if (diffDays < 29) {
          return newMoonDate.AddDays(3)
        } else {
          // Didn't meet the MABIMS criteria
          return newMoonDate.AddDays(2)
        }
      }
    }
  } else if (criteria === 7) {
    // Wujudul Hilal (Markaz: Yogyakarta)
    do {
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      // Yogyakarta Coordinates
      observer = observerFromEarth(-7.797224, 110.368797, 105)
      sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, 105)
      moonset = SearchRiseSet(Body.Moon, observer, -1, localizedNewMoonDate, 1, 105)
      if (newMoon.date < sunset.date && moonset.date > sunset.date) {
        // Met the Wujudul Hilal criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Wujudul Hilal criteria
        return newMoonDate.AddDays(2)
      }
    } while (true)
  } else if (criteria === 8) {
    // Wujudul Hilal (Markaz: Local)
    do {
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, elevation)
      moonset = SearchRiseSet(Body.Moon, observer, -1, localizedNewMoonDate, 1, elevation)
      if (Math.abs(latitude) > 48) {
        if (formula === 1) {
          if (latitude > 45) observer = observerFromEarth(45, longitude, elevation)
          else observer = observerFromEarth(-45, longitude, elevation)
        } else if (formula === 2) {
          observer = observerFromEarth(kaabaCoordinates.latitude, kaabaCoordinates.longitude, kaabaCoordinates.elevation)
        } else {
          if (latitude > 60) observer = observerFromEarth(60, longitude, elevation)
          else observer = observerFromEarth(-60, longitude, elevation)
        }
        sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, elevation)
        moonset = SearchRiseSet(Body.Moon, observer, -1, localizedNewMoonDate, 1, elevation)
      }
      if (newMoon.date < sunset.date && moonset.date > sunset.date) {
        diffDays = Math.abs(newMoonDate.AddDays(1).date - prevNewMoonDate) / 86400000
        if (diffDays > 30) {
          return newMoonDate
        } else if (diffDays < 29) {
          return newMoonDate.AddDays(2)
        } else {
          // Met the Wujudul Hilal criteria
          return newMoonDate.AddDays(1)
        }
      } else {
        diffDays = Math.abs(newMoonDate.AddDays(2).date - prevNewMoonDate) / 86400000
        if (diffDays > 30) {
          return newMoonDate.AddDays(1)
        } else if (diffDays < 29) {
          return newMoonDate.AddDays(3)
        } else {
          // Didn't meet the Wujudul Hilal criteria
          return newMoonDate.AddDays(2)
        }
      }
    } while (true)
  } else {
    // Ummul Qura
    do {
      newMoon = SearchMoonPhase(0, date, 30)
      date = new AstroTime(newMoon.date)
      localizedDateInNewMoon = new Date(`${getIsoDateStrBasedTimeZone(newMoon.date, timeZone)}T00:00:00Z`)
      localizedNewMoonDate = new AstroTime(localizedDateInNewMoon)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      observer = observerFromEarth(kaabaCoordinates.latitude, kaabaCoordinates.longitude, kaabaCoordinates.elevation)
      sunset = SearchRiseSet(Body.Sun, observer, -1, localizedNewMoonDate, 1, kaabaCoordinates.elevation)
      moonset = SearchRiseSet(Body.Moon, observer, -1, localizedNewMoonDate, 1, kaabaCoordinates.elevation)
      if (newMoon.date < sunset.date && moonset.date > sunset.date) {
        // Met the Ummul Qura criteria
        return newMoonDate.AddDays(1)
      } else {
        // Didn't meet the Ummul Qura criteria
        return newMoonDate.AddDays(2)
      }
    } while (true)      
  }
}

const getCalendarData = (gregorianDate, timeZone, latitude, longitude, elevation, criteria, elongationType, altitudeType, correctedRefraction, formula, lang) => {
  const newMoonsInLastYear = []
  const newMoonsFromCurrentYear = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  // Add spare one year before to align offset hijri date at the first/previous new moon calculation
  const startGregorianDateFromLastYear = new Date(gregorianDate.getFullYear() - 1, 0, 1)
  let startDate = new AstroTime(startGregorianDateFromLastYear)
  let newMoonDate = gregorianFirstDate
  let currentMoonDate
  let nextMoonDate
  let currentYearDaysOffset = 0
  while (newMoonDate.getFullYear() <= gregorianFirstDate.getFullYear()) {
    // Search New Moon incremental from first gregorian day from the previous of current/configured year until the last gregorian day in current/configured year
    newMoonDate = calculateNewMoon(newMoonDate, startDate, timeZone, latitude, longitude, elevation, criteria, elongationType, altitudeType, correctedRefraction, formula).date
    if (newMoonDate instanceof Date) {
      if (newMoonDate.getFullYear() < gregorianFirstDate.getFullYear()) {
        newMoonsInLastYear.push(newMoonDate)
      }
      if (newMoonDate.getFullYear() >= gregorianFirstDate.getFullYear()) {
        newMoonsFromCurrentYear.push(newMoonDate)
      }
      startDate = new AstroTime(newMoonDate)
      startDate = startDate.AddDays(27)
    }
  }
  const filteredNewMoons = [newMoonsInLastYear[newMoonsInLastYear.length - 1], ...newMoonsFromCurrentYear]
  const newMoonsFromLastYear = filteredNewMoons.filter(moonDate => moonDate.getFullYear() <= gregorianDate.getFullYear())
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
  newMoonsFromLastYear.forEach(moonDate => {
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
  const hijriStartDates = getHijriStartDates(filteredNewMoons, lang)
  return { months, hijriEventDates, hijriStartDates }
}

const getHijriDate = (gregorianSetDate, months) => {
  const gregorianDate = new Date(gregorianSetDate)
  const islamicDate = new Date(gregorianDate)
  const currentFirstMonthGregorianDay = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), 1).getDay()
  const islamicDayNumber = months[gregorianDate.getMonth()]?.at(gregorianDate.getDate() + currentFirstMonthGregorianDay - 1)?.hijri || 0
  islamicDate.setDate(islamicDate.getDate() + 15 - islamicDayNumber)
  const islamicMonth = parseInt(islamicDate.toLocaleDateString('en', { calendar: "islamic", month: "numeric" }))
  const islamicYear = parseInt(islamicDate.toLocaleDateString('en', { calendar: "islamic", year: "numeric" }))
  return { islamicMonth, islamicYear }
}

const adjustedIslamicDate = (months, lang) => {
  const currentDate = new Date()
  const gregorian = currentDate.toLocaleDateString(lang || 'en', { weekday: "long", year: "numeric", month: "long", day: "numeric" }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at')
  const time = currentDate.toLocaleTimeString(lang || 'en', { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" }).replace(/\./g, ':')
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
  const earthRadius = 6371.0087714
  const deltaLat = (lat2 - lat1) * DEG2RAD
  const deltaLon = (lon2 - lon1) * DEG2RAD
  const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.pow(Math.sin(deltaLon / 2), 2)
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
    if (innerHTML.includes(eventId)) hijriEvent = eventId
  })
  return hijriEvent
}

const convertRAToHMS = raDecimalHours => {
  const hours = Math.floor(raDecimalHours)
  const minutes = Math.floor((raDecimalHours - hours) * 60)
  const seconds = Math.round(((raDecimalHours - hours) * 60 - minutes) * 60)
  const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  return formatted
}

const getMoonInfos = (gregorianDate, timeZone, latitude, longitude, elevation, lang) => {
  const observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const startDate = new Date(`${getIsoDateStrBasedTimeZone(gregorianDate, timeZone)}T00:00:00`)
  const startAstroTime = new AstroTime(startDate)
  const lastNewMoon = SearchMoonPhase(0, astroDate, -30)
  const moonAge = `${(astroDate.ut - lastNewMoon.ut).toFixed(2)} ${lang === 'id' ? 'hari' : 'days'}`
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const phaseAngle = MoonPhase(astroDate).toFixed(2)
  const illuminationPercent = `${(moonIllumination.phase_fraction * 100).toFixed(2)}%`
  const moonEquatorTopocentric = Equator(Body.Moon, astroDate, observer, true, true)
  const moonEquatorGeocentric = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(astroDate), GeoVector(Body.Moon, astroDate, true)))
  const moonRightAscension = `${convertRAToHMS(moonEquatorTopocentric.ra)}`
  const moonDeclination = `${moonEquatorTopocentric.dec.toFixed(2)}°`
  const moonHorizonTopocentric = Horizon(astroDate, observer, moonEquatorTopocentric.ra, moonEquatorTopocentric.dec, 'normal')
  const moonAltitudeTopocentric = `${moonHorizonTopocentric.altitude.toFixed(2)}°${moonHorizonTopocentric.altitude < 0 ? ` ${lang === 'id' ?  '(Tidak Terlihat)' : '(Not Visible)'}` : ''}`
  const moonHorizonGeocentric = Horizon(astroDate, observer, moonEquatorGeocentric.ra, moonEquatorGeocentric.dec, 'normal')
  const moonAltitudeGeocentric = `${moonHorizonGeocentric.altitude.toFixed(2)}°`
  const moonAzimuthTopocentric = `${moonHorizonTopocentric.azimuth.toFixed(2)}°`
  const geoDistanceAU = moonIllumination.geo_dist
  const distanceInKm = `${(geoDistanceAU * KM_PER_AU).toFixed(2)} km`
  const moonLibration = Libration(astroDate)
  const moonLatitude = `${moonLibration.elat.toFixed(2)}°`
  const moonLongitude = `${moonLibration.elon.toFixed(2)}°`
  const moonElongationGeocentric = `${AngleFromSun(Body.Moon, astroDate).toFixed(2)}°`
  const sunEquator = Equator(Body.Sun, astroDate, observer, true, true)
  const moonElongationTopocentric = `${AngleBetween(sunEquator.vec, moonEquatorTopocentric.vec).toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, startAstroTime, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, startAstroTime, 1, elevation)
  const firstQuarter = SearchMoonPhase(90, lastNewMoon, +30)
  const fullMoon = SearchMoonPhase(180, lastNewMoon, +30)
  const lastQuarter = SearchMoonPhase(270, lastNewMoon, +30)
  const nextNewMoon = SearchMoonPhase(0, astroDate, +30)
  const lastNewMoonDateTime = `${lastNewMoon.date.toLocaleDateString(lang || 'en', { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone })} ${lastNewMoon.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const firstQuarterDateTime = `${firstQuarter.date.toLocaleDateString(lang || 'en', { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone })} ${firstQuarter.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const fullMoonDateTime = `${fullMoon.date.toLocaleDateString(lang || 'en', { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone })} ${fullMoon.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const lastQuarterDateTime = `${lastQuarter.date.toLocaleDateString(lang || 'en', { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone })} ${lastQuarter.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const nextNewMoonDateTime = `${nextNewMoon.date.toLocaleDateString(lang, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone })} ${nextNewMoon.date.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: timeZone }).replace(/\./, ':')}`
  const sunAltitude = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').altitude
  const sunAzimuth = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').azimuth
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, startAstroTime, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, startAstroTime, 1, elevation)
  let moonFacingAngle = RAD2DEG * Math.atan2(
    Math.sin(DEG2RAD * moonHorizonTopocentric.altitude) * Math.cos(DEG2RAD * (sunAzimuth - moonHorizonTopocentric.azimuth)) - Math.cos(DEG2RAD * moonHorizonTopocentric.altitude) * Math.tan(DEG2RAD * sunAltitude),
    Math.sin(DEG2RAD * (sunAzimuth - moonHorizonTopocentric.azimuth))
  )
  phaseAngle > 180 ? moonFacingAngle = moonFacingAngle + 180 : moonFacingAngle = moonFacingAngle
  return [
    moonAge,
    illuminationPercent,
    `${phaseAngle}°`,
    moonRightAscension,
    moonDeclination,
    moonAltitudeGeocentric,
    moonAltitudeTopocentric,
    moonAzimuthTopocentric,
    distanceInKm,
    moonLatitude,
    moonLongitude,
    moonElongationGeocentric,
    moonElongationTopocentric,
    moonrise?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    moonset?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    lastNewMoonDateTime,
    firstQuarterDateTime,
    fullMoonDateTime,
    lastQuarterDateTime,
    nextNewMoonDateTime,
    `${sunAltitude.toFixed(2)}°`,
    `${sunAzimuth.toFixed(2)}°`,
    sunrise?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    sunset?.date?.toLocaleTimeString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "short", timeZone: timeZone }).replace(/\./, ':') || '--:--',
    `${moonFacingAngle.toFixed(2)}°`
  ]
}

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, +1, +2, +3, +4, +5]

const addTime = (prayerTime, ihtiyath, correction) => {
  const additionalTime = new Date(prayerTime)
  additionalTime.setMinutes(additionalTime.getMinutes() + ihtiyath + correction)
  return additionalTime
}

const calculateByAstronomyEngine = (astroDate, formattedDateTime, setMonths, latitude, longitude, elevation, mazhab, sunAlt, zawal, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
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
  if (mazhab === 0) shadowFactor = 1
  // For Hanafi school
  else shadowFactor = 2
  if (Math.abs(latitude) > 45) {
    let setLatitude = latitude
    if (latitude > 60) setLatitude = 60
    else setLatitude = -60
    if (formula === 0) {
      // Not Configured, return --:-- if times aren't happened
      fajr = SearchAltitude(Body.Sun, observer, +1, astroDate, 1, -sunAlt.fajr) || '--:--'
      sunrise = SearchRiseSet(Body.Sun, observer, +1, astroDate, 1, elevation) || '--:--'
      if (isNaN(sunAlt?.maghrib)) {
        maghrib = SearchRiseSet(Body.Sun, observer, -1, astroDate, 1, elevation) || '--:--'
      } else {
        maghrib = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.maghrib) || '--:--'
      }
      correctedMaghribTime = addTime(maghrib?.date, ihtiyath, corrections[6])
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
        isha = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, -sunAlt.isha) || '--:--'
        correctedIshaTime = addTime(isha?.date, ihtiyath, corrections[7])
      }
      const sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      const cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude) || '--:--'
      correctedAshrTime = addTime(ashr?.date, ihtiyath, corrections[5])
    } else if (formula === 1) {
      // Follow ±45 degrees latitude
      let higherLat = latitude
      if (latitude > 45) higherLat = 45
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
      const cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(higherLat - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else if (formula === 2) {
      // Follow mecca coordinates
      observer = observerFromEarth(kaabaCoordinates.latitude, kaabaCoordinates.longitude, kaabaCoordinates.elevation)
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
      const cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(kaabaCoordinates.latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      correctedAshrTime = addTime(ashr.date, ihtiyath, corrections[5])
    } else if (formula === 3) {
      // Middle of the night
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
      const nightDuration = sunrise.date < maghrib.date ? sunrise.AddDays(1).date - maghrib.date : sunrise.date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration / 2
      fajr = MakeTime(new Date(fajrTime))
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
      let cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr?.date, ihtiyath, corrections[5])
    } else if (formula === 4) {
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
      const nightDuration = sunrise.date < maghrib.date ? sunrise.AddDays(1).date - maghrib.date : sunrise.date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration / 7
      fajr = MakeTime(new Date(fajrTime))
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
      let cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr?.date, ihtiyath, corrections[5])
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
      const nightDuration = sunrise.date < maghrib.date ? sunrise.AddDays(1).date - maghrib.date : sunrise.date - maghrib.date
      const fajrTime = sunrise.date.getTime() - nightDuration * sunAlt.fajr / 60
      fajr = MakeTime(new Date(fajrTime))
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
        const ishaTime = maghrib.date.getTime() + nightDuration * sunAlt.isha / 60
        isha = new Date(ishaTime)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])
      }
      let sunDeclination = Equator(Body.Sun, astroDate, observer, true, true).dec
      let cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
      let tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      let ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashr = SearchAltitude(Body.Sun, observer, -1, astroDate, 1, ashrSunAltitude)
      if (!ashr) {
        sunDeclination = Equator(Body.Sun, astroDate, observerFromEarth(setLatitude, longitude, elevation), true, true).dec
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashr = SearchAltitude(Body.Sun, observerFromEarth(setLatitude, longitude, elevation), -1, astroDate, 1, ashrSunAltitude)
      }
      correctedAshrTime = addTime(ashr?.date, ihtiyath, corrections[5])
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
    const cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
    const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
    const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
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
  const correctedFajrTime = addTime(fajr.date, ihtiyath, corrections[1])
  const imsakTime = addTime(correctedFajrTime, -10, 0)
  const correctedSunrise = addTime(sunrise.date, -ihtiyath, 0)
  const correctedDhuhaTime = addTime(dhuha, ihtiyath, 0)
  const istiwa = SearchHourAngle(Body.Sun, observer, 0, astroDate, 1).time
  const correctedDhuhrTime = addTime(istiwa.date, ihtiyath + zawal, corrections[4])
  correctedAshrTime = correctedAshrTime
  correctedMaghribTime = correctedMaghribTime
  correctedIshaTime = correctedIshaTime
  return [ imsakTime, correctedFajrTime, correctedSunrise, correctedDhuhaTime, correctedDhuhrTime, correctedAshrTime, correctedMaghribTime, correctedIshaTime ]
}

const parseDate = (gregorianDate, hours, minutes, seconds) => new Date(
  gregorianDate.getFullYear(),
  gregorianDate.getMonth(),
  gregorianDate.getDate(),
  hours,
  minutes,
  seconds
)

// Kaaba Coordinates in Mecca
const kaabaCoordinates = { latitude: 21.42250833, longitude: 39.82616111, elevation: 302 }

const getQiblaDirection = (latitude, longitude) => {
  const deltaLongitude = kaabaCoordinates.longitude - longitude
  const yAxis = Math.sin(DEG2RAD * deltaLongitude)
  const xAxis = Math.cos(DEG2RAD * latitude) * Math.tan(DEG2RAD * kaabaCoordinates.latitude) - Math.sin(DEG2RAD * latitude) * Math.cos(DEG2RAD * deltaLongitude)
  const qiblaAngle = Math.atan2(yAxis, xAxis)
  const qiblaDirection = RAD2DEG * qiblaAngle
  return ((360 + qiblaDirection) % 360).toFixed(2)
}

const getQiblaDistance = (latitude, longitude) => getCitiesDistance(latitude, longitude, kaabaCoordinates.latitude, kaabaCoordinates.longitude).toFixed(2)

const calculateManually = (gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, mazhab, sunAlt, zawal, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
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
  if (mazhab === 0) shadowFactor = 1
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
  const sunDeclination = 0.37877 + 23.264 * Math.sin(DEG2RAD * (57.297 * dateAngle - 79.547)) + 0.3812 * Math.sin(DEG2RAD * (2 * 57.297 * dateAngle - 82.682)) + 0.17132 * Math.sin(DEG2RAD * (3 * 57.297 * dateAngle - 59.722))
  const u = (julianDay - 2451545) / 36525
  const sunLongitude = 280.46607 + 36000.7698 * u
  const sunLongitudeInRad = DEG2RAD * sunLongitude
  const equationOfTime = (-(1789 + 237 * u) * Math.sin(sunLongitudeInRad) - (7146 - 62 * u) * Math.cos(sunLongitudeInRad) + (9934 - 14 * u) * Math.sin(2 * sunLongitudeInRad) - (29 + 5 * u) * Math.cos(2 * sunLongitudeInRad) + (74 + 10 * u) * Math.sin(3 * sunLongitudeInRad) + (320 - 4 * u) * Math.cos(3 * sunLongitudeInRad) - 212 * Math.sin(4 * sunLongitudeInRad)) / 1000
  const transitTime = 12 - getTimeZoneDiff() - longitude / 15 - equationOfTime / 60
  const sunriseAltitude = -5/6 - 0.0347 * Math.sqrt(elevation)
  if (Math.abs(latitude) > 45) {
    let setLatitude = latitude
    if (latitude > 60) setLatitude = 60
    else setLatitude = -60
    if (formula === 0) {
      fajrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.fajr) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination))) || '--:--'
      fajrTime = transitTime - fajrHourAngle / 15
      const fajrHours = parseInt(fajrTime)
      const fajrMinutes = (fajrTime - fajrHours) * 60
      const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
      fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination))) || '--:--'
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination))) || '--:--'
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination))) || '--:--'
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
        ishaHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.isha) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination))) || '--:--'
        ishaTime = transitTime + ishaHourAngle / 15
        const ishaHours = parseInt(ishaTime)
        const ishaMinutes = (ishaTime - ishaHours) * 60
        const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
        isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 1) {
      let higherLat = latitude
      if (latitude > 45) higherLat = 45
      else higherLat = -45
      fajrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.fajr) - Math.sin(DEG2RAD * higherLat) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * higherLat) * Math.cos(DEG2RAD * sunDeclination)))
      fajrTime = transitTime - fajrHourAngle / 15
      const fajrHours = parseInt(fajrTime)
      const fajrMinutes = (fajrTime - fajrHours) * 60
      const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
      fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * higherLat) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * higherLat) * Math.cos(DEG2RAD * sunDeclination)))
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(higherLat - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * higherLat) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * higherLat) * Math.cos(DEG2RAD * sunDeclination)))
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * higherLat) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * higherLat) * Math.cos(DEG2RAD * sunDeclination)))
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
        ishaHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.isha) - Math.sin(DEG2RAD * higherLat) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * higherLat) * Math.cos(DEG2RAD * sunDeclination)))
        ishaTime = transitTime + ishaHourAngle / 15
        const ishaHours = parseInt(ishaTime)
        const ishaMinutes = (ishaTime - ishaHours) * 60
        const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
        isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 2) {
      fajrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.fajr) - Math.sin(DEG2RAD * kaabaCoordinates.latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * kaabaCoordinates.latitude) * Math.cos(DEG2RAD * sunDeclination)))
      fajrTime = transitTime - fajrHourAngle / 15
      const fajrHours = parseInt(fajrTime)
      const fajrMinutes = (fajrTime - fajrHours) * 60
      const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
      fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * kaabaCoordinates.latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * kaabaCoordinates.latitude) * Math.cos(DEG2RAD * sunDeclination)))
      sunriseTime = transitTime - sunriseHourAngle / 15
      const sunriseHours = parseInt(sunriseTime)
      const sunriseMinutes = (sunriseTime - sunriseHours) * 60
      const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
      sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(kaabaCoordinates.latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * kaabaCoordinates.latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * kaabaCoordinates.latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * kaabaCoordinates.latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * kaabaCoordinates.latitude) * Math.cos(DEG2RAD * sunDeclination)))
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
        ishaHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.isha) - Math.sin(DEG2RAD * kaabaCoordinates.latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * kaabaCoordinates.latitude) * Math.cos(DEG2RAD * sunDeclination)))
        ishaTime = transitTime + ishaHourAngle / 15
        const ishaHours = parseInt(ishaTime)
        const ishaMinutes = (ishaTime - ishaHours) * 60
        const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
        isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
        correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
      }
    } else if (formula === 3) {
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!sunriseHourAngle) {
        sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))
      }
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))    
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
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
    } else if (formula === 4) {
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!sunriseHourAngle) {
        sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))
      }
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))  
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
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
      sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!sunriseHourAngle) {
        sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))
      }
      cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
      const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
      const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
      ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      if (!ashrHourAngle) {
        cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(setLatitude - sunDeclination)) + shadowFactor
        const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
        const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
        ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * setLatitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * setLatitude) * Math.cos(DEG2RAD * sunDeclination)))
      }
      if (isNaN(sunAlt?.maghrib)) {
        maghribTime = transitTime + sunriseHourAngle / 15
      } else {
        maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
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
    fajrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.fajr) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
    fajrTime = transitTime - fajrHourAngle / 15
    const fajrHours = parseInt(fajrTime)
    const fajrMinutes = (fajrTime - fajrHours) * 60
    const fajrSeconds = (fajrMinutes - parseInt(fajrMinutes)) * 60
    fajr = parseDate(gregorianDate, fajrHours, fajrMinutes, fajrSeconds)
    sunriseHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * sunriseAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
    sunriseTime = transitTime - sunriseHourAngle / 15
    const sunriseHours = parseInt(sunriseTime)
    const sunriseMinutes = (sunriseTime - sunriseHours) * 60
    const sunriseSeconds = (sunriseMinutes - parseInt(sunriseMinutes)) * 60
    sunrise = parseDate(gregorianDate, sunriseHours, sunriseMinutes, sunriseSeconds)
    cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunDeclination)) + shadowFactor
    const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
    const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
    ashrHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * ashrSunAltitude) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
    if (isNaN(sunAlt?.maghrib)) {
      maghribTime = transitTime + sunriseHourAngle / 15
    } else {
      maghribHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.maghrib) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
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
      ishaHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * -sunAlt.isha) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
      ishaTime = transitTime + ishaHourAngle / 15
      const ishaHours = parseInt(ishaTime)
      const ishaMinutes = (ishaTime - ishaHours) * 60
      const ishaSeconds = (ishaMinutes - parseInt(ishaMinutes)) * 60
      isha = parseDate(gregorianDate, ishaHours, ishaMinutes, ishaSeconds)
      correctedIshaTime = addTime(isha, ihtiyath, corrections[7])        
    }
  }
  const istiwaHours = parseInt(transitTime)
  const istiwaMinutes = (transitTime - istiwaHours) * 60
  const istiwaSeconds = (istiwaMinutes - parseInt(istiwaMinutes)) * 60
  const dhuhrDate = parseDate(gregorianDate, istiwaHours, istiwaMinutes + zawal, istiwaSeconds)
  ashrTime = transitTime + ashrHourAngle / 15
  const ashrHours = parseInt(ashrTime)
  const ashrMinutes = (ashrTime - ashrHours) * 60
  const ashrSeconds = (ashrMinutes - parseInt(ashrMinutes)) * 60
  ashr = parseDate(gregorianDate, ashrHours, ashrMinutes, ashrSeconds)
  if (dhuhaMethod === 0) {
    const dhuhaHourAngle = RAD2DEG * Math.acos((Math.sin(DEG2RAD * inputSunAlt) - Math.sin(DEG2RAD * latitude) * Math.sin(DEG2RAD * sunDeclination)) / (Math.cos(DEG2RAD * latitude) * Math.cos(DEG2RAD * sunDeclination)))
    const dhuhaTime = transitTime - dhuhaHourAngle / 15
    const dhuhaHours = parseInt(dhuhaTime)
    const dhuhaMinutes = (dhuhaTime - dhuhaHours) * 60
    const dhuhaSeconds = (dhuhaMinutes - parseInt(dhuhaMinutes)) * 60
    dhuha = parseDate(gregorianDate, dhuhaHours, dhuhaMinutes, dhuhaSeconds)
  } else dhuha = addTime(sunrise, inputMins, 0)
  const correctedFajrTime = addTime(fajr, ihtiyath, corrections[1])
  const imsakTime = addTime(correctedFajrTime, -10, 0)
  const correctedSunrise = addTime(sunrise, -ihtiyath, 0)
  const correctedDhuhaTime = addTime(dhuha, ihtiyath, 0)
  const correctedDhuhrTime = addTime(dhuhrDate, ihtiyath, corrections[4])
  const correctedAshrTime = addTime(ashr, ihtiyath, corrections[5])
  correctedMaghribTime = correctedMaghribTime
  correctedIshaTime = correctedIshaTime
  return [ imsakTime, correctedFajrTime, correctedSunrise, correctedDhuhaTime, correctedDhuhrTime, correctedAshrTime, correctedMaghribTime, correctedIshaTime ]
}

const getPrayerTimes = (gregorianDate, formattedDateTime, setMonths, latitude, longitude, elevation, calculationMethod, mazhab, sunAlt, zawal, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins) => {
  let calculatedPrayerTimes = {}
  if (calculationMethod === 0) {
    const astroDate = new AstroTime(gregorianDate)
    // Calculate Using Astronomy-Engine Library
    calculatedPrayerTimes = calculateByAstronomyEngine(astroDate, formattedDateTime, setMonths, latitude, longitude, elevation, mazhab, sunAlt, zawal, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  } else {
    const midDayDateTime = new Date(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate(), 12, 0, 0)
    // Calculate Manually by Prayer Times Equation
    calculatedPrayerTimes = calculateManually(midDayDateTime, formattedDateTime, setMonths, latitude, longitude, elevation, mazhab, sunAlt, zawal, ihtiyath, formula, corrections, dhuhaMethod, inputSunAlt, inputMins)
  }
  return calculatedPrayerTimes
}

const getSunInfos = (gregorianDate, timeZone, latitude, longitude, elevation, mazhab, lang) => {
  let shadowFactor = 1
  if (mazhab === 0) shadowFactor = 1
  else shadowFactor = 2
  const observer = observerFromEarth(latitude, longitude, elevation)
  const astroDate = new AstroTime(gregorianDate)
  const startDate = new Date(`${getIsoDateStrBasedTimeZone(gregorianDate, timeZone)}T00:00:00`)
  const startAstroTime = new AstroTime(startDate)
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, startAstroTime, 1, elevation)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, startAstroTime, 1, elevation)
  const sunEquator = Equator(Body.Sun, astroDate, observer, true, true)
  const sunAltitude = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').altitude
  const sunAzimuth = Horizon(astroDate, observer, sunEquator.ra, sunEquator.dec, 'normal').azimuth
  const sunRightAscension = `${convertRAToHMS(sunEquator.ra)}`
  const sunDeclination = `${sunEquator.dec.toFixed(2)}°`
  const distanceInKm = `${(sunEquator.dist * KM_PER_AU).toFixed(2)} km`
  const sunEclipticLatitude = SunPosition(astroDate).elat
  const sunEclipticLongitude = SunPosition(astroDate).elon
  const culmination = SearchHourAngle(Body.Sun, observer, 0, startAstroTime, 1).time
  const sunEquatorAtCulmination = Equator(Body.Sun, culmination, observer, true, true)
  const sunDeclinationAtCulmination = sunEquatorAtCulmination.dec
  const culminationSunAltitude = 90 - Math.abs(observer.latitude - sunDeclinationAtCulmination)
  const cotSunAltitudeAshr = Math.tan(DEG2RAD * Math.abs(latitude - sunEquator.dec)) + shadowFactor
  const tanSunAltitudeAshr = 1 / cotSunAltitudeAshr
  const ashrSunAltitude = RAD2DEG * Math.atan(tanSunAltitudeAshr)
  const midnight = SearchHourAngle(Body.Sun, observer, 12, culmination, 2).time
  const sunEquatorAtMidnight = Equator(Body.Sun, midnight, observer, true, true)
  const sunDeclinationAtMidnight = sunEquatorAtMidnight.dec
  const midnightSunAltitude = -(90 - Math.abs(- observer.latitude - sunDeclinationAtMidnight))
  const moonPhase = MoonPhase(astroDate).toFixed(2)
  const moonStatus = moonPhase <= 90 ? 'Waxing Crescent' : moonPhase <= 180 ? 'Waxing Gibbous' : moonPhase <= 270 ? 'Waning Gibbous' : 'Waning Crescent'
  const moonEquator = Equator(Body.Moon, astroDate, observer, true, true)
  const moonDeclination = `${moonEquator.dec.toFixed(2)}°`
  const moonHorizon = Horizon(astroDate, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const moonAltitude = `${moonHorizon.altitude.toFixed(2)}°`
  const moonAzimuth = `${moonHorizon.azimuth.toFixed(2)}°`
  const moonrise = SearchRiseSet(Body.Moon, observer, +1, startAstroTime, 1, elevation)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, startAstroTime, 1, elevation)
  const moonIllumination = Illumination(Body.Moon, astroDate)
  const illuminationPercent = moonIllumination.phase_fraction * 100
  const hourAngle = HourAngle(Body.Moon, astroDate, observer)
  const parallacticAngle = RAD2DEG * Math.atan2(
    Math.sin(hourAngle * HOUR2RAD),
    Math.tan(DEG2RAD * latitude) * Math.cos(DEG2RAD * moonEquator.dec) - Math.sin(DEG2RAD * moonEquator.dec) * Math.cos(hourAngle * HOUR2RAD)
  )
  return [
    sunrise?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    sunset?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    `${sunAltitude.toFixed(2)}°`,
    `${sunAzimuth.toFixed(2)}°`,
    sunRightAscension,
    sunDeclination,
    distanceInKm,
    `${sunEclipticLatitude}°`,
    `${sunEclipticLongitude.toFixed(2)}°`,
    `${culmination.date.toLocaleString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':')}`,
    `${midnight.date.toLocaleString(lang || 'en', { hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':')}`,
    `${moonPhase}° (${moonStatus})`,
    moonAltitude,
    moonAzimuth,
    moonDeclination,
    moonrise?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    moonset?.date?.toLocaleTimeString(lang || 'en', { hourCycle: "h23", hour: "2-digit", minute: "2-digit", timeZoneName: "long", timeZone: timeZone }).replace(/\./gm, ':') || '--:--',
    illuminationPercent,
    culmination.date,
    midnight.date,
    `${culminationSunAltitude.toFixed(2)}°`,
    `${ashrSunAltitude.toFixed(2)}°`,
    `${midnightSunAltitude.toFixed(2)}°`,
    `${parallacticAngle.toFixed(2)}°`
  ]
}

const calculateVisibilityDanjon = (arcOfLight, moonAge, isMeetCriteria, sunset, conjunction) => {
  let tooltip = arcOfLight ? `Elongation: ${arcOfLight.toFixed(5)}°\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = '#820101'
  if (isMeetCriteria && sunset.date > conjunction.date) color = '#00FF3E'
  return { tooltip, color }
}

const calculateVisibilityYallop = (arcOfVision, moonElongationGeocentric, moonAlt, moonAge, w, lagTime, newMoonForEachCoords, bestTime, conjunction) => {
  const q = (arcOfVision - (11.8371 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))) / 10
  let tooltip = moonElongationGeocentric ? `Elongation: ${moonElongationGeocentric.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nq: ${isNaN(q) ? '-' : q.toFixed(5)}\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (q > 0.216 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (q > -0.014 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#9EFF00'
  } else if (q > -0.160 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FF783C'
  } else if (q > -0.232 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FF0000'
  } else if (q > -0.293 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#B50757'
  } else if (newMoonForEachCoords || bestTime.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilitySAAO = (topocentricAlt, arcOfLight, moonAge, lagTime, newMoonForEachCoords, sunset, conjunction) => {
  const sq = topocentricAlt + arcOfLight / 3
  let tooltip = arcOfLight ? `Elongation: ${arcOfLight.toFixed(5)}°\nAltitude: ${topocentricAlt?.toFixed(5)}°\nsq: ${isNaN(sq) ? '-' : sq.toFixed(5)}\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (sq > 11 && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (sq > 9 && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FFE53C'
  } else if (newMoonForEachCoords || sunset.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityOdeh = (moonElongation, moonAlt, moonAge, arcOfVision, w, lagTime, newMoonForEachCoords, bestTime, conjunction) => {
  const visibilityValue = arcOfVision - (7.1651 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nV: ${isNaN(visibilityValue) ? '-' : visibilityValue.toFixed(5)}\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (visibilityValue >= 5.65 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (visibilityValue >= 2.0 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#9EFF00'
  } else if (visibilityValue >= -0.96 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FF783C'
  } else if (newMoonForEachCoords || bestTime.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityQureshi = (moonElongation, moonAlt, moonAge, arcOfVision, w, lagTime, newMoonForEachCoords, bestTime, conjunction) => {
  const s = (arcOfVision - 10.4341759 + 5.42264313 * w - 0.2222075057 * Math.pow(w, 2) + 0.3519637 * Math.pow(w, 3)) / 10
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\ns: ${isNaN(s) ? '-' : s.toFixed(5)}\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (s >= 0.15 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (s >= 0.05 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#9EFF00'
  } else if (s >= -0.06 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FF783C'
  } else if (s >= -0.16 && bestTime.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FF0000'
  } else if (newMoonForEachCoords || bestTime.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityLAPAN = (moonElongation, moonAlt, moonAge, isMeetCriteria, lagTime, newMoonForEachCoords, sunset, conjunction) => {
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (isMeetCriteria && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (newMoonForEachCoords || sunset.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityShaukat = (moonElongation, moonAlt, moonAge, arcOfVision, areEqualsToValues, w, lagTime, newMoonForEachCoords, bestTime, conjunction) => {
  const q = (arcOfVision - (11.8371 - 6.3226 * w + 0.7319 * Math.pow(w, 2) - 0.1018 * Math.pow(w, 3))) / 10
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nq: ${isNaN(q) ? '-' : q.toFixed(5)}\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (q >= 0.27 && bestTime.date > conjunction.date && !newMoonForEachCoords && !areEqualsToValues) {
    color = '#00FF3E'
  } else if (q >= -0.024 && bestTime.date > conjunction.date && !newMoonForEachCoords && !areEqualsToValues) {
    color = '#9EFF00'
  } else if (q >= -0.212 && bestTime.date > conjunction.date && !newMoonForEachCoords && !areEqualsToValues) {
    color = '#FF783C'
  } else if (q >= -0.48 && bestTime.date > conjunction.date && !newMoonForEachCoords && !areEqualsToValues) {
    color = '#FF0000'
  } else if (q >= -0.48 && bestTime.date > conjunction.date && !newMoonForEachCoords && areEqualsToValues) {
    color = '#FAFF00'
  } else if (newMoonForEachCoords || bestTime.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityTurkey = (moonElongation, moonAlt, moonAge, isMeetCriteria, isSunsetAtMidnight, isFajrAtSunset, lagTime, newMoonForEachCoords, sunset, conjunction) => {
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (isMeetCriteria && sunset.date > conjunction.date && !newMoonForEachCoords && !isSunsetAtMidnight && !isFajrAtSunset) {
    color = '#00FF3E'
  } else if (isSunsetAtMidnight) {
    color = '#0303FC'
  } else if (isFajrAtSunset) {
    color = '#FC5203'
  }else if ((newMoonForEachCoords || sunset.date < conjunction.date) && !isSunsetAtMidnight && !isFajrAtSunset) {
    color = '#000000'
  } else if (lagTime < 0 && !isSunsetAtMidnight && !isFajrAtSunset) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityMABIMS = (moonElongation, moonAlt, moonAge, isMeetCriteria, lagTime, newMoonForEachCoords, sunset, conjunction) => {
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (isMeetCriteria && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (newMoonForEachCoords || sunset.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const calculateVisibilityLFNU = (moonElongation, moonAlt, moonAge, isMeetQRNUCriteria, isMeetIRNUCriteria, lagTime, newMoonForEachCoords, sunset, conjunction) => {
  let tooltip = moonElongation ? `Elongation: ${moonElongation.toFixed(5)}°\nAltitude: ${moonAlt?.toFixed(5)}°\nAge (Geocentric): ${isNaN(moonAge) ? '-' : moonAge} days` : ''
  let color = ''
  if (isMeetQRNUCriteria && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#00FF3E'
  } else if (isMeetIRNUCriteria && sunset.date > conjunction.date && !newMoonForEachCoords) {
    color = '#FFFF00'
  } else if (newMoonForEachCoords || sunset.date < conjunction.date) {
    color = '#000000'
  } else if (lagTime < 0) {
    color = '#808080'
  }
  return { tooltip, color }
}

const checkDanjon = (conjunction, astroDate, latitude, longitude, elongationType, observationTime) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  let bestTime = sunset
  // Observation Time = 0: at Sunset, Observation Time = 1: at Best Time
  if (lagTime >= 0 && observationTime === 1) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const arcOfLight = elongationType === 0 ? Elongation(Body.Moon, bestTime).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (bestTime.ut - SearchMoonPhase(0, bestTime, -30).ut).toFixed(5)
  let isMeetCriteria = false
  if (arcOfLight >= 7) isMeetCriteria = true
  return calculateVisibilityDanjon(arcOfLight, moonAge, isMeetCriteria, bestTime, conjunction)
}

const checkYallop = (conjunction, astroDate, latitude, longitude, observationTime, correctedRefraction) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0 && observationTime === 1) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const moonElongationGeocentric = Elongation(Body.Moon, bestTime).elongation
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(DEG2RAD * moonHorizon.altitude) * Math.sin(DEG2RAD * lunarParallax / 60))
  const arcOfLight = DEG2RAD * moonElongationGeocentric
  const moonAge = (bestTime.ut - SearchMoonPhase(0, bestTime, -30).ut).toFixed(5)
  const geomoon = GeoVector(Body.Moon, bestTime, true)
  const geosun = GeoVector(Body.Sun, bestTime, true)
  const rot = Rotation_EQJ_EQD(bestTime)
  const rotmoon = RotateVector(rot, geomoon)
  const rotsun = RotateVector(rot, geosun)
  const meq = EquatorFromVector(rotmoon)
  const seq = EquatorFromVector(rotsun)
  const mhor = Horizon(bestTime, observer, meq.ra, meq.dec)
  const shor = Horizon(bestTime, observer, seq.ra, seq.dec)
  const arcOfVision = mhor.altitude - shor.altitude
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcOfLight))
  const newMoonForEachCoords = SearchMoonPhase(0, bestTime, 1)
  return calculateVisibilityYallop(arcOfVision, moonElongationGeocentric, mhor.altitude, moonAge, wTopocentric, lagTime, newMoonForEachCoords, bestTime, conjunction)
}

const checkSAAO = (conjunction, astroDate, latitude, longitude, correctedRefraction) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  const moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (sunset.ut - SearchMoonPhase(0, sunset, -30).ut).toFixed(5)
  const newMoonForEachCoords = SearchMoonPhase(0, sunset, 1)
  return calculateVisibilitySAAO(moonHorizon.altitude, moonElongationTopocentric, moonAge, lagTime, newMoonForEachCoords, sunset, conjunction)
}

const checkOdeh = (conjunction, astroDate, latitude, longitude, observationTime, correctedRefraction) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0 && observationTime === 1) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, correctedRefraction)
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(DEG2RAD * moonHorizon.altitude) * Math.sin(DEG2RAD * lunarParallax / 60))
  const arcOfLight = DEG2RAD * moonElongationTopocentric
  const deltaAzimuth = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcOfLight) / Math.cos(DEG2RAD * deltaAzimuth)
  let arcOfVision
  if (-1 <= cosARCV <= 1) {
    arcOfVision = RAD2DEG * Math.acos(cosARCV)
  } else if (cosARCV < -1) {
    arcOfVision = RAD2DEG * Math.acos(-1)
  } else {
    arcOfVision = RAD2DEG * Math.acos(1)
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcOfLight))
  const newMoonForEachCoords = SearchMoonPhase(0, bestTime, 1)
  const moonAge = (bestTime.ut - SearchMoonPhase(0, bestTime, -30).ut).toFixed(5)
  return calculateVisibilityOdeh(moonElongationTopocentric, moonHorizon.altitude, moonAge, arcOfVision, wTopocentric, lagTime, newMoonForEachCoords, bestTime, conjunction)
}

const checkQureshi = (conjunction, astroDate, latitude, longitude, observationTime, correctedRefraction) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0 && observationTime === 1) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, correctedRefraction)
  const moonElongationTopocentric = AngleBetween(sunEquator.vec, moonEquator.vec)
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(DEG2RAD * moonHorizon.altitude) * Math.sin(DEG2RAD * lunarParallax / 60))
  const arcOfLight = DEG2RAD * moonElongationTopocentric
  const deltaAzimuth = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcOfLight) / Math.cos(DEG2RAD * deltaAzimuth)
  let arcOfVision
  if (-1 <= cosARCV <= 1) {
    arcOfVision = RAD2DEG * Math.acos(cosARCV)
  } else if (cosARCV < -1) {
    arcOfVision = RAD2DEG * Math.acos(-1)
  } else {
    arcOfVision = RAD2DEG * Math.acos(1)
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcOfLight))
  const newMoonForEachCoords = SearchMoonPhase(0, bestTime, 1)
  const moonAge = (bestTime.ut - SearchMoonPhase(0, bestTime, -30).ut).toFixed(5)
  return calculateVisibilityQureshi(moonElongationTopocentric, moonHorizon.altitude, moonAge, arcOfVision, wTopocentric, lagTime, newMoonForEachCoords, bestTime, conjunction)
}

const checkLAPAN = (conjunction, astroDate, latitude, longitude, elongationType, altitudeType, correctedRefraction) => {
  let moonEquator
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  if (altitudeType === 0) {
    moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
  } else {
    moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  }
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (sunset.ut - SearchMoonPhase(0, sunset, -30).ut).toFixed(5)
  let isMeetCriteria = false
  if (moonElongation > 6.4 && moonHorizon.altitude > 4) isMeetCriteria = true
  const newMoonForEachCoords = SearchMoonPhase(0, sunset, 1)
  return calculateVisibilityLAPAN(moonElongation, moonHorizon.altitude, moonAge, isMeetCriteria, lagTime, newMoonForEachCoords, sunset, conjunction)
}

const checkShaukat = (conjunction, astroDate, latitude, longitude, observationTime, correctedRefraction, steps) => {
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  let bestTime = sunset
  const lagTime = moonset.ut - sunset.ut
  if (lagTime >= 0 && observationTime === 1) bestTime = MakeTime(sunset.ut + lagTime * 4/9)
  const moonEquator = Equator(Body.Moon, bestTime, observer, true, true)
  const moonHorizon = Horizon(bestTime, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, bestTime, observer, true, true)
  const sunHorizon = Horizon(bestTime, observer, sunEquator.ra, sunEquator.dec, correctedRefraction)
  const moonElongationGeocentric = Elongation(Body.Moon, bestTime).elongation
  const semiDiameter = Libration(bestTime).diam_deg * 60 / 2
  const lunarParallax = semiDiameter / 0.27245
  const semiDiameterTopocentric = semiDiameter * (1 + Math.sin(DEG2RAD * moonHorizon.altitude) * Math.sin(DEG2RAD * lunarParallax / 60))
  const arcOfLight = DEG2RAD * moonElongationGeocentric
  const deltaAzimuth = sunHorizon.azimuth - moonHorizon.azimuth
  const cosARCV = Math.cos(arcOfLight) / Math.cos(DEG2RAD * deltaAzimuth)
  let arcOfVision
  if (-1 <= cosARCV <= 1) {
    arcOfVision = RAD2DEG * Math.acos(cosARCV)
  } else if (cosARCV < -1) {
    arcOfVision = RAD2DEG * Math.acos(-1)
  } else {
    arcOfVision = RAD2DEG * Math.acos(1)
  }
  const wTopocentric = semiDiameterTopocentric * (1 - Math.cos(arcOfLight))
  let areEqualsToValues = false
  if (moonElongationGeocentric > 8 - steps * 2 / 100 && moonElongationGeocentric < 8 + steps * 2 / 100) areEqualsToValues = true
  const newMoonForEachCoords = SearchMoonPhase(0, bestTime, 1)
  const moonEquatorGeocentric = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(bestTime), GeoVector(Body.Moon, bestTime, true)))
  const moonHorizonGeocentric = Horizon(bestTime, observer, moonEquatorGeocentric.ra, moonEquatorGeocentric.dec, correctedRefraction)
  const moonAge = (bestTime.ut - SearchMoonPhase(0, bestTime, -30).ut).toFixed(5)
  return calculateVisibilityShaukat(moonElongationGeocentric, moonHorizonGeocentric.altitude, moonAge, arcOfVision, areEqualsToValues, wTopocentric, lagTime, newMoonForEachCoords, bestTime, conjunction)
}

const checkTurkey = (conjunction, astroDate, latitude, longitude, elongationType, altitudeType, correctedRefraction, steps) => {
  let moonEquator
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  if (altitudeType === 0) {
    moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
  } else {
    moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  }
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  const moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (sunset.ut - SearchMoonPhase(0, sunset, -30).ut).toFixed(5)
  const observerFromNewZealand = observerFromEarth(-41.2889, 174.7772, 0)
  const fajrAtWellington = SearchAltitude(Body.Sun, observerFromNewZealand, +1, correctedDate, 2, -18)
  let isMeetCriteria = false
  let isSunsetAtMidnight = false
  let isFajrAtSunset = false
  if (moonElongation >= 8 && moonHorizon.altitude >= 5) isMeetCriteria = true
  if ((sunset.date.getUTCHours() === 0 && sunset.date.getUTCMinutes() < steps * 3) || (sunset.date.getUTCHours() === 23 && sunset.date.getUTCMinutes() > 60 - steps * 3)) isSunsetAtMidnight = true
  if (Math.abs(fajrAtWellington.date - sunset.date) / 1000 <= steps * 150) isFajrAtSunset = true
  const newMoonForEachCoords = SearchMoonPhase(0, sunset, 1)
  return calculateVisibilityTurkey(moonElongation, moonHorizon.altitude, moonAge, isMeetCriteria, isSunsetAtMidnight, isFajrAtSunset, lagTime, newMoonForEachCoords, sunset, conjunction)
}

const checkMABIMS = (conjunction, astroDate, latitude, longitude, elongationType, altitudeType, correctedRefraction) => {
  let moonEquator
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  if (altitudeType === 0) {
    moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
  } else {
    moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  }
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  const moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (sunset.ut - SearchMoonPhase(0, sunset, -30).ut).toFixed(5)
  let isMeetCriteria = false
  if (moonElongation >= 6.4 && moonHorizon.altitude >= 3) isMeetCriteria = true
  const newMoonForEachCoords = SearchMoonPhase(0, sunset, 1)
  return calculateVisibilityMABIMS(moonElongation, moonHorizon.altitude, moonAge, isMeetCriteria, lagTime, newMoonForEachCoords, sunset, conjunction)
}

const checkLFNU = (conjunction, astroDate, latitude, longitude, elongationType, altitudeType, correctedRefraction) => {
  let moonEquator
  const observer = observerFromEarth(latitude, longitude, 0)
  const correctedDate = astroDate.AddDays(-longitude / 360)
  const sunset = SearchRiseSet(Body.Sun, observer, -1, correctedDate, 1, 0)
  const moonset = SearchRiseSet(Body.Moon, observer, -1, correctedDate, 1, 0)
  if (!sunset || !moonset) return {}
  const lagTime = moonset.ut - sunset.ut
  if (altitudeType === 0) {
    moonEquator = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(sunset), GeoVector(Body.Moon, sunset, true)))
  } else {
    moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  }
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, correctedRefraction)
  const sunEquator = Equator(Body.Sun, sunset, observer, true, true)
  const moonElongation = elongationType === 0 ? Elongation(Body.Moon, sunset).elongation : AngleBetween(sunEquator.vec, moonEquator.vec)
  const moonAge = (sunset.ut - SearchMoonPhase(0, sunset, -30).ut).toFixed(5)
  let isMeetQRNUCriteria = false
  let isMeetIRNUCriteria = false
  if (moonElongation >= 9.9 && moonHorizon.altitude >= 3) isMeetQRNUCriteria = true
  if (moonElongation >= 6.4 && moonHorizon.altitude >= 3) isMeetIRNUCriteria = true
  const newMoonForEachCoords = SearchMoonPhase(0, sunset, 1)
  return calculateVisibilityLFNU(moonElongation, moonHorizon.altitude, moonAge, isMeetQRNUCriteria, isMeetIRNUCriteria, lagTime, newMoonForEachCoords, sunset, conjunction)
}

const createZones = (criteria, elongationType, altitudeType, observationTime, correctedRefraction, conjunction, astroDate, lat, lng, steps) => {
  let result
  if (criteria === 0) {
    result = checkDanjon(conjunction, astroDate, lat, lng, elongationType, observationTime)
  } else if (criteria === 1) {
    result = checkYallop(conjunction, astroDate, lat, lng, observationTime, correctedRefraction)
  } else if (criteria === 2) {
    result = checkSAAO(conjunction, astroDate, lat, lng, correctedRefraction)
  } else if (criteria === 3) {
    result = checkOdeh(conjunction, astroDate, lat, lng, observationTime, correctedRefraction)
  } else if (criteria === 4) {
    result = checkQureshi(conjunction, astroDate, lat, lng, observationTime, correctedRefraction)
  } else if (criteria === 5) {
    result = checkLAPAN(conjunction, astroDate, lat, lng, elongationType, altitudeType, correctedRefraction)
  } else if (criteria === 6) {
    result = checkShaukat(conjunction, astroDate, lat, lng, observationTime, correctedRefraction, steps)
  } else if (criteria === 7) {
    result = checkTurkey(conjunction, astroDate, lat, lng, elongationType, altitudeType, correctedRefraction, steps)
  } else if (criteria === 8) {
    result = checkMABIMS(conjunction, astroDate, lat, lng, elongationType, altitudeType, correctedRefraction)
  } else {
    result = checkLFNU(conjunction, astroDate, lat, lng, elongationType, altitudeType, correctedRefraction)
  }
  if (result?.tooltip?.length > 0) {
    return {
      tooltip: result.tooltip,
      color: result.color
    }
  }
}

const gridSearchLongitude = (conjunction, astroDate, criteria, elongationType, altitudeType, observationTime, correctedRefraction, shownTooltip, steps) => {
  const results = []
  for (let lat = 60; lat >= -60; lat -= steps) {
    let currentRun = null
    for (let lng = -180; lng < 180; lng += steps) {
      let result = createZones(criteria, elongationType, altitudeType, observationTime, correctedRefraction, conjunction, astroDate, lat, lng, steps)
      const color = result?.color || ''
      const width = steps * 100 / 360
      const xPosition = 100 * (180 + lng) / 360
      const yPosition = 100 * (90 - lat) / 180
      if (shownTooltip) {
        currentRun = {
          xPos: xPosition,
          yPos: yPosition,
          width: width,
          height: steps * 100 / 180,
          color: color,
          tooltip: result?.tooltip || ''
        }
        if (currentRun && result?.tooltip?.length > 0) {
          results.push(currentRun)
          currentRun = null
        }
      } else {
        if (color) {
          if (currentRun && currentRun.color === color && true) {
            currentRun.width += width
          } else {
            if (currentRun && result?.tooltip?.length > 0) results.push(currentRun)
            currentRun = {
              xPos: xPosition,
              yPos: yPosition,
              width: width,
              height: steps * 100 / 180,
              color: color,
              tooltip: result?.tooltip || ''
            }
          }
        } else {
          if (currentRun && result?.tooltip?.length > 0) {
            results.push(currentRun)
            currentRun = null
          }
        }
      }
      result = null
    }
    if (currentRun) {
      results.push(currentRun)
      currentRun = null
    }
  }
  return results
}

const addZeroPad = value => (value >= 0 && value < 10) ? `0${value}` : value

const addZeroPadForYear = value => {
  if (Math.abs(value) < 10) {
    return `000${value}`
  } else if (Math.abs(value) < 100) {
    return `00${value}`
  } else if (Math.abs(value) < 1000) {
    return `0${value}`
  } else {
    return value
  }
}

const getConjunctionDate = observationDate => {
  const dateBeforeConjunction = new Date(observationDate.setDate(observationDate.getDate() - 2))
  return SearchMoonPhase(0, dateBeforeConjunction, 5)
}

const getMoonCrescentVisibility = (observationDate, timeZone, criteria, elongationType, altitudeType, observationTime, correctedRefraction, shownTooltip, steps) => {
  const startDate = new Date(`${getIsoDateStrBasedTimeZone(observationDate, timeZone)}T00:00:00Z`)
  const observationStartDate = new Date(`${addZeroPadForYear(observationDate.getFullYear())}-${addZeroPad(observationDate.getMonth() + 1)}-${addZeroPad(observationDate.getDate())}T00:00:00`)
  const astroDate = MakeTime(startDate)
  const conjunction = getConjunctionDate(observationDate)
  return {
    zoneCoordinates: gridSearchLongitude(conjunction, astroDate, criteria, elongationType, altitudeType, observationTime, correctedRefraction, shownTooltip, steps),
    conjunction: conjunction?.date,
    observationDate: observationStartDate
  }
}

const getGlobalSolarEclipse = date => {
  const astroDate = MakeTime(date)
  const globalSolarEclipse = SearchGlobalSolarEclipse(astroDate)
  return {
    distance: globalSolarEclipse.distance || 0,
    kind: globalSolarEclipse.kind || '',
    latitude: globalSolarEclipse.latitude || 0,
    longitude: globalSolarEclipse.longitude || 0,
    obscuration: globalSolarEclipse.obscuration || 0,
    peak: globalSolarEclipse.peak.date || 0,
    nextDate: globalSolarEclipse.peak.AddDays(1).date || 0,
  }
}

const getLocalSolarEclipse = (date, latitude, longitude, elevation) => {
  const astroDate = MakeTime(date)
  const observer = observerFromEarth(latitude, longitude, elevation)
  const localSolarEclipse = SearchLocalSolarEclipse(astroDate, observer)
  return {
    kind: localSolarEclipse.kind || '',
    obscuration: localSolarEclipse.obscuration || 0,
    partialBeginAltitude: localSolarEclipse.partial_begin.altitude || 0,
    partialBeginTime: localSolarEclipse.partial_begin.time.date || 0,
    partialEndAltitude: localSolarEclipse.partial_end.altitude || 0,
    partialEndTime: localSolarEclipse.partial_end.time.date || 0,
    peakAltitude: localSolarEclipse.peak.altitude || 0,
    peakTime: localSolarEclipse.peak.time.date || 0,
    totalBeginAltitude: localSolarEclipse.total_begin?.altitude || 0,
    totalBeginTime: localSolarEclipse.total_begin?.time?.date || 0,
    totalEndAltitude: localSolarEclipse.total_end?.altitude || 0,
    totalEndTime: localSolarEclipse.total_end?.time?.date || 0,
    nextDate: localSolarEclipse.partial_end.time.AddDays(1).date || 0
  }
}

const checkMoonVisibility = (astroTime, latitude, longitude, elevation) => {
  const observer = observerFromEarth(latitude, longitude, elevation)
  const moonEquator = Equator(Body.Moon, astroTime, observer, true, true)
  return Horizon(astroTime, observer, moonEquator.ra, moonEquator.dec, "normal").altitude > 0
}

const getLunarEclipse = (date, latitude, longitude, elevation) => {
  const astroDate = MakeTime(date)
  const lunarEclipse = SearchLunarEclipse(astroDate)
  const penumbralBeginTime = lunarEclipse.peak.AddDays(-lunarEclipse.sd_penum / 1440)
  const penumbralEndTime = lunarEclipse.peak.AddDays(lunarEclipse.sd_penum / 1440)
  const partialBeginTime = lunarEclipse.peak.AddDays(-lunarEclipse.sd_partial / 1440)
  const partialEndTime = lunarEclipse.peak.AddDays(lunarEclipse.sd_partial / 1440)
  const totalBeginTime = lunarEclipse.peak.AddDays(-lunarEclipse.sd_total / 1440)
  const totalEndTime = lunarEclipse.peak.AddDays(lunarEclipse.sd_total / 1440)
  const isPenumbralBeginVisible = checkMoonVisibility(penumbralBeginTime, latitude, longitude, elevation)
  const isPenumbralEndVisible = checkMoonVisibility(penumbralEndTime, latitude, longitude, elevation)
  const isPartialBeginVisible = checkMoonVisibility(partialBeginTime, latitude, longitude, elevation)
  const isPartialEndVisible = checkMoonVisibility(partialEndTime, latitude, longitude, elevation)
  const isTotalBeginVisible = checkMoonVisibility(totalBeginTime, latitude, longitude, elevation)
  const isTotalEndVisible = checkMoonVisibility(totalEndTime, latitude, longitude, elevation)
  const isPeakTimeVisible = checkMoonVisibility(lunarEclipse.peak, latitude, longitude, elevation)
  return {
    kind: lunarEclipse.kind || '',
    obscuration: lunarEclipse.obscuration || 0,
    penumbralBeginTime: penumbralBeginTime.date || 0,
    partialBeginTime: partialBeginTime.date || 0,
    totalBeginTime: totalBeginTime.date || 0,
    peak: lunarEclipse.peak.date || 0,
    totalEndTime: totalEndTime.date || 0,
    partialEndTime: partialEndTime.date || 0,
    penumbralEndTime: penumbralEndTime.date || 0,
    isPenumbralBeginVisible,
    isPartialBeginVisible,
    isTotalBeginVisible,
    isPeakTimeVisible,
    isTotalEndVisible,
    isPartialEndVisible,
    isPenumbralEndVisible,
    partialDuration: lunarEclipse.sd_partial * 2 - lunarEclipse.sd_total * 2 || 0,
    penumbralDuration: lunarEclipse.sd_penum * 2 - lunarEclipse.sd_partial * 2 || 0,
    totalDuration: lunarEclipse.sd_total * 2 || 0,
    nextDate: lunarEclipse.peak.AddDays(1).date || 0
  }
}

const convertMinutesToTime = (time, hrs, mins, secs) => {
  const hours = Math.floor(time / 60)
  const minutes = Math.floor(time % 60)
  const seconds = Math.floor((time * 60) % 60)
  return `${hours} ${hrs} ${minutes} ${mins} ${seconds} ${secs}`
}

const coordinateScale = {
  latitudes: [60, 30, 0, -30, -60],
  longitudes: [150, 120, 90, 60, 30, 0, -30, -60, -90, -120, -150]
}

export { isStorageExist, pages, getTimeZoneList, getIsoDateStrBasedTimeZone, getCalendarData, getHijriDate, adjustedIslamicDate, getCitiesByName, getNearestCity, getElementContent, getMoonInfos, getQiblaDirection, getQiblaDistance, prayerTimesCorrection, getPrayerTimes, getSunInfos, addZeroPad, getMoonCrescentVisibility, getGlobalSolarEclipse, getLocalSolarEclipse, getLunarEclipse, convertMinutesToTime, coordinateScale }