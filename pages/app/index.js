import Navbar from "../../components/nav";
import {Box, chakra, SimpleGrid} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../utils/sessionSettings";
import csrf from "../../utils/csrf";
import StatsCard from "../../components/dash/statCard";

export default function App_Home({user}) {

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
                <SimpleGrid columns={{base: 1, md: 3}} spacing={{base: 5, lg: 8}}>
                    <StatsCard
                        title={'Up'}
                        stat={'0'}
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
                        stat={'0'}
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
                        title={'Paused'}
                        stat={'0'}
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