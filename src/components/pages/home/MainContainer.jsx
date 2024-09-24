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
                  toggleToolbar={this.props.toggleToolbar}
                  currentDate={this.props.state.currentDate}
                  longitude={this.props.state.longitude}
                  latitude={this.props.state.latitude}
                  altitude={this.props.state.altitude}
                  getCurrentLocation={this.props.getCurrentLocation}
                  onInputLocationChange={this.props.onInputLocationChange}
                  isToolbarShown={this.props.state.isToolbarShown}
                  inputLocation={this.props.state.inputLocation}
                  isSearching={this.props.state.isSearching}
                  suggestedLocations={this.props.state.suggestedLocations}
                  selectedLanguage={this.props.state.selectedLanguage}
                  selectedLocation={this.props.state.selectedLocation}
                  setSelectedLocation={this.props.setSelectedLocation}
                  onInputLatitudeChange={this.props.onInputLatitudeChange}
                  onInputLongitudeChange={this.props.onInputLongitudeChange}
                  onInputAltitudeChange={this.props.onInputAltitudeChange}
                  applyLocationCoordinates={this.props.applyLocationCoordinates}
                  />
              </div>
              )
          : (
              <div className="home-container flex flex-col w-full h-full">
                <HomeContent
                  t={this.props.t}
                  toggleToolbar={this.props.toggleToolbar}
                  currentDate={this.props.state.currentDate}
                  latitude={this.props.state.latitude}
                  longitude={this.props.state.longitude}
                  altitude={this.props.state.altitude}
                  getCurrentLocation={this.props.getCurrentLocation}
                  onInputLocationChange={this.props.onInputLocationChange}
                  isToolbarShown={this.props.state.isToolbarShown}
                  inputLocation={this.props.state.inputLocation}
                  isSearching={this.props.state.isSearching}
                  suggestedLocations={this.props.state.suggestedLocations}
                  selectedLanguage={this.props.state.selectedLanguage}
                  selectedLocation={this.props.state.selectedLocation}
                  setSelectedLocation={this.props.setSelectedLocation}
                  onInputLatitudeChange={this.props.onInputLatitudeChange}
                  onInputLongitudeChange={this.props.onInputLongitudeChange}
                  onInputAltitudeChange={this.props.onInputAltitudeChange}
                  applyLocationCoordinates={this.props.applyLocationCoordinates}
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