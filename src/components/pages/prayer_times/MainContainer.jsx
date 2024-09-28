import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import PrayerTimesContent from "./PrayerTimesContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
                <PrayerTimesContent />
              </div>
              )
          : (
              <div className="prayer-times-container flex flex-col w-full h-full">
                <PrayerTimesContent />
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