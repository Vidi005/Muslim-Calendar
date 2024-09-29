import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import MoonCrescentMapContent from "./MoonCrescentMapContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <main className="moon-crescent-map-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800">
        {innerWidth > 1024
          ? (
              <div className="moon-crescent-map-container flex flex-nowrap w-full h-full">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <MoonCrescentMapContent />
              </div>
              )
          : (
              <div className="moon-crescent-map-container flex flex-col w-full h-full">
                <MoonCrescentMapContent />
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