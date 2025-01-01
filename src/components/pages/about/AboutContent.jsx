import React from "react"
import en from "../../../locales/en.json"

const AboutContent = ({ t }) => (
  <article className="about-content grow p-4 lg:p-8 text-green-900 dark:text-green-100 text-center duration-200 overflow-y-auto animate__animated animate__fadeInUpBig">
    <section className="mb-4">
      <h2 className="font-serif text-center text-green-900 dark:text-white">{t('app_name')}</h2>
      <h5 className="my-4 text-center text-gray-700 dark:text-gray-200">{t('version')}</h5>
      <p className="text-sm lg:text-base 2xl:text-lg text-justify text-black dark:text-gray-100">{t('about')}</p>
    </section>
    <section className="my-4 text-left">
      <h3 className="text-green-700 dark:text-gray-50">{t('resources')}</h3>
      <hr className="border border-green-700 dark:border-white" />
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0.5 md:gap-1 list-inside list-disc text-sm lg:text-base 2xl:text-lg text-blue-500 dark:text-blue-400 underline">
        {en.resource_items.map((_item, index) => (
          <li key={index} className="w-full sm:w-auto p-1 hover:text-blue-700 dark:hover:text-blue-300 active:text-purple-700 dark:active:text-purple-500"><a href={t(`resource_items.${index}.url`)} target="_blank" rel="noopener noreferrer">{t(`resource_items.${index}.name`)}</a></li>
        ))}
      </ul>
    </section>
    <section className="my-4 text-left">
      <h3 className="text-green-700 dark:text-gray-50">{t('references')}</h3>
      <hr className="border border-green-700 dark:border-white" />
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0.5 md:gap-1 list-inside list-disc text-sm lg:text-base 2xl:text-lg text-blue-500 dark:text-blue-400 underline">
        {en.reference_items.map((_item, index) => (
          <li key={index} className="w-full sm:w-auto p-1 hover:text-blue-700 dark:hover:text-blue-300 active:text-purple-700 dark:active:text-purple-500"><a href={t(`reference_items.${index}.url`)} target="_blank" rel="noopener noreferrer">{t(`reference_items.${index}.name`)}</a></li>
        ))}
      </ul>
    </section>
  </article>
)

export default AboutContent