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

const prayerTimesCorrection = () => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

export { isStorageExist, pages, prayerTimesCorrection }