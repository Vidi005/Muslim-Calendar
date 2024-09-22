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
      <main className="home-page h-full flex-auto grow flex-nowrap bg-green-100 dark:bg-gray-800">
        {innerWidth > 1024
          ? (
              <div className="home-container flex flex-nowrap w-full h-full overflow-y-auto">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.state.isSidebarExpanded}
                />
                <HomeContent
                  t={this.props.t}
                  collapseSidebar={this.props.collapseSidebar}
                  onInputLocationChange={this.props.onInputLocationChange}
                  inputLocation={this.props.state.inputLocation}
                  isSearching={this.props.state.isSearching}
                  suggestedLocations={this.props.state.suggestedLocations}
                  selectedLanguage={this.props.state.selectedLanguage}
                  selectedLocation={this.props.state.selectedLocation}
                  setSelectedLocation={this.props.setSelectedLocation}
                />
              </div>
              )
          : (
              <div className="home-container flex flex-col w-full h-full">
                <HomeContent
                  t={this.props.t}
                  onInputLocationChange={this.props.onInputLocationChange}
                  inputLocation={this.props.state.inputLocation}
                  isSearching={this.props.state.isSearching}
                  suggestedLocations={this.props.state.suggestedLocations}
                  selectedLanguage={this.props.state.selectedLanguage}
                  selectedLocation={this.props.state.selectedLocation}
                  setSelectedLocation={this.props.setSelectedLocation}
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