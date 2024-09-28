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
      selectedLanguage: "en",
      currentDate: {},
      inputDate: "",
      inputTime: "",
      inputLocation: "",
      suggestedLocations: [],
      latitude: 0,
      longitude: 0,
      elevation: 0,
      selectedLocation: "",
      selectedCriteria: 1,
      selectedDayCorrection: 1,
      selectedCalculationMethod: 0,
      selectedIntervalUpdate: 0,
      isSidebarExpanded: true,
      isToolbarShown: true,
      isAutoLocate: true,
      isSearching: false,
      isDarkMode: false,
      isFocused: false
    }
    this.intervalId = null
  }

  componentDidMount() {
    this.checkBrowserStorage()
    this.intervalId = setInterval(this.getCurrentDate.bind(this), 1000)
  }

  componentDidUpdate() {
    document.body.classList.toggle("dark", this.state.isDarkMode)
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
        })
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
        this.setState({ selectedIntervalUpdate: parsedSavedIntervalUpdates })
      }
    } catch (error) {
      localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
      alert(`${i18n.t('error_alert')}: ${error.message}\n${i18n.t('error_solution')}.`)
    }
  }

  getCurrentDate () {
    const georgian = new Date().toLocaleDateString(this.state.selectedLanguage, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const islamic = new Date().toLocaleDateString(this.state.selectedLanguage, { calendar: "islamic", year: "numeric", month: "long", day: "numeric" })
    const time = new Date().toLocaleTimeString(this.state.selectedLanguage, { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" })
    this.setState({
      currentDate: { georgian, islamic, time }
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
    this.setState({ inputDate: event.target.value })
  }

  setDesiredTime (event) {
    this.setState({ inputTime: event.target.value })
  }

  getCurrentLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.elevation || 1
        }, () => localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY))
      }, error => {
        this.setState({ selectedLocation: error.message })
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    }
  }

  restoreDateTime () {
    this.setState({ inputDate: "", inputTime: "" })
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
          localStorage.removeItem(this.state.LOCATION_STATE_STORAGE_KEY)
          localStorage.removeItem(this.state.CRITERIA_STORAGE_KEY)
          localStorage.removeItem(this.state.DAY_CORRECTION_STORAGE_KEY)
          localStorage.removeItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
          localStorage.removeItem(this.state.INTERVAL_UPDATES_STORAGE_KEY)
        })
      }
    }).finally(() => {
      this.getCurrentLocation()
      this.selectCriteria('1')
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
    this.setState({ latitude: event.target.value })
  }

  onInputLongitudeChange (event) {
    this.setState({ longitude: event.target.value })
  }

  onInputAltitudeChange (event) {
    this.setState({ elevation: event.target.value })
  }

  applyLocationCoordinates () {
    if (isStorageExist(i18n.t('browser_warning'))) {
      const locationData = {
        selectedLocation: this.state.selectedLocation,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        elevation: this.state.elevation
      }
      localStorage.setItem(this.state.LOCATION_STATE_STORAGE_KEY, JSON.stringify(locationData))
    }
  }

  selectCriteria (value) {
    this.setState({ selectedCriteria: value }, () => {
      if (isStorageExist(i18n.t('browser_warning'))) {
        localStorage.setItem(this.state.CRITERIA_STORAGE_KEY, JSON.stringify(this.state.selectedCriteria))
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
              <HomePage t={i18n.t} isSidebarExpanded={this.state.isSidebarExpanded} />
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
              selectCalculationMethod: this.selectCalculationMethod.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <HomePage t={i18n.t} isSidebarExpanded={this.state.isSidebarExpanded} />
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
              selectCalculationMethod: this.selectCalculationMethod.bind(this),
              selectIntervalUpdate: this.selectIntervalUpdate.bind(this),
              setSelectedLocation: this.setSelectedLocation.bind(this),
              onInputLatitudeChange: this.onInputLatitudeChange.bind(this),
              onInputLongitudeChange: this.onInputLongitudeChange.bind(this),
              onInputAltitudeChange: this.onInputAltitudeChange.bind(this),
              applyLocationCoordinates: this.applyLocationCoordinates.bind(this)
            }}>
              <PrayerTimesPage t={i18n.t} isSidebarExpanded={this.state.isSidebarExpanded} />
            </HomePageProvider>
          }/>
          <Route path="*" element={<NoPage t={i18n.t} />} />
        </Routes>
      </React.Fragment>
    )
  }
}

export default App