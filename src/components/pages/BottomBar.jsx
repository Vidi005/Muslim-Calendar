import React from "react"
import { pages } from "../../utils/data"
import { Link } from "react-router-dom"

const BottomBar = ({ t }) => (
  <React.Fragment>
    <footer className="bottom-bar grid grid-flow-col h-14 w-full bg-green-600 dark:bg-green-700 duration-200 animate__animated animate__fadeIn">
      {pages().map((page, index) => (
        <Link to={page.path} key={index} className="h-full w-full place-self-center p-2 hover:bg-white/50 dark:hover:bg-white/25 duration-200 rounded-lg" style={{ backgroundColor: location.pathname.includes(page.path) ? "#86efac80" : "" }}>
          <img className="h-full mx-auto p-1 object-contain object-center duration-200" src={`${import.meta.env.BASE_URL}images/${page.icon}`} alt={t(`pages.${index}`)} />
        </Link>
      ))}
    </footer>
  </React.Fragment>
)

export default BottomBar