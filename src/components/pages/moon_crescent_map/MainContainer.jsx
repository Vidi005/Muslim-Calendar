import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import MoonCrescentMapContent from "./MoonCrescentMapContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      MOON_VISIBILITY_CRITERIA_STORAGE_KEY: "MOON_VISIBILITY_CRITERIA_STORAGE_KEY",
      areMoonVisibilityCriteriaMapsLoading: true,
      selectedHijriMonth: this.getHijriMonthFromProps(props)
    }
  }

  getHijriMonthFromProps = props => props.hijriStartDates?.findIndex(item => item.gregorianDate > props.formattedDateTime)

  componentDidUpdate(prevProps) {
    if (prevProps.hijriStartDates !== this.props.hijriStartDates) this.setState({ selectedHijriMonth: this.getHijriMonthFromProps(this.props) })
  }

  selectHijriMonth (montIndex) {
    this.setState({ selectedHijriMonth: parseInt(montIndex) })
  }

  render() {
    return (
      <main className="moon-crescent-map-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024
          ? (
              <div className="moon-crescent-map-container flex flex-nowrap w-full h-full">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <MoonCrescentMapContent
                  state={this.state}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
                />
              </div>
              )
          : (
              <div className="moon-crescent-map-container flex flex-col w-full h-full">
                <MoonCrescentMapContent
                  state={this.state}
                  selectHijriMonth={this.selectHijriMonth.bind(this)}
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