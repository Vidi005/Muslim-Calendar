import React from "react"
import InputForm from "../InputForm"
import MoonCrescentMapSettings from "./MoonCrescentMapSettings"
import MoonCrescentVisibilityMap from "./MoonCrescentVisibilityMap"

const MoonCrescentMapContent = ({ t, state, moonInfos, selectedLanguage, selectHijriMonth, selectedMoonVisibilityCriteria, restoreToDefault }) => (
  <article className="prayer-times-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <MoonCrescentMapSettings
      selectHijriMonth={selectHijriMonth}
      selectedHijriMonth={state.selectedHijriMonth}
      areMoonVisibilityCriteriaMapsLoading={state.areMoonVisibilityCriteriaMapsLoading}
      restoreToDefault={restoreToDefault}
    />
    <h2 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_crescent_map')}</h2>
    <h5 className="m-1 md:m-2 text-center text-green-700 dark:text-gray-200 duration-200">{t('conjunction')} {moonInfos[14]}</h5>
    <div className="grid grid-flow-row items-stretch gap-1 sm:gap-2 md:gap-3">
      {state.areMoonVisibilityCriteriaMapsLoading
        ? (
            <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
              <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
              <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('moon_crescent_map_loading')}</span>
            </div>
          )
        : (
          <>
            {state.moonCrescentVisibilities.map((visibility, index) => (
              <MoonCrescentVisibilityMap
                key={index}
                index={index}
                t={t}
                selectedLanguage={selectedLanguage}
                selectedMoonVisibilityCriteria={selectedMoonVisibilityCriteria}
                ijtimaDate={state.ijtimaDates[index]}
                visibility={visibility}
              />
            ))}
          </>
          )
      }
    </div>
  </article>
)

export default MoonCrescentMapContent