import {Box, chakra, SimpleGrid} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import AdminNavbar from "../../../components/admin-nav";
import StatsCard from "../../../components/dash/statCard";
import {BsPerson} from 'react-icons/bs';
import {FiServer} from 'react-icons/fi';
import {RiPagesLine} from "react-icons/ri";
import {MdSystemUpdateAlt} from "react-icons/md"
import {useRouter} from "next/router";
import {useEffect} from "react";
import fetchJson from "../../../utils/fetchJson";

export default function App_Admin_Home({user, stats, version}) {
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
                <chakra.h1
                    textAlign={'center'}
                    fontSize={'4xl'}
                    py={10}
                    fontWeight={'bold'}>
                    Quick Stats
                </chakra.h1>
                <SimpleGrid columns={{base: 1, md: 4}} spacing={{base: 5, lg: 8}}>
                    <StatsCard
                        title={'Monitors'}
                        stat={stats?.monitors || "0"}
                        icon={
                            <FiServer size={'3em'}/>
                        }
                    />
                    <StatsCard
                        title={'Users'}
                        stat={stats?.users || "0"}
                        icon={
                            <BsPerson size={'3em'}/>
                        }
                    />
                    <StatsCard
                        title={'Pages'}
                        stat={stats?.pages || "0"}
                        icon={
                            <RiPagesLine size={'3em'}/>
                        }
                    />
                    <StatsCard
                        title={'Version'}
                        stat={stats?.version || "0.0.0"}
                        icon={
                            <MdSystemUpdateAlt size={'3em'}/>
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
        if (!user.admin) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        // fetch stats
        try {
            const protocol = req.headers['x-forwarded-proto'] || 'http'
            const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
            let stats = await fetch(baseUrl + "/api/admin/stats", {
                headers: {
                    'Authorization': user.token || null,
                },
            }).then(res => res.json());
            if (stats.stats) {
                stats = stats.stats
            } else stats = {}

            return {
                props: {
                    user: req.session.user, csrfToken: req.csrfToken(), stats: stats
                }
            };
        } catch (e) {
            return {
                props: {user: req.session.user, csrfToken: req.csrfToken(), stats: {}}
            };
        }
    }
}, sessionOptions)