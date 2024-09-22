import React from "react"
import InputForm from "../InputForm"

const HomeContent = ({ t, selectedLanguage, inputLocation, isSearching, onInputLocationChange, selectedLocation, suggestedLocations, setSelectedLocation }) => (
  <article className="home-content grow bg-green-100 dark:bg-gray-700 duration-200">
    <InputForm
      t={t}
      selectedLanguage={selectedLanguage}
      inputLocation={inputLocation}
      onInputLocationChange={onInputLocationChange}
      isSearching={isSearching}
      selectedLocation={selectedLocation}
      suggestedLocations={suggestedLocations}
      setSelectedLocation={setSelectedLocation}
    />
  </article>
)

export default HomeContent