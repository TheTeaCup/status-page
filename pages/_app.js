import "../styles/globals.css";
import Script from "next/script";

export default function App({Component, pageProps}) {
    return (
        <>
            <Script async defer data-website-id="59330be7-f6ad-4697-a9a2-6800108ae8f5"
                    src="https://analytics.theteacup.dev/script.js"></Script>
            <Component {...pageProps} />
        </>
        )
}
