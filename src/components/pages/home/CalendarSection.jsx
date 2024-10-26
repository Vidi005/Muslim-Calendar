import React from "react"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext";

const CalendarSection = ({ sliderRef, goToCurrentMonth }) => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="calendar-section flex flex-wrap md:flex-nowrap max-w-full">
        <div className="w-full md:w-2/3 lg:w-3/4 px-7">
          <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('calendar')}</h1>
          <button className="flex items-center mx-auto my-2 px-3 py-1 text-lg text-white bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-lg duration-200 shadow-lg dark:shadow-white/50" onClick={goToCurrentMonth}>{t('current_month')}</button>
          <Slider arrows dots infinite={false} speed={500} slidesToShow={1} slidesToScroll={1} ref={sliderRef} initialSlide={state.formattedDateTime.getMonth()}>
            {state.monthsInSetYear.map((days, monthIndex) => (
              <React.Fragment key={monthIndex}>
                <h2 className="m-2 text-center text-green-700 dark:text-white duration-200">{new Date(state.formattedDateTime.getFullYear(), monthIndex).toLocaleString(state.selectedLanguage, { month: 'long', year: 'numeric' })}</h2>
                <h3 className="text-base sm:text-lg text-center text-green-500 dark:text-gray-200 duration-200">{`${new Date(state.formattedDateTime.getFullYear(), monthIndex, 0).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'long', year: 'numeric' })} - ${new Date(state.formattedDateTime.getFullYear(), monthIndex, days.length - 1).toLocaleString(state.selectedLanguage, { calendar: "islamic", month: 'long', year: 'numeric' })}`}</h3>
                <table className="table-fixed w-full text-green-900 dark:text-gray-200 text-sm md:text-base lg:text-lg duration-200">
                  <thead>
                    <tr>
                      {en.day_names.map((_day, index) => {
                        if (innerWidth > 1024) {
                          return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`)}</th>
                        } else {
                          return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`).slice(0, 3)}</th>
                        }
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                        <tr key={weekIndex}>
                          {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                            if (isNaN(day?.gregorian)) {
                              return (
                                <td key={dayIndex} className="border-none border-transparent text-center">
                                  {day ? (
                                    <React.Fragment>
                                      <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.gregorian}</span>
                                      <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.hijri}</span>
                                    </React.Fragment>
                                  ) : null}
                                </td>
                              )
                            } else {
                              return (
                                <td key={dayIndex} className={`${dayIndex === 0 ? "dark:bg-red-500" : ""} ${dayIndex === 5 ? "dark:bg-green-500" : ""} border border-green-700 dark:border-gray-200 p-2 text-center`}>
                                  {day ? (
                                    <React.Fragment>
                                      <span className={`${dayIndex === 0 ? "text-red-700" : "text-green-900"} ${dayIndex === 5 ? "text-green-400" : "text-green-700"} block dark:text-white font-bold text-lg md:text-xl lg:text-2xl`} dangerouslySetInnerHTML={{ __html: day.gregorian}}></span>
                                      <span className={`${dayIndex === 0 ? "text-red-500" : "text-green-700"} ${dayIndex === 5 ? "text-green-700/50" : "text-green-500"} block dark:text-gray-200 text-sm md:text-base lg:text-lg`} dangerouslySetInnerHTML={{ __html: day.hijri }}></span>
                                    </React.Fragment>
                                  ) : null}
                                </td>
                              )
                            }
                          })}
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </React.Fragment>
            ))}
          </Slider>
        </div>
        <div className="flex flex-col items-center w-full md:w-1/3 lg:w-1/4 text-green-700 dark:text-gray-200 duration-200">
          <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_info')}</h1>
          <img className="w-full object-contain object-center" src={`${import.meta.env.BASE_URL}images/moon.png`} alt="Moon Phase" />
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
    )}
  </HomePageConsumer>
)

export default CalendarSection