import {Alert, AlertIcon, ChakraProvider} from '@chakra-ui/react';
import '../styles/globals.css'
import theme from "../utils/theme";
import {useEffect, useState} from "react";
import fetchJson from "../utils/fetchJson";
import NProgress from 'nprogress';
import {debounce} from 'lodash';
import RouterEvents from "../utils/router-events";

const start = debounce(NProgress.start, 100);
RouterEvents.on('routeChangeStart', start);
RouterEvents.on('routeChangeComplete', (url) => {
    console.log(`Changed to URL: ${url}`);
    start.cancel();
    NProgress.done();
});
RouterEvents.on('routeChangeError', () => {
    start.cancel();
    NProgress.done();
});

function MyApp({Component, pageProps}) {

    const [databaseError, setDatabaseError] = useState(false);
    useEffect(() => {
        (async () => {
            let dbCheck = await fetchJson('/api/db-ping');
            if (dbCheck.error) {
                console.log(dbCheck);
                console.log(dbCheck.message)
                setDatabaseError(true)
            }
        })()
    }, [])


    return (
        <ChakraProvider theme={theme}>
            {databaseError && <Alert position={'fixed'} variant='solid' status='error'>
                <AlertIcon/>
                This site is unable to connect to its database.
            </Alert>
            }
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp