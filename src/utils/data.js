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

const calculateNewMoon = (startDate, latitude, longitude, elevation, criteria) => {
  const observer = new Observer(latitude, longitude, elevation)
  let date = startDate
  let newMoonDate
  let newMoon
  let moonElongation
  let dateInNewMoon
  let sunset
  let moonEquator
  let moonHorizon
  if (criteria === '0') {
    while (true) {
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      moonElongation = Elongation(Body.Moon, sunset)
      moonEquator = Equator(Body.Moon, sunset, observer, true, true)
      moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, 'normal')
      if (moonElongation.elongation >= 6.4 && moonHorizon.altitude >= 3) {
        console.log('Meet MABIMS Criteria:', `New Moon: ${newMoon.date}, Elongation: ${moonElongation.elongation}, Altitude: ${moonHorizon.altitude}`)
        return newMoonDate
      } else {
        console.log('Doesn\'t meet MABIMS Criteria:', `New Moon: ${newMoon.date}, Elongation: ${moonElongation.elongation}, Altitude: ${moonHorizon.altitude}`)
        return newMoonDate.AddDays(1)
      }
    }
  } else {
    do {
      newMoon = SearchMoonPhase(0, date, -30)
      date = new AstroTime(newMoon.date)
      dateInNewMoon = new Date(newMoon.date.getFullYear(), newMoon.date.getMonth(), newMoon.date.getDate())
      newMoonDate = new AstroTime(dateInNewMoon)
      sunset = SearchRiseSet(Body.Sun, observer, -1, newMoonDate, 1, elevation)
      if (newMoon.date < sunset.date) {
        console.log('Meet KHGT Criteria:', `New Moon: ${newMoon.date}, Sunset: ${sunset.date}`)
        return newMoonDate
      } else {
        console.log('Doesn\'t meet KHGT Criteria:', `New Moon: ${newMoon.date}, Sunset: ${sunset.date}`)
        return newMoonDate.AddDays(1)
      }
    } while (true)
  }
}

const getCalendarData = (gregorianDate, latitude, longitude, elevation, criteria) => {
  const newMoons = []
  const gregorianFirstDate = new Date(gregorianDate.getFullYear(), 0, 1)
  const startGregorianDate = new Date(`${gregorianDate.getFullYear()}-12-31T23:59:59Z`)
  let startDate = new AstroTime(startGregorianDate)
  let newMoonDate = gregorianFirstDate
  console.log(newMoonDate.getFullYear(), gregorianFirstDate.getFullYear());
  while (newMoonDate.getFullYear() === gregorianFirstDate.getFullYear()) {
    newMoonDate = new Date(calculateNewMoon(startDate, latitude, longitude, elevation, criteria).date)
    newMoons.push(newMoonDate)
    startDate = new AstroTime(newMoonDate)
    startDate = startDate.AddDays(-28)
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
  newMoons.reverse().forEach((moonDate, index) => {
    let hijriDayCounter = 1
    let nextMoonIndex = 0
    months.forEach((month, monthIdx) => {
      month.forEach((dayObj, dayIdx) => {
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
      const lastYearDaysOffset = Math.floor((gregorianFirstDate - newMoons[0]) / (1000 * 3600 * 24))
      hijriDayCounter = lastYearDaysOffset
      const currentYearDaysOffset = Math.floor((newMoons[1] - gregorianFirstDate) / (1000 * 3600 * 24))
      console.log(lastYearDaysOffset, currentYearDaysOffset);
      for (let i = 0; i <= currentYearDaysOffset; i++) {
        if (months[0][i] !== null) {
          months[0][i].hijri = hijriDayCounter++
        }
      }
      hijriDayCounter = 1
    }
  })
  return months
}

const adjustedIslamicDate = (currentDate, latitude, longitude, elevation, criteria) => {
  const currentTime = new AstroTime(currentDate)
  const currentNewMoonTime = SearchMoonPhase(0, currentTime, 30)
  const observer = new Observer(latitude, longitude, elevation)
  const currentNewMoonDateTime = new Date(currentNewMoonTime.date.getFullYear(), currentNewMoonTime.date.getMonth(), currentNewMoonTime.date.getDate())
  const sunset = SearchRiseSet(Body.Sun, observer, -1, currentNewMoonDateTime, 1, elevation)
  const nextNewMoonTime = SearchMoonPhase(0, currentNewMoonTime, 30)
  const daysBetweenNewMoons = (nextNewMoonTime.date - currentNewMoonTime.date) / 86400000
  const moonEquator = Equator(Body.Moon, sunset, observer, true, true)
  const moonHorizon = Horizon(sunset, observer, moonEquator.ra, moonEquator.dec, 'normal')
  const elongation = AngleFromSun(Body.Moon, currentNewMoonTime)
  let islamicMonthLength = 30
  if (daysBetweenNewMoons < 30) islamicMonthLength = 29
  let islamicDateOffset = 0
  if (criteria === "0") {
    if (moonHorizon.altitude >= 3 && elongation >= 6.4) islamicDateOffset = 0
    else islamicDateOffset = 1
  } else {
    if (currentNewMoonTime.date < sunset.date) islamicDateOffset = 0
    else islamicDateOffset = 1
  }
  const islamicDate = new Date()
  islamicDate.setDate(currentDate.getDate() + islamicDateOffset)
  const islamicDay = islamicDate.getDate()
  if (islamicDay > islamicMonthLength) islamicDate.setDate(islamicDay - 1)
  return islamicDate
}

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

export { isStorageExist, pages, getCalendarData, adjustedIslamicDate, prayerTimesCorrection }