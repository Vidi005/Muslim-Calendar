import React from "react"

const CustomPrevArrow = props => {
  const { className, style, onClick } = props
  return (
    <div
      title="Previous Month"
      className={className}
      style={{ ...style, display: "relative", height: "100%" }}
      onClick={onClick}
    >
      <span className="absolute left-0 -right-2 inset-y-0 flex items-center justify-center h-full bg-gradient-to-r from-green-300 to-green-100 dark:from-gray-400 dark:to-gray-700 rounded-md duration-300">
        <img className="scale-x-[-1] pl-1 object-contain object-center invert dark:invert-0 hover:brightness-75 duration-200" src="images/arrow-icon.svg" alt="Previous" />
      </span>
    </div>
  )
}

export default CustomPrevArrow