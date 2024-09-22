import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const HomePage = ({ t, state, toggleSidebar, collapseSidebar, changeLanguage, setDisplayMode, onInputLocationChange, setSelectedLocation }) => (
  <div className="home-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <meta name="keyword" content="Muslim Calendar" />
    </Helmet>
    <HeaderContainer
      t={t}
      isSidebarExpanded={state.isSidebarExpanded}
      isDarkMode={state.isDarkMode}
      toggleSidebar={toggleSidebar}
      changeLanguage={changeLanguage}
      setDisplayMode={setDisplayMode}
    />
    <MainContainer
      t={t}
      state={state}
      collapseSidebar={collapseSidebar}
      onInputLocationChange={onInputLocationChange}
      setSelectedLocation={setSelectedLocation}
    />
  </div>
)

export default HomePage