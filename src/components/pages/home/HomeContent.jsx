import React from "react"
import InputForm from "../InputForm"
import CalendarSection from "./CalendarSection"

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
  </article>
)

export default HomeContent