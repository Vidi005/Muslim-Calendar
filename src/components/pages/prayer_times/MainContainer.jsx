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
      FORMULA_STORAGE_KEY: "FORMULA_STORAGE_KEY"
    }
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
        this.props.selectIhtiyath(1)
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
                  selectCalculationMethod={this.props.selectCalculationMethod}
                  selectAshrTime={this.props.selectAshrTime}
                  selectConvention={this.props.selectConvention}
                  selectIhtiyath={this.props.selectIhtiyath}
                  selectCorrections={this.props.selectCorrections}
                  selectDhuhaMethod={this.props.selectDhuhaMethod}
                  onInputSunAltitudeChange={this.props.onInputSunAltitudeChange}
                  onInputMinutesChange={this.props.onInputMinutesChange}
                  selectFormula={this.props.selectFormula}
                  resetSettings={this.resetSettings.bind(this)}
                />
              </div>
              )
          : (
              <div className="prayer-times-container flex flex-col w-full h-full">
                <PrayerTimesContent
                  selectCalculationMethod={this.props.selectCalculationMethod}
                  selectAshrTime={this.props.selectAshrTime}
                  selectConvention={this.props.selectConvention}
                  selectIhtiyath={this.props.selectIhtiyath}
                  selectCorrections={this.props.selectCorrections}
                  selectDhuhaMethod={this.props.selectDhuhaMethod}
                  onInputSunAltitudeChange={this.props.onInputSunAltitudeChange}
                  onInputMinutesChange={this.props.onInputMinutesChange}
                  selectFormula={this.props.selectFormula}
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