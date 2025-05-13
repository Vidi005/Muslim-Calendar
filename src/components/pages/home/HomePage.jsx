import React from "react"
import { Helmet } from "react-helmet"
import HeaderContainer from "../Header"
import MainContainer from "./MainContainer"
import FooterContainer from "../Footer"

const HomePage = ({ t, isSidebarExpanded, sliderRef, calendarContainerRef, tooltipRef, showTooltip, hideTooltip, goToCurrentMonth, jumpToClickedMonth }) => (
  <div className="home-page h-screen w-full flex flex-col animate__animated animate__fadeIn">
    <Helmet>
      <title>{t('app_name') + ' | ' + t('pages.0')}</title>
      <meta name="description" content={t('app_desc')} />
    </Helmet>
    <HeaderContainer />
    <MainContainer
      t={t}
      isSidebarExpanded={isSidebarExpanded}
      sliderRef={sliderRef}
      calendarContainerRef={calendarContainerRef}
      tooltipRef={tooltipRef}
      showTooltip={showTooltip}
      hideTooltip={hideTooltip}
      goToCurrentMonth={goToCurrentMonth}
      jumpToClickedMonth={jumpToClickedMonth}
    />
    {innerWidth > 1024 && <FooterContainer/>}
  </div>
)

export default HomePage