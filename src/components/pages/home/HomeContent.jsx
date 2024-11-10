import React from "react"
import InputForm from "../InputForm"
import CalendarSection from "./CalendarSection"
import PrayerTimesSection from "./PrayerTimesSection"

const HomeContent = ({ sliderRef, calendarContainerRef, tooltipRef, showTooltip, hideTooltip, goToCurrentMonth, jumpToClickedMonth }) => (
  <article className="home-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <CalendarSection
      sliderRef={sliderRef}
      calendarContainerRef={calendarContainerRef}
      tooltipRef={tooltipRef}
      showTooltip={showTooltip}
      hideTooltip={hideTooltip}
      goToCurrentMonth={goToCurrentMonth}
      jumpToClickedMonth={jumpToClickedMonth}
    />
    <div className="flex flex-wrap md:flex-nowrap max-w-full">
      <PrayerTimesSection />
    </div>
  </article>
)

export default HomeContent