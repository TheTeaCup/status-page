import Head from "next/head";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../../../utils/sessionSettings";
import csrf from "../../../../utils/csrf";
import AdminNavbar from "../../../../components/admin-nav";
import {useEffect, useState} from "react";
import {Box, chakra, useToast} from "@chakra-ui/react";
import {useRouter} from "next/router";
import fetchJson from "../../../../utils/fetchJson";
import Page from "../../../../components/dash/page";

export default function App_Admin_Pages({user}) {
    const [pages, setPages] = useState([]);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                let fetchAllPages = await fetchJson('/api/admin/pages', {
                    headers: {
                        'Authorization': user.token || null,
                    },
                });

                if (fetchAllPages.error) {
                    toast({
                        title: 'API Error',
                        description: `${fetchAllPages.message || 'Unknown Error'}`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    if (fetchAllPages.pages) {
                        setPages(fetchAllPages.pages)
                    } else {
                        setPages(null)
                        toast({
                            title: 'API Error',
                            description: "No pages were detected...",
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
                {pages ? (
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
                                        return <Page key={page.id} data={page} admin={true}/>
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
                            No Status Pages Found
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