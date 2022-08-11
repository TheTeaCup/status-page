import Navbar from "../../../components/nav";
import {Box, chakra, SimpleGrid} from "@chakra-ui/react";
import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../utils/sessionSettings";
import csrf from "../../../utils/csrf";
import {useEffect, useState} from "react";
import fetchJson from "../../../utils/fetchJson";
import Monitor from "../../../components/dash/monitor";
import Link from "next/link";
import Page from "../../../components/dash/page";

export default function App_Pages_Home({user}) {
    const [pages, setPages] = useState(user?.pages || []);

    useEffect(() => {
        (async () => {
            let userCheck = await fetchJson('/api/user/' + user.email, {
                "headers": {
                    "Authorization": user.token
                }
            });
            if (userCheck.user) {
                if (userCheck.user.pages) {
                    setPages(userCheck.user.pages)
                }
            }
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Tea Status - App Pages List</title>
                <meta property="og:title" content={'Tea Status - App'} key="title"/>
                <meta property="og:url" content={'https://statuspage.theteacup.dev'}/>
                <meta property="og:description" content={'Custom built status page by Tea Cup'}/>
                <meta name="description" content={'Custom built status page by Tea Cup'}/>
            </Head>

            <Navbar user={user}/>


            <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
                {pages.length > 0 ? (
                    <>
                        <chakra.h1
                            textAlign={'center'}
                            fontSize={'4xl'}
                            py={10}
                            fontWeight={'bold'}>
                            All Status Pages
                        </chakra.h1>

                        {pages && (
                            <>
                                    <center>
                                        {pages.map(page => {
                                            return <Page key={page.id} data={page}/>
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
                            Create a Status Page using the Add button!
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