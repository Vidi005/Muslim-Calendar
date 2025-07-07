import React from "react"
import InputForm from "../InputForm"
import MoonCrescentMapSettings from "./MoonCrescentMapSettings"
import MoonCrescentVisibilityMap from "./MoonCrescentVisibilityMap"
import FooterContainer from "../Footer"

const MoonCrescentMapContent = ({ t, state, selectedLanguage, selectedTimeZone, selectHijriMonth, selectedMoonVisibilityCriteria, isTooltipShown, selectedObservationTime, restoreToDefault }) => (
  <article className="prayer-times-content flex flex-col grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <MoonCrescentMapSettings
      selectHijriMonth={selectHijriMonth}
      selectedHijriMonth={state.selectedHijriMonth}
      areMoonVisibilityCriteriaMapsLoading={state.areMoonVisibilityCriteriaMapsLoading}
      restoreToDefault={restoreToDefault}
    />
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_crescent_map')}</h2>
    <div className="grid grid-flow-row items-stretch mb-4 grow xl:flex-none">
      {state.areMoonVisibilityCriteriaMapsLoading
        ? (
            <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
              <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
              <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('moon_crescent_maps_loading')}</span>
            </div>
          )
        : (
          <>
            <h4 className="m-1 text-sm sm:text-base md:text-lg text-center text-green-700 dark:text-gray-200 duration-200"><i>{t('conjunction')}</i>: {state.moonCrescentVisibilities.at(0)?.conjunction?.toLocaleString(selectedLanguage || "en", { calendar: "gregory", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short", timeZone: selectedTimeZone }).replace(/Minggu/g, 'Ahad').replace(/Jumat/g, 'Jum\'at').replace(/\./g, ':')} ({state.moonCrescentVisibilities.at(0)?.conjunction?.toLocaleString(selectedLanguage || "en", { calendar: "gregory", weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short", timeZone: 'UTC' }).replace(/\./g, ':')})</h4>
            {state.moonCrescentVisibilities?.map((visibility, index) => (
              <MoonCrescentVisibilityMap
                key={index}
                t={t}
                selectedLanguage={selectedLanguage}
                selectedTimeZone={selectedTimeZone}
                selectedMoonVisibilityCriteria={selectedMoonVisibilityCriteria}
                isTooltipShown={isTooltipShown}
                observationDate={state.observationDates[index]}
                selectedObservationTime={selectedObservationTime}
                visibility={visibility.zoneCoordinates}
              />
            ))}
          </>
          )
      }
    </div>
    {innerWidth < 1280 && <FooterContainer/>}
  </article>
)

export default MoonCrescentMapContent