import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import PrayerTimesContent from "./PrayerTimesContent"
import Swal from "sweetalert2"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
        this.props.selectFormula('0')
        localStorage.removeItem(this.state.FORMULA_STORAGE_KEY)
      }
    })
  }

  render() {
    return (
      <main className="prayer-times-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800">
        {innerWidth > 1024
          ? (
              <div className="prayer-times-container flex flex-nowrap w-full h-full">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <PrayerTimesContent
                  selectFormula={this.props.selectFormula}
                  resetSettings={this.resetSettings.bind(this)}
                />
              </div>
              )
          : (
              <div className="prayer-times-container flex flex-col w-full h-full">
                <PrayerTimesContent
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