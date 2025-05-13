import React from "react"
import { HomePageConsumer } from "../contexts/HomPageContext"

const FooterContainer = () => (
	<HomePageConsumer>
		{({ t }) => (
			<footer className="app-footer lg:fixed grid items-end justify-center bottom-0 w-full p-3 bg-green-500 dark:bg-green-700 shadow-xl">
				<h4 className="font-serif text-white text-center text-xs md:text-sm">{t('demo_info')}</h4>
			</footer>
		)}
	</HomePageConsumer>
)

export default FooterContainer