import { Menu, Switch, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

const HeaderContainer = ({ t, isSidebarExpanded, toggleSidebar, changeLanguage, setDisplayMode, isDarkMode }) => (
  <header className="app-header sticky top-0 flex flex-nowrap items-center justify-between bg-green-600 w-full p-1 shadow-xl z-10">
    <section className="header-title grow flex items-center">
      {innerWidth > 1024
        ? (
            <button className="p-1 hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white/75 duration-200 rounded-md" onClick={toggleSidebar}>
              <img className="h-8 object-contain drop-shadow-md px-1" src={`${import.meta.env.BASE_URL}images/sidebar-icon.svg`}/>
            </button>
          )
        : <img className="h-8 p-0.5 object-contain object-center" src={`${import.meta.env.BASE_URL}images/calendar-icon.svg`} alt="App Icon" />
      }
      <h3 className="grow px-2 font-serif text-white whitespace-nowrap">{t('app_name')}</h3>
    </section>
    <section className="w-fit flex items-center pl-1">
      <a href="https://github.com/Vidi005/muslim-calendar" title="Repository" target="_blank" rel="noreferrer noopener">
        <img className="h-10 mr-1 md:mr-2 p-2 object-contain hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white/75 duration-200 rounded-md" src={`${import.meta.env.BASE_URL}images/github-icon.png`} alt="Github" />
      </a>
      <Switch
        checked={isDarkMode}
        onChange={setDisplayMode}
        title="Theme Setting"
        className={`${
          isDarkMode
            ? "bg-green-700"
            : "bg-green-500"
        } relative inline-flex h-6 w-12 px-1 items-center cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 rounded-full`}
      >
        <span className="sr-only">Theme Setting</span>
        <span className={`${isDarkMode ? "translate-x-6" : "translate-x-0"} inline-block h-4 w-4 transform rounded-full bg-white transition duration-300`}>
          <img className="h-full p-0.5 object-contain object-center duration-200 animate__animated animate__fadeIn" src={`${isDarkMode ? `${import.meta.env.BASE_URL}images/moon-icon.svg` : `${import.meta.env.BASE_URL}images/sun-icon.svg`}`} alt="Theme Setting" />
        </span>
      </Switch>
      <Menu as={"menu"} className={"inline-block h-10 pl-2"}>
        <Menu.Button className={"inline-flex w-full items-center justify-center h-full p-2 hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white/75 duration-200 rounded-md"} title="Languages">
          <img className="h-full object-contain" src={`${import.meta.env.BASE_URL}images/lang-icon.svg`} alt="Languages" />
          <img className="h-full object-contain" src={`${import.meta.env.BASE_URL}images/expand-icon.svg`} alt="Expand" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95 -translate-y-1/2"
          enterTo="transform opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100 translate-y-0"
          leaveTo="transform opacity-0 scale-95 -translate-y-1/2"
        >
          <Menu.Items className="absolute grid grid-flow-row gap-1 right-1 mt-2 w-40 origin-top-right divide-y divide-green-100 rounded-lg bg-green-600 shadow-lg ring-1 ring-green-100 ring-opacity-5 focus:outline-none text-base z-20 overflow-hidden">
            <Menu.Item as={"span"} className={"text-white hover:bg-green-300 hover:text-green-700 cursor-pointer p-2 duration-200 rounded-md animate__animated animate__fadeInRight animate__faster"} onClick={() => changeLanguage("en")}>English</Menu.Item>
            <Menu.Item as={"span"} className={"text-white hover:bg-green-300 hover:text-green-700 cursor-pointer p-2 duration-200 rounded-md animate__animated animate__fadeInRight animate__faster"} onClick={() => changeLanguage("id")}>Indonesian</Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  </header>
)

export default HeaderContainer