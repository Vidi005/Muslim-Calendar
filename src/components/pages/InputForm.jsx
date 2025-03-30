import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from "@headlessui/react"
import React, { Fragment } from "react"
import { HomePageConsumer } from "../contexts/HomPageContext"
import en from "../../locales/en.json"
import { getTimeZoneList } from "../../utils/data"

const InputForm = () => (
  <HomePageConsumer>
    {({ t, selectedLanguage, state, toggleToolbar, setDesiredDate, setDesiredTime, getCurrentLocation, restoreDateTime, resetSettings, onInputLocationChange, onClearLocationInput, setSelectedLocation, onInputLatitudeChange, onInputLongitudeChange, onInputAltitudeChange, applyLocationCoordinates, selectCriteria, selectTimeZone, selectIntervalUpdate }) => {
      if (innerWidth > 1024) {
        return (
          <section className="form-container sticky top-0 shadow-md z-10">
            <Transition
              appear
              show={state.isToolbarShown}
              as={"div"}
              className={"flex items-baseline border-b border-b-green-900 dark:border-b-white w-full px-2 py-1 bg-green-500/50 dark:bg-white/50 backdrop-blur-sm duration-200"}
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
                    <label htmlFor="date">{t('local_date')}</label>
                    <input
                      type="date"
                      lang={selectedLanguage}
                      value={state.inputDate}
                      className="input-date ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      onChange={setDesiredDate}
                      required
                    />
                  </span>
                  <span className="flex items-center">
                    <label htmlFor="time">{t('local_time')}</label>
                    <input
                      type="time"
                      lang={selectedLanguage}
                      value={state.inputTime}
                      className="input-time ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      onChange={setDesiredTime}
                      required
                    />
                  </span>
                  <button className="flex items-center p-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-400 dark:bg-green-600 active:bg-green-700 dark:active:bg-green-900 rounded-md duration-200 shadow" onClick={getCurrentLocation} disabled={state.isGettingCoordinates}>
                    <img className={`${state.isGettingCoordinates ? "animate__animated animate__flash animate__infinite" : ""}`} src={`${import.meta.env.BASE_URL}images/my-location-icon.svg`} alt="Current Location" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{state.isGettingCoordinates ? t('locating') : t('current_location')}</span>
                  </button>
                  <button className="flex items-center p-1 bg-yellow-700 hover:bg-yellow-500 hover:dark:bg-yellow-400 dark:bg-yellow-600 active:bg-yellow-700 dark:active:bg-yellow-900 rounded-md duration-200 shadow" onClick={restoreDateTime}>
                    <img src={`${import.meta.env.BASE_URL}images/restore-datetime-icon.svg`} alt="Restore Datetime" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_datetime')}</span>
                  </button>
                  <button className="flex items-center p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow" onClick={resetSettings}>
                    <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{t('reset_settings')}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Combobox as={"text"} className={"flex items-center"} value={state.selectedLocation} onChange={setSelectedLocation}>
                    <label>{t('location')}&nbsp;</label>
                    <div className="relative flex items-center bg-green-200 dark:bg-gray-200 rounded duration-200">
                      <ComboboxInput
                        className={"ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"}
                        onChange={event => onInputLocationChange(event.target.value)}
                        displayValue={location => location?.city ? `${location.city}, ${location.admin_name}, ${location.country}` : ''}
                        placeholder={state.isGeocoding ? t('geocoding') : t('search_location')}
                        aria-disabled={state.isGeocoding}
                      ></ComboboxInput>
                      {state.isSearching && (
                        <ComboboxButton className={"flex items-center justify-center h-7 w-7 p-1 bg-green-200 dark:bg-gray-200 rounded-r"}>
                          <span className="border-t-2 border-r-2 border-t-green-900 border-r-green-900 w-full h-full rounded-full animate-spin"></span>
                        </ComboboxButton>
                      )}
                      {state.inputLocation.length > 0 && !state.isSearching && (
                        <ComboboxButton className={"flex items-center justify-center bg-green-200 dark:bg-gray-200 px-2 py-1 text-base text-red-700 rounded-r"} onClick={() => onClearLocationInput()}>X</ComboboxButton>
                      )}
                      <Transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 -translate-y-1/4"
                        enterTo="opacity-100 scale-100 translate-y-full"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-full"
                        leaveTo="opacity-0 scale-95 -translate-y-1/4"
                        afterLeave={() => onInputLocationChange('')}
                      >
                        <ComboboxOptions className={"absolute mt-1 p-1 max-h-48 max-w-[50vw] bg-green-200/50 dark:bg-gray-200/50 whitespace-nowrap overflow-ellipsis backdrop-blur-sm rounded shadow dark:shadow-white/50 translate-y-full overflow-y-auto z-10 duration-200"}>
                          {state.suggestedLocations.length === 0 && state.inputLocation.length > 0 && !state.isSearching
                            ? <span className="p-1">{t('no_location_found')}</span>
                            : (
                                state.suggestedLocations.map(location => (
                                  <ComboboxOption
                                    key={location.city}
                                    value={location}
                                    className={({ active }) => `${active ? 'bg-green-500 dark:bg-gray-500 text-white' : 'text-green-900 dark:text-black'} flex flex-nowrap items-center cursor-default select-none p-1 rounded-md duration-200`}
                                  >
                                    {`${location.city}, ${location.admin_name}, ${location.country}`}
                                  </ComboboxOption>
                              )))
                          }
                        </ComboboxOptions>
                      </Transition>
                    </div>
                  </Combobox>
                  <form className="flex items-center justify-between gap-2" onSubmit={e => e.preventDefault()}>
                    <span className="flex items-center">
                      <label htmlFor="latitude">{t('latitude')}&nbsp;</label>
                      <input
                        lang={selectedLanguage}
                        type="number"
                        inputMode="decimal"
                        className="input-latitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 shadow-inner rounded duration-200"
                        onChange={onInputLatitudeChange}
                        value={state.latitude}
                        required
                      />
                    </span>
                    <span className="flex items-center">
                      <label htmlFor="longitude">{t('longitude')}&nbsp;</label>
                      <input
                        lang={selectedLanguage}
                        type="number"
                        inputMode="decimal"
                        className="input-longitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                        onChange={onInputLongitudeChange}
                        value={state.longitude}
                        required
                      />
                    </span>
                    <span className="flex items-center">
                      <label htmlFor="elevation">{t('elevation')}&nbsp;</label>
                      <input
                        lang={selectedLanguage}
                        type="number"
                        inputMode="decimal"
                        className="input-elevation w-16 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                        onChange={onInputAltitudeChange}
                        value={state.elevation}
                        required
                      />
                      <p>&nbsp;m</p>
                    </span>
                    <button type="submit" className="flex items-center px-3 py-1.5 bg-green-700 hover:bg-green-500 hover:dark:bg-green-400 dark:bg-green-600 active:bg-green-700 dark:active:bg-green-900 text-sm text-white rounded-md duration-200 shadow" onClick={applyLocationCoordinates}>{t('apply')}</button>
                  </form>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="flex items-center">
                    <label>{t('hijri_date_criteria')}&nbsp;</label>
                    <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={0} value={state.selectedCriteria} onChange={event => selectCriteria(event.target.value)} required>
                      {en.date_criteria.map((item, index) => <option key={item.criteria} value={index}>{t(`date_criteria.${index}.criteria`)}</option>)}
                    </select>
                  </span>
                  <span className="flex items-center">
                    <label className="whitespace-nowrap">{t('timezone')}&nbsp;</label>
                    <select className="bg-green-200 dark:bg-gray-200 w-64 p-1 overflow-ellipsis rounded shadow-inner duration-200" defaultValue={state.selectedTimeZone} value={state.selectedTimeZone} onChange={event => selectTimeZone(event.target.value)} required>
                      {getTimeZoneList().map(item => <option key={item.timeZone} value={item.timeZone}>{`(UTC${item.offset}) ${item.timeZone}`}</option>)}
                    </select>
                  </span>
                  {state.inputDate !== '' && state.inputTime !== ''
                    ? null
                    : (
                      <span className="flex items-center">
                        <label>{t('interval_update')}&nbsp;</label>
                        <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} value={state.selectedIntervalUpdate} onChange={event => selectIntervalUpdate(event.target.value)} required>
                          {en.intervals.map((item, index) => <option key={item} value={index}>{t(`intervals.${index}`)}</option>)}
                        </select>
                      </span>
                      )
                  }
                </div>
              </article>
              <table className="table-auto flex-none ml-1">
                <thead className="font-serif font-bold text-lg text-transparent text-left"><th colSpan={3}>{t('current_date')}</th></thead>
                <thead className="font-serif font-bold text-lg text-left"><th colSpan={3}>{t('current_date')}</th></thead>
                <tr className="font-bold">
                  <td>{t('gregorian_date')}</td>
                  <td className="pl-1 pr-2">:</td>
                  <td>{state.currentDate.gregorian}</td>
                </tr>
                <tr className="text-green-900 dark:text-black duration-200">
                  <td>{t('hijri_date')}</td>
                  <td className="pl-1 pr-2">:</td>
                  <td>{state.currentDate.islamicDayNumber} {t(`islamic_months.${state.currentDate.islamicMonth - 1}`)} {parseInt(state.currentDate.islamicYear)} {t('hijri_abbreviation')}</td>
                </tr>
                <tr className="border-t border-t-black font-serif font-bold text-lg">
                  <td colSpan={3}>{t('current_time')}&nbsp;<span className="font-sans">{state.currentDate.time}</span></td>
                </tr>
              </table>
            </Transition>
            <nav className="absolute flex items-center top-0 right-0 cursor-pointer px-2 py-1 bg-green-500/75 dark:bg-gray-500/75 hover:bg-green-500/25 hover:dark:bg-gray-500/25 text-base text-white backdrop-blur-sm shadow-inner rounded-bl-lg duration-200" onClick={toggleToolbar}>
              <img className={`${state.isToolbarShown ? "scale-y-[-1]" : ""}  object-contain object-center duration-300`} src={`${import.meta.env.BASE_URL}images/expand-icon.svg`} alt="Show/Hide Toolbar" />
              <span>{state.isToolbarShown ? t('hide_toolbar') : t('show_toolbar')}</span>
            </nav>
          </section>
        )
      } else {
        return (
          <section className="form-container sticky top-0 shadow-md z-10">
            <Transition
              appear
              show={state.isToolbarShown}
              as={"div"}
              className={" border-b border-b-green-900 dark:border-b-white w-full p-1 bg-green-500/50 dark:bg-white/50 backdrop-blur-sm"}
              enter="ease-out duration-300"
              enterFrom="opacity-0 -translate-y-1/2"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1/2"
            >
              <table className="p-1 whitespace-nowrap">
                <thead className="font-serif font-bold text-sm text-left"><th colSpan={3}>{t('current_date')}</th></thead>
                <tr className="font-bold text-xs">
                  <td>{t('gregorian_date')}</td>
                  <td className="pl-0.5 pr-1">:</td>
                  <td className="w-full">{state.currentDate.gregorian}</td>
                </tr>
                <tr className="text-green-900 dark:text-black text-xs duration-200">
                  <td>{t('hijri_date')}</td>
                  <td className="pl-0.5 pr-1">:</td>
                  <td className="w-full">{state.currentDate.islamicDayNumber} {t(`islamic_months.${state.currentDate.islamicMonth - 1}`)} {parseInt(state.currentDate.islamicYear)} {t('hijri_abbreviation')}</td>
                </tr>
                <tr className="font-serif font-bold text-sm">
                  <td colSpan={3}>{t("current_time")}&nbsp;<span className="font-sans text-xs">{state.currentDate.time}</span></td>
                </tr>
              </table>
              <article className="grid grid-flow-row items-center gap-2 border-t border-t-green-900 dark:border-t-white duration-200">
                <h5 className="font-serif text-sm whitespace-nowrap">{t('app_config')}</h5>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button className="flex items-center p-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-400 dark:bg-green-600 active:bg-green-700 dark:active:bg-green-900 rounded-md duration-200 shadow" onClick={getCurrentLocation} disabled={state.isGettingCoordinates}>
                    <img className={`${state.isGettingCoordinates ? "animate__animated animate__flash animate__infinite" : ""}`} src={`${import.meta.env.BASE_URL}images/my-location-icon.svg`} alt="Current Location" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{state.isGettingCoordinates ? t('locating') : t('current_location')}</span>
                  </button>
                  <button className="flex items-center p-1 bg-yellow-700 hover:bg-yellow-500 hover:dark:bg-yellow-400 dark:bg-yellow-600 active:bg-yellow-700 dark:active:bg-yellow-900 rounded-md duration-200 shadow" onClick={restoreDateTime}>
                    <img src={`${import.meta.env.BASE_URL}images/restore-datetime-icon.svg`} alt="Restore Datetime" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_datetime')}</span>
                  </button>
                  <button className="flex items-center p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow" onClick={resetSettings}>
                    <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
                    <span className="ml-1 text-white text-sm whitespace-nowrap">{t('reset_settings')}</span>
                  </button>
                  <span className="flex items-center text-sm">
                    <label htmlFor="date">{t('local_date')}</label>
                    <input
                      type="date"
                      lang={selectedLanguage}
                      value={state.inputDate}
                      className="input-date ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      onChange={setDesiredDate}
                      required
                    />
                  </span>
                  <span className="flex items-center text-sm">
                    <label htmlFor="time">{t('local_time')}</label>
                    <input
                      type="time"
                      lang={selectedLanguage}
                      value={state.inputTime}
                      className="input-time ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      onChange={setDesiredTime}
                      required
                    />
                  </span>
                </div>
                <form className="flex flex-wrap items-center justify-center gap-2" onSubmit={e => e.preventDefault()}>
                  <Combobox as={"text"} className={"flex items-center gap-1 text-sm"} value={state.selectedLocation} onChange={setSelectedLocation}>
                    <label>{t('location')}&nbsp;</label>
                    <div className="relative flex items-center bg-green-200 dark:bg-gray-200 rounded duration-200">
                      <ComboboxInput
                        className={"ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded duration-200"}
                        onChange={event => onInputLocationChange(event.target.value)}
                        displayValue={location => location?.city ? `${location.city}, ${location.admin_name}, ${location.country}` : ''}
                        placeholder={state.isGeocoding ? t('geocoding') : t('search_location')}
                        aria-disabled={state.isGeocoding}
                      ></ComboboxInput>
                      {state.isSearching && (
                        <ComboboxButton className={"flex items-center justify-center h-7 w-7 p-1 bg-green-200 dark:bg-gray-200 rounded-r"}>
                          <span className="border-t-2 border-r-2 border-t-green-900 border-r-green-900 w-full h-full rounded-full animate-spin"></span>
                        </ComboboxButton>
                      )}
                      {state.inputLocation.length > 0 && !state.isSearching && (
                        <ComboboxButton className={"flex items-center justify-center bg-green-200 dark:bg-gray-200 px-2 py-1 text-base text-red-700 rounded-r"} onClick={() => onClearLocationInput()}>X</ComboboxButton>
                      )}
                      <Transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 -translate-y-1/4"
                        enterTo="opacity-100 scale-100 translate-y-full"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-full"
                        leaveTo="opacity-0 scale-95 -translate-y-1/4"
                        afterLeave={() => onInputLocationChange('')}
                      >
                        <ComboboxOptions className={"absolute mt-1 p-1 max-h-48 max-w-[50vw] bg-green-200/50 dark:bg-gray-200/50 whitespace-nowrap overflow-ellipsis backdrop-blur-sm rounded shadow dark:shadow-white/50 translate-y-full overflow-y-auto z-10 duration-200"}>
                          {state.suggestedLocations.length === 0 && state.inputLocation.length > 0 && !state.isSearching
                            ? <span className="p-1">{t('no_location_found')}</span>
                            : (
                                state.suggestedLocations.map(location => (
                                  <ComboboxOption
                                    key={location.city}
                                    value={location}
                                    className={({ active }) => `${active ? 'bg-green-500 dark:bg-gray-500 text-white' : 'text-green-900 dark:text-black'} flex flex-nowrap items-center cursor-default select-none p-1 rounded-md duration-200`}
                                  >
                                    {`${location.city}, ${location.admin_name}, ${location.country}`}
                                  </ComboboxOption>
                              )))
                          }
                        </ComboboxOptions>
                      </Transition>
                    </div>
                  </Combobox>
                  <span className="flex items-center text-sm">
                    <label htmlFor="latitude">{t('latitude')}&nbsp;</label>
                    <input
                      lang={selectedLanguage}
                      type="number"
                      inputMode="decimal"
                      className="input-latitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      value={state.latitude}
                      onChange={onInputLatitudeChange}
                      required
                    />
                  </span>
                  <span className="flex items-center text-sm">
                    <label htmlFor="longitude">{t('longitude')}&nbsp;</label>
                    <input
                      lang={selectedLanguage}
                      type="number"
                      inputMode="decimal"
                      className="input-longitude w-24 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      value={state.longitude}
                      onChange={onInputLongitudeChange}
                      required
                    />
                  </span>
                  <span className="flex items-center text-sm">
                    <label htmlFor="elevation">{t('elevation')}&nbsp;</label>
                    <input
                      lang={selectedLanguage}
                      type="number"
                      inputMode="decimal"
                      className="input-elevation w-16 ml-1 p-0.5 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                      value={state.elevation}
                      onChange={onInputAltitudeChange}
                      required
                    />
                    <p>&nbsp;m</p>
                  </span>
                  <button type="submit" className="flex items-center px-2 py-1 bg-green-700 hover:bg-green-500 hover:dark:bg-green-400 dark:bg-green-600 active:bg-green-700 dark:active:bg-green-900 text-sm text-white rounded-md duration-200 shadow" onClick={applyLocationCoordinates}>{t('apply')}</button>
                </form>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                  <span className="flex items-center">
                    <label>{t('hijri_date_criteria')}&nbsp;</label>
                    <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={0} value={state.selectedCriteria} onChange={event => selectCriteria(event.target.value)} required>
                      {en.date_criteria.map((item, index) => <option key={item.criteria} value={index}>{t(`date_criteria.${index}.criteria`)}</option>)}
                    </select>
                  </span>
                  <span className="flex items-center">
                    <label className="whitespace-nowrap">{t('timezone')}&nbsp;</label>
                    <select className="bg-green-200 dark:bg-gray-200 w-48 p-1 overflow-ellipsis rounded shadow-inner duration-200" defaultValue={state.selectedTimeZone} value={state.selectedTimeZone} onChange={event => selectTimeZone(event.target.value)} required>
                      {getTimeZoneList().map(item => <option key={item.timeZone} value={item.timeZone}>{`(UTC${item.offset}) ${item.timeZone}`}</option>)}
                    </select>
                  </span>
                  {state.inputDate !== '' && state.inputTime !== ''
                    ? null
                    : (
                      <span className="flex items-center">
                        <label>{t('interval_update')}&nbsp;</label>
                        <select className="bg-green-200 dark:bg-gray-200 p-1 rounded shadow-inner duration-200" defaultValue={1} value={state.selectedIntervalUpdate} onChange={event => selectIntervalUpdate(event.target.value)} required>
                          {en.intervals.map((item, index) => <option key={item} value={index}>{t(`intervals.${index}`)}</option>)}
                        </select>
                      </span>
                      )
                  }
                </div>
              </article>
            </Transition>
            <nav className="absolute flex items-center top-0 right-0 cursor-pointer px-1 py-0.5 bg-green-500/75 dark:bg-gray-500/75 hover:bg-green-500/25 hover:dark:bg-gray-500/25 text-sm text-white backdrop-blur-sm shadow-inner rounded-bl-lg duration-200" onClick={toggleToolbar}>
              <img className={`${state.isToolbarShown ? "scale-y-[-1]" : ""}  object-contain object-center duration-300`} src={`${import.meta.env.BASE_URL}images/expand-icon.svg`} alt="Show/Hide Toolbar" />
              <span>{state.isToolbarShown ? t('hide_toolbar') : t('show_toolbar')}</span>
            </nav>
          </section>
        )
      }
    }}
  </HomePageConsumer>
)

export default InputForm