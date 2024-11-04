import React from "react"
import InputForm from "../InputForm"
import CalendarSection from "./CalendarSection"

const HomeContent = ({ sliderRef, goToCurrentMonth, jumpToClickedMonth }) => (
  <article className="home-content grow bg-green-100 dark:bg-gray-700 overflow-y-auto duration-200">
    <InputForm />
    <CalendarSection
      sliderRef={sliderRef}
      goToCurrentMonth={goToCurrentMonth}
      jumpToClickedMonth={jumpToClickedMonth}
    />
  </article>
)

export default HomeContent