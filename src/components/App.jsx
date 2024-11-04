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
      SIDEBAR_STATE_STORAGE_KEY: "SIDEBAR_STATE_STORAGE_KEY",
      LANGUAGE_STORAGE_KEY: "LANGUAGE_STORAGE_KEY",
      DARK_MODE_STORAGE_KEY: "DARK_MODE_STORAGE_KEY",
      TOOLBAR_STATE_STORAGE_KEY: "TOOLBAR_STATE_STORAGE_KEY",
      LOCATION_STATE_STORAGE_KEY: "LOCATION_STATE_STORAGE_KEY",
      CRITERIA_STORAGE_KEY: "CRITERIA_STORAGE_KEY",
      TIMEZONE_STORAGE_KEY: "TIMEZONE_STORAGE_KEY",
      CALCULATION_METHOD_STORAGE_KEY: "CALCULATION_METHOD_STORAGE_KEY",
      INTERVAL_UPDATES_STORAGE_KEY: "INTERVAL_UPDATES_STORAGE_KEY",
      FORMULA_STORAGE_KEY: "FORMULA_STORAGE_KEY",
      selectedLanguage: "en",
      currentDate: {},
      seconds: 0,
      inputDate: "",
      inputTime: "",
      formattedDateTime: new Date(),
      inputLocation: "",
      suggestedLocations: [],
      latitude: 0,
      longitude: 0,
      elevation: 0,
      selectedLocation: "",
      selectedCriteria: 0,
      errorMessage: { title: i18n.t('invalid_date_format.0'), text: i18n.t('invalid_date_format.1')},
      selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      selectedCalculationMethod: 0,
      selectedIntervalUpdate: 1,
      selectedFormula: 0,
      monthsInSetYear: [],
      monthsInCurrentYear: [],
      hijriEventDates: [],
      moonInfos: [],
      isSidebarExpanded: true,
      isToolbarShown: true,
      isAutoLocate: true,
      isSearching: false,
      isDarkMode: false,
      isFocused: false
    }
    this.intervalId = null
    this.sliderRef = React.createRef()
  }

  componentDidMount() {
    this.checkBrowserStorage()
    this.intervalId = setInterval(this.getCurrentDate.bind(this), 1000)
  }

  componentDidUpdate(_prevProps, prevState) {
    document.body.classList.toggle("dark", this.state.isDarkMode)
    if (prevState.seconds !== this.state.seconds) {
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
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
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
      this.checkSavedCalculationMethod()
      this.checkSavedIntervalUpdates()
      this.checkSavedFormula()
    }
  }

  checkSidebarState () {
    const getSidebarStateFromLocal = localStorage.getItem(this.state.SIDEBAR_STATE_STORAGE_KEY)
    try {
      const parsedSidebarState = JSON.parse(getSidebarStateFromLocal)
      if (parsedSidebarState !== undefined || parsedSidebarState !== null) {
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
      if (parsedToolbarState !== undefined || parsedToolbarState !== null) {
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
      if (parsedDisplayMode !== undefined || parsedDisplayMode !== null) {
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
      if (parsedLanguage !== undefined || parsedLanguage !== null) {
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
        },() => this.formatDateTime())
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
      if (parsedSavedTimeZone !== null) this.setState({ selectedTimeZone: parsedSavedTimeZone }, () => this.formatDateTime())
      else {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        this.setState({ selectedTimeZone: userTimeZone }, () => this.formatDateTime())
      }
    } catch (error) {
      localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
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

  getCurrentDate () {
    const currentDate = new Date()
    const adjustedDateWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
    const georgian = currentDate.toLocaleDateString(this.state.selectedLanguage, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const time = currentDate.toLocaleTimeString(this.state.selectedLanguage, { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" })
    if (this.state.monthsInCurrentYear.length > 0) {
      adjustedDateWorker.postMessage({
        type: 'createAdjustedIslamicDate',
        gregorianDate: currentDate,
        months: this.state.monthsInCurrentYear
      })
      adjustedDateWorker.onmessage = workerEvent => {
        if (workerEvent.data.type === 'createAdjustedIslamicDate') {
          const islamic = workerEvent.data.result.toLocaleDateString(this.state.selectedLanguage, { calendar: "islamic", year: "numeric", month: "long", day: "numeric" })
          this.setState({
            currentDate: { georgian, islamic, time },
            seconds: new Date().getSeconds()
          }, () => adjustedDateWorker.terminate())
        }
      }
      adjustedDateWorker.onerror = error => {
        Swal.fire({
          title: i18n.t('error'),
          text: error.message,
          icon: 'error',
          confirmButtonText: i18n.t('ok'),
          confirmButtonColor: 'green'
        }).finally(() => adjustedDateWorker.terminate())
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
    this.setState({ selectedLanguage: lang }, () => this.saveLanguageData(lang))
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
    }, () => this.formatDateTime())
  }

  setDesiredTime (event) {
    this.setState(prevState => {
      if (prevState.inputTime !== event.target.value) {
        return { inputTime: event.target.value }
      }
    }, () => this.formatDateTime())
  }

  formatDateTime () {
    if (this.state.inputDate !== "" && this.state.inputTime !== "") {
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
          this.generateCalendar()
          this.generateMoonInfos()
          this.goToCurrentMonth()
        })
      } else {
        this.generateCalendar()
        this.generateMoonInfos()
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
        this.generateCalendar()
        this.generateMoonInfos()
      })
    }
  }

  getCurrentLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.elevation || 1
        }, () => {
          this.getCurrentCriteria()
          this.formatDateTime()
          localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
        })
      }, error => {
        this.setState({ selectedLocation: error.message })
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000
      })
    }
  }

  restoreDateTime () {
    this.setState({ inputDate: "", inputTime: "" }, () => {
      this.formatDateTime()
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({
          inputLocation: "",
          inputDate: "",
          inputTime: "",
          latitude: 0,
          longitude: 0,
          elevation: 0,
          selectedLocation: "",
          selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }, () => {
          this.formatDateTime()
          this.getCurrentLocation()
          this.selectTimeZone(this.state.selectedTimeZone)
          this.selectCalculationMethod(0)
          this.selectIntervalUpdate(1)
        })
      }
    }).finally(() => {
      localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
      localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
      localStorage.removeItem(this.state.TIMEZONE_STORAGE_KEY)
      localStorage.removeItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
      localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
    })
  }

  onInputLocationChange (inputLocation) {
    this.setState({ inputLocation: inputLocation })
  }

  setSelectedLocation (location) {
    this.setState({ selectedLocation: location })
  }

  onInputLatitudeChange (event) {
    if (event.target.value > 90 || event.target.value < -90) return
    this.setState({ latitude: parseFloat(event.target.value) })
  }

  onInputLongitudeChange (event) {
    if (event.target.value > 180 || event.target.value < -180) return
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
          this.formatDateTime()
        }
      }).finally(() => this.getCurrentCriteria())
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
    if (parseInt(value) !== this.state.selectedCriteria) {
      this.setState({ selectedCriteria: parseInt(value) }, () => {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.CRITERIA_STORAGE_KEY, JSON.stringify(this.state.selectedCriteria))
        }
        this.formatDateTime()
      })
    }
  }

  selectTimeZone (value) {
    if (value !== this.state.selectedTimeZone) {
      this.setState({ selectedTimeZone: value }, () => {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.TIMEZONE_STORAGE_KEY, JSON.stringify(this.state.selectedTimeZone))
        }
        this.formatDateTime()
      })
    }
  }

  selectCalculationMethod (value) {
    if (parseInt(value) !== this.state.selectedCalculationMethod) {
      this.setState({ selectedCalculationMethod: parseInt(value) }, () => {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.CALCULATION_METHOD_STORAGE_KEY, JSON.stringify(this.state.selectedCalculationMethod))
        }
      })
    }
  }

  selectIntervalUpdate (value) {
    if (parseInt(value) !== this.state.selectedIntervalUpdate) {
      this.setState({ selectedIntervalUpdate: parseInt(value) }, () => {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.INTERVAL_UPDATES_STORAGE_KEY, JSON.stringify(this.state.selectedIntervalUpdate))
        }
      })
    }
  }

  selectFormula (value) {
    if (parseInt(value) !== this.state.selectedFormula) {
      this.setState({ selectedFormula: parseInt(value) }, () => {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.FORMULA_STORAGE_KEY, JSON.stringify(this.state.selectedFormula))
        }
        this.formatDateTime()
      })
    }
  }

  createCalendarWorker = (gregorianDate) => {
    return new Promise((resolve, reject) => {
      const calendarDataWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
      calendarDataWorker.postMessage({
        type: 'createCalendarData',
        gregorianDate: gregorianDate,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        elevation: this.state.elevation,
        criteria: this.state.selectedCriteria,
        formula: this.state.selectedFormula,
        lang: this.state.selectedLanguage,
        errMsg: this.state.errorMessage
      })
      calendarDataWorker.onmessage = workerEvent => {
        if (workerEvent.data.type === 'createCalendarData') {
          resolve(workerEvent.data.result)
        }
        calendarDataWorker.terminate()
      }
      calendarDataWorker.onerror = error => {
        calendarDataWorker.terminate()
        reject(error)
      }
    })
  }

  generateCalendar = () => {
    const currentDate = new Date()
    const currentLocalString = currentDate.toLocaleString(this.state.selectedLanguage, {
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
            hijriEventDates: setCalendarData.hijriEventDates
          })
        }
      })
    } else {
      this.createCalendarWorker(this.state.formattedDateTime).then(setCalendarData => {
        if (setCalendarData?.months?.length > 0) {
          this.setState({ monthsInSetYear: setCalendarData.months, hijriEventDates: setCalendarData.hijriEventDates })
        }
      })
      this.createCalendarWorker(currentDate).then(currentCalendarData => {
        if (currentCalendarData?.months?.length > 0) {
          this.setState({ monthsInCurrentYear: currentCalendarData.months })        
        }
      })
    }
  }
  
  goToCurrentMonth = () => {
    if (this.sliderRef.current) {
      this.sliderRef.current.slickGoTo(this.state.formattedDateTime.getMonth())
    }
  }

  jumpToClickedMonth = dotIndex => {
    if (this.sliderRef.current) {
      this.sliderRef.current.slickGoTo(dotIndex)
    }
  }

  generateMoonInfos = () => {
    const moonInfosWorker = new Worker(new URL('./../utils/worker.js', import.meta.url), { type: 'module' })
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
        this.setState({ moonInfos: workerEvent.data.result }, () => moonInfosWorker.terminate())
      }
    }
    moonInfosWorker.onerror = _error => moonInfosWorker.terminate()
  }

  onBlurHandler() {
    this.setState({ isFocused: false })
  }

  onFocusHandler() {
    this.setState({ isFocused: true })
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
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectCalculationMethod: this.selectCalculationMethod.bind(this),
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
                isSidebarExpanded={this.state.isSidebarExpanded}
                selectFormula={this.selectFormula.bind(this)}
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
              selectCriteria: this.selectCriteria.bind(this),
              selectTimeZone: this.selectTimeZone.bind(this),
              selectCalculationMethod: this.selectCalculationMethod.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <MoonCrescentMapPage t={i18n.t} isSidebarExpanded={this.state.isSidebarExpanded} />
            </HomePageProvider>
          }/>
          <Route path="*" element={<NoPage t={i18n.t} />} />
        </Routes>
      </React.Fragment>
    )
  }
}

export default App