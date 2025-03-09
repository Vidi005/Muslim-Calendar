import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { prayerTimesCorrection } from "../../../utils/data"
import { Checkbox, Field, Label } from "@headlessui/react"

const PrayerTimesSettings = ({ selectCalculationMethod, selectConvention, onInputCustomFajrAngleChange, onInputCustomIshaAngleChange, selectAshrTime, selectIhtiyath, onChangePrecision, selectCorrections, selectDhuhaMethod, onInputSunAltitudeChange, onInputMinutesChange, selectFormula, resetSettings }) => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200 animate__animated animate__fadeInUp">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('prayer_times_config')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center">
            <label htmlFor="calculation">{t('calculation')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedCalculationMethod}
              onChange={event => selectCalculationMethod(event.target.value)}
              required
            >
              {en.calculations.map((method, index) => <option key={method} value={index}>{t(`calculations.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="ashr-time">{t('ashr_time')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedAshrTime}
              onChange={event => selectAshrTime(event.target.value)}
              required
            >
              {en.mahzab.map((type, index) => <option key={type} value={index}>{t(`mahzab.${index}`)}</option>)}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="convention">{t('convention')}</label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={0}
              value={state.selectedConvention}
              onChange={event => selectConvention(event.target.value)}
              required
            >
              {en.conventions.map((type, index) => <option key={type.method} value={index}>{t(`conventions.${index}.method`)}</option>)}
            </select>
          </span>
          {state.selectedConvention === en.conventions.length - 1 && (
            <React.Fragment>
              <span className="flex items-center">
                <label className="whitespace-nowrap" htmlFor="fajr-angle">{t('fajr_angle')}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className="w-10 md:w-12 mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                  defaultValue={16}
                  value={state.inputCustomFajrAngle}
                  min={9}
                  max={23.5}
                  onChange={event => onInputCustomFajrAngleChange(event.target.value)}
                  required
                />
                <span>{t('degrees')}</span>
              </span>
              <span className="flex items-center">
                <label className="whitespace-nowrap" htmlFor="isha-angle">{t('isha_angle')}</label>
                <input
                  lang={state.selectedLanguage}
                  type="number"
                  inputMode="decimal"
                  className="w-10 md:w-12 mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                  defaultValue={14}
                  value={state.inputCustomIshaAngle}
                  min={9}
                  max={23.5}
                  onChange={event => onInputCustomIshaAngleChange(event.target.value)}
                  required
                />
                <span>{t('degrees')}</span>
              </span>
            </React.Fragment>
          )}
          <span className="flex items-center">
            <label htmlFor="ihtiyath"><i>{t('ihtiyath')}</i></label>
            <select
              className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
              defaultValue={2}
              value={state.selectedIhtiyath}
              onChange={event => selectIhtiyath(event.target.value)}
              required
            >
              {en.ihtiyath_times.map((type, index) => <option key={type} value={index + 1}>{t(`ihtiyath_times.${index}`)}</option>)}
            </select>
          </span>
          <Field className={"flex items-center m-1 cursor-pointer"}>
            <Checkbox checked={state.isPreciseToSeconds} onChange={onChangePrecision} className={"group block border bg-green-200 dark:bg-gray-200 data-[checked]:bg-green-700 dark:data-[checked]:bg-green-500 w-5 h-5 rounded shadow-inner duration-200"}>
              <svg className="stroke-white" viewBox="0 0 14 14" fill="none">
                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Checkbox>
            <Label className={"p-1 cursor-pointer"}>{t('precise_to_seconds')}</Label>
          </Field>
          {Math.abs(state.latitude) > 48 && (
            <span className="flex items-center">
              <label htmlFor="calculation_method">{t('calculation_method')}</label>
              <select
                className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                defaultValue={1}
                value={state.selectedFormula}
                onChange={event => selectFormula(event.target.value)} required>
                {en.formulas.map((type, index) => <option key={type} value={index}>{t(`formulas.${index}`)}</option>)}
              </select>
            </span>
          )}
          <button className="flex items-center ml-auto p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow" onClick={resetSettings}>
            <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Reset Settings" />
            <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_to_default')}</span>
          </button>
        </div>
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('time_correction')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          {en.prayer_names.map((name, index) => (
            (index !== 0 && index !== 2 && index !== 3) && (
              <span key={name} className="flex items-center">
                <label htmlFor="prayer-name">{t(`prayer_names.${index}`) + ' :'}</label>
                <select
                  className="mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
                  defaultValue={0}
                  value={state.selectedCorrections[index]}
                  onChange={event => selectCorrections(index, event.target.value)}
                  required
                >
                  {prayerTimesCorrection().map(correction => <option key={correction} value={correction}>{correction}</option>)}
                </select>
                <span>{t('minutes')}</span>
              </span>
            )
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
          <label htmlFor="dhuha_method">{t('dhuha_method')}</label>
          <select
            className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
            defaultValue={0}
            value={state.selectedDhuhaMethod}
            onChange={event => selectDhuhaMethod(Math.abs(state.latitude) > 60 ? 1 : event.target.value)}
            required
          >
            {en.dhuha_methods.map((type, index) => <option key={type} value={index}>{t(`dhuha_methods.${index}`)}</option>)}
          </select>
          <input
            lang={state.selectedLanguage}
            type="number"
            inputMode={state.selectDhuhaMethod === 0 ? 'decimal' : 'numeric'}
            className="w-10 md:w-12 ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200"
            defaultValue={state.selectedDhuhaMethod === 0 && Math.abs(state.latitude) <= 60 ? 4.5 : 18}
            value={state.selectedDhuhaMethod === 0 && Math.abs(state.latitude) <= 60 ? state.inputSunAltitude : state.inputMinutes}
            min={state.selectedDhuhaMethod === 0 ? 4 : 10}
            max={state.selectedDhuhaMethod === 0 ? 8 : 40}
            onChange={event => state.selectedDhuhaMethod === 0 && Math.abs(state.latitude) <= 60 ? onInputSunAltitudeChange(event.target.value) : onInputMinutesChange(event.target.value)}
            required
          />
          <span>{state.selectedDhuhaMethod === 0 ? t('degrees') : t('minutes')}</span>
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default PrayerTimesSettings