import Navbar from "../../components/nav";
import {Box} from "@chakra-ui/react";
import Head from "next/head";

export default function App_Home() {
    return (
        <>
            <Head>
                <title>Tea Status - App</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar/>


            <Box p={4}>App Home</Box>
        </>
    )
}
