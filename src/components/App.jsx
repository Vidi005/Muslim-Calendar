import React from "react"
import i18n from "../utils/localization"
import { isStorageExist } from "../utils/data"
import { Helmet } from "react-helmet"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import NoPage from "./pages/empty/NoPage"
import { HomePageProvider } from "./contexts/HomPageContext"
import Swal from "sweetalert2"
import PrayerTimesPage from "./pages/prayer_times/PrayerTimesPage"
import MoonCrescentMapPage from "./pages/moon_crescent_map/MoonCrescentMapPage"
import en from "./../locales/en.json"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      SIDEBAR_STATE_STORAGE_KEY: 'SIDEBAR_STATE_STORAGE_KEY',
      LANGUAGE_STORAGE_KEY: 'LANGUAGE_STORAGE_KEY',
      DARK_MODE_STORAGE_KEY: 'DARK_MODE_STORAGE_KEY',
      TOOLBAR_STATE_STORAGE_KEY: 'TOOLBAR_STATE_STORAGE_KEY',
      LOCATION_STATE_STORAGE_KEY: 'LOCATION_STATE_STORAGE_KEY',
      CRITERIA_STORAGE_KEY: 'CRITERIA_STORAGE_KEY',
      TIMEZONE_STORAGE_KEY: 'TIMEZONE_STORAGE_KEY',
      INTERVAL_UPDATES_STORAGE_KEY: 'INTERVAL_UPDATES_STORAGE_KEY',
      CALCULATION_METHOD_STORAGE_KEY: 'CALCULATION_METHOD_STORAGE_KEY',
      ASHR_TIME_STORAGE_KEY: 'ASHR_TIME_STORAGE_KEY',
      CONVENTION_STORAGE_KEY: 'CONVENTION_STORAGE_KEY',
      IHTIYATH_STORAGE_KEY: 'IHTIYATH_STORAGE_KEY',
      CORRECTIONS_STORAGE_KEY: 'CORRECTIONS_STORAGE_KEY',
      DHUHA_METHOD_STORAGE_KEY: 'DHUHA_METHOD_STORAGE_KEY',
      INPUT_SUN_ALTITUDE_STORAGE_KEY: 'INPUT_SUN_ALTITUDE_STORAGE_KEY',
      INPUT_MINUTES_STORAGE_KEY: 'INPUT_MINUTES_STORAGE_KEY',
      FORMULA_STORAGE_KEY: 'FORMULA_STORAGE_KEY',
      MOON_VISIBILITY_CRITERIA_STORAGE_KEY: 'MOON_VISIBILITY_CRITERIA_STORAGE_KEY',
      COORDINATE_STEPS_STORAGE_KEY: 'COORDINATE_STEPS_STORAGE_KEY',
      selectedLanguage: 'en',
      currentDate: {},
      seconds: 0,
      inputDate: '',
      inputTime: '',
      formattedDateTime: new Date(),
      inputLocation: '',
      suggestedLocations: [],
      latitude: 0,
      longitude: 0,
      elevation: 0,
      selectedLocation: {},
      selectedCriteria: 0,
      nearestCity: '',
      selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      selectedIntervalUpdate: 1,
      selectedCalculationMethod: 0,
      selectedAshrTime: 0,
      selectedConvention: 0,
      sunAltitude: en.conventions[0].sun_altitude,
      selectedIhtiyath: 2,
      selectedCorrections: Array(en.prayer_names.length).fill(0),
      selectedDhuhaMethod: 0,
      inputSunAltitude: 4.5,
      inputMinutes: 18,
      selectedFormula: 0,
      monthsInSetYear: [],
      monthsInCurrentYear: [],
      tooltipId: '',
      hijriEventDates: [],
      moonInfos: [],
      prayerTimes: [],
      nextPrayerInfo: '',
      hijriStartDates: [],
      moonCrescentVisibility: [],
      selectedMoonVisibilityCriteria: 1,
      selectedCoordinateSteps: 3,
      arePrayerTimesLoading: true,
      isSidebarExpanded: true,
      isToolbarShown: true,
      isCalendarLoading: true,
      areMoonInfosLoading: true,
      isMoonCrescentVisibilityMapLoading: true,
      isGettingCoordinates: false,
      isGeocoding: false,
      isSearching: false,
      isDarkMode: false
    }
    this.animationFrame = null
    this.lastTime = performance.now()
    this.sliderRef = React.createRef()
    this.calendarContainerRef = React.createRef()
    this.tooltipRef = React.createRef()
    this.debounceTimeout = null
  }

  componentDidMount() {
    this.checkBrowserStorage()
    this.startTimers()
  }

  componentDidUpdate(_prevProps, prevState) {
    document.body.classList.toggle('dark', this.state.isDarkMode)
    if (prevState.seconds !== this.state.seconds && this.state.inputDate === '' && this.state.inputTime === '') {
      if (this.state.selectedIntervalUpdate === 3 && this.state.seconds % 60 === 0) {
        this.formatDateTime()
      } else if (this.state.selectedIntervalUpdate === 2 && this.state.seconds % 30 === 0) {
        this.formatDateTime()     
      } else if (this.state.selectedIntervalUpdate === 1 && this.state.seconds % 15 === 0) {
        this.formatDateTime()
      } else if (this.state.selectedIntervalUpdate === 0 && this.state.seconds % 5 === 0) {
        this.formatDateTime()
      }
    }
    if (this.state.currentDate?.time && this.state.inputTime !== '') {
      if (this.state.currentDate.time.includes('00:00:00')) {
        this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
      }
    }
  }

  componentWillUnmount() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
  }

  startTimers = () => {
    this.lastTime = performance.now()
    this.tick()
  }

  tick = () => {
    const now = performance.now()
    const elapsed = now - this.lastTime
    if (elapsed >= 1000) {
      this.getCurrentDate()
      this.createPrayerTimeCountdown()
      this.lastTime += 1000
    }
    this.animationFrame = requestAnimationFrame(this.tick)
  }

  checkBrowserStorage() {
    isStorageExist(i18n.t('browser_warning'))
    if (isStorageExist('')) {
      this.checkSidebarState()
      this.checkDisplayMode()
      this.checkLanguageData()
      this.checkToolbarState()
      this.checkSavedLocation()
      this.checkSavedCriteria()
      this.checkSavedTimeZone()
      this.checkSavedIntervalUpdates()
      this.checkSavedCalculationMethod()
      this.checkSavedAshrTime()
      this.checkSavedConvention()
      this.checkSavedIhtiyath()
      this.checkSavedCorrections()
      this.checkSavedDhuhaMethod()
      this.checkSavedInputtedSunAltitude()
      this.checkSavedInputtedMinutes()
      this.checkSavedFormula()
      this.checkSavedMoonVisibilityCriteria()
      this.checkSavedCoordinateSteps()
    }
  }

  checkSidebarState () {
    const getSidebarStateFromLocal = localStorage.getItem(this.state.SIDEBAR_STATE_STORAGE_KEY)
    try {
      const parsedSidebarState = JSON.parse(getSidebarStateFromLocal)
      if (parsedSidebarState !== null) {
        this.setState({ isSidebarExpanded: parsedSidebarState })
      }
    } catch (error) {
      localStorage.removeItem(this.state.SIDEBAR_STATE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkToolbarState () {
    const getToolbarStateFromLocal = localStorage.getItem(this.state.TOOLBAR_STATE_STORAGE_KEY)
    try {
      const parsedToolbarState = JSON.parse(getToolbarStateFromLocal)
      if (parsedToolbarState !== null) {
        this.setState({ isToolbarShown: parsedToolbarState })
      }
    } catch (error) {
      localStorage.removeItem(this.state.TOOLBAR_STATE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkDisplayMode () {
    const getDisplayModeFromLocal = localStorage.getItem(this.state.DARK_MODE_STORAGE_KEY)
    try {
      const parsedDisplayMode = JSON.parse(getDisplayModeFromLocal)
      if (parsedDisplayMode !== null) {
        this.setState({ isDarkMode: parsedDisplayMode })
      }
    } catch (error) {
      localStorage.removeItem(this.state.DARK_MODE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkLanguageData () {
    const getLanguageFromLocal = localStorage.getItem(this.state.LANGUAGE_STORAGE_KEY)
    try {
      const parsedLanguage = JSON.parse(getLanguageFromLocal)
      if (parsedLanguage !== null) {
        this.setState({ selectedLanguage: parsedLanguage }, () => this.changeLanguage(parsedLanguage))
      } else this.changeLanguage(this.state.selectedLanguage)
    } catch (error) {
      localStorage.removeItem(this.state.LANGUAGE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedLocation () {
    const getSavedLocationFromLocal = localStorage.getItem(this.state.LOCATION_STATE_STORAGE_KEY)
    try {
      const parsedSavedLocation = JSON.parse(getSavedLocationFromLocal)
      if (parsedSavedLocation !== null || parsedSavedLocation?.selectedLocation !== undefined) {
        this.setState({
          selectedLocation: parsedSavedLocation.selectedLocation,
          latitude: parsedSavedLocation?.latitude,
          longitude: parsedSavedLocation?.longitude,
          elevation: parsedSavedLocation?.elevation
        },() => this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility()))
      } else this.getCurrentLocation()
    } catch (error) {
      localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedCriteria () {
    const getSavedCriteriaFromLocal = localStorage.getItem(this.state.CRITERIA_STORAGE_KEY)
    try {
      const parsedSavedCriteria = JSON.parse(getSavedCriteriaFromLocal)
      if (parsedSavedCriteria !== null) this.setState({ selectedCriteria: parseInt(parsedSavedCriteria) })
    } catch (error) {
      localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedTimeZone () {
    const getSavedTimeZoneFromLocal = localStorage.getItem(this.state.TIMEZONE_STORAGE_KEY)
    try {
      const parsedSavedTimeZone = JSON.parse(getSavedTimeZoneFromLocal)
      if (parsedSavedTimeZone !== null) this.setState({ selectedTimeZone: parsedSavedTimeZone }, () => this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility()))
      else {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        this.setState({ selectedTimeZone: userTimeZone }, () => this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility()))
      }
    } catch (error) {
      localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedIntervalUpdates () {
    const getSavedIntervalUpdatesFromLocal = localStorage.getItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
    try {
      const parsedSavedIntervalUpdates = JSON.parse(getSavedIntervalUpdatesFromLocal)
      if (parsedSavedIntervalUpdates !== null) {
        this.setState({ selectedIntervalUpdate: parseInt(parsedSavedIntervalUpdates) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedCalculationMethod () {
    const getSavedCalculationMethodFromLocal = localStorage.getItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
    try {
      const parsedSavedCalculationMethod = JSON.parse(getSavedCalculationMethodFromLocal)
      if (parsedSavedCalculationMethod !== null) {
        this.setState({ selectedCalculationMethod: parseInt(parsedSavedCalculationMethod) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedAshrTime () {
    const getSavedAshrTimeFromLocal = localStorage.getItem(this.state.ASHR_TIME_STORAGE_KEY)
    try {
      const parsedSavedAshrTime = JSON.parse(getSavedAshrTimeFromLocal)
      if (parsedSavedAshrTime !== null) {
        this.setState({ selectedAshrTime: parseInt(parsedSavedAshrTime) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.ASHR_TIME_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedConvention () {
    const getSavedConventionFromLocal = localStorage.getItem(this.state.CONVENTION_STORAGE_KEY)
    try {
      const parsedSavedConvention = JSON.parse(getSavedConventionFromLocal)
      if (parsedSavedConvention !== null) {
        this.setState({
          selectedConvention: parseInt(parsedSavedConvention),
          sunAltitude: en.conventions[parseInt(parsedSavedConvention)].sun_altitude
        })
      }
    } catch (error) {
      localStorage.removeItem(this.state.CONVENTION_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }
  
  checkSavedIhtiyath () {
    const getSavedIhtiyathFromLocal = localStorage.getItem(this.state.IHTIYATH_STORAGE_KEY)
    try {
      const parsedSavedIhtiyath = JSON.parse(getSavedIhtiyathFromLocal)
      if (parsedSavedIhtiyath !== null) {
        this.setState({ selectedIhtiyath: parseInt(parsedSavedIhtiyath) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.IHTIYATH_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedCorrections () {
    const getSavedCorrectionsFromLocal = localStorage.getItem(this.state.CORRECTIONS_STORAGE_KEY)
    try {
      const parsedSavedCorrections = JSON.parse(getSavedCorrectionsFromLocal)
      if (parsedSavedCorrections !== null) {
        this.setState({ selectedCorrections: parsedSavedCorrections })
      }
    } catch (error) {
      localStorage.removeItem(this.state.CORRECTIONS_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedDhuhaMethod () {
    const getSavedDhuhaMethodFromLocal = localStorage.getItem(this.state.DHUHA_METHOD_STORAGE_KEY)
    try {
      const parsedSavedDhuhaMethod = JSON.parse(getSavedDhuhaMethodFromLocal)
      if (parsedSavedDhuhaMethod !== null) {
        this.setState({ selectedDhuhaMethod: parseInt(parsedSavedDhuhaMethod) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.DHUHA_METHOD_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedInputtedSunAltitude () {
    const getSavedInputtedSunAltitudeFromLocal = localStorage.getItem(this.state.INPUT_SUN_ALTITUDE_STORAGE_KEY)
    try {
      const parsedSavedInputtedSunAltitude = JSON.parse(getSavedInputtedSunAltitudeFromLocal)
      if (parsedSavedInputtedSunAltitude !== null) {
        this.setState({ inputSunAltitude: parseFloat(parsedSavedInputtedSunAltitude) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.INPUT_SUN_ALTITUDE_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedInputtedMinutes () {
    const getSavedInputtedMinutesFromLocal = localStorage.getItem(this.state.INPUT_MINUTES_STORAGE_KEY)
    try {
      const parsedSavedInputtedMinutes = JSON.parse(getSavedInputtedMinutesFromLocal)
      if (parsedSavedInputtedMinutes !== null) {
        this.setState({ inputMinutes: parseInt(parsedSavedInputtedMinutes) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.INPUT_MINUTES_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedFormula () {
    const getSavedFormulaFromLocal = localStorage.getItem(this.state.FORMULA_STORAGE_KEY)
    try {
      const parsedSavedFormula = JSON.parse(getSavedFormulaFromLocal)
      if (parsedSavedFormula !== null) {
        this.setState({ selectedFormula: parseInt(parsedSavedFormula) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.FORMULA_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }    
  }

  checkSavedMoonVisibilityCriteria () {
    const getSavedMoonVisibilityCriteriaFromLocal = localStorage.getItem(this.state.MOON_VISIBILITY_CRITERIA_STORAGE_KEY)
    try {
      const parsedSavedMoonVisibilityCriteria = JSON.parse(getSavedMoonVisibilityCriteriaFromLocal)
      if (parsedSavedMoonVisibilityCriteria !== null) {
        this.setState({ selectedMoonVisibilityCriteria: parseInt(parsedSavedMoonVisibilityCriteria) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.MOON_VISIBILITY_CRITERIA_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedCoordinateSteps () {
    const getSavedCoordinateStepsFromLocal = localStorage.getItem(this.state.COORDINATE_STEPS_STORAGE_KEY)
    try {
      const parsedSavedCoordinateSteps = JSON.parse(getSavedCoordinateStepsFromLocal)
      if (parsedSavedCoordinateSteps !== null) {
        this.setState({ selectedCoordinateSteps: parseInt(parsedSavedCoordinateSteps) })
      }
    } catch (error) {
      localStorage.removeItem(this.state.COORDINATE_STEPS_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  getCurrentDate () {
    let adjustedDateWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    if (this.state.monthsInCurrentYear.length > 0) {
      adjustedDateWorker.postMessage({
        type: 'createAdjustedIslamicDate',
        months: this.state.monthsInCurrentYear,
        lang: this.state.selectedLanguage
      })
      adjustedDateWorker.onmessage = workerEvent => {
        if (workerEvent.data.type === 'createAdjustedIslamicDate') {
          const currentDate = workerEvent.data.result.currentDate
          const gregorian = workerEvent.data.result.gregorian
          const time = workerEvent.data.result.time
          const islamicDayNumber = workerEvent.data.result.islamicDayNumber
          const islamicMonth = workerEvent.data.result.islamicMonth
          const islamicYear = workerEvent.data.result.islamicYear
          adjustedDateWorker.terminate()
          this.setState({
            currentDate: { gregorian, islamicDayNumber, islamicMonth, islamicYear, time },
            seconds: currentDate.getSeconds()
          }, () => adjustedDateWorker = null)
        }
      }
      adjustedDateWorker.onerror = _error => {
        adjustedDateWorker.terminate()
        adjustedDateWorker = null
      }
    }
  }
  
  toggleSidebar () {
    this.setState(prevState => ({
      isSidebarExpanded: !prevState.isSidebarExpanded
    }), () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.SIDEBAR_STATE_STORAGE_KEY, JSON.stringify(this.state.isSidebarExpanded))
      }
    })
  }

  setDisplayMode () {
    this.setState(prevState => ({
      isDarkMode: !prevState.isDarkMode
    }), () => this.saveDisplayMode(this.state.isDarkMode))
  }

  changeLanguage (lang) {
    i18n.changeLanguage(lang)
    this.setState({ selectedLanguage: lang }, () => {
      this.saveLanguageData(lang)
      this.formatDateTime().then(() => this.generateCalendar())
    })
  }

  saveDisplayMode (selectedDisplayMode) {
    if (isStorageExist(i18n.t('browser_warning'))) {
      localStorage.setItem(this.state.DARK_MODE_STORAGE_KEY, JSON.stringify(selectedDisplayMode))
    }
  }

  saveLanguageData (selectedLanguage) {
    if (isStorageExist(i18n.t('browser_warning'))) {
      localStorage.setItem(this.state.LANGUAGE_STORAGE_KEY, JSON.stringify(selectedLanguage))
    }
  }

  toggleToolbar () {
    this.setState(prevState => ({
      isToolbarShown: !prevState.isToolbarShown
    }), () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.TOOLBAR_STATE_STORAGE_KEY, JSON.stringify(this.state.isToolbarShown))
      }
    })
  }

  setDesiredDate (event) {
    this.setState(prevState => {
      if (prevState.inputDate !== event.target.value) {
        return { inputDate: event.target.value }
      }
    }, () => this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility()))
  }

  setDesiredTime (event) {
    this.setState(prevState => {
      if (prevState.inputTime !== event.target.value) {
        return { inputTime: event.target.value.replace(/\./g, ':') }
      }
    }, () => this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility()))
  }

  formatDateTime () {
    return new Promise(resolve => {
      if (this.state.inputDate !== '' && this.state.inputTime !== '') {
        const configuredDateTime = new Date(`${this.state.inputDate}T${this.state.inputTime}`)
        const configuredLocaleString = configuredDateTime.toLocaleString('en', {
          timeZone: this.state.selectedTimeZone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
        const formattedDateTime = new Date(Date.parse(configuredLocaleString))
        if (formattedDateTime instanceof Date && formattedDateTime.toString() !== this.state.formattedDateTime.toString()) {
          this.setState({ formattedDateTime: formattedDateTime }, () => {
            this.generateMoonInfos()
            this.goToCurrentMonth()
            resolve()
          })
        } else {
          this.generateMoonInfos()
          resolve()
        }
      } else {
        const localeString = new Date().toLocaleString('en', {
          timeZone: this.state.selectedTimeZone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
        this.setState({ formattedDateTime: new Date(Date.parse(localeString)) }, () => {
          this.generateMoonInfos()
          resolve()
        })
      }
    })
  }

  loadCitiesData = async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}db/world-cities-min.json`)
    if (!response.ok) {
      Swal.fire({
        title: i18n.t('error'),
        text: response.status,
        icon: 'error',
        confirmButtonText: i18n.t('ok'),
        confirmButtonColor: 'green'
      })
    }
    else {
      return await response.json()
    }
  }

  generateNearestCity = worldCities => {
    this.setState({ isGettingCoordinates: false, isGeocoding: true, inputLocation: '', selectedLocation: {} })
    let nearestCityWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    nearestCityWorker.postMessage({
      type: 'createHaversineDistance',
      cityData: worldCities,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    })
    nearestCityWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createHaversineDistance') {
        this.setState({ selectedLocation: workerEvent.data.result })
      }
      nearestCityWorker.terminate()
      this.setState({ isGeocoding: false }, () => nearestCityWorker = null)
    }
    nearestCityWorker.onerror = error => {
      nearestCityWorker.terminate()
      this.setState({ isGeocoding: false, selectedLocation: error.message }, () => nearestCityWorker = null)
    }
  }

  generateCities = worldCities => {
    let citiesDataWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    citiesDataWorker.postMessage({
      type: 'createCityData',
      cityData: worldCities,
      query: this.state.inputLocation
    })
    citiesDataWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createCityData') {
        this.setState({ suggestedLocations: workerEvent.data.result })
      }
      citiesDataWorker.terminate()
      this.setState({ isSearching: false }, () => citiesDataWorker = null)
    }
    citiesDataWorker.onerror = error => {
      citiesDataWorker.terminate()
      this.setState({ isSearching: false, selectedLocation: error.message }, () => citiesDataWorker = null)
    }
  }

  getCurrentLocation () {
    if (navigator.geolocation) {
      this.setState({ isGettingCoordinates: true }, () => {
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            elevation: position.coords.altitude || 1,
            selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }, () => {
            this.loadCitiesData().then(worldCities => this.generateNearestCity(worldCities))
            this.getCurrentCriteria()
            this.getCurrentConvention()
            this.formatDateTime()
              .then(() => this.generateCalendar())
              .then(() => this.selectTimeZone(this.state.selectedTimeZone))
              .then(() => this.getMoonCrescentVisibility())
              .finally(() => {
                localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
                localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
              })
          })
        }, error => {
          this.setState({ isGettingCoordinates: false, selectedLocation: error.message })
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 15000
        })
      })
    }
  }

  restoreDateTime () {
    this.setState({ inputDate: '', inputTime: '' }, () => {
      this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
      this.goToCurrentMonth()
    })
  }

  resetSettings () {
    Swal.fire({
      title: i18n.t('reset_settings_alert.0'),
      text: i18n.t('reset_settings_alert.1'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: i18n.t('yes'),
      cancelButtonText: i18n.t('no'),
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    }).then(result => {
      if (result.isConfirmed) {
        this.setState({
          inputLocation: '',
          inputDate: '',
          inputTime: '',
          latitude: 0,
          longitude: 0,
          elevation: 0,
          selectedLocation: {},
          selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }, () => {
          this.getCurrentLocation()
          this.selectTimeZone(this.state.selectedTimeZone)
          this.selectIntervalUpdate(1)
          localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
          localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
          localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
          localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
        })
      }
    })
  }

  onInputLocationChange (inputLocation) {
    if (!this.state.isGeocoding) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      if (inputLocation.length < 3) this.setState({ isSearching: false, suggestedLocations: [] })
      else {
        this.debounceTimeout = setTimeout(() => {
          this.setState({ isSearching: true, inputLocation: inputLocation }, () => {
            this.loadCitiesData().then(worldCities => this.generateCities(worldCities))
          })
        }, 1000)
      }
    }
  }

  onClearLocationInput = () => this.setState({ inputLocation: '', selectedLocation: {} })

  setSelectedLocation (location) {
    this.setState({
      selectedLocation: location,
      latitude: location.lat,
      longitude: location.lng,
      elevation: 1
    }, () => this.applyLocationCoordinates())
  }

  onInputLatitudeChange (event) {
    if (Math.abs(event.target.value) > 90) return
    this.setState({ latitude: parseFloat(event.target.value) }, () => {
      if (Math.abs(this.state.latitude) > 48) this.selectDhuhaMethod(1)
    })
  }

  onInputLongitudeChange (event) {
    if (Math.abs(event.target.value) > 180) return
    this.setState({ longitude: parseFloat(event.target.value) })
  }

  onInputAltitudeChange (event) {
    if (event.target.value > 10000 || event.target.value < 0) return
    this.setState({ elevation: parseFloat(event.target.value) })
  }

  applyLocationCoordinates () {
    if (isStorageExist(i18n.t('browser_warning'))) {
      const locationData = {
        selectedLocation: this.state.selectedLocation,
        latitude: parseFloat(this.state.latitude),
        longitude: parseFloat(this.state.longitude),
        elevation: parseFloat(this.state.elevation)
      }
      this.createCalendarWorker(this.state.formattedDateTime).then(calendarData => {
        if (calendarData?.months?.length > 0) {
          localStorage.setItem(this.state.LOCATION_STATE_STORAGE_KEY, JSON.stringify(locationData))
          this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
        }
      }).finally(() => {
        this.loadCitiesData().then(worldCities => this.generateNearestCity(worldCities))
        this.getCurrentCriteria()
        this.getCurrentConvention()
      })
    }
  }

  getCurrentCriteria () {
    const calendarCriteria = en.date_criteria.map(criteria => ({ ...criteria }))
    for (let index = 1; index < calendarCriteria.length; index++) {
      const item = calendarCriteria[index]
      const [latMin, latMax] = item.latitude_range
      const [lonMin, lonMax] = item.longitude_range
      if (this.state.latitude >= latMin && this.state.latitude <= latMax && this.state.longitude >= lonMin && this.state.longitude <= lonMax) { 
        this.selectCriteria(index)
        break
      } else this.selectCriteria(0)
    }
  }

  selectCriteria (value) {
    this.setState({ selectedCriteria: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CRITERIA_STORAGE_KEY, JSON.stringify(this.state.selectedCriteria))
      }
      this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
    })
  }

  selectTimeZone (value) {
    this.setState({ selectedTimeZone: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.TIMEZONE_STORAGE_KEY, JSON.stringify(this.state.selectedTimeZone))
      }
      this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
    })
  }

  selectIntervalUpdate (value) {
    this.setState({ selectedIntervalUpdate: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.INTERVAL_UPDATES_STORAGE_KEY, JSON.stringify(this.state.selectedIntervalUpdate))
      }
    })
  }

  getCurrentConvention () {
    const conventions = en.conventions.map(convention => ({ ...convention }))
    for (let index = 1; index < conventions.length; index++) {
      const item = conventions[index]
      const [latMin, latMax] = item.latitude_range
      const [lonMin, lonMax] = item.longitude_range
      if (this.state.latitude >= latMin && this.state.latitude <= latMax && this.state.longitude >= lonMin && this.state.longitude <= lonMax) {
        this.selectConvention(index)
        break
      } else this.selectConvention(0)
    }
  }

  selectCalculationMethod (value) {
    this.setState({ selectedCalculationMethod: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CALCULATION_METHOD_STORAGE_KEY, JSON.stringify(this.state.selectedCalculationMethod))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  selectAshrTime (value) {
    this.setState({ selectedAshrTime: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.ASHR_TIME_STORAGE_KEY, JSON.stringify(this.state.selectedAshrTime))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  selectConvention (value) {
    this.setState({
      selectedConvention: parseInt(value),
      sunAltitude: en.conventions[parseInt(value)].sun_altitude
    }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CONVENTION_STORAGE_KEY, JSON.stringify(this.state.selectedConvention))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  selectIhtiyath (value) {
    this.setState({ selectedIhtiyath: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.IHTIYATH_STORAGE_KEY, JSON.stringify(this.state.selectedIhtiyath))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  selectCorrections (index, value) {
    this.setState(prevState => {
      const newCorrections = [...prevState.selectedCorrections]
      newCorrections[index] = parseInt(value)
      return { selectedCorrections: newCorrections }
    }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CORRECTIONS_STORAGE_KEY, JSON.stringify(this.state.selectedCorrections))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  selectDhuhaMethod (value) {
    this.setState({ selectedDhuhaMethod: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.DHUHA_METHOD_STORAGE_KEY, JSON.stringify(this.state.selectedDhuhaMethod))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  onInputSunAltitudeChange (event) {
    if (parseFloat(event.target.value) < 4 || parseFloat(event.target.value) > 8) return
    this.setState({ inputSunAltitude: parseFloat(event.target.value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.INPUT_SUN_ALTITUDE_STORAGE_KEY, JSON.stringify(this.state.inputSunAltitude))
      }
      this.create3DaysOfPrayerTimes()
    })
  }

  onInputMinutesChange (event) {
    if (parseInt(event.target.value) < 10 || parseInt(event.target.value) > 40) return
    this.setState({ inputMinutes: parseInt(event.target.value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.INPUT_MINUTES_STORAGE_KEY, JSON.stringify(this.state.inputMinutes))
      }
      this.create3DaysOfPrayerTimes()
    })
  }
  
  selectFormula (value) {
    this.setState({ selectedFormula: parseInt(value) }, () => {
      if (parseInt(value) === 1) {
        this.selectTimeZone('Asia/Riyadh')
      } else {
        this.selectTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
      localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.FORMULA_STORAGE_KEY, JSON.stringify(this.state.selectedFormula))
      }
      this.formatDateTime().then(() => this.generateCalendar()).then(() => this.getMoonCrescentVisibility())
    })
  }

  selectMoonVisibilityCriteria (value) {
    this.setState({ selectedMoonVisibilityCriteria: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.MOON_VISIBILITY_CRITERIA_STORAGE_KEY, JSON.stringify(this.state.selectedMoonVisibilityCriteria))
      }
      this.getMoonCrescentVisibility()
    })
  }

  selectCoordinateSteps (value) {
    this.setState({ selectedCoordinateSteps: parseInt(value) }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.COORDINATE_STEPS_STORAGE_KEY, JSON.stringify(this.state.selectedCoordinateSteps))
      }
      this.getMoonCrescentVisibility()
    })
  }

  createCalendarWorker = gregorianDate => {
    return new Promise((resolve, reject) => {
      let calendarDataWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
      calendarDataWorker.postMessage({
        type: 'createCalendarData',
        gregorianDate: gregorianDate,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        elevation: this.state.elevation,
        criteria: this.state.selectedCriteria,
        sunAltitude: this.state.sunAltitude,
        formula: this.state.selectedFormula,
        lang: this.state.selectedLanguage
      })
      calendarDataWorker.onmessage = workerEvent => {
        if (workerEvent.data.type === 'createCalendarData') {
          resolve(workerEvent.data.result)
        }
        calendarDataWorker.terminate()
        this.setState({ isCalendarLoading: false }, () => calendarDataWorker = null)
      }
      calendarDataWorker.onerror = error => {
        calendarDataWorker.terminate()
        this.setState({ isCalendarLoading: false }, () => {
          console.error(error.message)
          calendarDataWorker = null
        })
        reject(error)
      }
    })
  }

  generateCalendar = () => {
    const currentDate = new Date()
    const currentLocalString = currentDate.toLocaleString('en', {
      timeZone: this.state.selectedTimeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    const formattedDateTime = new Date(Date.parse(currentLocalString))
    if (formattedDateTime.getDate() === this.state.formattedDateTime.getDate() && formattedDateTime.getHours() === this.state.formattedDateTime.getHours() && formattedDateTime.getMinutes() === this.state.formattedDateTime.getMinutes()) {
      this.createCalendarWorker(this.state.formattedDateTime).then(setCalendarData => {
        if (setCalendarData?.months?.length > 0) {
          this.setState({
            monthsInSetYear: setCalendarData.months,
            monthsInCurrentYear: setCalendarData.months,
            hijriEventDates: setCalendarData.hijriEventDates,
            hijriStartDates: setCalendarData.hijriStartDates
          }, () => {
            this.generateMoonInfos()
            this.create3DaysOfPrayerTimes()
          })
        }
      })
    } else {
      this.createCalendarWorker(this.state.formattedDateTime).then(setCalendarData => {
        if (setCalendarData?.months?.length > 0) {
          this.setState({
            monthsInSetYear: setCalendarData.months,
            hijriEventDates: setCalendarData.hijriEventDates,
            hijriStartDates: setCalendarData.hijriStartDates
          }, () => {
            this.generateMoonInfos()
            this.create3DaysOfPrayerTimes()
          })
        }
      })
      this.createCalendarWorker(currentDate).then(currentCalendarData => {
        if (currentCalendarData?.months?.length > 0) {
          this.setState({ monthsInCurrentYear: currentCalendarData.months }, () => {
            this.generateMoonInfos()
            this.create3DaysOfPrayerTimes()
          })        
        }
      })
    }
  }
  
  goToCurrentMonth = () => {
    if (this.sliderRef.current) {
      this.sliderRef.current.slickGoTo(this.state.formattedDateTime.getMonth())
    }
  }

  showTooltip = event => {
    let tooltipWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    tooltipWorker.postMessage({ type: 'createIncludedElement', innerHTML: event.target.innerHTML })
    tooltipWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createIncludedElement') {
        const matchedEvent = workerEvent.data.result
        if (event.target.innerHTML.includes(matchedEvent)) {
          this.setState({ tooltipId: matchedEvent }, () => {
            const calendarContainerRect = this.calendarContainerRef.current.getBoundingClientRect()
            const tooltip = this.tooltipRef.current
            const tooltipWidth = tooltip?.offsetWidth
            const tooltipHeight = tooltip?.offsetHeight
            const containerHalfWidth = calendarContainerRect.width / 2
            const leftPosition = event.clientX
            if (tooltip) {
              if (leftPosition < containerHalfWidth) {
                tooltip.style.left = `${leftPosition - tooltipWidth / 2}px`
                tooltip.style.right = 'auto'
              } else {
                tooltip.style.left = `${leftPosition - tooltipWidth}px`
                tooltip.style.right = 'auto'
              }
              const scrollOffset = scrollY || pageYOffset
              tooltip.style.top = `${event.clientY / 2 - tooltipHeight - 10 - scrollOffset}px`
            }
            tooltipWorker.terminate()
            tooltipWorker = null
          })
        } else {
          this.hideTooltip()
          tooltipWorker.terminate()
          tooltipWorker = null
        }
      }
    }
    tooltipWorker.onerror = _error => {
      this.hideTooltip()
      tooltipWorker.terminate()
    }
  }

  hideTooltip() {
    this.setState({ tooltipId: '' })
  }

  jumpToClickedMonth = dotIndex => {
    if (this.sliderRef.current) {
      this.sliderRef.current.slickGoTo(dotIndex)
    }
  }

  generateMoonInfos = () => {
    let moonInfosWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    moonInfosWorker.postMessage({
      type: 'createMoonInfos',
      gregorianDate: this.state.formattedDateTime,
      timeZone: this.state.selectedTimeZone,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      elevation: this.state.elevation,
      lang: this.state.selectedLanguage
    })
    moonInfosWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createMoonInfos') {
        this.setState({ moonInfos: workerEvent.data.result, areMoonInfosLoading: false }, () => {
          moonInfosWorker.terminate()
          moonInfosWorker = null
        })
      }
    }
    moonInfosWorker.onerror = _error => {
      moonInfosWorker.terminate()
      this.setState({ areMoonInfosLoading: false }, () => moonInfosWorker = null)
    }
  }

  generatePrayerTimes = gregorianDate => {
    return new Promise((resolve, reject) => {
      let prayerTimesWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
      prayerTimesWorker.postMessage({
        type: 'createPrayerTimes',
        gregorianDate: gregorianDate,
        formattedDateTime: this.state.formattedDateTime,
        setMonths: this.state.monthsInSetYear,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        elevation: this.state.elevation,
        timeZone: this.state.selectedTimeZone,
        calculationMethod: this.state.selectedCalculationMethod,
        ashrTime: this.state.selectedAshrTime,
        sunAltitude: this.state.sunAltitude,
        ihtiyath: this.state.selectedIhtiyath,
        formula: this.state.selectedFormula,
        corrections: this.state.selectedCorrections,
        dhuhaMethod: this.state.selectedDhuhaMethod,
        inputSunAlt: this.state.inputSunAltitude,
        inputMins: this.state.inputMinutes
      })
      prayerTimesWorker.onmessage = workerEvent => {
        if (workerEvent.data.type === 'createPrayerTimes') {
          prayerTimesWorker.terminate()
          resolve(workerEvent.data.result)
          prayerTimesWorker = null
        }
      }
      prayerTimesWorker.onerror = error => {
        prayerTimesWorker.terminate()
        console.error(error.message)
        reject(error.message)
        prayerTimesWorker = null
      }
    })
  }

  create3DaysOfPrayerTimes = () => {
    const theDayBefore = new Date(this.state.formattedDateTime)
    theDayBefore.setDate(theDayBefore.getDate() - 1)
    const theDayAfter = new Date(this.state.formattedDateTime)
    theDayAfter.setDate(theDayAfter.getDate() + 1)
    Promise.all([
      this.generatePrayerTimes(theDayBefore),
      this.generatePrayerTimes(this.state.formattedDateTime),
      this.generatePrayerTimes(theDayAfter)
    ]).then(prayerTimes => { this.setState({ arePrayerTimesLoading: false, prayerTimes: prayerTimes }) })
  }

  addZeroPad = value => (value >= 0 && value < 10) ? `0${value}` : value

  createPrayerTimeCountdown = () => {
    if (this.state.inputDate !== '' && this.state.inputTime !== '') return
    else {
      const currentDate = new Date()
      const todayPrayerTimes = this.state.prayerTimes.find(([prayerTime]) => prayerTime.toDateString() === currentDate.toDateString())
      const hijriMonthNumber = parseInt(currentDate.toLocaleString('en', { calendar: "islamic", month: 'numeric' }))
      let nextPrayerTime = null
      let nextPrayerName = null
      const prayerNames = hijriMonthNumber === 9
        ? en.prayer_names.map((_, i) => i18n.t(`prayer_names.${i}`))
        : en.prayer_names.map((_, i) => i18n.t(`prayer_names.${i}`)).slice(1)
      if (todayPrayerTimes) {
        const prayerTimes = hijriMonthNumber === 9 ? todayPrayerTimes : todayPrayerTimes?.slice(1)
        const nextPrayerIndex = prayerTimes?.findIndex(prayerTime => prayerTime > currentDate)
        if (nextPrayerIndex !== -1) {
          nextPrayerName = prayerNames[nextPrayerIndex]
          nextPrayerTime = prayerTimes[nextPrayerIndex]
        }
      }
      if (!nextPrayerTime) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowPrayerTimes = this.state.prayerTimes.find(([prayerTime]) => prayerTime.toDateString() === tomorrow.toDateString())
        if (!tomorrowPrayerTimes) return
        const prayerTimes = hijriMonthNumber === 9 ? tomorrowPrayerTimes : tomorrowPrayerTimes?.slice(1)
        const nextPrayerIndex = prayerTimes?.findIndex(prayerTime => prayerTime > currentDate)
        if (nextPrayerIndex !== -1) {
          nextPrayerName = prayerNames[nextPrayerIndex]
          nextPrayerTime = prayerTimes[nextPrayerIndex]
        }
      }
      if (nextPrayerName && nextPrayerTime) {
        const timesRemaining = nextPrayerTime - currentDate
        const hoursLeft = this.addZeroPad(Math.floor(timesRemaining / 3600000))
        const minutesLeft = this.addZeroPad(Math.floor((timesRemaining % 3600000) / 60000))
        const secondsLeft = this.addZeroPad(Math.floor((timesRemaining % 60000) / 1000))
        const nextPrayerInfo = `${i18n.t('prayer_info.0')} ${nextPrayerName}: ${hoursLeft}:${minutesLeft}:${secondsLeft}`
        if (hoursLeft === '00' && minutesLeft === '00' && secondsLeft === '00') {
          alert(`${i18n.t('prayer_info.1')} ${nextPrayerName} ${i18n.t('prayer_info.2')}!`)
        }
        this.setState({ nextPrayerInfo: nextPrayerInfo })
      }
    }
  }

  generateMoonCrescentVisibility = (conjunctionDate) => new Promise((resolve, reject) => {
    this.setState({ isMoonCrescentVisibilityMapLoading: true })
    let moonCrescentVisibilityWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    moonCrescentVisibilityWorker.postMessage({
      type: 'createMoonCrescentVisibility',
      conjunctionDate: conjunctionDate,
      moonVisibilityCriteria: this.state.selectedMoonVisibilityCriteria,
      steps: this.state.selectedCoordinateSteps
    })
    moonCrescentVisibilityWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createMoonCrescentVisibility') {
        moonCrescentVisibilityWorker.terminate()
        resolve(workerEvent.data.result)
        moonCrescentVisibilityWorker = null
      }
    }
    moonCrescentVisibilityWorker.onerror = error => {
      moonCrescentVisibilityWorker.terminate()
      console.error(error.message)
      reject(error.message)
      moonCrescentVisibilityWorker = null
    }
  })

  getMoonCrescentVisibility = () => {
    const ijtimaDay = new Date(this.state.formattedDateTime)
    const currentFirstMonthGregorianDay = new Date(this.state.formattedDateTime.getFullYear(), this.state.formattedDateTime.getMonth(), 1).getDay()
    const islamicDayNumber = this.state.monthsInSetYear[this.state.formattedDateTime.getMonth()][this.state.formattedDateTime.getDate() + currentFirstMonthGregorianDay - 1]?.hijri
    ijtimaDay.setDate(ijtimaDay.getDate() + 29 - islamicDayNumber)
    this.generateMoonCrescentVisibility(ijtimaDay).then(result => {
      if (Object.keys(result).length > 0) {
        this.setState({ moonCrescentVisibility: result }, () => console.log(this.state.moonCrescentVisibility))
      }
    }).finally(() => this.setState({ isMoonCrescentVisibilityMapLoading: false }))
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>{i18n.t('app_name')}</title>
          <meta name="description" content={i18n.t('app_description')} />
          <link rel="canonical" href={location.toString()} />
        </Helmet>
        <Routes>
          <Route path="/" element={
            <HomePageProvider value={{
              t: i18n.t,
              state: this.state,
              toggleSidebar: this.toggleSidebar.bind(this),
              changeLanguage: this.changeLanguage.bind(this),
              setDisplayMode: this.setDisplayMode.bind(this),
              toggleToolbar: this.toggleToolbar.bind(this),
              setDesiredDate: this.setDesiredDate.bind(this),
              setDesiredTime: this.setDesiredTime.bind(this),
              getCurrentLocation: this.getCurrentLocation.bind(this),
              restoreDateTime: this.restoreDateTime.bind(this),
              resetSettings: this.resetSettings.bind(this),
              onInputLocationChange: this.onInputLocationChange.bind(this),
              onClearLocationInput: this.onClearLocationInput.bind(this),
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <HomePage
                t={i18n.t}
                isSidebarExpanded={this.state.isSidebarExpanded}
                sliderRef={this.sliderRef}
                calendarContainerRef={this.calendarContainerRef}
                tooltipRef={this.tooltipRef}
                showTooltip={this.showTooltip.bind(this)}
                hideTooltip={this.hideTooltip.bind(this)}
                goToCurrentMonth={this.goToCurrentMonth.bind(this)}
                jumpToClickedMonth={this.jumpToClickedMonth.bind(this)}
              />
            </HomePageProvider>
          }/>
          <Route path="/home" element={
            <HomePageProvider value={{
              t: i18n.t,
              state: this.state,
              toggleSidebar: this.toggleSidebar.bind(this),
              changeLanguage: this.changeLanguage.bind(this),
              setDisplayMode: this.setDisplayMode.bind(this),
              toggleToolbar: this.toggleToolbar.bind(this),
              setDesiredDate: this.setDesiredDate.bind(this),
              setDesiredTime: this.setDesiredTime.bind(this),
              getCurrentLocation: this.getCurrentLocation.bind(this),
              restoreDateTime: this.restoreDateTime.bind(this),
              resetSettings: this.resetSettings.bind(this),
              onInputLocationChange: this.onInputLocationChange.bind(this),
              onClearLocationInput: this.onClearLocationInput.bind(this),
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <HomePage
                t={i18n.t}
                isSidebarExpanded={this.state.isSidebarExpanded}
                sliderRef={this.sliderRef}
                calendarContainerRef={this.calendarContainerRef}
                tooltipRef={this.tooltipRef}
                showTooltip={this.showTooltip.bind(this)}
                hideTooltip={this.hideTooltip.bind(this)}
                goToCurrentMonth={this.goToCurrentMonth.bind(this)}
                jumpToClickedMonth={this.jumpToClickedMonth.bind(this)}
              />
            </HomePageProvider>
          }/>
          <Route path="/prayer-times" element={
            <HomePageProvider value={{
              t: i18n.t,
              state: this.state,
              toggleSidebar: this.toggleSidebar.bind(this),
              changeLanguage: this.changeLanguage.bind(this),
              setDisplayMode: this.setDisplayMode.bind(this),
              toggleToolbar: this.toggleToolbar.bind(this),
              setDesiredDate: this.setDesiredDate.bind(this),
              setDesiredTime: this.setDesiredTime.bind(this),
              getCurrentLocation: this.getCurrentLocation.bind(this),
              restoreDateTime: this.restoreDateTime.bind(this),
              resetSettings: this.resetSettings.bind(this),
              onInputLocationChange: this.onInputLocationChange.bind(this),
              onClearLocationInput: this.onClearLocationInput.bind(this),
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <PrayerTimesPage
                t={i18n.t}
                parentState={this.state}
                selectCalculationMethod={this.selectCalculationMethod.bind(this)}
                selectAshrTime={this.selectAshrTime.bind(this)}
                getCurrentConvention={this.getCurrentConvention.bind(this)}
                selectConvention={this.selectConvention.bind(this)}
                selectIhtiyath={this.selectIhtiyath.bind(this)}
                selectCorrections={this.selectCorrections.bind(this)}
                selectDhuhaMethod={this.selectDhuhaMethod.bind(this)}
                onInputSunAltitudeChange={this.onInputSunAltitudeChange.bind(this)}
                onInputMinutesChange={this.onInputMinutesChange.bind(this)}
                selectFormula={this.selectFormula.bind(this)}
                generatePrayerTimes={this.generatePrayerTimes.bind(this)}
              />
            </HomePageProvider>
          }/>
          <Route path="/moon-crescent-map" element={
            <HomePageProvider value={{
              t: i18n.t,
              state: this.state,
              toggleSidebar: this.toggleSidebar.bind(this),
              changeLanguage: this.changeLanguage.bind(this),
              setDisplayMode: this.setDisplayMode.bind(this),
              toggleToolbar: this.toggleToolbar.bind(this),
              setDesiredDate: this.setDesiredDate.bind(this),
              setDesiredTime: this.setDesiredTime.bind(this),
              getCurrentLocation: this.getCurrentLocation.bind(this),
              restoreDateTime: this.restoreDateTime.bind(this),
              resetSettings: this.resetSettings.bind(this),
              onInputLocationChange: this.onInputLocationChange.bind(this),
              onClearLocationInput: this.onClearLocationInput.bind(this),
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this),
              selectMoonVisibilityCriteria: this.selectMoonVisibilityCriteria.bind(this),
              selectCoordinateSteps: this.selectCoordinateSteps.bind(this)
            }}>
              <MoonCrescentMapPage
                t={i18n.t}
                formattedDateTime={this.state.formattedDateTime}
                hijriStartDates={this.state.hijriStartDates}
                isSidebarExpanded={this.state.isSidebarExpanded}
              />
            </HomePageProvider>
          }/>
          <Route path="*" element={<NoPage t={i18n.t} />} />
        </Routes>
      </React.Fragment>
    )
  }
}

export default App