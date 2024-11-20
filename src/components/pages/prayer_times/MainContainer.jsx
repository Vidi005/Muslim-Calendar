import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import PrayerTimesContent from "./PrayerTimesContent"
import Swal from "sweetalert2"
import en from "./../../../locales/en.json"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      CALCULATION_METHOD_STORAGE_KEY: "CALCULATION_METHOD_STORAGE_KEY",
      ASHR_TIME_STORAGE_KEY: "ASHR_TIME_STORAGE_KEY",
      CONVENTION_STORAGE_KEY: "CONVENTION_STORAGE_KEY",
      IHTIYATH_STORAGE_KEY: "IHTIYATH_STORAGE_KEY",
      CORRECTIONS_STORAGE_KEY: "CORRECTIONS_STORAGE_KEY",
      DHUHA_METHOD_STORAGE_KEY: "DHUHA_METHOD_STORAGE_KEY",
      INPUT_SUN_ALTITUDE_STORAGE_KEY: "INPUT_SUN_ALTITUDE_STORAGE_KEY",
      INPUT_MINUTES_STORAGE_KEY: "INPUT_MINUTES_STORAGE_KEY",
      FORMULA_STORAGE_KEY: "FORMULA_STORAGE_KEY",
      arePrayerTimesListLoading: true,
      monthType: 0,
      prayerTimesList: [],
      selectedGregorianMonth: this.props.formattedDateTime.getMonth(),
      selectedHijriMonth: this.getHijriMonthFromProps(props)
    }
  }

  getHijriMonthFromProps = (props) => props.hijriStartDates?.findIndex(item => item.gregorianDate > props.formattedDateTime) - 1

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.hijriStartDates !== this.props.hijriStartDates || prevState.monthType !== this.state.monthType) {
      if (this.state.monthType === 0) this.createPrayerTimeInGregorianMonth()
      else this.createPrayerTimeInHijriMonth()
    }
  }

  changeMonthType (monthType) {
    this.setState({
      monthType: parseInt(monthType),
      selectedGregorianMonth: this.props.formattedDateTime.getMonth(),
      selectedHijriMonth: this.getHijriMonthFromProps(this.props),
      arePrayerTimesListLoading: true
    }, () => {
      if (monthType === 0) this.createPrayerTimeInGregorianMonth()
      else this.createPrayerTimeInHijriMonth()
    })
  }

  selectGregorianMonth (montIndex) {
    this.setState({ selectedGregorianMonth: parseInt(montIndex) }, () => this.createPrayerTimeInGregorianMonth())
  }

  selectHijriMonth (montIndex) {
    this.setState({ selectedHijriMonth: parseInt(montIndex) }, () => this.createPrayerTimeInHijriMonth())
  }

  createPrayerTimeInGregorianMonth () {
    const daysInMonth = new Date(this.props.formattedDateTime.getFullYear(), this.state.selectedGregorianMonth + 1, 0).getDate()
    const prayerTimesPromises = []
    for (let day = 1; day <= daysInMonth; day++) {
      const startDate = new Date(this.props.formattedDateTime.getFullYear(), this.state.selectedGregorianMonth, day, 0, 0, 0)
      const formattedStartDate = startDate.toLocaleString(this.props.selectedLanguage || 'en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      const prayerTimeList = this.props.generatePrayerTimes(startDate).then(prayerTime => {
        const formattedPrayerTimes = prayerTime.map(time => time.toLocaleTimeString('en-GB', { hour12: false })).slice(1)
        return [formattedStartDate, ...formattedPrayerTimes]
      })
      prayerTimesPromises.push(prayerTimeList)
    }
    Promise.all(prayerTimesPromises).then(prayerTimesList => this.setState({ prayerTimesList: prayerTimesList, arePrayerTimesListLoading: false }))
  }

  createPrayerTimeInHijriMonth () {
    const timeDiff = Math.abs(this.props.hijriStartDates[this.state.selectedHijriMonth + 1]?.gregorianDate - this.props.hijriStartDates[this.state.selectedHijriMonth]?.gregorianDate)
    const daysInMonth = Math.ceil(timeDiff / 86400000)
    const prayerTimesPromises = []
    const hijriMonth = this.props.hijriStartDates[this.state.selectedHijriMonth]?.hijriDate.month
    const hijriYear = parseInt(this.props.hijriStartDates[this.state.selectedHijriMonth]?.hijriDate.year)
    for (let day = 1; day <= daysInMonth; day++) {
      const gregorianDate = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth]?.gregorianDate)
      gregorianDate.setDate(gregorianDate.getDate() + (day - 1))
      const hijriDate = `${day} ${this.props.t(`islamic_months.${hijriMonth - 1}`)} ${hijriYear} ${this.props.t('hijri_abbreviation')}`
      const formattedGregorianDate = gregorianDate.toLocaleString(this.props.selectedLanguage || 'en', { weekday: hijriMonth === 9 ? 'short' : 'long', day: 'numeric', month: 'long', year: 'numeric' })
      const prayerTimeList = this.props.generatePrayerTimes(gregorianDate).then(prayerTime => {
        const formattedPrayerTimes = hijriMonth === 9
          ? prayerTime.map(time => time.toLocaleTimeString('en-GB', { hour12: false }))
          : prayerTime.map(time => time.toLocaleTimeString('en-GB', { hour12: false })).slice(1)
        return [hijriDate, formattedGregorianDate, ...formattedPrayerTimes]
      })
      prayerTimesPromises.push(prayerTimeList)
    }
    Promise.all(prayerTimesPromises).then(prayerTimesList => this.setState({ prayerTimesList: prayerTimesList, arePrayerTimesListLoading: false }))
  }

  resetSettings () {
    Swal.fire({
      title: this.props.t('reset_settings_alert.0'),
      text: this.props.t('reset_settings_alert.1'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.props.t('yes'),
      cancelButtonText: this.props.t('no'),
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.selectCalculationMethod(0)
        this.props.selectAshrTime(0)
        this.props.getCurrentConvention()
        this.props.selectIhtiyath(2)
        this.props.selectDhuhaMethod(0)
        this.props.onInputSunAltitudeChange(4.5)
        this.props.onInputMinutesChange(18)
        en.prayer_names.forEach((_, index) => this.props.selectCorrections(index, 0))
        this.props.selectFormula(0)
        localStorage.removeItem(this.state.CALCULATION_METHOD_STORAGE_KEY)
        localStorage.removeItem(this.state.ASHR_TIME_STORAGE_KEY)
        localStorage.removeItem(this.state.CONVENTION_STORAGE_KEY)
        localStorage.removeItem(this.state.IHTIYATH_STORAGE_KEY)
        localStorage.removeItem(this.state.CORRECTIONS_STORAGE_KEY)
        localStorage.removeItem(this.state.DHUHA_METHOD_STORAGE_KEY)
        localStorage.removeItem(this.state.INPUT_SUN_ALTITUDE_STORAGE_KEY)
        localStorage.removeItem(this.state.INPUT_MINUTES_STORAGE_KEY)
        localStorage.removeItem(this.state.FORMULA_STORAGE_KEY)
      }
    })
  }

  render() {
    return (
      <main className="prayer-times-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024
          ? (
              <div className="prayer-times-container flex flex-nowrap w-full h-full">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <PrayerTimesContent
                  t={this.props.t}
                  state={this.state}
                  selectedLanguage={this.props.selectedLanguage}
                  formattedDateTime={this.props.formattedDateTime}
                  monthsInSetYear={this.props.monthsInSetYear}
                  hijriStartDates={this.props.hijriStartDates}
                  selectCalculationMethod={this.props.selectCalculationMethod}
                  selectAshrTime={this.props.selectAshrTime}
                  selectConvention={this.props.selectConvention}
                  selectIhtiyath={this.props.selectIhtiyath}
                  selectCorrections={this.props.selectCorrections}
                  selectDhuhaMethod={this.props.selectDhuhaMethod}
                  onInputSunAltitudeChange={this.props.onInputSunAltitudeChange}
                  onInputMinutesChange={this.props.onInputMinutesChange}
                  selectFormula={this.props.selectFormula}
                  changeMonthType={this.changeMonthType.bind(this)}
                  selectGregorianMonth={this.selectGregorianMonth.bind(this)}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
                  resetSettings={this.resetSettings.bind(this)}
                />
              </div>
            )
          : (
              <div className="prayer-times-container flex flex-col w-full h-full">
                <PrayerTimesContent
                  t={this.props.t}
                  state={this.state}
                  selectedLanguage={this.props.selectedLanguage}
                  formattedDateTime={this.props.formattedDateTime}
                  monthsInSetYear={this.props.monthsInSetYear}
                  hijriStartDates={this.props.hijriStartDates}
                  selectCalculationMethod={this.props.selectCalculationMethod}
                  selectAshrTime={this.props.selectAshrTime}
                  selectConvention={this.props.selectConvention}
                  selectIhtiyath={this.props.selectIhtiyath}
                  selectCorrections={this.props.selectCorrections}
                  selectDhuhaMethod={this.props.selectDhuhaMethod}
                  onInputSunAltitudeChange={this.props.onInputSunAltitudeChange}
                  onInputMinutesChange={this.props.onInputMinutesChange}
                  selectFormula={this.props.selectFormula}
                  changeMonthType={this.changeMonthType.bind(this)}
                  selectGregorianMonth={this.selectGregorianMonth.bind(this)}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
                  resetSettings={this.resetSettings.bind(this)}
                />
                <BottomBar
                  t={this.props.t}
                />
              </div>
            )
        }
      </main>
    )
  }
}

export default MainContainer