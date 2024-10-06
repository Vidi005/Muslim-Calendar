import React from "react"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import en from "../../../locales/en.json"
import { HomePageConsumer } from "../../contexts/HomPageContext";

const CalendarSection = ({ sliderRef, goToCurrentMonth }) => (
  <HomePageConsumer>
    {({ t, state }) => (
      <section className="calendar-section max-w-full mx-7">
        <button className="flex items-center mx-auto my-2 px-3 py-1 text-lg text-white bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-900 rounded-lg duration-200 shadow-lg dark:shadow-white/50" onClick={goToCurrentMonth}>{t('current_month')}</button>
        <Slider arrows dots infinite={false} speed={500} slidesToShow={1} slidesToScroll={1} ref={sliderRef} initialSlide={state.currentMonthIndex}>
          {state.months.map((month, index) => (
            <React.Fragment key={index}>
              <h2 className="text-center text-green-700 dark:text-white">{new Date(state.currentYear, index).toLocaleString(state.selectedLanguage, { month: 'long', year: 'numeric' })}</h2>
              <table className="table-fixed w-full text-green-900 dark:text-gray-200 text-sm md:text-base lg:text-lg">
                <thead>
                  <tr>
                    {en.day_names.map((_day, index) => <th key={index}>{t(`day_names.${index}`)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {month.reduce((rows, day, i) => {
                    let cells = rows[rows.length - 1];
                    cells.push(
                      <td key={i} className="border border-green-700 dark:border-gray-200 p-2 text-center">
                        <span className="block text-green-900 dark:text-white font-bold text-lg md:text-xl lg:text-2xl">{new Date(day.gregorian).getDate()}</span>
                        <span className="block text-green-700 dark:text-gray-200 text-sm md:text-base lg:text-lg">{day.hijri}</span>
                      </td>
                    );
                    if ((i + 1) % 7 === 0) rows.push([]);
                    return rows;
                  }, [[]]).map((row, rowIndex) => <tr key={rowIndex}>{row}</tr>)}
                </tbody>
              </table>
            </React.Fragment>
          ))}
        </Slider>
      </section>
    )}
  </HomePageConsumer>
)

export default CalendarSection