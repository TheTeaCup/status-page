import Navbar from "../../../../components/nav";
import {Box, Flex, Grid} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";

export default function App_Monitor_ID({user, monitorInfo}) {
    console.log(monitorInfo)

    return (
        <>
            <Head>
                <title>Tea Status - App</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


            <Box p={4}>Monitor View</Box>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res, query}) {
    const user = req.session.user;

    await csrf(req, res);

    if (user === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    } else {
        try {
            const protocol = req.headers['x-forwarded-proto'] || 'http'
            const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
            let id = query.id || '1';
            let monitorInfo = await fetch(baseUrl + `/api/monitor/${id}`, {
                headers: {
                    'Authorization': user.token || null,
                },
            }).then(res => res.json());
           // console.log(monitorInfo);
            if (monitorInfo.monitor) {
                monitorInfo = monitorInfo.monitor
            } else monitorInfo = null;

            return {
                props: {user: req.session.user, csrfToken: req.csrfToken(), monitorInfo: monitorInfo}
            };

        } catch (e) {
            console.log(e)
            return {
                props: {user: req.session.user, csrfToken: req.csrfToken(), monitorInfo: null}
            };
        }

    }
}, sessionOptions)