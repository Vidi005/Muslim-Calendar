import React from "react"

const HomePageContext = React.createContext()

export const HomePageProvider = HomePageContext.Provider
export const HomePageConsumer = HomePageContext.Consumer

export default HomePageContext