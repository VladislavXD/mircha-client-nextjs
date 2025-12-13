'use client'

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import React from "react"

interface ReCaptchaProviderProps {
	children: React.ReactNode
}


const ReCapchaProvider: React.FC<ReCaptchaProviderProps> = ({ children }) => {
	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.RECAPTCHA_SITE_KEY || ""}
			language="en"
			// scriptProps={{
			// 	async: true,
			// 	defer: true,
			// 	appendTo: "head",
			// 	nonce: undefined,
			// }}
		>
			{children}
		</GoogleReCaptchaProvider>
	)
}

export default ReCapchaProvider
