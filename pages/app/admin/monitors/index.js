import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";
import AdminNavbar from "../../../../components/admin-nav";
import {useEffect, useState} from "react";
import {Box, chakra, useToast} from "@chakra-ui/react";
import {useRouter} from "next/router";
import fetchJson from "../../../../utils/fetchJson";
import Monitor from "../../../../components/dash/monitor";

export default function App_Admin_Monitors({user}) {
    const [monitors, setMonitors] = useState([]);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                let fetchAllMonitors = await fetchJson('/api/admin/monitors', {
                    headers: {
                        'Authorization': user.token || null,
                    },
                });

                if (fetchAllMonitors.error) {
                    toast({
                        title: 'API Error',
                        description: `${fetchAllMonitors.message || 'Unknown Error'}`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    if (fetchAllMonitors.monitors) {
                        setMonitors(fetchAllMonitors.monitors)
                    } else {
                        setMonitors(null)
                        toast({
                            title: 'API Error',
                            description: "No monitors were detected...",
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                }
            } catch (e) {
                console.log(e)
                toast({
                    title: 'API Error',
                    description: "Unknown Error, Check logs",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        })()
    }, [user.token])

    return (
        <>
            <Head>
                <title>Tea Status - Administration Panel</title>
                <meta property="og:title" content={'Tea Status - Administration Panel'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <AdminNavbar user={user}/>


            <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
                {monitors ? (
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
                                        return <Monitor key={monitor.id} data={monitor} auth={user.token} admin={true}/>
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
                            No Monitors Found
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
        if (!user.admin) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        return {
            props: {user: req.session.user, csrfToken: req.csrfToken()}
        };
    }
}, sessionOptions)