import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import HomeContent from "./HomeContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <main className="home-page h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024
          ? (
              <div className="home-container flex flex-nowrap w-full h-full pb-10">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.isSidebarExpanded}
                />
                <HomeContent
                  sliderRef={this.props.sliderRef}
                  calendarContainerRef={this.props.calendarContainerRef}
                  tooltipRef={this.props.tooltipRef}
                  showTooltip={this.props.showTooltip}
                  hideTooltip={this.props.hideTooltip}
                  goToCurrentMonth={this.props.goToCurrentMonth}
                  jumpToClickedMonth={this.props.jumpToClickedMonth}
                />
              </div>
              )
          : (
              <div className="home-container flex flex-col w-full h-full">
                <HomeContent
                  sliderRef={this.props.sliderRef}
                  calendarContainerRef={this.props.calendarContainerRef}
                  tooltipRef={this.props.tooltipRef}
                  showTooltip={this.props.showTooltip}
                  hideTooltip={this.props.hideTooltip}
                  goToCurrentMonth={this.props.goToCurrentMonth}
                  jumpToClickedMonth={this.props.jumpToClickedMonth}
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