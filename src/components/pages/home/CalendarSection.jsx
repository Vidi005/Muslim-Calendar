import React from "react"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext";

const CalendarSection = ({ sliderRef, goToCurrentMonth }) => (
  <HomePageConsumer>
    {({ t, state }) => {
      const isWaxing = parseFloat(state.moonInfos[0]) < (parseFloat(state.moonInfos[state.moonInfos.length - 1]))
      const isQuarter = parseFloat(state.moonInfos[1]) <= 50
      const ellipse1 = isQuarter
        ? `ellipse(${50 - parseFloat(state.moonInfos[1])}% 50% at 0% 50%)`
        : `ellipse(0% 50% at 0% 50%)`
      const ellipse2 = !isQuarter
        ? `ellipse(${parseFloat(state.moonInfos[1]) - 50}% 50% at 100% 50%)`
        : `ellipse(0% 50% at 100% 50%)`
      return (
        <section className="calendar-section flex flex-wrap md:flex-nowrap max-w-full">
          <div className="w-full md:w-2/3 lg:w-3/4 px-7">
            <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('calendar')}</h1>
            <button className="flex items-center mx-auto my-2 px-3 py-1 text-lg text-white bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-lg duration-200 shadow-lg dark:shadow-white/50" onClick={goToCurrentMonth}>{t('current_month')}</button>
            <Slider arrows dots infinite={false} speed={500} slidesToShow={1} slidesToScroll={1} ref={sliderRef} initialSlide={state.formattedDateTime.getMonth()}>
              {state.monthsInSetYear.map((days, monthIndex) => {
                const hijriMonth1 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, 0).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'numeric' }))
                const hijriMonth2 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, new Date(state.formattedDateTime.getFullYear(), monthIndex, 0).getDate()).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'numeric' }))
                const hijriDate1 = new Date(state.formattedDateTime.getFullYear(), monthIndex, 0).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'long', year: 'numeric' })
                const hijriDate2 = new Date(state.formattedDateTime.getFullYear(), monthIndex, new Date(state.formattedDateTime.getFullYear(), monthIndex, 0).getDate()).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'long', year: 'numeric' })
                return (
                  <React.Fragment key={monthIndex}>
                    <h2 className="m-2 text-center text-green-700 dark:text-white duration-200">{new Date(state.formattedDateTime.getFullYear(), monthIndex).toLocaleString(state.selectedLanguage, { month: 'long', year: 'numeric' })}</h2>
                    <h3 className={`text-base sm:text-lg text-center text-green-500 dark:text-gray-200 duration-200`}>
                      <span className={`${hijriMonth1 === 9 ? "text-yellow-500 dark:text-yellow-300" : ""}`}>{hijriDate1}</span> - <span className={`${hijriMonth2 === 9 ? "text-yellow-500 dark:text-yellow-300" : ""}`}>{hijriDate2}</span>
                    </h3>
                    <table className="table-fixed w-full text-green-900 dark:text-gray-200 text-sm md:text-base lg:text-lg duration-200">
                      <thead>
                        <tr>
                          {en.day_names.map((_day, index) => {
                            if (innerWidth > 1024) {
                              return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`)}</th>;
                            } else {
                              return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`).slice(0, 3)}</th>;
                            }
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                          <tr key={weekIndex}>
                            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                              if (isNaN(day?.gregorian)) {
                                return (
                                  <td key={dayIndex} className="border-none border-transparent border-spacing-0 text-center">
                                    {day ? (
                                      <React.Fragment>
                                        <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.gregorian}</span>
                                        <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.hijri}</span>
                                      </React.Fragment>
                                    ) : null}
                                  </td>
                                );
                              } else {
                                const isCurrentDate = state.formattedDateTime.getDate() === day.gregorian && state.formattedDateTime.getMonth() === monthIndex;
                                const isMuslimEvent = state.hijriEventDates.some(event => event.gregorianDate.getDate() === day.gregorian && event.gregorianDate.getMonth() === monthIndex);
                                if (isMuslimEvent) {
                                  return (
                                    <td key={dayIndex} className={`${isCurrentDate ? "border-4 border-double border-sky-900 dark:border-white" : "border border-green-700 dark:border-gray-200"} bg-sky-500/20 dark:bg-sky-500 p-2 text-center cursor-pointer rounded`}>
                                      {day ? (
                                        <React.Fragment>
                                          <span className="block text-sky-700 dark:text-white font-bold text-lg md:text-xl lg:text-2xl">{day.gregorian}</span>
                                          <span className="block text-sky-500 dark:text-gray-200 text-sm md:text-base lg:text-lg">{day.hijri}</span>
                                        </React.Fragment>
                                      ) : null}
                                    </td>
                                  )
                                } else {
                                  return (
                                    <td key={dayIndex} className={`${dayIndex === 0 ? "bg-red-500/20 dark:bg-red-500" : ""} ${dayIndex === 5 ? "bg-green-500/20 dark:bg-green-500" : ""} ${isCurrentDate ? "border-4 border-double border-green-900 dark:border-white" : "border border-green-700 dark:border-gray-200"} p-2 text-center`}>
                                      {day ? (
                                        <React.Fragment>
                                          <span className={`${dayIndex === 0 ? "text-red-700" : "text-green-900"} ${dayIndex === 5 ? "text-green-400" : "text-green-700"} block dark:text-white font-bold text-lg md:text-xl lg:text-2xl`}>{day.gregorian}</span>
                                          <span className={`${dayIndex === 0 ? "text-red-500" : "text-green-700"} ${dayIndex === 5 ? "text-green-700/50" : "text-green-500"} block dark:text-gray-200 text-sm md:text-base lg:text-lg`}>{day.hijri}</span>
                                        </React.Fragment>
                                      ) : null}
                                    </td>
                                  );
                                }
                              }
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </React.Fragment>
                );
              })}
            </Slider>
            {/* <div className="hijri-events-list mt-4">
              <h3 className="font-bold text-lg mb-2">Hijri Events</h3>
              <ul className="list-disc pl-5">
                {state.hijriEventDates.map(event => (
                  <li key={event.eventId}>
                    <span className="event-name font-semibold">{event.eventId}</span>, 
                    Hijri Date: {event.hijriDate.day} {t(`islamic_months.${event.hijriDate.month - 1}`)} {event.hijriDate.year}, 
                    Gregorian Date: {event.gregorianDate.toLocaleDateString(state.selectedLanguage, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
          <div className="flex flex-col items-center w-full md:w-1/3 lg:w-1/4 text-green-700 dark:text-gray-200 duration-200">
            <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_info')}</h1>
            <div className="moon-phase w-full p-4 overflow-hidden">
              <div className="moon-phase relative w-full rounded-full overflow-hidden drop-shadow duration-500" style={{ transform: `rotate(${360 - parseFloat(state.moonInfos[8])}deg)` }}>
                <img className="w-full object-contain object-center brightness-125" src={`${import.meta.env.BASE_URL}images/moon.png`} alt="Moon Phase" />
                <div className={`${isWaxing ? "rotate-0" : "rotate-180"} absolute inset-0 duration-500`}>
                  <span className="absolute top-0 left-0 w-1/2 h-full border-none border-transparent border-spacing-0 bg-black/75 drop-shadow"></span>
                  <span
                    className="absolute inset-0 translate-x-1/2 bg-black/75 border-none border-transparent border-spacing-0"
                    style={{ clipPath: ellipse1 }}
                  ></span>
                  <span
                    className="absolute inset-0 -translate-x-1/2 border-none border-transparent border-spacing-0"
                    style={{ clipPath: ellipse2 }}
                  >
                    <img
                      className={`${isWaxing ? "rotate-0" : "rotate-180"} border-none border-transparent border-spacing-0 w-full translate-x-1/2 object-contain object-center brightness-125`}
                      src={`${import.meta.env.BASE_URL}images/moon.png`}
                      alt="Half Phase"
                    />
                  </span>
                </div>
              </div>
            </div>
            <table className="table-auto text-base md:text-sm lg:text-base whitespace-nowrap">
              {en.moon_infos.map((_, index) => (
                <tr key={index}>
                  <td>{t(`moon_infos.${index}`)}</td>
                  <td>&nbsp;:&nbsp;</td>
                  <td>{state.moonInfos[index]}</td>
                </tr>
              ))}
            </table>
          </div>
        </section>
      );
    }}
  </HomePageConsumer>
)

export default CalendarSection