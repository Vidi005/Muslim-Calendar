import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import MoonCrescentMapContent from "./MoonCrescentMapContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      MOON_VISIBILITY_CRITERIA_STORAGE_KEY: "MOON_VISIBILITY_CRITERIA_STORAGE_KEY",
      ELONGATION_TYPE_STORAGE_KEY: 'ELONGATION_TYPE_STORAGE_KEY',
      ALTITUDE_TYPE_STORAGE_KEY: 'ALTITUDE_TYPE_STORAGE_KEY',
      CORRECTED_REFRACTION_STORAGE_KEY: 'CORRECTED_REFRACTION_STORAGE_KEY',
      COORDINATE_STEPS_STORAGE_KEY: "COORDINATE_STEPS_STORAGE_KEY",
      areMoonVisibilityCriteriaMapsLoading: true,
      moonCrescentVisibilities: [],
      ijtimaDates: [],
      selectedHijriMonth: this.getHijriMonthFromProps(props)
    }
  }

  getHijriMonthFromProps = props => props.hijriStartDates?.findIndex(item => item.gregorianDate > props.formattedDateTime)
  
  componentDidMount() {
    this.createMoonCrescentVisibilities()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.monthInSetyear !== this.props.monthInSetyear || prevProps.hijriStartDates !== this.props.hijriStartDates) {
      this.setState({
        areMoonVisibilityCriteriaMapsLoading: true,
        selectedHijriMonth: this.getHijriMonthFromProps(this.props)
      }, () => {
        this.createMoonCrescentVisibilities()
      })
    } else if (prevProps.selectedMoonVisibilityCriteria !== this.props.selectedMoonVisibilityCriteria || prevProps.selectedElongationType !== this.props.selectedElongationType || prevProps.selectedAltitudeType !== this.props.selectedAltitudeType || prevProps.isUseNormalRefraction !== this.props.isUseNormalRefraction || prevProps.selectedCoordinateSteps !== this.props.selectedCoordinateSteps) {
      this.setState({ areMoonVisibilityCriteriaMapsLoading: true }, () => this.createMoonCrescentVisibilities())
    }
  }

  selectHijriMonth (monthIndex) {
    this.setState({
      areMoonVisibilityCriteriaMapsLoading: true,
      selectedHijriMonth: parseInt(monthIndex)
    }, () => this.createMoonCrescentVisibilities())
  }

  createMoonCrescentVisibilities () {
    const theDayBeforeIjtima = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    theDayBeforeIjtima.setDate(theDayBeforeIjtima.getDate() + 27)
    const ijtimaDay = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    const theDayAfterIjtima = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    ijtimaDay.setDate(ijtimaDay.getDate() + 28)
    theDayAfterIjtima.setDate(theDayAfterIjtima.getDate() + 29)
    Promise.all([
      this.props.generateMoonCrescentVisibility(theDayBeforeIjtima),
      this.props.generateMoonCrescentVisibility(ijtimaDay),
      this.props.generateMoonCrescentVisibility(theDayAfterIjtima)
    ]).then(moonCrescentVisibilities => {
      this.setState({
        areMoonVisibilityCriteriaMapsLoading: false,
        moonCrescentVisibilities: moonCrescentVisibilities,
        ijtimaDates: [theDayBeforeIjtima, ijtimaDay, theDayAfterIjtima]
      })
    })
  }

  restoreToDefault () {
    this.setState({
      areMoonVisibilityCriteriaMapsLoading: true,
      selectedHijriMonth: this.getHijriMonthFromProps(this.props)
    }, () => {
      this.createMoonCrescentVisibilities()
      localStorage.removeItem(this.state.MOON_VISIBILITY_CRITERIA_STORAGE_KEY)
      localStorage.removeItem(this.state.ELONGATION_TYPE_STORAGE_KEY)
      localStorage.removeItem(this.state.ALTITUDE_TYPE_STORAGE_KEY)
      localStorage.removeItem(this.state.CORRECTED_REFRACTION_STORAGE_KEY)
      localStorage.removeItem(this.state.COORDINATE_STEPS_STORAGE_KEY)
    })
  }

  render() {
    return (
      <main className="moon-crescent-map-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024
          ? (
              <div className="moon-crescent-map-container flex flex-nowrap w-full h-full pb-10">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <MoonCrescentMapContent
                  t={this.props.t}
                  state={this.state}
                  selectedLanguage={this.props.selectedLanguage}
                  selectedTimeZone={this.props.selectedTimeZone}
                  selectedMoonVisibilityCriteria={this.props.selectedMoonVisibilityCriteria}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
                  restoreToDefault={this.restoreToDefault.bind(this)}
                />
              </div>
              )
          : (
              <div className="moon-crescent-map-container flex flex-col w-full h-full">
                <MoonCrescentMapContent
                  t={this.props.t}
                  state={this.state}
                  selectedLanguage={this.props.selectedLanguage}
                  selectedTimeZone={this.props.selectedTimeZone}
                  selectedMoonVisibilityCriteria={this.props.selectedMoonVisibilityCriteria}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
                  restoreToDefault={this.restoreToDefault.bind(this)}
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