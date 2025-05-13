import React from "react"
import Sidebar from "../Sidebar"
import AboutContent from "./AboutContent"
import BottomBar from "../BottomBar"

const MainContainer = ({ t, isSidebarExpanded }) => (
  <main className="about-page-main h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
    {innerWidth > 1024
      ? (
        <div className="about-page-container flex flex-nowrap w-full h-full pb-10">
          <Sidebar t={t} isSidebarExpanded={isSidebarExpanded}/>
          <AboutContent t={t}/>
        </div>
        )
      : (
        <div className="about-page-container flex flex-col w-full h-full">
          <AboutContent t={t}/>
          <BottomBar t={t}/>
        </div>
        )
    }
  </main>
)

export default MainContainer