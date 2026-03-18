import React from "react"
import InputForm from "../InputForm"
import GlobalSolarEclipses from "./GlobalSolarEclipses"
import LocalSolarEclipses from "./LocalSolarEclipses"
import LunarEclipses from "./LunarEclipses"
import FooterContainer from "../Footer"

const EclipsesContent = ({ t, selectedLanguage, selectedTimeZone, areLocalSolarEclipseListLoading, isUpcomingSolarEclipseMapLoading, areGlobalSolarEclipseListLoading, isUpcomingLunarEclipseMapLoading, areLunarEclipseListLoading, localSolarEclipseList, upcomingSolarEclipseMap, globalSolarEclipseList, lunarEclipseList, upcomingLunarEclipseMap }) => (
  <article className="eclipses-page-container flex flex-col grow duration-200 overflow-y-auto">
    <InputForm />
    <div className="flex flex-wrap md:items-stretch grow md:flex-none">
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
        isUpcomingSolarEclipseMapLoading={isUpcomingSolarEclipseMapLoading}
        upcomingSolarEclipseMap={upcomingSolarEclipseMap}
        areGlobalSolarEclipseListLoading={areGlobalSolarEclipseListLoading}
        globalSolarEclipseList={globalSolarEclipseList}
      />
      <LunarEclipses
        t={t}
        selectedLanguage={selectedLanguage}
        selectedTimeZone={selectedTimeZone}
        isUpcomingLunarEclipseMapLoading={isUpcomingLunarEclipseMapLoading}
        upcomingLunarEclipseMap={upcomingLunarEclipseMap}
        areLunarEclipseListLoading={areLunarEclipseListLoading}
        lunarEclipseList={lunarEclipseList}
      />
    </div>
    {innerWidth < 1280 && <FooterContainer/>}
  </article>
)

export default EclipsesContent