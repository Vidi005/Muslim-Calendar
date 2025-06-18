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
      OBSERVATION_TIME_STORAGE_KEY: 'OBSERVATION_TIME_STORAGE_KEY',
      CORRECTED_REFRACTION_STORAGE_KEY: 'CORRECTED_REFRACTION_STORAGE_KEY',
      SHOW_TOOLTIP_STORAGE_KEY: 'SHOW_TOOLTIP_STORAGE_KEY',
      COORDINATE_STEPS_STORAGE_KEY: "COORDINATE_STEPS_STORAGE_KEY",
      areMoonVisibilityCriteriaMapsLoading: true,
      moonCrescentVisibilities: [],
      observationDates: [],
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
    } else if (prevProps.selectedMoonVisibilityCriteria !== this.props.selectedMoonVisibilityCriteria || prevProps.selectedElongationType !== this.props.selectedElongationType || prevProps.selectedAltitudeType !== this.props.selectedAltitudeType || prevProps.selectedObservationTime !== this.props.selectedObservationTime || prevProps.isUseNormalRefraction !== this.props.isUseNormalRefraction || prevProps.isTooltipShown !== this.props.isTooltipShown || prevProps.selectedCoordinateSteps !== this.props.selectedCoordinateSteps) {
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
    // Viewing from Ijtima' day -1, Ijtima' day, and Ijtima' day +1
    // const hijriDayOf28 = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    // hijriDayOf28.setDate(hijriDayOf28.getDate() + 27)
    // const ijtimaDate = getConjunctionDate(hijriDayOf28)
    // const theDayBefore = new Date(ijtimaDate.date)
    // theDayBefore.setDate(theDayBefore.getDate() - 1)
    // const theDayAfter = new Date(ijtimaDate.date)
    // theDayAfter.setDate(theDayAfter.getDate() + 1)
    // Viewing from day 28, 29, 30 of the previous Hijri Month or day 1 of the next Hijri Month
    const theDayBefore = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    theDayBefore.setDate(theDayBefore.getDate() + 27)
    const observationDay = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    const theDayAfter = new Date(this.props.hijriStartDates[this.state.selectedHijriMonth - 1]?.gregorianDate)
    observationDay.setDate(observationDay.getDate() + 28)
    theDayAfter.setDate(theDayAfter.getDate() + 29)
    Promise.all([
      this.props.generateMoonCrescentVisibility(theDayBefore),
      this.props.generateMoonCrescentVisibility(observationDay),
      this.props.generateMoonCrescentVisibility(theDayAfter)
    ]).then(moonCrescentVisibilities => {
      this.setState({
        areMoonVisibilityCriteriaMapsLoading: false,
        moonCrescentVisibilities: moonCrescentVisibilities,
        observationDates: [theDayBefore, observationDay, theDayAfter]
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
      localStorage.removeItem(this.state.OBSERVATION_TIME_STORAGE_KEY)
      localStorage.removeItem(this.state.CORRECTED_REFRACTION_STORAGE_KEY)
      localStorage.removeItem(this.state.SHOW_TOOLTIP_STORAGE_KEY)
      localStorage.removeItem(this.state.COORDINATE_STEPS_STORAGE_KEY)
    })
  }

  render() {
    return (
      <main className="moon-crescent-map-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth >= 1280
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
                  isTooltipShown={this.props.isTooltipShown}
                  selectedObservationTime={this.props.selectedObservationTime}
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
                  isTooltipShown={this.props.isTooltipShown}
                  selectedObservationTime={this.props.selectedObservationTime}
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