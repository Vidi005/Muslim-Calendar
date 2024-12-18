import React from "react"
import InputForm from "../InputForm"
import MoonCrescentMapSettings from "./MoonCrescentMapSettings"

const MoonCrescentMapContent = ({ state, selectHijriMonth }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <MoonCrescentMapSettings
      selectHijriMonth={selectHijriMonth}
      selectedHijriMonth={state.selectedHijriMonth}
    />
  </article>
)

export default MoonCrescentMapContent