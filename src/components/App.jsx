import React from "react"
import i18n from "../utils/localization"
import { isStorageExist, adjustedIslamicDate, getCalendarData, getMoonInfos } from "../utils/data"
import { Helmet } from "react-helmet"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import NoPage from "./pages/empty/NoPage"
import { HomePageProvider } from "./contexts/HomPageContext"
import Swal from "sweetalert2"
import PrayerTimesPage from "./pages/prayer_times/PrayerTimesPage"
import MoonCrescentMapPage from "./pages/moon_crescent_map/MoonCrescentMapPage"

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
      DAY_CORRECTION_STORAGE_KEY: "DAY_CORRECTION_STORAGE_KEY",
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
      selectedDayCorrection: 1,
      selectedCalculationMethod: 0,
      selectedIntervalUpdate: 0,
      selectedFormula: 0,
      monthsInSetYear: [],
      monthsInCurrentYear: [],
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
      if (this.state.selectedIntervalUpdate === 2 && this.state.seconds % 60 === 0) {
        this.formatDateTime()
      } else if (this.state.selectedIntervalUpdate === 1 && this.state.seconds % 30 === 0) {
        this.formatDateTime()     
      } else if (this.state.selectedIntervalUpdate === 0 && this.state.seconds % 15 === 0) {
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
      this.checkSavedDayCorrection()
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
      if (parsedSavedCriteria !== null) this.setState({ selectedCriteria: parsedSavedCriteria })
    } catch (error) {
      localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedDayCorrection () {
    const getSavedDayCorrectionFromLocal = localStorage.getItem(this.state.DAY_CORRECTION_STORAGE_KEY)
    try {
      const parsedSavedDayCorrection = JSON.parse(getSavedDayCorrectionFromLocal)
      if (parsedSavedDayCorrection !== null) this.setState({ selectedDayCorrection: parsedSavedDayCorrection })
    } catch (error) {
      localStorage.removeItem(this.state.DAY_CORRECTION_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  checkSavedCalculationMethod () {
    const getSavedCalculationMethodFromLocal = localStorage.getItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
    try {
      const parsedSavedCalculationMethod = JSON.parse(getSavedCalculationMethodFromLocal)
      if (parsedSavedCalculationMethod !== null) {
        this.setState({ selectedCalculationMethod: parsedSavedCalculationMethod })
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
    const georgian = currentDate.toLocaleDateString(this.state.selectedLanguage, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const islamic = adjustedIslamicDate(currentDate, this.state.monthsInCurrentYear).toLocaleDateString(this.state.selectedLanguage, { calendar: "islamic", year: "numeric", month: "long", day: "numeric" })
    const time = currentDate.toLocaleTimeString(this.state.selectedLanguage, { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" })
    this.setState({
      currentDate: { georgian, islamic, time },
      seconds: new Date().getSeconds()
    })
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
      const formattedDateTime = new Date(`${this.state.inputDate}T${this.state.inputTime}`)
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
    } else this.setState({ formattedDateTime: new Date() }, () => {
      this.generateCalendar()
      this.generateMoonInfos()
    })
  }

  getCurrentLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.elevation || 1
        }, () => {
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
          selectedLocation: ""
        }, () => {
          this.formatDateTime()
          localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
          localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
          localStorage.removeItem(this.state.DAY_CORRECTION_STORAGE_KEY)
          localStorage.removeItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
          localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
        })
      }
    }).finally(() => {
      this.getCurrentLocation()
      this.selectCriteria('0')
      this.selectDayCorrection('1')
      this.selectCalculationMethod('0')
      this.selectIntervalUpdate('0')
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
      if (getCalendarData(this.state.formattedDateTime, this.state.latitude, this.state.longitude, this.state.elevation, this.state.selectedCriteria, this.state.selectedFormula, this.state.errorMessage)?.length > 0) {
        localStorage.setItem(this.state.LOCATION_STATE_STORAGE_KEY, JSON.stringify(locationData))
        this.formatDateTime()
      }
    }
  }

  selectCriteria (value) {
    this.setState({ selectedCriteria: value }, () => {
      if (value !== parseInt(this.state.selectedCriteria)) {
        if (isStorageExist(i18n.t('browser_warning'))) {
          localStorage.setItem(this.state.CRITERIA_STORAGE_KEY, JSON.stringify(this.state.selectedCriteria))
        }
        this.formatDateTime()
      }
    })
  }

  selectDayCorrection (value) {
    this.setState({ selectedDayCorrection: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.DAY_CORRECTION_STORAGE_KEY, JSON.stringify(this.state.selectedDayCorrection))
      }
    })
  }

  selectCalculationMethod (value) {
    this.setState({ selectedCalculationMethod: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CALCULATION_METHOD_STORAGE_KEY, JSON.stringify(this.state.selectedCalculationMethod))
      }
    })
  }

  selectIntervalUpdate (value) {
    this.setState({ selectedIntervalUpdate: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.INTERVAL_UPDATES_STORAGE_KEY, JSON.stringify(this.state.selectedIntervalUpdate))
      }
    })
  }

  selectFormula (value) {
    this.setState({ selectedFormula: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.FORMULA_STORAGE_KEY, JSON.stringify(this.state.selectedFormula))
      }
      this.formatDateTime()
    })
  }

  generateCalendar = () => {
    const currentDate = new Date()
    if (currentDate.getDate() === this.state.formattedDateTime.getDate() && currentDate.getHours() === this.state.formattedDateTime.getHours() && currentDate.getMinutes() === this.state.formattedDateTime.getMinutes()) {
      const setCalendarData = getCalendarData(this.state.formattedDateTime, this.state.latitude, this.state.longitude, this.state.elevation, this.state.selectedCriteria, this.state.selectedFormula, this.state.errorMessage)
      if (setCalendarData?.length > 0) {
        this.setState({ monthsInSetYear: setCalendarData, monthsInCurrentYear: setCalendarData })
      }
    } else {
      const setCalendarData = getCalendarData(this.state.formattedDateTime, this.state.latitude, this.state.longitude, this.state.elevation, this.state.selectedCriteria, this.state.selectedFormula, this.state.errorMessage)
      const currentCalendarData = getCalendarData(currentDate, this.state.latitude, this.state.longitude, this.state.elevation, this.state.selectedCriteria, this.state.selectedFormula, this.state.errorMessage)
      if (setCalendarData?.length > 0) {
        this.setState({ monthsInSetYear: setCalendarData })
      }
      if (currentCalendarData?.length > 0) {
        this.setState({ monthsInCurrentYear: currentCalendarData })        
      }
    }
  }
  
  goToCurrentMonth = () => {
    if (this.sliderRef.current) {
      this.sliderRef.current.slickGoTo(this.state.formattedDateTime.getMonth())
    }
  }

  generateMoonInfos = () => {
    this.setState({ moonInfos: getMoonInfos(this.state.formattedDateTime, this.state.latitude, this.state.longitude, this.state.elevation, this.state.selectedFormula, this.state.selectedLanguage) })
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
              selectDayCorrection: this.selectDayCorrection.bind(this),
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
              selectDayCorrection: this.selectDayCorrection.bind(this),
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
              selectDayCorrection: this.selectDayCorrection.bind(this),
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
              selectDayCorrection: this.selectDayCorrection.bind(this),
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