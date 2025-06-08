import React from "react"
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext"
import { Checkbox, Field, Label } from "@headlessui/react"

const MoonCrescentMapSettings = ({ selectedHijriMonth, selectHijriMonth, areMoonVisibilityCriteriaMapsLoading, restoreToDefault }) => (
  <HomePageConsumer>
    {({ t, state, selectMoonVisibilityCriteria, selectElongationType, selectAltitudeType, selectObservationTime, onChangeRefractionState, selectCoordinateSteps }) => (
      <section className="grid grid-flow-row gap-2 border-b border-b-green-900 dark:border-b-white bg-green-500/50 dark:bg-white/50 w-full p-1 lg:p-2 text-sm lg:text-base duration-200">
        <h4 className="text-sm lg:text-lg whitespace-nowrap">{t('moon_crescent_map_config')}</h4>
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
          <span className="flex items-center justify-center">
            <label htmlFor="islamic_month">{t('islamic_month')}</label>
            <select
              className={`ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
              defaultValue={selectedHijriMonth}
              value={selectedHijriMonth}
              onChange={event => selectHijriMonth(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {state.hijriStartDates?.map((item, monthIndex) => {
                if (item.gregorianDate.getFullYear() >= state.formattedDateTime.getFullYear()) {
                  return <option key={monthIndex} value={monthIndex}>{t(`islamic_months.${item.hijriDate.month - 1}`)} {parseInt(item.hijriDate.year)} {t('hijri_abbreviation')}</option>
                } else {
                  return null
                }
              })}
            </select>
          </span>
          <span className="flex items-center">
            <label htmlFor="moon-crescent-criteria">{t('hijri_date_criteria')}</label>
            <select
              className={`ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
              defaultValue={1}
              value={state.selectedMoonVisibilityCriteria}
              onChange={event => selectMoonVisibilityCriteria(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {en.moon_visibility_criteria.map((obj, index) => <option key={obj.name} value={index}>{t(`moon_visibility_criteria.${index}.name`)}</option>)}
            </select>
          </span>
          {
            (state.selectedMoonVisibilityCriteria === 0 || state.selectedMoonVisibilityCriteria === 5 || state.selectedMoonVisibilityCriteria === 7 || state.selectedMoonVisibilityCriteria === 8 || state.selectedMoonVisibilityCriteria === 9)
              ? (
                  <>
                    <span className="flex items-center">
                      <label htmlFor="elongation-type">{t('moon_infos.11').split(' ')[0]}:</label>
                      <select
                        className={`ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
                        defaultValue={0}
                        value={state.selectedElongationType}
                        onChange={event => selectElongationType(event.target.value)}
                        required
                        disabled={areMoonVisibilityCriteriaMapsLoading}
                      >
                        {en.elongation_type.map((type, index) => <option key={type} value={index}>{t(`elongation_type.${index}`)}</option>)}
                      </select>
                    </span>
                    <span className="flex items-center">
                      <label htmlFor="altitude-type" hidden={state.selectedMoonVisibilityCriteria === 0}>{t('moon_infos.5').split(' ')[0]}:</label>
                      <select
                        className={`ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
                        defaultValue={1}
                        value={state.selectedAltitudeType}
                        onChange={event => selectAltitudeType(event.target.value)}
                        required
                        disabled={areMoonVisibilityCriteriaMapsLoading}
                        hidden={state.selectedMoonVisibilityCriteria === 0}
                      >
                        {en.altitude_type.map((type, index) => <option key={type} value={index}>{t(`altitude_type.${index}`)}</option>)}
                      </select>
                    </span>
                  </>
                )
              : (
                  <>
                    <span className="flex items-center">
                      <label htmlFor="elongation-type">{t('moon_infos.11').split(' ')[0]}:</label>
                      <select
                        className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 cursor-not-allowed"
                        defaultValue={state.selectedMoonVisibilityCriteria === 1 || state.selectedMoonVisibilityCriteria === 6 ? 0 : 1}
                        value={state.selectedMoonVisibilityCriteria === 1 || state.selectedMoonVisibilityCriteria === 6 ? 0 : 1}
                        disabled
                      >
                        {en.elongation_type.map((type, index) => <option key={type} value={index}>{t(`elongation_type.${index}`)}</option>)}
                      </select>
                    </span>
                    <span className="flex items-center">
                      <label htmlFor="altitude-type">{t('moon_infos.5').split(' ')[0]}:</label>
                      <select
                        className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 cursor-not-allowed"
                        defaultValue={state.selectedMoonVisibilityCriteria === 1 || state.selectedMoonVisibilityCriteria === 6 ? 0 : 1}
                        value={state.selectedMoonVisibilityCriteria === 1 || state.selectedMoonVisibilityCriteria === 6 ? 0 : 1}
                        disabled
                      >
                        {en.altitude_type.map((type, index) => <option key={type} value={index}>{t(`altitude_type.${index}`)}</option>)}
                      </select>
                    </span>
                  </>
                )
          }
          {
            (state.selectedMoonVisibilityCriteria === 2 || state.selectedMoonVisibilityCriteria === 5 || state.selectedMoonVisibilityCriteria === 7 || state.selectedMoonVisibilityCriteria === 8 || state.selectedMoonVisibilityCriteria === 9)
              ? (
                  <span className="flex items-center">
                    <label htmlFor="observation-time">{t('observation_time')}:</label>
                    <select
                      className="ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 cursor-not-allowed"
                      defaultValue={0}
                      value={0}
                      required
                      disabled
                    >
                      {en.observation_times.map((type, index) => <option key={type} value={index}>{t(`observation_times.${0}`)}</option>)}
                    </select>
                  </span>
                )
              : (
                  <span className="flex items-center">
                    <label htmlFor="observation-time">{t('observation_time')}:</label>
                    <select
                      className={`ml-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
                      defaultValue={0}
                      value={state.selectedObservationTime}
                      onChange={event => selectObservationTime(event.target.value)}
                      required
                      disabled={areMoonVisibilityCriteriaMapsLoading}
                    >
                      {en.observation_times.map((type, index) => <option key={type} value={index}>{t(`observation_times.${index}`)}</option>)}
                    </select>
                  </span>
                )
          }
          <Field className={`flex items-center ${state.selectedMoonVisibilityCriteria === 0 ? "hidden" : ""}`}>
            <Checkbox checked={state.isUseNormalRefraction} onChange={onChangeRefractionState} disabled={areMoonVisibilityCriteriaMapsLoading} className={`group block border bg-green-200 dark:bg-gray-200 data-[checked]:bg-green-700 dark:data-[checked]:bg-green-500 w-5 h-5 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
              <svg className="stroke-white" viewBox="0 0 14 14" fill="none">
                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Checkbox>
            <Label className={`p-1 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : "cursor-pointer"}`} aria-disabled={areMoonVisibilityCriteriaMapsLoading}>{t('refraction')}</Label>
          </Field>
          <span className="flex items-center">
            <label htmlFor="coordinate-steps">{t('sampling')}</label>
            <select
              className={`mx-1 p-1 bg-green-200 dark:bg-gray-200 rounded shadow-inner duration-200 ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`}
              defaultValue={3}
              value={state.selectedCoordinateSteps}
              onChange={event => selectCoordinateSteps(event.target.value)}
              required
              disabled={areMoonVisibilityCriteriaMapsLoading}
            >
              {en.coordinate_steps.map((type, index) => <option key={type} value={index + 1}>{t(`coordinate_steps.${index}`)}</option>)}
            </select>
            <label htmlFor="coordinate-steps">{t('degrees')}</label>
          </span>
          <button className={`flex items-center ml-auto md:m-0 p-1 bg-red-700 hover:bg-red-500 hover:dark:bg-red-300 dark:bg-red-500 active:bg-red-700 dark:active:bg-red-900 rounded-md duration-200 shadow ${areMoonVisibilityCriteriaMapsLoading ? "cursor-not-allowed" : ""}`} onClick={() => {
            onChangeRefractionState(true)
            selectElongationType(0)
            selectAltitudeType(1)
            selectObservationTime(0)
            selectCoordinateSteps(3)
            selectMoonVisibilityCriteria(3)
            restoreToDefault()
          }} disabled={areMoonVisibilityCriteriaMapsLoading}>
            <img src={`${import.meta.env.BASE_URL}images/reset-settings-icon.svg`} alt="Restore to Default" />
            <span className="ml-1 text-white text-sm whitespace-nowrap">{t('restore_to_default')}</span>
          </button>
        </div>
      </section>
    )}
  </HomePageConsumer>
)

export default MoonCrescentMapSettings