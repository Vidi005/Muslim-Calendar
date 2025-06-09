import React from "react"
import { Helmet } from "react-helmet"
import MainContainer from "./MainContainer"
import HeaderContainer from "../Header"
import FooterContainer from "../Footer"

const AboutPage = ({ t, isSidebarExpanded }) => (
  <div className="about-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('app_name') + ' | ' + t('pages.4')}</title>
    </Helmet>
    <HeaderContainer/>
    <MainContainer t={t} isSidebarExpanded={isSidebarExpanded}/>
    {innerWidth >= 1280 && <FooterContainer/>}
  </div>
)

export default AboutPage