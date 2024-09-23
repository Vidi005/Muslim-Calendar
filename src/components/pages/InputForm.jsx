import { Combobox, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

const InputForm = ({ t, selectedLanguage, isToolbarShown, inputLocation, isSearching, toggleToolbar, onInputLocationChange, selectedLocation, suggestedLocations, setSelectedLocation }) => {
  if (innerWidth > 1024) {
    return (
      <section className="form-container sticky shadow-md">
        <Transition
          appear
          show={isToolbarShown}
          className={"flex items-baseline max-w-full border-b border-b-green-900 dark:border-b-white w-full px-2 py-1 bg-green-500/50 dark:bg-white/50 backdrop-blur-sm duration-200"}
          enter="ease-out duration-300"
          enterFrom="opacity-0 -translate-y-1/2"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1/2"
        >
          <article className="grid grid-flow-row items-center gap-2 flex-1 p-1">
            <h4 className="font-serif whitespace-nowrap">{t('app_config')}</h4>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="flex items-center">
                <label htmlFor="date">{t('date')}</label>
                <input
                  type="date"
                  lang={selectedLanguage}
                  className="input-date ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
              <span className="flex items-center">
                <label htmlFor="time">{t('time')}</label>
                <input
                  type="time"
                  lang={selectedLanguage}
                  className="input-time ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
              <button className="flex items-center p-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/my-location-icon.svg`} alt="Current Location" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('current_location')}</span>
              </button>
              <button className="flex items-center p-1 bg-yellow-700 hover:bg-yellow-500 hover:dark:bg-yellow-300 dark:bg-yellow-500 active:bg-yellow-700 dark:active:bg-yellow-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/restore-datetime-icon.svg`} alt="Restore Datetime" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_datetime')}</span>
              </button>
              <button className="flex items-center p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('reset_settings')}</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <Combobox as={"span"} className={"flex items-center"} value={selectedLocation} onChange={setSelectedLocation}>
                <Combobox.Label>{t('location')}&nbsp;</Combobox.Label>
                <div className="relative flex items-center">
                  <Combobox.Input
                    className={"ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"}
                    onChange={event => onInputLocationChange(event.target.value)}
                    displayValue={location => location || ''}
                    placeholder={t('search_location')}
                  ></Combobox.Input>
                  {isSearching && (
                    <Combobox.Button className={"flex items-center justify-center h-7 w-7 p-1 bg-green-200 dark:bg-gray-200 rounded-r"}>
                      <span className="border-t-2 border-r-2 border-t-green-900 border-r-green-900 w-full h-full rounded-full animate-spin"></span>
                    </Combobox.Button>
                  )}
                  {inputLocation.length > 0 && !isSearching && (
                    <Combobox.Button className={"flex items-center justify-center bg-green-200 dark:bg-gray-200 px-1.5 py-0.5 text-base text-red-700 rounded-r"}>X</Combobox.Button>
                  )}
                  <Transition
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95 -translate-y-1/4"
                    enterTo="opacity-100 scale-100 translate-y-full"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-full"
                    leaveTo="opacity-0 scale-95 -translate-y-1/4"
                  >
                    <Combobox.Options className={"absolute mt-1 p-1 max-h-16 w-max bg-green-200/50 dark:bg-gray-200/50 backdrop-blur-sm rounded shadow dark:shadow-white/50 translate-y-full overflow-y-auto z-10 duration-200"}>
                      {suggestedLocations.length === 0 && inputLocation.length > 0 && !isSearching
                        ? <span className="p-1">{t('no_locations_found')}</span>
                        : (
                            suggestedLocations.map(location => (
                              <Combobox.Option
                                key={location}
                                value={location}
                                className={({ active }) => `${active ? 'bg-green-500 dark:bg-gray-500 text-white' : 'text-green-900 dark:text-black'} flex flex-nowrap items-center cursor-default select-none p-1 rounded-md duration-200`}
                              >
                                {location}
                              </Combobox.Option>
                          )))
                      }
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
              <form className="flex items-center justify-between gap-2" onSubmit={e => e.preventDefault()}>
                <span className="flex items-center">
                  <label htmlFor="latitude">{t('latitude')}&nbsp;</label>
                  <input
                    type="number"
                    className="input-latitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                    required
                  />
                </span>
                <span className="flex items-center">
                  <label htmlFor="longitude">{t('longitude')}&nbsp;</label>
                  <input
                    type="number"
                    className="input-longitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                    required
                  />
                </span>
                <span className="flex items-center">
                  <label htmlFor="altitude">{t('altitude')}&nbsp;</label>
                  <input
                    type="number"
                    className="input-altitude w-16 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                    required
                  />
                  <p>&nbsp;m</p>
                </span>
                <button type="submit" className="flex items-center px-2 py-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 text-sm text-white rounded-md duration-200 shadow">{t('apply')}</button>
              </form>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="flex items-center">
                <label>{t('day_correction')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} required>
                  <option value="0">{t('corrections.0')}</option>
                  <option value="1">{t('corrections.1')}</option>
                  <option value="2">{t('corrections.2')}</option>
                </select>
              </span>
              <span className="flex items-center">
                <label>{t('sun_declination')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} required>
                  <option value="0">{t('calculations.0')}</option>
                  <option value="1">{t('calculations.1')}</option>
                </select>
              </span>
              <span className="flex items-center">
                <label>{t('interval_update')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={0} required>
                  <option value="0">{t('intervals.0')}</option>
                  <option value="1">{t('intervals.1')}</option>
                  <option value="2">{t('intervals.2')}</option>
                </select>
              </span>
            </div>
          </article>
          <table className="table-auto flex-none ml-1">
            <thead className="font-serif font-bold text-lg text-transparent">{t('current_date')}</thead>
            <thead className="font-serif font-bold text-lg">{t('current_date')}</thead>
            <tr className="font-bold">
              <td>{t('georgian_date')}</td>
              <td className="pl-1 pr-2">:</td>
              <td>{new Date().toLocaleDateString(selectedLanguage, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
            </tr>
            <tr className="text-green-700 dark:text-green-200 duration-200">
              <td>{t('hijri_date')}</td>
              <td className="pl-1 pr-2">:</td>
              <td>{new Date().toLocaleDateString(selectedLanguage, { calendar: "islamic", year: "numeric", month: "long", day: "numeric" })}</td>
            </tr>
            <tr className="border-t border-t-black font-serif font-bold text-lg">
              <td colSpan={3}>{t('current_time')}&nbsp;<span className="font-sans">{new Date().toLocaleTimeString(selectedLanguage, { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" })}</span></td>
            </tr>
          </table>
        </Transition>
        <nav className="absolute flex items-center top-0 right-0 cursor-pointer px-2 py-1 bg-green-500/75 dark:bg-gray-500/75 hover:bg-green-500/25 hover:dark:bg-gray-500/25 text-base text-white backdrop-blur-sm shadow-inner rounded-bl-lg duration-200" onClick={toggleToolbar}>
          <img className={`${isToolbarShown ? "scale-y-[-1]" : ""}  object-contain object-center duration-300`} src={`${import.meta.env.BASE_URL}images/expand-icon.svg`} alt="Show/Hide Toolbar" />
          <span>{isToolbarShown ? t('hide_toolbar') : t('show_toolbar')}</span>
        </nav>
      </section>
    )
  } else {
    return (
      <section className="form-container sticky shadow-md">
        <Transition
          appear
          show={isToolbarShown}
          className={" border-b border-b-green-900 dark:border-b-white w-full p-1 bg-green-500/50 dark:bg-white/50 backdrop-blur-sm"}
          enter="ease-out duration-300"
          enterFrom="opacity-0 -translate-y-1/2"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1/2"
        >
          <table className="p-1">
            <thead className="font-serif font-bold text-sm whitespace-nowrap">Current Date :</thead>
            <tr className="font-bold text-xs">
              <td>{t('georgian_date')}</td>
              <td className="pl-0.5 pr-1">:</td>
              <td className="w-full">{new Date().toLocaleDateString(selectedLanguage, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
            </tr>
            <tr className="text-green-700 dark:text-green-200 text-xs duration-200">
              <td>{t('hijri_date')}</td>
              <td className="pl-0.5 pr-1">:</td>
              <td className="w-full">{new Date().toLocaleDateString(selectedLanguage, { calendar: "islamic", year: "numeric", month: "long", day: "numeric" })}</td>
            </tr>
            <tr className="font-serif font-bold text-sm">
              <td colSpan={3}>Current Time : &nbsp;<span className="font-sans text-xs">{new Date().toLocaleTimeString(selectedLanguage, { hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" })}</span></td>
            </tr>
          </table>
          <article className="grid grid-flow-row items-center gap-2 border-t border-t-white">
            <h5 className="font-serif text-sm whitespace-nowrap">{t('app_config')}</h5>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button className="flex items-center p-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/my-location-icon.svg`} alt="Current Location" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('current_location')}</span>
              </button>
              <button className="flex items-center p-1 bg-yellow-700 hover:bg-yellow-500 hover:dark:bg-yellow-300 dark:bg-yellow-500 active:bg-yellow-700 dark:active:bg-yellow-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/restore-datetime-icon.svg`} alt="Restore Datetime" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_datetime')}</span>
              </button>
              <button className="flex items-center p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow">
                <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
                <span className="ml-1 text-white text-sm whitespace-nowrap">{t('reset_settings')}</span>
              </button>
              <span className="flex items-center text-sm">
                <label htmlFor="date">{t('date')}</label>
                <input
                  type="date"
                  lang={selectedLanguage}
                  className="input-date ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
              <span className="flex items-center text-sm">
                <label htmlFor="time">{t('time')}</label>
                <input
                  type="time"
                  lang={selectedLanguage}
                  className="input-time ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
            </div>
            <form className="flex flex-wrap items-center justify-center gap-2" onSubmit={e => e.preventDefault()}>
              <Combobox as={"span"} className={"flex items-center gap-1 text-sm"} value={selectedLocation} onChange={setSelectedLocation}>
                <Combobox.Label>{t('location')}&nbsp;</Combobox.Label>
                <div className="relative flex items-center">
                  <Combobox.Input
                    className={"ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"}
                    onChange={event => onInputLocationChange(event.target.value)}
                    displayValue={location => location || ''}
                    placeholder={t('search_location')}
                  ></Combobox.Input>
                  {isSearching && (
                    <Combobox.Button className={"flex items-center justify-center h-7 w-7 p-1 bg-green-200 dark:bg-gray-200 rounded-r"}>
                      <span className="border-t-2 border-r-2 border-t-green-900 border-r-green-900 w-full h-full rounded-full animate-spin"></span>
                    </Combobox.Button>
                  )}
                  {inputLocation.length > 0 && !isSearching && (
                    <Combobox.Button className={"flex items-center justify-center bg-green-200 dark:bg-gray-200 px-1.5 py-0.5 text-base text-red-700 rounded-r"}>X</Combobox.Button>
                  )}
                  <Transition
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95 -translate-y-1/4"
                    enterTo="opacity-100 scale-100 translate-y-full"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-full"
                    leaveTo="opacity-0 scale-95 -translate-y-1/4"
                  >
                    <Combobox.Options className={"absolute mt-1 p-1 max-h-16 w-max bg-green-200/50 dark:bg-gray-200/50 backdrop-blur-sm rounded shadow dark:shadow-white/50 translate-y-full overflow-y-auto z-10 duration-200"}>
                      {suggestedLocations.length === 0 && inputLocation.length > 0 && !isSearching
                        ? <span className="p-1">{t('no_locations_found')}</span>
                        : (
                            suggestedLocations.map(location => (
                              <Combobox.Option
                                key={location}
                                value={location}
                                className={({ active }) => `${active ? 'bg-green-500 dark:bg-gray-500 text-white' : 'text-green-900 dark:text-black'} flex flex-nowrap items-center cursor-default select-none p-1 rounded-md duration-200`}
                              >
                                {location}
                              </Combobox.Option>
                          )))
                      }
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
              <span className="flex items-center text-sm">
                <label htmlFor="latitude">{t('latitude')}&nbsp;</label>
                <input
                  type="number"
                  className="input-latitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
              <span className="flex items-center text-sm">
                <label htmlFor="longitude">{t('longitude')}&nbsp;</label>
                <input
                  type="number"
                  className="input-longitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
              </span>
              <span className="flex items-center text-sm">
                <label htmlFor="altitude">{t('altitude')}&nbsp;</label>
                <input
                  type="number"
                  className="input-altitude w-16 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"
                  required
                />
                <p>&nbsp;m</p>
              </span>
              <button type="submit" className="flex items-center px-2 py-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 text-sm text-white rounded-md duration-200 shadow">{t('apply')}</button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="flex items-center">
                <label>{t('day_correction')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} required>
                  <option value="0">{t('corrections.0')}</option>
                  <option value="1">{t('corrections.1')}</option>
                  <option value="2">{t('corrections.2')}</option>
                </select>
              </span>
              <span className="flex items-center">
                <label>{t('sun_declination')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} required>
                  <option value="0">{t('calculations.0')}</option>
                  <option value="1">{t('calculations.1')}</option>
                </select>
              </span>
              <span className="flex items-center">
                <label>{t('interval_update')}&nbsp;</label>
                <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={0} required>
                  <option value="0">{t('intervals.0')}</option>
                  <option value="1">{t('intervals.1')}</option>
                  <option value="2">{t('intervals.2')}</option>
                </select>
              </span>
            </div>
          </article>
        </Transition>
        <nav className="absolute flex items-center top-0 right-0 cursor-pointer px-1 py-0.5 bg-green-500/75 dark:bg-gray-500/75 hover:bg-green-500/25 hover:dark:bg-gray-500/25 text-sm text-white backdrop-blur-sm shadow-inner rounded-bl-lg duration-200" onClick={toggleToolbar}>
          <img className={`${isToolbarShown ? "scale-y-[-1]" : ""}  object-contain object-center duration-300`} src={`${import.meta.env.BASE_URL}images/expand-icon.svg`} alt="Show/Hide Toolbar" />
          <span>{isToolbarShown ? t('hide_toolbar') : t('show_toolbar')}</span>
        </nav>
      </section>
    )
  }
}

export default InputForm