import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import EclipsesContent from "./EclipsesContent"

const MainContainer = ({ t, isSidebarExpanded }) => (
  <main className="eclipses-page-main h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
    {innerWidth > 1024
      ? (
        <div className="eclipses-container flex flex-nowrap w-full h-full">
          <Sidebar t={t} isSidebarExpanded={isSidebarExpanded} />
          <EclipsesContent t={t} />
        </div>
        )
      : (
        <div className="eclipses-container flex flex-col w-full h-full">
          <EclipsesContent t={t} />
          <BottomBar t={t}/>
        </div>
        )
    }
  </main>
)

export default MainContainer