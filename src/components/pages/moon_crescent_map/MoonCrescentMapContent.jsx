import React from "react"
import InputForm from "../InputForm"
import MoonCrescentMapSettings from "./MoonCrescentMapSettings"

const MoonCrescentMapContent = ({ }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <MoonCrescentMapSettings />
  </article>
)

export default MoonCrescentMapContent