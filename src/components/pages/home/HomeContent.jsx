import React from "react"
import InputForm from "../InputForm"

const HomeContent = ({ t, selectedLanguage, isToolbarShown, currentDate, inputLocation, latitude, longitude, altitude, isSearching, toggleToolbar, getCurrentLocation, onInputLocationChange, selectedLocation, suggestedLocations, setSelectedLocation, onInputLatitudeChange, onInputLongitudeChange, onInputAltitudeChange, applyLocationCoordinates }) => (
  <article className="home-content grow bg-green-100 dark:bg-gray-700 duration-200">
    <InputForm
      t={t}
      selectedLanguage={selectedLanguage}
      isToolbarShown={isToolbarShown}
      currentDate={currentDate}
      inputLocation={inputLocation}
      latitude={latitude}
      longitude={longitude}
      altitude={altitude}
      toggleToolbar={toggleToolbar}
      getCurrentLocation={getCurrentLocation}
      onInputLocationChange={onInputLocationChange}
      isSearching={isSearching}
      selectedLocation={selectedLocation}
      suggestedLocations={suggestedLocations}
      setSelectedLocation={setSelectedLocation}
      onInputLatitudeChange={onInputLatitudeChange}
      onInputLongitudeChange={onInputLongitudeChange}
      onInputAltitudeChange={onInputAltitudeChange}
      applyLocationCoordinates={applyLocationCoordinates}
    />
  </article>
)

export default HomeContent