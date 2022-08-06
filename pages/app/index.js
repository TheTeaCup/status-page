import Navbar from "../../components/nav";
import {Box, chakra, SimpleGrid} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../utils/sessionSettings";
import csrf from "../../utils/csrf";
import StatsCard from "../../components/dash/statCard";
import {useEffect, useState} from "react";
import fetchJson from "../../utils/fetchJson";
import {useRouter} from "next/router";

export default function App_Home({user, version}) {
    const [monitors, setMonitors] = useState(user?.monitors || []);
    const [statuses, setStatuses] = useState({
        online: 0,
        offline: 0,
        unknown: 0,
        paused: 0
    });
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let userCheck = await fetchJson('/api/auth/check');
            if (userCheck.user) {
                let uVersion = userCheck.user.version;
                if (!uVersion === version) {
                    router.push('/app/logout');
                }
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            let userMonitorStatusesCheck = await fetchJson('/api/user/' + user.email + "/monitor-statuses", {
                "headers": {
                    "Authorization": user.token
                }
            });

            console.log(userMonitorStatusesCheck);
            if (userMonitorStatusesCheck.data) {
                setStatuses(userMonitorStatusesCheck.data)
            }

        })()
    }, []);

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


            <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
                <chakra.h1
                    textAlign={'center'}
                    fontSize={'4xl'}
                    py={10}
                    fontWeight={'bold'}>
                    Quick Stats
                </chakra.h1>
                <SimpleGrid columns={{base: 1, md: 4}} spacing={{base: 2, lg: 5}}>
                    <StatsCard
                        title={'Up'}
                        stat={statuses?.online || 0}
                        icon={
                            <Box
                                as="div"
                                h="24px"
                                w="24px"
                                position="relative"
                                bgColor={'green.500'}
                                borderRadius="50%"
                            />
                        }
                    />
                    <StatsCard
                        title={'Down'}
                        stat={statuses?.offline || 0}
                        icon={
                            <Box
                                as="div"
                                h="24px"
                                w="24px"
                                position="relative"
                                bgColor={'red.400'}
                                borderRadius="50%"
                            />
                        }
                    />
                    <StatsCard
                        title={'Unknown'}
                        stat={statuses?.unknown || 0}
                        icon={
                            <Box
                                as="div"
                                h="24px"
                                w="24px"
                                position="relative"
                                bgColor={'gray.400'}
                                borderRadius="50%"
                            />
                        }
                    />
                    <StatsCard
                        title={'Paused'}
                        stat={statuses?.paused || 0}
                        icon={
                            <Box
                                as="div"
                                h="24px"
                                w="24px"
                                position="relative"
                                bgColor={'gray.400'}
                                borderRadius="50%"
                            />
                        }
                    />
                </SimpleGrid>
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