import Navbar from "../../../components/nav";
import {Box, chakra} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import Monitor from "../../../components/dash/monitor";
import {useEffect, useState} from "react";
import fetchJson from "../../../utils/fetchJson";

export default function App_Monitors_Home({user}) {
    const [monitors, setMonitors] = useState(user?.monitors || []);

    useEffect(() => {
        (async () => {
            let userCheck = await fetchJson('/api/user/' + user.email, {
                "headers": {
                    "Authorization": user.token
                }
            });
            if (userCheck.user) {
                if (userCheck.user.monitors) {
                    setMonitors(userCheck.user.monitors)
                }
            }
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Tea Status - App Monitors List</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


            <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
                {monitors.length > 0 ? (
                    <>
                        <chakra.h1
                            textAlign={'center'}
                            fontSize={'4xl'}
                            py={10}
                            fontWeight={'bold'}>
                            All Monitors
                        </chakra.h1>

                        {monitors && (
                            <>
                                <center>
                                    {monitors.map(monitor => {
                                        return <Monitor key={monitor.id} data={monitor}/>
                                    })}
                                </center>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <chakra.h1
                            textAlign={'center'}
                            fontSize={'4xl'}
                            py={10}
                            fontWeight={'bold'}>
                            Create a Monitor using the Add button!
                        </chakra.h1>
                    </>
                )}
            </Box>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({req, res}) {
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
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)