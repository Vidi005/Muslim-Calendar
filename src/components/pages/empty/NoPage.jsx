import React from "react"

const NoPage = ({ t }) => (
  <React.Fragment>
    <main className="no-page-main h-screen flex flex-col items-center justify-center bg-green-100 dark:bg-gray-900 p-8 dark:text-white">
      <article className="animate__animated animate__fadeInUpBig font-serif text-green-900 dark:text-green-100 text-center">
        <h1 className="text-7xl leading-snug"><strong>404</strong></h1>
        <h3>{t('not_found')}</h3>
        <br />
        <p>{t('page_not_found')}</p>
        <br />
        <a className="border border-green-700 bg-green-700 hover:bg-green-500 hover:dark:bg-green-300 dark:bg-green-500 active:bg-green-700 dark:active:bg-green-800 px-4 py-3 text-white dark:text-green-900 duration-200 rounded-lg shadow-lg dark:shadow-white/50" href="/">{t('back_to_home')}</a>
      </article>
    </main>
    <footer className="fixed bottom-0 w-full p-2 md:p-3 bg-green-700 text-center text-white text-lg md:text-xl font-bold font-serif">Muslim Calendar</footer>
  </React.Fragment>
)

export default NoPage