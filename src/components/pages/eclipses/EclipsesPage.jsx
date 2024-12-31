import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"

const EclipsesPage = ({ t, isSidebarExpanded }) => (
  <div className="eclipses-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('app_name') + ' | ' + t('pages.3')}</title>
      <meta name="description" content={t('about_desc')} />
    </Helmet>
    <HeaderContainer/>
    <MainContainer t={t} isSidebarExpanded={isSidebarExpanded}/>
  </div>
)

export default EclipsesPage