import React from "react"
import { pages } from "../../utils/data"
import { Link } from "react-router-dom"

const Sidebar = ({ t, isSidebarExpanded }) => (
  <aside className="sidebar h-full flex-none flex flex-col p-1 overflow-y-auto bg-green-500 dark:bg-green-700 duration-300 animate__animated animate__fadeIn" style={{ width: isSidebarExpanded ? "20%" : "64px" }}>
    {isSidebarExpanded &&
      <img className="w-1/2 mx-auto p-4 object-contain object-center" src={`${import.meta.env.BASE_URL}images/mc-icon.png`} alt="App Icon" />
    }
    {pages().map((page, index) => (
      <Link to={page.path} key={index} className="flex items-center border-b border-b-white p-1 hover:bg-white/50 dark:hover:bg-white/25 duration-200 hover:rounded-lg" style={{ marginBottom: isSidebarExpanded ? "0" : "4px", backgroundColor: location.pathname.includes(page.path) ? "#86efac80" : "", borderRadius: location.pathname.includes(page.path) ? "8px" : "" }}>
        <img className="m-1 object-contain object-center duration-200" src={`${import.meta.env.BASE_URL}images/${page.icon}`} alt={t(`pages.${index}`)} style={{ width: isSidebarExpanded ? "32px" : "100%" }} />
        <h4 className="p-1 text-white whitespace-nowrap duration-200" style={{ display: isSidebarExpanded ? "block" : "none" }}>{t(`pages.${index}`)}</h4>
      </Link>
    ))}
  </aside>
)

export default Sidebar