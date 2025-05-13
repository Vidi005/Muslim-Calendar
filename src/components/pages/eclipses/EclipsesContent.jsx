import React from "react"
import InputForm from "../InputForm"
import GlobalSolarEclipses from "./GlobalSolarEclipses"
import LocalSolarEclipses from "./LocalSolarEclipses"
import LunarEclipses from "./LunarEclipses"
import FooterContainer from "../Footer"

const EclipsesContent = ({ t, selectedLanguage, selectedTimeZone, areLocalSolarEclipseListLoading, areGlobalSolarEclipseListLoading, areLunarEclipseListLoading, localSolarEclipseList, globalSolarEclipseList, lunarEclipseList }) => (
  <article className="eclipses-page-container grow duration-200 overflow-y-auto">
    <InputForm />
    <div className="flex flex-wrap md:items-stretch">
      <LocalSolarEclipses
        t={t}
        selectedLanguage={selectedLanguage}
        selectedTimeZone={selectedTimeZone}
        areLocalSolarEclipseListLoading={areLocalSolarEclipseListLoading}
        localSolarEclipseList={localSolarEclipseList}
      />
      <GlobalSolarEclipses
        t={t}
        selectedLanguage={selectedLanguage}
        selectedTimeZone={selectedTimeZone}
        areGlobalSolarEclipseListLoading={areGlobalSolarEclipseListLoading}
        globalSolarEclipseList={globalSolarEclipseList}
      />
      <LunarEclipses
        t={t}
        selectedLanguage={selectedLanguage}
        selectedTimeZone={selectedTimeZone}
        areLunarEclipseListLoading={areLunarEclipseListLoading}
        lunarEclipseList={lunarEclipseList}
      />
    </div>
    {innerWidth <= 1024 && <FooterContainer/>}
  </article>
)

export default EclipsesContent