import React from "react"

const CustomNextArrow = props => {
  const { className, style, onClick, t } = props
  return (
    <div
      title={t('next_month')}
      className={className}
      style={{ ...style, display: "relative", height: "100%" }}
      onClick={onClick}
    >
      <span className="absolute right-0 -left-1 inset-y-0 flex items-center justify-center h-full bg-gradient-to-l from-green-300 to-green-100 dark:from-gray-400 dark:to-gray-700 rounded-md duration-300">
        <img className="object-contain object-center invert dark:invert-0 hover:brightness-75 duration-200" src="images/arrow-icon.svg" alt="Next" />
      </span>
    </div>
  )
}

export default CustomNextArrow