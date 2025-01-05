import React from "react"
import InputForm from "../InputForm"
import GlobalSolarEclipses from "./GlobalSolarEclipses"
import LocalSolarEclipses from "./LocalSolarEclipses"
import LunarEclipses from "./LunarEclipses"

const EclipsesContent = ({ t }) => (
  <article className="eclipses-page-container grow duration-200 overflow-y-auto">
    <InputForm />
    <div className="flex flex-wrap md:items-stretch">
      <LocalSolarEclipses t={t}/>
      <GlobalSolarEclipses t={t}/>
      <LunarEclipses t={t}/>
    </div>
  </article>
)

export default EclipsesContent