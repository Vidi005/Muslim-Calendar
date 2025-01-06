import React from "react"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext";
import CustomNextArrow from "./CustomNextArrow";
import CustomPrevArrow from "./CustomPrevArrow";

const CalendarSection = ({ sliderRef, calendarContainerRef, tooltipRef, showTooltip, hideTooltip, goToCurrentMonth, jumpToClickedMonth }) => (
  <HomePageConsumer>
    {({ t, state }) => {
      const settings = {
        arrows: true,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: state.formattedDateTime.getMonth(),
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
      }
      const isWaxing = parseFloat(state.moonInfos[2]) <= 180
      const isCrescent = parseFloat(state.moonInfos[1]) <= 50
      const ellipse1 = isCrescent
        ? `ellipse(${50 - parseFloat(state.moonInfos[1])}% 50% at 0% 50%)`
        : `ellipse(0% 50% at 0% 50%)`
      const ellipse2 = !isCrescent
        ? `ellipse(${parseFloat(state.moonInfos[1]) - 50}% 50% at 100% 50%)`
        : `ellipse(0% 50% at 100% 50%)`
      return (
        <section className="calendar-section flex flex-wrap md:flex-nowrap max-w-full">
          <div className="w-full md:w-2/3 lg:w-3/4 px-7 overflow-hidden">
            <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('calendar')}</h1>
            <button className="flex items-center mx-auto my-2 px-3 py-1 text-lg text-white bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-600 active:bg-green-700 dark:active:bg-green-900 rounded-lg duration-200 shadow-lg dark:shadow-white/50" onClick={goToCurrentMonth}>{state.inputDate !== '' && state.inputTime !=='' && state.formattedDateTime instanceof Date ? t('set_month') : t('current_month')}</button>
            {state.isCalendarLoading
              ? (
                <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
                  <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
                  <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('calendar_loading')}</span>
                </div>
                )
              : (
                <React.Fragment>

                  <Slider {...settings} ref={sliderRef}>
                    {state.monthsInSetYear.map((days, monthIndex) => {
                      const hijriMonth1 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, 1).toLocaleString(state.selectedLanguage || 'en', { calendar: "islamic", month: 'numeric' }))
                      const hijriMonth2 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, new Date(state.formattedDateTime.getFullYear(), monthIndex + 1, 0).getDate()).toLocaleString(state.selectedLanguage || 'en', { calendar: "islamic", month: 'numeric' }))
                      const hijriYear1 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, 1).toLocaleString(state.selectedLanguage || 'en', { calendar: 'islamic', year: 'numeric' }))
                      const hijriYear2 = parseInt(new Date(state.formattedDateTime.getFullYear(), monthIndex, new Date(state.formattedDateTime.getFullYear(), monthIndex + 1, 0).getDate()).toLocaleString(state.selectedLanguage || 'en', { calendar: 'islamic', year: 'numeric' }))
                      return (
                        <React.Fragment key={monthIndex}>
                          <h2 className="m-2 text-center text-green-700 dark:text-white duration-200 animate__animated animate__fadeInUp md:animate__fadeInLeft">{new Date(state.formattedDateTime.getFullYear(), monthIndex).toLocaleString(state.selectedLanguage || 'en', { month: 'long', year: 'numeric' })}</h2>
                          <h4 className={`text-sm sm:text-base md:text-lg text-center text-green-500 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp md:animate__fadeInLeft`}>
                            <span className={`${hijriMonth1 === 9 ? "text-yellow-500 dark:text-yellow-300" : ""}`}>{t(`islamic_months.${hijriMonth1 - 1}`)} {hijriYear1} {t('hijri_abbreviation')}</span> - <span className={`${hijriMonth2 === 9 ? "text-yellow-500 dark:text-yellow-300" : ""}`}>{t(`islamic_months.${hijriMonth2 - 1}`)} {hijriYear2} {t('hijri_abbreviation')}</span>
                          </h4>
                          <table className="table-fixed w-full text-green-900 dark:text-gray-200 text-sm md:text-base lg:text-lg duration-200 animate__animated animate__fadeInUp md:animate__fadeInLeft">
                            <thead>
                              <tr>
                                {en.day_names.map((_day, index) => {
                                  if (innerWidth > 1024) {
                                    return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-600 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`)}</th>;
                                  } else {
                                    return <th className={`${index === 0 ? "text-red-700 dark:bg-red-500 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""} ${index === 5 ? "text-green-400 dark:bg-green-600 dark:text-gray-200 dark:rounded-md md:dark:rounded-lg" : ""}`} key={index}>{t(`day_names.${index}`).slice(0, 3)}</th>;
                                  }
                                })}
                              </tr>
                            </thead>
                            <tbody ref={calendarContainerRef}>
                              {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                                <tr key={weekIndex}>
                                  {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                                    if (isNaN(day?.gregorian)) {
                                      return (
                                        <td key={dayIndex} onMouseLeave={hideTooltip} className="border-none border-transparent border-spacing-0 text-center whitespace-nowrap">
                                          {day ? (
                                            <React.Fragment>
                                              <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.gregorian}</span>
                                              <span className="block text-transparent font-bold text-lg md:text-xl lg:text-2xl">{day.hijri}</span>
                                            </React.Fragment>
                                          ) : null}
                                        </td>
                                      )
                                    } else {
                                      const isCurrentDate = state.formattedDateTime.getDate() === day.gregorian && state.formattedDateTime.getMonth() === monthIndex
                                      const muslimEvent = state.hijriEventDates.find(event => event.gregorianDate.getDate() === day.gregorian && event.gregorianDate.getMonth() === monthIndex)
                                      const isMuslimEvent = !!muslimEvent
                                      if (isMuslimEvent) {
                                        return (
                                          <td className={`bg-sky-500/20 dark:bg-sky-600 ${isCurrentDate ? "border-4 border-double border-sky-900 dark:border-white" : "border border-green-700 dark:border-gray-200"} rounded`} onMouseEnter={e => showTooltip(e)} key={dayIndex}>
                                            {day ? (
                                              <div ref={tooltipRef} className={`${muslimEvent.eventId} p-2 text-center whitespace-nowrap`}>
                                                <span className={`${muslimEvent.eventId} block text-sky-700 dark:text-white font-bold text-lg md:text-xl lg:text-2xl`}>{day.gregorian}</span>
                                                <span className={`${muslimEvent.eventId} block text-sky-500 dark:text-gray-200 text-sm md:text-base lg:text-lg`}>{day.hijri}</span>
                                              </div>
                                            ) : null}
                                            {state.tooltipId === muslimEvent.eventId  && (
                                              <span ref={tooltipRef} className="absolute bg-sky-500/50 p-2 text-green-900 dark:text-white backdrop-blur-sm bg-opacity-25 rounded shadow-md dark:shadow-white/50 animate__animated animate__fadeIn animate__faster z-10">{t(`muslim_events.${state.tooltipId}`)}</span>
                                            )}
                                          </td>
                                        )
                                      } else {
                                        return (
                                          <td key={dayIndex} onMouseLeave={hideTooltip} className={`${dayIndex === 0 ? "bg-red-500/20 dark:bg-red-500" : ""} ${dayIndex === 5 ? "bg-green-500/20 dark:bg-green-600" : ""} ${isCurrentDate ? "border-4 border-double border-green-900 dark:border-white" : "border border-green-700 dark:border-gray-200"} p-2 text-center whitespace-nowrap`}>
                                            {day ? (
                                              <React.Fragment>
                                                <span className={`${dayIndex === 0 ? "text-red-700" : "text-green-900"} ${dayIndex === 5 ? "text-green-400" : "text-green-700"} block dark:text-white font-bold text-lg md:text-xl lg:text-2xl`}>{day.gregorian}</span>
                                                <span className={`${dayIndex === 0 ? "text-red-500" : "text-green-700"} ${dayIndex === 5 ? "text-green-700/50" : "text-green-500"} block dark:text-gray-200 text-sm md:text-base lg:text-lg`}>{day.hijri}</span>
                                              </React.Fragment>
                                            ) : null}
                                          </td>
                                        )
                                      }
                                    }
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </React.Fragment>
                      )
                    })}
                  </Slider>
                  <ul className="flex flex-nowrap items-center justify-center list-none mx-auto py-4 space-x-1 md:space-x-2 lg:space-x-4 animate__animated animate__fadeInUp md:animate__fadeInLeft">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <li key={i} title={`Jump to ${new Date(state.formattedDateTime.getFullYear(), i).toLocaleString(state.selectedLanguage || 'en', { month: 'long' })}`} className="grid items-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-700 to-green-500 dark:from-gray-100 dark:to-gray-300 hover:bg-green-400 dark:hover:bg-gray-400 p-1 text-center text-sm md:text-base lg:text-lg text-white dark:text-black cursor-pointer rounded-full shadow dark:shadow-white duration-200" onClick={() => jumpToClickedMonth(i)}><b>{i + 1}</b></li>
                    ))}
                  </ul>
                </React.Fragment>
                )
            }
            {state.isCalendarLoading
              ? (
                <div className="flex items-center justify-center space-x-2 p-2 md:p-4">
                  <span className="w-5 h-5 md:w-6 md:h-6 aspect-square border-t-2 border-r-2 border-t-green-700 dark:border-t-gray-200 border-r-green-700 dark:border-r-gray-200 rounded-full bg-transparent animate-spin"></span>
                  <span className="text-center text-green-700 dark:text-gray-200 text-base md:text-lg lg:text-xl">{t('event_list_loading')}</span>
                </div>
                )
              : (
                <table className="table-auto text-sky-700 dark:text-sky-200 animate__animated animate__fadeInLeft">
                  <th colSpan={3}><h3 className="whitespace-nowrap font-serif text-base text-justify sm:text-lg md:text-xl"><u>{t('muslim_holidays')} {state.formattedDateTime.getFullYear()} :</u></h3></th>
                  <tbody className="list-disc text-sm sm:text-base md:text-lg align-top">
                    {state.hijriEventDates.sort((a, b) => a.gregorianDate - b.gregorianDate).map((event, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap">{event.gregorianDate.toLocaleDateString(state.selectedLanguage || 'en', { month: 'long', day: '2-digit' })}</td>
                        <td>&nbsp;:&nbsp;</td>
                        <td>
                          <span>{t(`muslim_events.${event.eventId}`)} </span>
                          <span className="whitespace-nowrap">({event.hijriDate.day} {t(`islamic_months.${event.hijriDate.month - 1}`)} {parseInt(event.hijriDate.year)} {t('hijri_abbreviation')})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )
            }
          </div>
          <div className="flex flex-col items-center w-full md:w-1/3 lg:w-1/4 text-green-700 dark:text-gray-200 duration-200 animate__animated animate__fadeInUp">
            <h1 className="m-4 text-center text-green-900 dark:text-white duration-200">{t('moon_info')}</h1>
            {state.inputDate !== '' && state.inputTime !=='' && state.formattedDateTime instanceof Date
              ? <h5 className="text-center text-green-700 dark:text-gray-200 duration-200">{t('set_moon_info')} {state.formattedDateTime.toLocaleString(state.selectedLanguage || 'en', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23', timeZone: state.selectedTimeZone, timeZoneName: 'short' }).replace(/\./g, ':')}</h5>
              : null
            }
            <div className="moon-phase w-full p-4 overflow-hidden">
              <div className="moon-phase relative w-full rounded-full overflow-hidden drop-shadow duration-500" style={{ transform: `rotate(${parseFloat(state.moonInfos[state.moonInfos.length - 1])}deg)` }}>
                <img className="w-full object-contain object-center brightness-125" src={`${import.meta.env.BASE_URL}images/moon.png`} alt="Moon Phase" />
                <div className={`${isWaxing ? "rotate-0" : "rotate-180"} absolute inset-0`}>
                  <span className="absolute top-0 left-0 w-1/2 h-full border-none border-transparent border-spacing-0 bg-black/75 drop-shadow"></span>
                  <span
                    className="absolute inset-0 translate-x-1/2 bg-black/75 border-none border-transparent border-spacing-0 duration-500"
                    style={{ clipPath: ellipse1 }}
                  ></span>
                  <span
                    className="absolute inset-0 -translate-x-1/2 border-none border-transparent border-spacing-0 duration-500"
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
            <table className="table-auto text-base md:text-sm lg:text-base text-black dark:text-gray-200">
              {en.moon_infos.map((_, index) => (
                <tr className="align-top" key={index}>
                  <td className="whitespace-nowrap">{t(`moon_infos.${index}`)}</td>
                  <td>&nbsp;:&nbsp;</td>
                  <td>{state.areMoonInfosLoading ? t("loading") : state.moonInfos[index]}</td>
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